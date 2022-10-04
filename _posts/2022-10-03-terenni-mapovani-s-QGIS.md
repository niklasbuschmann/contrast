---
layout: post
title: "Terénní mapování vegetace pomocí QGIS a INPUT"
categories: misc
---

## Práce s mobilním GIS - principy

Práce s mobilním GIS předpokládá propojení s cloudem. Zjednodušeně řečeno, prostřednictvím cloudu synchronizujete údaje z počítače do mobilu nebo tabletu a obráceně. Pokud chcete zpracovávat data v mobilní aplikaci, je nutné na stolním počítači nebo laptopu připravit GIS projekt. Tento projekt synchronizujete na cloud, odsud do aplikace na mobilu nebo tabletu. V terénu pak mapujete vegetaci a po skončení znovu synchronizujete s cloudem a následně s počítačem. "\n\n\n"

Postup je v bodech následovný: 

1.	Připravím mapový projekt v počítači a uložím ho na cloud.
2.	Aktualizuji svoje projekty v aplikaci.
3.	Upravuji data v aplikaci. 
4.	Synchronizuji zpátky na cloud. 
5.	Z cloudu synchronizuji do počítače. 

Na cvičení vám doporučujme řešení QGIS v kombinaci s cloudem Mergin a Input, nebo řešení ArcGIS Pro v kombinaci s ArcGIS online a mobilní aplikací Field Maps. 

![schema](/assets/img/schema_gis_cloud.jpg)

## Postup pro práci s QGIS 

