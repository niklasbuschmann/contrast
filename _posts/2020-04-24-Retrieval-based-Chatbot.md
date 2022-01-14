---
title:  "Retrieval-based Chatbot"
mathjax: true
layout: post
categories: media
---

Chatbots automatically provide answers to common or well-known issues in a manner that simulates conversational interactions. In this project, we build a retrieval-based chatbot using cosine similarity on a database of frequently asked questions about COVID-19 as at 31-Mar-2020. 

<p align='center'>
    <img src='https://github.com/bilha-analytics/ncov_bot_app/blob/master/eg_screen_map.png?raw=true' width='150'> 
    <img src='https://github.com/bilha-analytics/ncov_bot_app/blob/master/eg_screen_bot.png?raw=true' width='150'> 
    <img src='https://github.com/bilha-analytics/ncov_bot_app/blob/master/eg_screen_about.png?raw=true' width='150'> 
    <img src='https://github.com/bilha-analytics/ncov_bot_app/blob/master/eg_screen_news.png?raw=true' width='150'> 
</p> 


<a href="https://en.wikipedia.org/wiki/Cosine_similarity" target="_blank">Cosine Similarity</a> is a common approach in information retrieval. It provides a measure of how similar two documents are based on their content. In this project, the two documents are, first, a user query and, second, an FAQ database from which a respose is retrieved. For this project, model performance was best when using lemmatization and TF-IDF encoding. 

The cosine similarity matching approach is also compared to other common machine learning models. <a href="https://github.com/bilha-analytics/ncov_bot_app" target="_blank">More details on the project here</a>, and try out the app <a href="https://ncov-bot-app.herokuapp.com/" target="_blank">here</a>. 


**Libraries used**

- <a href="https://www.nltk.org/" target="_blank">NLTK, NLP Toolkit</a>.
- <a href="https://scikit-learn.org/stable/modules/generated/sklearn.feature_extraction.text.TfidfVectorizer.html" target="_blank">SKlearn</a>.  
- <a href="https://flask.palletsprojects.com/en/2.0.x/" target="_blank">Flask web framework</a> and  <a href="https://jinja.palletsprojects.com/en/3.0.x/" target="_blank">Jinja templates</a>.  
- <a href="https://beautiful-soup-4.readthedocs.io/en/latest/" target="_blank">Beautiful soup</a>.  


**Referenced resources/assets**

FAQ content and News
<ul>
    <li><a href="http://www.health.go.ke/" target="_blank"> Ministry of Health, KE </a></li>
    <li><a href="https://coronavirus.jhu.edu/" target="_blank"> Johns Hopkins University of Medicine - Corona Virus Resource Center </a></li>
    <li><a href="https://www.who.int/" target="_blank"> WHO </a></li>
    <li><a href="https://www.cdc.gov/coronavirus/2019-ncov/index.html" target="_blank"> CDC </a></li>
    <li><a href="http://newsapi.org"> News API Org </a></li>
</ul>

Covid map and stats 
<ul>
    <li><a href="https://coronavirus.jhu.edu/" target="_blank"> Johns Hopkins University of Medicine - Corona Virus Resource Center </a></li>
    <li><a href="https://covid19api.com/" target="_blank"> Public Covid19 API </a>, which sources from John Hopkins</li>
    <li><a href="https://www.worldometers.info/coronavirus/about/" target="_blank"> Worldometers </a></li>
</ul>