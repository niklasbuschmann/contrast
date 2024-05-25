---
title:  "Giải thích và code Vision Transformer from scratch"
mathjax: true
layout: post
categories: media
---


Xin chào các bạn,


Trong bài post này, mình sẽ giới thiệu chi tiết và code from scratch kiến trúc Vision Transformer.


### 1. Giới thiệu 


Sau khi transformer được ra mắt vào năm 2014, nó đã tạo ra một sự đột phá và cách mạng trong lĩnh vực NLP (Natural Language Processing) với tốc độ tính toán và performance cao hơn so với kiến trúc RNN-based trước đó. Ở thời điểm mà transformer ra mắt, mọi người chỉ sử dụng nó cho NLP và không nghĩ nó sẽ được dùng cho ảnh. Alexey Dosovitskiy et al. đã nghiên cứu áp dụng kiến trúc này cho computer vision và publish nó trong paper [_"An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale"_][vision transformer paper].


### 2. Kiến trúc 


Về tổng quan, mô hình Vision transformer thừa hưởng 99% kiến trúc của transformer nguyên bản. Sự khác biệt đến từ việc biến đổi ảnh để nó giống với format text khi ta đưa vào transformer truyền thống.

Alex đã giải quyết vấn đề này bằng cách tách tấm ảnh thành các vùng nhỏ bằng nhau (patches) về kích thước và ghép nó lại thành một chuỗi. Sau bước biến đổi này thì tấm hình của chúng ta đã giống với format của text và việc xử lý các khâu còn lại gần như tương tự như transformer. 

Input của mô hình transformer: 

$$\R^{batch\_size \times \text{sequence\_length} \times \text{embedding\_dimension}}$$

Phép biến đổi input của vision transformer:

$$\R^{Height \times Width \times Channels} => \R^{\text{num\_patches} \times (\text{patch\_size} \times \text{patch\_size} \times \text{channels})}$$



