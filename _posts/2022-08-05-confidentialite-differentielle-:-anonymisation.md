---
layout: post
title: Confidentialité et anonymat
mathjax: true
---
Cela fait un moment que j'ai envie d'écrire ce que je sais sur la confidentialité différentielle. Je reprends ici la plupart des explications du chapitre 1 de [The ethical algorithm](https://global.oup.com/academic/product/the-ethical-algorithm-9780190948207?cc=us&lang=en&), de Kearns et Roth.

Dans ce premier article, je décris la motivation pour une définition rigoureuse de la confidentialité, et je donne une première définition (imparfaite) de ce qu'on peut attendre d'un jeu de données anonyme.

## Motivation

Un organisme effectue un grand sondage sur la santé des élèves de lycée. Afin de permettre l'étude des réponses à ce sondage par le plus grand nombre, les données sont publiées sur le site internet de l'organisme. Elles contiennent des informations sensibles, comme par exemple des questions sur la santé mentale des élèves, la prise de drogue, la vie sexuelle et sentimentale... Bien entendu, elles sont anonymisées : pour chaque réponse, seul le nom du lycée, le sexe et la date de naissance de l'élève sont publiées.

Si cette dernière phrase vous fait tiquer, c'est normal ! Le nom du lycée, le sexe, et la date de naissance d'une personne ne permettent pas, prises isolément, de l'identifier. Mais prises ensemble, oui (en tout cas, si le lycée n'est pas trop gros). Muni de ces informations, je peux identifier les réponses apportées au sondage par un élève de mon choix, et apprendre sur sa vie intime des choses qu'il aurait préféré garder secrètes. 

Autrement dit : l'anonymisation ne se résume pas à effacer le nom d'un jeu de données. Il existe plusieurs exemples historiques marquants d'une telle _ré-identification_ de données anonymisées, avec pour certains des répercutions légales importantes. Mais alors, comment garantir la confidentialité de données ?

C'est là que les maths viennent à notre rescousse, en formalisant le concept de confidentialité, afin de pouvoir assurer aux personnes que leur anonymat sera respecté.

## Le $$k$$-anonymat

On dit qu'un jeu de données est $$k$$-anonyme si, toute combinaison de données non-sensibles correspond à au moins $$k$$ observations.

Par exemple, si notre jeu de données contient des informations démographiques comme la date de naissance, le sexe et le code postal, alors, pour qu'il soit $$3$$-anonyme, toute combinaison d'une date de naissance, d'un sexe et d'un code postal doit correspondre à au moins 3 individus différents.
Plus $$k$$ est un nombre élevé, et plus il est difficile d'identifier une personne dans un jeu de données $$k$$-anonyme.

Comment rend-on un jeu de données $$k$$-anonyme ? On peut, par exemple, supprimer toutes les observations (les lignes du tableau) qui représentent des combinaisons uniques de données démographiques (pour chaque date de naissance, sexe et code postal, si on obtient moins de $$k$$ individus correspondant à ces trois critères, on les supprime du jeu de données). Mais on peut aussi changer l'échelle des données : en remplaçant le code postal par le département, la date de naissance par une tranche d'âge, etc.

Le $$k$$-anonymat n'est pas une solution miracle : même si l'on ne parvient pas exactement à identifier la ligne correspondant à l'individu que l'on cherche dans le jeu de données, on pourra toujours localiser un groupe de lignes qui contient ses données.  Imaginons par exemple qu'on souhaite savoir si notre petit camarade Arthur a déjà pris de la drogue, à partir d'un jeu de données $$3$$-anonyme. On connaît la date de naissance d'Arthur, son lycée et son sexe, on récupère donc toutes les lignes du tableau qui correspondent à ces critères :

| Date de naissance | Sexe | Lycée       |  Drogues que l'élève a déjà prises |
|:-----------------:|:----:|:-----------:|:----------------------------------:|
| 28 juin           | M    | Victor Hugo | cannabis                           |
| 28 juin           | M    | Victor Hugo | MDMA                               |
| 28 juin           | M    | Victor Hugo | gaz hilarant, cannabis             |

On ne sait pas exactement laquelle, mais on peut être certain qu'Arthur a déjà pris de la drogue !

Mais le défaut majeur du $$k$$-anonymat et que la notion perd tout intérêt lorsque plusieurs jeux de données sont publiés successivement. Imaginons qu'Arthur ait changé d'établissement l'année suivante, et ait répondu à une autre enquête. Encore une fois, le jeu de données est $$3$$-anonyme.

| Date de naissance | Sexe | Lycée       |  Drogues que l'élève a déjà prises |
|:-----------------:|:----:|:-----------:|:----------------------------------:|
| 28 juin           | M    | George Sand | amphétamines                       |
| 28 juin           | M    | George Sand | aucune                             |
| 28 juin           | M    | George Sand | MDMA                               |

En croisant les informations contenues dans les deux tableaux, nous savons maintenant qu'Arthur a déjà pris du MDMA. 

## Conclusion

La notion de $$k$$-anonymat est alléchante, parce qu'elle est relativement simple à comprendre, et elle semble garantir une certaine confidentialité des données. Mais elle ne garantit pas qu'on ne pourra rien apprendre sur une personne ayant participé à l'enquête. Pire encore : le $$k$$-anonymat n'est pas une garantie autonome, c'est-à-dire que la confidentialité d'un jeu de données peut être affectée par la publication ultérieure d'un autre jeu de données indépendant.

Il est nécessaire d'introduire une garantie plus forte que le $$k$$-anonymat : la confidentialité différentielle.
