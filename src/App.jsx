import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── STIMULI LIBRARY (Updated with TA, TE, ML) ──────────────────────────────
const STIMULI = [
  { id: '1', emoji: '💧', en: 'WATER', kn: 'ನೀರು', hi: 'पानी', ta: 'தண்ணீர்', te: 'నీరు', ml: 'വെള്ളം' },
  { id: '2', emoji: '💊', en: 'MEDICINE', kn: 'ಮಾತ್ರೆ', hi: 'दवाई', ta: 'மருந்து', te: 'మందు', ml: 'മരുന്ന്' },
  { id: '3', emoji: '📱', en: 'PHONE', kn: 'ಫೋನ್', hi: 'फ़ोन', ta: 'தொலைபேசி', te: 'ఫోన్', ml: 'ഫോൺ' },
  { id: '4', emoji: '🍽️', en: 'PLATE', kn: 'ತಟ್ಟೆ', hi: 'थाली', ta: 'தட்டு', te: 'కంచం', ml: 'പ്ലേറ്റ്' },
  { id: '5', emoji: '🥄', en: 'SPOON', kn: 'ಚಮಚ', hi: 'चम्मच', ta: 'ஸ்பூன்', te: 'చెంచా', ml: 'സ്പൂൺ' }
];

// ─── ICONS ──────────────────────────────────────────────────────────────────
const Icon = ({ d }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d={d}/></svg>
);
const IcoDash = () => <Icon d="M3 9h18M3 15h18M9 3v18" />;
const IcoDiag = () => <Icon d="M22 12h-4l-3 9L9 3l-3 9H2" />;
const IcoRegen = () => <Icon d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3zM19 10v2a7 7 0 0 1-14 0v-2" />;
const IcoAdap = () => <Icon d="M9.663 17h4.673M12 3v1" />;
const IcoReport = () => <Icon d="M14 2v6h6M16 13H8M16 17H8" />;

// ─── SPEECH ENGINE (Sarvam AI Ready) ────────────────────────────────────────
const speak = (text, lang) => {
  window.speechSynthesis.cancel();
  const langMap = { en: 'en-US', kn: 'kn-IN', hi: 'hi-IN', ta: 'ta-IN', te: 'te-IN', ml: 'ml-IN' };
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = langMap[lang] || 'en-US';
  utt.rate = 0.7; // Clinical slow rate
  window.speechSynthesis.speak(utt);
};

export default function App() {
  const [phase, setPhase] = useState('regen');
  const [lang, setLang] = useState('kn');
  const [activeStim, setActiveStim] = useState(STIMULI[0]);

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      {/* ── Sidebar (Original Navy Design) ── */}
      <aside className="w-64 bg-[#0D1757] flex flex-col p-6 text-white">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center">
            <Icon d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </div>
          <div>
            <h1 className="font-black text-lg leading-tight">VerbalBridge</h1>
            <p className="text-[10px] text-indigo-300 font-bold tracking-widest uppercase">Neural Regen Pilot</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarLink icon={<IcoDash/>} label="Dashboard" />
          <div className="pt-6 pb-2 text-[10px] font-black text-indigo-400 tracking-widest">CLINICAL PHASES</div>
          <SidebarLink icon={<IcoDiag/>} label="Phase 1: Diagnosis" />
          <SidebarLink icon={<IcoRegen/>} label="Phase 2: Regen" active />
          <SidebarLink icon={<IcoAdap/>} label="Phase 3: Adaptive" />
          <SidebarLink icon={<IcoReport/>} label="Session Report" />
        </nav>

        <div className="mt-auto p-4 bg-white/5 rounded-2xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-400 flex items-center justify-center font-bold text-xs">DR</div>
          <div>
            <p className="text-xs font-bold">Dr. Hemaraja</p>
            <p className="text-[9px] text-indigo-300">Senior SLP · AIISH</p>
          </div>
        </div>
      </aside>

      {/* ── Main Workspace ── */}
      <main className="flex-1 p-10 overflow-y-auto">
        <header className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-black text-slate-800">Phase 2: Regen</h2>
            <p className="text-slate-400 font-medium">Constraint-Induced Language Therapy (CILT) — Forced Verbal Protocol</p>
          </div>
          
          {/* MULTILINGUAL SELECTOR */}
          <div className="flex bg-slate-200 p-1 rounded-xl gap-1">
            {['EN', 'KN', 'TA', 'TE', 'ML', 'HI'].map(l => (
              <button 
                key={l}
                onClick={() => setLang(l.toLowerCase())}
                className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${lang === l.toLowerCase() ? 'bg-[#FF6D00] text-white shadow-lg' : 'text-slate-500 hover:text-slate-800'}`}
              >
                {l}
              </button>
            ))}
          </div>
        </header>

        {/* Stimulus Tabs */}
        <div className="flex gap-3 mb-10">
          {STIMULI.map(s => (
            <button 
              key={s.id}
              onClick={() => setActiveStim(s)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black transition-all border-2 ${activeStim.id === s.id ? 'bg-[#1A237E] border-[#1A237E] text-white shadow-xl' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'}`}
            >
              <span className="text-lg">{s.emoji}</span> {s.en}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-8">
          {/* Stimulus Display */}
          <div className="bg-white rounded-[32px] p-12 shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-8 text-center">
             <div className="text-8xl mb-4">{activeStim.emoji}</div>
             <div>
               <p className="text-[10px] font-black text-slate-300 tracking-[0.2em] mb-2">TARGET WORD</p>
               <h3 className="text-7xl font-black text-[#1A237E]">{activeStim[lang] || activeStim.en}</h3>
             </div>
             <button 
              onClick={() => speak(activeStim[lang] || activeStim.en, lang)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-slate-100 text-slate-500 font-bold text-sm hover:bg-slate-50"
             >
               <Icon d="M11 5 6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 0 1 0 14.14"/> Listen (0.7x)
             </button>
          </div>

          {/* Interaction Area */}
          <div className="bg-white rounded-[32px] p-12 shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-8">
            <p className="text-slate-400 font-medium text-center max-w-[200px] leading-relaxed">
              Press and hold the microphone to begin your verbal trial.
            </p>
            <div className="relative">
              <button className="w-24 h-24 bg-[#1A237E] rounded-full flex items-center justify-center text-white shadow-2xl hover:scale-105 active:scale-95 transition-all">
                <Icon d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3zM19 10v1a7 7 0 0 1-14 0v-1M12 19v4M8 23h8" />
              </button>
              <div className="absolute -inset-4 border-2 border-dashed border-indigo-100 rounded-full animate-spin-slow"></div>
            </div>
            <p className="text-[10px] font-black text-slate-300 tracking-[0.2em]">HOLD TO SPEAK</p>
          </div>
        </div>
      </main>

      {/* Footer Status */}
      <div className="fixed bottom-6 right-10 flex items-center gap-4 bg-[#0D1757] text-white py-2.5 px-6 rounded-2xl shadow-2xl text-[10px] font-black tracking-widest">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          SESSION ACTIVE
        </div>
        <div className="w-px h-3 bg-white/20"></div>
        <div className="flex items-center gap-2">
          <Icon d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
          DPDP COMPLIANT
        </div>
      </div>
    </div>
  );
}

function SidebarLink({ icon, label, active = false }) {
  return (
    <div className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all ${active ? 'bg-indigo-600 shadow-lg' : 'hover:bg-white/5 text-indigo-200'}`}>
      {icon}
      <span className="text-xs font-bold">{label}</span>
    </div>
  );
}
