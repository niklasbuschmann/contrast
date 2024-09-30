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

<!-- 
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
&\propto \exp \Big(-\frac{1}{2} \big(\frac{(\mathbf{x}_t - \sqrt{\alpha_t} \mathbf{x}_{t-1})^2}{\beta_t} + \frac{(\mathbf{x}_{t-1} - \sqrt{\bar{\alpha}_{t-1}} \mathbf{x}_0)^2}{1-\bar{\alpha}_{t-1}} - \frac{(\mathbf{x}_t - \sqrt{\bar{\alpha}_t} \mathbf{x}_0)^2}{1-\bar{\alpha}_t} \big) \Big) \\
&= \exp \Big(-\frac{1}{2} \big(\frac{\mathbf{x}_t^2 - 2\sqrt{\alpha_t} \mathbf{x}_t{\mathbf{x}_{t-1}} {+ \alpha_t} {\mathbf{x}_{t-1}^2} }{\beta_t} + \frac{{\mathbf{x}_{t-1}^2} {- 2 \sqrt{\bar{\alpha}_{t-1}} \mathbf{x}_0} {\mathbf{x}_{t-1}} {+ \bar{\alpha}_{t-1} \mathbf{x}_0^2}  }{1-\bar{\alpha}_{t-1}} - \frac{(\mathbf{x}_t - \sqrt{\bar{\alpha}_t} \mathbf{x}_0)^2}{1-\bar{\alpha}_t} \big) \Big) \\
&= \exp\Big( -\frac{1}{2} \big( {(\frac{\alpha_t}{\beta_t} + \frac{1}{1 - \bar{\alpha}_{t-1}})} \mathbf{x}_{t-1}^2 - {(\frac{2\sqrt{\alpha_t}}{\beta_t} \mathbf{x}_t + \frac{2\sqrt{\bar{\alpha}_{t-1}}}{1 - \bar{\alpha}_{t-1}} \mathbf{x}_0)} \mathbf{x}_{t-1} + C(\mathbf{x}_t, \mathbf{x}_0) \big) \Big)
\end{aligned}$$

Trong đó $C(\mathbf{x}_t, \mathbf{x}_0)$ là một hàm không liên quan đến $\mathbf{x}_{t-1}$ và bị lược bỏ. Theo hàm mật độ của phân phối Gaussian chuẩn, giá trị trung bình và phương sai có thể được tham số hóa như sau (nhớ rằng $\alpha_t = 1 - \beta_t$ và $\bar{\alpha}_t = \prod_{i=1}^T \alpha_i$):

$$\begin{aligned}
\tilde{\beta}_t 
&= 1/(\frac{\alpha_t}{\beta_t} + \frac{1}{1 - \bar{\alpha}_{t-1}}) 
= 1/(\frac{\alpha_t - \bar{\alpha}_t + \beta_t}{\beta_t(1 - \bar{\alpha}_{t-1})})
= {\frac{1 - \bar{\alpha}_{t-1}}{1 - \bar{\alpha}_t} \cdot \beta_t} \\
\tilde{\boldsymbol{\mu}}_t (\mathbf{x}_t, \mathbf{x}_0)
&= (\frac{\sqrt{\alpha_t}}{\beta_t} \mathbf{x}_t + \frac{\sqrt{\bar{\alpha}_{t-1} }}{1 - \bar{\alpha}_{t-1}} \mathbf{x}_0)/(\frac{\alpha_t}{\beta_t} + \frac{1}{1 - \bar{\alpha}_{t-1}}) \\
&= (\frac{\sqrt{\alpha_t}}{\beta_t} \mathbf{x}_t + \frac{\sqrt{\bar{\alpha}_{t-1} }}{1 - \bar{\alpha}_{t-1}} \mathbf{x}_0) {\frac{1 - \bar{\alpha}_{t-1}}{1 - \bar{\alpha}_t} \cdot \beta_t} \\
&= \frac{\sqrt{\alpha_t}(1 - \bar{\alpha}_{t-1})}{1 - \bar{\alpha}_t} \mathbf{x}_t + \frac{\sqrt{\bar{\alpha}_{t-1}}\beta_t}{1 - \bar{\alpha}_t} \mathbf{x}_0\\
\end{aligned}$$

