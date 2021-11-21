---
layout: default
title: "Blog"
---



<h1 class="page-title" style="display:inline-block;"> {{ page.title }} </h1>

<div style="display:inline-block;margin-left:.5em;">
    Browse by <a href="/blog/category/">Category</a> or <a href="/blog/tag/">Tag</a>
</div>

{% if site.show_excerpts %}
  {% include home.html %}
{% else %}
  {% include archive.html title="Blog" %}
{% endif %}

<center>
    <a class="twitter-timeline" data-width="600" data-height="400" data-theme="dark" href="https://twitter.com/mehrdad_mhmd?ref_src=twsrc%5Etfw">Tweets by mehrdad_mhmd</a>     <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
</center>

