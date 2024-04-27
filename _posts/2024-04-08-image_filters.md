---
title:  "Giải thích và implement các bộ lọc trong xử lý ảnh - Phần 1"
mathjax: true
layout: post
---

Xin chào các bạn,

Trong phần 1 của series bộ lọc ảnh, mình sẽ giới thiệu về bộ lọc ảnh, ứng dụng, và một vài bộ lọc ảnh cơ bản nhất trong lĩnh vực xử lý ảnh, thị giác máy.



### 1. Giới thiệu

Giải thích một cách ngắn gọn thì bộ lọc ảnh là thứ mà sẽ giúp chúng ta **biến tấm ảnh gốc thành tấm ảnh mà chúng ta muốn thấy**. 

<figure style="text-align: center">
     <img width=1200 height=400 src="https://cdn.tgdd.vn/2020/09/content/unnamed-800x608.jpg">
     <figcaption style = "text-align: left">Source: <a href="https://www.thegioididong.com/game-app/polish-ung-dung-chinh-sua-hieu-ung-doc-dao-bo-loc-anh-228949">thegioididong - Polish: Ứng dụng chỉnh sửa, hiệu ứng độc đáo, bộ lọc ảnh đẹp, tách ảnh ra khỏi nền bằng AI</a></figcaption>
</figure>

Nếu các bạn dùng Tiktok, Instagram, ... thì các bạn sẽ thấy mục **filters**, tức là bộ lọc, và việc sử dụng filters khác nhau sẽ cho những hiệu ứng khác nhau trên tấm ảnh. Nếu bạn muốn có tai thỏ hoặc những chú cá dễ thương trong khung hình thì bộ lọc ảnh sẽ giúp bạn làm điều đó. 

Ngoài ra, bộ lọc có thể làm được nhiều thứ vi diệu hơn như thay đổi khuôn mặt, thay đổi màu sắc, khử nhiễu, phân vùng bức ảnh, ... Và những điều này là sự áp dụng và kết hợp nhiều bộ lọc khác nhau.

<figure style="text-align: center">
     <img width=1200 height=400 src="https://warroom.armywarcollege.edu/wp-content/uploads/21-057-Deep_fake_Tom_Cruise.jpeg">
     <figcaption style = "text-align: left">Source: <a href="https://warroom.armywarcollege.edu/articles/deep-fakes/">War Room - The Deep Fakes are coming</a></figcaption>
</figure>


### 2. Bộ lọc hoạt động như thế nào ?
Có nhiều loại bộ lọc và mỗi bộ lọc ảnh sẽ được thiết kế dựa trên một thuật toán cụ thể, thuật toán này sẽ xác định cách thức biến đổi dữ liệu hình ảnh. Vì vậy, tất cả bộ lọc sẽ không hoạt động một cách giống nhau và có một công thức tổng quát.

Một vài bộ lọc cơ bản hoạt động theo kiểu tích chập (convolution) và một vài bộ lọc phức tạp hơn thì hoạt động theo kiểu thuật toán (algorithm). Tuy nhiên, những bộ lọc phức tạp đều có thể được xấp xỉ bằng các bộ lọc cơ bản hoạt động cơ bản theo kiểu tích chập. Mình sẽ chứng minh phần này ở các phần tiếp theo.


### 3. Một vài bộ lọc cơ bản thông dụng
Mình sẽ giới thiệu một vài bộ lọc cơ bản và thông dụng nhất để các bạn nắm được cách hoạt động, công dụng, cũng như điểm mạnh và điểm yếu của nó nhé. Ngoài ra mình cũng sẽ code các bộ lọc này from scratch để các bạn có thể nắm tốt nhất cách hoạt động của các bộ lọc này. 


#### 3.1. Bộ lọc trung bình (Average Filter - Box Filter)
Công dụng của bộ lọc này là làm mờ và giúp ảnh nhìn "mượt" hơn. Có lẽ bạn thắc mắc, tại sao chúng ta muốn làm mờ ảnh?

