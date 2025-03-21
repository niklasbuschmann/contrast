---
title:  "IRFundusSet - Large Dataset "
mathjax: true
layout: post
categories: dataset, retinal fundus, 
---

**TLDR;**
- Access a larger and more heterogeneous retinal fundus dataset
- Integrates and harmonizes pixel-level and label data 
- Current coverage is 10 public datasets 
- <a href="https://arxiv.org/abs/2402.11488" target="_blank"> IRFundusSet paper</a>
- <a href="https://github.com/bilha-analytics/IRFundusSet" target="_blank">  IRFundusSet on Github </a> 


Availability and quality of training data is a common challenge when developing AI models.  Obtaining comprehensive and sufficiently sized datasets of health-related datasets is non-trivial.

A current challenge with retinal fundus datasets is the fragmentation of publicly available datasets. These datasets often differ significantly in their data organization, archiving methods, and in the definition of disease labels. In addition, the definition of a "healthy" or "normal" eye can vary considerably between datasets. Some may include images with minor, non-vision-threatening conditions as "normal," while others may have stricter criteria. This inconsistency can restrict the overall diversity of data available for training AI models and often necessitates substantial additional curation efforts by researchers. 


The Integrated Retinal Fundus Set (IRFundusSet) aims to consolidate, harmonize, and curate several existing public retinal fundus image datasets into a more unified and accessible resource. 

- The primary goal of IRFundusSet is to facilitate the consumption of these previously fragmented datasets as a cohesive whole by harmonizing the pixel data and providing a consistent "is_normal" label across all included images. 

- Furthermore, a user-friendly Python package has been created to automate the harmonization process and provide a standardized dataset object that is compatible with popular deep learning frameworks like PyTorch.

<p align='center'><b> Composition of IRFundusSet</b>
    <a href="https://arxiv.org/abs/2402.11488" target="_blank"> 
    <img src='https://github.com/bilha-analytics/ncov_bot_app/blob/master/retinal_fundus/result-irfunduset.png?raw=true' width='450'> </a>
</p> 


**Accessing IRFundusSet** 
- <a href="https://arxiv.org/abs/2402.11488" target="_blank"> IRFundusSet paper</a>
- <a href="https://github.com/bilha-analytics/IRFundusSet" target="_blank">  IRFundusSet on Github </a> 
