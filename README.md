# WK 2026 Toto · Caland Lyceum

Online totoformulier voor het WK Voetbal 2026, gehost op GitHub Pages met een Google Sheet als backend.

> **Architectuur:** React-formulier → POST naar Google Apps Script → rij toegevoegd aan Google Sheet. Geen servers, geen abonnementen, helemaal gratis.

---

## 🗺️ Wat ga je doen

Je doorloopt acht stappen. De volgorde is belangrijk: je hebt de Apps Script URL nodig vóór je de code naar GitHub pusht.

| # | Stap | Tijd |
|---|------|------|
| 1 | Google Sheet + Apps Script aanmaken | 5 min |
| 2 | Apps Script publiceren als Web App | 5 min |
| 3 | Node.js installeren | 5 min |
| 4 | Project downloaden + URL invullen | 2 min |
| 5 | Lokaal testen | 3 min |
| 6 | GitHub-repo aanmaken | 3 min |
| 7 | Code naar GitHub pushen | 5 min |
| 8 | GitHub Pages activeren | 2 min |

Totaal: ongeveer een half uur. Helemaal gratis.

---

## Stap 1 — Google Sheet + Apps Script

1. Ga naar [sheets.google.com](https://sheets.google.com) en maak een **lege spreadsheet** aan.
2. Hernoem hem bijv. naar `WK 2026 Toto — Inzendingen`.
3. In de menubalk: **Extensies → Apps Script**. Er opent een nieuw tabblad met een code-editor.
4. Verwijder de standaard `function myFunction() { ... }`.
5. Open in dit project het bestand **`apps-script/Code.gs`** en **kopieer de hele inhoud** in de Apps Script editor.
6. Klik op het **diskette-icoon** (Opslaan) bovenaan.
7. *(Optioneel maar handig)* Klik bovenin op de functie-dropdown, kies `testInzending`, en klik op **Voer uit**. Google vraagt om toestemming — geef die. Je ziet daarna in je Sheet een test-rij verschijnen met alle kolomheaders. Verwijder daarna die test-rij maar de headerregel laat je staan.

---

## Stap 2 — Apps Script publiceren als Web App

1. In de Apps Script editor, rechtsboven: **Implementeren → Nieuwe implementatie**.
2. Klik op het tandwiel naast "Selecteer type" en kies **Web-app**.
3. Vul in:
   - **Beschrijving:** `WK 2026 Toto endpoint`
   - **Uitvoeren als:** *Ikzelf* (jouw Google-account)
   - **Wie heeft toegang:** *Iedereen* ⚠️ (dit moet zo — alleen jouw script kan in jouw Sheet schrijven)
4. Klik op **Implementeren**. Google vraagt opnieuw om toestemming.
5. Kopieer de **Web-app URL** die verschijnt. Hij ziet er ongeveer zo uit:
   ```
   https://script.google.com/macros/s/AKfycby.....BC/exec
   ```
6. Bewaar deze URL — die plak je in Stap 4 in.

> 💡 Als je later de Apps Script-code wijzigt: bij elke wijziging moet je **opnieuw implementeren** (Implementeren → Implementaties beheren → potlood-icoon → versie: nieuw → Implementeren). De URL blijft hetzelfde.

---

## Stap 3 — Node.js installeren

Je hebt Node.js 18 of hoger nodig om de website lokaal te bouwen.

- Open [nodejs.org](https://nodejs.org) en download de **LTS-versie**.
- Installeer hem zoals elk ander programma.
- Test in een terminal:
  ```bash
  node --version
  ```
  Je zou zoiets als `v20.x.x` moeten zien.

> Op Mac met Homebrew: `brew install node`. Op Windows of Linux: gewoon de installer van nodejs.org.

---

## Stap 4 — Project downloaden + URL invullen

1. Pak deze ZIP uit op een plek die je makkelijk terugvindt, bijv. `~/Documents/wk2026-toto`.
2. Open in een teksteditor het bestand **`src/config.js`**.
3. Vervang `PLAK_HIER_JE_APPS_SCRIPT_URL` door de URL uit Stap 2:
   ```js
   export const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby.....BC/exec';
   ```
4. Sla op.

---

## Stap 5 — Lokaal testen

Open een terminal in de projectmap (in VS Code: **Terminal → New Terminal**).

```bash
npm install      # eenmalig: downloadt React, Tailwind, etc.
npm run dev      # start lokale ontwikkelserver
```

Je ziet een regel zoals `Local: http://localhost:5173/`. Open die in je browser.

✅ **Wat te testen:**
- Vul je naam in, klik door tot "Inzenden", druk op **Verstuur**.
- Open je Google Sheet en check of er een nieuwe rij is bijgekomen.
- Als het niet werkt: zie de [Problemen](#-problemen) sectie onderaan.

Stop de server met `Ctrl+C` in de terminal.

---

## Stap 6 — GitHub-repository aanmaken

Heb je nog geen GitHub-account? Maak er een op [github.com](https://github.com) — gratis, alleen e-mail nodig.

1. Klik rechtsboven op het **+** icoon → **New repository**.
2. Naam: `wk2026-toto` (of iets anders — de URL wordt dan daarop gebaseerd).
3. **Public** (vereist voor gratis GitHub Pages).
4. **Niet** "Initialize with README" aanvinken (je hebt er al een).
5. Klik **Create repository**.

GitHub toont je nu instructies. Negeer ze en gebruik de stappen hieronder.

---

## Stap 7 — Code naar GitHub pushen

Heb je git nog niet? Op Mac: `git --version` (installeert hem indien nodig). Op Windows: [git-scm.com](https://git-scm.com).

In je terminal, **in de projectmap**:

```bash
git init
git add .
git commit -m "Eerste versie WK 2026 toto"
git branch -M main
git remote add origin https://github.com/JOUW-USERNAME/wk2026-toto.git
git push -u origin main
```

Vervang `JOUW-USERNAME` door je echte GitHub-gebruikersnaam.

Eerste keer pushen vraagt GitHub om in te loggen. Het makkelijkst: in plaats van een wachtwoord gebruik je een **Personal Access Token** (Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token; geef hem alleen `repo` scope; bewaar de token).

> Alternatief: installeer **GitHub Desktop** ([desktop.github.com](https://desktop.github.com)) — dan kun je dit grafisch doen zonder terminal.

---

## Stap 8 — GitHub Pages activeren

1. Ga op github.com naar je repo.
2. Klik op het tabblad **Settings**.
3. Linkermenu → **Pages**.
4. Onder *Build and deployment*, bij *Source*, kies **GitHub Actions**.
5. Klaar — geen verdere configuratie nodig.

GitHub start nu automatisch de deploy-workflow (zie tabblad **Actions** voor de voortgang). Na 1-2 minuten staat je site live op:

```
https://JOUW-USERNAME.github.io/wk2026-toto/
```

Deel deze link met je collega's. Klaar! 🎉

Vanaf nu: elke keer als je `git push`t, wordt de site automatisch opnieuw gebouwd en gepubliceerd.

---

## 📊 Inzendingen bekijken

Open gewoon je Google Sheet. Elke inzending = één rij. De headers zijn beschrijvend, bijv:
- `Naam`
- `A1 Mexico` (poule A wedstrijd 1, score van Mexico)
- `A1 Zuid-Korea`
- `HF1 team A`, `HF1 score A` (halve finale wedstrijd 1)
- `Kampioen (20p)`
- etc.

### Punten automatisch berekenen

Wil je in dezelfde Sheet ook punten uitrekenen? Maak een tweede tabblad ("Scores") en gebruik formules zoals:

```
=ALS(EN(Inzendingen.C2 = $C$1; Inzendingen.D2 = $D$1); 10; ALS(...))
```

Waarbij rij 1 in de Scores-sheet de **werkelijke** uitslag bevat, en je rij voor rij vergelijkt. Voor 350+ kolommen wordt dat veel werk — handig om eerst alleen de hoogwaardige vragen (kampioen, finale, knock-outs) te scoren.

---

## 🔧 Aanpassen na de loting

Wanneer de definitieve WK-loting bekend is (8 december 2025):

1. **Pas `src/data.js` aan** — vervang de landen in `TEAMS`.
2. **Pas `apps-script/Code.gs` aan** — dezelfde TEAMS-data, zodat de Sheet-headers kloppen.
3. **Pas je Apps Script opnieuw aan** — kopieer de nieuwe Code.gs in de online editor → opslaan → Implementeren → Implementaties beheren → nieuwe versie.
4. **Push de frontend-wijziging:**
   ```bash
   git add . && git commit -m "Loting WK 2026" && git push
   ```
   GitHub Pages werkt automatisch bij.
5. **Verwijder de oude (lege) test-inzendingen uit je Sheet** voordat collega's gaan invullen, anders zitten oude headers met andere landen erin.

---

## 🩹 Problemen

### "Failed to fetch" of "Network error" bij verzenden
- Controleer of je `SCRIPT_URL` in `src/config.js` precies klopt — geen spaties, eindigt op `/exec`.
- Heb je de Apps Script gepubliceerd voor "Iedereen" (niet alleen voor je organisatie)?
- Probeer in een incognito-venster van je browser — sommige browserextensies blokkeren scripts.

### Rij verschijnt niet in de Sheet
- Open de Apps Script editor → links **Uitvoeringen** (klokje). Zie je daar de POST? Klik erop voor de logs.
- Komt de error van `appendRow`? Dan heeft je Google-account waarschijnlijk geen schrijfrechten — dit hoort onmogelijk te zijn omdat het je eigen Sheet is, dus probeer de Web-app opnieuw te implementeren.

### Site toont alleen een witte pagina op GitHub Pages
- Open de Developer Tools (F12) → Console. Zie je een 404 op `/assets/...`? Dan klopt de `base` niet. Check of de naam van je GitHub-repo overeenkomt met wat in de URL staat. De workflow zet de base automatisch, dus dit zou moeten werken — anders even handmatig in `vite.config.js` `base: '/repo-naam/'` zetten.

### `npm install` mislukt
- Welke Node-versie? `node --version` moet 18 of hoger zijn.
- Probeer `rm -rf node_modules package-lock.json && npm install`.

### Toegangsfout op Apps Script bij eerste keer testen
- Google laat scripts alleen schrijven na expliciete toestemming. Bij de eerste run kom je een waarschuwing tegen "Deze app is niet geverifieerd" — klik **Geavanceerd → Ga naar [scriptnaam] (onveilig)**. Dat is normaal voor je eigen scripts.

---

## 🛠️ Mappenoverzicht

```
wk2026-toto/
├── .github/workflows/deploy.yml   ← auto-deploy naar GitHub Pages
├── apps-script/
│   └── Code.gs                    ← backend, plak in Google Apps Script
├── public/                        ← statische bestanden (leeg)
├── src/
│   ├── App.jsx                    ← hoofd-React component
│   ├── config.js                  ← !! HIER plak je je Script URL
│   ├── data.js                    ← teams + initiële formulier-state
│   ├── index.css                  ← Tailwind import
│   └── main.jsx                   ← React entry point
├── index.html
├── package.json
├── vite.config.js
└── README.md                      ← dit bestand
```

---

## 💬 Vragen

Niet alles is hier te dekken. Als je vastloopt: kopieer de exacte foutmelding en stuur hem terug, dan helpen we verder.
