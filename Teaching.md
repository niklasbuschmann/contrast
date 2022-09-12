---
title: "Teaching"
permalink: "/classes/"
layout: page
---


### Teoria Microeconomia II

<ul>
  {% for post in site.posts %}
    {% if post in MicroII %} <li>
      <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
  {% endif %}
  {% endfor %}
</ul>


### Teoria Macroeconômica III


### Economia Aplicada II
