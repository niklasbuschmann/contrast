---
layout: post
title: ArXiv musings - 2022, week 33
categories:
    - "arxiv musings"
    - "paper review"
    - "english"
tags:
    - "english"
---

Here is a summary of a few papers that caught my eye this week.

## [Why do tree-based models still outperform deep learning on tabular data?](https://arxiv.org/pdf/2207.08815.pdf)
This paper by three French researchers proposes a new, extensive benchmark procedure for machine learning models on structured (tabular) data. The dataset is made of 45 different tabular datasets, some with numerical-only, and some with mixed features. The benchmark procedures rates the performance of the algorithms using accuracy (for classification) and $$R^2$$ (for regression) after an increasing number of iteration of a random hyperparameter search. 

<!--more-->

The authors then use this procedure to compare the performances of several tree-based models and neural networks. The tree-based models consistently outperform the deep learning ones, even when accounting for training costs of neural network (even with a very large "tuning budget", tree-based models show superior performance).

Most interestingly, the authors go on to suggest reasons why neural networks struggle with tabular data:
1. Neural networks are more suited to smoother functions. Artificially smoothing out the response function reduces the gap in performance between the neural networks and the tree-based methods. 
2. Neural networks are sensitive to useless features. Adding uninformative features (random gaussian features that are uncorrelated with the target) increases the performance gap. Removing unimportant features (as ranked by a random forest) narrows it, suggesting that neural networks are not robust to uninformative features.
3. Neural networks are rotation-invariant. When rotating the data (applying a unitary matrix transformation to it), the performance of tree-based methods takes a deep plunge, while neural networks show almost no degradation in performance; in fact, neural networks outperform tree-based methods on rotated data. Tabular data is not rotation-invariant (columns have meanings), so the learning process should not be. This in particular suggests that one could make neural networks more accurate on tabular data by breaking rotation invariance (eg. with an embedding).

## [Formal Algorithms for Transformers](https://arxiv.org/pdf/2207.09238.pdf)
A paper that describes transformers in details, with pseudocode. To my (and the authors') knowledge, this is the first time anyone provides pseudocode for transformers. The Motivation section of the paper gives several arguments as to why publishing pseudocode raises the standard of scientific writing in computer science.

I have been wanting to understand transformers properly for a long time and only encountered vague diagrams and vaguer written explanations. This paper is the one that did it for me.

## [Generalizing from a Few Examples: A Survey on Few-Shot Learning](https://arxiv.org/pdf/1904.05046.pdf)
What the title says.

I've heard and read the phrase few-shot learning too many times to keep ignoring the fact that I don't know what it means. While the paper suffers from less-than-stellar writing, and I'm not sure I fully recommend it, I do know now what few-shot learning is. The survey is thorough, and starts with a definition of few-shot learning (FSL), which is contextualized by comparing it to similar machine learning problems. They then propose a taxonomy of strategies for FSL, and describe the current methods falling under each class of the taxonomy.

Here's a summary of the introductory part:

The authors define few-shot learning as the problem of learning a function (classification or regression) from few supervised examples. The task is done by augmenting the learning process with prior knowledge. For example, a few-shot learning problem of drug discovery (classifying a molecule as poisonous or not) can be augmented with prior knowledge of similar molecules and how they behave. The problem of generating handwritten characters from a few samples can benefit from the prior knowledge of shapes and patterns of letters.

The authors compare and contrast FSL to several other machine learning problem: weakly supervised learning (when only a few examples are labeled), imbalanced learning (where there are only a few examples of one class), transfer learning (where a pre-trained model is adapted to a different domain; this one is considered a form of FSL) or meta-learning (where a meta-learner is trained to extract generic/broad information from a dataset; this is also a solution to the FSL problem).

Solutions to the FSL problem can be roughly classified in three groups, depending on which part of the modelisation process they focus on:
- Data: generate more data samples from the given few examples (data augmentation techniques)
- Model: restrict the hypothesis space to constrain the model and improve the search for an optimal function
- Algorithm: use prior knowledge to guide the search for an optimal function (for example, by influencing the initial step, or the direction of the subsequent learning steps)
