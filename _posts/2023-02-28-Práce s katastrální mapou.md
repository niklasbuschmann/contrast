Práce s katastrální mapou 
V této ukázce si vysvětlíme, jak využívat katastrální mapy k určení druhu pozemku, využití pozemku v programu QGIS. 
Data 
Parcelní kresba: https://services.cuzk.cz/shp/ku/epsg-5514/
Číselníky: číselníky stáhněte jako soubor csv

Katastrální data obsahují parcelní kresbu ve formě polygonů – ploch a definiční body. Polygony vymezují hranice parcel v prostoru, definiční body obsahují atributy, jako je druh pozemku, číslo parcely, typ využití pozemku apod.  Pro naše potřeby je potřebujeme propojit. Propojení probíhá ve dvou krocích. 
1.	Nejdřív propojíme parcelní kresbu s definičními body parcel. Propojení propojíme na základě atributu ID_2. 

2.	V druhém kroku propojíme atributovou tabulku s číselníky. Číselník je uspořádaný seznam entit (nejčastěji ve formě tabulky nebo katalogu), kde je pro konkrétní entitu přidělen jednoznačný kód. Používá se v databázích. 

V případě že chceme propojovat více katastrálních území je potřeba soubory definičních bodů a parcel před propojením sloučit prostřednictvím nástroje Merge. Ke stažení více katastrálních území můžete využít nástroje pro hromadné stahování katastrálních map: https://services.cuzk.cz/shp/ku/QGIS-plugin/QGIS_verze-3.x/
Po stažení dat postupujme ve dvou krocích. 
1.	Pomocí nástroje Merge spojíme všechny soubory katastrální kresby a vytvoříme nový soubor x_merge
2.	Pomocí nástroje Merge spojíme všechny soubory všechny definiční body a vytvoříme nový soubor x_merge.  
Dále pokračujeme k propojení definičním bodům s parcelní kresbou a spojení s číselníky. Postup je totožný.  

Příprava katastrálních dat Slovensko









