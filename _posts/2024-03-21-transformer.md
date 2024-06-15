---
title: "Giải thích và code Transformers"
mathjax: true
layout: post
---

Xin chào các bạn!

Trong bài post này, mình sẽ giới thiệu về kiến trúc transformers. Đây được xem là một trong những model có tính cách mạng nhất trong deep learning vì nó đã tạo tiền đề cho sự ra đời của các mô hình ngôn ngữ lớn hay các mô hình SOTA cho các task như speech recognition, computer vision, ...

### 1. Một chút về lịch sử của transformers 

Mô hình này được ra mắt nhằm thay thế cho kiến trúc Recurrent neural networks (RNNs), vốn đã được ra mắt vào những năm 90. Sơ lược thì kiến trúc recurrent này được thiết kế ra nhằm xử lý các loại thông tin có thứ tự như text, speech. Tuy nhiên, kiến trúc này có nhược điểm là vấn đề về  **exploding/vanishing gradient** khi training nên nó không thể xử lý một đoạn thông tin quá dài. Vì những lý do đó mà Large language models không tồn tại trước khi transformer được ra mắt. 

Đến năm 2014, một nhóm nghiên cứu ở Google đã nghiên cứu những phương pháp để khắc phục vấn đề trên của RNNs và đề xuất kiến trúc transformers. Chỉ sau 10 năm ra mắt, những thành tựu đạt được từ kiến trúc transformers nhiều không xuể với sự ra mắt của các mô hình ngôn ngữ lớn như ChatGPT, Llama3, Segment Anything, ...


### 2. Ý tưởng chính của transformers 

Ý tưởng chính của Transformers là cách sử dụng thông minh và khéo léo các phép tính toán song song (như nhân ma trận, ánh xạ, ...) để thay thế các tính toán kiểu one-by-one của RNNs nhằm giải quyết vấn đề **exploding/vanishing gradient**.


### 2.1. Positional embedding

Transformers xử lý text một cách song song thay vì tuần tự như kiểu RNN, tức là nó sẽ cho nguyên cả đoạn text vào input cho 1 lần xử lý thay vì chia ra thành các timestep. Và vì trong các tín hiệu tuần tự thì thứ tự là một thông tin rất quan trọng. Ví dụ như "xin chào bạn" và nếu ta cho nó một thứ tự khác thì sẽ được câu như "chào xin bạn", "bạn xin chào". Như vậy, **thứ tự có tính chất rất quan trọng để giữ lại được ngữ nghĩa của input**. Khi xử lý tuần tự như kiểu RNNs thì ta không cần thông tin thứ tự vì timestep vốn đã là thứ tự rồi. Tuy nhiên đối với mô hình xử lý cả câu, cả đoạn một lúc như transformers thì phải có một thông tin thứ tự được chèn thêm vào để giúp mô hình này có thể biết được vị trí chính xác của từng từ trong input. Ashish Vaswani (1st author của paper) đã dùng một phương pháp để thực hiện việc này có tên là **positional embedding**. 


* **Công thức toán học của Positional Embedding**

$$PE_{(pos, 2i)} = sin(\frac{pos}{10000^{\frac{2i}{d_{model}}}})$$


$$PE_{(pos, 2i + 1)} = cos(\frac{pos}{10000^{\frac{2i}{d_{model}}}})$$

Với,

$$pos: \text{Vị trí của phần từ trong input. Ex: 1, 2, ..., sequence length}$$

$$i: \text{Dimension thứ i của phần từ trong input: Ex: 1, 2, ...,} d_{model}$$

$$d_{model}: \text{Số dimension của input. Ex: 128 or 256 or 512 or any number}$$

### 2.2. Self-Attention

Trong các dữ liệu tuần tự như kiểu văn bản thì ngữ nghĩa của một từ ngoài phụ thuộc vào chính nó mà còn phụ thuộc vào các element đứng trước và sau. Ví dụ trong 2 câu sau "book a room" và "book in the room" thì từ book có 2 nghĩa hoàn toàn khác nhau. Để có thể phân biệt được từ "book" trong câu có nghĩa là _đặt_ hay là _quyển sách_, ta phải dựa vào các từ kế bên trái và phải để có thể biết được. Và vì cần một cơ chế để có thể giúp nhận ra nghĩa của từ hiện tại dựa vào các từ bên cạnh, tác giá đã đề xuất cơ chế **self-attention**. 

Một cách ngắn gọn, cơ chế self-attention giúp xác định ngữ nghĩa của 1 từ trong câu rõ ràng hơn. Self-attention cho biết sự "liên quan" của từ hiện tại với các từ còn lại trong input. Ví dụ self-attention của một input là text sẽ có dạng như sau:

