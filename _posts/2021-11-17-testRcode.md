---
title:  "Assumptions of Multiple Linear (OLS) Regression for FAA (F4-F3)"
mathjax: true # allows for equations
layout: post # looks like a post
categories: # useful for grouping things by category later
 - github
 - website
---

```{r}
# LOAD REQUIRED PACKAGES
library(lmtest)
library(readxl)
library(kableExtra)
library(car)
library(nortest)
library(MASS)
library(broom)

# Import data
exportdirxls <- "D:\\MPI_LEMON\\EEG_MPILMBB_LEMON\\EEG_Statistics\\DataLemon.xlsx" # Path to dataLemon file
Data <- data.frame(read_excel(exportdirxls, 1, col_names = TRUE))
row.names(Data) <- Data[,1] # set row names
Data <- Data[,-1] # delete subject variable
Data[,19] <- factor(Data[,19]) # make categorical variables into factors
Data[,20] <- factor(Data[,20])
Data[,21] <- factor(Data[,21])

# Create separate datasets for each model, without missing values
na.ham <- which(is.na(Data$Hamilton.Scale)) # find two missing values in Hamilton.Scale
na.skid <- which(is.na(Data$SKID.Diagnoses)) # find one missing value in SKID.Diagnoses
na <- c(na.ham, na.skid) # combine three missing values
Data.no.na <- Data[-na, ] # remove those 3 subjects as they cannot be entered into regression
dataF4F3 <- Data.no.na[,-c(1,3,4)]
N = nrow(dataF4F3)

full.model <- lm(FAA.F4F3 ~ ., data = dataF4F3)
modelBIC <- MASS::stepAIC(full.model, trace = 0, k = log(N)) # BIC
modelAIC <- MASS::stepAIC(full.model, trace = 0, k = 2) # AIC
```
```{r}
# Comparison:
car::compareCoefs(modelBIC, modelAIC)
```

## **Checking of Assumptions for Ordinary Least Squares (OLS) Regression**

<center>**modelBIC**</center>

