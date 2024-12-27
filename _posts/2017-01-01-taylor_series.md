---
title:  "Giải thích và code from scratch chuỗi Taylor (Taylor Series)"
mathjax: true
layout: post
categories: media
---

### **Understanding Function Approximations: Taylor vs Padé**

#### **Introduction: Real-Life Approximation**

Imagine you are coding an algorithm in a low-level programming language, such as Assembly, which lacks built-in functions for calculating trigonometric and exponential values.
Unlike Python, where such calculations are effortless thanks to prebuilt libraries, low-level programming demands a different approach. In this scenario, how can you solve the problem ?

The answer lies in **Function Approximation**

---

### **Taylor Approximation**

#### **What is Taylor Approximation?**
The Taylor approximation represents a function as a polynomial expanded around a specific point (usually $x = 0$). This method is based on the idea that a smooth function can be closely approximated by a sum of its derivatives at a point.

#### **Formula**
The Taylor series of a function $f(x)$ around $x = a$ is given by:

$$
f(x) \approx T_n(x) = f(a) + f'(a)(x-a) + \frac{f''(a)}{2!}(x-a)^2 + \cdots + \frac{f^{(n)}(a)}{n!}(x-a)^n
$$

For simplicity, if $(a = 0)$, this becomes the Maclaurin series:
$$
T_n(x) = f(0) + f'(0)x + \frac{f''(0)}{2!}x^2 + \cdots + \frac{f^{(n)}(0)}{n!}x^n
$$

#### **Mathematical Proof**

According to fundamental theorem of calculus (F.T.C), we have:

$$f(x) = \int_{x_0}^{x} f'(x_1)dx_1 + f(x_0)$$

Expand the F.T.C, we have: 

$$$$

