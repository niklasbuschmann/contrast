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

#### 2.1. Forward process 

Với một điểm dữ liệu được lấy mẫu từ phân phối dữ liệu thực $x_0 \sim q(x)$, chúng ta tiến hành _forward process_ bằng cách thêm một lượng nhỏ nhiễu Gaussian vào mẫu qua $T$ bước, tạo ra một chuỗi các mẫu bị nhiễu với cường độ tăng dần. Mức độ nhiễu ta thêm vào sẽ được định nghĩa bởi một scheduler $\{ \beta_t \in (0, 1) \}_{t=1}^T$. 

$$q(\mathbf{x}_t \vert \mathbf{x}_{t-1}) = \mathcal{N}(\mathbf{x}_t; \sqrt{1 - \beta_t} \mathbf{x}_{t-1}, \beta_t\mathbf{I}) \quad
q(\mathbf{x}_{1:T} \vert \mathbf{x}_0) = \prod^T_{t=1} q(\mathbf{x}_t \vert \mathbf{x}_{t-1})$$

Mẫu dữ liệu $x_0$ dần mất đi các đặc điểm nhận dạng khi timestep $t$ lớn dần. Cuối cùng, khi $T \rightarrow \infty$, $x_T$ tương đương với một phân phối Gaussian đẳng hướng (isotropic Gaussian).

Một tính chất thú vị của quá trình trên là chúng ta có thể lấy mẫu $x_t$ tại bất kỳ bước time step $t$ nào bằng cách sử dụng **reparameterisation trick**. Đặt $\alpha_t = 1 - \beta_t$, và $\bar{\alpha}_t = \prod^t_{i=1} \alpha_i$.

$$\begin{aligned}
\mathbf{x}_t 
&= \sqrt{\alpha_t}\mathbf{x}_{t-1} + \sqrt{1 - \alpha_t}\boldsymbol{\epsilon}_{t-1} & \text{ ;where } \boldsymbol{\epsilon}_{t-1}, \boldsymbol{\epsilon}_{t-2}, \dots \sim \mathcal{N}(\mathbf{0}, \mathbf{I}) \\
&= \sqrt{\alpha_t \alpha_{t-1}} \mathbf{x}_{t-2} + \sqrt{1 - \alpha_t \alpha_{t-1}} \bar{\boldsymbol{\epsilon}}_{t-2} & \text{ ;where } \bar{\boldsymbol{\epsilon}}_{t-2} \text{ merges two Gaussians (*).} \\
&= \dots \\
&= \sqrt{\bar{\alpha}_t}\mathbf{x}_0 + \sqrt{1 - \bar{\alpha}_t}\boldsymbol{\epsilon} \\
q(\mathbf{x}_t \vert \mathbf{x}_0) &= \mathcal{N}(\mathbf{x}_t; \sqrt{\bar{\alpha}_t} \mathbf{x}_0, (1 - \bar{\alpha}_t)\mathbf{I})
\end{aligned}$$

(*) Khi chúng ta gộp hai phân phối Gaussian với phương sai khác nhau $\mathcal{N}(\mathbf{0}, \sigma_1^2\mathbf{I})$ và $\mathcal{N}(\mathbf{0}, \sigma_2^2\mathbf{I})$ phân phối mới sẽ là $\mathcal{N}(\mathbf{0}, (\sigma_1^2 + \sigma_2^2)\mathbf{I})$. Ở đây, độ lệch chuẩn sau khi gộp là $\sqrt{(1 - \alpha_t) + \alpha_t (1-\alpha_{t-1})} = \sqrt{1 - \alpha_t\alpha_{t-1}}$. 

#### 2.2. Reverse process 

Nếu chúng ta có thể đảo ngược quá trình trên và lấy mẫu từ $q(\mathbf{x}_{t-1} \vert \mathbf{x}_t)$, chúng ta sẽ có thể tái tạo mẫu thực từ đầu vào nhiễu Gaussian, $\mathbf{x}_T \sim \mathcal{N}(\mathbf{0}, \mathbf{I})$. Lưu ý rằng nếu $\beta_t$ đủ nhỏ, $q(\mathbf{x}_{t-1} \vert \mathbf{x}_t)$ cũng sẽ là Gaussian. Tuy nhiên, chúng ta không thể dễ dàng ước lượng $q(\mathbf{x}_{t-1} \vert \mathbf{x}_t)$ vì nó cần tính prior $q(x_t)$ và việc này **intractable**, do đó chúng ta cần học một mô hình $p_\theta$ để xấp xỉ các xác suất có điều kiện này nhằm thực hiện quá trình khuếch tán ngược.

