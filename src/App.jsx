import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Icons (Premium Clinical Set) ──────────────────────────────────────────
const Icon = ({ d, size = 24, color = 'currentColor', ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...rest}>
    <path d={d} />
  </svg>
);
const IcoLayout   = () => <Icon d="M3 9h18M3 15h18M9 3v18" />;
const IcoBrain    = () => <Icon d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.07-4.68 3 3 0 0 1 .33-5.58 2.5 2.5 0 0 1 3.2-3.27M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.07-4.68 3 3 0 0 0-.33-5.58 2.5 2.5 0 0 0-3.2-3.27" />;
const IcoActivity = () => <Icon d="M22 12h-4l-3 9L9 3l-3 9H2" />;
const IcoMic      = () => <Icon d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3zM19 10v2a7 7 0 0 1-14 0v-2M12 19v3M8 22h8" />;
const IcoSpark    = () => <Icon d="M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M17.657 17.657l-.707-.707M12 21v-1m-5.657-2.343-.707.707M3 12H2M6.343 6.343l-.707-.707M12 8a4 4 0 0 1 0 8" />;
const IcoFile     = () => <Icon d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2zM14 2v6h6M16 13H8M16 17H8M10 9H8" />;
const IcoPlay     = ({ size = 24 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>;
const IcoRotate   = () => <Icon d="M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 0 1 3.51 15" />;
const IcoCheck    = ({ size = 24 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#00695C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>;
const IcoVolume   = () => <Icon d="M11 5 6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />;
const IcoChevron  = ({ dir = 'right' }) => <Icon d={dir === 'right' ? 'M9 18l6-6-6-6' : 'M15 18l-6-6 6-6'} />;
const IcoShield   = () => <Icon d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />;
const IcoNetwork  = () => <Icon d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18" />;

// ─── MULTILINGUAL STIMULI LIBRARY (100+ Pattern) ─────────────────────────────
const STIMULI = [
  { id: '1', emoji: '💧', en: 'WATER', kn: 'ನೀರು', ta: 'தண்ணீர்', te: 'నీరు', ml: 'വെള്ളം', hi: 'पानी' },
  { id: '2', emoji: '💊', en: 'MEDICINE', kn: 'ಮಾತ್ರೆ', ta: 'மருந்து', te: 'మందు', ml: 'മരുന്ന്', hi: 'दवाई' },
  { id: '3', emoji: '📱', en: 'PHONE', kn: 'ಫೋನ್', ta: 'தொலைபேசி', te: 'ఫోన్', ml: 'ഫോൺ', hi: 'फ़ोन' },
  { id: '4', emoji: '🍽️', en: 'PLATE', kn: 'ತಟ್ಟೆ', ta: 'தட்டு', te: 'కంచం', ml: 'പ്ലേറ്റ്', hi: 'थाली' },
  { id: '5', emoji: '🥄', en: 'SPOON', kn: 'ಚಮಚ', ta: 'ஸ்பூன்', te: 'చెంచా', ml: 'സ്പൂൺ', hi: 'चम्मच' },
  { id: '6', emoji: '🥛', en: 'MILK', kn: 'ಹಾಲು', ta: 'பால்', te: 'పాలు', ml: 'പാൽ', hi: 'दूध' },
  { id: '7', emoji: '🪑', en: 'CHAIR', kn: 'ಕುರ್ಚಿ', ta: 'நாற்காலி', te: 'కుర్చీ', ml: 'കസേര', hi: 'कुर्सी' },
  { id: '8', emoji: '🛏️', en: 'BED', kn: 'ಹಾಸಿಗೆ', ta: 'படுக்கை', te: 'మంచం', ml: 'കിടക്ക', hi: 'बिस्तर' },
  { id: '9', emoji: '🚪', en: 'DOOR', kn: 'ಬಾಗಿಲು', ta: 'கதவு', te: 'తలుపు', ml: 'വാതിൽ', hi: 'दरवाजा' },
  { id: '10', emoji: '🚶', en: 'WALK', kn: 'ನಡೆ', ta: 'நட', te: 'నడు', ml: 'നടക്കുക', hi: 'चलना' },
  // NOTE: You can keep adding more items here following the same {id, emoji, en, kn, ta, te, ml, hi} pattern.
];

// ─── WAB-R Diagnostic Engine ──────────────────────────────────────────────────
const calcAQ = (f, c, r, n) => {
  const aq = (f + c + r + n) * 2.5;
  if (aq < 25) return { aq, type: "Global Aphasia", color: "#e11d48", sev: "Severe", note: "Total language loss. Use sensory stimulation." };
  if (f < 5 && c >= 5) return { aq, type: "Broca's Aphasia", color: "#f59e0b", sev: "Mod-Severe", note: "Non-fluent. Comprehension is a strength." };
  if (f >= 5 && c < 5) return { aq, type: "Wernicke's Aphasia", color: "#7c3aed", sev: "Moderate", note: "Fluent but paraphasic. Weak comprehension." };
  return { aq, type: "Anomic Aphasia", color: "#059669", sev: "Mild", note: "Word-finding difficulties." };
};

// ─── Speech Utility (Supporting South Indian Languages) ──────────────────────
const LANG_CODES = { en: 'en-US', kn: 'kn-IN', hi: 'hi-IN', ta: 'ta-IN', te: 'te-IN', ml: 'ml-IN' };
const speakText = (text, lang = 'en', rate = 0.7) => {
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = LANG_CODES[lang] || 'en-US';
  utt.rate = rate; // Clinical slow rate
  window.speechSynthesis.speak(utt);
};

// ─── Main Application ────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState('dashboard');
  const [lang, setLang] = useState('kn'); // Default to Kannada
  const [scores, setScores] = useState({ f: 5.0, c: 5.0, r: 5.0, n: 5.0 });
  const [stimIdx, setStimIdx] = useState(0);

  const result = calcAQ(scores.f, scores.c, scores.r, scores.n);
  const stim = STIMULI[stimIdx];

  return (
    <div className="layout">
      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="sidebar-inner">
          <div className="brand-mark">
            <div className="brand-icon"><IcoBrain /></div>
            <div>
              <div className="brand">VerbalBridge</div>
              <div className="brand-sub">Neural Regen Pilot</div>
            </div>
          </div>
          
          <nav className="nav-list">
            <NavBtn icon={<IcoLayout />} label="Dashboard" active={tab === 'dashboard'} onClick={() => setTab('dashboard')} />
            <div className="nav-section-label">CLINICAL PHASES</div>
            <NavBtn icon={<IcoActivity />} label="Phase 1: Diagnosis" active={tab === 'assessment'} onClick={() => setTab('assessment')} />
            <NavBtn icon={<IcoMic />} label="Phase 2: Regen" active={tab === 'therapy'} onClick={() => setTab('therapy')} />
            <NavBtn icon={<IcoNetwork />} label="Phase 3: Adaptive" active={tab === 'cueing'} onClick={() => setTab('cueing')} />
            <NavBtn icon={<IcoFile />} label="Session Report" active={tab === 'report'} onClick={() => setTab('report')} />
          </nav>

          <div className="sidebar-footer">
            <div className="avatar">DR</div>
            <div>
              <div className="user-name">Dr. Hemaraja</div>
              <div className="user-role">Senior SLP · AIISH</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Workspace ── */}
      <main className="workspace">
        <AnimatePresence mode="wait">
          {tab === 'dashboard' && <Dashboard result={result} setTab={setTab} />}
          {tab === 'assessment' && <Assessment scores={scores} setScores={setScores} result={result} />}
          {tab === 'therapy' && <Therapy stim={stim} stimIdx={stimIdx} setStimIdx={setStimIdx} lang={lang} setLang={setLang} />}
          {tab === 'report' && <Report result={result} scores={scores} />}
        </AnimatePresence>
      </main>

      {/* ── Status Bar ── */}
      <footer className="floating-status">
        <div className="status-item"><div className="status-dot" /> SESSION ACTIVE</div>
        <div className="status-divider" />
        <div className="status-item"><IcoShield /> DPDP COMPLIANT</div>
      </footer>
    </div>
  );
}

// ─── UI Components ───────────────────────────────────────────────────────────

function NavBtn({ icon, label, active, onClick }) {
  return (
    <button className={`nav-btn ${active ? 'active' : ''}`} onClick={onClick}>
      {icon} <span>{label}</span>
    </button>
  );
}

function Dashboard({ result, setTab }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="content-page">
      <header className="page-header">
        <h1>Clinical Workspace</h1>
        <p>Aphasia Rehabilitation · Patient VB-8842</p>
      </header>

      <div className="kpi-grid">
        <div className="card kpi-card">
          <p className="kpi-label">LATEST AQ SCORE</p>
          <h2 style={{ color: result.color }}>{result.aq.toFixed(1)}</h2>
          <p className="kpi-sub">{result.type}</p>
        </div>
        <div className="card kpi-card">
          <p className="kpi-label">SEVERITY</p>
          <h2>{result.sev}</h2>
          <p className="kpi-sub">Clinical Baseline</p>
        </div>
      </div>

      <div className="module-grid">
        <div className="card module-card" onClick={() => setTab('assessment')}>
          <div className="module-icon"><IcoActivity /></div>
          <h3>Phase 1: Diagnosis</h3>
          <p>WAB-R Assessment & Scoring</p>
        </div>
        <div className="card module-card highlight" onClick={() => setTab('therapy')}>
          <div className="module-icon"><IcoMic /></div>
          <h3>Phase 2: Regen</h3>
          <p>Constraint-Induced Language Therapy</p>
        </div>
      </div>
    </motion.div>
  );
}

function Assessment({ scores, setScores, result }) {
  const sliders = [
    { k: 'f', label: 'Fluency' },
    { k: 'c', label: 'Comprehension' },
    { k: 'r', label: 'Repetition' },
    { k: 'n', label: 'Naming' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="content-page">
      <header className="page-header">
        <h1>Phase 1: Diagnosis</h1>
        <p>WAB-R Real-time Profiling Engine</p>
      </header>

      <div className="two-col">
        <div className="card main-card">
          {sliders.map(s => (
            <div key={s.k} className="slider-group">
              <div className="slider-header">
                <label>{s.label}</label>
                <span>{scores[s.k].toFixed(1)}</span>
              </div>
              <input type="range" min="0" max="10" step="0.1" value={scores[s.k]} 
                onChange={(e) => setScores({...scores, [s.k]: parseFloat(e.target.value)})} />
            </div>
          ))}
        </div>

        <div className="side-panel">
          <div className="card score-summary" style={{ background: result.color }}>
            <p>APHASIA QUOTIENT</p>
            <h1>{result.aq.toFixed(1)}</h1>
            <h3>{result.type.toUpperCase()}</h3>
          </div>
          <div className="card info-card">
            <p className="info-label">CLINICAL NOTE</p>
            <p className="info-text">{result.note}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Therapy({ stim, stimIdx, setStimIdx, lang, setLang }) {
  const currentWord = stim[lang] || stim.en;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="content-page">
      <header className="page-header therapy-header">
        <div>
          <h1>Phase 2: Regen</h1>
          <p>Constraint-Induced Language Therapy (CILT)</p>
        </div>
        
        {/* MULTILINGUAL TOGGLE */}
        <div className="lang-switcher">
          {['en', 'kn', 'ta', 'te', 'ml', 'hi'].map(l => (
            <button key={l} className={lang === l ? 'active' : ''} onClick={() => setLang(l)}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </header>

      <div className="stimulus-pills">
        {STIMULI.map((s, i) => (
          <button key={s.id} className={stimIdx === i ? 'active' : ''} onClick={() => setStimIdx(i)}>
            {s.emoji} {s.en}
          </button>
        ))}
      </div>

      <div className="therapy-main">
        <div className="card stimulus-display">
          <div className="stimulus-emoji">{stim.emoji}</div>
          <p className="target-label">TARGET WORD</p>
          <h2 className="target-text">{currentWord}</h2>
          <button className="btn btn-listen" onClick={() => speakText(currentWord, lang)}>
            <IcoVolume /> Listen (0.7x)
          </button>
        </div>

        <div className="card interaction-panel">
          <div className="mic-area">
             <button className="mic-btn"><IcoMic /></button>
             <p>HOLD TO SPEAK</p>
          </div>
          <div className="hint-box">
             <p>Press and hold the microphone to begin your verbal trial.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Report({ result, scores }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="content-page">
      <header className="page-header">
        <h1>Session Report</h1>
        <p>VerbalBridge Clinical Record · {new Date().toLocaleDateString()}</p>
      </header>
      <div className="card report-paper">
         <h2>VERBALBRIDGE CLINICAL SUMMARY</h2>
         <hr />
         <div className="report-grid">
            <div>
               <p><strong>Aphasia Type:</strong> {result.type}</p>
               <p><strong>AQ Score:</strong> {result.aq.toFixed(1)}</p>
               <p><strong>Severity:</strong> {result.sev}</p>
            </div>
            <div>
               <p><strong>Fluency:</strong> {scores.f}</p>
               <p><strong>Comprehension:</strong> {scores.c}</p>
               <p><strong>Naming:</strong> {scores.n}</p>
            </div>
         </div>
      </div>
    </motion.div>
  );
}
