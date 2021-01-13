/**
* @license lyradesigns.com v1
* Updated: Dec 17, 2014
* Add pin buttons to images
* Copyright (c) 2014 Jonas Goslow - LYRA
* Released under the MIT license
* https://github.com/timmywil/jquery.panzoom/blob/master/MIT-License.txt
*/
(function(e){e.fn.imgPin=function(t){var n={pinImg:"https://assets.pinterest.com/images/pidgets/pin_it_button.png",position:1};var t=e.extend({},n,t);var r=encodeURIComponent(document.URL),i=t.pinImg,s="";switch(t.position){case 1:s="top left";break;case 2:s="top right";break;case 3:s="bottom right";break;case 4:s="bottom left";break;case 5:s="center";break}this.each(function(){var n=e(this).attr("src"),o=r;var u=new Image;u.src=n;var a=encodeURIComponent(document.title),f=encodeURIComponent(n);var l="https://www.pinterest.com/pin/create/button/";l+="?url="+o;l+="&media="+f;l+="&description="+a;e(this).wrap('<div class="imgPinWrap">').after('<a href="'+l+'" class="pin '+s+'"><img src="'+i+'" alt="Pin this!"></a>');if(t.position==5){var u=new Image;u.onload=function(){var t=this.width;h=this.height;e(".imgPinWrap .pin.center").css("margin-left",-t/2).css("margin-top",-h/2)};u.src=i}e(".imgPinWrap .pin").click(function(){var e=700,t=400;var n=screen.width/2-e/2;var r=screen.height/2-t/2;var i=window.open(this.href,"imgPngWindow","toolbar=no, location=no, status=no, menubar=no, scrollbars=yes, resizable=yes, width=700, height=400");i.moveTo(n,r);return false})})}})(jQuery)
