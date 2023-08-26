---
title: 
layout: page
categories: media
---
When the weather is nice, we would like to immerse ourselves in Scotland's natural wonders, and enjoy mountains, lochs, woodlands, beaches, and farmlands that are just on our doorstep.

<ul>
  {% for post in site.posts %}
    <li>
      <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
  {% endfor %}
</ul>
