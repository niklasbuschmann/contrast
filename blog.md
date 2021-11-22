---
layout: default
title: "Blog"
permanent link : /blog/
---
<div id="archives">
{% for category in site.categories %}
  <div class="archive-group">
    {% capture category_name %}{{ category | first }}{% endcapture %}
    <div id="#{{ category_name | slugize }}"></div>
    <p></p>

    <h3 class="category-head">{{ category_name }}</h3>
    <a name="{{ category_name | slugize }}"></a>
    {% for post in site.categories[category_name] %}
    <article class="archive-item">
      <h4><a href="{{ site.baseurl }}{{ post.url }}">{{post.title}}</a></h4>
    </article>
    {% endfor %}
  </div>
{% endfor %}
</div>



{% if site.show_excerpts %}
  {% include home.html %}
{% else %}
  {% include archive.html title="Blog" %}
{% endif %}

    
<center>
 <a class="twitter-timeline" data-width="600" data-height="400" data-theme="dark" href="https://twitter.com/mehrdad_mhmd?ref_src=twsrc%5Etfw">Tweets by mehrdad_mhmd</a>     <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
</center>

