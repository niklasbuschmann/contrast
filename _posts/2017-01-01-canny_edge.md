---
title:  "Giải thích và code giải thuật Canny Edge Detection"
mathjax: true
layout: post
categories: media
---


<!-- Structure
1. Introduction to Canny Edge detection
    + The preceeding methods
    + The efficiency of Canny over other methods

2. Overview of how it works and code 

3. Advantages & Disadvantages of Canny Edge Detection
4. Conclusion
5. Reference

 -->

Xin chào các bạn

Trong bài post này mình sẽ nói về giải thuật phát hiện cạnh Canny. Nó được phát triển bởi John F. Canny vào năm 1986. Canny cũng đưa ra một lý thuyết tính toán về phát hiện cạnh giải thích tại sao kỹ thuật này hoạt động.

Thuật toán phát hiện cạnh Canny bao gồm 5 bước:
* Giảm nhiễu 
* Tính toán gradient độ xám của ảnh;
* Áp dụng Non-maximum suppression;
* Ngưỡng kép (Double threshold);
* Theo dõi cạnh bằng độ trễ (Edge Tracking by Hysteresis)


1. Giảm nhiễu dùng Gaussian filter or Box Filter
2. Tính toán Gradient độ xám
    Smoothened image is then filtered with a Sobel kernel in both horizontal and vertical direction to get first derivative in horizontal direction (G_x) and vertical direction (G_y). From these two images, we can find edge gradient and direction for each pixel as follows:

3. Non Maximum Suppression
    After getting gradient magnitude and direction, a full scan of image is done to remove any unwanted pixels which may not constitute the edge. For this, at every pixel, pixel is checked if it is a local maximum. For this, at every pixel, pixel is checked if it is local maximum in its neighbourhood in the direction of gradient. Check the image below:

    Point A is on the edge (in vertical direction). Gradient direction is normal to the edge. Point B and C are in gradient directions. So point A is checked with point B and C to see if it forms a local maximum. If so, it is considered for next stage, otherwise, it is suppressed (put to zero).

4. Ngưỡng kép (Double threshold)
    This stage decides which are all edges are really edges and which are not. For this, we need two threshold values, minVal and maxVal. Any edges with intensity gradient more than maxVal are sure to be edges and those below minVal are sure to be non-edges, so discarded. Those who lie between these two thresholds are classified edges or non-edges based on their connectivity. If they are connected to "sure-edge" pixels, they are considered to be part of edges. Otherwise, they are also discarded. 

    This stage also removes small pixels noises on the assumption that edges are long lines.
5. Edge tracking by Hysteresis