---
title: "Curva de Phillips"
mathjax: true
layout: post
categories: media
---




### A Curva de Phillips

A Curva de Phillips é uma representação gráfica da relação de curto prazo entre inflação e desemprego. 

De acordo com Phillips (1958), existe uma relação negativa entre a taxa de desemprego e a taxa de inflação. Isso implica que períodos com desemprego elevado tendem a apresentar um nível menor de inflação. 

Phillips encontrou estes resultados para a economia inglesa, entre 1861 e 1957. Samuelson & Solow (1960) também reportam uma correlação negativa entre inflação e desemprego para a economia dos Estados Unidos. Denotaram esta relação de Curva de Phillips, em reconhecimento ao trabalho de Alban William Housego Phillips. 

Em 2001, George Akerlof, no discurso de recebimento do Prêmio Nobel, afirmou que "[P]robably the single most important macroeconomic relationship is the Phillips Curve.”


### Construindo o Banco de Dados

Utilize os seguintes pacotes:
```r 
# Libraries
library(GetBCBData)
library(tidyverse)
```

Para estimar a Curva de Phillips, precisamos das séries históricas da taxa de inflação e da taxa de desemprego. O seguinte código importa e edita estas séries
```r
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
```
Em seguida, organize o banco de dados
```r
Phillips <- full_join(INF, DES, 
                      by = "mes") %>%
    transform( . , 
               inf = inf/100, 
               des = des/100)
```

É sempre interessante observar os dados diretamente
```r 
head(Phillips)
tail(Phillips)
```





### Visualização Gráfica

Uma ferramenta importante na análise de dados (e em economia, particularmente) é a visualização gráfica. O gráfico de uma série histórica, por exemplo, pode oferecer bons insights para análise econômica.

Portanto, é sempre conveniente (e recomendado) que se apresente ilustrações gráficas adequadas.
```r 
ggplot(data = Phillips, 
       aes(x = mes, y = inf)) +
    geom_line( color = "deepskyblue4", size = 1 ) +
    theme_classic() +
    scale_y_continuous(breaks = seq(-0.0040, 0.0170, by = .003), limits = c(-0.004, 0.0170)) +
    xlab("Período") + ylab("Taxa de Inflação") +
    theme(axis.title.x = element_text(colour = "grey20"),
          axis.title.y = element_text(colour = "grey20")) +
    theme( text = element_text( size = 15), 
           axis.title.x = element_text(margin = margin(t = 2, r = 2, b = 2, l = 5))) +
    theme(legend.position = "none", legend.title = element_blank())

ggplot(data = Phillips, 
       aes(x = mes, y = des)) +
    geom_line( color = "darkred", size = 1 ) +
    theme_classic() +
    scale_y_continuous(breaks = seq(0.06, 0.15, by = 0.02), limits = c(0.06, 0.15)) +
    xlab("Período") + ylab("Taxa de Desemprego") +
    theme(axis.title.x = element_text(colour = "grey20"),
          axis.title.y = element_text(colour = "grey20")) +
    theme( text = element_text( size = 15), 
           axis.title.x = element_text(margin = margin(t = 2, r = 2, b = 2, l = 5))) +
    theme(legend.position = "none", legend.title = element_blank())

```