Làm mờ ảnh có nhiều công dụng như khử nhiễu, không để lộ khuôn mặt, ...
Nếu các bạn nào xem các vụ hiện trường án mạng hay tai nạn, thì khuôn mặt hoặc hình nhạy cảm sẽ được blur đi và nhìn như hình dưới:

<figure style="text-align: center">
     <img width=1200 height=400 src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkWvG6F7PkYCZoMQeympsP7HdafW9_1MipPspMt-znOpRmSAgzZzjVSS6bTKwKN6uycts&usqp=CAU">
     <figcaption style = "text-align: left">Source: <a href="https://warroom.armywarcollege.edu/articles/deep-fakes/">Cloudinary - Automatically Add Blur Faces Effect To Images
</a></figcaption>
</figure>

Bộ lọc này có cách hoạt động cực kì đơn giản. Như tên gọi của nó, average filter lấy tất cả pixels trong một vùng cố định (users sẽ chọn kích thước của vùng) và output ra giá trị trung bình của vùng đó.

**Code**

```python
import cv2
import numpy as np

def averageFilter(image: np.ndarray, kernelSize: int = 3, keepShape: bool = True):
    # Calculate the padding size based on the kernel size
    padding = kernelSize // 2
    
    # Add padding to the image
    paddedImage = cv2.copyMakeBorder(image, padding, padding, padding, padding, cv2.BORDER_CONSTANT)
    
    # Initialize an empty result image
    result = np.zeros_like(image)
    
    # Apply the average filter
    for i in range(padding, paddedImage.shape[0] - padding):
        for j in range(padding, paddedImage.shape[1] - padding):
            # Extract the region of interest (ROI) from the padded image
            roi = paddedImage[i - padding:i + padding + 1, j - padding:j + padding + 1]
            
            # Calculate the average value of the ROI
            averageValue = np.mean(roi)
            
            # Assign the average value to the corresponding pixel in the result image
            result[i - padding, j - padding] = averageValue
    
    # If keepShape is False, remove the padding and resize the result image to match the input image shape
    if not keepShape:
        result = result[padding:result.shape[0] - padding, padding:result.shape[1] - padding]
    
    return result

# Create a test image
image = np.arange(1, 26).reshape(5, 5).astype("float32")

# Apply the average filter to the image
filteredImage = averageFilter(image)


# Print the filtered image
print(f"Original image: {image}")
print(f"After average filtering: {filteredImage}")
```

```
Original image: 
 [[ 1.  2.  3.  4.  5.]
 [ 6.  7.  8.  9. 10.]
 [11. 12. 13. 14. 15.]
 [16. 17. 18. 19. 20.]
 [21. 22. 23. 24. 25.]]

After average filtering: 
 [[ 1.7777778  3.         3.6666667  4.3333335  3.1111112]
 [ 4.3333335  7.         8.         9.         6.3333335]
 [ 7.6666665 12.        13.        14.         9.666667 ]
 [11.        17.        18.        19.        13.       ]
 [ 8.444445  13.        13.666667  14.333333   9.777778 ]]
```


#### 3.2. Bộ lọc trung vị (Median Filter)
Công dụng chính của bộ lọc này là để giải quyết các salt-and-pepper noise. Loại nhiễu này thường xuất hiện do lỗi truyền dữ liệu, lỗi ô nhớ hoặc lỗi do chuyển đổi tín hiệu analogue sang tín hiệu digital. 

<figure style="text-align: center">
     <img width=1200 height=400 src="https://avajsc.com/hoanghung/30/images/sua-tivi-nhiem-tu-1.jpg">
     <figcaption style = "text-align: left">Source: <a href="https://warroom.armywarcollege.edu/articles/deep-fakes/">Avajsc - Cách làm tivi hết nhiễu và một số mẹo vặt cực kỳ đơn giản với tivi nhà bạn
