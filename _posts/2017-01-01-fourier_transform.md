---
title:  "Giải thích Fourier Transform"
mathjax: true
layout: post
categories: media
---

Xin chào các bạn, 

Trong bài post này, mình sẽ giới thiệu về chuỗi Fourier và biến đổi Fourier. Đây là một giải thuật có rất nhiều công dụng trong Vật lý, toán học, kỹ thuật viễn thông, kỹ thuật tự động, ... Ngoài ra, biến đổi Fouier có thể có rất rất nhiều ứng dụng ngoài đời thật. Vì nó rất quan trọng và có rất nhiều thứ ta có thể áp dụng nó nên mình sẽ đi sâu vào việc chứng minh nó để có thể  giúp các bạn hiểu được giải thuật này hoạt động như thế nào.

![Image](https://media.licdn.com/dms/image/C5112AQG_liNXZZMl1A/article-cover_image-shrink_423_752/0/1577030802664?e=1720656000&v=beta&t=C9L_PmbXvIobSYPQEPW_WSH-hEsAZQx2Lez3-qciGwE)


<!-- https://www.linkedin.com/pulse/fast-fourier-transform-santosh-maharana/ -->

### 1. Đặt vấn đề
Trước khi đi vào phần chứng minh, mình muốn dành một phần nhỏ để nói về ứng dụng của giải thuật Fourier.


![Image](https://www.ksmotor.tw/uploads/editor/files/quality-2-1.jpg)

<!-- https://www.ksmotor.tw/en/quality_control -->

Giả sử trong khâu kiểm định chất lượng motor trước khi xuất xưởng, chúng ta phải test thử motor chạy tốt hay không tốt để giao tới khách hàng. Việc này có thể test bằng việc cho motor chạy khoảng vài chục ngàn vòng và nghe tiếng phát ra của nó. Nếu nó chạy đều và ổn định thì nó là motor tốt còn trong lúc test nó rít lên hay phát ra tiếng kêu to hoặc nhỏ hơn bình thường, ta cần loại những sản phầm này. Những tiếng rít của motor có tần số rất cao và ta muốn phát hiện những tiếng rít này một cách tự động. Tuy nhiên, tín hiệu ta thu về có đồ thị như ở hình dưới, chỉ có đơn điệu đồ thị biên độ và thời gian.

![Image](https://www.researchgate.net/profile/Rahul-Chaurasiya/publication/268391294/figure/fig1/AS:614119958917140@1523429016448/Voice-signal-for-the-word-one-The-1-second-duration-of-the-time-axis-is-divided-into.png)


Chuỗi Fourier sẽ giúp chúng ta tách sóng này ra thành các thành phần sin và cos với nhiều tần số khác nhau và biến đổi Fourier sẽ cho chúng ta biết đích xác có nững dải tần số nào trong tín hiệu này. Nhờ những tín hiệu này, ta có thể dễ dàng phân loại được chất lượng motor một cách tự động. 

### 1. Chuỗi Fourier (Fourier Series)
Chuỗi Fourier là tổng hợp của các tín hiệu sin và cos để có thể tạo nên tín hiệu gốc. Điều kiện để có thể phân tách được thành chuối Fourier là nó phải có tính tuần hoàn. 

$$f(x + T) = f(x)$$

Và nó có công thức như sau:

$$f(x) = \sum_{n=0}^{\infty}a_ncos(\frac{n\pi x}{L}) + \sum_{n=0}^{\infty}b_nsin(\frac{n\pi x}{L})  \text{ } (1)$$

Vì $$cos(0) = 1$$ và $$sin(0) = 0$$ nên ta có thể rút $$(1)$$ thành như sau:

$$<=> f(x) = a_0 +  \sum_{n=1}^{\infty}a_ncos(\frac{n\pi x}{L}) + \sum_{n=1}^{\infty}b_nsin(\frac{n\pi x}{L})  \text{ } (2)$$

Đặt  $$\theta_n = \frac{n\pi}{L}$$ và áp vào $$(2)$$ ta được:

$$f(x) = a_0 +  \sum_{n=1}^{\infty}a_ncos(\theta_n x) + \sum_{n=1}^{\infty}b_nsin(\theta_n x)  \text{ } (3)$$



Theo Euler, ta có: 

$$cos(\theta) = \frac{e^{j \theta} + e^{-j \theta}}{2}$$

$$sin(\theta) = \frac{e^{j \theta} - e^{-j \theta}}{2j}$$

Áp 2 công thức trên vào (3) ta được:

$$<=>f(x) = a_0 + \sum_{n = 1}^{\infty}\frac{a_n}{2} (e^{j \theta_n x} + e^{-j \theta_n x}) + \sum_{n = 1}^{\infty}\frac{b_n}{2j} (e^{j \theta_n x} - e^{-j \theta_n x}) \text{ } (4)$$

Khai triển từ (4), ta được:

$$<=>f(x) = a_0 + \sum_{n = 1}^{\infty}(\frac{a_n}{2} + \frac{b_n}{2j})e^{j \theta_n x} + \sum_{n = 1}^{\infty}(\frac{a_n}{2} - \frac{b_n}{2j})e^{-j \theta_n x} \text{ } (5)$$

Triển khai tiếp từ (5), ta được:

$$<=> f(x) = a_0 + \sum_{n = 1}^{\infty}(\frac{a_n - j b_n}{2})e^{j \theta_n x} + \sum_{n = 1}^{\infty}(\frac{a_n + j b_n}{2})e^{-j \theta_n x} \text{ } (6)$$

Ta biến đổi tiếp từ (6) như sau:

Đặt

$$C_{n-} = \frac{a_n - j b_n}{2}$$

$$C_{n+} = \frac{a_n + j b_n}{2}$$

$$C_0 = a_0$$

$$f(x) = C_0 + \sum_{n = -1}^{-\infty}C_{n-}e^{-j \theta_n x} + \sum_{n = 1}^{\infty}C_{n+}e^{-j \theta_n x} \text{ } (6)$$

Và ta có được công thức tổng quát của chuỗi Fourier:

$$<=> f(x) = \sum_{n = - \infty}^{\infty} C_n e^{-j \theta_n x} \text{ } (7)$$

Sau khi có được công thức tổng quát, ta cần tìm ra các hệ số  $$a_n, b_n, c_n$$. Và ý tưởng tìm ra các hệ số này là tính trực giao (Orthogonality). 

Ta có mệnh đề trực giao đối với một cặp hàm số điều hòa như sau:

$$\int_{-\pi}^{\pi} cos(nx)cos(kx)dx = 0 \text{ } (n \neq k)$$


$$\int_{-\pi}^{\pi} sin(nx)cos(kx)dx = 0$$


**Note**: Mình sẽ chứng minh mệnh đề này ở sau cùng, bây giờ hãy tập trung vào chuỗi Fourier trước.

Bây giờ, ta hãy nhân cả 2 vế của (1) với cos(x), ta được:

$$\int_{-\pi}^{\pi} f(x)cos(\theta_n x)dx = \int_{-\pi}^{\pi}(\sum_{n=0}^{\infty}a_ncos(\theta_n x) + \sum_{n=0}^{\infty}b_nsin(\theta_n x))cos(\theta x) dx  \text{ } (8)$$

Khai triển tiếp, ta được:

$$\int_{-\pi}^{\pi} f(x)cos(\theta_n x)dx = \int_{-\pi}^{\pi}(\sum_{n=0}^{\infty}a_ncos(\theta_n x) + \sum_{n=0}^{\infty}b_nsin(\theta_n x))cos(\theta_n x) dx  \text{ } (8)$$


$$\int_{-\pi}^{\pi} f(x)cos(\theta_n x)dx = \int_{-\pi}^{\pi}(\sum_{n=0}^{\infty}a_ncos(\theta_n x) + \sum_{n=0}^{\infty}b_nsin(\theta_n x))cos(\theta_n x) dx  \text{ } (9)$$

$$\int_{-\pi}^{\pi} f(x)cos(\theta_n x)dx = \int_{-\pi}^{\pi} a_ncos(\theta_k x)cos(\theta_n x) dx  \text{ } (10)$$

$$\int_{-\pi}^{\pi} f(x)cos(\theta_n x)dx = a_n \pi \text{ } (11)$$

$$ a_n = \frac{1}{\pi} \int_{-\pi}^{\pi} f(x)cos(\theta_n x)dx \text{ } (12)$$

$$ a_0 = \frac{1}{2\pi} \int_{-\pi}^{\pi} f(x)dx \text{ = average of f(x) } (13)$$


Tương tự, ta có $$b_n$$ được tính như sau:

$$ b_n = \frac{1}{\pi} \int_{-\pi}^{\pi} f(x)sin(\theta_n x)dx \text{ } (14)$$


Và sau khi có giá trị $$a_n \text{ và }  b_n$$, ta có thể phân tích bất kì dạng sóng nào thành một chuỗi sin và cos.

Ví dụ tính toán chuỗi Fourier:

Phân tích hàm dirac như hình dưới thành một chuỗi các sóng sin và cos

![Image](https://wikiwandv2-19431.kxcdn.com/_next/image?url=https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Dirac_distribution_PDF.svg/langvi-1500px-Dirac_distribution_PDF.svg.png&w=1200&q=50)


Như ở hình trên, có thể thấy rằng hàm dirac là hàm chẵn do $$f(x) = f(-x)$$, vậy nên sẽ không tồn tại các các hàm $$sin$$. Vì vậy, hàm dirac sẽ chỉ bao gồm các dạng sóng $$cos$$.

Dựa vào quan sát trên, ta khai triển như sau:

$$f(x) = a_0 +  \sum_{n=1}^{\infty}a_ncos(\theta_n x)$$

Như đã chứng minh ở trên, $$a_0$$ được tính bằng công thức:

$$ a_0 = \frac{1}{2\pi} \int_{-\pi}^{\pi} f(x)dx = \frac{1}{2 \pi} $$

$$a_n = \frac{1}{\pi} \int_{-\pi}^{\pi} f(x)cos(\theta_n x)dx = \frac{1}{\pi}$$

Biết được $$a_n$$ và $$a_0$$, ta có thể xấp xỉ hàm dirac:

$$\delta(x) = \frac{1}{2\pi} + \frac{1}{\pi}(cos(\frac{1}{2}x) + cos(x) + cos(\frac{3}{2}x) + cos(2x) + ...)$$

Ta được kết quả như sau nếu hiển thị nó matplotlib để trực quan hóa

![Alt text](image-5.png)




Sau khi phân tích một tín hiệu thu được thành một chuỗi tín hiệu sin và cos, giờ ta muốn tìm xem trong chuỗi đó có những loại tần số nào? Fourier Transform sẽ cho chúng ta biết điều này.




### 2. Fourier Transform

Fourier Transform chỉ đơn thuần là một phép biến đổi được triển khai từ chuỗi Fourier, nếu đã nắm chắc lý thuyết về chuỗi Fourier thì phần này sẽ rất dễ dàng với các bạn.

Ta bắt đầu từ phương trình (7) ở trên, chuỗi Fourier được biểu diễn gọn gàng với công thức như sau:


$$f(x) = \sum_{n = - \infty}^{\infty} C_n e^{-j \theta_n x}$$

Diễn giải bằng lời thì mỗi dạng sóng bất kì sẽ được phân tách thành một chuỗi tín hiệu với tần số góc $$\theta_n$$. $$C_n$$ được tạo thành từ số phức (như chứng minh ở trên), vì vậy hệ số này sẽ bao gồm biên độ (Magnitude) và pha (phase) của mỗi tín hiệu $$\theta_n$$. Và chỉ cần tìm ra hệ số $$C_n$$ này thì ta có thể dễ dàng tìm ra trong dạng sóng này có những biên độ và pha nào.

Theo như công thức thì ta có 3 trường hợp cho $$C_n$$:

$$C_{n-} = \frac{a_n - j b_n}{2}$$

$$C_{n+} = \frac{a_n + j b_n}{2}$$

$$C_0 = a_0$$

Ở biến đổi Fourier, ta chỉ quan tâm đến biên độ và tần số, vì vậy việc $$C_{n-}$$ hay $$C_{n+}$$ sẽ không ảnh hưởng tới kết quả cuối cùng bởi vì kết quả đã được scale về cùng một tiêu chuẩn. 

Ở bài này, mình sẽ chọn $$C_{n-} = \frac{a_n - j b_n}{2} \text{ } (13)$$

Ta thay (12) và (14) vào (13), được:

$$ <=> a_n - jb_n = \frac{1}{2 \pi} \int_{-\pi}^{\pi} f(x)(cos(kx) - jsin(kx))dx$$

Áp dụng định lý Euler, ta được dạng tổng quát sau:


$$ <=> C_n =  a_n - jb_n = \frac{1}{2 \pi} \int_{-\pi}^{\pi} f(x)e^{-jkx}dx$$







