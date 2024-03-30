---
title: "Giải thích và code các optimizers from scratch"
layout: post
---


Xin chào các bạn!

Trong bài post này, mình sẽ giới thiệu optimizers là gì, công dụng của nó trong việc training deep learning models, và sẽ code from scratch để hiểu rõ hơn nó hoạt động như thế nào nhé. Bài viết này dành cho các bạn đã nắm được cơ bản mạng neural network, loss functions rùi nhé. Nếu các bạn vẫn chưa học qua neural network và loss function thì bài này khá là khoai đấy, thế nhá. 

### 1. Optimizers là gì?
Trong công đoạn training 1 mạng neural network sẽ gồm 3 bước. Bước 1, chúng ta sẽ chạy forward inference. Bước 2, chúng ta sẽ dùng labels để chạy giải thuật backpropagation. Bước 3, sau khi có có được gradients từ backpropagation, chúng ta sẽ cập nhật parameters mới cho mạng. Và optimizer nằm ở khâu này, nó dùng để cập nhật các parameters của mạng neural network (NN), nó sẽ điều khiển cách chúng ta cập nhập parameter mới sau mỗi iteration. 

Trong một thập kỉ qua, đã có nhiều researchers và scientists đề xuất nhiều thuật toán optimizers khác nhau, có những ưu và nhược điểm khác nhau. Ở thời điểm hiện tại của bài post, optimizers được tin dùng nhất là Adam, RMSProp, SGD. Nếu các bạn dùng qua các framework của Tensorflow, Pytorch, Keras thì không thể không biết các optimizers này. 

Tuy nhiên, việc cứ dùng những giải thuật được viết sẵn trong các ML frameworks mà không hiểu các settings cũng như cách thức hoạt động cũng sẽ khiến chúng ta hơi bất an. Vì vậy, trong bài này mình sẽ giải thích một cách chi tiết các giải thuật optimizers này.

### 1. Đặt vấn đề
Giả sử chúng ta muốn xây dựng một mạng với hàm có dạng f(x) = ax+b để dự đoán một hàm số từ các điểm đã biết trước như sau:

| Dataset |     |     |     |     |     |     |
|---------|-----|-----|-----|-----|-----|-----|
| x       |  0  |  1  |  2  |  3  |  4  |  5  |
| y       |  1  |  3  |  5  |  7  |  9  | 11  |

Và chúng ta cần dự đoán giá trị f những điểm x = 1.5, 4.2, 6. 

Hàm loss là người chấm điểm, còn gradient là người dẫn lối để chúng ta để đạt điểm cao nhất (hoặc điểm thấp nhát ><>).


### 1. Gradient Descent (GD)
Đây là phương pháp cơ bản và lâu đời nhất của các optimizers. Nói nó là cơ bản vì tất cả các phương pháp sau đều dựa trên phương pháp này để cải tiến. Phương pháp cực kì đơn giản và dễ implement. Vì lý do nó đã ra đời rất lâu và đơn giản nên hiệu quả của nó không còn cao so sánh với các giải thuật optimizer hiện nay, và cũng ít người lựa chọn phương pháp này để train.
![image](https://editor.analyticsvidhya.com/uploads/631731_P7z2BKhd0R-9uyn9ThDasA.png)

Như các bạn thấy trên hình thì phương pháp này chỉ đơn giản cập nhật các trọng số theo hướng ngược lại của gradient. Biểu diễn toán học, nó có công thức như sau:

$\theta_t$ = $\theta_{t-1}$ - $\alpha$ $\nabla$ $J(\theta_{t-1}, y)$ 

Trong đó:  
$\theta_t$: Trọng số tại iteration t  
$\theta_{t-1}$: Trọng số tại iteration t-1  
$\alpha$: Learning rate (constant) mà chúng ta phải set ban đầu  
$\nabla$ $J(\theta_{t-1}, y)$ : Đạo hàm của hàm loss theo parameter tại t-1 với label là y  



### 2. Stochastic Gradient Descent (SGD)
Stochastic gradient descent về bản chất tương tự như gradient descent. Tuy nhiên thay vì cập nhập trọng số với toàn bộ dataset, SGD dùng một hàm xác suất để chọn những data point để cập nhật. Để minh họa, phương pháp SGD tại iteration t chọn x = 0, x = 3, x = 5 để update params thay vì chọn tất cả x trong tập dataset để cập nhật. 

### 3. Root Mean Squared Propagation 



### 4. Adam

### 5. Nadam

### 6. AdamW

### 7. Ftrl

### 8. Lion Optimizer

### 9. Adagrad

### 10. Adadelta

### 11. Adamax

### 12. Adafactor

![image](https://archive.ph/C8tjj/0d4d768dcedf08df014f790f86d4f771451b7825.gif) 



**References**:  
1. What is RMSProp? (with code!) (Medium)