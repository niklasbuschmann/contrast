---
layout: page
title: "Blog"
permalink: /blog/
description: "Browse my journey through folder-style sections and open each stage to read the related articles and tags."
---

{% assign sorted_posts = site.posts | sort: "sequence" %}
{% assign folder_names = sorted_posts | map: "folder" | uniq %}
{% assign default_folder = folder_names | first %}

<section class="blog-intro">
  <p>This page organizes my computer engineering journey into folders. Open any folder below to view only its related articles and tags on the same page.</p>
</section>

<section class="folder-browser" aria-label="Blog folders">
  <div class="folder-grid" id="folder-grid">
    {% for folder_name in folder_names %}
      {% assign folder_posts = sorted_posts | where: "folder", folder_name %}
      {% assign folder_slug = folder_name | slugify %}
      {% assign folder_tags = "" | split: "" %}
      {% for post in folder_posts %}
        {% if post.tags %}
          {% assign folder_tags = folder_tags | concat: post.tags %}
        {% endif %}
      {% endfor %}
      {% assign folder_tags = folder_tags | uniq | sort %}
      {% assign folder_first_post = folder_posts | first %}
      {% assign folder_last_post = folder_posts | last %}
      {% capture folder_description %}
        {% case folder_name %}
          {% when "Admission Journey" %}
            Entry-test preparation, scholarship support, first arrival on campus, hostel life, and the first steps into university.
          {% when "1st Semester" %}
            My first semester experience through classes, labs, routines, mentors, exams, projects, and academic growth.
          {% when "2nd Semester" %}
            Second semester momentum with practical labs, online learning, collaboration, projects, and balancing responsibilities.
          {% else %}
            Articles collected from the {{ folder_name | downcase }} stage of my academic journey.
        {% endcase %}
      {% endcapture %}
      <button class="folder-card{% if folder_name == default_folder %} is-active{% endif %}" type="button" data-folder-target="{{ folder_slug }}" aria-pressed="{% if folder_name == default_folder %}true{% else %}false{% endif %}">
        <span class="folder-card__tab" aria-hidden="true"></span>
        <span class="folder-card__label">Folder {{ forloop.index }}</span>
        <strong>{{ folder_name }}</strong>
        <p>{{ folder_description | strip }}</p>
        <div class="folder-card__stats">
          <span>{{ folder_posts | size }} Articles</span>
          <span>{{ folder_tags | size }} Tags</span>
          <span>Article {{ folder_first_post.sequence }} to {{ folder_last_post.sequence }}</span>
        </div>
      </button>
    {% endfor %}
  </div>
</section>

<section class="folder-panels" id="folder-panels">
  {% for folder_name in folder_names %}
    {% assign folder_posts = sorted_posts | where: "folder", folder_name %}
    {% assign folder_slug = folder_name | slugify %}
    {% assign folder_tags = "" | split: "" %}
    {% for post in folder_posts %}
      {% if post.tags %}
        {% assign folder_tags = folder_tags | concat: post.tags %}
      {% endif %}
    {% endfor %}
    {% assign folder_tags = folder_tags | uniq | sort %}
    {% capture folder_description %}
      {% case folder_name %}
        {% when "Admission Journey" %}
          This folder covers the road to admission, early campus transition, scholarship support, and the experiences that began my university life.
        {% when "1st Semester" %}
          This folder collects the lessons, routines, friendships, labs, and exam experiences that shaped my first semester.
        {% when "2nd Semester" %}
          This folder follows my second semester through practical work, online learning, projects, travel, and growing academic responsibility.
        {% else %}
          This folder contains articles from the {{ folder_name | downcase }} phase of my journey.
      {% endcase %}
    {% endcapture %}
    <section class="blog-folder-panel{% if folder_name != default_folder %} is-hidden{% endif %}" data-folder-panel="{{ folder_slug }}"{% if folder_name != default_folder %} hidden{% endif %}>
      <div class="folder-panel__hero">
        <div>
          <p class="eyebrow">Blog Folder</p>
          <h2>{{ folder_name }}</h2>
          <p class="folder-panel__description">{{ folder_description | strip }}</p>
        </div>
        <div class="folder-panel__summary">
          <span>{{ folder_posts | size }} Articles</span>
          <span>{{ folder_tags | size }} Tags</span>
        </div>
      </div>

      <section class="blog-intro blog-intro--compact">
        <p>Use the tags below to narrow this folder to the exact topics you want to read.</p>
        <div class="category-filters" data-folder-tags>
          <button class="category-tag active" type="button" data-tag="all">All</button>
          {% for tag in folder_tags %}
            <button class="category-tag" type="button" data-tag="{{ tag | slugify }}">{{ tag }}</button>
          {% endfor %}
        </div>
      </section>

      <div class="folder-posts" data-folder-posts>
        {% for post in folder_posts %}
          <article class="journal-card journal-card--interactive" data-tags="{% for tag in post.tags %}{{ tag | slugify }}{% unless forloop.last %}|{% endunless %}{% endfor %}" data-url="{{ post.url | relative_url }}" tabindex="0" role="link" aria-label="Open article {{ post.title }}">
            {% if post.image %}<img src="{{ post.image }}" alt="{{ post.title }}" class="post-image">{% endif %}
            <span class="journal-index">Article {{ post.sequence }}</span>
            <h3><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
            <p>{{ post.summary }}</p>
            <div class="journal-meta">
              <span>{{ post.journey_stage }}</span>
              <span>{{ post.read_time }}</span>
              <span class="semester-tag">{{ folder_name }}</span>
            </div>
            <div class="post-tags">
              {% for tag in post.tags %}
                <span class="post-tag">{{ tag }}</span>
              {% endfor %}
            </div>
          </article>
        {% endfor %}
      </div>
    </section>
  {% endfor %}
