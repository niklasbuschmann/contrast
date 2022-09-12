---
title: "Teaching"
permalink: "/classes/"
layout: page
excerpt_separator: <!--more-->
---


### Teoria Microeconomia II

Here's another paragraph in the excerpt.
<!--more-->
Out-of-excerpt


### Teoria Macroeconômica III

<ul>
  {% for post in site.posts %}
    <li>
      <a href="{{ post.url }}">{{ post.title }}</a>
      {{ post.excerpt }}
    </li>
  {% endfor %}
</ul>



### Economia Aplicada II
