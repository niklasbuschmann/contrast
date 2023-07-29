---
title:  "LSTM-earliness follow-up"
mathjax: true
layout: post
categories: media
---

# Motivation
- In a linkedin post, Sebastian Raschka pointed out that while transformer models do not suffer from the forgetting of information in the beginning of a document, a recent experiment shows that they are bad at using/remembering data in the middle of a document (Lost in the Middle: How Language Models Use Long Contexts, https://arxiv.org/abs/2307.03172). 
- This points out two things; 
	- RNNs are bad at remembering early information, and the temporal losses are to a certain degree justified.
	- Transformers attention mechanism is independent of timing, but may be limited by the patterns in the training data (when humans consistently encode the most important information in the beginning or end of a document).


# Relevancy to the loss paper
- As the key aim of the loss paper was to improve earliness, transformers (trained the right way(?)) might outperform LSTMs on remaining time prediction, as they do not suffer from forgetting when sequences become long.
- Furthermore, it might be interesting to study the importance of different parts of the trace, in terms of the total remaining throughput time.
	- This could e.g. be measured by calculating the relative importance of each activity, in terms of its "contribution" to the total cycle time.
		- importance_weight = (y_i_t/sum(y_i_t)_{t=1}^{T})
		- this importance weight (for event t) would be the ground truth as of how important it is to the total cycle time
		- and then it could be compared with the residual of the predictions, somehow indicating how much it contributed to the total residual of predicted remaining cycle time
		- In short, the aim is to see how much an individual event (and its timing) contributes to the overall residual

# Potential research questions
- To which degree does the early information in a trace matter, in terms of the overall residual?
- To which degree does the models memory mechanisms matter (remembering early, mid or recent steps), for both accuracy and earliness?
	- How does transformers compare to LSTM RNNs for remaining time prediction?

# Sources
- https://arxiv.org/abs/2307.03172
- https://arxiv.org/abs/2307.02486
- https://www.linkedin .com/feed/update/urn:li:activity:7083427280605089792?updateEntityUrn=urn%3Ali%3Afs_feedUpdate%3A%28V2%2Curn%3Ali%3Aactivity%3A7083427280605089792%29

# An afterthought
- Scaling laws of LSTMs to event-log data is also an interesting thing that could be useful to know more about. What size of model is appropriate for what size and type of process?
- Similar thoughts as with Chinchilla scaling "laws".
- This could be studied with the simulation engine.
- Best type of optimizer and settings, given