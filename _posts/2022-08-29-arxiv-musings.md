---
layout: post
title: ArXiv musings - 2022, week 35
categories:
    - "arxiv musings"
    - "paper review"
    - "english"
tags:
    - "english"
---

Here is a summary of a few papers that caught my eye this week.

<!--more>

## [Data-Driven Causal Effect Estimation Based on Graphical Causal Modelling: A Survey](https://arxiv.org/pdf/2208.09590.pdf)

One of my main gripes with causal inference is how much information/prior knowledge seems to be necessary to estimate any kind of effect. This paper surveys data-driven methods which can help fill part of the graph when not all variables are known. Now I must admit I haven't read this one yet (it is still early days in my causal inference journey); but it seems well-written.

## [How to Design AI for Social Good: Seven Essential Factors](https://link.springer.com/content/pdf/10.1007/s11948-020-00213-5.pdf)

This paper details seven types of best practices for designing AI for social good (AI4SG): Falsifiability and incremental deployment (hello agile!), safeguards agains the manipulation of predictors (should the model be open? should people be aware of the metrics out of a need for transparency, or should they remain hidden out of a fear of manipulation?), receiver-contextualised intervention (respecting the autonomy of the user, allow them to turn off the intervention), receiver-contextualised explanation and transparent purposes (determine who is the receiver of the explanation, and what the purpose of the explanation is: transparency, acceptability, maintainability...), privacy protection and data subject consent (pretty self-explanatory), situational fairness (handling bias), human-friendly semanticisation (AI predicts, but does not define).

Well-written and accessible. I really enjoyed this paper.

## [The cost of passing - using deep learning AIs to expand our understanding of the ancient game of Go](https://arxiv.org/pdf/2208.12643.pdf)

A fun paper -- the authors propose a new metric, the cost of passing (not playing a stone at one's turn), to analyze Go moves. Go-playing AIs can calculate an average winning score (total number of points -- distinguish from the winning rate) for each position. A high cost of passing denotes a position as urgent: the player is threatened and needs to make a move, or it may cost them. This metric could, for example, be used as a teaching tool that automatically warns beginner players of a dangerous position.


[Concept-based techniques for "musicologist-friendly" explanations in a deep music classifier](https://arxiv.org/pdf/2208.12485.pdf)

Another fun one -- today is a good day to be browsing the arxiv. This paper looks at subject concept-based explanations for a classifier that identifies the composer of a classical music piece. Instead of looking at features (PCA and the like), concept-based explanations look at "concepts"; for example, does a classifier recognize the concept of "stripes" when it classifies a picture of a zebra? Two methodologies are presented:

 - Supervised concept-based explanations: the end-user creates different concepts (for example, "hard-to-play music", "contrapuntal structure", etc) and chooses a set of examples to illustrate each. One then studies the activation of the network layers when tested on these concepts to understand whether they're significant.

 - Unsupervised concept-based explanations: in this setting, concepts are automatically identified, then examples are produced. The expert then translates these sets of examples into intelligible concepts.
 
This made me want to learn more about concept-based explanations. I'll look for a survey article!


