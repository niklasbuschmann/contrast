---
title: 
layout: page
categories: media
---
When the weather is nice, we would like to immerse ourselves in Scotland's natural wonders. We have a lot of fun with mountains, lochs, woodlands, beaches, and farmlands just on our doorstep.

<ul>
  {% for post in site.posts %}
    <li>
      <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
  {% endfor %}
</ul>
