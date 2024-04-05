---
title:  "Hướng dẫn tính số lượng params trong các mạng Neural Networks - Phần 1"
mathjax: true
layout: post
---

Xin chào các bạn,

Trong bài post này, mình sẽ hướng dẫn tính thủ công số lượng parameters trong các mạng tích chập.


<figure style="text-align: center">
     <img width=1200 height=400 src="https://static.vecteezy.com/system/resources/previews/013/869/695/original/neural-network-illustration-png.png">
     <figcaption style = "text-align: left">Source: <a href="https://www.vecteezy.com/png/13869695-neural-network-illustration">abcvector</a></figcaption>
</figure>


### 1. Tại sao việc tính tay số lượng parameters lại quan trọng ?
Việc biết tính số lượng parameters của một mô hình sẽ giúp chúng ta có được cái nhìn rõ và tổng quan hơn về mô hình trước khi ta bắt tay xây dựng hoặc deploy nó và việc này sẽ tiết kiệm được kha khá thời gian. Giả sử, khi deploy lên mobile, web, hay edge devices, chúng ta cần tìm mô hình nào có số lượng params ít nhất (càng ít params thì file weights càng nhẹ). Việc đầu tiên các bạn thường làm sẽ là tìm kiếm papers của các model và đọc thử nếu thấy hợp tiêu chí thì sẽ build hoặc clone repo về. Và khi biết được cách tính số lượng params rồi thì ta chỉ cần đọc lướt qua về phần kiến trúc là đã biết được liệu mô hình này liệu có đủ nhẹ để deploy không thay vì phải build và dùng các tools hoặc frameworks để kiểm tra. Ngoài ra, việc biết cách tính số lượng params một cách thủ công còn giúp chúng ta nắm rõ được papers hơn. 

### 2. Cách tính số lượng params
Mình sẽ hướng dẫn các bạn tính số lượng params trong các mạng cơ bản nhất để có nền tảng để tính các mạng phức tạp hơn. Thực chất, các mạng phức tạp cũng chỉ cấu thành từ những mạng cơ bản. Nếu tính được các mạng cơ bản thì mạng nào chúng ta cũng có thể tính được.

#### 2.1. Cách tính số lượng params cho mạng linear

<figure style="text-align: center">
     <img width=1200 height=400 src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Neural_network.svg/600px-Neural_network.svg.png?20210102213114">
     <figcaption style = "text-align: left">Source: <a href="https://aldozaimi.wordpress.com/2020/02/13/determine-the-number-of-trainable-parameters-in-a-neural-network/">Aldo Zaimi</a></figcaption>
</figure>

Theo công thức, mạng linear được tính như sau:

$$Z = Weight^T \cdot X + bias $$

Với
$$ X \in R^{D_1*N} $$
$$ Weight \in R^{D_1*D_2}$$
$$bias \in R^{D_2*1}$$
$$N:\text{Batch Size}$$
$$D_2: \text{Dimension của layer hiện tại (số lượng neurons trong layer đó)}$$
$$D_1: \text{Dimension của layer trước (số lượng neurons trong layer trước)}$$

