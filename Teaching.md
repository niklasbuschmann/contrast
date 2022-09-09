---
title: "Teaching"
permalink: "/classes/"
layout: page
---


### Teoria Microeconomia II

<ul>
  {% for post in site.posts %}
    <li>
      <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
  {% endfor %}
</ul>



### Teoria Macroeconômica III

<ul>
  {% for post in site.categories[Micro II] %}
      <a href="{{ post.url | absolute_url }}">
        {{ post.title }}
      </a>
  {% endfor %}
<ul>

### Economia Aplicada II