Nhờ vào tính chất thú vị này, chúng ta có thể biểu diễn $\mathbf{x}_0 = \frac{1}{\sqrt{\bar{\alpha}_t}}(\mathbf{x}_t - \sqrt{1 - \bar{\alpha}_t}\boldsymbol{\epsilon}_t)$ và thay vào phương trình trên để thu được:

$$\begin{aligned}
\tilde{\boldsymbol{\mu}}_t
&= \frac{\sqrt{\alpha_t}(1 - \bar{\alpha}_{t-1})}{1 - \bar{\alpha}_t} \mathbf{x}_t + \frac{\sqrt{\bar{\alpha}_{t-1}}\beta_t}{1 - \bar{\alpha}_t} \frac{1}{\sqrt{\bar{\alpha}_t}}(\mathbf{x}_t - \sqrt{1 - \bar{\alpha}_t}\boldsymbol{\epsilon}_t) \\
&= {\frac{1}{\sqrt{\alpha_t}} \Big( \mathbf{x}_t - \frac{1 - \alpha_t}{\sqrt{1 - \bar{\alpha}_t}} \boldsymbol{\epsilon}_t \Big)}
\end{aligned}$$

#### 2.3. Loss function 

$$\begin{aligned}
- \log p_\theta(\mathbf{x}_0) 
&\leq - \log p_\theta(\mathbf{x}_0) + D_\text{KL}(q(\mathbf{x}_{1:T}\vert\mathbf{x}_0) \| p_\theta(\mathbf{x}_{1:T}\vert\mathbf{x}_0) ) \\
&= -\log p_\theta(\mathbf{x}_0) + \mathbb{E}_{\mathbf{x}_{1:T}\sim q(\mathbf{x}_{1:T} \vert \mathbf{x}_0)} \Big[ \log\frac{q(\mathbf{x}_{1:T}\vert\mathbf{x}_0)}{p_\theta(\mathbf{x}_{0:T}) / p_\theta(\mathbf{x}_0)} \Big] \\
&= -\log p_\theta(\mathbf{x}_0) + \mathbb{E}_q \Big[ \log\frac{q(\mathbf{x}_{1:T}\vert\mathbf{x}_0)}{p_\theta(\mathbf{x}_{0:T})} + \log p_\theta(\mathbf{x}_0) \Big] \\
&= \mathbb{E}_q \Big[ \log \frac{q(\mathbf{x}_{1:T}\vert\mathbf{x}_0)}{p_\theta(\mathbf{x}_{0:T})} \Big] \\
\text{Let }L_\text{VLB} 
&= \mathbb{E}_{q(\mathbf{x}_{0:T})} \Big[ \log \frac{q(\mathbf{x}_{1:T}\vert\mathbf{x}_0)}{p_\theta(\mathbf{x}_{0:T})} \Big] \geq - \mathbb{E}_{q(\mathbf{x}_0)} \log p_\theta(\mathbf{x}_0)
\end{aligned}$$

