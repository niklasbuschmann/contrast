---
title:  "Retrieval-based Chatbot"
mathjax: true
layout: post
categories: media
---

Chatbots automatically provide answers to common or well-known issues in a manner that simulates conversational interactions. In this project, we build a retrieval-based chatbot using cosine similarity on a database of frequently asked questions about COVID-19 as at 31-Mar-2019. 

<p align='center'>
    <img src='https://github.com/bilha-analytics/ncov_bot_app/blob/master/eg_screen_map.png?raw=true' width='150'> 
    <img src='https://github.com/bilha-analytics/ncov_bot_app/blob/master/eg_screen_bot.png?raw=true' width='150'> 
    <img src='https://github.com/bilha-analytics/ncov_bot_app/blob/master/eg_screen_about.png?raw=true' width='150'> 
    <img src='https://github.com/bilha-analytics/ncov_bot_app/blob/master/eg_screen_news.png?raw=true' width='150'> 
</p> 


[Cosine Similarity](https://en.wikipedia.org/wiki/Cosine_similarity) is a common approach in information retrieval. It provides a measure of how similar two documents are based on their content. In this project, the two documents are, first, a user query and, second, an FAQ database from which a respose is retrieved. For this project, model performance was best when using lemmatization and TF-IDF encoding. 

The cosine similarity matching approach is also compared to other common machine learning models. [More details on the project here](https://github.com/bilha-analytics/ncov_bot_app), and try out the app [here](https://ncov-bot-app.herokuapp.com/)


**Libraries used**

- [NLTK](https://www.nltk.org/) NLP Toolkit 
- [Sklearn](https://scikit-learn.org/stable/modules/generated/sklearn.feature_extraction.text.TfidfVectorizer.html) 
- [Flask web framework](https://flask.palletsprojects.com/en/2.0.x/) and [Jinja templates](https://jinja.palletsprojects.com/en/3.0.x/) 
- [Beautiful soup](https://beautiful-soup-4.readthedocs.io/en/latest/)


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