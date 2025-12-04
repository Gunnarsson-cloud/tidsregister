# Projekt & tid – Helsingborg demoapp

Detta är en fristående webbapp (ren HTML/JS/CSS) som kan köras direkt från GitHub Pages eller lokalt.  
Syftet är att visa en komplett lösning för:

- Projektregister
- Medarbetarregister
- Tidregistrering per medarbetare och projekt
- Inbyggd dashboard med grafer (utan Power BI)
- Export av data till CSV (för vidare analys i t.ex. Excel eller Power BI)

All data lagras i browserns **localStorage** – ingen backend eller inloggning krävs.  
Lösningen är tänkt som demo/prototyp och som underlag för att senare:

- Portas till SharePoint-listor
- Användas som datakälla i Power BI

## Funktioner

- Lägg till / redigera / ta bort **projekt**
- Lägg till / redigera / ta bort **medarbetare**
- Registrera **tidrader** (datum, medarbetare, projekt, timmar, aktivitetstyp, kommentar)
- Filtrera och sök i tidrader (per person, per projekt, fritext)
- Dashboard:
  - Timmar per projekt
  - Timmar per medarbetare
  - Timmar per dag (trend)
  - KPI: timmar denna vecka, denna månad, snitt per medarbetare
- Exportera alla tre tabeller som CSV:
  - `projekt.csv`
  - `medarbetare.csv`
  - `tidregistrering.csv`

## Så kör du appen

### Lokalt

1. Ladda ner zip-filen eller klona repot.
2. Öppna `index.html` i valfri webbläsare.
   - Ingen byggprocess, ingen backend – bara statiska filer.

### På GitHub Pages

1. Skapa ett nytt repo på GitHub, t.ex. `hbg-projekt-tid-demo`.
2. Lägg in filerna i repot.
3. Aktivera **GitHub Pages** i repo-inställningarna (branch: `main`, folder: `/root`).
4. Öppna den URL som GitHub ger – klart.

## Arkitektur / datamodell

Se `docs/powerbi-layout.md` för en mer detaljerad beskrivning av:

- Tabeller / listor
- Fält
- Hur detta mappas mot SharePoint-listor
- Förslag på Power BI-rapport.