$$\begin{aligned}
L_\text{VLB} 
&= \mathbb{E}_{q(\mathbf{x}_{0:T})} \Big[ \log\frac{q(\mathbf{x}_{1:T}\vert\mathbf{x}_0)}{p_\theta(\mathbf{x}_{0:T})} \Big] \\
&= \mathbb{E}_q \Big[ \log\frac{\prod_{t=1}^T q(\mathbf{x}_t\vert\mathbf{x}_{t-1})}{ p_\theta(\mathbf{x}_T) \prod_{t=1}^T p_\theta(\mathbf{x}_{t-1} \vert\mathbf{x}_t) } \Big] \\
&= \mathbb{E}_q \Big[ -\log p_\theta(\mathbf{x}_T) + \sum_{t=1}^T \log \frac{q(\mathbf{x}_t\vert\mathbf{x}_{t-1})}{p_\theta(\mathbf{x}_{t-1} \vert\mathbf{x}_t)} \Big] \\
&= \mathbb{E}_q \Big[ -\log p_\theta(\mathbf{x}_T) + \sum_{t=2}^T \log \frac{q(\mathbf{x}_t\vert\mathbf{x}_{t-1})}{p_\theta(\mathbf{x}_{t-1} \vert\mathbf{x}_t)} + \log\frac{q(\mathbf{x}_1 \vert \mathbf{x}_0)}{p_\theta(\mathbf{x}_0 \vert \mathbf{x}_1)} \Big] \\
&= \mathbb{E}_q \Big[ -\log p_\theta(\mathbf{x}_T) + \sum_{t=2}^T \log \Big( \frac{q(\mathbf{x}_{t-1} \vert \mathbf{x}_t, \mathbf{x}_0)}{p_\theta(\mathbf{x}_{t-1} \vert\mathbf{x}_t)}\cdot \frac{q(\mathbf{x}_t \vert \mathbf{x}_0)}{q(\mathbf{x}_{t-1}\vert\mathbf{x}_0)} \Big) + \log \frac{q(\mathbf{x}_1 \vert \mathbf{x}_0)}{p_\theta(\mathbf{x}_0 \vert \mathbf{x}_1)} \Big] \\
&= \mathbb{E}_q \Big[ -\log p_\theta(\mathbf{x}_T) + \sum_{t=2}^T \log \frac{q(\mathbf{x}_{t-1} \vert \mathbf{x}_t, \mathbf{x}_0)}{p_\theta(\mathbf{x}_{t-1} \vert\mathbf{x}_t)} + \sum_{t=2}^T \log \frac{q(\mathbf{x}_t \vert \mathbf{x}_0)}{q(\mathbf{x}_{t-1} \vert \mathbf{x}_0)} + \log\frac{q(\mathbf{x}_1 \vert \mathbf{x}_0)}{p_\theta(\mathbf{x}_0 \vert \mathbf{x}_1)} \Big] \\
&= \mathbb{E}_q \Big[ -\log p_\theta(\mathbf{x}_T) + \sum_{t=2}^T \log \frac{q(\mathbf{x}_{t-1} \vert \mathbf{x}_t, \mathbf{x}_0)}{p_\theta(\mathbf{x}_{t-1} \vert\mathbf{x}_t)} + \log\frac{q(\mathbf{x}_T \vert \mathbf{x}_0)}{q(\mathbf{x}_1 \vert \mathbf{x}_0)} + \log \frac{q(\mathbf{x}_1 \vert \mathbf{x}_0)}{p_\theta(\mathbf{x}_0 \vert \mathbf{x}_1)} \Big]\\
&= \mathbb{E}_q \Big[ \log\frac{q(\mathbf{x}_T \vert \mathbf{x}_0)}{p_\theta(\mathbf{x}_T)} + \sum_{t=2}^T \log \frac{q(\mathbf{x}_{t-1} \vert \mathbf{x}_t, \mathbf{x}_0)}{p_\theta(\mathbf{x}_{t-1} \vert\mathbf{x}_t)} - \log p_\theta(\mathbf{x}_0 \vert \mathbf{x}_1) \Big] \\
&= \mathbb{E}_q [\underbrace{D_\text{KL}(q(\mathbf{x}_T \vert \mathbf{x}_0) \parallel p_\theta(\mathbf{x}_T))}_{L_T} + \sum_{t=2}^T \underbrace{D_\text{KL}(q(\mathbf{x}_{t-1} \vert \mathbf{x}_t, \mathbf{x}_0) \parallel p_\theta(\mathbf{x}_{t-1} \vert\mathbf{x}_t))}_{L_{t-1}} \underbrace{- \log p_\theta(\mathbf{x}_0 \vert \mathbf{x}_1)}_{L_0} ]
\end{aligned}$$

