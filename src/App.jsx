import { useState, useEffect, useMemo, useRef } from 'react';
import {
  Trophy, Send, ChevronRight, ChevronLeft, Check,
  RefreshCw, Save, AlertCircle
} from 'lucide-react';
import {
  TEAMS,
  GROUP_LETTERS,
  ALL_TEAMS,
  FINALE_SCORES,
  getInitialData,
  SECTIONS,
  SECTION_LABELS
} from './data.js';
import { SCRIPT_URL, SCHOOL_NAAM } from './config.js';

const DRAFT_KEY = 'wk2026-toto-draft';

/* =============================================================
   KLEINE UI BOUWSTENEN
   ============================================================= */

function LandSelect({ value, onChange, className = '' }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`px-2 py-2 border-2 border-stone-300 rounded bg-white text-sm focus:outline-none focus:border-orange-500 transition ${className}`}
    >
      <option value="">— kies land —</option>
      {ALL_TEAMS.map(t => <option key={t} value={t}>{t}</option>)}
    </select>
  );
}

function ScoreInput({ value, onChange }) {
  return (
    <input
      type="number"
      min="0"
      max="20"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-12 h-10 text-center font-bold text-lg border-2 border-stone-300 rounded bg-white focus:outline-none focus:border-orange-500 transition"
    />
  );
}

function Points({ children }) {
  return (
    <span className="ml-2 inline-block text-[11px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded font-bold align-middle">
      {children}
    </span>
  );
}

const antonStyle = { fontFamily: "'Anton', sans-serif" };

/* =============================================================
   SECTIES
   ============================================================= */

function WelkomSection({ data, setData, onNext, onReset, hasDraft }) {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-orange-500 via-red-500 to-red-600 text-white p-8 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="absolute -right-8 -top-8 opacity-10">
          <Trophy size={200} />
        </div>
        <div className="relative">
          <div className="text-sm uppercase tracking-widest opacity-90">{SCHOOL_NAAM}</div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight mt-1 leading-none" style={antonStyle}>
            WK VOETBAL 2026
          </h1>
          <p className="text-lg mt-3 opacity-95">11 juni t/m 19 juli — USA · Canada · México</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white border-2 border-stone-200 rounded-xl p-6">
          <h3 className="font-black text-xl mb-3" style={antonStyle}>💰 Inzet & Prijzen</h3>
          <ul className="space-y-1.5 text-stone-700 text-sm">
            <li><strong>Inzet:</strong> €5</li>
            <li><strong>1<sup>e</sup> plaats:</strong> 10× inzet (€50)</li>
            <li><strong>2<sup>e</sup> plaats:</strong> 5× inzet (€25)</li>
            <li><strong>3<sup>e</sup> plaats:</strong> 3× inzet (€15)</li>
            <li className="text-xs text-stone-500 italic pt-2">De prijs is afhankelijk van het aantal deelnemers.</li>
          </ul>
        </div>
        <div className="bg-white border-2 border-stone-200 rounded-xl p-6">
          <h3 className="font-black text-xl mb-3" style={antonStyle}>🎯 Punten</h3>
          <ul className="space-y-1.5 text-stone-700 text-sm">
            <li><strong>Toto goed</strong> (winnaar voorspeld) = <strong>5 punten</strong></li>
            <li><strong>Uitslag goed</strong> (precieze score na 90 min) = <strong>10 punten</strong></li>
            <li className="text-xs text-stone-500 italic pt-2">In de Extra Vragen zijn extra punten te halen.</li>
          </ul>
        </div>
      </div>

      <div className="bg-white border-2 border-stone-200 rounded-xl p-6">
        <label className="block text-lg font-bold mb-2">Wat is je naam?</label>
        <input
          type="text"
          value={data.naam}
          onChange={(e) => setData({ ...data, naam: e.target.value })}
          placeholder="Vul je naam in..."
          className="w-full px-4 py-3 text-lg border-2 border-stone-300 rounded-lg focus:outline-none focus:border-orange-500 transition"
        />
        {hasDraft && (
          <div className="mt-4 flex items-center justify-between bg-amber-50 border border-amber-200 rounded p-3 text-sm">
            <span className="text-amber-800">✓ We hebben je vorige antwoorden geladen. Ga gewoon verder waar je was.</span>
            <button onClick={onReset} className="text-amber-700 underline hover:text-amber-900 ml-2 whitespace-nowrap">
              Opnieuw beginnen
            </button>
          </div>
        )}
      </div>

      <button
        onClick={onNext}
        disabled={!data.naam.trim()}
        className="w-full md:w-auto px-8 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-stone-300 disabled:cursor-not-allowed text-white font-bold rounded-lg transition flex items-center justify-center gap-2"
      >
        Begin met invullen <ChevronRight size={18} />
      </button>
    </div>
  );
}

