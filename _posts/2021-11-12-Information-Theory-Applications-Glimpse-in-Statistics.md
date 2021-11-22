---
title:  "Information Theory Applications Glimpse in Statistics"
mathjax: true
author: Mehrdad Mohammadi
category: Information Theoey and Learning Theory 
---
**Era of massive data sets brings fascinating problems at the interfaces between information theory and
(statistical) learning theory.**

<br/>
There are various studied connections between information theory and statistics:
<ul>
  <li>Hypothesis testing, large deviations</li>
  <li>Fisher information, Kullback-Leibler divergence</li>
  <li>Metric entropy and Fano’s inequality</li>
  <li> etc...</li>
</ul>
<br/>
 In their classic paper, Kolmogorov and Tikhomirov(1959) make connections between statistical estimation, metric entropy and the notion of channel capacity. Let's write and draw this in information theoretic jargon. Let; <br/>
 
 **Codebook:** indexed parametric family of probability distributions $$\{Q_\theta | \theta \in
\Theta\}$$ <br/>
 **Codeword:** nature chooses some parameter $$\theta^\ast \in
\Theta$$ (the so-called True Parameter value) <br/>
 **Channel:** user observes $$n$$ i.i.d. draws from the true distribution $$X_i \sim Q_\theta^\ast$$<br/>
 **Decoding:** estimator $$X^n \mapsto \hat{\theta}$$ such that $$\hat{\theta}\overset{\mathbb{P}}{\rightarrow}\theta^\ast$$ <br/>
 The setting could be defined in many variations:

*codebooks/codewords:*   graphs, vectors, matrices, functions, densities,etc.<br/>
*channels:*              random graphs, regression models, elementwise probes of vectors/machines, random projections,etc.<br/>
*closeness $$\hat{\theta}\overset{\mathbb{P}}{\rightarrow}\theta^\ast$$ subject to:*     exact/partial graph recovery in Hamming, $$\mathcal{l^p}$$-distances, $$L^P(Q)$$-distances, sup-norm etc.<br/>

<img src="/images/blog/pic1.png" align=center style="width:250px;height:250px">    