</section>

<script>
  document.addEventListener('DOMContentLoaded', function() {
    const folderButtons = document.querySelectorAll('[data-folder-target]');
    const folderPanels = document.querySelectorAll('[data-folder-panel]');
    const firstFolderButton = folderButtons[0];

    const updateUrl = (folderSlug, tagSlug) => {
      const nextUrl = new URL(window.location.href);

      if (folderSlug) {
        nextUrl.searchParams.set('folder', folderSlug);
      } else {
        nextUrl.searchParams.delete('folder');
      }

      if (tagSlug && tagSlug !== 'all') {
        nextUrl.searchParams.set('tag', tagSlug);
      } else {
        nextUrl.searchParams.delete('tag');
      }

      history.replaceState(null, '', nextUrl);
    };

    const applyTagFilter = (panel, selectedTag) => {
      if (!panel) return;

      const tagButtons = panel.querySelectorAll('[data-folder-tags] .category-tag');
      const posts = panel.querySelectorAll('[data-folder-posts] .journal-card');
      let visibleCount = 0;

      tagButtons.forEach(button => {
        button.classList.toggle('active', button.getAttribute('data-tag') === selectedTag);
      });

      posts.forEach(post => {
        const postTags = (post.getAttribute('data-tags') || '').split('|').filter(Boolean);
        const shouldShow = selectedTag === 'all' || postTags.includes(selectedTag);

        post.hidden = !shouldShow;
        post.style.display = shouldShow ? '' : 'none';
        post.style.opacity = shouldShow ? '1' : '0';
        post.style.transform = shouldShow ? 'translateY(0)' : 'translateY(18px)';

        if (shouldShow) {
          visibleCount += 1;
        }
      });

      const postsContainer = panel.querySelector('[data-folder-posts]');
      postsContainer.classList.toggle('is-empty', visibleCount === 0);
    };

    const showFolder = (folderSlug, tagSlug) => {
      const nextFolderSlug = folderSlug || (firstFolderButton && firstFolderButton.getAttribute('data-folder-target'));
      if (!nextFolderSlug) return;

      let activePanel = null;

      folderButtons.forEach(button => {
        const isActive = button.getAttribute('data-folder-target') === nextFolderSlug;
        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });

      folderPanels.forEach(panel => {
        const isActive = panel.getAttribute('data-folder-panel') === nextFolderSlug;
        panel.classList.toggle('is-hidden', !isActive);
        panel.hidden = !isActive;
        if (isActive) {
          activePanel = panel;
        }
      });

      if (!activePanel) return;

      const availableTags = Array.from(activePanel.querySelectorAll('[data-folder-tags] .category-tag')).map(button => button.getAttribute('data-tag'));
      const nextTag = availableTags.includes(tagSlug) ? tagSlug : 'all';

      applyTagFilter(activePanel, nextTag);
      updateUrl(nextFolderSlug, nextTag);
    };

    folderButtons.forEach(button => {
      button.addEventListener('click', function() {
        showFolder(this.getAttribute('data-folder-target'), 'all');
      });
    });

    folderPanels.forEach(panel => {
      const tagButtons = panel.querySelectorAll('[data-folder-tags] .category-tag');
      const posts = panel.querySelectorAll('[data-folder-posts] .journal-card');

      tagButtons.forEach(button => {
        button.addEventListener('click', function() {
          const panelSlug = panel.getAttribute('data-folder-panel');
          const tagSlug = this.getAttribute('data-tag');
          applyTagFilter(panel, tagSlug);
          updateUrl(panelSlug, tagSlug);
        });
      });

      posts.forEach(post => {
        const openArticle = event => {
          if (event.target.closest('a, button')) return;
          const url = post.getAttribute('data-url');
          if (url) {
            window.location.href = url;
          }
        };

        post.addEventListener('click', openArticle);
        post.addEventListener('keydown', function(event) {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openArticle(event);
          }
        });
      });
    });

    const activeFolderFromUrl = new URLSearchParams(window.location.search).get('folder');
    const activeTagFromUrl = new URLSearchParams(window.location.search).get('tag');
    const initialFolder = activeFolderFromUrl || (firstFolderButton && firstFolderButton.getAttribute('data-folder-target'));

    showFolder(initialFolder, activeTagFromUrl || 'all');
  });
</script>
