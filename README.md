# Projekt & tid – demoapp med PPS-sida

Detta är en fristående webbapp (HTML/JS/CSS) som kan köras t.ex. via **GitHub Pages**.

Funktioner:

- Tidregistrering per projekt och medarbetare
- Hantering av projekt (inkl. timpris) och medarbetare
- Dashboard med timmar och kostnad, diagram och tabeller
- Ny **PPS-sida** som pedagogiskt beskriver Tietoevry PPS (Praktisk ProjektStyrning):
  - Kortfilm-lik “scen-för-scen”-presentation av projektresan
  - Tydlig illustration av Decision Points (DP1–DP5) i tidslinje
  - Checklista för vad som krävs för projektstart (DP2)

All data lagras lokalt i webbläsarens `localStorage`, ingen server behövs.

## Struktur

- `index.html` – hela SPA-appen med fyra flikar:
  - Tidregistrering
  - Projekt & medarbetare
  - Dashboard
  - PPS
- `styles.css` – all styling, inkl. Helsingborg-inspirerat tema och PPS-illustrationer
- `app.js` – logik, state-hantering, rendering och dashboard-beräkningar

## Så använder du detta i GitHub

1. Skapa eller använd ett befintligt repo.
2. Lägg in:
   - `index.html`
   - `styles.css`
   - `app.js`
3. Aktivera GitHub Pages (Source: t.ex. `main` / `/root`).
4. Öppna sidan via den GitHub Pages-URL som genereras.

## Anpassning till SharePoint / M365 (senare steg)

I en riktig implementation kan:

- `state.projects`, `state.people` och `state.entries` ersättas av SharePoint-listor.
- PPS-sidan ligga som:
  - en egen flik i en SharePoint-sida
  - eller en egen sektion i intranätet
- Dashboarden ersättas eller kompletteras med Power BI-rapporter.

Den här versionen är tänkt som:

- ett **konkret demo-underlag** för chef/ledning
- ett visuellt exempel på hur projekt- och tidsuppföljning + PPS-styrning kan hänga ihop i en och samma lösning.