![Image](https://production-media.paperswithcode.com/methods/Screen_Shot_2021-01-26_at_9.43.31_PM_uI4jjMq.png)


### 3. Code It Up

Phần code của Vision Transformer gồm 3 phần chính: Patchifier, Embedding Layer, và khối module chính (transformer).

* **Import các thư viện cần thiết**

```python
import torch
import torch.nn as nn
import numpy as np
```

* **Patchifier**

```python
class PatchExtractor(nn.Module):
    def __init__(self, patch_size = 10):
        super().__init__()
        self.patch_size = patch_size

    def forward(self, input_data):
        batch_size, channels, height, width = input_data.size()
        assert height % self.patch_size == 0 and width % self.patch_size == 0, \
        f"Input height ({height}) and width ({width}) are not divisible by patch_size ({self.patch_size})"

        num_patches_h = height//self.patch_size
        num_patches_w = width//self.patch_size
        num_patches = num_patches_h*num_patches_w

        patches = input_data.unfold(2, self.patch_size, self.patch_size). \
                  unfold(3, self.patch_size, self.patch_size). \
                  permute(0, 2, 3, 1, 4, 5).contiguous().view(batch_size, num_patches, -1)
        
        return patches
```

* **Embedding Layer**

```python
class EmbeddingLayer(nn.Module):
    def __init__(self, latent_size: int = 1024, 
                        num_patches: int = 4, 
                        input_dim: int = 768):
        super().__init__()
        
        self.num_patches = num_patches
        self.pos_embedder = nn.Linear(1, latent_size)
        self.input_embedder = nn.Linear(input_dim, latent_size)
        self.positional_information = torch.arange(0, self.num_patches).\
                                      reshape(1, num_patches, 1).float()

    def forward(self, input):
        N, num_patches, input_dim = input.shape
        input_embedding = self.input_embedder(input)
        positional_embedding = torch.tile(self.positional_information, (N, 1, 1))
        positional_embedding = self.pos_embedder(positional_embedding)
        return positional_embedding + input_embedding
```

Mô hình 
```python
class ViT(nn.Module):
    def __init__(self, patch_size: int = 16, 
                       img_dimension: tuple = (32, 32), 
                       latent_size: int = 1024, 
                       num_heads: int = 1, 
                       num_classes: int = 2):
        super().__init__()
        
        assert img_dimension[0]%patch_size == 0 and \
               img_dimension[1]%patch_size == 0, "Patch size is not divisible by image dimension !!"
        

        self.num_patches_h = img_dimension[0]//patch_size
        self.num_patches_w = img_dimension[1]//patch_size
        self.num_patches = self.num_patches_h * self.num_patches_w

        self.patchifier = PatchExtractor(patch_size)
        self.embedding_layer = EmbeddingLayer(latent_size=latent_size,
                                              num_patches=self.num_patches,
                                              input_dim=patch_size*patch_size*3)
        self.multi_head_attn = nn.MultiheadAttention(embed_dim=latent_size, num_heads=num_heads)
        self.norm_1 = nn.LayerNorm(normalized_shape=latent_size)
        self.norm_2 = nn.LayerNorm(normalized_shape=latent_size)

        self.feed_forward_block = nn.Sequential(nn.Linear(latent_size, latent_size*2), 
                                                nn.Linear(latent_size*2, latent_size))
        
        self.output_layer = nn.Linear(latent_size*self.num_patches, num_classes)
    def forward(self, x):
        x = self.patchifier(x)
        x = self.embedding_layer(x)

        x = self.norm_1(self.multi_head_attn(x, x, x)[0] + x)

        x = self.norm_2(self.feed_forward_block(x) + x)

        x = self.output_layer(x.flatten(start_dim=1))
        return x
```

* **Training (Optional)** 
```python
import torch
import torchvision
import torchvision.transforms as transforms
from tqdm import tqdm
import cv2
import matplotlib.pyplot as plt
import torch.nn as nn
from torch import optim

transform = transforms.Compose(
    [transforms.ToTensor(),
     transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))])

BATCH_SIZE = 16

trainset = torchvision.datasets.CIFAR10(root='./data', train=True,
                                        download=True, transform=transform)
trainloader = torch.utils.data.DataLoader(trainset, batch_size=BATCH_SIZE,
                                          shuffle=True, num_workers=2)

testset = torchvision.datasets.CIFAR10(root='./data', train=False,
                                       download=True, transform=transform)
testloader = torch.utils.data.DataLoader(testset, batch_size=BATCH_SIZE,
                                         shuffle=False, num_workers=2)

classes = ('plane', 'car', 'bird', 'cat',
           'deer', 'dog', 'frog', 'horse', 'ship', 'truck')

model = ViT(patch_size=16,
          img_dimension=(32, 32),
          latent_size=1024,
          num_heads=2,
          num_classes=10)

LR = 1e-3

optimizer = optim.Adam(model.parameters(), lr = 1e-3, amsgrad = True)
loss_fn = nn.CrossEntropyLoss()

def train_1_epoch(train_loader):
  loss_value = 0
  cnt = 0
  for (x, y) in tqdm(train_loader):
    logits = model(x)
    loss = loss_fn(logits, y)
    optimizer.zero_grad()
    loss.backward()
    optimizer.step()

    loss_value += loss.item()
    cnt += 1

  return loss_value/cnt


@torch.no_grad()
def eval(testloader):
  model.eval()
  loss_value = 0
  cnt = 0
  num_correct = 0
  num_samples = 0
  for (x, y) in tqdm(testloader):
    logits = model(x)
    loss = loss_fn(logits, y)
    loss_value += loss.item()

    pred = logits.argmax(1)
    num_correct += len(pred[pred==y])
    num_samples += len(y)
    cnt += 1

  model.train()
  return loss_value/cnt, num_correct/num_samples

def train(epochs):
  for epoch in range(epochs):
    train_loss = train_1_epoch(trainloader)
    val_loss, val_acc = eval(testloader)


    print(f"Epoch: {epoch}  Train Loss: {train_loss} Validation Loss: {val_loss} Val Acc: {val_acc}")


train(10)
```

```
Add result here
```

### 4. Kết

Ở bài post này, mình đã giới thiệu về kiến trúc Vision Transformer và code nó from scratch một cách đơn giản và dễ hiểu nhất. Ở các bài post tiếp theo, mình sẽ giới thiệu các kiến trúc transformer-based khác cho các task như image segmentation, object detection, ... Chúc các bạn học tốt.



### References
1\. [An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale][vision transformer paper]


[vision transformer paper]: google.com