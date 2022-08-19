---
layout: post
title: "Dall-E and bias"
categories:
    - "paper review"
    - "opinion"
    - "english"
tags:
    - "english"
---

I have been reading a lot about bias and fairness in AI recently, and one example in particular caught my eye: DALL-E.


## DALL-E

DALL-E is a transformers model developed by openAI to generate images from text prompts. It is based on a modified version of GPT-3. DALL-E was originally released in January 2021, and its successor, DALL-E 2, was announced in April 2022.

Like all AI models (except some that might be specifically tuned to avoid this pitfall), DALL-E reflects the biases in its training data. Ask it to represent a lawyer, and you'll get pictures of a grey-haired white male. If you ask for a nurse instead, all the pictures will represent women. "Convicted criminal" will skew heavily non-caucasian, while "police officer" will be, again, all-white. Although the model is built for fun and games, this perpetuates harmful stereotypes and needs addressing. 

<!--more-->

## Bias mitigation

The team behind DALL-E has made efforts to mitigate this bias, and the recently-released DALL-E 2 should show more diverse pictures (in particular, it was trained on a carefully balanced dataset). There had been suspicions in the community that DALL-E might simply be randomly appending some ethnical background/gender identifiers to prompts in order to produce more diversified results; this has been denied by the creators of the model, who provided more information in [a lengthy blog post](https://openai.com/blog/dall-e-2-pre-training-mitigations/) detailing a two-step approach:
 - First, the OpenAI team trained a classifier to filter out violent or sexual content. Filtering these examples out unfortunately has the tendency to create more bias: as an example, even though the dataset contains roughly the same number of men and women, the developers suspect that the women were usually depicted in more explicitly sexual context, thus were filtered out. Thus, filtering appeared to have amplified the gender bias in some representations.
 - To mitigate the introduced bias, the developers re-weighted the different classes according to how much had been filtered out. Since the images were labeled, a search for keywords (eg. "man" or "woman") yielded approximately how many images corresponding to each class was filtered out. As an example, 14% of the images associated with the word "woman" were removed, while only 6% of the ones associated with "man" were.


## The problem of regurgitation

During development, the OpenAI team realized that DALL-E was sometimes regurgitating examples in the training dataset. Additionally to hurting performances (after all, DALL-E is supposed to invent new images, not copy existing ones), this could lead to copyright infringement and breach of privacy issues for the people whose picture is present in the dataset. 

The regurgitated images presented two interesting features: they were almost all vector graphics (which contain little information and thus are easy to memorize), and, more importantly, all had several near-duplicates in the dataset. Maybe taking out the duplicates would solve the regurgitation problem?

Identifying near duplicated images on such a huge dataset is ridiculously computationally intensive (every image has to be compared to literally every other image), so the developers took a clever approach: they first clustered the datase, then searched for near-duplicates of each image within its cluster. 
This seemed to take care of the problem: none of the previously identified prompts (prompts which were present in the training dataset) lead to regurgitated images.

Interestingly, when the developers asked a panel of humans to rate the output of the models (before and after deduplication), they found a slight preference for the model after deduplication. 

## Thoughts

- The fact that removing sexually explicit content introduced a gender bias is quite interesting (although not that surprising). The filtering model was trained to optimize recall and not precision, so there could have been a somewhat large amount of false positives. 
- The model still presents problematic bias, as explicited in the [model card](https://github.com/openai/dalle-2-preview/blob/main/system-card.md), but that did not prevent release to a select audience. Maybe one day the incentives to build fair and balanced models will outweighs the call for fast release of high-performance models.
