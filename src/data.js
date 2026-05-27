// ============================================================
//  WK 2026 — Loting en formulier-data
// ============================================================
//
//  Pas de TEAMS aan als de definitieve loting bekend is. De
//  rest van het formulier en het Apps Script blijven werken
//  zolang er 12 poules van 4 teams zijn.
//
// ============================================================

export const TEAMS = {
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

export const GROUP_LETTERS = Object.keys(TEAMS);

export const ALL_TEAMS = [...new Set(Object.values(TEAMS).flat())]
  .sort((a, b) => a.localeCompare(b, 'nl'));

export const FINALE_SCORES = ['0-0', '1-0', '0-1', '1-1', '2-1', '1-2', '0-2', '2-0'];

// FIFA round-robin schema voor een poule van 4 teams.
// LET OP: deze volgorde moet hetzelfde zijn in src/data.js én in
// apps-script/Code.gs (functie getGroupMatches). Anders kloppen
// de kolomheaders in je Google Sheet niet.
export function getGroupMatches(letter) {
  const t = TEAMS[letter];
  return [
    { home: t[0], away: t[1] }, // ronde 1
    { home: t[2], away: t[3] },
    { home: t[0], away: t[2] }, // ronde 2
    { home: t[3], away: t[1] },
    { home: t[3], away: t[0] }, // ronde 3
    { home: t[1], away: t[2] }
  ];
}

function emptyMatch() {
  return { team1: '', team1Score: '', team2: '', team2Score: '' };
}

export function getInitialData() {
  const poule = {};
  GROUP_LETTERS.forEach(letter => {
    poule[letter] = {
      matches: getGroupMatches(letter).map(m => ({
        ...m,
        homeScore: '',
        awayScore: ''
      }))
    };
  });
  return {
    naam: '',
    poule,
    zestiende: Array.from({ length: 16 }, emptyMatch),
    achtste: Array.from({ length: 8 }, emptyMatch),
    kwart: Array.from({ length: 4 }, emptyMatch),
    halve: Array.from({ length: 2 }, emptyMatch),
    troost: emptyMatch(),
    finale: emptyMatch(),
    extra: {
      tenueKleur: '',
      eersteGoalMinuut: '',
      meestScorendPoule: '',
      meesteTegenPoule: '',
      landen32: Array(32).fill(''),
      landen16: Array(16).fill(''),
      landen8: Array(8).fill(''),
      landen4: Array(4).fill(''),
      finaleLanden: Array(2).fill(''),
      kampioen: '',
      finaleUitslag: '',
      meesteGoalsLand: ''
    },
    oranje: {
      eersteDoelpunt: '',
      eersteKaart: '',
      eerstGewisseld: '',
      topscoorder: ''
    }
  };
}

export const SECTIONS = ['welkom', 'poule', 'knockout', 'extra', 'oranje', 'verzenden'];
export const SECTION_LABELS = {
  welkom: 'Start',
  poule: 'Poulefase',
  knockout: 'Knock-out',
  extra: 'Extra vragen',
  oranje: 'Oranje',
  verzenden: 'Inzenden'
};