$$\begin{aligned}
L_\text{VLB} &= L_T + L_{T-1} + \dots + L_0 \\
\text{where } L_T &= D_\text{KL}(q(\mathbf{x}_T \vert \mathbf{x}_0) \parallel p_\theta(\mathbf{x}_T)) \\
L_t &= D_\text{KL}(q(\mathbf{x}_t \vert \mathbf{x}_{t+1}, \mathbf{x}_0) \parallel p_\theta(\mathbf{x}_t \vert\mathbf{x}_{t+1})) \text{ for }1 \leq t \leq T-1 \\
L_0 &= - \log p_\theta(\mathbf{x}_0 \vert \mathbf{x}_1)
\end{aligned}$$

Mỗi thành phần KL trong $L_\text{VLB}$ (ngoại trừ $L_0$) so sánh hai phân phối Gaussian và do đó chúng có thể được tính toán dưới dạng closed-form. $L_T$ là hằng số và có thể bị bỏ qua trong quá trình huấn luyện vì $q$ không có tham số có thể học được và là một nhiễu Gaussian.

Hãy nhớ rằng chúng ta cần học một mạng neural để xấp xỉ các phân phối xác suất có điều kiện trong reverse process, $p_\theta(\mathbf{x}_{t-1} \vert \mathbf{x}_t) = \mathcal{N}(\mathbf{x}_{t-1}; \boldsymbol{\mu}_\theta(\mathbf{x}_t, t), \boldsymbol{\Sigma}_\theta(\mathbf{x}_t, t))$. Chúng ta muốn huấn luyện $\boldsymbol{\mu}_\theta$ để dự đoán $\tilde{\boldsymbol{\mu}}_t = \frac{1}{\sqrt{\alpha_t}} \Big( \mathbf{x}_t - \frac{1 - \alpha_t}{\sqrt{1 - \bar{\alpha}_t}} \boldsymbol{\epsilon}_t \Big)$. Vì $\mathbf{x}_t$ có sẵn như đầu vào trong thời gian huấn luyện, chúng ta có thể tái tham số hóa thành phần nhiễu Gaussian thay vào đó để nó dự đoán $\boldsymbol{\epsilon}_t$ từ đầu vào $\mathbf{x}_t$ tại timestep $t$:

$$\begin{aligned}
\boldsymbol{\mu}_\theta(\mathbf{x}_t, t) &= {\frac{1}{\sqrt{\alpha_t}} \Big( \mathbf{x}_t - \frac{1 - \alpha_t}{\sqrt{1 - \bar{\alpha}_t}} \boldsymbol{\epsilon}_\theta(\mathbf{x}_t, t) \Big)} \\
\text{Thus }\mathbf{x}_{t-1} &= \mathcal{N}(\mathbf{x}_{t-1}; \frac{1}{\sqrt{\alpha_t}} \Big( \mathbf{x}_t - \frac{1 - \alpha_t}{\sqrt{1 - \bar{\alpha}_t}} \boldsymbol{\epsilon}_\theta(\mathbf{x}_t, t) \Big), \boldsymbol{\Sigma}_\theta(\mathbf{x}_t, t))
\end{aligned}$$

Hàm loss $L_t$ được tham số hóa để tối thiểu hóa sự khác biệt từ $\tilde{\boldsymbol{\mu}}$:

