---
title: "Giải thích và code paper Very Deep Convolutional Networks for Large-Scale Image Recognition"
layout: post
---


Xin chào các bạn!

Trong bài post này mình sẽ giới thiệu về kiến trúc VGG, một trong những kiến trúc lâu đời nhất của mạng tích chập. Thật tình cờ, vào thời điểm viết bài blog này cũng là tròn 10 năm ngày ra mắt của mô hình này. Vậy, VGG có gì đặc biệt và có ảnh hưởng đến cách xây dựng các mô hình CNNs sau này như thế nào, chúng ta cùng khám phá nhé.


### 1. Một chút background về các tiền bối của VGG  
Vào thời điểm 10 năm trước, có 2 mô hình CNNs rất nổi trước khi VGG được ra mắt đó là AlexNet (2012) được published trong paper "_ImageNet Classification with Deep Convolutional Neural Networks_" và LeNet của YanLeCun. Mô hình LeNet của YanLeCun là mô hình đầu tiên áp dụng thuật toán convolution vào mạng neural networks. Còn về AlexNet, mô hình này cực kì nổi tiếng mà hầu như ai trong lĩnh vực AI này cũng biết, nó đặc biệt ở chỗ dùng hàm ReLU activation function, sử dụng Dropout và Local Response Normalisation, và training với nhiều GPUs. 

Tuy nhiên, nếu nhìn qua về kiến trúc của cả 2 mạng này, ta sẽ thấy nó khá là nông với chỉ từ 5 đến 6 layers. Một điều nữa là cách sử dụng convolutional layers ở các mạng này là dùng kernel size và stride có kích cỡ lớn ở những layers đầu để thu nhỏ receptive field. 


<figure style="text-align: center">
<img src="https://pabloinsente.github.io/assets/post-8/alexnet.png" alt="Kiến trúc của LeNet-5 và AlexNet">
<figcaption><b>Hình 1.1.</b> Kiến trúc của LeNet-5 và AlexNet</figcaption>
</figure>



Như có thể thấy ở trên, mạng AlexNet có nhiều convolutional layers hơn so với LeNet tuy nhiên, AlexNet chỉ dừng lại ở 5 convolution layers và 3 fully connected layers. 

### 2. Cấu trúc của VGG Network
Mạng VGG khác với các mô hình đi trước ở 2 điểm chính đó là sử dụng kernel size = 3 xuyên suốt toàn bộ kiến trúc và độ sâu của mô hình được tăng lên 16-19 layers thay vì chỉ vài layers như AlexNet và LeNet trước đó.

Trong paper của mình, tác giả VGG đề xuất 6 options cho VGG đó là A, A-LRN, B, C, D, và E. Với từng options sẽ có thông số cụ thể như sau:

* A: 11 layers với với toàn bộ kernel size là 3x3.  
* A-LRN: Tương tự như A nhưng sử dụng Local Response Normalisation sau conv layer đầu tiên.  
* B: 13 layers với toàn bộ kernel size là 3x3.  
* C: 16 layers với toàn bộ kernel-size là 3x3 và 1x1 ở 3 khối cuối cùng.
* D: 16 layers với  toàn bộ kernel-size là 3x3.  
* E: 19 layers với toàn bộ kernel-size là 3x3. 



<table style="width: 800px; margin: 0 auto;">  <thead>
  <tr>
    <th colspan="6" style="text-align: center">ConvNet Configuration</th>
  </tr>
</thead>