</a></figcaption>
</figure>

Nếu các bạn còn dùng Tivi ăng ten thì sẽ nhận ra loại nhiễu này, hehe. 


Vì các loại nhiễu này chỉ gồm 2 giá trị 0 và 255, nên nếu ta dùng bộ lọc trung vị thì có khả năng cao có thể loại ra được chúng. Nói có khả năng cao vì bộ lọc trung vị vẫn sẽ để lọt salt-and-pepper noise, nếu noise càng dày và đặc thì sẽ khó hơn để lọc ra và ngược lại. Vì giá trị 0-255 của salt-and-pepper noise sẽ nằm ở 2 biên của một vùng ảnh nên bộ lọc trung vị sẽ giúp chúng ta lọc ra được những điểm noise này, tuy nhiên ảnh của chúng ta sẽ mất độ chi tiết khi dùng bộ lọc này.

Các giá trị cần set cho bộ lọc trung vị là **kích thước kernel**. Nếu bạn set kernel 3x3 thì nó sẽ lướt qua từng vùng 3x3 trong ảnh là lọc ra trung vị của điểm đó và điền nó vào tấm ảnh mới.

<figure style="text-align: center">
     <img width=1200 height=400 src="https://user-images.githubusercontent.com/40359381/178124690-bc22c5b2-edde-48e1-8b48-94c51a5d64fc.png">
     <figcaption style = "text-align: left">Source: <a href="https://www.mathworks.com/matlabcentral/fileexchange https://www.mathworks.com/matlabcentral/fileexchange/114840-discrete-implementation-for-a-mean-and-median-filters">Matlab
</a></figcaption>
</figure>

Giải thuật median filter được trình bày như sau:  
+    **Step 1**: Quét kernel qua một vùng của tấm ảnh  
+    **Step 2**: Sắp xếp các giá trị thấp dần/cao dần  
+    **Step 3**: Chọn giá trị chính giữa và thay vào ảnh mới  


**Code**
```python
import cv2
import numpy as np

def medianFilter(image: np.ndarray, kernelSize: int = 3, keepShape: bool = True):
    # Calculate the padding size based on the kernel size
    padding = kernelSize // 2
    
    # Add 0 padding to the image
    paddedImage = cv2.copyMakeBorder(image, padding, padding, padding, padding, cv2.BORDER_CONSTANT)
    
    # Initialize an empty result image
    result = np.zeros_like(image)
    
    # Apply the average filter
    for i in range(padding, paddedImage.shape[0] - padding):
        for j in range(padding, paddedImage.shape[1] - padding):
            # Extract the region of interest (ROI) from the padded image
            roi = paddedImage[i - padding:i + padding + 1, j - padding:j + padding + 1]
            
            # Calculate the median value of the ROI
            medianValue = np.median(roi)
            
            # Assign the average value to the corresponding pixel in the result image
            result[i - padding, j - padding] = medianValue
    
    # If keepShape is False, remove the padding and resize the result image to match the input image shape
    if not keepShape:
        result = result[padding:result.shape[0] - padding, padding:result.shape[1] - padding]
    
    return result

# Create a test image
image = np.arange(1, 26).reshape(5, 5).astype("float32")

# Apply the average filter to the image
filteredImage = medianFilter(image)


# Print the filtered image
print(f"Original image: \n {image}")
print(f"After median filtering: \n {filteredImage}")
```


```
Original image: 
 [[ 1.  2.  3.  4.  5.]
 [ 6.  7.  8.  9. 10.]
 [11. 12. 13. 14. 15.]
 [16. 17. 18. 19. 20.]
 [21. 22. 23. 24. 25.]]

After median filtering: 
 [[ 0.  2.  3.  4.  0.]
 [ 2.  7.  8.  9.  5.]
 [ 7. 12. 13. 14. 10.]
 [12. 17. 18. 19. 15.]
 [ 0. 17. 18. 19.  0.]]
```

