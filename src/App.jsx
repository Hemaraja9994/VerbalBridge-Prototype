import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Icons (inline SVG helpers) ────────────────────────────────────────────
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
const IcoAudio    = () => <Icon d="M9 9h6M9 12h6M9 15h4M5 20a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5z" />;

// ─── Clinical Stimulus Data ──────────────────────────────────────────────────
const STIMULI = [
  {
    id: 'item_001', en: 'WATER', kn: 'ನೀರು', hi: 'पानी',
    emoji: '💧',
    cues: {
      en: {
        semantic:     "You drink this when you are thirsty.",
        phonological: "It starts with the sound 'Wa...'",
        restoration:  "Water"
      },
      kn: {
        semantic:     "ಬಾಯಾರಿಕೆಯಾದಾಗ ಇದನ್ನು ಕುಡಿಯುತ್ತೀರಿ.",
        phonological: "ಇದು 'ನೀ' ಅಕ್ಷರದಿಂದ ಶುರುವಾಗುತ್ತದೆ.",
        restoration:  "ನೀರು"
      },
      hi: {
        semantic:     "जब आपको प्यास लगे तो आप यह पीते हैं।",
        phonological: "'पा' से शुरू होता है।",
        restoration:  "पानी"
      }
    }
  },
  {
    id: 'item_002', en: 'MEDICINE', kn: 'ಮಾತ್ರೆ', hi: 'दवाई',
    emoji: '💊',
    cues: {
      en: {
        semantic:     "You take this to feel better when you are sick.",
        phonological: "It starts with 'Me...'",
        restoration:  "Medicine"
      },
      kn: {
        semantic:     "ಹುಷಾರಿಲ್ಲದಿದ್ದಾಗ ಗುಣವಾಗಲು ಇದನ್ನು ತೆಗೆದುಕೊಳ್ಳುತ್ತೀರಿ.",
        phonological: "ಇದು 'ಮಾ' ಅಕ್ಷರದಿಂದ ಶುರುವಾಗುತ್ತದೆ.",
        restoration:  "ಮಾತ್ರೆ"
      },
      hi: {
        semantic:     "जब आप बीमार हों तो ठीक होने के लिए यह लेते हैं।",
        phonological: "'द' से शुरू होता है।",
        restoration:  "दवाई"
      }
    }
  },
  {
    id: 'item_003', en: 'PHONE', kn: 'ಫೋನ್', hi: 'फ़ोन',
    emoji: '📱',
    cues: {
      en: {
        semantic:     "You use this to call your family.",
        phonological: "Starts with the sound 'Ph...'",
        restoration:  "Phone"
      },
      kn: {
        semantic:     "ಮನೆಯವರಿಗೆ ಕರೆ ಮಾಡಲು ಇದನ್ನು ಬಳಸುತ್ತೀರಿ.",
        phonological: "ಇದು 'ಫೋ' ಅಕ್ಷರದಿಂದ ಶುರುವಾಗುತ್ತದೆ.",
        restoration:  "ಫೋನ್"
      },
      hi: {
        semantic:     "आप इससे अपने परिवार को फ़ोन करते हैं।",
        phonological: "'फ़' से शुरू होता है।",
        restoration:  "फ़ोन"
      }
    }
  }
];

// ─── WAB-R Engine ─────────────────────────────────────────────────────────────
const calcAQ = (f, c, r, n) => {
  const aq = (f + c + r + n) * 2.5;
  if (aq < 25) return { aq, type: "Global Aphasia",      color: "#e11d48", badge: "badge-red",    sev: "Severe",          prog: "Guarded",   note: "Total language loss. Use sensory stimulation and basic AAC cues." };
  if (f < 5 && c >= 5) return { aq, type: "Broca's Aphasia",     color: "#f59e0b", badge: "badge-orange", sev: "Mod-Severe",      prog: "Fair-Good", note: "Non-fluent output. Comprehension is a strength — use it in CILT." };
  if (f >= 5 && c < 5) return { aq, type: "Wernicke's Aphasia",  color: "#7c3aed", badge: "badge-purple", sev: "Moderate",        prog: "Fair",      note: "Fluent but paraphasic. Strengthen comprehension monitoring loops." };
  if (r < 5)           return { aq, type: "Conduction Aphasia",  color: "#2563eb", badge: "badge-blue",   sev: "Mild-Moderate",   prog: "Good",      note: "Repetition deficit. Auditory-verbal memory is the key target." };
  return                       { aq, type: "Anomic Aphasia",     color: "#059669", badge: "badge-green",  sev: "Mild",            prog: "Excellent", note: "Word-finding difficulties. Semantic-phonological cueing is ideal." };
};

