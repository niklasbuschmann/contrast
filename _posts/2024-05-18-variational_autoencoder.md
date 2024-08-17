---
title: "Giải thích và code Variational AutoEncoder"
mathjax: true
layout: post
---

Xin chào các bạn!

Trong bài post này, mình sẽ giới thiệu về mô hình Variational AutoEncoder được công bố trong paper "[_Auto-Encoding Variational Bayes_][vae_paper]" của tác giả Diederik P. Kingma và các cộng sự. Đây là một kiến trúc tương tự như AutoEncoder và có thêm thành phần stochastic trong phần bottleneck để khiến cho nó có khả năng tạo ra những data mới lạ (tuy vẫn thuộc distribution của training dataset). 


### 1. Tổng quan 

Được chính thức published trong paper "_Auto-Encoding Variational Bayes_" vào năm 2014, Variational AutoEncoder đã tạo ra tiếng vang rất lớn và tạo ra một cú hích giúp ngày càng nhiều probabilistic models được nghiên cứu hơn. Trong paper của mình, tác giả đề cập tới kiến trúc tổng quan của mô hình, các công thức toán học chứng minh, và một vài tricks để  làm cho VAE có thể hoạt động được. Mình nói tricks để giúp cho model hoạt động được bởi nếu không có trick này thì chắc chắn VAE sẽ không work và các probabilistic models sau này cũng sẽ không phát triển mạnh như bây giờ. 

Về cơ bản, VAE được dùng để tạo ra các dữ liệu mới từ tập data training. Ngoài ra, mô hình còn giải quyết điểm yếu cố hữu của mô hình Auto-Encoder truyền thống trong việc generate data. Một chút về nhược điểm về Auto-Encoder, mô hình này bị ván đề **không sinh ra được data đa dạng và không có tính liên tục trong latent space**. Với sự ra mắt của VAE, 2 nhược điểm này đã hoàn toàn được khắc phục. 

<figure style="text-align: center">
<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwM6HreoBP1eVWUHsE92aN4LHy0ZW9tgNnjw&s" alt="">
<figcaption><b>Hình 1.1.</b> Ảnh được sinh ra từ VAE - Google</figcaption>
</figure>

### 2. Kiến trúc

<figure style="text-align: center">
<img src="https://theaisummer.com/static/25f603171034d2fc8f6a518b8537f85a/ee604/vae.png" alt="">
<figcaption><b>Hình 2.1.</b> Kiến trúc tổng quan của VAE</figcaption>
</figure>

Về cơ bản, kiến trúc VAE giống gần như 99% với Auto-Encoder. VAE cũng bao gồm encoder, bottleneck, decoder, tuy nhiên có một sự khác biệt ở bottleneck. Đó là ở bottleneck của VAE, nó sẽ có 2 output là mean và standard deviation thay vì chỉ có một output bottleneck như Auto-Encoder. Tuy nhiên, 2 khối này sẽ được kết hợp lại bằng các element-wise operations để  đưa vào decoder block tương tự như auto-encoder. 

### 3. Giải thích toán học 

VAE bao gồm 2 khối: Encoder, và Decoder. Khối encoder có nhiệm vụ nén và mã hóa thông tin trong khi khối decoder có nhiệm vụ khôi phục lại thông tin từ thông tin từ encoder. Việc này có thể được mô tả bằng toán học như sau:

$$\text{Encoder: } p(z|x) = \frac{p(x|z)p(z)}{p(x)}$$

$$\text{Decoder: } p(x|z) = \frac{p(z|x)p(x)}{p(z)}$$

Đáng tiếc, 2 công thức trên đều rất khó để tính toán vì các priors.

Cụ thể,

$$p(x) = \int p(x|z)p(z)dz$$

$$p(z) = \int p(z|x)p(x)dx$$

Nhìn vào 2 công thức trên, chúng ta có quan sát như sau. Để tính đươc p(x), ta phải quét qua toàn bộ các giá trị của latent space và để tính được p(z) ta phải quét qua toàn bộ các giá trị của data x. Nếu latent space và dataset của chúng ta > 1-D, điều này có thể khả thi, tuy nhiên chúng ta thường encode nó trong không gian lớn hơn rất nhiều so với 1D, vậy cần phải có cách khác. 

Cách mà tác giả đề xuất trong paper là dùng một hàm xấp xỉ (approximator) để tính các giá trị latent (z) và reconstructed data ($\hat{x}$). Cụ thể, chúng sẽ có biểu thức toán học như sau:

$$\text{Encoder: } p(z|x) = \frac{p(x|z)p(z)}{p(x)} \text{ (intractable)} => q_{\theta}(z|x)$$

$$\text{Decoder: } p(x|z) = \frac{p(z|x)p(x)}{p(z)} \text{ (intractable)} => q_{\phi}(x|z)$$

Trong công thức tính của Encoder đã bao gồm Decoder và ngược lại, vì vậy chúng ta chỉ cần tối ưu một trong hai khối và khối còn lại sẽ tự động được tối ưu. Trong paper của tác giả, họ chọn tối ưu Decoder nên trong post này mình cũng sẽ sử dụng Encoder để align với tác giả.