$$\begin{aligned}
L_t 
&= \mathbb{E}_{\mathbf{x}_0, \boldsymbol{\epsilon}} \Big[\frac{1}{2 \| \boldsymbol{\Sigma}_\theta(\mathbf{x}_t, t) \|^2_2} \| {\tilde{\boldsymbol{\mu}}_t(\mathbf{x}_t, \mathbf{x}_0)} - {\boldsymbol{\mu}_\theta(\mathbf{x}_t, t)} \|^2 \Big] \\
&= \mathbb{E}_{\mathbf{x}_0, \boldsymbol{\epsilon}} \Big[\frac{1}{2  \|\boldsymbol{\Sigma}_\theta \|^2_2} \| {\frac{1}{\sqrt{\alpha_t}} \Big( \mathbf{x}_t - \frac{1 - \alpha_t}{\sqrt{1 - \bar{\alpha}_t}} \boldsymbol{\epsilon}_t \Big)} - {\frac{1}{\sqrt{\alpha_t}} \Big( \mathbf{x}_t - \frac{1 - \alpha_t}{\sqrt{1 - \bar{\alpha}_t}} \boldsymbol{\boldsymbol{\epsilon}}_\theta(\mathbf{x}_t, t) \Big)} \|^2 \Big] \\
&= \mathbb{E}_{\mathbf{x}_0, \boldsymbol{\epsilon}} \Big[\frac{ (1 - \alpha_t)^2 }{2 \alpha_t (1 - \bar{\alpha}_t) \| \boldsymbol{\Sigma}_\theta \|^2_2} \|\boldsymbol{\epsilon}_t - \boldsymbol{\epsilon}_\theta(\mathbf{x}_t, t)\|^2 \Big] \\
&= \mathbb{E}_{\mathbf{x}_0, \boldsymbol{\epsilon}} \Big[\frac{ (1 - \alpha_t)^2 }{2 \alpha_t (1 - \bar{\alpha}_t) \| \boldsymbol{\Sigma}_\theta \|^2_2} \|\boldsymbol{\epsilon}_t - \boldsymbol{\epsilon}_\theta(\sqrt{\bar{\alpha}_t}\mathbf{x}_0 + \sqrt{1 - \bar{\alpha}_t}\boldsymbol{\epsilon}_t, t)\|^2 \Big] 
\end{aligned}$$

Thực nghiệm, Ho và cộng sự (2020) phát hiện rằng việc huấn luyện mô hình diffusion hoạt động hiệu quả hơn với một mục tiêu đơn giản hóa mà bỏ qua hệ số trọng số:

$$\begin{aligned}
L_t^\text{simple}
&= \mathbb{E}_{t \sim [1, T], \mathbf{x}_0, \boldsymbol{\epsilon}_t} \Big[\|\boldsymbol{\epsilon}_t - \boldsymbol{\epsilon}_\theta(\mathbf{x}_t, t)\|^2 \Big] \\
&= \mathbb{E}_{t \sim [1, T], \mathbf{x}_0, \boldsymbol{\epsilon}_t} \Big[\|\boldsymbol{\epsilon}_t - \boldsymbol{\epsilon}_\theta(\sqrt{\bar{\alpha}_t}\mathbf{x}_0 + \sqrt{1 - \bar{\alpha}_t}\boldsymbol{\epsilon}_t, t)\|^2 \Big]
\end{aligned}$$


### 3. Kết luận 

Diffusion model là một mô hình sinh dữ liệu dựa trên 2 quá trình tuần tự là _forward process_ và _reverse process_. Khác với các mô hình sinh dùng adversarial training như GAN hay surrogate loss như VAE, diffusion model thực hiện quá trình thêm nhiễu dần dần vào dữ liệu, sau đó học cách đảo ngược quá trình để tái tạo lại mẫu gốc từ nhiễu. Điều này giúp mô hình có thể tuần tự và chậm rãi sinh ra kết quả, vì vậy sự ổn định cũng được cải thiện hơn nhiều so với các phương pháp trước đó. Với tiềm năng vượt trội và tính đơn giản trong kiến trúc, các mô hình diffusion đã chứng tỏ hiệu quả cao trong việc sinh data.

Trong bài viết này, mình đã giới thiệu về diffusion model, cách hoạt động, và các chi tiết toán học của nó. Hy vọng các bạn cảm thấy hữu ích. Chúc các bạn học tốt!. 

**P/s**: Bài viết được lấy chủ yếu từ blog tuyệt vời của Lilian blog và được bổ sung thêm một vài chi tiết toán để giúp các công thức toán nhẹ nhàng hơn so với bài viết gốc. Vì vậy, xin chân thành cảm ơn Lilian Weng. 

### References
1\. [What are Diffusion Models? - Lil's blog][lil_blog]  
2\. [Diffusion Models | Paper Explanation | Math Explained][Diffusion Models | Paper Explanation | Math Explained]  


[lil_blog]: https://lilianweng.github.io/posts/2021-07-11-diffusion-models/
[Diffusion Models | Paper Explanation | Math Explained]: https://www.youtube.com/watch?v=HoKDTa5jHvg&t=1074s

 -->
