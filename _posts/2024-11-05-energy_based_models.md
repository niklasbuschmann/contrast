---
title:  "Energy-based models"
mathjax: true
layout: post
categories: media
---

<figure style="text-align: center">
<img src="https://substackcdn.com/image/fetch/f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fc3b7d8e3-df8d-4d69-a8f5-082a5d8b0509_1020x680.avif" alt="">
</figure>

### 1. Introduction to Energy-based models (EBMs)

Energy-based models (EBMs) are a class of probabilistic models that assign an energy to each configuration of the input data and learn to identify low-energy configurations. Unlike traditional supervised learning methods that directly predict output from input, EBMs instead use an energy function to determine stable configurations. 

* **Key Concepts:**

* * **Energy function**:  An energy function is a scalar function that maps input configurations to energy values. The goal is to find low-energy configurations, which correspond to stable states or patterns in the data.

* * **State:** Each possible configuration of the model (e.g., the activations in a neural network) represents a state.

* * **Energy Minimisation:** EBMs learn by finding the lowest-energy states, effectively discovering the most probable or stable states.

* **Why EBMs are relevant:**

* * They offer a flexible approach to model complex distributions without requiring explicit probability calculations. 

* * EBMs have foundational importance in unsupervised learning and associative memory and have influenced many modern architectures. 

### 2. Core concepts of energy-based models

* **Energy functions:** In physics, energy represents the system's potential to perform work. In EBMs, energy functions encode how compatible a given state is with the underlying data distribution. Lower energy means the model is more confident in that state, making energy minimisation a core process. 

* **Objective:** The primary objective in EBMs is to minimise the energy of states that align with observed data, while pushing non-observed (or less probable) states to higher energies. 

* **Connection to physics**: EBMs are inspired by concepts from statistical mechanics, where systems evolve towards configurations that minimize free energy. This concept is leveraged to ensure the model "learns" representations by converging to stable, low-energy states. 


### 3. Restricted Boltzmann Machines (RBMs)

* **Overview:**
* * An RBM is a type of two-layer, generative stochastic neural network that can learn a probability distribution over its set of inputs. 

* * RBMs were popularised by Geoffrey Hinton and are particularly useful in unsupervised learning tasks like feature learning and collaborative filtering. 

* **Architecture:**

<figure style="text-align: center">
<img src="https://scikit-learn.org/1.5/_images/rbm_graph.png" alt="">
</figure>


* * **Bipartite Structure:** An RBM consists of two layers: a visible layer (representing observed data) and a hidden layer (capturing latent features). There are no intra-layer connections; nodes in the visible layer only connect to nodes in the hidden layer. 

* * **Weights and Biases:** Each connection between visible and hidden units has an associated weight, while each unit has an associated bias. These parameters define the energy landscape. 

* **Energy function for RBMs:**

* * The energy is measured as follows: 

$$E(\mathbf{v}, \mathbf{h}) = -\sum_i \sum_j w_{ij}v_ih_j - \sum_i b_iv_i - \sum_j c_jh_j$$

In the formula above, $b$ and $c$ are the intercept vectors for the visible and hidden layers, respectively. The joint probability of the model is defined in terms of the energy:

* **Training & Inference phase**

Given a specific configuration of $v$ and $h$, we map it the probability space.

$$p(v,h) = \frac{e^{-E(v,h)}}{Z}$$

The Z constant is a normalisation factor to ensure that we actually map to the probability space. Now, let's get to what we're looking for; the probability of a set of visible neurons, in other words, the probability of our data.

$$Z = \sum_{v \in V}\sum_{h \in H}e^{-E(v,h)}$$

$$p(v)=\sum_{h \in H}p(v,h)=\frac{\sum_{h \in H}e^{-E(v,h)}}{\sum_{v \in V}\sum_{h \in H}e^{-E(v,h)}}$$

Although there are a lot of terms in this equation, it simply comes down to writing the correct probability equations. Hopefully, so far, this has helped you realise why we need energy function to calculate the probability, or what is done more usually the unnormalised probability $p(v)*Z$. The unnormalised probability is used because the partition function $Z$ is very expensive to compute. 

Now, let's get to the actual learning phase of RBMs. To maximise likelihood, for every data point, we have to take a graident step to make $p(v) = 1$. To get the gradient expressions it takes some mathematical acrobatics. The first thing is to take the log of $p(v)$. 

$$\log(p(v))=\log[\sum_{h \in H}e^{-E(v,h)}]-\log[\sum_{v \in V}\sum_{h \in H}e^{-E(v,h)}]$$

Let's take the gradient with respect to the parameters in $p(v)$

$$\begin{align}
\frac{\partial \log(p(v))}{\partial \theta}=& 
-\frac{1}{\sum_{h' \in H}e^{-E(v,h')}}\sum_{h' \in H}e^{-E(v,h')}\frac{\partial E(v,h')}{\partial \theta}\\ & + \frac{1}{\sum_{v' \in V}\sum_{h' \in H}e^{-E(v',h')}}\sum_{v' \in V}\sum_{h' \in H}e^{-E(v',h')}\frac{\partial E(v,h)}{\partial \theta}
\end{align}$$

Now, I did this on paper and wrote the semi-final equation down as to not waste a lot of space on this site. I recommend you derive these equations yourself. Note that: $Zp(v,h)=e^{-E(v,h')}$, $p(v)=\sum_{h \in H}p(v,h)$, and that $p(h|v) = \frac{p(v,h)}{p(h)}$. 

$$\begin{align}
\frac{\partial log(p(v))}{\partial \theta}&=
-\frac{1}{p(v)}\sum_{h' \in H}p(v,h')\frac{\partial E(v,h')}{\partial \theta}+\sum_{v' \in V}\sum_{h' \in H}p(v',h')\frac{\partial E(v',h')}{\partial \theta}\\
\frac{\partial log(p(v))}{\partial \theta}&=
-\sum_{h' \in H}p(h'|v)\frac{\partial E(v,h')}{\partial \theta}+\sum_{v' \in V}\sum_{h' \in H}p(v',h')\frac{\partial E(v',h')}{\partial \theta}
\end{align}$$

* Applications

* * RBMs are useful in tasks like dimensionality reduction, feature learning, and collaborative filtering. 

### 4. Hopfield Networks

* **Overview:**

* * Hopfield networks are fully connected, recurrent networks used to store and retrieve patterns. They operate as associative memory models, meaning they can retrieve a stored pattern even when given a noisy or partial version. 

* **Architecture**

<figure style="text-align: center">
<img src="https://www.researchgate.net/profile/Vincent-Gripon/publication/51200860/figure/fig1/AS:601636439355396@1520452713067/node-Hopfield-network-model-All-nodes-are-connected-to-each-other-through-28_Q320.jpg" alt="">
</figure>


* * Hopfield networks consists of binary units that are fully connected. Each neuron connects to every other neuron, with symmetric weights, meaning $w_{ij} = w_{ji}$.

* **Training & Inference phase:**

* **Applications of Hopfield Networks:**

* * **Pattern recognition:** Recognising known patterns despite noise. 

* * **Memory recall:** Acting as an associative memory system, recalling entire patterns from partial inputs. 

### 5. Modern extensions and relevance

### 6. Conclusion