<tbody>  <tr>
    <td style="text-align: center">A</td>
    <td style="text-align: center">A-LRN</td>
    <td style="text-align: center">B</td>
    <td style="text-align: center">C</td>
    <td style="text-align: center">D</td>
    <td style="text-align: center">E</td>
  </tr>
  <tr>
    <td style="text-align: center">11 weight layers</td>
    <td style="text-align: center">11 weight layers</td>
    <td style="text-align: center">13 weight layers</td>
    <td style="text-align: center">16 weight layers</td>
    <td style="text-align: center">16 weight layers</td>
    <td style="align: center">19 weight layers</td>
  </tr>

  <tr>
    <td colspan="6" style="text-align: center"> input (224x224 RGB image) </td>
  </tr>

  <tr>
    <td style="text-align: center">Conv3-64</td>
    <td style="text-align: center">Conv3-64<br>
        <span style="font-weight: bold;">LRN</span>  </td>
    <td style="text-align: center">Conv3-64<br>
    <span style="font-weight: bold">Conv3-64</span></td>
    <td style="text-align: center">Conv3-64<br>
    <span>Conv3-64</span></td>
    <td style="text-align: center">Conv3-64<br>
    <span>Conv3-64</span></td>
    <td style="text-align: center">Conv3-64<br>
    <span>Conv3-64</span></td>
  </tr>

  <tr>
    <td colspan="6" style="text-align: center">MaxPool</td>
  </tr>

  <tr>
    <td style="text-align: center">Conv3-128</td>
    <td style="text-align: center">Conv3-128</td>
    <td style="text-align: center">Conv3-128<br>
    <span style="font-weight: bold">Conv3-128</span></td>
    <td style="text-align: center">Conv3-128<br>
    <span>Conv3-128</span></td>
    <td style="text-align: center">Conv3-128<br>
    <span>Conv3-128</span></td>
    <td style="text-align: center">Conv3-128<br>
    <span>Conv3-128</span></td>
  </tr>

  <tr>
    <td colspan="6" style="text-align: center">MaxPool</td>
  </tr>


  <tr>
    <td style="text-align: center">Conv3-256<br>
    <span>Conv3-256</span></td>
    <td style="text-align: center">Conv3-256<br>
    <span>Conv3-256</span></td>
    <td style="text-align: center">Conv3-256<br>
    <span>Conv3-256</span></td>
    <td style="text-align: center">Conv3-256<br>
    <span>Conv3-256</span><br><span style="font-weight: bold">Conv1-256</span></td>
    <td style="text-align: center">Conv3-256<br>
    <span>Conv3-256</span><br><span style="font-weight: bold">Conv3-256</span></td>
    <td style="text-align: center">Conv3-256<br>
    <span>Conv3-256</span><br><span>Conv3-256</span><br>
    <span  style="font-weight: bold">Conv3-256</span></td>
  </tr>

  <tr>
    <td colspan="6" style="text-align: center">MaxPool</td>
  </tr>

  <tr>
    <td style="text-align: center">Conv3-512<br>
    <span>Conv3-512</span></td>
    <td style="text-align: center">Conv3-512<br>
    <span>Conv3-512</span></td>
    <td style="text-align: center">Conv3-512<br>
    <span>Conv3-512</span></td>
    <td style="text-align: center">Conv3-512<br>
    <span>Conv3-512</span><br><span style="font-weight: bold">Conv1-512</span></td>
    <td style="text-align: center">Conv3-512<br>
    <span>Conv3-512</span><br><span style="font-weight: bold">Conv3-512</span></td>
    <td style="text-align: center">Conv3-512<br>
    <span>Conv3-512</span><br><span>Conv3-512</span><br>
    <span  style="font-weight: bold">Conv3-512</span></td>
  </tr> 

  <tr>
    <td colspan="6" style="text-align: center">MaxPool</td>
  </tr>

  <tr>
    <td style="text-align: center">Conv3-512<br>
    <span>Conv3-512</span></td>
    <td style="text-align: center">Conv3-512<br>
    <span>Conv3-512</span></td>
    <td style="text-align: center">Conv3-512<br>
    <span>Conv3-512</span></td>
    <td style="text-align: center">Conv3-512<br>
    <span>Conv3-512</span><br><span style="font-weight: bold">Conv1-512</span></td>
    <td style="text-align: center">Conv3-512<br>
    <span>Conv3-512</span><br><span style="font-weight: bold">Conv3-512</span></td>
    <td style="text-align: center">Conv3-512<br>
    <span>Conv3-512</span><br><span>Conv3-512</span><br>
    <span  style="font-weight: bold">Conv3-512</span></td>
  </tr> 

  <tr>
    <td colspan="6" style="text-align: center">MaxPool</td>
  </tr>

  <tr>
    <td colspan="6" style="text-align: center">FC-4096</td>
  </tr>

  <tr>
    <td colspan="6" style="text-align: center">FC-4096</td>
  </tr>

  <tr>
    <td colspan="6" style="text-align: center">FC-1000</td>
  </tr>

  <tr>
    <td colspan="6" style="text-align: center">Softmax</td>
  </tr>

</tbody>

</table>




<figure style="text-align: center">
  <img src="https://www.researchgate.net/profile/Siti-Nurulain-Mohd-Rum/publication/350550608/figure/fig3/AS:1007769725452289@1617282434523/The_Difference_Architecture_between_AlexNet_and_VGG16_Models.png" alt="The Difference Architecture between AlexNet and VGG16 Models">
  <figcaption style = "text-align: center" ><b>Hình 2.1.</b> Kiến trúc của AlexNet và VGG-16 (một option trong kiến trúc VGG)</figcaption>
</figure>


So sánh giữa 2 kiến trúc như trên hình thì có thể thấy được rằng kiến trúc VGG sâu hơn hẳn so với AlexNet. 

Với kiến trúc sử dụng full conv 3x3 và 16 layers, tác giả Karen Simonyan & Andrew Zisserman đã chứng minh được độ hiệu quả với việc giảnh giải nhất của cuộc thi ILSVRC 2014 cho task classification và giải nhi cho task localisation.

