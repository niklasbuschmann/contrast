---
title: 
layout: page
categories: media
---
When the weather is nice, we would like to immerse ourselves in Scotland's natural wonders. While we  enjoy Human Computer Interaction, we also have a lot of fun interacting with mountains, lochs, woodlands, farmlands, and beaches that are just on our footstep in Glasgow.

<ul>
  {% for post in site.posts %}
    <li>
      <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
  {% endfor %}
</ul>
