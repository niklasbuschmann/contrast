---
title: "About"
permalink: "/about/"
layout: page
---

## Github Pages

Just fork this [repository](https://github.com/niklasbuschmann/contrast) to `your_username.github.io` and adjust the `_config.yml` to use with [Github Pages](https://pages.github.com/) and your page is done.

## Features

 - dark mode
 - [KaTeX](https://katex.org) included
 - no external ressources
 - optional sidebar
 - archive page
 - syntax highlighting
 - supports comments via [disqus](https://disqus.com/) or [isso](http://posativ.org/isso/)

## Installation

To run locally [install Ruby](https://www.ruby-lang.org/en/documentation/installation/) and then run:

```
git clone https://github.com/niklasbuschmann/contrast.git
cd contrast
gem install bundler jekyll jekyll-feed
bundle exec jekyll serve
```

## Config

Your `_config.yml` could for example look like this:

```yaml
title: "Blog Title"
author: "Blog Author"
description: "My blog"
permalink: /:title/
lang: "en"
excerpt_separator: "\n\n\n"
date_format: "%B %d, %Y"

# Layout

show_excerpts: true             # show article excerpts instead of archive list on the home page
show_frame: true                # display a grey frame on large screens
show_sidebar: false             # show a sidebar instead of the usual header
show_minimal: false             # remove all clutter

# Menu                          # for available icons see https://fontawesome.com/v5/icons/

navigation:                     # accepts {file, title, url, icon, sidebaricon}
  - {file: "archive.html", sidebaricon: home}
  - {file: "README.md", sidebaricon: address-card}

external:                       # accepts {file, title, url, icon, sidebaricon}
  - {title: Mail, icon: envelope, url: "mailto:author@example.com"}
  - {title: Github, icon: github, url: "https://github.com/"}
  - {title: Subscribe, icon: rss, url: "/feed.xml"}

comments:
#  disqus_shortname: ""         # see https://disqus.com
#  isso_domain: ""              # see https://isso-comments.de

plugins:
 - jekyll-feed
```

## Math

Contrast comes preinstalled with a leightweight alternative to MathJax called [KaTeX](https://katex.org/). To display equations in a post simply set `mathjax: true` in the article's front matter. [Jektex](https://github.com/yagarea/jektex) can be used to pre-render math on the server side.

## License

[public domain](http://unlicense.org/)

## Screenshots

![screenshot](https://github.com/user-attachments/assets/8f0ef4bc-f079-495e-8c31-5867b8ccd25c)

![screenshot](https://github.com/user-attachments/assets/e5e6d189-3251-41f4-baba-ff42be65f666)

![screenshot](https://github.com/user-attachments/assets/d31879ae-7113-42be-b580-1e96a2aedd29)

![screenshot](https://github.com/user-attachments/assets/d524ce47-8d8c-473e-afc6-79b34fae63e8)
