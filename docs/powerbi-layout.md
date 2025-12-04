# Datamodell & Power BI-upplägg

Den här appen använder tre logiska tabeller – samma struktur kan användas i SharePoint och Power BI.

## Tabeller

### 1. Projekt

Motsvarar t.ex. SharePoint-listan `Projekt`.

| Fält        | Typ       | Exempel                  |
|-------------|-----------|--------------------------|
| id          | Text (GUID) | `ab12cd`                |
| name        | Text      | `Översiktsplan 2040`     |
| code        | Text      | `P-001`                  |
| status      | Text      | `Pågående`              |
| type        | Text      | `Utredning`              |
| description | Text      | `Översiktsplan för ...` |

### 2. People (Medarbetare)

Motsvarar t.ex. SharePoint-listan `Medarbetare`.

| Fält   | Typ           | Exempel              |
|--------|---------------|----------------------|
| id     | Text (GUID)   | `p12xy3`             |
| name   | Text          | `Anna Andersson`     |
| role   | Text          | `Planarkitekt`       |
| active | Boolean/Ja/Nej | `true` / `false`    |

### 3. TimeEntries (Tidregistrering)

Motsvarar t.ex. SharePoint-listan `Tidregistrering`.

| Fält      | Typ        | Exempel             |
|-----------|------------|---------------------|
| id        | Text (GUID) | `t987ab`           |
| date      | Datum      | `2025-11-24`        |
| personId  | Text (GUID) | pekar på People.id |
| projectId | Text (GUID) | pekar på Project.id|
| hours     | Tal        | `3.0`               |
| activity  | Text       | `Projektering`      |
| comment   | Text       | `Underlag till ...` |

## Relationer i Power BI

I Power BI (eller i datamodellen generellt) definieras relationer:

- `TimeEntries[projectId]` → `Projekt[id]` (Many-to-one, single, referentiell integritet om möjligt)
- `TimeEntries[personId]` → `People[id]` (Many-to-one, single)

Då kan du skapa rapporter med slicers och visuella objekt baserat på personer och projekt.

## Exempel på Power BI-visualiseringar

1. **KPI-kort**
   - Total rapporterad tid (summa av `TimeEntries[hours]`)
   - Timmar senaste 7 dagarna
   - Timmar senaste 30 dagarna
   - Genomsnitt timmar per medarbetare

2. **Stapeldiagram – timmar per projekt**
   - Axis: `Projekt[name]`
   - Values: Sum of `TimeEntries[hours]`
   - Filter: datum (t.ex. senaste månad/kvartal)

3. **Stapeldiagram – timmar per medarbetare**
   - Axis: `People[name]`
   - Values: Sum of `TimeEntries[hours]`
   - Filter: projekt, datum

4. **Linjediagram – timmar över tid**
   - Axis: `TimeEntries[date]`
   - Values: Sum of `hours`
   - Filter: projekt, person

5. **Tabell / matris för uppföljning**
   - Rows: `People[name]`, `Projekt[name]`
   - Columns: t.ex. `Månad`
   - Values: Sum of `hours`

## Vägen från denna app till SharePoint + Power BI

1. **Export från appen**
   - Använd knapparna “Exportera … (CSV)” för alla tre tabeller.
2. **Import till SharePoint**
   - Skapa motsvarande tre listor (Projekt, Medarbetare, Tidregistrering).
   - Importera CSV-filerna (eller använd Quick Edit / kopiera in).
   - Säkerställ att `id`-fälten bibehålls.
3. **Koppla Power BI**
   - Anslut Power BI Desktop till SharePoint-listorna.
   - Skapa relationerna enligt ovan.
   - Bygg rapport/layout enligt exemplen.

Den här demon är alltså både en fungerande, fristående lösning och ett konkret underlag för en mer robust M365-baserad implementation.
