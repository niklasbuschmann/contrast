---
title: "About"
permalink: "/about/"
layout: page
---
##About Me

<img align="left" width="15%" height="15%" src="https://github.com/melhayashida/GIS_Portfolio/assets/140747457/7c6a0c2c-c5a4-4814-a4ae-f8c6f39e9d36">
Hello! I'm Melissa. I'm a Geographic Information Systems (GIS) professional from San Jose, CA.

I've been working in the GIS field since 2008. I started my GIS career working for Channel Islands National Park. Since then, I've grown my GIS knowledge through approximately 12 years of experience in the public health, parks & recreation, utility, and public safety fields.

I love working on GIS projects that help improve community health. My favorite GIS projects were those that helped improve park access, increased drinking water and stormwater quality, and decreased 911 call response times.

I enjoy creating print maps, web maps, and dashboards, but I also find GIS data management, geoprocessing automation, and process improvement equally exciting.

I've included a few examples of my GIS work below. Feedback, comments, and questions are more than welcome. (Since I've spent a large portion of my career working with sensitive health and utility data, much of my work can't be displayed here. For more information about my past work, please see my resume below.)

[My Resume](https://github.com/melhayashida/GIS_Portfolio/files/12223008/HayashidaResume_2023.pdf)

```yaml
remote_theme: niklasbuschmann/contrast@v2.11

plugins:
  - jekyll-remote-theme
```

Note: to enable icons you also need to copy over the `_data` folder.

## Config

Your `_config.yml` could for example look like this:

```yaml
title: "Blog Title"
author: "Blog Author"
description: "My personal blog about ... something"
permalink: /:title/
lang: "en"
excerpt_separator: "\n\n\n"
date_format: "%B %d, %Y"

# Layout

show_excerpts: true        # show article excerpts on the home page
show_frame: true           # adds a gray frame to the site
show_sidebar: false        # show a sidebar instead of the usual header

# Menu

navigation:                # accepts {file, title, url, icon, sidebaricon}
  - {file: "index.html"}
  - {file: "README.md"}

external:                  # shows a footer with social links - for available icons see fontawesome.com/icons
  - {title: Mail, icon: envelope, url: "mailto:niklasbuschmann@users.noreply.github.com"}
  - {title: Github, icon: github, url: "https://github.com/niklasbuschmann/contrast"}
  - {title: Subscribe, icon: rss, url: "/feed.xml"}

comments:
#  disqus_shortname: ""    # see https://disqus.com/
#  isso_domain: ""         # see https://posativ.org/isso/

plugins:
 - jekyll-feed

```

## MathJax

Contrast comes preinstalled with a leightweight alternative to MathJax called [KaTeX](https://katex.org/). To display equations in a post simply set `mathjax: true` in the article's front matter.

## License

[public domain](http://unlicense.org/)

## Screenshots

![screenshot](https://user-images.githubusercontent.com/4943215/109431850-cd711780-7a08-11eb-8601-2763f2ee6bb4.png)

![screenshot](https://user-images.githubusercontent.com/4943215/109431832-b6cac080-7a08-11eb-9c5e-a058680c23a1.png)

![screenshot](https://user-images.githubusercontent.com/4943215/73125194-5f0b8b80-3fa4-11ea-805c-8387187503ad.png)
