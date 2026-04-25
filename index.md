---
layout: page
title: "Home"
body_class: home-page
description: "A clean computer engineering portfolio homepage introducing my background, direction, and ongoing journey."
---

<section class="hero-grid hero-grid--single">
  <div class="hero-copy hero-copy--centered">
    <p class="eyebrow">Future Computer Engineer</p>
    <h1>{{ site.title }}</h1>
    <p class="hero-subtitle">Computer Engineering student at UET Lahore Faisalabad Campus, building my future through programming, systems, and practical engineering problem-solving.</p>
    <div class="button-row button-row--centered">
      <a class="primary-link" href="{{ "/about/" | relative_url }}">Explore My Story</a>
      <a class="secondary-link" href="{{ "/blog/" | relative_url }}">Read My Posts</a>
    </div>
  </div>
</section>

<section class="section-block summary-shell">
  <div class="feature-grid feature-grid--summary">
    <article class="feature-card">
      <h3>Profile Snapshot</h3>
      <p><strong>Field:</strong> BS Computer Engineering</p>
      <p><strong>University:</strong> UET Lahore Faisalabad Campus</p>
      <p><strong>Location:</strong> {{ site.location }}</p>
      <p><strong>Focus:</strong> Programming, hardware-software systems, and problem-solving</p>
    </article>
    <article class="feature-card">
      <h3>What This Portfolio Shows</h3>
      <p>A professional introduction to my background and academic direction.</p>
      <p>My journey from early learning toward stronger technical confidence.</p>
      <p>A growing blog archive where I continue documenting my progress.</p>
    </article>
  </div>
</section>

<section class="section-block">
  <div class="metric-grid metric-grid--simple">
    <article class="metric-card">
      <span class="metric-value">{{ site.posts | size }}</span>
      <span class="metric-label">Journey Posts</span>
    </article>
    <article class="metric-card">
      <span class="metric-value">{{ site.data.stats.cgpa }}</span>
      <span class="metric-label">CGPA</span>
    </article>
    <article class="metric-card">
      <span class="metric-value">{{ site.data.stats.position }}</span>
      <span class="metric-label">Position In Section</span>
    </article>
  </div>
</section>

<section class="section-block" style="margin-top: 2.5rem;">
  <div class="section-heading">
    <p class="eyebrow">About Me</p>
    <h2>Building a long-term journey in computer engineering</h2>
    <p class="section-intro">This homepage introduces my background, academic direction, and personal growth without turning the first page into a blog archive. It stays focused on who I am and where I am heading.</p>
  </div>
  <div class="feature-grid feature-grid--portfolio">
    <article class="feature-card">
      <h3>Background</h3>
      <p>I am {{ site.title }} from {{ site.location }}, pursuing Computer Engineering and building my future through continuous learning and discipline.</p>
    </article>
    <article class="feature-card">
      <h3>Experience</h3>
      <p>I am developing confidence in programming, problem-solving, and technical learning through coursework, labs, and regular study.</p>
    </article>
    <article class="feature-card">
      <h3>Interests</h3>
      <p>I am interested in programming, computer systems, and the way engineering knowledge turns ideas into practical solutions.</p>
    </article>
  </div>
</section>

<section class="quote-panel quote-panel--simple">
  <blockquote>The journey that begins with curiosity grows through consistency, confidence, and continuous improvement.</blockquote>
  <p class="quote-source">Personal portfolio statement</p>
</section>
