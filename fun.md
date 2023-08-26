---
title: 
layout: page
categories: media
---
When the weather is nice, we would like to immerse ourselves into the wonderful nature of Scotland. 

<ul>
  {% for post in site.posts %}
    <li>
      <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
  {% endfor %}
</ul>