$$p_\theta(\mathbf{x}_{0:T}) = p(\mathbf{x}_T) \prod^T_{t=1} p_\theta(\mathbf{x}_{t-1} \vert \mathbf{x}_t) \quad
p_\theta(\mathbf{x}_{t-1} \vert \mathbf{x}_t) = \mathcal{N}(\mathbf{x}_{t-1}; \boldsymbol{\mu}_\theta(\mathbf{x}_t, t), \boldsymbol{\Sigma}_\theta(\mathbf{x}_t, t))$$

<figure style="text-align: center">
<img src="https://lilianweng.github.io/posts/2021-07-11-diffusion-models/diffusion-example.png" alt="">
</figure>

Điều đáng chú ý là $q_(x_{t-1}|x_t)$ có thể giải được khi được condition trên $x_0$:

$$q(\mathbf{x}_{t-1} \vert \mathbf{x}_t, \mathbf{x}_0) = \mathcal{N}(\mathbf{x}_{t-1}; {\tilde{\boldsymbol{\mu}}}(\mathbf{x}_t, \mathbf{x}_0), {\tilde{\beta}_t} \mathbf{I})$$

Áp dụng định lý Bayes, ta được: 

$$\begin{aligned}
q(\mathbf{x}_{t-1} \vert \mathbf{x}_t, \mathbf{x}_0) 
&= q(\mathbf{x}_t \vert \mathbf{x}_{t-1}, \mathbf{x}_0) \frac{ q(\mathbf{x}_{t-1} \vert \mathbf{x}_0) }{ q(\mathbf{x}_t \vert \mathbf{x}_0) } \\
&= \exp \Bigg(-\frac{1}{2} \Bigg( \frac{(\mathbf{x}_t - \sqrt{\alpha_t} \mathbf{x}_{t-1})^2}{\beta_t} + \frac{(\mathbf{x}_{t-1} - \sqrt{\bar{\alpha}_{t-1}} \mathbf{x}_0)^2}{1-\bar{\alpha}_{t-1}} \\
&\quad - \frac{(\mathbf{x}_t - \sqrt{\bar{\alpha}_t} \mathbf{x}_0)^2}{1-\bar{\alpha}_t} \Bigg) \Bigg) \\
&= \exp \Bigg(-\frac{1}{2} \Bigg( \frac{\mathbf{x}_t^2 - 2\sqrt{\alpha_t} \mathbf{x}_t{\mathbf{x}_{t-1}} {+ \alpha_t} {\mathbf{x}_{t-1}^2} }{\beta_t} \\
&\quad + \frac{{\mathbf{x}_{t-1}^2} {- 2 \sqrt{\bar{\alpha}_{t-1}} \mathbf{x}_0} {\mathbf{x}_{t-1}} {+ \bar{\alpha}_{t-1} \mathbf{x}_0^2}}{1-\bar{\alpha}_{t-1}} \\
&\quad - \frac{(\mathbf{x}_t - \sqrt{\bar{\alpha}_t} \mathbf{x}_0)^2}{1-\bar{\alpha}_t} \Bigg) \Bigg) \\
&= \exp \Bigg( -\frac{1}{2} \Bigg( \Bigg(\frac{\alpha_t}{\beta_t} + \frac{1}{1 - \bar{\alpha}_{t-1}}\Bigg) \mathbf{x}_{t-1}^2 \\
&\quad - \Bigg(\frac{2\sqrt{\alpha_t}}{\beta_t} \mathbf{x}_t + \frac{2\sqrt{\bar{\alpha}_{t-1}}}{1 - \bar{\alpha}_{t-1}} \mathbf{x}_0\Bigg) \mathbf{x}_{t-1} \\
&\quad + C(\mathbf{x}_t, \mathbf{x}_0) \Bigg) \Bigg)
\end{aligned}$$