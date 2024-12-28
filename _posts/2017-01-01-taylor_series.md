---
title:  "Giải thích chuỗi Taylor và Padé (Taylor Series)"
mathjax: true
layout: post
categories: media
---

### 1. Introduction: Real-Life Approximation

Imagine you are coding an algorithm in a low-level programming language, such as Assembly, which lacks built-in functions for calculating trigonometric and exponential values.
Unlike Python, where such calculations are effortless thanks to prebuilt libraries, low-level programming demands a different approach. In this scenario, how can you solve the problem ?

The answer lies in **Function Approximation**

### 2. Taylor Approximation

#### 2.1. What is Taylor Approximation
The Taylor approximation represents a function as a polynomial expanded around a specific point. This method is based on the idea that a smooth function can be closely approximated by a sum of its derivatives at a point.

#### 2.1. Formula
The Taylor series of a function $$f(x)$$ around $$x = a$$ is given by:

$$
f(x) \approx T_n(x) = f(a) + f'(a)(x-a) + \frac{f''(a)}{2!}(x-a)^2 + \cdots + \frac{f^{(n)}(a)}{n!}(x-a)^n
$$

For simplicity, if $$(a = 0)$$, this becomes the Maclaurin series:
$$
T_n(x) = f(0) + f'(0)x + \frac{f''(0)}{2!}x^2 + \cdots + \frac{f^{(n)}(0)}{n!}x^n
$$

#### 2.2. Mathematical Proof

According to fundamental theorem of calculus (F.T.C), we have:

$$f(x) = \int_{x_0}^{x} f'(x_1)dx_1 + f(x_0)$$

Expand the F.T.C, we have: 

