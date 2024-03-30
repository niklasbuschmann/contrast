---
title: "Giải thích về giải thuật resize ảnh"
layout: post
---


Xin chào các bạn!

Trong bài post này, mình sẽ giải thích về một vài phương pháp resize ảnh thông dụng nhất trong lĩnh vực computer vision. Chúng ta thường dùng các thư viện có sẵn trong cv2, pytorch, tensorflow, PIL, ... để resize ảnh nhưng phương pháp nào phù hợp nhất với nhu cầu cũng như phương pháp nào nhanh nhất, việc này chỉ có thể biết được khi chúng ta hiểu được thuật toán của nó và đó cũng chính là mục đích của bài post này.

![Image](https://www.techsmith.com/blog/wp-content/uploads/2022/03/resize-image.png)

### 1. Nearest Neighbour
Đây là thuật toán đơn giản nhất trong tất cả các thuật toán resize ảnh và cũng là thuật toán cho tốc độ xử lý nhanh nhất. Về cơ bản, phương pháp Nearest Neighbour sao chép giá trị pixel gần nhất với ảnh cần được resize. Giả dụ, nếu bạn scale một đường thẳng có 4 điểm thành đường thẳng có 9 điểm, thì điểm thứ 3 ở điểm thứ 9 sẽ có giá trị điểm 1 ở đường thẳng mà ban đầu có 4 điểm. Nguyên do là vì nếu bạn scale đường thẳng có 9 điểm về đường thẳng 4 điểm thì ta phải chia cho 2.25 và 3÷2.25 =1.33 làm tròn = 1. Nếu điểm đó nằm ở điểm .5 thì tùy ý các bạn lấy giá trị làm tròn lên hay tròn xuống nhé.  
Một ví dụ trực quan khác là mình muốn scale 1 ảnh có shape là 2x2 lên thành 3x3 bằng phương pháp nearest neighbour.

```
A = [[1, 2],      B = [[?, ?, ?], 
     [3, 4]]  ->       [?, ?, ?],
                       [?, ?, ?]] 
```

Ở đây, ma trận B ở trục x gấp $3/2$  A, và tương tự ở trục y. Vì vậy, nếu muốn tìm giá trị của B thì chỉ cần nhân giá trị vị trí của B với $2/3$.  
B(0, 0) = A(round($0$ *$2/3$), round($0$ *$2/3$)) = A(0, 0) = 1  
B(1, 1) = A(round($1$ *$2/3$), round($1$ *$2/3$)) = A(0, 0) = 1  
B(2, 2) = A(round($2$ *$2/3$), round($2$ *$2/3$)) = A(1, 1) = 4  
Vì vậy, ma trận B của chúng ta sẽ giống như vậy:
```
B = [[1, 1, 2], 
     [1, 1, 2], 
     [3, 3, 4]]
```

Tuy đơn giản để implement và có tốc độ nhanh, tuy nhiên nó có những nhược điểm sau:
+ Ảnh bị vỡ, không mượt mà 
+ Chất lượng ảnh bị giảm sút, đặc biệt khi resize ảnh lên kích thước lớn.


### 2. Bilinear Interpolation
Phương pháp này khắc phục nhược điểm ảnh bị vỡ nặng khi scale up ảnh của phương pháp nearest neighbours. Về cơ bản, phương pháp này cũng tìm vị trí x và y của ảnh cũ và tìm 4 điểm lân cận để tìm ra giá trị thay vì chỉ gán vào giá trị có vị trí gần nhất.  
![Image](https://archive.ph/vH6jf/728845363a44a7bfc73e8926e8c451b70dceefe5.webp)

Ta có công thức để suy ra giá trị của điểm ảnh trên hình được resize như trên.  
Ví dụ minh họa, ta lấy ma trận A là ma trận ban đầu và ma trận B là ma trận được resized và $x'$ và $y'$ là điểm trên ma trận B mà ta muốn tìm ra giá trị, và $x, y$ là điểm ta suy ra từ vị trí $x', y'$ của ma trận B. Với điểm $Pixel(x, y)$ nằm trong 4 giá trị $Pixel(i, j), Pixel(i, j+1), Pixel(i+1, j), Pixel(i+1, j+1)$ và $a$ là khoảng cách từ $x$ đến $i$, và $b$ là khoảng cách từ $y$ đến $j$. Từ đó, ta có công thức để suy ra $Pixel(x', y')$ như sau:  
$F(x', y')$ = $(1-a)(1-b)A(i, j)$ + $a(1-b)A(i+1, j)$ + $(1-a)bA(i, j+1)$ + $abA(i+1, j+1)$

Chúng ta lấy ví dụ trên để minh họa phương pháp này. Với

$x'=1, y'=1$ ta có điểm $x = y =$ $2/3$ $*$ $1$ $= 0.667$. Vì vậy, ta suy ra được điểm này là điểm được bao bởi 4 điểm trong ma trận $A$ có vị trí lần lượt như sau $(0, 0), (0, 1), (1, 0), (1, 1)$. Và $a = b = 0.667$. Ta tính theo công thức để suy ra giá trị của điểm B(x, y) như sau:  

$B(1, 1) = (1-a)*(1-b)*A(0, 0) + (1-a) * b * A(1, 0) + a*(1-b)*A(0, 1) + a*b*A(1, 1)$

$B(1, 1) = (1-0.667)*(1-0.667)*1 + (1-0.667) * 0.667 * 3 + 0.667*(1-0.667)*2 + 0.667*0.667*4 = 2.989$

Một ví dụ khác với $x'=2, y'=2$, ta có điểm $x = y =$ $2/3$ $*$ $2$ $= 1.333$. Vì vậy, ta suy ra được điểm này là điểm được bao bởi 4 điểm trong ma trận $A$ có vị trí lần lượt như sau $(1, 1), (2, 1), (1, 2), (2, 2)$. Với điểm nào nằm ngoài điểm biên thì ta thay giá trị điểm đó trùng với điểm biên luôn nha .Và $a = b = 0.333$. Ta tính theo công thức để suy ra giá trị của điểm B(x, y) như sau:

$B(1, 1) = (1-a)*(1-b)*A(1, 1) + (1-a) * b * A(1, 1) + a*(1-b)*A(1, 1) + a*b*A(1, 1)$

$B(1, 1) = (1-0.333)*(1-0.333)*4 + (1-0.333) * 0.333 * 4 + 0.333*(1-0.333)*4 + 0.333*0.333*4 = 4$

Và nếu ta tính tương tự như vậy, ta sẽ có kết quả ma trận B như sau:

```
B = [[1.   , 1.666, 2.], 
     [2.333, 2.989, 3.33], 
     [3.   , 3.667, 4.]]
```
Như có thể thấy thì ma trận B từ phương pháp Bilinear Interpolation cho kết quả nhìn mượt hơn phương pháp Nearest Neighbours. Tuy nhiên phương pháp cũng có nhược điểm là thời gian tính toán lâu hơn so với phương pháp trên.


### 3. Bicubic Interpolation