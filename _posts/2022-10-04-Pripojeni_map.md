---
layout: post
title: "Připojení základních map, ortofotomapy a SM5V"
categories: misc
---

### Založení projektu a nastavení souřadnicového systému 

Otevřete si nový mapový projekt. Nastavte si souřadnicový systém používaný v České republice S-JTSK Krovak EastNorth, EPSG:5514. Klikněte na tlačítko v pravém dolním rohu (pravděpodobně tam bude zobrazen EPSG:4218) a v dialogovém okně vyhledejte 5514 a potvrďte.  

### Vložení podkladové mapy

Vložte si do projektu podkladovou mapu. Doporučuji službu Základní mapy ČR, kterou poskytuje Český úřad zeměměřičský a katastrální. Adresu služby přidejte přes Open Data Source Manager (zkratka Ctrl+L, nebo CMD+L na macu) a vyberte možnost ArcGIS Map Services. Na záložce Server Connection klikněte na New a vložte adresu {% highlight python %} [https://ags.cuzk.cz/arcgis1/rest/services/ZTM/MapServer] {% endhighlight %} do řádku URL. Připojení pojmenujte, v programu zůstane uloženo. Do mapového okna přidáte tlačítkem Connect a tlačítkem Add v spodní části stránky. 

<iframe width="774" height="484" src="https://www.youtube.com/embed/Lusb8W3Gj_M" title="Připojení Základní mapy" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

### Připojení ortofotomapy a státní mapy

Dále si připojte Ortofotomapu. Adresa služby ortofoto je {% highlight python %} https://geoportal.cuzk.cz/WMS_ORTOFOTO_PUB/WMService.aspx {% endhighlight %}.

Obě služby připojíte opět přes tlačítko Open Data Source Manager. **Pozor, nyní vyberete záložku WMS/WMTS**. Opět vytvoříte nové připojení kliknutím na tlačítko New a připojení pojmenujete. Do mapového okna přidáte tlačítkem Connect a tlačítkem Add v spodní části stránky. 

### Stažení topografické mapy. 
Stažení topografické mapy do offline režimu řešíme prostřednictvím stránek https://ags.cuzk.cz/geoprohlizec/ . Postup je nasledovný: 
1. Vpravo nahoře klikneme na Přidat vrstvy.
2. Poté kliknemem na tři tečky vedle vrstvy
3. Vybereme exportovat data.
4. Zadáme email, na který budou doručená data. 
5. Vybereme polygon, který ořeže území

<iframe width="560" height="315" src="https://www.youtube.com/embed/F2cqBJ_ttYo?si=VfJQyXxVpIGNUDQt" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

XXXX

