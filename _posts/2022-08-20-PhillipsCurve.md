---
title: "Curva de Phillips"
output:
  html_document: default
  pdf_document: default
---

```{r setup, include=FALSE}
knitr::opts_chunk$set(echo = TRUE)
```




### A Curva de Phillips

A Curva de Phillips é uma representação gráfica da relação de curto prazo entre inflação e desemprego. 

De acordo com Phillips (1958), existe uma relação negativa entre a taxa de desemprego e a taxa de inflação. Isso implica que períodos com desemprego elevado tendem a apresentar um nível menor de inflação. 

Phillips encontrou estes resultados para a economia inglesa, entre 1861 e 1957. Samuelson & Solow (1960) também reportam uma correlação negativa entre inflação e desemprego para a economia dos Estados Unidos. Denotaram esta relação de Curva de Phillips, em reconhecimento ao trabalho de Alban William Housego Phillips. 

Em 2001, George Akerlof, no discurso de recebimento do Prêmio Nobel, afirmou que "[P]robably the single most important macroeconomic relationship is the Phillips Curve.”


### Construindo o Banco de Dados

```{r echo = T, message = FALSE, warning = FALSE, paged.print = FALSE}
# Libraries
library(GetBCBData)
library(tidyverse)
```

Em primeiro lugar, é necessário construir o banco de dados. Note que precisamos das séries históricas da taxa de inflação e da taxa de desemprego.
```{r echo = T, message = FALSE, warning = FALSE, paged.print = FALSE}

INF <- gbcbd_get_series(id = c(433), 
                        first.date= '2012-03-01', 
                        last.date = '2022-06-01',  
                        format.data = "long", be.quiet = FALSE)[ ,1:2] %>%
    rename( . , 
            mes = ref.date, 
            inf = value)

DES <- gbcbd_get_series(id = c(24369), 
                        first.date= '2012-03-01', 
                        last.date = '2022-06-01',  
                        format.data = "long", be.quiet = FALSE)[ ,1:2] %>%
    rename( . , 
            mes = ref.date, 
            des = value)


## Banco de Dados
Phillips <- full_join(INF, DES, 
                      by = "mes") %>%
    transform( . , 
               inf = inf/100, 
               des = des/100)
```