#### 3.3. Bộ lọc Gauss (Gauss Filter)
Bộ lọc Gauss filter về chức năng tương tự như average filter. Tuy nhiên, điểm khác nhau là bộ lọc này sử dụng gán các trọng số cho các pixels xung quanh theo phân phối Gaussian thay vì gán các trọng số cho các pixels xung quanh bằng nhau như bộ lọc trung bình.

<figure style="text-align: center">
     <img width=1200 height=400 src="https://i.ytimg.com/vi/NNoDxW2wycA/maxresdefault.jpg">
     <figcaption style = "text-align: left">Source: <a href="https://www.mathworks.com/matlabcentral/fileexchange https://www.mathworks.com/matlabcentral/fileexchange/114840-discrete-implementation-for-a-mean-and-median-filters">Robot Academy - Introducing Kernels
</a></figcaption>
</figure>

Gauss kernel có 2 đặc tính là:  
+ Đối xứng
+ Trọng số của pixels giảm dần nếu vị trí càng xa vị trí trung tâm (đối với average filter thì trọng số bằng nhau dù gần hay xa trung tâm)
+ Ảnh kết quả sẽ mịn hơn so với average filter nếu ảnh ban đầu bị nhiễu nặng, hoặc có nhiều góc cạnh.

Để sử dụng Gauss Filter, chúng ta cần set 3 giá trị: **kernel_size**, **var_x**, **var_y**.

**Code**

Đầu tiên chúng ta sẽ viết function tạo Gauss filter, đoạn code dưới đây sẽ giúp chúng ta thực hiện điều đó.

```python
def gkernel(l=3, sig=2):
    
    ax = np.linspace(-(l - 1) / 2., (l - 1) / 2., l)
    xx, yy = np.meshgrid(ax, ax)

    kernel = np.exp(-0.5 * (np.square(xx) + np.square(yy)) / np.square(sig))

    return kernel / np.sum(kernel)
```

Tiếp theo, ta chỉ cần viết một function giống như average filter, nhưng lần này thay vì lấy trung bình, ta sẽ lấy tổng của các tích của vùng ROI với bộ lọc Gauss.

```python

def gaussianFilter(image: np.ndarray, 
                   kernelSize: int = 3, 
                   sigma: float = 1.0, 
                   keepShape: bool = True):
    # Calculate the padding size based on the kernel size
    padding = kernelSize // 2
    
    # Add padding to the image
    paddedImage = cv2.copyMakeBorder(image, padding, padding, padding, padding, cv2.BORDER_CONSTANT)
    
    # Create a Gaussian kernel
    kernel = gkernel(l=kernelSize, sig=1)
    
    # Initialize an empty result image
    result = np.zeros_like(image)
    
    # Apply the Gaussian filter
    for i in range(padding, paddedImage.shape[0] - padding):
        for j in range(padding, paddedImage.shape[1] - padding):
            # Extract the region of interest (ROI) from the padded image
            roi = paddedImage[i - padding:i + padding + 1, j - padding:j + padding + 1]
            
            # Convolve the ROI with the Gaussian kernel
            filteredValue = np.sum(roi * kernel)
            
            # Assign the filtered value to the corresponding pixel in the result image
            result[i - padding, j - padding] = filteredValue
    
    # If keepShape is False, remove the padding and resize the result image to match the input image shape
    if not keepShape:
        result = result[padding:result.shape[0] - padding, padding:result.shape[1] - padding]
    
    return result

print(f"Original image: \n {image}")
print(f"After Gaussian filtering: \n {filteredImage}")
```

```
Original Image: 
 [[ 1.  2.  3.  4.  5.]
 [ 6.  7.  8.  9. 10.]
 [11. 12. 13. 14. 15.]
 [16. 17. 18. 19. 20.]
 [21. 22. 23. 24. 25.]]

Filtered Image: 
 [[ 1.7207065  2.8222058  3.5481372  4.274069   3.430702 ]
 [ 4.629657   7.         8.         9.         6.985245 ]
 [ 8.259314  12.        13.        14.        10.6149025]
 [11.88897   17.        18.        19.        14.244559 ]
 [10.270683  14.600147  15.326078  16.05201   11.9806795]]
```

