---
layout: post
title: Qu'est-ce que la confidentialité ?
---

Cet article fait partie d'une série sur la confidentialité des données, que j'écris dans le désordre. Celui-ci fait office d'introduction et de motivation du problème.

## Motivation : pourquoi garantir la confidentialité ?
En 2007, Netflix lance une compétition internationale, avec un prix d'un million de dollars à qui arrivera à améliorer son algorithme de recommandation. Pour ce faire, les participants doivent entraîner un modèle d'intelligence artificielle sur un jeu de données public d'utilisateurs de Netflix. Le jeu de données contient des films visionnés et notés par 500 000 utilisateurs anonymes (dont le nom a été remplacé par une suite de chiffres), avec pour chaque film, la date à laquelle il a été visionné, et la note de l'utilisateur. 

En 2008, une équipe de chercheurs de l'Université du Texas démontre[^1] que malgré l'anonymat de la base de données, il est possible d'identifier une partie des utilisateurs présents dans la base de données, à partir de connaissances partielles : il suffit par exemple de connaître la date à laquelle une personne a visionné 3 films à deux semaines près, pour retrouver la ligne qui lui correspond dans la base de données Netflix, et ainsi connaître l'intégralité des films que cette personne a vus et aimés. L'équipe va même jusqu'à croiser la base de données Netflix avec le site imdb (internet movie database) pour trouver les noms des personnes en question. S'ensuit un procès, qui entraînera l'annulation de la seconde édition de la compétition.

Il peut sembler que l'ensemble des films que j'ai aimé est une donnée anodine : c'est un tort, car cela révèle, avec une précision surprenante, des détails comme mon âge, mon genre, mon orientation sexuelle, mes idées politiques... Et en prenant un abonnement à Netflix, je n'ai certainement pas envie que tout le monde connaisse ces détails.

Si l'histoire de Netflix n'est qu'un autre clou dans le cercueil du capitalisme de la Silicon Valley, le problème qu'elle illustre affecte autant les multinationales que les pouvoirs publics, ou les associations oeuvrant pour le bien de la société. Par souci de transparence, l'État est encouragé à publier les jeux de données qui guident ses décisions. Cela permet de reproduire les analyses effectuées, et dans certains cas, de permettre l'essor d'initiatives privées utiles à tous (comme par exemple le site [covidtracker](https://covidtracker.fr/) qui a vu le jour pendant la pandémie de covid-19 et permettait à chacun de s'informer sur l'évolution de l'épidémie à l'aide d'indicateurs clairs). Il est donc important pour les acteurs publics, et les personnes qui réalisent des enquêtes statistiques, de garantir l'absence de répercutions pour les individus dont les données seront publiées.

C'est là qu'invervient la notion de **confidentialité**.

## Confidentialité et sécurité
On distingue la *confidentialité* des données de la *sécurité* des données. La sécurité des données (souvent associée au chiffrage et à la cryptographie) permet de s'assurer que seul un utilisateur de confiance peut accéder aux données, pour les lire, les modifier, ou les supprimer. Lorsque, par exemple, on protège une base de données (des photos, des textes, son profil facebook) avec un mot de passe, c'est pour des raisons de sécurité : on veut éviter que quelqu'un d'autre que les utilisateurs de confiance (la famille, les amis, soi-même) ait accès aux données.

La confidentialité des données, c'est la garantie qu'un jeu de données (par exemple, une enquête à laquelle j'ai participé, les données publiques d'un hôpital où j'ai séjourné...) ne permette pas d'obtenir des informations sensibles sur moi. Si un enquêteur ou un hôpital me garantit que mes données restent confidentielles, *je ne risque rien* à participer à l'enquête, ou à séjourner dans cet hôpital. Comme on l'a vu avec l'exemple de Netflix, la confidentialité ne se limite pas à l'anonymat (le fait de gommer toute donnée qui pourrait identifier une personne, comme par exemple son nom).

On peut formuler de manière précise cette notion de confidentialité, et mettre au point des algorithmes qui permettent de "confidentialiser" un jeu de données. Dans les prochains articles, je donnerai d'autres exemples de risques liés à la confidentialité, et je donnerai une définition plus rigoureuse de la notion.

[^1]: (https://arxiv.org/pdf/cs/0610105.pdf)