// ─── Speech Utility (Web Speech API) ─────────────────────────────────────────
const synth = window.speechSynthesis;
const LANG_CODES = { en: 'en-US', kn: 'kn-IN', hi: 'hi-IN' };
const speakText = (text, lang = 'en', rate = 1) => {
  synth.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang  = LANG_CODES[lang] || 'en-US';
  utt.rate  = rate;
  utt.pitch = 1;
  synth.speak(utt);
};

// ─── Framer Motion ────────────────────────────────────────────────────────────
const page = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, transition: { duration: 0.3 } };
const pop  = { initial: { scale: 0.9, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.95, opacity: 0 }, transition: { type: 'spring', damping: 22, stiffness: 120 } };

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [tab,     setTab]     = useState('dashboard');
  const [lang,    setLang]    = useState('en');
  const [scores,  setScores]  = useState({ f: 5.2, c: 6.1, r: 4.8, n: 5.5 });
  const [stimIdx, setStimIdx] = useState(0);

  const result = calcAQ(scores.f, scores.c, scores.r, scores.n);
  const stim   = STIMULI[stimIdx];

  const nav = (id) => setTab(id);

  return (
    <div className="layout">
      {/* ── Sidebar ── */}
      <div className="sidebar">
        <nav className="sidebar-inner">
          <div className="brand-mark">
            <div className="brand-icon"><IcoBrain /></div>
            <div>
              <div className="brand" style={{ color: 'white', fontWeight: 800, fontSize: '1rem' }}>VerbalBridge</div>
              <div className="brand-sub">Neural Regen Pilot</div>
            </div>
          </div>

          <NavBtn icon={<IcoLayout />}   label="Dashboard"        active={tab === 'dashboard'}  onClick={() => nav('dashboard')} />
          <div className="nav-section-label">CLINICAL PHASES</div>
          <NavBtn icon={<IcoActivity />} label="Phase 1: Diagnosis"   active={tab === 'assessment'} onClick={() => nav('assessment')} />
          <NavBtn icon={<IcoMic />}      label="Phase 2: Regen"        active={tab === 'therapy'}    onClick={() => nav('therapy')} />
          <NavBtn icon={<IcoNetwork />}  label="Phase 3: Adaptive"     active={tab === 'cueing'}     onClick={() => nav('cueing')} />
          <NavBtn icon={<IcoFile />}     label="Session Report"        active={tab === 'report'}     onClick={() => nav('report')} />

          <div className="sidebar-footer" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="avatar">DR</div>
            <div>
              <div style={{ color: 'white', fontWeight: 700, fontSize: '0.85rem' }}>Dr. Hemaraja</div>
              <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.7rem' }}>Senior SLP · AIISH</div>
            </div>
          </div>
        </nav>
      </div>

      {/* ── Workspace ── */}
      <main className="workspace">
        <AnimatePresence mode="wait">

          {tab === 'dashboard' && (
            <motion.div key="dash" {...page}>
              <DashboardPage result={result} scores={scores} nav={nav} />
            </motion.div>
          )}

          {tab === 'assessment' && (
            <motion.div key="ass" {...page}>
              <AssessmentPage scores={scores} setScores={setScores} result={result} />
            </motion.div>
          )}

          {tab === 'therapy' && (
            <motion.div key="ther" {...page}>
              <TherapyPage stim={stim} stimIdx={stimIdx} setStimIdx={setStimIdx} lang={lang} setLang={setLang} />
            </motion.div>
          )}

          {tab === 'cueing' && (
            <motion.div key="cue" {...page}>
              <CueingPage stim={stim} stimIdx={stimIdx} setStimIdx={setStimIdx} lang={lang} setLang={setLang} />
            </motion.div>
          )}

          {tab === 'report' && (
            <motion.div key="rep" {...page}>
              <ReportPage result={result} scores={scores} stim={stim} />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* ── Floating Status ── */}
      <div className="floating-status">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div className="status-dot" />
          SESSION ACTIVE
        </div>
        <div className="status-divider" />
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <IcoShield />
          DPDP COMPLIANT
        </div>
      </div>
    </div>
  );
}

