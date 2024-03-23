---
title: "Giải thích và code K-Nearest Neighbours from scratch"
layout: post
---


Xin chào các bạn!

Trong bài viết trước mình đã đề cập crawl dữ liệu từ Youtube (các bạn nếu chưa xem có thể tham khảo ở [đây][đây] nhé). Trong bài này, mình sẽ hướng dẫn các bạn cách crawl Tiktok videos full hd - không che về  nha.

Chúng ta bắt tay vào thực hành luôn nhé!

**Bước 1**: Trích xuất các urls của các videos
    
Để có thể tải các videos từ Tiktok về, chúng ta phải có **urls**. Các bạn có thể dùng một vài phương pháp automation của Python để có thể trích xuất đường link của các video về. Một cách đơn giản nhất, thì các bạn có thể dùng script này để  lọc ra được các urls (Ngoài ra vẫn có các cách khác hiệu quả hơn nhé).

(**Optional**) Các bạn có thể dùng đoạn lệnh sau để trích xuất các urls nhé

```python
import subprocess 
import time
import clipboard
import pandas as pd


last_url = None
current_url = ""
urls = []
cnt = 0

while cnt < 10:
    # Move the mouse to the url bar in web brower (Customise to your settings)
    subprocess.run(["xdotool", "mousemove", "200", "90"])
    time.sleep(1)

    # Click the right mouse to the url bar in web browser
    subprocess.run(["xdotool", "click", '1'])
    time.sleep(1)
    
    # Simulate Ctrl + a to select the whole url
    subprocess.run(["xdotool", "keydown", "Control_L", "key", "a", "keyup", "Control_L"])

    # Simulate Ctrl + c to copy the whole url
    subprocess.run(["xdotool", "keydown", "Control_L", "key", "c", "keyup", "Control_L"]) # Ctrl + C
    
    # If the current url == last_url then we have reached the last video
    # I intentionally add the cnt to hold it on for more tries before it finally stops
    last_url = current_url
    if last_url == clipboard.paste():
        cnt += 1
    else:
        cnt = 0
    current_url = clipboard.paste()
    
    urls.append(current_url)
    
    # Move the cursor to the down button in the Tiktok video
    subprocess.run(["xdotool", "mousemove", "560", "675"])
    time.sleep(1)

    # Click the down button to move to the next video in Tiktok
    subprocess.run(["xdotool", "click", "1"])
    time.sleep(1)
```

Bước trên hoàn toàn là optional mà các bạn có thể tham khảo, trên mạng ở thời điểm các bạn đọc bài viết này có thể đã có những tools giúp extract tất cả urls của videos trên Tiktok một cách nhanh hơn và dễ hơn. 

Vậy là chúng ta đã hoàn thành bước 1 và có được tất cả các urls của 1 channel Tiktok trong tay, bước tiếp theo là ta phải dùng tất cả các urls này để tải các videos trên ở định dạng finest nhất về máy

**Bước 2**: Tải các videos về máy  
Ở bước này, mình sẽ bày các bạn cách dùng một request để có thể tự động truy cập vào một trang web cho phép tải video tiktok (cách này còn được gọi là đứng trên vai người khổng lồ). Trang web mà chúng ta sử dụng là [Tik Downloader][Tik Downloader]. 

Sau khi nhập vào link của video, bạn sẽ nhận được 4 options như sau

![Tik Downloader Interface][Tik Downloader Interface]

Và nếu ta mở Developer tool ở trong trình duyệt lên để quan sát thì các bạn sẽ thấy có một response có tên là "ajaxSearch" xuất hiện với nội dung như sau   
{  
    "status": "ok",  
    "data": "...very long string"  
}

Trong response này, phần "data" chứa thông tin chúng ta tìm kiếm là đường link tải video full Hd không che của Tiktok. 

Ok, chúng ta biết là sau khi nhập đường link video vào Tik Downloader thì sẽ có 1 response được gửi về trong đó có chứa đường link tải về video Full HD không che. Tuy nhiên, việc làm trên vẫn là thủ công và tốn khá nhiều thời gian, chưa kể họ còn có quảng cáo, captchas, ... Chúng ta sẽ dùng một công cụ có tên là [CurlConverter][CurlConverter]. CurlConverter là công cụ giúp chuyển cách chúng ta truy cập thủ công một trang web nào đó thành code của nhiều loại ngôn ngữ khác nhau

```python

```

**Kết luận**
Và thế  là chỉ sau 2 bước đơn giản, các bạn có thể crawl hàng tấn videos để có thêm data cho model rồi. Đơn giản phải không nào 😄

Phần tiếp theo, mình sẽ hướng dẫn các bạn crawl tiktok videos full HD, không watermarks nha, nhớ ghé blog tiếp hen !!


### Tải liệu tham khảo
1. [Scrapetube-demasmid][Scrapetube-demasmid]
2. [Youtube-dl][youtube-dl]


[đây]: https://github.com/dermasmid/scrapetube
[youtube-dl]: https://github.com/ytdl-org/youtube-dl
[Tik Downloader]: https://tikdownloader.io/en
[Tik Downloader Interface]: https://docs.google.com/document/d/1bi6MVQWe9GDuQQ2uPd7LyMX5sK12rRK0dZTylJPIccs/edit#bookmark=id.812uy0co2sdr
[CurlConverter]: https://curlconverter.com/