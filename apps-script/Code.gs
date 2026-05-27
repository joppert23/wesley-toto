/**
 * ============================================================
 *  WK 2026 TOTO — Google Apps Script Backend
 * ============================================================
 *
 *  Dit script ontvangt inzendingen van het webformulier en
 *  zet ze als rij in je Google Sheet. Bij de eerste inzending
 *  worden automatisch alle kolomheaders aangemaakt.
 *
 *  Gebruik:
 *  1. Maak een nieuwe Google Sheet.
 *  2. Klik in die Sheet op: Extensies > Apps Script.
 *  3. Vervang de standaard Code.gs door deze hele file.
 *  4. Klik rechtsboven op "Implementeren" > "Nieuwe implementatie".
 *  5. Type: Web-app. Uitvoeren als: Ikzelf. Toegang: Iedereen.
 *  6. Kopieer de Web-app URL. Plak die in src/config.js.
 *
 *  Belangrijk: pas TEAMS hieronder aan als de loting wijzigt.
 *  De TEAMS-volgorde MOET overeenkomen met src/data.js,
 *  anders kloppen de kolomheaders niet meer.
 *
 * ============================================================
 */

const SHEET_NAME = 'Inzendingen';

// Zelfde TEAMS-data als src/data.js. Bij wijzigingen: pas BEIDE aan.
const TEAMS = {
  A: ['Mexico', 'Zuid-Korea', 'Tsjechië', 'Zuid-Afrika'],
  B: ['Canada', 'Qatar', 'Zwitserland', 'Bosnië en Herzegovina'],
  C: ['Brazilië', 'Haïti', 'Schotland', 'Marokko'],
  D: ['USA', 'Australië', 'Turkije', 'Paraguay'],
  E: ['Duitsland', 'Ivoorkust', 'Ecuador', 'Curaçao'],
  F: ['Nederland', 'Zweden', 'Tunesië', 'Japan'],
  G: ['België', 'Iran', 'Nieuw-Zeeland', 'Egypte'],
  H: ['Spanje', 'Saoedi-Arabië', 'Uruguay', 'Kaapverdië'],
  I: ['Argentinië', 'Jordanië', 'Oostenrijk', 'Algerije'],
  J: ['Portugal', 'Oezbekistan', 'Colombia', 'DR Congo'],
  K: ['Engeland', 'Ghana', 'Panama', 'Kroatië'],
  L: ['Frankrijk', 'Irak', 'Noorwegen', 'Senegal']
};
const GROUP_LETTERS = Object.keys(TEAMS);

function getGroupMatches(letter) {
  const t = TEAMS[letter];
  return [
    { home: t[0], away: t[1] },
    { home: t[2], away: t[3] },
    { home: t[0], away: t[2] },
    { home: t[3], away: t[1] },
    { home: t[3], away: t[0] },
    { home: t[1], away: t[2] }
  ];
}

/**
 * Wordt aangeroepen wanneer het formulier POST't.
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = getOrCreateSheet();

    // Eerste keer: kolomheaders toevoegen
    if (sheet.getLastRow() === 0) {
      const headers = getHeaders();
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length)
        .setFontWeight('bold')
        .setBackground('#1c1917')
        .setFontColor('#ffffff');
      sheet.setFrozenRows(1);
      sheet.setFrozenColumns(2);
    }

    const row = flattenSubmission(data);
    sheet.appendRow(row);

    return jsonResponse({ success: true, rowCount: sheet.getLastRow() - 1 });
  } catch (err) {
    return jsonResponse({ success: false, error: err.message || String(err) });
  }
}

/**
 * GET geeft alleen een statusbericht — handig om te checken
 * of je Web-app live staat.
 */
function doGet() {
  return ContentService
    .createTextOutput('WK 2026 Toto endpoint actief. Gebruik POST om in te zenden.')
    .setMimeType(ContentService.MimeType.TEXT);
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  return sheet;
}

/**
 * Genereert kolomheaders in dezelfde volgorde als flattenSubmission.
 */
