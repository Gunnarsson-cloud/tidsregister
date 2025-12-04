# Projekt & tid – demoapp med PPS och översikt

Detta är en fristående webbapp (HTML/JS/CSS) som kan köras t.ex. via **GitHub Pages**.

Funktioner:

- Översiktsvy (startsida) med:
  - KPI: antal projekt, antal medarbetare, totalt antal timmar
  - Snabbvy per projekt (timmar + kostnad)
  - Snabbvy per medarbetare (timmar + kostnad)
  - Mjuk intro-animation och räknande siffror (counter-effekt)
- Tidregistrering per projekt och medarbetare
- Hantering av projekt (inkl. timpris) och medarbetare
- Dashboard med:
  - Filter (datum, projekt, medarbetare)
  - KPI: totala timmar, beräknad kostnad, antal tidrader – med counter-animation
  - Diagram (Chart.js) för timmar per projekt och per medarbetare
- PPS-sida som pedagogiskt beskriver Tietoevry PPS (Praktisk ProjektStyrning):
  - Kortfilm-lik presentation (Scen 1–5)
  - Tidslinje för DP1–DP5
  - Checklista för projektstart (DP2)
  - Mjuk intro-animation för hela PPS-blocket

All data lagras lokalt i webbläsarens `localStorage`, ingen server behövs.

## Demodata

Vid första start skapas automatiskt:

- 4 projekt:
  - Översiktsplan 2040
  - Ny cykelväg centrum–Väla
  - Digitalisering bygglovsprocess
  - Grönområdesinventering 2025
- 5 medarbetare:
  - Andreas Gunnarsson (Projektledare)
  - Anna Andersson (Planarkitekt)
  - Erik Nilsson (Trafikplanerare)
  - Maria Lindström (GIS-ingenjör)
  - Johan Persson (Projektcontroller)
- Ett 20-tal tidrader fördelade över projekten de senaste dagarna.

Det gör att dashboard och översikt ser “levande” ut direkt.

## Struktur

- `index.html` – hela SPA-appen med flikar:
  - Översikt
  - Tidregistrering
  - Projekt & medarbetare
  - Dashboard
  - PPS
- `styles.css` – all styling, inkl. Helsingborg-inspirerat tema och animationsklasser
- `app.js` – logik, state-hantering, rendering, dashboard-beräkningar och animationer

## Så använder du detta i GitHub

1. Skapa eller använd ett befintligt repo.
2. Lägg in:
   - `index.html`
   - `styles.css`
   - `app.js`
   - `README.md`
3. Aktivera GitHub Pages (Source: t.ex. `main` / `/root`).
4. Öppna sidan via den GitHub Pages-URL som genereras.

## Anpassning till SharePoint / M365 (senare steg)

I en riktig implementation kan:

- `state.projects`, `state.people` och `state.entries` ersättas av SharePoint-listor.
- PPS-sidan ligga som en egen flik/sektion i intranätet.
- Dashboarden ersättas eller kompletteras med Power BI-rapporter.

Den här versionen är tänkt som:

- ett **konkret demo-underlag** för chef/ledning
- ett visuellt exempel på hur projekt- och tidsuppföljning + PPS-styrning kan hänga ihop i en och samma lösning.
