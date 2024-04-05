---
title: "Giải thích và code paper mixup: BEYOND EMPIRACAL RISK MINIMIZATION với PyTorch "
layout: post
---


Xin chào các bạn!

Như tiêu đề của bài post thì hôm nay chúng ta sẽ cùng mổ xẻ paper "mixup: BEYOND EMPERICAL RISK MINIMIZATION" của tác giả Hongyi Zhang nhé. Paper này được published ở hội nghị ICLR 2018 với mục đích là để cải thiện performance của các mô hình classfication. 

### 1. Tóm tắt
Trong paper này, tác giả của bài báo giới thiệu một phương pháp augment ảnh mới được gọi là MixUp dùng cho image classification task. Với các mô hình học sâu thì data là sương sống, là nền móng để build một model tốt, và vì vậy kỹ thuật augment ảnh tốt sẽ là một yếu tố cực kì quan trọng.

### 2. Vấn đề