#### 3.4. Bộ lọc Bilateral (Bilateral Filter)
Bộ lọc này được cải tiến từ bộ lọc Gauss nhằm giữ lại được nhiều chi tiết hơn. Nếu như bộ lọc Gauss chỉ quan tâm tới khoảng cách của các pixels xung quanh thì bilateral filter còn quan tâm tới giá trị của các pixels xung quanh. 

![Image](https://ailearningcentre.wordpress.com/wp-content/uploads/2017/05/bilateral_filter.jpg?w=800)

Gauss filter và average filter làm mờ ảnh với mục đích là khử nhiễu và làm mịn ảnh, tuy nhiên chúng làm mất độ chi tiết như góc, cạnh trong tấm ảnh. Với mục tiêu là làm mịn ảnh, và khử nhiễu nhưng có thể giữ lại được nhiều chi tiết hơn so với hai bộ lọc tiền nhiệm, bilateral filter được ra đời. Bộ lọc này tích hợp spatial weight và intensity weight (một vài tài liệu gọi là range weight) để quyết định giá trị mới của pixel. 

Dưới đây là công thức tổng quát của Bilateral filter:

$$I^{filtered}(x) = \frac{1}{W_p}\sum_{x_i \in \omega}I(x_i)W_p$$

Với 

$$W_p = \sum_{x_i \in \omega}f_r(||I(x_i) - I(x)||)g_s(||x_i - x||)$$


$$ f_r(||I(x_i) - I(x)||) \text{ : Intensity weight}$$ 
$$g_s(||x_i - x||) \text{ : Spatial weight}$$
là 2 functions các bạn có thể chọn tùy ý, có thể là L2, có thể là L1, nhưng đa số đã thử nghiệm Gaussian function và chứng tỏ mức độ hiệu quả của việc dùng hàm này.

Dưới đây là 2 công thức dùng Gaussian function cho intensity weight và spatial weight:

$$f_r(||I(i, j) - I(k, l)||) = exp(-\frac{(||I(i, j) - I(k, l)||)^2}{2\sigma_r^2})$$

$$g_s(i, j, k, l) = exp(-\frac{(i-k)^2 + (j-l)^2}{2\sigma_s^2})$$

Notations:

$$I^{filtered}: \text{Ảnh sau khi qua bộ lọc}$$

$$I: \text{Ảnh gốc}$$

$$x (i, j): \text{vị trí của pixel được filtered}$$

$$x_i (k, l): \text{vị trí của pixel xung quanh}$$

$$\omega : \text{vùng có trọng tâm tại x, và } x_i \text{ là một điểm trong vùng này}$$


Tổng hợp lại, ta có hai công thức ngắn gọn sau để implement

$$w(i, j, k, l) = exp(-\frac{(i-k)^2 + (j-l)^2}{2\sigma_d^2} - \frac{||I(i, j) - I(k, l)||^2}{2\sigma_r^2})$$

$$I^{filtered}(i, j) = \frac{\sum_{k, l}w(i, j, k, l)I(k, l)}{\sum_{k, l}w(i, j, k, l)}$$






**Code**

Dưới đây là đoạn code để implement bilateral filter cho 1 điểm ảnh

**Step 1**: Tạo một tấm ảnh ngẫu nhiên để demo
```python
import numpy as np

image = np.array(range(1, 26)).astype("float32")
print(f"Original Image: \n {image}")
```

```
Original Image:
array([[ 1.,  2.,  3.,  4.,  5.],
       [ 6.,  7.,  8.,  9., 10.],
       [11., 12., 13., 14., 15.],
       [16., 17., 18., 19., 20.],
       [21., 22., 23., 24., 25.]], dtype=float32)
```

**Step 2**: Bilateral filter cho 1 điểm ảnh

```python

x = 1
y = 1
sigmaD = 1
sigmaR = 1
d = 1

paddedImage = cv2.copyMakeBorder(image, d, d, d, d, cv2.BORDER_REFLECT_101)
gaussian = lambda val, sigma: (np.exp(-0.5 * val / sigma**2))

pts = [(y, x)]
for i in range(-d, d+1):
    if i != 0:
        pts.append((y+i, x))
        pts.append((y, x+i))
deno = 0.
nume = 0.
for pt in pts:
    weight = gaussian((pt[0] - y)**2 + (pt[1] - x)**2, sigmaD)*gaussian((paddedImage[pt] - paddedImage[y, x])**2, sigmaR)
    deno += weight
    nume += weight*paddedImage[pt]
print(f"Pixel value at {x, y} after being filtered: {nume/deno}")
```
```
Pixel value at (1, 1) after being filtered: 1.4238950333694957
```

Và đó là cách tính giá trị mới của điểm ảnh sau khi được áp bộ lọc bilateral. Dưới đây sẽ là đoạn code hoàn chỉnh để dùng cho một tấm ảnh 2D (3D tương tự nhưng sẽ cần thêm 1 vòng loop cho channels)

```python

# Good to deploy
def bilateralFilter(image: np.ndarray, 
                   d: int = 1, 
                   sigmaD: float = 1., 
                   sigmaR: float = 1.):
    '''
    Implementation of bilateral filter by Mikyx-1, Le Hoang Viet
    Args:
        image (np.ndarray): 2D|Gray Image
        d (int): Diameter
        sigmaD (float): Sigma for distance
        sigmaR (float): Sigma for range
        
    Returns:
        output (np.ndarray): Filtered image
    '''
    
    gaussian = lambda val, sigma: (np.exp(-0.5 * val / sigma**2))
    
    paddedImage = cv2.copyMakeBorder(image, d, d, d, d, cv2.BORDER_REFLECT_101)
    imageHeight, imageWidth = paddedImage.shape
    res = np.zeros((imageHeight, imageWidth)).astype(paddedImage.dtype)
    for y in range(d, imageHeight-d):
        for x in range(d, imageWidth-d):
            pts = [(y, x)]
            for i in range(-d, d+1):
                if i != 0:
                    pts.append((y+i, x))
                    pts.append((y, x+i))
            deno = 0.
            nume = 0.
            for pt in pts:
                weight = gaussian((pt[0] - y)**2 + (pt[1] - x)**2, sigmaD)*gaussian((paddedImage[pt] - paddedImage[y, x])**2, sigmaR)
                deno += weight
                nume += weight*paddedImage[pt]
            res[y, x] = nume/deno
    return res

print(np.allclose(cv2.bilateralFilter(image, 1, 20, 20, cv2.BORDER_CONSTANT), bilateralFilter(image, 1, 20, 20)))
```

```
True
```

### 4. Kết luận
Mình đã hướng dẫn các bạn các bộ lọc cơ bản và thông dụng nhất trong lĩnh vực xử lý ảnh. Ngoài ra, chúng ta cũng đã code from scratch để hiểu rõ chính xác cách hoạt động của chúng. Tuy nhiên, các bộ lọc này đã khá cũ và hiện tại ở thời điểm này đã có nhiều bộ lọc tốt hơn về cả chất lượng và tốc độ, và trong bài post tiếp theo mình sẽ giới thiệu và cũng sẽ code from scratch những bộ lọc này nhé. 

Đây là một bài viết dài, cảm ơn các bạn đã đọc tới đây nha. Hãy feedback mình qua email hoặc github nếu bạn thấy có bất cứ lỗi hay chỗ nào chưa hợp lý nhé.

### References

1. [Bilateral Filter - Wikipedia](https://pytorch.org/docs/stable/generated/torch.nn.Linear.html)



