---
layout: post
title: "Připojení základních map, ortofotomapy a SM5V"
categories: misc
---

## Připojení podkladových map Základních map ČR, ortofotomapy a SM5V 

Otevřete si nový mapový projekt. Nastavíte si souřadnicový systém používaný v České republice 5515 – S-JTSK Krovak EastNorth, kliknutím na tlačítko v pravém dolním rohu např. EPSG:4218. 



Vložte si do projektu podkladovou mapu. Doporučuji službu Základní mapy ČR, kterou poskytuje Český úřad zeměměřičský a katastrální. Adresu služby přidejte přes Open Data Source Manager (zkratka CMD+L nebo Ctrl+L) a vyberte možnost ArcGIS Map Services. Na záložce Server Connection klikněte na New a vložte adresu {% highlight python%} https://ags.cuzk.cz/ArcGIS/rest/services/zm/MapServer {% endhighlight %} do řádku URL. Připojení pojmenujte, v programu zůstane uloženo. Do mapového okna přidáte tlačítkem Connect a tlačítkem Add v spodní části stránky. 

<iframe width="774" height="484" src="https://www.youtube.com/embed/Lusb8W3Gj_M" title="Připojení Základní mapy" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>


Dále si připojte Ortofotomapu a službu SM5V. Adresa služby ortofoto je https://geoportal.cuzk.cz/WMS_ORTOFOTO_PUB/WMService.asp adresa mapové služby SM5V – státní mapa 1:5000 vektorová je https://geoportal.cuzk.cz/WMS_SM5V_PUB/WMService.aspx

Obě služby připojíte opět přes tlačítko Open Data Source Manager. Pozor, nyní vyberete záložku WMS/WMTS. Opět vytvoříte nové připojení kliknutím na tlačítko New a připojení pojmenujete. Do mapového okna přidáte tlačítkem Connect a tlačítkem Add v spodní části stránky. 
