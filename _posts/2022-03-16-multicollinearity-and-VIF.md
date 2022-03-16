---
title:  "Multicollinearity and VIF"
mathjax: true
layout: post
categories: model fit, interpretability
---

The general setup for your regression problem may look something like below. The model coefficients ($\beta_i$) may then be interpreted in a manner that indicates the amount of change in your predictor variables ($X$) that results in a unit change in your dependent variable $y$. A problem arises when there are significant correlations between your predictor variables so that a change in one such variable not only causes a change in $y$ but in the other correlated predictor variables as well, thus misestimating the model coefficients and making their interpretation difficult. This is the problem of **multicollinearity**.


$$ y = \sum_{i=1}^{p} \beta_i X_{n \times p} + \epsilon $$

**Implications of multicollinearity:** Multicollinearity may not affect model accuracy much and is mainly a concern when interpreting model coefficients. If you need to speak to the importance of a feature in a model that assumes linear regression, then multicollinearity is something to watch out for. Some of the models affected include linear regression and SVM models using a linear kernel. 

**Variance Inflation Factor (VIF)** is one way to quantify multicollinearity. It measures how much the variance (and thus the standard errors) of the model coefficients are inflated. The VIF of the ith coefficient is computed as below, where $R^2_i$ is $R^2$ of the model obtained by regressing the ith predictor variable on the other predictor variables. 

$$ VIF_{i} = \frac{1}{1 - R^2_i}$$

## How to use it
An ideal value for VIF could be 1, indicating no inflation of standard errors ($SE$) and, therefore, no multicollinearity for that predictor variable. Another way to think about it is that VIF is a multiplier factor on the variance, therefore $\sqrt{VIF}$ is the multiplier factor on the standard errors of the model coefficients. So, when $VIF = 1$ $ \implies 1 * SE $, thus no inflation. If $VIF=4$, then, $\sqrt{4} = 2$ factor inflation, meaning that the SE of that model coefficients is two times larger than if there were no multicollinearity with other predictor variables. 


### Rule of Thumb
I've found different suggestions on what thresholds to apply when deciding if the VIF is reasonable or not; I suppose it depends on your problem and industry. Generally, though, most suggestions boil down to these three rules.

- $VIF = 1$: Nothing to be concerned about 
- $1 < VIF \le 5$: Moderate degree of correlation 
- $VIF > 5$: Highly correlated 

**What to do if you find moderate or high VIF**
Here's what I've garnered so far; see these as heuristics and not prescriptive.

- VIF of the model intercept should not be a concern. The same may hold for control variables. We're more interested in the predictor variable coefficients and their interpretation. 

- VIF values of 2.5 or less may be acceptable and accordingly reported

- Dummy variables for categorical variables with more than two levels may exhibit high VIF even when the underlying categorical variables is not correlated with the other variables 

- Dropping one of the highly correlated predictor variables improves the VIF of the other variables 

- Prefer or create composite indexes from the correlated predictor variables. For instance, BMI (body mass index) is computed from weight and height. Using BMI would be preferable to using weight and height (see example results below). 

- Don't interpret the affected model coefficients. 


## Code example (Python)
In the below code snippet, I assume that you've already loaded your dataset using <a href="https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.html" target="_blank">pandas</a>. At the very least get your data into a matrix format, where your $X_{n \times p}$ matrix is your data matrix of $n$ observations and $p$ predictor variables. 

Once you have $X$, you set up a regression model for each of the predictor variables with respect to the other predictor variables. I.E. $ V_i = \sum_j \beta_j V_j, \forall i \neq j$, where $V$ is a predictor variable. For instance, in the code snippet, we have the variables gender, age, height and weight. For each of them, we'd compute the VIF of the resulting model. For gender, for example, we'd compute the VIF of the model `gender ~ age + height + weight`.  

{% highlight py %}
## Prerequisites === Load your data 
import pandas as pd
my_dataframe = pd.read_csv('my_data.csv' )

## VIF-specific libraries
from statsmodels.stats.outliers_influence import variance_inflation_factor

## i. prepare your X matrix (n observations, p predictors)
my_predictor_variables = ['Gender', 'Age', 'Height', 'Weight'] 
X = my_dataframe[ my_predictor_variables ]
print(X.shape) 

## ii. compute VIF of each 
VIF = [ (pv, variance_inflation_factor(X.values, pi)) for pi, pv in enumerate(my_predictor_variables)]

## iii. view results
VIF = pd.DataFrame.from_records(VIF)
VIF.columns = ("Predictor Variable", 'VIF')
VIF

{% endhighlight %}


{% highlight py %}
## Alternate way to compute your design matrix X via model definition/equation 
from patsy import dmatrices
my_model_eq = 'Height ~ Gender + Age + Weight' 
_, X = dmatrices( my_model_eq, data=my_dataframe, return_type='dataframe')

## Compute VIF: everything else after this is as above
{% endhighlight %}

<p align='center'>
    <img src='https://github.com/bilha-analytics/ncov_bot_app/blob/master/20220316_vif__b4_bmi.png?raw=true' width='150'> 
    <img src='https://github.com/bilha-analytics/ncov_bot_app/blob/master/20220316_vif__replace-bmi.png?raw=true' width='150'> 
    <img src='https://github.com/bilha-analytics/ncov_bot_app/blob/master/20220316_vif__replace_BP.png?raw=true' width='150'> 
</p> 


<p align='center'>
    <img src='https://github.com/bilha-analytics/ncov_bot_app/blob/master/20220316_vif_eq_b4.png?raw=true' width='150'> 
    <img src='https://github.com/bilha-analytics/ncov_bot_app/blob/master/20220316_vif_eq_after.png?raw=true' width='150'>  
</p> 



## References and Resources 

<ul> 
<li><a href="https://online.stat.psu.edu/stat462/node/180/" target="_blank">Penn State Eberly College of Science, STAT 462 - VIF </a></li>

</ul>