$$\begin{aligned}
f(x) &= \int_{x_0}^{x} \int_{x_0}^{x_1} f''(x_2)dx_2 dx_1 + f(x_0) + \int_{x_0}^{x}f'(x_0)dx_1 \\ 
&= \int_{x_0}^{x} \int_{x_0}^{x_1} \int_{x_0}^{x_2} f'''(x_3)dx_3 dx_2 dx_1 + f(x_0) + \int_{x_0}^{x}f'(x_0)dx_1 + \int_{x_0}^{x} \int_{x_0}^{x_1} f''(x_0)dx_2 dx_1 \\ 
&= \int_{x_0}^{x} ... \int_{x_0}^{x_{n-1}} f^{(n)}(x_n)dx_n dx_{n-1}... dx_2 dx_1 + f(x_0) + ... + \frac{1}{n!} f^{(n)}(x - x_0)^n
\end{aligned}$$

Coin $$O_1(n) = \int_{x_0}^{x} ... \int_{x_0}^{x_{n-1}} f^{(n)}(x_n)dx_n dx_{n-1}... dx_2 dx_1$$, $$O_2(n) = f(x_0) + ... + \frac{1}{n!} f^{(n)}(x - x_0)^n$$. We have: 

$$f(x) = O_1(n) + O_2(n)$$

The $$O_1(n)$$, which comprises nested integrals, is a complete nightmare. In contrast, the rest of the equation is quite straightforward. 
However, the more we expand the equation, the less important is the first term. Let me prove it. 

Assume that: 

$$\vert f^{(n)}(x_n) \vert \leq b$$

Then, 

$$\begin{aligned}
\vert \int_{x_0}^{x} ... \int_{x_0}^{x_{n-1}} f^{(n)}(x_n)dx_n dx_{n-1}... dx_2 dx_1 \vert &\leq \vert f^{(n)}(x_n) \vert \times \vert \int_{x_0}^{x} ... \int_{x_0}^{x_{n-1}}dx_n dx_{n-1}... dx_2 dx_1 \vert \\
& \leq b \times \frac{(x-x_0)^n}{n!}
\end{aligned}$$

If we expand it further, 

$$\lim_{n \rightarrow \infty} b \times \frac{(x-x_0)^n}{n!} = 0$$

However, in some cases where $$\vert f^{(n)}(x_n) \vert \leq n^n$$. Then we will have 

$$\lim_{n \rightarrow \infty} n^n \times \frac{(x-x_0)^n}{n!} \approx (x-x_0)^n$$

This will converge if $$\vert x - x_0 \vert \leq 1$$. So you better pick $x$ that is within 1 unit from the $$x_0$$. 


#### 2.3. Example: Exponential Function
Approximate $$f(x) = e^x$$ at $$x = 0$$:
- $$f(0) = 1$$, $$f'(0) = 1$$, $$f''(0) = 1$$, etc.
- Maclaurin series:
$$
e^x \approx 1 + x + \frac{x^2}{2!}
$$
For $$x = 0.5$$, this gives:
$$
e^{0.5} \approx 1 + 0.5 + \frac{0.5^2}{2} = 1.6458333333333333
$$
(True value: 1.6487, Error: 0.00288).

For $$x = 1.$$, this gives:
$$
e^{1} \approx 1 + 1 + \frac{1^2}{2} = 2.6666666666666665
$$
(True value: 2.7182, Error: 0.05161)

### 3. Padé Approximation

#### 3.1. **What is Padé Approximation?**
Padé approximation represents a function as a ratio of two polynomials. Unlike Taylor series, which use a single polynomial, Padé excels at approximating functions with singularities or poles and provides better global accuracy.

#### 3.2. **Formula**
A Padé approximation of order $$(m, n)$$ for $$f(x)$$ is given by:
$$
R_{m,n}(x) = \frac{P_m(x)}{Q_n(x)}
$$
where:
- $$P_m(x)$$ is a polynomial of degree $m$,
- $$Q_n(x)$$ is a polynomial of degree $n$, normalized such that $$Q_n(0) = 1$$.

The coefficients of $$P_m(x)$$ and $$Q_n(x)$$ are chosen such that the Taylor series of $$R_{m,n}(x)$$ matches $$f(x)$$ as closely as possible up to $$x^{m+n}$$.


The main advantage of Padé approximation over Taylor's is the **flexibility**. In Taylor's polynomial expansion 

$$\lim_{x \rightarrow \infty} T_n(x) \rightarrow \infty$$

and this behaviour is not desireable for functions that never reach $$\infty$$ such as trigonometric functions. In such cases, Padé can fix this by introducing $$m=n$$, which can ensure that the limit of the function will not go to $$\infty$$. Furthermore, if the approximated functions will genuinely go to $$\infty$$ as variables go to $$\infty$$, we can also adjust Padé coeffients $$m>n$$. Overall, Padé Approximation is a more general approximator of the Taylor's polynomial expansion. 

However, when you use Padé approximation, you shold be **aware of the domain of the denominator since there are certain values that are not computable**. 

#### 3.3. **Example: Exponential Function**

For $$f(x) = e^x$$, the $$(2,1)$$ Padé approximation is given by:
$$
R_{2,1}(x) = \frac{P_1(x)}{Q_1(x)} = \frac{b_0 + b_1x + b_2 x^2}{1 + c_1x},
$$
where:
- $$P_2(x) = b_0 + b_1x + b_2 x^2$$ is the numerator,
- $$Q_1(x) = 1 + c_1x$$ is the denominator.

Our goal is to determine the coefficients $$b_0$$, $$b_1$$, $$b_2$$, and $$c_1$$ by matching the Taylor series expansion of $$R_{2,1}(x)$$ with $$f(x)$$ up to $$x^3$$.

* **Step 1: Expand the Taylor Series for $$e^x$$**

$$e^x \approx 1 + x + \frac{x^2}{2} + \frac{x^3}{6}$$


* **Step 2: Match Coefficients**

$$1 + x +  \frac{x^2}{2} + \frac{x^3}{6} = \frac{b_0 + b_1x + b_2 x^2}{1 + c_1x}$$



* **Step 3: Solve for Coefficients**


$$\begin{aligned}
&\leftrightarrow (1+x + \frac{x^2}{2} + \frac{x^3}{6})(1+c_1x) = b_0 + b_1x + b_2 x^2 \\
&\leftrightarrow 1 + x(1+c_1) + x^2(\frac{1}{2} + c_1) + x^3(\frac{1}{6} + \frac{c_1}{2}) + x^4 \frac{c_1}{6} = b_0 + b_1x + b_2 x^2 \\
&\leftrightarrow b_0 = 1, c_1 = -\frac{1}{3}, b_1 = \frac{2}{3}, b_2 = \frac{1}{6}
\end{aligned}$$



* **Step 4: Final Padé Approximation**

$$
R_{2,1}(x) = \frac{P_1(x)}{Q_1(x)} = \frac{1 + \frac{2x}{3} + \frac{x^2}{6}}{1 - \frac{x}{3}},
$$


$$R_{2, 1}(0.5) = \frac{1 + \frac{2 \times 0.5}{3} + \frac{0.5^2}{6}}{1 - \frac{0.5}{3}} = 1.65$$

(True value: 2.7182, Error: 0.001278)


$$R_{2, 1}(1) = \frac{1 + \frac{2 \times 1}{3} + \frac{1^2}{6}}{1 - \frac{1}{3}} = 2.7499$$

(True value: 2.7182, Error: 0.0317)


As you can see, the error of Padé approximation is slightly smaller than that of Taylor approximation. However, in exchange, more computation is used. 



### 3. Summary

Taylor approximation is ideal for smooth functions **over a small domain**, providing simplicity and ease of computation. However, if the approximated functions do not go to $$\infty$$ as Taylor series do, consider applying Padé approximation. 


With that said, which method will you use for your next problem?


### References

1. [Derivation of the Taylor Series Part 1](https://www.youtube.com/watch?v=2-X7lqZvjy8)

2. [Derivation of Taylor Series Expansion](https://hep.physics.illinois.edu/home/serrede/P435/Lecture_Notes/Derivation_of_Taylor_Series_Expansion.pdf)

3. [Taylor Series](https://byjus.com/maths/taylor-series/)