// ─── NavBtn ───────────────────────────────────────────────────────────────────
function NavBtn({ icon, label, active, onClick }) {
  return (
    <button className={`nav-btn${active ? ' active' : ''}`} onClick={onClick}>
      {icon} <span>{label}</span>
    </button>
  );
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────
function DashboardPage({ result, scores, nav }) {
  const chartData = [42, 55, 50, 68, 81, 79, 88];
  const modules = [
    { id: 'assessment', icon: <IcoActivity />, color: '#1A237E', title: 'Phase 1: Diagnosis', sub: 'WAB-R Assessment & AQ Profiling' },
    { id: 'therapy',    icon: <IcoMic />,      color: '#FF6D00', title: 'Phase 2: Regen',     sub: 'CILT Intensive Visual Trials' },
    { id: 'cueing',     icon: <IcoNetwork />,  color: '#00695C', title: 'Phase 3: Adaptive',  sub: 'Semantic-Phonological Hierarchy' },
  ];

  return (
    <>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1>Clinical Workspace</h1>
          <p>Active Session — Patient VB-8842 · Aphasia Rehabilitation Pilot</p>
        </div>
        <div className="badge badge-green"><IcoShield /> HIPAA / DPDP Ready</div>
      </div>

      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '2rem' }}>
        {[
          { l: 'Fluency',       v: scores.f, c: '#1A237E' },
          { l: 'Comprehension', v: scores.c, c: '#00695C' },
          { l: 'Repetition',    v: scores.r, c: '#b45309' },
          { l: 'Naming',        v: scores.n, c: '#6d28d9' },
        ].map(s => (
          <div key={s.l} className="card" style={{ padding: '1.5rem' }}>
            <p style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: 1, color: '#94a3b8', marginBottom: '0.5rem' }}>{s.l.toUpperCase()}</p>
            <p style={{ fontSize: '2rem', fontWeight: 900, color: s.c }}>{s.v}</p>
            <div style={{ height: 5, background: '#f1f5f9', borderRadius: 4, marginTop: '0.75rem', overflow: 'hidden' }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${s.v * 10}%` }} transition={{ duration: 1.2 }} style={{ height: '100%', background: s.c, borderRadius: 4 }} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        {/* Recovery Chart */}
        <div className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.75rem', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.15rem' }}>Linguistic Recovery Trend</h3>
            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.72rem', fontWeight: 800 }}>
              <span style={{ color: '#1A237E' }}>● Fluency</span>
              <span style={{ color: '#00695C' }}>● Target</span>
            </div>
          </div>
          <div className="chart-bars">
            {chartData.map((h, i) => (
              <div key={i} className="chart-bar-wrap">
                <motion.div className="chart-bar" initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ delay: i * 0.1, duration: 0.9 }} style={{ background: i === chartData.length - 1 ? '#00695C' : `rgba(26,35,126,${0.3 + i * 0.1})` }} />
                <span className="chart-label">D{i + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Summary */}
        <div className="card" style={{ padding: '2rem', background: '#0D1757', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: 1, color: '#FF6D00', marginBottom: '0.75rem' }}>AI DIAGNOSTIC</p>
            <h3 style={{ color: result.color, fontSize: '1.3rem', marginBottom: '1rem' }}>{result.type}</h3>
            <p style={{ fontSize: '0.88rem', lineHeight: 1.7, opacity: 0.75 }}>AQ: <strong style={{ color: 'white' }}>{result.aq.toFixed(1)}</strong> · {result.sev} Severity</p>
            <p style={{ fontSize: '0.82rem', lineHeight: 1.6, opacity: 0.6, marginTop: '0.75rem' }}>{result.note}</p>
          </div>
          <button className="btn btn-orange" style={{ marginTop: '2rem', justifyContent: 'center' }} onClick={() => {}}>
            <IcoSpark /> Full Report
          </button>
        </div>
      </div>

      {/* Module Cards */}
      <h3 style={{ marginBottom: '1.25rem', fontSize: '1rem', color: '#64748b', fontWeight: 700 }}>CLINICAL MODULES</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
        {modules.map(m => (
          <div key={m.id} className="card card-hover" style={{ padding: '2rem' }} onClick={() => nav(m.id)}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: m.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', color: m.color }}>
              {m.icon}
            </div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>{m.title}</h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>{m.sub}</p>
          </div>
        ))}
      </div>
    </>
  );
}

// ─── Assessment Page ──────────────────────────────────────────────────────────
function AssessmentPage({ scores, setScores, result }) {
  const items = [
    { k: 'f', label: 'Fluency',       max: 10, hint: 'Spontaneous speech output' },
    { k: 'c', label: 'Comprehension', max: 10, hint: 'Auditory understanding' },
    { k: 'r', label: 'Repetition',    max: 10, hint: 'Verbal repetition accuracy' },
    { k: 'n', label: 'Naming',        max: 10, hint: 'Confrontation naming' },
  ];

  return (
    <>
      <div className="page-header">
        <h1>Phase 1: Diagnosis</h1>
        <p>Western Aphasia Battery-Revised (WAB-R) — Real-time AQ Profiling</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem', alignItems: 'start' }}>
        <div className="card" style={{ padding: '2.5rem' }}>
          <h3 style={{ marginBottom: '2rem', fontSize: '1.1rem', color: '#64748b' }}>SUB-SCORES (0 – 10)</h3>
          {items.map(item => (
            <div key={item.k} style={{ marginBottom: '2.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <div>
                  <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>{item.label}</span>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginLeft: '0.5rem' }}>— {item.hint}</span>
                </div>
                <span style={{ fontWeight: 900, color: '#1A237E', fontSize: '1.1rem' }}>{scores[item.k].toFixed(1)}</span>
              </div>
              <input type="range" min={0} max={item.max} step={0.1} value={scores[item.k]}
                onChange={e => setScores({ ...scores, [item.k]: parseFloat(e.target.value) })} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', fontSize: '0.7rem', color: '#cbd5e1' }}>
                <span>0 — Absent</span><span>10 — Normal</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '2.5rem', background: '#0D1757', textAlign: 'center' }}>
            <p style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: 2, color: '#60a5fa', marginBottom: '0.75rem' }}>APHASIA QUOTIENT</p>
            <motion.h2 key={result.aq.toFixed(0)} initial={{ scale: 1.2, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ fontSize: '5rem', fontWeight: 900, color: 'white', lineHeight: 1 }}>
              {result.aq.toFixed(1)}
            </motion.h2>
            <div style={{ marginTop: '1.25rem', padding: '0.6rem 1rem', background: result.color + '25', borderRadius: 12, border: `1px solid ${result.color}50` }}>
              <span style={{ color: result.color, fontWeight: 900, fontSize: '0.85rem' }}>{result.type.toUpperCase()}</span>
            </div>
          </div>

          <div className="card" style={{ padding: '1.75rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <tr><td style={{ padding: '0.6rem 0', color: '#64748b', fontSize: '0.85rem' }}>Severity</td><td style={{ textAlign: 'right', fontWeight: 800 }}>{result.sev}</td></tr>
                <tr><td style={{ padding: '0.6rem 0', color: '#64748b', fontSize: '0.85rem', borderTop: '1px solid #f1f5f9' }}>Prognosis</td><td style={{ textAlign: 'right', fontWeight: 800, color: result.color }}>{result.prog}</td></tr>
              </tbody>
            </table>
          </div>

          <div className="card" style={{ padding: '1.75rem', borderLeft: `4px solid ${result.color}` }}>
            <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', marginBottom: '0.75rem' }}>CLINICAL NOTE</p>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: '#334155' }}>{result.note}</p>
          </div>

          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => speakText(`Patient AQ is ${result.aq.toFixed(1)}. Classified as ${result.type}.`, 'en', 0.9)}>
            <IcoVolume /> Read Aloud (Audio Assist)
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Therapy Page (CILT Phase 2) ──────────────────────────────────────────────
function TherapyPage({ stim, stimIdx, setStimIdx, lang, setLang }) {
  const [phase, setPhase] = useState('idle'); // idle | recording | processing | done
  const [match, setMatch] = useState(null);
  const timerRef = useRef(null);

  const word = stim[lang] || stim.en;

  const startRec = () => {
    if (phase !== 'idle') return;
    setPhase('recording');
    setMatch(null);
  };

  const stopRec = () => {
    if (phase !== 'recording') return;
    setPhase('processing');
    timerRef.current = setTimeout(() => {
      const pct = 82 + Math.floor(Math.random() * 18);
      setMatch(pct);
      setPhase('done');
    }, 2000);
  };

  const reset = () => {
    clearTimeout(timerRef.current);
    setPhase('idle');
    setMatch(null);
  };

  useEffect(() => { reset(); }, [stimIdx, lang]);

  const micClass = phase === 'recording' ? 'mic-btn active' : phase === 'done' ? 'mic-btn success' : 'mic-btn idle';

  const playOutput = (rate) => speakText(word, lang, rate);

  return (
    <>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1>Phase 2: Regen</h1>
          <p>Constraint-Induced Language Therapy (CILT) — Forced Verbal Protocol</p>
        </div>
        <div style={{ display: 'flex', gap: '0.4rem', background: '#0D1757', padding: '4px', borderRadius: 14 }}>
          {['en', 'kn', 'hi'].map(l => (
            <button key={l} className={`lang-pill${lang === l ? ' active' : ''}`} onClick={() => setLang(l)}>
              {l === 'en' ? 'EN' : l === 'kn' ? 'KN' : 'HI'}
            </button>
          ))}
        </div>
      </div>

      {/* Stimulus selector */}
      <div className="stimulus-pills">
        {STIMULI.map((s, i) => (
          <button key={s.id} className={`pill${stimIdx === i ? ' active' : ''}`} onClick={() => setStimIdx(i)}>
            {s.emoji} {s.en}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Stimulus card */}
        <div className="card" style={{ padding: '3.5rem 2.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
          <AnimatePresence mode="wait">
            {phase === 'processing' ? (
              <motion.div key="wave" {...pop} style={{ height: 90, display: 'flex', alignItems: 'center' }}>
                <div className="waveform">
                  {[1,2,3,4,5,6,7,8].map(i => (
                    <div key={i} className="wave-bar" style={{ animationDelay: `${i * 0.1}s`, height: `${30 + (i % 3) * 20}%` }} />
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div key="stim" {...pop} style={{ fontSize: '5.5rem' }}>{stim.emoji}</motion.div>
            )}
          </AnimatePresence>

          <p style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: 2, color: '#94a3b8' }}>TARGET WORD</p>
          <h2 style={{ fontSize: '4rem', fontWeight: 900, letterSpacing: -1, color: '#1A237E', lineHeight: 1 }}>{word}</h2>

          <button className="btn btn-ghost" style={{ fontSize: '0.85rem' }} onClick={() => speakText(word, lang, 0.7)}>
            <IcoVolume /> Listen (0.7x)
          </button>
        </div>

        {/* Interaction card */}
        <div className="card" style={{ padding: '3.5rem 2.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
          
          <AnimatePresence mode="wait">
            {phase === 'idle' && (
              <motion.div key="i" {...pop} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
                <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600, maxWidth: 250, lineHeight: 1.6 }}>
                  Press and hold the microphone to begin your verbal trial.
                </p>
                <button
                  className={micClass}
                  onMouseDown={startRec} onTouchStart={startRec}
                  onMouseUp={stopRec}   onTouchEnd={stopRec}
                >
                  <IcoMic />
                </button>
                <p style={{ fontWeight: 800, color: '#94a3b8', fontSize: '0.8rem', letterSpacing: 1 }}>HOLD TO SPEAK</p>
              </motion.div>
            )}

            {phase === 'recording' && (
              <motion.div key="r" {...pop} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
                <p style={{ fontSize: '0.85rem', color: '#ef4444', fontWeight: 700 }}>● Capturing neural input...</p>
                <button className={micClass} onMouseUp={stopRec} onTouchEnd={stopRec}>
                  <IcoMic />
                </button>
                <p style={{ fontWeight: 800, color: '#ef4444', fontSize: '0.8rem', letterSpacing: 1 }}>RELEASE TO SUBMIT</p>
              </motion.div>
            )}

            {phase === 'processing' && (
              <motion.div key="p" {...pop} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', padding: '3rem 0' }}>
                <div className="waveform" style={{ height: 60 }}>
                  {[1,2,3,4,5].map(i => <div key={i} className="wave-bar" style={{ animationDelay: `${i * 0.12}s`, background: '#1A237E' }} />)}
                </div>
                <p style={{ fontWeight: 700, color: '#1A237E' }}>Processing via Saaras v3...</p>
                <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Verbatim phonological analysis</p>
              </motion.div>
            )}

            {phase === 'done' && (
              <motion.div key="d" {...pop} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                <IcoCheck size={56} />
                <div>
                  <p style={{ fontWeight: 900, color: '#00695C', fontSize: '1.5rem' }}>Phonemic Match: {match}%</p>
                  <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.25rem' }}>Speech successfully regenerated</p>
                </div>

                <div style={{ background: '#f8faff', padding: '1.25rem', borderRadius: 20, width: '100%', border: '1px dashed #c7d2fe' }}>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.4rem', fontWeight: 700 }}>AI OUTPUT</p>
                  <p style={{ fontWeight: 800, color: '#1A237E', fontSize: '1.1rem' }}>"{word}"</p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
                  <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', fontSize: '0.85rem' }} onClick={() => playOutput(1)}>
                    <IcoPlay size={18} /> Normal
                  </button>
                  <button className="btn btn-teal" style={{ flex: 1, justifyContent: 'center', fontSize: '0.85rem' }} onClick={() => playOutput(0.7)}>
                    <IcoPlay size={18} /> Clinical 0.7x
                  </button>
                </div>

                <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem' }} onClick={reset}>
                  <IcoRotate /> New Trial
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

// ─── Cueing Page (Phase 3) ────────────────────────────────────────────────────
const CUE_LEVELS = [
  { level: 1, key: 'semantic',     label: 'Level 1 — Semantic', color: '#00695C', desc: 'Functional description in mother tongue (Bhashini)' },
  { level: 2, key: 'phonological', label: 'Level 2 — Phonological', color: '#1A237E', desc: 'Initial phoneme trigger via Sarvam TTS' },
  { level: 3, key: 'restoration',  label: 'Level 3 — Restoration', color: '#FF6D00', desc: 'Full word restoration via Voice Cloning (Coqui)' },
];

function CueingPage({ stim, stimIdx, setStimIdx, lang, setLang }) {
  const [activeLevel, setActiveLevel] = useState(0);
  const [played, setPlayed]           = useState([]);

  const cues = stim.cues[lang] || stim.cues.en;

  const triggerCue = (idx) => {
    const lvl = CUE_LEVELS[idx];
    const text = cues[lvl.key];
    const rate = lvl.level === 2 ? 0.5 : lvl.level === 3 ? 0.7 : 0.9;
    speakText(text, lang, rate);
    setPlayed(prev => [...new Set([...prev, idx])]);
    setActiveLevel(idx);
  };

  useEffect(() => { setActiveLevel(0); setPlayed([]); }, [stimIdx, lang]);

  const word = stim[lang] || stim.en;

  return (
    <>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1>Phase 3: Adaptive Cueing</h1>
          <p>Semantic-Phonological Hierarchy (Pulvermüller & Berthier, 2008)</p>
        </div>
        <div style={{ display: 'flex', gap: '0.4rem', background: '#0D1757', padding: '4px', borderRadius: 14 }}>
          {['en', 'kn', 'hi'].map(l => (
            <button key={l} className={`lang-pill${lang === l ? ' active' : ''}`} onClick={() => setLang(l)}>
              {l === 'en' ? 'EN' : l === 'kn' ? 'KN' : 'HI'}
            </button>
          ))}
        </div>
      </div>

      <div className="stimulus-pills">
        {STIMULI.map((s, i) => (
          <button key={s.id} className={`pill${stimIdx === i ? ' active' : ''}`} onClick={() => setStimIdx(i)}>
            {s.emoji} {s.en}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem' }}>
        {/* Cue level list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '0.75rem' }}>{stim.emoji}</div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#1A237E' }}>{word}</h2>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.5rem', fontWeight: 700 }}>TARGET STIMULUS</p>
          </div>
          {CUE_LEVELS.map((cl, i) => (
            <div
              key={cl.key}
              className={`card cue-card${activeLevel === i ? ' active-cue' : ''}`}
              style={{ padding: '1.5rem', cursor: 'pointer', borderLeft: `4px solid ${played.includes(i) ? cl.color : 'transparent'}` }}
              onClick={() => triggerCue(i)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 800, fontSize: '0.85rem', color: cl.color }}>{cl.label}</span>
                {played.includes(i) && <span className="badge badge-green" style={{ fontSize: '0.65rem' }}>TRIGGERED</span>}
              </div>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.35rem' }}>{cl.desc}</p>
            </div>
          ))}
        </div>

        {/* Active cue panel */}
        <div className="card" style={{ padding: '3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', gap: '2rem' }}>
          <AnimatePresence mode="wait">
            <motion.div key={`${activeLevel}-${stimIdx}`} {...pop} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
              <div style={{ width: 70, height: 70, borderRadius: '50%', background: CUE_LEVELS[activeLevel].color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', color: CUE_LEVELS[activeLevel].color }}>
                <IcoVolume />
              </div>
              <div>
                <p style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: 2, color: '#94a3b8', marginBottom: '1rem' }}>CURRENT PROMPT — LEVEL {CUE_LEVELS[activeLevel].level}</p>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, lineHeight: 1.4, color: '#1e293b' }}>
                  "{cues[CUE_LEVELS[activeLevel].key]}"
                </h2>
              </div>
              <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                <button className="btn btn-primary btn-lg" style={{ flex: 1, justifyContent: 'center' }} onClick={() => triggerCue(activeLevel)}>
                  <IcoVolume /> Play Cue
                </button>
                {activeLevel < CUE_LEVELS.length - 1 && (
                  <button className="btn btn-ghost btn-lg" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setActiveLevel(activeLevel + 1)}>
                    Next Level <IcoChevron />
                  </button>
                )}
              </div>
              <p style={{ fontSize: '0.78rem', color: '#94a3b8', maxWidth: 300 }}>
                {CUE_LEVELS[activeLevel].level === 1 && 'Give a semantic/functional clue first. Progress only if patient fails.'}
                {CUE_LEVELS[activeLevel].level === 2 && 'Play only the first phoneme to trigger phonological pathway.'}
                {CUE_LEVELS[activeLevel].level === 3 && 'Full restoration — play the complete word to model accurate output.'}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}

// ─── Report Page ──────────────────────────────────────────────────────────────
function ReportPage({ result, scores, stim }) {
  const now = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  return (
    <>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Session Report</h1>
          <p>VerbalBridge Clinical Record — {now}</p>
        </div>
        <button className="btn btn-orange" onClick={() => window.print()}>Export / Print</button>
      </div>

      <div className="card" style={{ padding: '3rem' }} id="report-print">
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '2rem', marginBottom: '2.5rem', borderBottom: '2px solid #f1f5f9', alignItems: 'flex-start' }}>
          <div>
            <h2 style={{ color: '#1A237E', fontSize: '1.5rem' }}>VERBALBRIDGE · SESSION RECORD</h2>
            <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Patient: VB-8842 · AIISH Pilot · {now}</p>
          </div>
          <IcoCheck size={40} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
          <div>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', marginBottom: '1.5rem', letterSpacing: 1 }}>PHASE 1 — WAB-R SCORES</h4>
            <table className="report-table">
              <tbody>
                {[['Fluency', scores.f], ['Comprehension', scores.c], ['Repetition', scores.r], ['Naming', scores.n]].map(([l, v]) => (
                  <tr key={l}><td style={{ color: '#64748b' }}>{l}</td><td style={{ fontWeight: 800, textAlign: 'right' }}>{v} / 10</td></tr>
                ))}
                <tr>
                  <td style={{ fontWeight: 900, color: '#1A237E', paddingTop: '1.5rem' }}>Aphasia Quotient (AQ)</td>
                  <td style={{ fontWeight: 900, color: result.color, textAlign: 'right', fontSize: '1.35rem', paddingTop: '1.5rem' }}>{result.aq.toFixed(1)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <h4 style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', marginBottom: '1.5rem', letterSpacing: 1 }}>DIAGNOSTIC PROFILE</h4>
            <div style={{ background: '#f8faff', padding: '1.5rem', borderRadius: 20, marginBottom: '1.25rem' }}>
              <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', marginBottom: '0.4rem' }}>TAXONOMY</p>
              <p style={{ fontWeight: 800, color: result.color, fontSize: '1.1rem' }}>{result.type}</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              {[['Severity', result.sev, '#1e293b'], ['Prognosis', result.prog, result.color]].map(([l, v, c]) => (
                <div key={l} style={{ background: '#f8faff', padding: '1.25rem', borderRadius: 16 }}>
                  <p style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94a3b8', marginBottom: '0.4rem' }}>{l.toUpperCase()}</p>
                  <p style={{ fontWeight: 800, color: c }}>{v}</p>
                </div>
              ))}
            </div>
            <div style={{ background: '#fafafa', padding: '1.25rem', borderRadius: 16, border: '1px solid #f1f5f9' }}>
              <p style={{ fontSize: '0.68rem', fontWeight: 800, color: '#94a3b8', marginBottom: '0.5rem' }}>CLINICAL LOGIC NOTE</p>
              <p style={{ fontSize: '0.85rem', lineHeight: 1.6, color: '#475569' }}>{result.note}</p>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '3rem', padding: '1.75rem', background: '#f8faff', borderRadius: 20, border: '1px solid #e0e7ff', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <IcoAudio />
          <div>
            <p style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.4rem' }}>Therapy Recommendation</p>
            <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.6 }}>
              Continue CILT intensive protocol (Phase 2) with 30-minute daily sessions. Supplement with Adaptive Cueing (Phase 3) for Semantic → Phonological → Restoration hierarchy. Review in 14 days.
            </p>
          </div>
        </div>

        <div style={{ marginTop: '3rem', textAlign: 'center', opacity: 0.3 }}>
          <p style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: 2 }}>GENERATED BY VERBALBRIDGE NEURAL PILOT — HACK'A'COMM 2026 · AIISH</p>
        </div>
      </div>
    </>
  );
}
