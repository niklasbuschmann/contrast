---
title:  "Giải thích stable diffusion models"
mathjax: true
layout: post
categories: media
---


<figure style="text-align: center">
<img src="https://kodexolabs.com/wp-content/uploads/2024/07/How-does-Stable-Diffusion-work-Blog-Thumbnail_01.webp" alt="">
</figure>

Xin chào các bạn, 

Cho đến nay, mình đã viết về hai loại mô hình sinh dữ liệu, gồm GANs và VAE. Chúng đã cho thấy thành công lớn trong việc tạo ra các hình ảnh có chất lượng rất tốt, nhưng mỗi loại đều có những hạn chế riêng. Mô hình GAN thường gặp phải vấn đề bất ổn trong quá trình training và thiếu đa dạng trong quá trình sinh dữ liệu do bản chất adversarial learning của nó. VAE dựa vào một hàm loss xấp xỉ (surrogate loss). 

Mô hình Diffusion được lấy cảm hứng từ nhiệt động học phi cân bằng (Non-equilibrium thermodynamics). Chúng áp dụng Markov chain của các bước khuếch tán nhằm dần dần thêm random noise vào data, sau đó học cách đảo ngược quá trình khuếch tán để tạo ra các mẫu dữ liệu mong muốn từ nhiễu. Không giống như GANs và VAE, mô hình Diffusion được huấn luyện theo một quy trình cố định và latent dimension có dimension bằng với data.

<figure style="text-align: center">
<img src="https://lilianweng.github.io/posts/2021-07-11-diffusion-models/generative-overview.png" alt="">
</figure>

### 1. Mô hình Diffusion là gì và nó hoạt động như thế nào ?


Stable Diffusion là một loại mô hình tạo sinh dựa trên quá trình khuếch tán, hoạt động thông qua hai bước chính: forward process và reverse process.

Trong lúc training, diffusion được chia thành 2 quá trình: 

* **Forward process**: Dữ liệu gốc, như hình ảnh, dần bị thêm nhiễu qua nhiều bước. Mỗi bước làm cho dữ liệu trở nên ngày càng ngẫu nhiên hơn, đến khi đạt trạng thái gần giống như nhiễu thuần túy. Quá trình này được thực hiện theo chuỗi Markov, và mô hình không học trong giai đoạn này.

<figure style="text-align: center">
<img src="https://www.assemblyai.com/blog/content/images/size/w1000/2022/05/image.png
" alt="">
</figure>


* **Reverse process**: Mô hình học cách đảo ngược quá trình nhiễu, tái tạo lại dữ liệu gốc từ nhiễu. Thông qua mạng neural networks, mô hình predict các bước khử nhiễu ngược lại từng bước một, từ nhiễu ngẫu nhiên trở về dạng dữ liệu có cấu trúc, như hình ảnh rõ ràng.

<figure style="text-align: center">
<img src="https://www.assemblyai.com/blog/content/images/size/w1000/2022/05/image-1.png" alt="">
</figure>

Trong lúc inference, ta **chỉ sử dụng reverse process** bằng việc đưa vào nhiễu Gauss và mô hình sẽ trả kết quả là một tấm ảnh bất kì được sinh ra. 


### 2. Giải thích toán học