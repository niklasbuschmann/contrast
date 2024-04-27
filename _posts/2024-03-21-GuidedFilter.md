---
title: "Giải thích và code paper Guided Image Filtering"
layout: post
mathjax: true
---

Xin chào các bạn,

Trong bài post này, mình sẽ giới thiệu một thuật toán image filtering mới tên là Guided Image Filtering. Đây là thuật toán làm mịn ảnh tốt nhất tính đến thời điểm bài post này được viết. Phương pháp này được đề xuất bởi Kaiming He (cũng là cha đẻ của mô hình ResNet), Jian Sun, và Xiaoou Tang tại hội nghị ECCV 2010. Cũng đã thấm thoát 14 năm trôi qua, đã có nhiều biến thể của thuật toán này như Fast Guided Image Filtering, Deep Guided Image filtering, ... được đề xuất, tuy nhiên chúng đều dựa trên nền của giải thuật gốc. Đây là một giải thuật đạt được cùng một lúc cả hai tiêu chí: **nhanh hơn và tốt hơn**. 

### 1. Tại sao Guided Image Filtering được ra đời ?

Thuật toán Guided Image Filtering ra đời với mục tiêu giải quyết một số thách thức quan trọng trong xử lý ảnh, đặc biệt là trong việc làm mịn ảnh. Trước đó, các phương pháp truyền thống như bộ lọc trung bình, Gaussian Blur, bilateral filter lọc nhiễu và làm mịn ảnh nhưng đồng thời cũng làm mất các chi tiết trong ảnh. Để khắc phục nhược điểm đó của các bộ lọc trên, bộ lọc Guided filter tích hợp thêm thông tin của ảnh gốc để có thể "hướng dẫn" giải thuật lọc đi đúng hướng và giữ được nhiều chi tiết nhất có thể. 

Ngoài ứng dụng làm mịn, Guided filter còn có thể được ứng dụng cho colorisation, image matting, multi-scale decomposition, và haze removal. 

<figure style="text-align: center">
     <img width=1200 height=400 src="https://velog.velcdn.com/images%2Fclaude_ssim%2Fpost%2F69116092-cd13-41de-b97e-95a742f3b2f9%2F%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202021-10-21%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%209.10.32.png">
     <figcaption style = "text-align: left">Ứng dụng của guided filter trong image matting. Nguồn: <a href="https://velog.io/@claude_ssim%EA%B3%84%EC%82%B0%EC%82%AC%EC%A7%84%ED%95%99-Edge-Aware-Image-Filtering-Guided-Filtering">claude_ssim.log
</a></figcaption>
</figure>


### 2. Giải thuật Guided Image Filtering

<figure style="text-align: center">
     <img width=1200 height=400 src="https://kaiminghe.github.io/eccv10/img/idea.jpg">
     <figcaption style = "text-align: left">Minh họa behaviour của guided filter Nguồn: <a href="https://kaiminghe.github.io/eccv10/index.html">Kaiming He
</a></figcaption>
</figure>

Guided filter hoạt động giống với tích chập ở chỗ nó cũng lướt qua từng patch của tấm ảnh.

Giả sử, $$ q $$ là output, $$I$$ là guidance image, $$I$$ là ảnh đầu vào. $$w_k$$ là một cửa sổ  (kernel).

Về tổng quát, Guided filter có công thức như sau:

$$q_i = a_kI_i + b_k, $$

Với $$(a_k, b_k)$$ là trọng số tuyến tính (kiểu $$y = ax + b$$) trong kernel $$w_k$$. Tham số $$r$$ là bán kính của kernel. Kiểu công thức tuyến tính này sẽ giúp cho ảnh output giữ lại được các cạnh và chi tiết có tần số cao trong ảnh được filtered bởi vì $$\nabla q = a\nabla I$$. Công việc của chúng ta là tìm ra hệ số $$a_k \text{ và } b_k$$ cho mỗi kernel. Việc tìm ra hai hệ số này dựa vào hàm loss sau: 

$$E(a_k, b_k) = \sum_{i \in w_k}{((a_kI_i + b_k - p_i)^2 + \varepsilon a_k^2)}$$

Hàm loss này có mục đích tổi thiểu hóa khoảng cách L2 của output với ảnh guidance. Hệ số $$\varepsilon$$ ở đây được tác giả thêm vào để tránh cho a_k trở nên quá lớn. 

Chúng ta có thể dùng nhiều phương pháp để có thể tìm ra 2 hệ số này bằng nhiều phương pháp như Gradient Descent, Newton, ... Tuy nhiên, tác giả cũng đã cung cấp công thức tổng quát để tìm ra $$a_k, b_k$$ trong paper của mình. Cụ thể, với mỗi kernel 2 thông số được tính như sau:

$$a_k = \frac{\frac{1}{|w|}\sum_{i \in w_k}{I_ip_i - \mu _k \overline{p_k}}}{\sigma _k ^2 + \epsilon}$$

$$b_k = \overline{p_k} - a_k \mu _k$$

Với $${\mu _k}, \sigma _k$$ là giá trị mean và variance của ảnh input trong kernel $$w_k$$, $$|w|$$ là tổng số lượng pixels trong kernel, $$\overline{p_k}$$ là giá trị trung bình của các pixels của ảnh guidance trong kernel $$w_k$$.

Tuy nhiên, có một vấn đề là một pixel bị overlapped bởi nhiều kernel giống như tích chập vậy. Để giải quyết vấn đề này, chúng ta sẽ lấy giá trị trung bình của chúng và quan hệ của input và output sẽ chỉ còn $$\nabla q \approx a \nabla I$$. Tuy nhiên, như vậy cũng đã đủ tốt để giữ lại các chi tiết có tần số cao trong tấm ảnh. 

Cuối cùng, ta có công thức tổng quát cho guided filter như sau:

$$q_i = \frac{1}{|w|}\sum_{i \in w_k}{a_kI_i + b_k} = \overline{a_i}I_i + \overline{b_i}$$

### 3. Implementation

```python

def guided_filter(p, I, r, e):
    '''
    Guided filter implemented by Mikyx-1 
    21/04/2024
    Args:
        p (torch.Tensor): Guidance Image
        I (torch.Tensor): Input Image
        r (int): Kernel Size (!= radius in the paper)
        e (float): epsilon to prevent underflow

    Returns:
        Output (torch.Tensor): Output image in format BCHW
    '''
    kernel = torch.ones((I.shape[0], 1, r, r))/(r**2)
    padding = r//2

    assert p.shape == I.shape, "Shapes do not match, retry!"

    meanI = F.conv2d(I, kernel, padding=padding, stride=1)
    meanP = F.conv2d(p, kernel, padding=padding, stride=1)
    corrI = F.conv2d(I*I, kernel, padding=padding, stride = 1)
    corrIp = F.conv2d(I*p, kernel, padding=padding, stride = 1)

    sigmaK = corrI - meanI*meanI
    a = (corrIp - meanI*meanP)/(sigmaK + e)
    b = meanP - a*meanI 
    
    meanA = F.conv2d(a, kernel, padding=padding, stride = 1)
    meanB = F.conv2d(b, kernel, padding=padding, stride = 1)

    output = meanA*I + meanB
    return output
```

### 4. Kết luận


### References

