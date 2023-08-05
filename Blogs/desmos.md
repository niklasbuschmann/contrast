---
title: "Graphing Art"
mathjax: true
permalink: "/blog/desmos"
layout: page
---

# <span style="color: #6495ED;">What's Desmos?</span>

[Desmos](https://www.desmos.com/calculator) is an online graphing calculator whos appeal is owed to its abundant array of features, empowering users to craft splendid creations solely through the foundation of mathematics.

## <span style="color: #6495ED;">Basic Graphing Functions</span>

### <span style="color: #6495ED;"> Linear Functions</span>

Linear functions are the simplest functions to both design and bound. In theory, a masterpiece could be indistinguishably approximated with sufficient linear functions given an infinitely powerful computer to render it on Desmos. However, due to computational restraints of the website and the amount of time it would to write (or generate) all linear functions, it's an infeasible method. Instead, we will use linear functions only for straight lines. This may be a promiment feature in the art depending on the theme. For example, a 2-point perspective city art will contain primarily straight lines, while organic drawings will contain almost none. 


Example:
$$ y = mx + b\cdot \{ |x - a_1| < a_2 \} $$

Patrick Star: Organic curves
![heart](../assets/images/desmos_patrick.png){:width="300px" height="300px"}


Cubes without perspective distortion
![heart](../assets/images/desmos_cubes.png){:width="300px" height="300px"}

Fun fact: that linear function bounds can be entirely described with a single variable.

### <span style="color: #6495ED;">Polynomial Functions</span>

Polynomials show up often in math classes, but it's function in art is less pronounced. Most degrees of polynomials simply don't have an important shape in art aside from possibly the quadratic. And even so most shapes you see in real life that look like a quadratic aren't. For example Catenary functions better describe hanging chains than quadratics. Polynomials functions in Desmos art truly only shines in motion. 

Catenary
$$y = a \cosh\left(\frac{x}{a}\right)$$ 

vs 

Quadratics
$$ y = ax^2 + bx + c $$

### <span style="color: #6495ED;">Parametric Equations</span>

Parametric equations introduce a pair of variables, usually denoted as $$x(t)$$ and $$y(t)$$, to define a curve. Parametric functions act most similar to how a hand would draw as they start at a point and move with some pattern, similar to an artist. Introducing piecewise definition to parametric functions allows one to draw art of unbounded complexity, but just like code it's important to ensure readability and not just have a "1-liner" in Desmos. This is so that sections can be reused or modified in the future. 

Here's an example of a parametric equation that generates a heart shape:

$$\left(16\left(\sin t\right)^{3},13\cos t-5\cos\left(2t\right)-2\cos\left(3t\right)-\cos\left(4t\right)\right)$$<br>


![heart](../assets/images/desmos_heart.png){:width="300px" height="300px"}

to be continued