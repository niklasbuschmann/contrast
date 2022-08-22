---
layout: post
title: Les risques liés à la confidentialité
categories:
    - "pop science"
    - "vulgarisation"
    - "french"
tags: 
    - "french"
---

Cet article fait partie d'une série sur la confidentialité des données[^1]. Il fait suite à l'article d'introduction et de motivation du problème [Qu'est-ce que la confidentialité ?]({% post_url 2022-08-17-qu'est-ce-que-la-confidentialité %}). 

Dans l'article précédent, je définissais (de manière très imprécise !) la confidentialité comme la garantie qu'un jeu de données ne permette pas d'obtenir des informations sensibles sur les personnes qui en font partie, et je précisais que si un jeu de données est confidentiel, _je ne cours aucun risque_ à ce que mes données soient dedans.

Mais quels sont ces risques ?

<!--more-->

## Les deux principales manière de violer la confidentialité

### La ré-identification

Le risque le plus évident lié à la confidentialité des données est celui de la _ré-identification_ : un auteur publie un jeu de données anonymisé, et un adversaire malveillant réussi à remettre un nom en face de chaque ligne du tableau. Les informations ne sont plus anonymes, elles deviennent complètement publiques.

### La détermination de l'appartenance au jeu de données

Supposons donc qu'on ait un jeu de données où il est impossible d'identifier les données correspondant à un utilisateur particulier. Par exemple, si notre jeu de données ne contient que des statistiques agrégées (le nombre de personnes dans le jeu de données, leur moyenne d'âge, leur revenu médian, etc) mais pas les données individuelles, il sera impossible de ré-identifier les participants.

En revanche, on peut se retrouver dans un cas où il sera possible de déterminer si une personne est présente dans les données ou non : on détermine son _appartenance_ au jeu de données. Ce type de risque est particulièrement important dans le domaine médical : si on étudie l'effet d'un médicament sur des patients atteints d'une maladie, et que je fais partie de l'étude, c'est que j'ai la maladie en question. Une personne qui découvre mon appartenance au jeu de données aura découvert une partie de mes données médicales.

Là encore, la quantité d'information nécessaire pour déterminer l'appartenance de quelqu'un peut être déroutante : une étude sur des données génétiques publiques a révélé que si l'on connaissait le génome d'un individu, on pouvait déterminer son appartenance à un groupe lors une étude génétique, même si la contribution totale de l'individu à l'étude était inférieure à 0,1% ![^2]


## Garantir la confidentialité de toutes les données

### Les données anodines ne le sont pas

Des données paraissant anodines peuvent contenir des détails sur moi que je n'ai pas envie de révéler. Les films que je regarde ne sont pas a priori secrets : j'en parle à mes amis, à ma famille... mais je ne souhaite pas pour autant exposer l'intégralité de mon historique Netflix au monde entier ; il y a une différence d'échelle (je parle à un collègue de la dernière série que j'ai vue, je ne lui donne pas la liste de tout ce que j'ai visionné sur les 5 dernières années), et de public (mes amis me connaissent, je peux partager avec eux des détails personnels ou intimes). 

D'autres données, anodines également, peuvent devenir plus révélatrices lorsqu'on en observe l'évolution dans le temps. Si j'achète des gâteaux tous les jours à la boulangerie et que je cesse brusquement, cela peut vouloir dire que j'ai déménagé, que je n'ai plus l'argent pour acheter des gâteaux, ou que j'ai développé un diabète.

### Il n'y a pas de confidentialité partielle

Certaines méthodes ne permettent de garantir la confidentialité des données que pour un individu "typique", ou plus généralement, pour "la plupart" des individus présents dans un jeu de données. 

Ce type de garantie ne peut évidemment pas être admise dans une définition rigoureuse de la confidentialité. Tous les utilisateurs doivent être également protégés, et les utilisateurs "atypiques" pourraient justement être ceux pour qui la confidentialité est la plus importante. En outre, l'auteur d'un jeu de données qui garantirait ce type de confidentialité partielle pourrait simplement publier une petite partie des données "en clair" (sans les anonymiser ou les modifier pour qu'elles ne soient pas identifiables) et respecter son contrat.


## Conclusion

Une bonne définition de la confidentialité doit donc garantir que, si j'ai participé à une étude dont les résultats ont été publiés, un tiers ne peut pas déterminer :
 - si j'ai bien participé à l'étude.
 - quelles sont mes données parmi celles qui ont été publiées.

En sus, cette confidentialité doit être garantie pour tous les participants, et pas juste une majorité (aussi importante soit-elle).




[^1]: Cette série utilise énormément les deux ouvrages [The ethical algorithm](https://global.oup.com/academic/product/the-ethical-algorithm-9780190948207?cc=us&lang=en&), par Roth et Kearns, et [The algorithmic foundations of differential privacy](https://www.cis.upenn.edu/~aaroth/Papers/privacybook.pdf), par Dwork et Roth.
[^2]: Voir [Resolving Individuals Contributing Trace Amounts of DNA to Highly Complex Mixtures Using High-Density SNP Genotyping Microarrays](https://journals.plos.org/plosgenetics/article?id=10.1371/journal.pgen.1000167)