### 3. Coding time
Giờ mình sẽ build kiến trúc này với Pytorch để chúng ta có thể nắm rõ hơn kiến trúc này nhé. 
```python
import torch
from torch import nn

torch.set_grad_enabled(False)

# Configuration for each option
cfg = {
    'A': [64, 'M', 128, 'M', 256, 256, 'M', 512, 512, 'M', 512, 512, 'M'],
    'A-LRN': [64, 'M', 128, 'M', 256, 256, 'M', 512, 512, 'M', 512, 512, 'M'],
    'B': [64, 64, 'M', 128, 128, 'M', 256, 256, 'M', 512, 512, 'M', 512, 512, 'M'],
    'C': [64, 64, 'M', 128, 128, 'M', 256, 256, 256, 'M', 512, 512, 512, 'M', 512, 512, 512, 'M'],
    'D': [64, 64, 'M', 128, 128, 'M', 256, 256, 256, 'M', 512, 512, 512, 'M', 512, 512, 512, 'M'],
    'E': [64, 64, 'M', 128, 128, 'M', 256, 256, 256, 256, 'M', 512, 512, 512, 512, 'M', 512, 512, 512, 512, 'M'],
}


class VGG(nn.Module):
    def __init__(self, vgg_name, num_classes):
        super().__init__()
        if vgg_name not in cfg:
            raise "Architecture not included, please try again"
        
        self.layer_names = cfg[vgg_name]
        layers = [nn.Conv2d(3, self.layer_names[0], kernel_size=3, padding = 1)]
        if "LRN" in vgg_name:
            layers += [nn.LocalResponseNorm(5)]

        layers += [nn.ReLU()]

        last_num_layer = self.layer_names[0]
        for ith, layer_name in enumerate(self.layer_names[1:]):
            if isinstance(layer_name, int):
                if vgg_name == 'C' and ith >= 6 and self.layer_names[ith+2] == 'M':
                    layers += [nn.Conv2d(last_num_layer, layer_name, kernel_size=1, stride=1, padding = 0)]
                else:
                    layers += [nn.Conv2d(last_num_layer, layer_name, kernel_size=3, stride=1, padding = 1)]
    
                layers += [nn.ReLU()]
                last_num_layer = layer_name
            else:
                layers.append(nn.MaxPool2d(2, 2))

        self.layers = nn.Sequential(*layers)
        self.global_avg_pool = nn.AdaptiveAvgPool2d(1)
        self.fc = nn.Linear(last_num_layer, num_classes)

    def forward(self, x):
        x = self.layers(x)
        x = self.global_avg_pool(x)
        x = x.view(x.shape[0], -1)
        return self.fc(x)
        


if __name__ == "__main__":
    modelA = VGG("A", 10)
    modelALRN = VGG("A-LRN", 10)
    modelB = VGG('B', 10)
    modelC = VGG("C", 10)
    modelD = VGG("D", 10)
    modelE = VGG('E', 10)

    dummy = torch.randn((1, 3, 224, 224))
    print(f"Model A output shape: {modelA(dummy).shape}")
    print(f"Model A-LRN output shape: {modelALRN(dummy).shape}")
    print(f"Model B output shape: {modelB(dummy).shape}")
    print(f"Model C output shape: {modelC(dummy).shape}")
    print(f"Model D output shape: {modelD(dummy).shape}")
    print(f"Model E output shape: {modelE(dummy).shape}")
```

Output của mô hình
```
> Model A output shape: torch.Size([1, 10])
> Model A-LRN output shape: torch.Size([1, 10])
> Model B output shape: torch.Size([1, 10])
> Model C output shape: torch.Size([1, 10])
> Model D output shape: torch.Size([1, 10])
> Model E output shape: torch.Size([1, 10])
```

### 4. Thảo luận (Optional)
Trong các kiến trúc của AlexNet hay LeNet, tại sao họ không làm kiến trúc sâu hơn? Lý do chính bởi vì họ dùng kernel size và stride lớn nên đến khoảng layer 5 và 6 thì số lượng features đã rất nhỏ nên họ đã không thể cho thêm nhiều layers để extract features hơn nữa. 

Tại sao tác giả của VGG dùng 3x3 mà không phải là 5x5, 2x2, 4x4? Lý do chính họ sử dụng kernel size 3x3 là vì đây là kernel size nhỏ nhất có thể bắt được toàn bộ vùng xung quanh của một pixels (trái/phải, trên/dưới, và chính giữa). Hơn nữa việc dùng 2 kernel 3x3 tương tự với việc dùng conv 5x5 với ít số lượng parameters hơn, nhưng **khối lượng tính toán sẽ nhiều hơn** (tác giả không nhắc đến điều này trong paper).

### 5. Kết luận
Mô hình VGG đã làm thay đổi cách các AI researchers/scientists thiết kế các kiến trúc CNN, với việc mô hình hiện đại ngày nay đa số dùng kernel size 3x3, và có độ sâu lớn hơn rất nhiều so với các mô hình ra mắt trước VGG. Vì vậy, ta có thể nói VGG là một pioneer model.

Cảm ơn bạn đã đọc đến cuối bài, hãy ủng hộ mình bằng cách tiếp tục theo dõi và feedback nếu thấy chỗ nào chưa hợp lý nhé. 

### References
1\. [Very Deep Convolutional Networks for Large-Scale Image][Very Deep Convolutional Networks for Large-Scale Image]  
2\. [The Convolutional Neural Network - Theory and Implementation of LeNet-5 and AlexNet][The Convolutional Neural Network - Theory and Implementation of LeNet-5 and AlexNet]



[The Convolutional Neural Network - Theory and Implementation of LeNet-5 and AlexNet]: https://pabloinsente.github.io/the-convolutional-network
[Very Deep Convolutional Networks for Large-Scale Image]: https://arxiv.org/pdf/1409.1556.pdf