Program QGIS je plnohodnotým GIS softwarem, který slouží pro výtváření a editaci dat, analýzu i grafické výstupy v podobě map a výkresů. Je k dispozici zdarma i ke komečním účelům. Program si stáhnete zde: [https://www.qgis.org/en/site/]. Program si stáhněte a nainstalujte. K základní orientaci v programu využijte návody na youtube nebo [https://www.qgistutorials.com/en/]. Dále se budeme věnovat instalaci pluginu Mergin, který je nutný pro zprovoznění mobilního GIS. 


## Vytvoření účtu na Mergin maps 

Vytvořte si účet na mergin maps [https://merginmaps.com/]. Pro studentské účely máte k dispozici 100 mb dat zdarma na neomezenou dobu. Pro Váš projekt to bohatě stačí.Více o podmínkách využití serveru Mergin najde zde [https://merginmaps.com/pricing].  

## Instalace pluginu Mergin

Po vytvoření účtu si nainstalujete plugin Mergin do aplikace QGIS dle videa výše. 
Pokud se vám Plugin nezobrazuje, kliknete na záhlaví programu pravým tlačítkem a pod složkou Toolbars jej zobrazte. Přihlaste se pod Vámi registrovaným jménem.

<iframe width="560" height="315" src="https://www.youtube.com/embed/QjykffOtaOQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Přidání ortofotomapy do mapového projektu

1. Do QGISu si připojíte mapovou službu Ortofotomapa. Seznam adres pro připojení najdete [zde].
2. Nastavte souřadnicový systém S-JTSK Krovak Eastnorth. Má označení 5514. 
3. Nabídku souřadnicových systémů vyvoláte kliknutím v pravém dolním rohu. 

<iframe width="560" height="315" src="https://www.youtube.com/embed/HK0w1ESCBXo" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Přidání vrstvy ATV

1. Do projektu si přidáte vrstvu ATV ve formátu shp. Tato vrstva je přednastavená pro účely mapování vegetace.
2. Neobsahuje žádné plochy, pouze přednastavené sloupce a hodnoty.  
3. Stáhnete si ji z tohoto odkazu [vrstva ATV.zip] 
4. Obsah z odkazu výše rozbalte do složky s Vašimi daty. Důležité je, aby byli všechny soubory pohromadě. 

!! Pokud se vrstva ATV nezobrazí v legendě jako čtverec s žlutým rámečkem (styl vrstvy), kliknete 2 na vrstvu, v spodní dialogového okna kliknete na Style -> Load a vyberte soubor ATV.qlr (QGIS Layer Definition .qlr). Barvu vrstvy lze libovolně měnit. Pokud se vrstva nezobrazí jako žlutý čtverec, a vy nenačtete soubor qlr, nebudete mít ve vrstvě přednastavené hodnoty (typ VP, pokryvnost apod).

<iframe width="560" height="315" src="https://www.youtube.com/embed/_0-t3EmKt1U" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>


## Vytvoření offline ortofotomapy

Do terénu si vytvoříte offline verzi ortofotomapy. Pokud je vaše území pokryté mobilnním signalem LTE a máme dostatek dat, můžete tento krok přeskočit.  
1. V QGIS vytvořte nové výkresové rozvržení (Layout) kliknutím na ikonu New print Layout. Pokračujte podle videonávodu.
2. Velikost výkresu nastavíte kliknutím pravým tlačítkem do plochy (např A1).  
3. Mapový výřez přidáte tlačítkem se zobrazenim mapy a zelneným plusem. Potažením po výkresu zvolíte velikost.
4. Nastavte vhodné měřítko (1:4000 – 1:6000) a pomocí tlačítka 	vyexportujte do formátu tif. Rozlišení zadejte 92 dpi. Nezapomeňte zaškrtnout  tlačítko *Generate world file*. 

<iframe width="560" height="315" src="https://www.youtube.com/embed/d5yYzsP4q6Q" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Dokončení mapového projektu a nahrání na cloud

V této části si ukážeme jak vytvořit online a offline ortofotomapu pomocí tzv *Map Themes* v QGIS. Tento krok je důležitý z toho důvodu, aby vám offline ortofotomapa správně fungovala.

1. Přidáte vyexportovanou offline ortofotomapu z předchozího kroku. 
2. Vypnete online ortofotomapu. Najdete manage Map themes -> Add  Theme přidáte tému Offline. 
3. Zapněte online ortofotomapu a vypněte offline a stejným způsobem přidáte tému Online. 
4. Zapněte tému Offline a ubezpečte se že Vám funguje přepínání témat.
5. Kliknete na ikonu na liště Mergin a vytvořte Mergin projekt. Pokud nemáte plugin mergin, postupujte podle návodu výše. 
6. Vyberte Package current project a dál postupujte dle návodu. 
7. Nyní máte projekt připraven pro terénní šetření. 

<iframe width="560" height="315" src="https://www.youtube.com/embed/6tYJjmiAnV8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Stažení projektu do aplikace Mergin Maps

1. Aplikaci stáhnete z Appstoru nebo Google Play. Aplikace je zdarma.

![input-logo](/assets/img/input_img.png) 

2. Poté se přihlašte pod svým účtem do aplikace.

## Vytvoření plochy ATV a vyplnění vlastností v aplikaci Mergin maps

V aplikaci je možné vytvářet plochy a editovat atributy. 
Atributová tabulka a hodnoty v ní jsou dle této tabulky základních ploch [http://user.mendelu.cz/xkucera0/soubory/zaklplocha.doc]. Atributy v tabulce jsou vyplněny podle příkladu zde [http://user.mendelu.cz/xkucera0/soubory/trojradek.htm]
Některá pole umožnují výběr přednastavených hodnot, některá pole je nutno vyplnit ručně.

<iframe width="461" height="819" src="https://www.youtube.com/embed/v__DKvjwt0Q" title="MGIS 1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> 

## Editace  atributů a zobrazení čísla plochy

Editujeme 
1. kliknutím plochu
2. Kliknutím na ikonu tužky
3. Potvrdíme Save

ID je číslo plochy, pokud je vyplněno, zobrazuje se v mapě. 

<iframe width="461" height="819" src="https://www.youtube.com/embed/uTSZl5D4T4Y" title="Editace  atributů a zobrazení čísla plochy" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Přepínání mapového podkladu

V projektu, který máte jako příklad můžete přepnout zobrazení podkladových map. Slouží pro orientaci v terénu. 

1. Klikněte na  … More
2. Vyberete Map themes
3. Vyberete podklad (SM5 ortofoto, nebo offline)

Vrstvy ortofoto a SM5 jsou připojené WMS vrstvy, tudíž se zobrazují pouze, když máte zapnuta mobilní data. 

<iframe width="461" height="819" src="https://www.youtube.com/embed/A1uTk_DjSsA" title="Přepínání mapového podkladu" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Synchronizace projektu a odeslaní na cloud

Data zaznamenaná v terénu dostanete zpátky do počítače synchronizací s cloudem.
 
1. Kliknete na Projects, u vybraného projektu 

2. Kliknete na ikonu Refresh. Data se synchronizuji s cloudem


<iframe width="461" height="819" src="https://www.youtube.com/embed/SmDFdXUXnMg" title="Synchronizace projektu a odeslaní na cloud" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Na počítači proveďte refresh, aby se data z cloudu synchronizovala do Vašeho projektu. 

Důrazně postup vyzkoušet nanečisto, aby jste v případě problémů nepřišli o svá data. 

















[https://www.qgis.org/en/site/]: https://www.qgis.org/en/site/
[https://www.qgistutorials.com/en/]: https://www.qgistutorials.com/en/
[https://merginmaps.com/]: https://merginmaps.com/
[https://merginmaps.com/pricing]: https://merginmaps.com/pricing
[zde]: https://geoportal.cuzk.cz/(S(n1zmjxvdloewdgimntn45xkj))/Default.aspx?mode=TextMeta&side=wms.verejne&text=WMS.verejne.uvod&head_tab=sekce-03-gp&menu=311
[vrstva ATV.zip]:http://user.mendelu.cz/xsedla50/Studijni%20podpory/ATB%20-%20P2/ATV_vrstva.zip
[input-logo]: josedlacek.github.io/assets/img/input_img.png 
[http://user.mendelu.cz/xkucera0/soubory/zaklplocha.doc]: http://user.mendelu.cz/xkucera0/soubory/zaklplocha.doc
[http://user.mendelu.cz/xkucera0/soubory/trojradek.htm]: http://user.mendelu.cz/xkucera0/soubory/trojradek.htm
