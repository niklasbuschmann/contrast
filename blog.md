---
layout: default
title: "Blog"
---

{% if site.show_excerpts %}
  {% include home.html %}
{% else %}
  {% include archive.html title="Blog" %}
{% endif %}

<div style={{display:'flex',justifyContent:'center'}}>
    <a class="twitter-timeline" data-width="400" data-height="120" data-theme="dark" href="https://twitter.com/mehrdad_mhmd?ref_src=twsrc%5Etfw">Tweets by mehrdad_mhmd</a>     <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
</div>