Vì chúng ta muốn hàm Encoder $q_{\theta}(z|x)$ xấp xỉ giống y hệt như hàm intractable $p(z|x)$ nên ta sẽ có hàm mục tiêu như sau:

$$\underset{\theta, \phi}{\text{Minimise }} D_{KL}(q_{\theta}(z|x)||p(z|x)) \text{ (1)}$$

$$\underset{\theta, \phi}{\text{Minimise }} \mathbb{E}_{q_{\theta}(z|x)}[log(\frac{q_{\theta}(z|x)}{p(z|x)})] \text{ (2)}$$

$$\underset{\theta, \phi}{\text{Minimise }} \mathbb{E}_{q_{\theta}(z|x)}[log(q_{\theta}(z|x)) - log(p(x, z))] + log(p(x)) \text{ (3)}$$

$p(x)$ có thể bị lược ra khỏi hàm loss vì nó không có params tối ưu và không có công dụng nào. Tuy nhiên, ở phần dưới sẽ có một trường hợp không có params tối ưu nhưng vẫn được giữ lại. 

$$\underset{\theta, \phi}{\text{Minimise }} \mathbb{E}_{q_{\theta}(z|x)}[log(q_{\theta}(z|x)) - log(p_{\phi}(x|z)) - log(p(z))] \text{ (4)}$$

$$\underset{\theta, \phi}{\text{Minimise }}\mathbb{E}_{q_{\theta}(z|x)}[log(\frac{q_{\theta}(z|x)}{p(z)}) - log(p_{\phi}(x|z))] \text{ (5)}$$

$$\underset{\theta, \phi}{\text{Minimise }} \mathbb{E}_{q_{\theta}(z|x)}[-log(p_{\phi}(x|z))] + D_{KL}(q_{\theta}(z|x)||p(z)) \text{ (6)}$$

Ta có gradient của phương trình trên với 2 biến $\phi$ và $\theta$ như sau: 

$$\nabla_{\phi}\mathbb{E}_{q_{\theta}(z|x)}[-log(p_{\phi}(x|z))] + D_{KL}(q_{\theta}(z|x)||p(z)) = \nabla_{\phi}-log(p_{\phi}(x|z)) \text{ (7)}$$

$$\nabla_{\theta}\mathbb{E}_{q_{\theta}(z|x)}[-log(p_{\phi}(x|z))] + D_{KL}(q_{\theta}(z|x)||p(z)) ≠ \nabla_{\theta}D_{KL}(q_{\theta}(z|x)||p(z)) \text{ (8)}$$

Ở phương trình (7), gradient có thể được tính dễ dàng nhờ vào Monte Carlo. Tuy nhiên, ở phương trình (8), ta không thể xấp xỉ bằng Monte Carlo do vướng phải parameter $\theta$ ở phần expectation. Nếu phần phân phối tính expectation dựa vào $\theta$ được thay bằng một biến nào đó không liên quan thì phương trình (8) sẽ đơn giản trở thành tối ưu KL divergence. 

Để giải quyết vấn đề này, tác giả của paper đã đề xuất reparameterisation trick. Ý tưởng của phương pháp này như sau:

Giả sử ta có một biến $z \sim N(\mu, \sigma^2)$, ta có thể biểu diễn nó như sau:

$$z = \mu + \sigma^2 * \epsilon$$

$$\text{Với } \epsilon \sim N(\mathbf{0}, I)$$

Dựa vào reparameterisation trick, ta sẽ áp dụng như sau:

$$z = g_{\theta}(x, \epsilon) =  \mu_{\theta}(x) + \sigma_{\theta}^2(x) * \epsilon$$

$$\text{Với } \epsilon \sim N(\mathbf{0}, I)$$

<figure style="text-align: center">
<img src="https://dilithjay.com/assets/images/reparam-trick.png" alt="">
<figcaption><b>Hình 3.1.</b> Minh họa cách hoạt động của Reparameterisation trick</figcaption>
</figure>

Áp dụng reparameterisation trick, ta biến đổi lại phương trình (8) như sau:

$$\nabla_{\theta}\mathbb{E}_{p(\epsilon)}[-log(p_{\phi}(x|z = g_{\theta}(x, \epsilon)))] + D_{KL}(q_{\theta}(z|x)||p(z)) ≠ \nabla_{\theta}D_{KL}(q_{\theta}(z = g_{\theta}(x, \epsilon)|x)||p(z)) \text{ (9)}$$

Với Expectation không còn $\theta$ trong (9), chúng ta có thể tính gradient một cách dễ dàng như sau:

$$\nabla_{\theta}\mathbb{E}_{p(\epsilon)}[-log(p_{\phi}(x|z = g_{\theta}(x, \epsilon)))] + D_{KL}(q_{\theta}(z = g_{\theta}(x, \epsilon))||p(z)) = \nabla_{\theta}D_{KL}(q_{\theta}(z = g_{\theta}(x, \epsilon))||p(z)) \text{ (10)}$$




### 4. Code VAE với Python và Pytorch

### 5. Kết luận 






[vae_paper]: https://arxiv.org/abs/1312.6114