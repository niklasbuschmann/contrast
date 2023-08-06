---
layout : post
title:  "Implicit Supervised Learning; Reinforcement Learning"
mathjax: true
author: Mehrdad Mohammadi
category: Learning Theory
tags: [Learning_Theory, Overview]
---

How can (machine) agents learn from experience without a  teacher explicitly telling them what to do? Reinforcement learning is the area within (machine) learning that investigates how an agent can learn an optimal behavior by correlating a reward with its past actions. It draws from several disciplines, including behavioral psychology, economics, and operations research, to model the learning process. In this approach, the environment is typically modeled as a Markov decision process, where the agent receives immediate reward and state information but must learn how to choose actions that maximize its overall reward over time.

Supervised learning is the most common data analysis and has been extensively studied in the statistics community for a long time. Supervised learning is a sound approach, but collecting input-output paired data is often too expensive. Unsupervised learning, on the other hand, is inexpensive to perform, but it tends to be ad hoc. Reinforcement learning is placed between supervised learning and unsupervised learning, but we still want to learn the input-output relation behind the data. Instead of output data, reinforcement learning utilizes rewards, which evaluate the validity of predicted outputs. Giving implicit supervision such as rewards is usually much easier and less costly than giving explicit supervision. Various supervised and unsupervised learning techniques are also utilized in the framework of reinforcement learning.

To illustrate a reinforcement learning problem, consider a maze  where a robot must reach the goal without guidance on which direction to take. In this problem, states are positions in the maze, actions are possible directions, and transitions describe how states connect through actions. Rewards indicate the incomes or costs that the robot agent receives, and the goal is to find the policy that allows the robot agent to receive the maximum amount of rewards in the long run. To achieve this goal efficiently, dynamic programming can be used to obtain the (state-)value, which is the return as a function of the initial state. This method breaks down the complex optimization problem into simpler subproblems and solves them recursively, reusing solutions to reduce computation costs.

Let $Q$ expected utility or value \citep{sutton2018reinforcement}, Bellman’s equation  describes this value in terms of the expected reward and the expected outcome of the random transition $(x,a)\mapsto (X',A')$:
$$Q(x,a)=\mathbb{E} R(x,a)+ \gamma \mathbb{E} Q(X',A')$$

Let $Z$ the random return whose expectation is the value $Q$. This random return is described by a recursive equation, but one of a distributional nature. The distributional Bellman equation \citep{bellemare2017distributional} states that the distribution of $Z$ is characterized by the interaction of three random variables: the reward $R$, the next state-action $(X',A')$, and
its random return $Z(X',A')$:
$$Z(x,a)\overset{D}{=} R(x,a)+ \gamma Z(X',A')$$
\cite{bellemare2017distributional} show that, for a fixed policy, the distributional Bellman operator is a contraction in a maximal form of the Wasserstein metric. However, the same operator is not a contraction in total variation, Kullback-Leibler divergence, or Kolmogorov distance.\\

Unlike ordinary RL that the optimality version of Bellman equation has a unique fixed point $Q^\ast$,the optimal value function, \citep{sutton2018reinforcement} corresponding to the set of optimal policies, an optimality analog of Distributional Bellman Equation does not have a unique fixed point. In fact, the distributional operator defined over return is not a contraction \citep{bellemare2017distributional}.\\

Existing distributional RL algorithms parameterize the policy return distribution in many different ways, including canonical return atoms \citep{bellemare2017distributional} , the expectiles \citep{rowland2019statistics}, the moments \citep{nguyen2021distributional}, and the quantiles \citep{dabney2018distributional,  yang2019fully, dabney2018implicit}.\\