Vì trong layer này có tổng cộng $ D_1*D_2$ weights và $D_2$ của bias, nên tổng cộng có số lượng weights là:
$$\text{Number of layer's parameters}= D_1*D_2 + D_2$$ 

Trong mạng này, có tổng cộng là 2 layers: layer giữa và layer cuối. Layer đầu ta không tính vì đó là input và trong ví dụ này dimension của input là 2. Vì vậy, ta có cách tính số lượng parameters của mạng này như sau:
$$\text{Total parameters} = \text{Number of layer 1's parameters} + \text{Number of layer 2's parameters}$$
$$-> \text{Total parameters} = (5*2 + 5) + (1*5 + 1) = 15 + 6 = 21$$

Ta hãy dùng Tensorflow xây dựng và kiểm tra thử liệu số lượng parameters chúng ta tính có đúng không nhé

```python
import tensorflow as tf
from tensorflow import keras
from keras import layers

model = keras.Sequential([
    layers.Input(shape=(2, )),
    layers.Dense(5), 
    layers.Dense(1)
])


print(model.summary())
```


```
Model: "sequential"
_________________________________________________________________
 Layer (type)                Output Shape              Param #   
=================================================================
 dense (Dense)               (None, 5)                 15        
                                                                 
 dense_1 (Dense)             (None, 1)                 6         
                                                                 
=================================================================
Total params: 21
Trainable params: 21
Non-trainable params: 0
_________________________________________________________________
```

Correctamundo!! 
#### 2.2. Cách tính số lượng params cho mạng convolution

<figure style="text-align: center">
     <img width=1200 height=400 src="https://w7.pngwing.com/pngs/847/762/png-transparent-convolutional-neural-network-kernel-filter-convolutional-neural-network-angle-text-rectangle.png">
     <figcaption style = "text-align: left">Source: <a href="https://aldozaimi.wordpress.com/2020/02/13/determine-the-number-of-trainable-parameters-in-a-neural-network/">PngWing</a></figcaption>
</figure>


Với mạng convolution, chúng ta sẽ có cách tính hơi khác do cách hoạt động của mạng này khác với mạng linear ở trên. Tuy nhiên, về mặt bản chất, cách tính của chúng tương tự nhau. 

Trong Pytorch, 3 thông số quan trọng bạn phải set cho model là **channel_in** và **channel_out**, và **kernel_size**. Đối với Tensorflow chỉ cần 2 thông số out_channels và kernel_size do in_channels sẽ được tự động tìm ra.

```python
conv_layer = nn.Conv2d(in_channels=3, out_channels=16, kernel_size = 3)
```

Có lẽ bạn thắc mắc tại sao 3 thông số này quan trọng? Vì 3 thông số này sẽ quyết định số lượng parameters của lớp conv này.

Mối quan hệ giữa input và output của convolution layer có công thức như sau:

$$out(N_i, C_{out_j}) = bias(C_{out_j}) + \sum_{k=0}^{C_{in}-1} weight(C_{out}, k)*input(N_i, k)$$


Đoạn code dưới đây minh họa giải thuật tích chập của 1 kernel cho một vùng của ảnh theo công thức trên: 

```python
# Đây là đoạn code để giúp các bạn hiểu hơn về cách hoạt động của một kernel
import numpy as np

# Giả sử chúng ta có input có kích thước 3x3x3, và kernel 3x3
input = np.ones((3, 3, 3), dtype=np.float32)
kernel = np.random.randn((3, 3, 3))
bias = np.random.randn(1)

# output của nó sẽ như sau:
output = (kernel*input).sum() + bias
```

Nếu bạn set output channels = 16 như đoạn code trên thì PyTorch/Tensorflow sẽ tạo ra 16 kernels cùng kích thước nhưng khác params và mỗi kernel sẽ quét qua input và output ra 1 layer.

Như ví dụ minh họa trên, với mỗi một kernel ta sẽ có số parameters như sau $\text{kernel width} * \text{kernel height} * \text{input channels} + 1 (bias)$. Và nếu ta đặt số lượng kernel là $C_{out}$ thì ta sẽ có tổng số lượng parameters trong một convolution layer là:

$$\text{Number of parameters of a convolution layer} = \text{kernel width}*\text{kernel height}*\text{input channels}* \text{output channels} + \text{output channels}$$


Ví dụ, nếu ta có một tấm ảnh có kích thước $Width * Height * 3$ và ta set cho lớp conv có 16 channels out và kernel size = 3 thì ta sẽ có số lượng parameters như sau:


$$\text{Number of parameters} = 3*3*3*16 + 16 = 448$$

Ta sẽ kiểm tra thử bằng framework Tensorflow nhé, do Pytorch ở thời điểm chưa hỗ trợ nên mình dùng tạm Tensorflow vậy.

```python
import tensorflow as tf
from tensorflow import keras
from keras import layers

model = keras.Sequential([
    layers.Input(shape=(224, 224, 3)),
    layers.Conv2D(16, kernel_size=3), 
])


print(model.summary())
```

```
Model: "sequential"
_________________________________________________________________
 Layer (type)                Output Shape              Param #   
=================================================================
 conv2d (Conv2D)             (None, 222, 222, 16)      448       
                                                                 
=================================================================
Total params: 448
Trainable params: 448
Non-trainable params: 0
_________________________________________________________________
```
Correctamundo!!

<span style="color:#FFA500;"><b>Lưu ý</b>: Kích thước dài và rộng của input sẽ không ảnh hưởng đến số lượng params, nó chỉ ảnh hưởng đến số phép tính cần thực hiện.</span>


Vì thế, nếu bạn set càng nhiều output channels thì số parameters sẽ càng nhiều. Và nếu các bạn đọc kiến trúc của các mô hình họ thiết kế **càng nhiều output layers thì số lượng parameters của họ** sẽ càng lớn.

Tuy nhiên, trừ một trường hợp họ sử dụng Depth-wise conv (đây là trường hợp đặc biệt do họ chỉ dùng 1 kernel giống nhau quét qua input **out_channels** lần thay vì dùng **out_channels** kernel khác nhau quét qua input). Mình sẽ giải thích rõ kiến trúc này ở phần sau nha.


### 3. Kết luận
Qua hai ví dụ trên, mình đã hướng dẫn các bạn tính số lượng parameters của hai mạng cơ bản nhất trong neural networks. Hai mạng này là hai mạng cơ bản nhất tạo nên những kiến trúc khổng lồ và hiện đại như ChatGPT, Diffusion, GANs, BERTs nên nếu biết các tính chính xác 2 kiến trúc trên thì bạn có thể tính hoặc nhẩm được 90% các mạng trên thị trường rùi nhé. Còn 10% kia mình sẽ cover ở phần sau nhe.

Nếu bạn thích bài viết thì hãy ủng hộ mình bằng cách tiếp tục theo dõi và phản hồi lại nếu có gì bạn thấy chưa hợp logic hay không hiểu nhé.


### References
1. [Pytorch documentation - Linear](https://pytorch.org/docs/stable/generated/torch.nn.Linear.html)

2. [Pytorch documentation - Conv2d](https://pytorch.org/docs/stable/generated/torch.nn.Conv2d.html)


