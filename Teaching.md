---
title: "Publications"
permalink: "/papers/"
layout: page
---


### Tests

<ul>
  {% for post in site.posts %}
    <li>
      <a href="{{ post.url }}">{{ post.title }}</a>
    </li>
  {% endfor %}
</ul>

<ul>
  {% for post in site.posts %}
    <li>
      <a href="{{ post.url }}">{{ Test }}</a>
    </li>
  {% endfor %}
</ul>