$$\begin{aligned}
f(x) &= \int_{x_0}^{x} \int_{x_0}^{x_1} f''(x_2)dx_2 dx_1 + f(x_0) + \int_{x_0}^{x}f'(x_0)dx_1 \\ 
&= \int_{x_0}^{x} \int_{x_0}^{x_1} \int_{x_0}^{x_2} f'''(x_3)dx_3 dx_2 dx_1 + f(x_0) + \int_{x_0}^{x}f'(x_0)dx_1 + \int_{x_0}^{x} \int_{x_0}^{x_1} f''(x_0)dx_2 dx_1 \\ 
&= \int_{x_0}^{x} ... \int_{x_0}^{x_{n-1}} f^{(n)}(x_n)dx_n dx_{n-1}... dx_2 dx_1 + f(x_0) + ... + \frac{1}{n!} f^{(n)}(x - x_0)^n
\end{aligned}$$

Coin $O_1(n) = \int_{x_0}^{x} ... \int_{x_0}^{x_{n-1}} f^{(n)}(x_n)dx_n dx_{n-1}... dx_2 dx_1$, $O_2(n) = f(x_0) + ... + \frac{1}{n!} f^{(n)}(x - x_0)^n$. We have: 

$$f(x) = O_1(n) + O_2(n)$$

The $O_1(n)$, which comprises of nested integrals, is a complete nightmare. In contrast, the rest of the equation is quite straightforward. 
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

However, in some cases where $\vert f^{(n)}(x_n) \vert \leq n^n$. Then we will have 

$$\lim_{n \rightarrow \infty} n^n \times \frac{(x-x_0)^n}{n!} \approx (x-x_0)^n$$

This will converge if $\vert x - x_0 \vert \leq 1$. So you better pick $x$ that is only around 1 value away from the $x_0$. 


#### **Example: Exponential Function**
Approximate $f(x) = e^x$ at $x = 0$:
- $f(0) = 1$, $f'(0) = 1$, $f''(0) = 1$, etc.
- Maclaurin series:
$$
e^x \approx 1 + x + \frac{x^2}{2!}
$$
For $x = 0.5$, this gives:
$$
e^{0.5} \approx 1 + 0.5 + \frac{0.5^2}{2} = 1.625
$$
(True value: 1.64872).

For $x = 2$, this gives:
$$
e^{1} \approx 1 + 1 + \frac{1^2}{2} = 2.5
$$
(True value: 7.389)

---

### **Padé Approximation**

#### **What is Padé Approximation?**
Padé approximation represents a function as a ratio of two polynomials. Unlike Taylor series, which use a single polynomial, Padé excels at approximating functions with singularities or poles and provides better global accuracy.

#### **Formula**
A Padé approximation of order $(m, n)$ for $f(x)$ is given by:
$$
R_{m,n}(x) = \frac{P_m(x)}{Q_n(x)}
$$
where:
- $P_m(x)$ is a polynomial of degree $m$,
- $Q_n(x)$ is a polynomial of degree $n$, normalized such that $Q_n(0) = 1$.

The coefficients of $P_m(x)$ and $Q_n(x)$ are chosen such that the Taylor series of $R_{m,n}(x)$ matches $f(x)$ as closely as possible up to $x^{m+n}$.

The [N/M] Padé approximant is constructed to agree with the first M + N terms of the Taylor series. 

#### **Example: Exponential Function**

For $f(x) = e^x$, the $(1,1)$ Padé approximation is given by:
$$
R_{1,1}(x) = \frac{P_1(x)}{Q_1(x)} = \frac{b_0 + b_1x}{1 + c_1x},
$$
where:
- $P_1(x) = b_0 + b_1x$ is the numerator,
- $Q_1(x) = 1 + c_1x$ is the denominator.

Our goal is to determine the coefficients $b_0$, $b_1$, and $c_1$ by matching the Taylor series expansion of $R_{1,1}(x)$ with $f(x)$ up to $x  $.

---

### **Step 2: Expand the Taylor Series for $e^x$**

$$e^x \approx 1 + x$$
---

### **Step 3: Match Coefficients**

$$1 + x = \frac{b_0 + b_1x}{1 + c_1x}$$

---

### **Step 4: Solve for Coefficients**

By multiplying the left term and the lower right term, we get: 

$$\begin{aligned}
&\leftrightarrow (1+x + \frac{x^2}{2})(1+c_1x) = b_0 + b_1x \\
&\leftrightarrow 1 + (1 + c_1)x + (c_1 + \frac{1}{2})x^2 = b_0 + b_1x \\ 
&\leftrightarrow b_0 = 1, c_1 = -\frac{1}{2}, b_1 = \frac{1}{2}
\end{aligned}$$

---

### **Final Padé Approximation**

$$
R_{1,1}(x) = \frac{P_1(x)}{Q_1(x)} = \frac{1 + \frac{x}{2}}{1 - \frac{x}{2}},
$$

$$R_{1, 1}(0.5) = \frac{1 + \frac{0.5}{2}}{1 - \frac{0.5}{2}} = 1.6667$$

$$R_{1, 1}(1) = \frac{1 + \frac{1}{2}}{1 - \frac{1}{2}} = 3$$

---

### **Comparison of Taylor and Padé Approximations**

| **Aspect**             | **Taylor Approximation**                      | **Padé Approximation**                      |
|------------------------|-----------------------------------------------|---------------------------------------------|
| **Form**              | Polynomial                                    | Rational function (polynomial ratio)       |
| **Convergence**       | Slow near singularities                      | Faster, especially near poles              |
| **Accuracy**          | Local accuracy                               | Better global accuracy                     |
| **Handles Singularities** | Cannot represent poles or asymptotes         | Can approximate functions with poles       |
| **Oscillation**       | May oscillate (Runge's phenomenon)           | Smooth approximation                       |
| **Complexity**        | Simpler to compute                           | More complex (requires solving equations)  |

#### **Summary**
Taylor approximation is ideal for smooth functions over a small domain, providing simplicity and ease of computation. However, for functions with singularities or when global accuracy is critical, Padé approximation outshines Taylor by providing better convergence and handling poles effectively. Understanding the strengths of each method can help you choose the right tool for your approximation needs.

---

Which method will you use for your next problem?



### References

1. [Derivation of the Taylor Series Part 1](https://www.youtube.com/watch?v=2-X7lqZvjy8)

2. [Derivation of Taylor Series Expansion](https://hep.physics.illinois.edu/home/serrede/P435/Lecture_Notes/Derivation_of_Taylor_Series_Expansion.pdf)

3. [Taylor Series](https://byjus.com/maths/taylor-series/)