function getHeaders() {
  const headers = ['Tijdstip', 'Naam'];

  // Pouls — 12 poules × 6 wedstrijden × 2 scores = 144 kolommen
  GROUP_LETTERS.forEach(letter => {
    getGroupMatches(letter).forEach((m, i) => {
      headers.push(`${letter}${i + 1} ${m.home}`);
      headers.push(`${letter}${i + 1} ${m.away}`);
    });
  });

  // Knock-out rondes
  const rounds = [
    { key: 'zestiende', count: 16, label: '1/16' },
    { key: 'achtste', count: 8, label: '1/8' },
    { key: 'kwart', count: 4, label: 'KF' },
    { key: 'halve', count: 2, label: 'HF' }
  ];
  rounds.forEach(({ label, count }) => {
    for (let i = 0; i < count; i++) {
      headers.push(`${label}${i + 1} team A`);
      headers.push(`${label}${i + 1} score A`);
      headers.push(`${label}${i + 1} team B`);
      headers.push(`${label}${i + 1} score B`);
    }
  });
  ['troost', 'finale'].forEach(round => {
    headers.push(`${round} team A`);
    headers.push(`${round} score A`);
    headers.push(`${round} team B`);
    headers.push(`${round} score B`);
  });

  // Extra vragen
  headers.push('Kleur scheids (5p)', 'Min. 1e goal (25p)',
    'Meest scorend poule (15p)', 'Meeste tegen poule (15p)');
  for (let i = 0; i < 32; i++) headers.push(`Naar 1/16 #${i + 1}`);
  for (let i = 0; i < 16; i++) headers.push(`Naar 1/8 #${i + 1}`);
  for (let i = 0; i < 8; i++) headers.push(`Naar KF #${i + 1}`);
  for (let i = 0; i < 4; i++) headers.push(`Naar HF #${i + 1}`);
  for (let i = 0; i < 2; i++) headers.push(`Finalist #${i + 1}`);
  headers.push('Kampioen (20p)', 'Uitslag finale (25p)', 'Meeste goals (25p)');

  // Oranje
  headers.push('1e doelpunt NL (15p)', '1e kaart NL (15p)',
    '1e wissel NL (15p)', 'Topscorer NL (15p)');

  return headers;
}

/**
 * Plat de submissie tot een array — zelfde volgorde als getHeaders.
 */
function flattenSubmission(data) {
  const row = [new Date(), data.naam || ''];

  // Pouls
  GROUP_LETTERS.forEach(letter => {
    const matches = (data.poule && data.poule[letter] && data.poule[letter].matches) || [];
    for (let i = 0; i < 6; i++) {
      const m = matches[i] || {};
      row.push(m.homeScore !== undefined ? m.homeScore : '');
      row.push(m.awayScore !== undefined ? m.awayScore : '');
    }
  });

  // Knock-outs
  ['zestiende', 'achtste', 'kwart', 'halve'].forEach(key => {
    const list = data[key] || [];
    const expectedCount = { zestiende: 16, achtste: 8, kwart: 4, halve: 2 }[key];
    for (let i = 0; i < expectedCount; i++) {
      const m = list[i] || {};
      row.push(m.team1 || '', m.team1Score || '', m.team2 || '', m.team2Score || '');
    }
  });
  ['troost', 'finale'].forEach(key => {
    const m = data[key] || {};
    row.push(m.team1 || '', m.team1Score || '', m.team2 || '', m.team2Score || '');
  });

  // Extra
  const extra = data.extra || {};
  row.push(extra.tenueKleur || '', extra.eersteGoalMinuut || '',
    extra.meestScorendPoule || '', extra.meesteTegenPoule || '');
  const padded = (arr, n) => {
    const a = Array.isArray(arr) ? arr : [];
    return Array.from({ length: n }, (_, i) => a[i] || '');
  };
  padded(extra.landen32, 32).forEach(v => row.push(v));
  padded(extra.landen16, 16).forEach(v => row.push(v));
  padded(extra.landen8, 8).forEach(v => row.push(v));
  padded(extra.landen4, 4).forEach(v => row.push(v));
  padded(extra.finaleLanden, 2).forEach(v => row.push(v));
  row.push(extra.kampioen || '', extra.finaleUitslag || '', extra.meesteGoalsLand || '');

  // Oranje
  const oranje = data.oranje || {};
  row.push(
    oranje.eersteDoelpunt || '',
    oranje.eersteKaart || '',
    oranje.eerstGewisseld || '',
    oranje.topscoorder || ''
  );

  return row;
}

/**
 * Handige test-functie. Klik in de Apps Script editor op "Voer uit"
 * met deze functie geselecteerd om te checken of het in jouw Sheet
 * werkt zonder dat je een echte POST hoeft te doen.
 */
function testInzending() {
  const fakeData = {
    naam: 'Test Persoon',
    timestamp: new Date().toISOString(),
    poule: {},
    zestiende: [], achtste: [], kwart: [], halve: [],
    troost: { team1: 'Nederland', team1Score: '2', team2: 'België', team2Score: '1' },
    finale: { team1: 'Brazilië', team1Score: '1', team2: 'Argentinië', team2Score: '2' },
    extra: {
      tenueKleur: 'geel',
      eersteGoalMinuut: '23',
      kampioen: 'Argentinië',
      finaleUitslag: '2-1'
    },
    oranje: { topscoorder: 'Memphis Depay' }
  };
  const res = doPost({ postData: { contents: JSON.stringify(fakeData) } });
  Logger.log(res.getContent());
}