function PouleSection({ data, setData }) {
  const updateMatch = (letter, idx, field, value) => {
    const newPoule = { ...data.poule };
    newPoule[letter] = {
      ...newPoule[letter],
      matches: newPoule[letter].matches.map((m, i) => i === idx ? { ...m, [field]: value } : m)
    };
    setData({ ...data, poule: newPoule });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-4xl font-black" style={antonStyle}>POULEFASE</h2>
        <p className="text-stone-600 mt-1">Voorspel de uitslagen van alle 72 poulewedstrijden.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {GROUP_LETTERS.map(letter => (
          <div key={letter} className="bg-white border-2 border-stone-200 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3 pb-2 border-b-2 border-stone-100">
              <div className="w-10 h-10 bg-orange-500 text-white font-black text-xl rounded-lg flex items-center justify-center" style={antonStyle}>
                {letter}
              </div>
              <h3 className="font-bold text-lg">Poule {letter}</h3>
            </div>
            <div className="space-y-2">
              {data.poule[letter].matches.map((match, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="flex-1 text-right font-medium text-sm">{match.home}</span>
                  <ScoreInput value={match.homeScore} onChange={v => updateMatch(letter, idx, 'homeScore', v)} />
                  <span className="font-bold text-stone-400">–</span>
                  <ScoreInput value={match.awayScore} onChange={v => updateMatch(letter, idx, 'awayScore', v)} />
                  <span className="flex-1 font-medium text-sm">{match.away}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function KnockoutSection({ data, setData }) {
  const updateMatchInList = (key, idx, newMatch) => {
    setData({ ...data, [key]: data[key].map((m, i) => i === idx ? newMatch : m) });
  };
  const updateSingleMatch = (key, newMatch) => {
    setData({ ...data, [key]: newMatch });
  };

  const renderRound = (title, key, dateInfo) => (
    <div className="bg-white border-2 border-stone-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3 pb-2 border-b-2 border-stone-100">
        <h3 className="text-xl font-black" style={antonStyle}>{title.toUpperCase()}</h3>
        <span className="text-xs text-stone-500 font-mono">{dateInfo}</span>
      </div>
      <div className="space-y-2">
        {data[key].map((match, idx) => (
          <div key={idx} className="grid grid-cols-[24px_1fr_auto_auto_auto_1fr] items-center gap-2 py-1">
            <span className="text-xs font-bold text-stone-400 text-right">{idx + 1}.</span>
            <LandSelect value={match.team1} onChange={v => updateMatchInList(key, idx, { ...match, team1: v })} />
            <ScoreInput value={match.team1Score} onChange={v => updateMatchInList(key, idx, { ...match, team1Score: v })} />
            <span className="font-bold text-stone-400 text-center">–</span>
            <ScoreInput value={match.team2Score} onChange={v => updateMatchInList(key, idx, { ...match, team2Score: v })} />
            <LandSelect value={match.team2} onChange={v => updateMatchInList(key, idx, { ...match, team2: v })} />
          </div>
        ))}
      </div>
    </div>
  );

  const renderSingle = (title, key, dateInfo, color = 'border-stone-200') => {
    const match = data[key];
    return (
      <div className={`bg-white border-2 ${color} rounded-xl p-4`}>
        <div className="flex items-center justify-between mb-3 pb-2 border-b-2 border-stone-100">
          <h3 className="text-xl font-black" style={antonStyle}>{title.toUpperCase()}</h3>
          <span className="text-xs text-stone-500 font-mono">{dateInfo}</span>
        </div>
        <div className="grid grid-cols-[1fr_auto_auto_auto_1fr] items-center gap-2">
          <LandSelect value={match.team1} onChange={v => updateSingleMatch(key, { ...match, team1: v })} />
          <ScoreInput value={match.team1Score} onChange={v => updateSingleMatch(key, { ...match, team1Score: v })} />
          <span className="font-bold text-stone-400 text-center">–</span>
          <ScoreInput value={match.team2Score} onChange={v => updateSingleMatch(key, { ...match, team2Score: v })} />
          <LandSelect value={match.team2} onChange={v => updateSingleMatch(key, { ...match, team2: v })} />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-4xl font-black" style={antonStyle}>KNOCK-OUT</h2>
        <p className="text-stone-600 mt-1">Voorspel de teams én de uitslagen voor elke ronde.</p>
      </div>
      {renderRound('Zestiende finales', 'zestiende', '28 juni – 4 juli')}
      {renderRound('Achtste finales', 'achtste', '5 – 7 juli')}
      {renderRound('Kwartfinales', 'kwart', '9 – 11 juli')}
      {renderRound('Halve finales', 'halve', '14 – 15 juli')}
      {renderSingle('Troostfinale', 'troost', '18 juli')}
      {renderSingle('Finale', 'finale', '19 juli', 'border-orange-400')}
    </div>
  );
}

function ExtraSection({ data, setData }) {
  const updateExtra = (field, value) => {
    setData({ ...data, extra: { ...data.extra, [field]: value } });
  };
  const updateArray = (field, idx, value) => {
    const arr = [...data.extra[field]];
    arr[idx] = value;
    updateExtra(field, arr);
  };

  const CountryGrid = ({ label, field, points, cols2 = false }) => (
    <div className="bg-white border-2 border-stone-200 rounded-xl p-4">
      <div className="flex items-baseline justify-between mb-3 gap-2">
        <h3 className="font-bold">{label}</h3>
        <Points>{points}</Points>
      </div>
      <div className={`grid grid-cols-2 gap-2 ${cols2 ? 'md:grid-cols-2 max-w-md' : 'md:grid-cols-4'}`}>
        {data.extra[field].map((val, idx) => (
          <LandSelect key={idx} value={val} onChange={v => updateArray(field, idx, v)} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-4xl font-black" style={antonStyle}>EXTRA VRAGEN</h2>
        <p className="text-stone-600 mt-1">Hier zijn nog veel extra punten te halen.</p>
      </div>

      <div className="bg-white border-2 border-stone-200 rounded-xl p-4 space-y-4">
        <div>
          <label className="block font-medium mb-1">
            Welke kleur tenue draagt de scheidsrechter de eerste wedstrijd? <Points>5 pt</Points>
          </label>
          <input
            type="text"
            value={data.extra.tenueKleur}
            onChange={e => updateExtra('tenueKleur', e.target.value)}
            placeholder="bv. geel"
            className="w-full px-3 py-2 border-2 border-stone-300 rounded focus:outline-none focus:border-orange-500"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">
            In welke minuut wordt de eerste goal gescoord? <span className="text-xs text-stone-500">(verlenging = 45<sup>ste</sup> of 90<sup>ste</sup> min)</span> <Points>25 pt</Points>
          </label>
          <input
            type="text"
            value={data.extra.eersteGoalMinuut}
            onChange={e => updateExtra('eersteGoalMinuut', e.target.value)}
            placeholder="bv. 23"
            className="w-full px-3 py-2 border-2 border-stone-300 rounded focus:outline-none focus:border-orange-500"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">
            Welk land scoort het meest in de poulefase? <Points>15 pt</Points>
          </label>
          <LandSelect value={data.extra.meestScorendPoule} onChange={v => updateExtra('meestScorendPoule', v)} className="w-full" />
        </div>
        <div>
          <label className="block font-medium mb-1">
            Welk land krijgt de meeste goals tegen in de poulefase? <Points>15 pt</Points>
          </label>
          <LandSelect value={data.extra.meesteTegenPoule} onChange={v => updateExtra('meesteTegenPoule', v)} className="w-full" />
        </div>
      </div>

      <CountryGrid label="Welke 32 landen gaan naar de achtste finales? (1 pt per land)" field="landen32" points="32 pt" />
      <CountryGrid label="Welke 16 landen gaan door naar de kwartfinales? (2 pt per land)" field="landen16" points="32 pt" />
      <CountryGrid label="Welke 8 landen naar de halve finales? (4 pt per land)" field="landen8" points="32 pt" />
      <CountryGrid label="Welke 4 landen naar de halve finales? (8 pt per land)" field="landen4" points="32 pt" />
      <CountryGrid label="Wat is de finale? (20 pt per land)" field="finaleLanden" points="40 pt" cols2 />

      <div className="bg-white border-2 border-stone-200 rounded-xl p-4 space-y-4">
        <div>
          <label className="block font-medium mb-1">Wie wordt kampioen? <Points>20 pt</Points></label>
          <LandSelect value={data.extra.kampioen} onChange={v => updateExtra('kampioen', v)} className="w-full" />
        </div>
        <div>
          <label className="block font-medium mb-1">
            Wat wordt de uitslag van de finale? <span className="text-xs text-stone-500">(let op of 2-1 of 1-2)</span> <Points>25 pt</Points>
          </label>
          <select
            value={data.extra.finaleUitslag}
            onChange={e => updateExtra('finaleUitslag', e.target.value)}
            className="w-full px-3 py-2 border-2 border-stone-300 rounded focus:outline-none focus:border-orange-500 bg-white"
          >
            <option value="">— kies uitslag —</option>
            {FINALE_SCORES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block font-medium mb-1">Welk land scoort de meeste goals? <Points>25 pt</Points></label>
          <LandSelect value={data.extra.meesteGoalsLand} onChange={v => updateExtra('meesteGoalsLand', v)} className="w-full" />
        </div>
      </div>
    </div>
  );
}

function OranjeSection({ data, setData }) {
  const update = (field, value) => setData({ ...data, oranje: { ...data.oranje, [field]: value } });
  const Q = ({ label, field }) => (
    <div>
      <label className="block font-medium mb-1">{label} <Points>15 pt</Points></label>
      <input
        type="text"
        value={data.oranje[field]}
        onChange={e => update(field, e.target.value)}
        placeholder="Naam speler..."
        className="w-full px-3 py-2 border-2 border-stone-300 rounded focus:outline-none focus:border-orange-500"
      />
    </div>
  );
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-2xl">
        <h2 className="text-4xl font-black" style={antonStyle}>🇳🇱 NEDERLANDS ELFTAL</h2>
        <p className="opacity-95 mt-1">Voorspel hoe Oranje het gaat doen.</p>
      </div>
      <div className="bg-white border-2 border-stone-200 rounded-xl p-6 space-y-4">
        <Q label="Wie scoort het eerste doelpunt voor Nederland?" field="eersteDoelpunt" />
        <Q label="Wie krijgt, van het Nederlands team, de eerste kaart?" field="eersteKaart" />
        <Q label="Wie wordt als eerste van het Nederlands team gewisseld?" field="eerstGewisseld" />
        <Q label="Wie wordt de topscorer van het Nederlands team?" field="topscoorder" />
      </div>
    </div>
  );
}

function VerzendenSection({ data, onSubmit, submitted, submitting, submitError }) {
  const stats = useMemo(() => {
    let filled = 0;
    let total = 0;
    Object.values(data.poule).forEach(g => {
      g.matches.forEach(m => {
        total += 2;
        if (m.homeScore !== '') filled++;
        if (m.awayScore !== '') filled++;
      });
    });
    [...data.zestiende, ...data.achtste, ...data.kwart, ...data.halve, data.troost, data.finale].forEach(m => {
      total += 4;
      if (m.team1) filled++;
      if (m.team1Score !== '') filled++;
      if (m.team2) filled++;
      if (m.team2Score !== '') filled++;
    });
    ['tenueKleur', 'eersteGoalMinuut', 'meestScorendPoule', 'meesteTegenPoule', 'kampioen', 'finaleUitslag', 'meesteGoalsLand'].forEach(f => {
      total++;
      if (data.extra[f]) filled++;
    });
    ['landen32', 'landen16', 'landen8', 'landen4', 'finaleLanden'].forEach(arr => {
      data.extra[arr].forEach(v => {
        total++;
        if (v) filled++;
      });
    });
    Object.values(data.oranje).forEach(v => {
      total++;
      if (v) filled++;
    });
    return { filled, total, percent: Math.round((filled / total) * 100) };
  }, [data]);

  if (submitted) {
    return (
      <div className="space-y-6">
        <div className="bg-green-50 border-2 border-green-500 rounded-2xl p-10 text-center">
          <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">
            <Check size={40} />
          </div>
          <h2 className="text-4xl font-black text-green-700" style={antonStyle}>
            BEDANKT {data.naam.toUpperCase()}!
          </h2>
          <p className="text-green-700 mt-3 text-lg">Je voorspelling is opgeslagen. Veel succes! 🏆</p>
          <p className="text-green-600 text-sm mt-2">Vergeet niet €5 over te maken aan de organisator.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-4xl font-black" style={antonStyle}>INZENDEN</h2>
        <p className="text-stone-600 mt-1">Controleer je voorspelling en verstuur.</p>
      </div>

      <div className="bg-white border-2 border-stone-200 rounded-xl p-6">
        <div className="flex items-baseline justify-between mb-2">
          <span className="font-bold">Voortgang</span>
          <span className="font-mono text-stone-600">{stats.filled} / {stats.total} velden ({stats.percent}%)</span>
        </div>
        <div className="w-full h-4 bg-stone-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all"
            style={{ width: `${stats.percent}%` }}
          ></div>
        </div>
        <p className="text-xs text-stone-500 mt-2 italic">Lege velden zijn toegestaan — je mist er wel punten mee.</p>
      </div>

      <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg">
        <p className="font-bold text-stone-800">
          Naam: {data.naam || <span className="text-red-500">⚠ niet ingevuld</span>}
        </p>
        <p className="text-sm text-stone-600 mt-1">Kampioen volgens jou: <strong>{data.extra.kampioen || '—'}</strong></p>
        <p className="text-sm text-stone-600">Uitslag finale: <strong>{data.extra.finaleUitslag || '—'}</strong></p>
      </div>

      {submitError && (
        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 flex gap-3">
          <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
          <div className="text-sm">
            <p className="font-bold text-red-700">Versturen mislukt</p>
            <p className="text-red-600">{submitError}</p>
            <p className="text-red-600 mt-1 text-xs">Je antwoorden zijn bewaard. Probeer het zo nog eens.</p>
          </div>
        </div>
      )}

      <button
        onClick={onSubmit}
        disabled={!data.naam.trim() || submitting}
        className="w-full px-6 py-4 bg-orange-500 hover:bg-orange-600 disabled:bg-stone-300 disabled:cursor-not-allowed text-white font-bold rounded-xl transition flex items-center justify-center gap-2 text-lg shadow-lg"
      >
        {submitting
          ? <><RefreshCw className="animate-spin" size={20} /> Bezig met versturen...</>
          : <><Send size={20} /> Verstuur mijn voorspelling</>}
      </button>
    </div>
  );
}

/* =============================================================
   HOOFD-APP
   ============================================================= */

export default function App() {
  const [section, setSection] = useState('welkom');
  const [data, setData] = useState(getInitialData());
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [hasDraft, setHasDraft] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const saveTimeoutRef = useRef(null);

  // Concept ophalen bij start (uit localStorage)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object' && parsed.naam) {
          setData(parsed);
          setHasDraft(true);
        }
      }
    } catch (e) {
      // geen concept of corrupt — prima
    }
    setLoaded(true);
  }, []);

  // Concept automatisch opslaan (debounced)
  useEffect(() => {
    if (!loaded || submitted) return;
    if (!data.naam) return;
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
      } catch (e) {
        // localStorage vol of geblokkeerd — niet kritiek
      }
    }, 800);
    return () => { if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current); };
  }, [data, loaded, submitted]);

  const handleSubmit = async () => {
    if (!data.naam.trim()) return;
    if (!SCRIPT_URL || SCRIPT_URL.includes('PLAK_HIER')) {
      setSubmitError(
        'De Apps Script URL is nog niet ingesteld. Open src/config.js en plak je eigen URL.'
      );
      return;
    }
    setSubmitting(true);
    setSubmitError('');
    try {
      const payload = {
        ...data,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      };
      // Belangrijk: text/plain content-type voorkomt CORS preflight,
      // wat nodig is voor Google Apps Script Web Apps. Apps Script
      // ontvangt de body alsnog netjes via e.postData.contents.
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
        redirect: 'follow'
      });
      if (!response.ok) {
        throw new Error(`Server gaf status ${response.status}`);
      }
      const result = await response.json().catch(() => ({ success: true }));
      if (result && result.success === false) {
        throw new Error(result.error || 'Onbekende fout op de server');
      }
      // Concept opruimen, succes tonen
      try { localStorage.removeItem(DRAFT_KEY); } catch (e) {}
      setSubmitted(true);
    } catch (e) {
      setSubmitError(e.message || String(e));
    }
    setSubmitting(false);
  };

  const handleReset = () => {
    if (!confirm('Weet je zeker dat je alles wilt wissen en opnieuw begint?')) return;
    try { localStorage.removeItem(DRAFT_KEY); } catch (e) {}
    setData(getInitialData());
    setHasDraft(false);
    setSection('welkom');
  };

  const goToNext = () => {
    const idx = SECTIONS.indexOf(section);
    if (idx < SECTIONS.length - 1) {
      setSection(SECTIONS[idx + 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  const goToPrev = () => {
    const idx = SECTIONS.indexOf(section);
    if (idx > 0) {
      setSection(SECTIONS[idx - 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <header className="bg-stone-900 text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="text-orange-400" size={28} />
            <div className="leading-tight">
              <div className="font-black text-xl" style={antonStyle}>WK 2026 TOTO</div>
              <div className="text-xs text-stone-400">{SCHOOL_NAAM}</div>
            </div>
          </div>
        </div>

        {!submitted && (
          <nav className="border-t border-stone-800">
            <div className="max-w-6xl mx-auto px-4 overflow-x-auto">
              <div className="flex gap-1">
                {SECTIONS.map((s, idx) => (
                  <button
                    key={s}
                    onClick={() => (data.naam.trim() || s === 'welkom') ? setSection(s) : null}
                    disabled={!data.naam.trim() && s !== 'welkom'}
                    className={`px-4 py-3 text-sm font-bold whitespace-nowrap transition border-b-2 ${
                      section === s
                        ? 'border-orange-500 text-white'
                        : 'border-transparent text-stone-400 hover:text-white'
                    } disabled:opacity-30 disabled:cursor-not-allowed`}
                  >
                    {idx + 1}. {SECTION_LABELS[s]}
                  </button>
                ))}
              </div>
            </div>
          </nav>
        )}
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {section === 'welkom' && <WelkomSection data={data} setData={setData} onNext={goToNext} onReset={handleReset} hasDraft={hasDraft} />}
        {section === 'poule' && <PouleSection data={data} setData={setData} />}
        {section === 'knockout' && <KnockoutSection data={data} setData={setData} />}
        {section === 'extra' && <ExtraSection data={data} setData={setData} />}
        {section === 'oranje' && <OranjeSection data={data} setData={setData} />}
        {section === 'verzenden' && <VerzendenSection data={data} onSubmit={handleSubmit} submitted={submitted} submitting={submitting} submitError={submitError} />}

        {!submitted && section !== 'welkom' && (
          <div className="flex justify-between mt-8 pt-6 border-t border-stone-200">
            <button
              onClick={goToPrev}
              className="px-5 py-2.5 bg-white hover:bg-stone-100 border-2 border-stone-200 rounded-lg font-bold flex items-center gap-2 transition"
            >
              <ChevronLeft size={18} /> Vorige
            </button>
            {section !== 'verzenden' ? (
              <button
                onClick={goToNext}
                className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold flex items-center gap-2 transition"
              >
                Volgende <ChevronRight size={18} />
              </button>
            ) : <div />}
          </div>
        )}

        {!submitted && data.naam && (
          <div className="text-center mt-4 text-xs text-stone-400 flex items-center justify-center gap-1">
            <Save size={12} /> Je antwoorden worden automatisch opgeslagen
          </div>
        )}
      </main>

      <footer className="text-center py-8 text-stone-400 text-xs">
        WK Voetbal 2026 · Toto formulier · {SCHOOL_NAAM}
      </footer>
    </div>
  );
}