<figure style="text-align: center">
<img src="https://1.bp.blogspot.com/-AVGK0ApREtk/WaiAuzddKVI/AAAAAAAAB_A/WPV5ropBU-cxrcMpqJBFHg73K9NX4vywwCLcBGAs/s1600/image2.png" alt="Kiến trúc của LeNet-5 và AlexNet">
<figcaption><b>Hình 2.2.1.</b> Ví dụ minh họa về self-attention - Google</figcaption>
</figure>

Ở câu trong hình trên, chỉ khác nhau ở 2 từ ở cuối câu là "tired" và "wide". Nếu từ cuối cùng là "tired" thì từ "it" có attention score cao nhất (đường càng đậm thì có giá trị càng lớn) ở từ animal (ám chỉ rằng nó đang nói về animal) trong khi đó nếu từ cuối cùng là "wide" thì từ "it" sẽ có attention score cao nhất ở từ "street" nhằm ám chỉ rằng từ này đang có liên quan nhiều với từ "street" trong câu. 

Nhờ có kiến trúc self-attention này, các ngữ nghĩa của 1 từ và các thông tin xung quanh được tích hợp lại một cách chặt chẽ đóng vai trò chính trong sự vượt trội của mô hình transformers so với các mô hình tiền nhiệm nó. 


* **Công thức toán học của Self-Attention**

$$Attention(Q, K, V) = softmax(\frac{QK^{T}}{\sqrt d_k})V$$

Trong đó,

$$Q: Query, \R ^ {N \times d_k}$$

$$K: Key, \R ^ {N \times d_k}$$

$$V: Value, \R ^ {N \times d_v }$$

$$d_k: \text{Key dimension}$$


### 2.3. Multi Head Attention

Trong paper của mình, tác giả Ashish Vaswani cho rằng việc dùng thêm Linear layer để ánh xạ nó lên một không gian có h x d_embedding rồi thực hiện self-attention trên h x d_embedding đó sẽ "_jointly attend to information from different representation
subspaces at different positions_". Mình không biết dịch đúng nghĩa đoạn trên như thế nào, nhưng ý tác giả muốn truyền tải rằng việc này sẽ giúp thông tin trong input kết nối với nhau ở nhiều chiều không gian hơn.

Với Multi Head Attention, tác giả dùng nhiều khối self-attention rồi ghép nối kết quả lại với nhau. Cụ thể, tác giả sẽ dùng _h_ khối self-attention cho Q, K, V và sau đó concat kết quả cuối cùng. 

<figure style="text-align: center">
<img src="https://media.geeksforgeeks.org/wp-content/uploads/20240110170625/Scaled-Dot-Product-and-Multi-Head-Attentions.webp" alt="">
<figcaption><b>Hình 2.3.1.</b> Khối self-attention (trái) và multi head attention (phải) </figcaption>
</figure>

* **Công thức toán học của Multi Head Attention**

$$MultiHead(Q, K, V) = Concat(head_1, ..., head_h)W^O$$

Với, 

$$head_i = Self Attention(QW_i^Q, KW_i^K, VW_i^V)$$

Trong đó,

$$W_i^Q \in \R^{d_{model} \times d_k}, W_i^K \in \R ^{d_{model} \times d_k}, W_i^V \in \R ^{d_{model} \times d_v}, W^O \in \R^{hd_v \times d_{model}}$$



### 3. Xây dựng và train transformer với Pytorch

Trong phần này, mình sẽ xây dựng kiến trúc transformer from scratch và train nó với 2 tasks để có thể giúp các bạn hiểu hơn về chi tiết về mô hình cũng như cách hoạt động của transformers trong NLP. 

### 3.1. Xây dựng mô hình transformer

Kiến trúc tổng quan của transformers bao gồm 2 phần: **Encoder** và **Decoder**. 

**Nói thêm đoạn này: Autoregressive, encoder meaning and decoder meaning**

<figure style="text-align: center">
<img src="https://machinelearningmastery.com/wp-content/uploads/2021/08/attention_research_1.png" alt="">
<figcaption><b>Hình 3.1.1.</b> Kiến trúc tổng quan của mô hình Transformer - Paper </figcaption>
</figure>

### 3.1.1. Multi-Head Attention

### 3.1.2. Add & Norm Layer

### 3.1.3. Feed Forward Layer


### 3.2. Huấn luyện và chạy mô hình transformer cho classification task

### 3.3. Huấn luyện và chạy mô hình transformer để dịch tiếng Anh sang Tây Ban Nha


### 4. Lời kết




### References

1\. [Attention is all you need - arXiv][paper]

2\. [Positional embeddings in transformers EXPLAINED | Demystifying positional encodings - Youtube][positional embedding]

3\. [Self Attention in Transformer Neural Networks (with Code!) - Youtube][self-attention]




[paper]: https://arxiv.org/pdf/1706.03762
[positional embedding]: https://www.youtube.com/watch?v=1biZfFLPRSY&t=239s
[self-attention]: https://www.youtube.com/watch?v=QCJQG4DuHT0