The **diagnostic plots** show residuals in four different ways ([1](http://www.sthda.com/english/articles/39-regression-model-diagnostics/161-linear-regression-assumptions-and-diagnostics-in-r-essentials/)):

1. Residuals vs Fitted. The predicted Y-values ($\hat{y}$) are on the X-axis, and the residuals (*e*) are on the Y-axis. Used to check the linear relationship assumptions. A horizontal line, without distinct patterns is an indication for a linear relationship.

2. Normal Q-Q. The ordered observed standardised residuals are on the Y-axis, and the ordered theoretical residuals (expected residuals if they are truly normally distributed) are on the X-axis. Used to examine whether the residuals are normally distributed. It’s good if residuals points follow the straight dashed line.

3. Scale-Location (or Spread-Location). Used to check the homogeneity of variance of the residuals (homoscedasticity). Horizontal line with equally spread points is a good indication of homoscedasticity.

4. Residuals vs Leverage. Used to identify influential cases, that is extreme values that might influence the regression results when included or excluded from the analysis. This plot will be described further in the next sections.

The four plots show the top 3 most extreme data points labeled with with the row numbers of the data in the data set. They might be potentially problematic.

```{r}
par(mfrow = c(2,2))
plot(modelBIC, las = 1)
```
### 1. Unusual Observations
Unusual observations may disproportionately influence the outcomes of the models.
Multiple linear regression is not very robust against these types of observations.

In  the  absence  of  outliers  and  with  the  fulfillment  of  the  assumptions  of  zero mean, constant variance, and uncorrelated errors the OLS provides the Best Linear Unbiased Estimators (BLUE) of the regression parameters. But any anomalous point can disproportionately pull the line and distort the predictions. Detection of outlying observations is a very  essential  part  of  good  regression  analysis.

An influential observation is one which either individually or together with several other observations has a demonstrably larger impact on the calculated values of various estimates (e.g., coefficient, standard errors, t-values) than to the case for most of the other observation (Belsley et al., 1980).

#### 1.1 Outliers
An outlier is an observation with a large absolute residual. Outliers can be identified by examining the standardized residual, which is the residual divided by its estimated standard error. Standardized residuals can be interpreted as the number of standard errors away from the regression line. Observations whose standardized residuals are greater than 3 in absolute value are possible outliers (James et al. 2014). It would be expected that only 0.2% of observations would fall into this category.
##### modelBIC:
```{r}
d <- cooks.distance(modelBIC) # COOK'S DISTANCE
r <- stdres(modelBIC) # STANDARDIZED RESIDUALS
rabs <- abs(r) # absolute stand. resid.
a <- cbind(dataF4F3[,-c(1:19)], d, r, rabs)
asorted <- a[order(-rabs), ]
absresids <- asorted[1:10, ]
kable(absresids, "html") %>% kable_styling("striped") %>% scroll_box(width = "100%")
```
The table shows the 10 highest absolute values of the standardized residuals (rabs). Two residuals are larger than 3, subjects 274 and 166. Subject 274 is identified as an outlier by an outlier test below.

```{r}
# TEST FOR OUTLIERS
outlierTest(modelBIC)
```

#### 1.2 Influential Observations
Cook's Distance. Cut-off points of *4/n*. 
Cook's distance refers to how far, on average, predicted y-values will move if the observation in question is dropped from the data set. It is a measure that combines the information of leverage and the residual of the observation. 14 observations have values of Cook's D above 4/N = 0.019.
```{r}
kable(a[d > 4/N, ], "html") %>% kable_styling("striped") %>% scroll_box(width = "100%")
```

#### 1.3 High leverage observations

A data point has high leverage if it has extreme predictor x values. This can be detected by examining the leverage statistic, or the hat-values, which are the diagonal elements of the hat-matrix and which describe the leverage each point has on its fitted values. A value of this statistic above 2(p + 1)/n indicates an observation with high leverage (P. Bruce and Bruce 2017); where, p is the number of predictors and n is the number of observations. No observations are identified as having high leverage (.hat > 2(p+1)/n)
```{r}
# Create table of model metrics and identify observations with high leverage
model.metrics <- data.frame(augment(modelBIC))
row.names(model.metrics) <- model.metrics[,1]
model.metrics <- model.metrics[, -c(1:19)]
p <- ncol(dataF4F3)
n <- nrow(dataF4F3)
hlt<- 2 * (p + 1) / n # high-leverage threshold
model.metrics[model.metrics$.hat > hlt,]
```

### 2. Residuals are Normaly Distributed

The distribution of the residuals can be visualized with a histogram. It appears relatively normal, with one, or a few, outliers on the right tail.
```{r}
resid.modelBIC <- residuals(modelBIC)
hist(resid.modelBIC)
```
The **Q-Q plot** of residuals can be used to inspect the normality assumption. Some observations fall outside of the reference line.
```{r}
plot(modelBIC, 2)
```

Due to the large sample size, a normality test should be able to provide more information. While the *Shaprio-Wilks* test (barely) rejects the null hypothesis of normaly distributed residuals, the *Anderson-Darling* test, which is generally considered better than the Shaprio-Wilks, indicate that the residuals are not normally distributed.

```{r}
shapiro.test(resid.modelBIC)
```
```{r}
ad.test(resid.modelBIC)
```
The central limit theorem will make the coefficients asymptotically normal, even if the errors are not. However, the speed of this asymptotic convergence greatly depends on how non-normal is the distribution of the errors. The histogram and the Q-Q plot both indicate that there is no large deviation from the assumption of normality, rather a small amount of outliers that appear to be causing some problems. Non-severe departures from normality yield valid (asymptotic) inference for relatively large sample sizes, which is why this assumption is generally considered less problematic than the other assumptions. See e.g., [this article](https://doi.org/10.1146/annurev.publhealth.23.100901.140546) 

Histogram of the response variable (FAA):
```{r}
attach(dataF4F3)
hist(FAA.F4F3)
```
Looks fairly normal, but with some observations far out on both tails.

Using a **nonlinear transformation** for the response (FAA) may help. Below I find optimal lambda for [Yeo-Johnson transformation](https://doi.org/10.1093/biomet/87.4.954.), transform the response variable, and plot the differences:
```{r}
YJ <- car::powerTransform(modelBIC, family = "yjPower")
(lambdaYJ <- YJ$lambda) # optimal lambda
YTransf <- car::yjPower(U = FAA.F4F3, lambda = lambdaYJ) # tranformation
par(mfrow = c(1, 2))
hist(FAA.F4F3, freq = FALSE, breaks = 10, ylim = c(0, 1.3))
hist(YTransf, freq = FALSE, breaks = 10, ylim = c(0, 1.3))
#https://bookdown.org/egarpor/PM-UC3M/lm-ii-diagnostics.html#fn75
```
Below is a comparison between scale-locatoin plots for regular FAA values and transformed FAA values, to see if there is an improvement in heteroscedasticity. They appear almost identical. However, Shapiro-Wilks and Anderson-Darling tests are no longer significant. Furthermore, Levene's test is no longer significant either (see Homoscedasticity assumption).

```{r}
par(mfrow = c(1, 2))
plot(modelBIC, 3)
plot(lm(YTransf ~ Age), 3) # Slightly less hereroskedastic
```
```{r}
shapiro.test(residuals(lm(YTransf ~ Age)))
```

```{r}
ad.test(residuals(lm(YTransf ~ Age)))
```


### 3. Homoscedasticity
This assumption states that the variance of error terms are similar across the values of the independent variables. A **scale-location** plot of standardized residuals versus predicted values can show whether points are equally distributed across all values of the independent variables. The line should be almost constant about 1. This line is clearly sloping downwards, with higher fitted values showing smaller residuals.
```{r}
plot(modelBIC, 3)
```
The Levene's test is used to test equality of variance for the categorical predictor age.
```{r}
# Test equality of variance for the predictor age. Looks bad
leveneTest(modelBIC)
```

#### 3.1 Studentized Breusch-Pagan test for heteroscedasticity.
The Breush-Pagan test and can be used to test for heteroscedasticity as well.
```{r}
bp <- bptest(modelBIC, studentize = TRUE) # looks bad
bp
```
As both tests are significant, this assumption does not hold either.

When transforming the data, however, the assumption holds.
```{r}
leveneTest(lm(YTransf ~ Age))
```
```{r}
bptest(lm(YTransf ~ Age), studentize = TRUE) # looks better
```

```{r}
modelBIC.YJ <- lm(YTransf ~ Age)
summary(modelBIC.YJ)
```

### 4. Linear Relationship Between the Dependent Variable (FAA) and the Independent Variables

Linearity assumption is guaranteed to hold for a categorical predictor.

### 5. No Multicollinearity
This assumption does not apply to the present model, as it only contains one predictor (Age).


There are a couple of outliers and some influential observations. The biggest issue for this model is the assumption of normally distributed residuals. The robust variance estimator, often called the Sandwhich estimator, can be used in this case, as it is consistent irrespective of whether the residuals in the regression model have constant variance. The assumption of homoscedasticity does not hold either. Robust regression methods, such as huber weighting of residuals, can be used to decrease the effect of outliers.






<center>**modelAIC**</center>
```{r}
par(mfrow = c(2,2))
plot(modelAIC, las = 1)
```
### 1. Unusual Observations

#### 1.1 Outliers
An outlier is an observation with a large absolute residual. Outliers can be identified by examining the standardized residual, which is the residual divided by its estimated standard error. Standardized residuals can be interpreted as the number of standard errors away from the regression line. Observations whose standardized residuals are greater than 3 in absolute value are possible outliers (James et al. 2014). It would be expected that only 0.2% of observations would fall into this category.

```{r}
d <- cooks.distance(modelAIC) # COOK'S DISTANCE
r <- stdres(modelAIC) # STANDARDIZED RESIDUALS
rabs <- abs(r) # absolute stand. resid.
a <- cbind(dataF4F3[,-c(1:19)], d, r, rabs)
asorted <- a[order(-rabs), ]
absresids <- asorted[1:10, ]
kable(absresids, "html") %>% kable_styling("striped") %>% scroll_box(width = "100%")
```
The table shows the 10 highest absolute values of the standardized residuals (rabs). Two residuals are larger than 3, subjects 166 and 283. Subject 166 is identified as an outlier by an outlier test below.

```{r}
# TEST FOR OUTLIERS
outlierTest(modelAIC)
```

#### 1.2 Influential Observations
Cook's Distance. Cut-off points of *4/n*. 
Cook's distance refers to how far, on average, predicted y-values will move if the observation in question is dropped from the data set. It is a measure that combines the information of leverage and the residual of the observation. 15 observations have values of Cook's D above 4/N = 0.019.
```{r}
kable(a[d > 4/N, ], "html") %>% kable_styling("striped") %>% scroll_box(width = "100%")
```

#### 1.3 High leverage observations

A data point has high leverage if it has extreme predictor x values. This can be detected by examining the leverage statistic, or the hat-values, which are the diagonal elements of the hat-matrix and which describe the leverage each point has on its fitted values. A value of this statistic above 2(p + 1)/n indicates an observation with high leverage (P. Bruce and Bruce 2017); where, p is the number of predictors and n is the number of observations. No observations are identified as having high leverage (.hat > 2(p+1)/n)
```{r}
# Create table of model metrics and identify observations with high leverage
model.metrics <- data.frame(augment(modelAIC))
row.names(model.metrics) <- model.metrics[,1]
model.metrics <- model.metrics[, -c(1:19)]
p <- ncol(dataF4F3)
n <- nrow(dataF4F3)
hlt<- 2 * (p + 1) / n # high-leverage threshold
model.metrics[model.metrics$.hat > hlt,]
```

### 2. Residuals are Normaly Distributed

The distribution of the residuals can be visualized with a histogram. It appears relatively normal.
```{r}
resid.modelAIC <- residuals(modelAIC)
hist(resid.modelAIC)
```
The **Q-Q plot** of residuals can be used to inspect the normality assumption. Some observations fall outside of the reference line.
```{r}
plot(modelAIC, 2)
```

Due to the large sample size, a normality test should be able to provide more information. Neither the *Shaprio-Wilks* nor the *Anderson-Darling* test, which is generally considered better than the Shaprio-Wilks, reject the null hypothesis of normally distributed residuals for the model.

```{r}
shapiro.test(resid.modelAIC)
```
```{r}
ad.test(resid.modelAIC)
```

### 3. Homoscedasticity
This assumption states that the variance of error terms are similar across the values of the independent variables. A **scale-location** plot of standardized residuals versus predicted values can show whether points are equally distributed across all values of the independent variables. The plot shows that the variances of the residuals are not constant (heteroscedasticity). The red line, rather than being horizontal, has a slight inverse U-shaped form, indicating that the variance of the residuals are not constant.
```{r}
plot(modelAIC, 3)
```

#### 3.1 Studentized Breusch-Pagan test for heteroscedasticity.
The Breush-Pagan test and can be used to test for heteroscedasticity. However, these tests are not necessarily better than inspecting the plots, so there is cause for some concern regarding this assumption.
```{r}
bp <- bptest(modelAIC, studentize = TRUE) # looks good
bp
```

### 4. Linear Relationship Between the Dependent Variable (FAA) and the Independent Variables
There should be no pattern in the **residual plot**. Ideally, the red line should be approximately flat and the points scattered completely random. This line looks good and no clear non-linear pattern is visible. Correlations are related to the linearity assumption, see FAA_Correlations.R.
```{r}
plot(modelAIC, 1)
```

### 5. No Multicollinearity
The correlation matrices in FAA_Correlations.r showed low correlations between the independent variables. Variance Inflation Factor (VIF) test shows the same, no collinearity (< 2.5 is very low).

No large correlations (i.e., around 0.7-0.8 or higher)
```{r}
corrplot::corrplot(cor(dataF4F3[,c(1,4,6:7,10,12,19)]), addCoef.col = "black")
```

```{r}
# VARIANCE INFLATION FACTOR (VIF)
car::vif(modelAIC)
```











### Run Robust Regression with Huber Weighting Function
```{r}
summary(rr.huber.F8F7 <- rlm(FAA.F8F7 ~ ., data = dataF8F7))
```

### Check Residuals
```{r}
hweights <- data.frame(subject = dataF8F7$ID, resid = rr.huber.F8F7$resid, weight = rr.huber.F8F7$w)
hweights2 <- hweights[order(rr.huber.F8F7$w), ]
hweights2[1:10, ] # We can see that subjects with large residuals get down-weighted
```


### References:
Belsley, D.A., Kuh. E and Welsch, R.E., Regression Diagnostics: Identifying Influential Data and Sources of Collinearity, Wiley, New York, (1980).
Bruce, Peter, and Andrew Bruce. 2017. Practical Statistics for Data Scientists. O’Reilly Media.
James, Gareth, Daniela Witten, Trevor Hastie, and Robert Tibshirani. 2014. An Introduction to Statistical Learning: With Applications in R. Springer Publishing Company, Incorporated.

### Useful Links:
[Assumptions of Multiple Linear Regression](https://www.statisticssolutions.com/assumptions-of-multiple-linear-regression/)  
[Regression Diagnostics in R](http://www.sthda.com/english/articles/39-regression-model-diagnostics/161-linear-regression-assumptions-and-diagnostics-in-r-essentials/)  
[Heteroskedasticity and Robust Estimators](http://www3.grips.ac.jp/~yamanota/Lecture_Note_9_Heteroskedasticity)  
[The Robust Sandwich Variance Estimator for Linear Regression in R](http://thestatsgeek.com/2014/02/14/the-robust-sandwich-variance-estimator-for-linear-regression-using-r/)  
[Identifying Unusual Observations in R](https://towardsdatascience.com/how-to-detect-unusual-observations-on-your-regression-model-with-r-de0eaa38bc5b)  
[Robust Linear Regression Review](https://doi.org/10.1080/03610918.2016.1202271)  
[Robust Regression in R](https://stats.idre.ucla.edu/r/dae/robust-regression/)  
[Properites of OLS Estimates](https://www.albert.io/blog/ultimate-properties-of-ols-estimators-guide/)  
[Correlations in R](http://www.sthda.com/english/wiki/correlation-test-between-two-variables-in-r)  
[Graphs in Statistical Analysis](http://ww.w.lithoguru.com/scientist/statistics/Anscombe_Graphs%20in%20Statistical%20Analysis_1973.pdf)  
[Importance of the Normality Assumption](https://doi.org/10.1146/annurev.publhealth.23.100901.140546)  
[P-values vs Confidence Intervals](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2689604/)  
[Yeo-Johnson transformation](https://doi.org/10.1093/biomet/87.4.954.)  
