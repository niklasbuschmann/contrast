---
layout: default
title: "Blog"
---

{% if site.show_excerpts %}
  {% include home.html %}
{% else %}
  {% include archive.html title="Blog" %}
{% endif %}

<h1 class="page-title" style="display:inline-block;"> {{ page.title }} </h1>

<div style="display:inline-block;margin-left:.5em;">
    Browse by <a href="/blog/category/">Category</a> or <a href="/blog/tag/">Tag</a>
</div>

<br/><br/>

<div class="posts">
    {% for post in paginator.posts %}
    <div class="post">
        <h1 class="post-title">
            <a href="{{ post.url }}">
                {{ post.title }}
            </a>
        </h1>

        <span class="post-date">
            {{ post.date | date_to_string }}
            {% if post.tags != empty %}
            |
            {% for tag in post.tags %}
            <a class="codinfox-tag-mark" href="/blog/tag/#{{ tag | slugify }}">{{ tag }}</a>
            {% endfor %}
            {% endif %}
        </span>

        {{ post.content | split:"<!-- more -->" | first % }}

        <div class="codinfox-post-more">
            <a href="{{ post.url }}#disqus_thread">Comment</a>&nbsp;
            <a href="{{ post.url }}">Read more</a>
        </div>
        <hr/>

    </div>
    {% endfor %}
</div>

<div class="pagination">
    {% if paginator.next_page %}
    <a class="pagination-item older" href="/blog/page{{paginator.next_page}}">Older</a>
    {% else %}
    <span class="pagination-item older">Older</span>
    {% endif %}
    {% if paginator.previous_page %}
    {% if paginator.page == 2 %}
    <a class="pagination-item newer" href="/blog">Newer</a>
    {% else %}
    <a class="pagination-item newer" href="/blog/page{{paginator.previous_page}}">Newer</a>
    {% endif %}
    {% else %}
    <span class="pagination-item newer">Newer</span>
    {% endif %}
</div>



<center>
    <a class="twitter-timeline" data-width="600" data-height="400" data-theme="dark" href="https://twitter.com/mehrdad_mhmd?ref_src=twsrc%5Etfw">Tweets by mehrdad_mhmd</a>     <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
</center>

