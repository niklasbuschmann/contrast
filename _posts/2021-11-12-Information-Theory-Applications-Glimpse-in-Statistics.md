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

$$

\tikzset{every picture/.style={line width=0.75pt}} %set default line width to 0.75pt        

\begin{tikzpicture}[x=0.75pt,y=0.75pt,yscale=-1,xscale=1]
%uncomment if require: \path (0,231); %set diagram left start at 0, and has height of 231

%Right Arrow [id:dp6127963958329294] 
\draw   (83,130.5) -- (136.4,130.5) -- (136.4,128) -- (172,133) -- (136.4,138) -- (136.4,135.5) -- (83,135.5) -- cycle ;
%Rounded Rect [id:dp5427691278731221] 
\draw  [fill={rgb, 255:red, 255; green, 255; blue, 255 }  ,fill opacity=1 ] (179,104.8) .. controls (179,94.42) and (187.42,86) .. (197.8,86) -- (331.2,86) .. controls (341.58,86) and (350,94.42) .. (350,104.8) -- (350,161.2) .. controls (350,171.58) and (341.58,180) .. (331.2,180) -- (197.8,180) .. controls (187.42,180) and (179,171.58) .. (179,161.2) -- cycle ;
%Flowchart: Terminator [id:dp0901909558139744] 
\draw   (13.46,173.22) -- (12.86,99.51) .. controls (12.78,89.93) and (28.02,82.04) .. (46.91,81.88) .. controls (65.8,81.73) and (81.17,89.37) .. (81.25,98.95) -- (81.86,172.66) .. controls (81.94,182.24) and (66.69,190.13) .. (47.8,190.28) .. controls (28.91,190.44) and (13.54,182.8) .. (13.46,173.22) -- cycle ;
%Right Arrow [id:dp5243197221719231] 
\draw   (352,127.75) -- (412.6,127.75) -- (412.6,125) -- (453,130.5) -- (412.6,136) -- (412.6,133.25) -- (352,133.25) -- cycle ;
%Right Arrow [id:dp6119210317016925] 
\draw   (505,128.75) -- (565.6,128.75) -- (565.6,126) -- (606,131.5) -- (565.6,137) -- (565.6,134.25) -- (505,134.25) -- cycle ;
\draw (31,110.4) node [anchor=north west][inner sep=0.75pt]  [font=\Huge,color={rgb, 255:red, 208; green, 2; blue, 27 }  ,opacity=1 ]  {$\Theta $};
% Text Node
\draw (109,101.4) node [anchor=north west][inner sep=0.75pt]  [font=\large,color={rgb, 255:red, 0; green, 0; blue, 0 }  ,opacity=1 ]  {$\theta ^{\ast }$};
% Text Node
\draw (232,99.4) node [anchor=north west][inner sep=0.75pt]  [font=\Huge,color={rgb, 255:red, 226; green, 56; blue, 56 }  ,opacity=1 ]  {$Q_{\theta ^{\ast }}$};
% Text Node
\draw (455,99.4) node [anchor=north west][inner sep=0.75pt]  [font=\Huge,color={rgb, 255:red, 226; green, 56; blue, 56 }  ,opacity=1 ]  {$X^{n}$};
% Text Node
\draw (616,93.4) node [anchor=north west][inner sep=0.75pt]  [font=\Huge,color={rgb, 255:red, 226; green, 56; blue, 56 }  ,opacity=1 ]  {$\hat{\theta }$};
\end{tikzpicture}
$$
