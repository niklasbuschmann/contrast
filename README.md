# Contrast

![screenshot](https://user-images.githubusercontent.com/4943215/50294425-2da5bf80-0476-11e9-8a27-8c59a7192cf6.png)
![screenshot](https://user-images.githubusercontent.com/4943215/50294472-3f876280-0476-11e9-8458-6a40fe735335.png)

## Installation (recommended)

Just fork the repo and adjust the `_config.yml` to use with [Github Pages](https://pages.github.com/) and your page is done.

*Note:* If you want to use this theme in a subfolder, then you need to create a `gh-pages` branch in your repo.

## Installation (jekyll-remote-theme method)

You can also create an empty repo, add `index.html` and `archive.html` files, which can be empty but need to contain front matter, and add this to your `_config.yml`:

```yaml
remote_theme: niklasbuschmann/contrast

plugins:
  - jekyll-remote-theme
```

For an example repo you can look at the [demo](https://github.com/niklasbuschmann/contrast-demo) of this theme.

## Features

 - supports dark mode in macOS Mojave
 - MathJax support
 - no external ressources
 - included archive page
 - supports pagination
 - feed generation
 - responsive
 - syntax highlighting
 - supports comments via [disqus](https://disqus.com/) or [isso](http://posativ.org/isso/)

## Based on

- [Minima](https://github.com/jekyll/minima)
- [Lagrange](https://github.com/LeNPaul/Lagrange)
- [Font Awesome](http://fontawesome.io/)
- [KaTeX](https://katex.org/)
- [Pygments](https://github.com/richleland/pygments-css)

## License

[public domain](http://unlicense.org/)

## Additional Screenshots

### With navbar

![screenshot](https://user-images.githubusercontent.com/4943215/50602342-6bafd400-0eb7-11e9-8275-d0986af3061f.png)

### With navbar and dark_nav: true

![screenshot](https://user-images.githubusercontent.com/4943215/50602434-82562b00-0eb7-11e9-86f3-ac9b6f577843.png)

### With navbar and style: minimal

![screenshot](https://user-images.githubusercontent.com/4943215/50602485-ae71ac00-0eb7-11e9-8b37-5dd9b5c09d8d.png)

### With navbar and style: frame

![screenshot](https://user-images.githubusercontent.com/4943215/50602509-c34e3f80-0eb7-11e9-8aa3-5e07650daeaf.png)
