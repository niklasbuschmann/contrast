---
title: "Teaching"
permalink: "/classes/"
layout: page
---


### Teoria Microeconomia II

{% for tag in site.tags %}
  <h3>{{ tag[0] }}</h3>
  <ul>
    {% for post in tag[1] %}
      <li><a href="{{ post.url }}">{{ post.title }}</a></li>
    {% endfor %}
  </ul>
{% endfor %}


### Teoria Macroeconômica III


### Economia Aplicada II




### Mini-Cursos

#### Monografia: Aspectos Práticos

you can [get the PDF](/assets/LatexSymbols.pdf) directly.
