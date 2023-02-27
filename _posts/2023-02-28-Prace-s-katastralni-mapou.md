---
layout: post
title: "Práce-s-katastrální-mapou"
categories: misc
---

Práce s katastrální mapou 
V této ukázce si vysvětlíme, jak využívat katastrální mapy k určení druhu pozemku a využití pozemku v programu QGIS. Dále si ukážeme, jak propojit data z více katastrů a ořezat podle zájmového území. 
Návod je pro program QGIS, data naleznete v sekci data.  

Katastrální data obsahují parcelní kresbu ve formě polygonů (ploch) a definiční body. Polygony vymezují hranice parcel v prostoru, definiční body obsahují atributy, jako je druh pozemku, číslo parcely, typ využití pozemku apod.  Pro naše potřeby je potřebujeme propojit. Propojení probíhá ve dvou krocích. 
1.	Nejdřív propojíme parcelní kresbu s definičními body parcel. Propojení propojíme na základě atributu ID_2. 

2.	V druhém kroku propojíme atributovou tabulku s číselníky [druh pozemku CZ], [využití pozemku CZ] . Číselník je uspořádaný seznam entit (nejčastěji ve formě tabulky nebo katalogu), kde je pro konkrétní entitu přidělen jednoznačný kód. Používá se v databázích. 

V případě že chceme propojovat více katastrálních území je potřeba soubory definičních bodů a parcel před propojením sloučit prostřednictvím nástroje Merge. Ke stažení více katastrálních území můžete využít nástroje pro hromadné stahování katastrálních map: [https://services.cuzk.cz/shp/ku/QGIS-plugin/QGIS_verze-3.x/]
Po stažení dat postupujeme ve dvou krocích. 
1.	Pomocí nástroje Merge spojíme všechny soubory katastrální kresby a vytvoříme nový soubor KN_P_merge
2.	Pomocí nástroje Merge spojíme všechny soubory všechny definiční body a vytvoříme nový soubor KN_Def_merge.  
Dále pokračujeme k propojení definičním bodům s parcelní kresbou a spojení s číselníky. Postup je totožný.  

Příprava katastrálních dat Slovensko

Katastrální data pro Slovenskou republiku stáhnete ze stránek [https://ako.vugk.sk/], vybereme katastrální území, zadáme email, a data přijdou na email. Data stáhneme ve formátu gpkg a připojíme přes Open data source a vector. 
Dále stáhneme číselníky z odkazu [druh pozemku SK], [využití pozemku SK] a přidáme jako tabulku s oddělovací (Delimited text). Když se tabulka načte do mapového projektu, otevřeme vlastnosti vrstvy katastrální mapy a pomocí Joins připojíme číselník k tabulce. Pole kód propojíme s NatureOfLanduseCode. Ted máme vrstvu propojenou a můžeme klasifikovat symptologii podle druhu pozemků. 

Data 
Parcelní kresba ČR: [https://services.cuzk.cz/shp/ku/epsg-5514/]
Parcelní kreba SK: [https://ako.vugk.sk/]
Číselníky:  [druh pozemku CZ], [využití pozemku CZ], [druh pozemku SK], [využití pozemku SK]

[https://services.cuzk.cz/shp/ku/epsg-5514/]: https://services.cuzk.cz/shp/ku/epsg-5514/
[https://ako.vugk.sk/]: https://ako.vugk.sk/
[druh pozemku CZ]: https://drive.google.com/file/d/1eGtCg2Q7FsS-N53yGb-T4afyXklpaKdQ/view?usp=share_link
[využití pozemku CZ]: https://drive.google.com/file/d/1W7rBbFG6f4Hyi4LQruPWNo-L9Dh8FmFF/view?usp=sharing
[druh pozemku SK]: https://docs.google.com/spreadsheets/d/1kKBp2r7vEgpWe1M4BubtJPpu5w0U58BkLHtDiBBe2gs/edit?usp=share_link
[využití pozemku SK]: https://docs.google.com/spreadsheets/d/1wVLpwML86pAyYdQ57Fl8E4XGL67PR78XR_ZGo8NTRKw/edit?usp=share_link
[https://services.cuzk.cz/shp/ku/QGIS-plugin/QGIS_verze-3.x/]: [https://services.cuzk.cz/shp/ku/QGIS-plugin/QGIS_verze-3.x/]










