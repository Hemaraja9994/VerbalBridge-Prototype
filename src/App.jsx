import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  Mic, 
  Settings, 
  BrainCircuit, 
  ChevronRight,
  Volume2,
  Sparkles,
  ShieldCheck,
  Languages,
  LayoutDashboard,
  CheckCircle2,
  Zap,
  Info,
  RotateCcw,
  Play,
  FileText,
  BarChart3,
  RefreshCw,
  Eye,
  Download,
  Calendar,
  Clock,
  ExternalLink,
  MessageSquare,
  Network
} from 'lucide-react';

// --- Clinical Logic & Constants ---
const calculateAQ = (f, c, r, n) => {
  const aq = (f + c + r + n) * 2.5;
  let type = "Anomic Aphasia";
  let color = "#10B981"; 
  let severity = "Mild";
  let prognosis = "Excellent";
  let logic = "High potential for word-retrieval recovery through phonemic cueing.";

  if (aq < 25) {
    type = "Global Aphasia";
    color = "#F43F5E"; 
    severity = "Severe";
    prognosis = "Guarded";
    logic = "Total language loss across all modalities. Focus on sensory stimulation.";
  } else if (f < 5 && c >= 5) {
    type = "Broca's Aphasia";
    color = "#F59E0B"; 
    severity = "Moderate-Severe";
    prognosis = "Fair-Good";
    logic = "Non-fluent, effortful speech. Auditory comprehension is a strength.";
  } else if (f >= 5 && c < 5) {
    type = "Wernicke's Aphasia";
    color = "#8B5CF6"; 
    severity = "Moderate";
    prognosis = "Fair";
    logic = "Fluent but paraphasic output. Critical need for comprehension monitoring.";
  } else if (r < 5) {
    type = "Conduction Aphasia";
    color = "#3B82F6"; 
    severity = "Mild-Moderate";
    prognosis = "Good";
    logic = "Repetition impairment. Spontaneous speech and comprehension intact.";
  }

  return { aq, type, color, severity, prognosis, logic };
};

const CUEING_HIERARCHY = [
  { level: 1, title: 'Semantic Cue', text: 'It is used for drinking...', detail: 'Functional description prompt.' },
  { level: 2, title: 'Lead-in Cue', text: 'I drink from the...', detail: 'Sentence completion format.' },
  { key: 'phonemic', level: 3, title: 'Phonemic Cue', text: 'It starts with /W/...', detail: 'Initial sound elicitation.' },
  { level: 4, title: 'Imitation', text: 'Say "WATER"', detail: 'Direct verbal copy.' }
];

// --- Audio Utility ---
const speak = (text, rate = 1) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  }
};

// --- Animations ---
const springTransition = { type: 'spring', damping: 20, stiffness: 100 };
const slideIn = { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -20 } };

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [scores, setScores] = useState({ f: 5.2, c: 6.1, r: 4.8, n: 5.5 });
  const [isRecording, setIsRecording] = useState(false);
  const [regenProgress, setRegenProgress] = useState(0);
  const [activeLang, setActiveLang] = useState('EN');
  const [activeCue, setActiveCue] = useState(0);
  
  const result = calculateAQ(scores.f, scores.c, scores.r, scores.n);

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', display: 'flex' }}>
      
      {/* 1. CLINICAL SIDEBAR */}
      <aside style={{ 
        width: '280px', background: '#0F172A', color: 'white', 
        padding: '2.5rem', display: 'flex', flexDirection: 'column',
        position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '4rem' }}>
          <div style={{ background: '#3B82F6', padding: '0.6rem', borderRadius: '12px' }}><BrainCircuit size={28} /></div>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '1px', fontFamily: 'Space Grotesk' }}>VERBALBRIDGE</span>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <NavButton active={activeTab === 'dashboard'} icon={<LayoutDashboard size={20}/>} label="Dashboard" onClick={() => setActiveTab('dashboard')} />
          <p style={{ fontSize: '0.65rem', fontWeight: 800, color: 'rgba(255,255,255,0.3)', margin: '1rem 0 0.5rem 1rem', letterSpacing: '1px' }}>CLINICAL PHASES</p>
          <NavButton active={activeTab === 'assessment'} icon={<Activity size={20}/>} label="Phase 1: Diagnosis" onClick={() => setActiveTab('assessment')} />
          <NavButton active={activeTab === 'therapy'} icon={<Mic size={20}/>} label="Phase 2: Regen" onClick={() => setActiveTab('therapy')} />
          <NavButton active={activeTab === 'cueing'} icon={<Network size={20}/>} label="Phase 3: Adaptive" onClick={() => setActiveTab('cueing')} />
          <NavButton active={activeTab === 'report'} icon={<FileText size={20}/>} label="Session Report" onClick={() => setActiveTab('report')} />
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '1rem 0' }} />
          <NavButton active={false} icon={<Calendar size={20}/>} label="Patient History" onClick={() => {}} />
        </nav>

        <div style={{ padding: '1.5rem', background: '#1E293B', borderRadius: '20px', marginTop: 'auto' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>DR</div>
              <div>
                 <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem' }}>Dr. Hemaraja</p>
                 <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.6 }}>Senior SLP</p>
              </div>
           </div>
           <button style={{ width: '100%', background: 'rgba(255,255,255,0.05)', color: 'white', border: 'none', padding: '0.6rem', borderRadius: '10px', fontSize: '0.8rem', cursor: 'pointer' }}>Sign Out</button>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE */}
      <main style={{ marginLeft: '280px', flex: 1, padding: '3rem' }}>
        <AnimatePresence mode="wait">
          
          {/* DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <motion.div key="dash" {...slideIn}>
               <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div>
                    <h1 style={{ fontSize: '2.5rem', margin: 0 }}>Clinical Workspace</h1>
                    <p style={{ color: '#64748B', fontWeight: 500 }}>Integrated Assessment & Speech Regeneration Platform</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                     <div style={{ display: 'inline-flex', gap: '0.5rem', padding: '0.5rem 1rem', background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '0.5rem' }}>
                        <ShieldCheck size={18} color="#10B981" />
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#10B981' }}>DPDP ACT COMPLIANT</span>
                     </div>
                  </div>
               </header>

               <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                     <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
                        {[
                          { l: 'Fluency', v: scores.f },
                          { l: 'Comp', v: scores.c },
                          { l: 'Rep', v: scores.r },
                          { l: 'Naming', v: scores.n }
                        ].map(s => (
                           <div key={s.l} className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                              <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94A3B8', marginBottom: '0.5rem' }}>{s.l.toUpperCase()}</p>
                              <p style={{ fontSize: '1.75rem', fontWeight: 800 }}>{s.v}</p>
                              <div style={{ height: '4px', background: '#F1F5F9', borderRadius: '2px', marginTop: '0.5rem', overflow: 'hidden' }}>
                                 <motion.div initial={{ width: 0 }} animate={{ width: `${s.v * 10}%` }} transition={{ duration: 1.5 }} style={{ height: '100%', background: '#3B82F6' }} />
                              </div>
                           </div>
                        ))}
                     </div>

                     <div style={{ background: 'white', padding: '2rem', borderRadius: '24px', border: '1px solid #E2E8F0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                           <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Linguistic Recovery Trend</h3>
                           <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', fontWeight: 700 }}>
                              <span style={{ color: '#3B82F6' }}>● Progress</span>
                              <span style={{ color: '#10B981' }}>● Goal</span>
                           </div>
                        </div>
                        <div className="bar-container">
                           {[40, 55, 48, 70, 85, 92, 78].map((h, i) => (
                              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                 <motion.div 
                                    className="bar-pill" 
                                    initial={{ height: 0 }} 
                                    animate={{ height: `${h}%` }} 
                                    transition={{ delay: i * 0.1, duration: 1 }}
                                    style={{ background: i === 6 ? '#10B981' : '#3B82F6', width: '100%' }}
                                 />
                                 <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>D{i+1}</span>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                      <div className="card-clinical" style={{ background: '#0F172A', color: 'white' }}>
                         <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 700, color: '#3B82F6' }}>PHASE 1 SUMMARY</p>
                         <h3 style={{ margin: '1rem 0', fontSize: '1.5rem', color: result.color }}>{result.type}</h3>
                         <p style={{ fontSize: '0.9rem', lineHeight: '1.6', opacity: 0.8 }}>Automatic diagnosis based on WAB-R thresholds. Recovery probability: Excellent.</p>
                         <button onClick={() => setActiveTab('assessment')} className="btn-clinical btn-clinical-primary" style={{ marginTop: '1.5rem', width: '100%', justifyContent: 'center', background: '#3B82F6' }}>VIEW DETAILS</button>
                      </div>

                      <div style={{ background: 'white', padding: '1.5rem', borderRadius: '24px', border: '1px solid #E2E8F0' }}>
                         <h3 style={{ fontSize: '1rem', marginBottom: '1.25rem' }}>Phase 2: Active Results</h3>
                         <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                              <div style={{ background: '#F0FDF4', padding: '0.5rem', borderRadius: '8px', color: '#10B981' }}><CheckCircle2 size={16} /></div>
                              <div>
                                 <p style={{ margin: 0, fontWeight: 700, fontSize: '0.85rem' }}>CILT "Water" Task</p>
                                 <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748B' }}>Match: 92% • Status: Success</p>
                              </div>
                         </div>
                      </div>
                  </div>
               </div>
            </motion.div>
          )}

          {/* ASSESSMENT TAB */}
          {activeTab === 'assessment' && (
            <motion.div key="assessment" {...slideIn} style={{ maxWidth: '900px', margin: '0 auto' }}>
              <div style={{ marginBottom: '3rem' }}>
                 <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Phase 1: Diagnosis</h1>
                 <p style={{ color: '#64748B' }}>WAB-R (Western Aphasia Battery-Revised) Scoring Interface</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
                <div style={{ background: 'white', padding: '2.5rem', borderRadius: '32px', border: '1px solid #E2E8F0' }}>
                  {['f', 'c', 'r', 'n'].map(k => (
                    <div key={k} style={{ marginBottom: '2rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#475569' }}>{k === 'f' ? 'FLUENCY' : k === 'c' ? 'COMPREHENSION' : k === 'r' ? 'REPETITION' : 'NAMING'}</span>
                        <span style={{ fontWeight: 800, color: '#3B82F6' }}>{scores[k].toFixed(1)}</span>
                      </div>
                      <input type="range" min="0" max="10" step="0.1" value={scores[k]} onChange={(e) => setScores({...scores, [k]: parseFloat(e.target.value)})} />
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                   <div style={{ background: '#0F172A', color: 'white', padding: '2.5rem', borderRadius: '32px', textAlign: 'center' }}>
                      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#3B82F6' }}>AQ SCORE</p>
                      <h2 style={{ fontSize: '4.5rem', fontWeight: 800, margin: '0.5rem 0' }}>{result.aq.toFixed(1)}</h2>
                      <div style={{ display: 'inline-block', padding: '0.5rem 1rem', background: result.color + '22', borderRadius: '12px', color: result.color, fontWeight: 900 }}>{result.type.toUpperCase()}</div>
                   </div>
                   <div style={{ background: 'white', padding: '1.5rem', borderRadius: '24px', border: '1px solid #E2E8F0' }}>
                      <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.6', color: '#64748B' }}><Info size={16} /> <strong>Pathology Note:</strong> {result.logic}</p>
                   </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* THERAPY (PHASE 2) */}
          {activeTab === 'therapy' && (
            <motion.div key="therapy" {...slideIn} style={{ maxWidth: '800px', margin: '0 auto' }}>
               <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                  <div>
                    <h1 style={{ fontSize: '2.5rem' }}>Phase 2: Regen</h1>
                    <p style={{ color: '#64748B' }}>CILT (Constraint-Induced Language Therapy)</p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', background: 'white', padding: '0.4rem', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                      {['EN', 'KN', 'HI'].map(l => ( <button key={l} onClick={() => setActiveLang(l)} style={{ padding: '0.4rem 0.8rem', border: 'none', background: activeLang === l ? '#3B82F6' : 'transparent', color: activeLang === l ? 'white' : '#64748B', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 800, cursor: 'pointer' }}>{l}</button> ))}
                  </div>
               </header>

               <div className="glass-card" style={{ padding: '4rem', textAlign: 'center' }}>
                  <div style={{ margin: '0 auto 3rem', width: '200px', height: '200px', background: '#F8FAFC', borderRadius: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     {regenProgress > 0 && regenProgress < 100 ? (
                        <div className="waveform"> {[1,2,3,4,5,6,7].map(i => <div key={i} className="wave-bar" style={{ animationDelay: `${i*0.1}s`, height: `${30 + Math.random()*70}%` }} />)} </div>
                     ) : (
                        <img src="https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=200" style={{ width: '150px', borderRadius: '20px' }} />
                     )}
                  </div>
                  
                  <h2 style={{ fontSize: '4rem', margin: '0 0 3rem 0' }}>{activeLang === 'EN' ? 'WATER' : activeLang === 'KN' ? 'ನೀರು' : 'पानी'}</h2>

                  <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', alignItems: 'center' }}>
                    <motion.button 
                        whileTap={{ scale: 0.9 }}
                        onMouseDown={() => setIsRecording(true)}
                        onMouseUp={() => { setIsRecording(false); setRegenProgress(0); let p=0; const it = setInterval(() => { p+=10; setRegenProgress(p); if(p>=100) clearInterval(it); }, 150); }}
                        style={{ width: '100px', height: '100px', borderRadius: '50%', background: isRecording ? '#F43F5E' : '#3B82F6', border: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 20px 40px rgba(59,130,246,0.3)' }}
                    > <Mic size={40} /> </motion.button>
                  </div>
                  <p style={{ marginTop: '2rem', fontWeight: 700, color: '#64748B' }}>{isRecording ? 'Capturing Neural Input...' : regenProgress >= 100 ? 'SUCCESS: Match 92%' : 'Hold to Initiate Trial'}</p>

                  <AnimatePresence>
                     {regenProgress >= 100 && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '3rem', borderTop: '1px solid #F1F5F9', paddingTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                           <button onClick={() => speak("I need some water", 1)} className="btn-clinical btn-clinical-primary"><Play size={18} /> Play Authentic</button>
                           <button onClick={() => speak("I need some water", 0.75)} className="btn-clinical btn-clinical-secondary" style={{ background: '#F0FDF4', color: '#10B981', border: '1px solid #BBF7D0' }}><Sparkles size={18} /> Clinical (0.7x)</button>
                        </motion.div>
                     )}
                  </AnimatePresence>
               </div>
            </motion.div>
          )}

          {/* CUEING (PHASE 3) */}
          {activeTab === 'cueing' && (
            <motion.div key="cueing" {...slideIn} style={{ maxWidth: '850px', margin: '0 auto' }}>
               <header style={{ marginBottom: '3rem' }}>
                  <h1 style={{ fontSize: '2.5rem' }}>Phase 3: Adaptive</h1>
                  <p style={{ color: '#64748B' }}>Semantic-Phonological Hierarchy Protocol</p>
               </header>

               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                     {CUEING_HIERARCHY.map((c, i) => (
                        <div 
                           key={i} 
                           onClick={() => setActiveCue(i)}
                           style={{ 
                              padding: '1.5rem', background: activeCue === i ? 'white' : 'transparent', 
                              border: activeCue === i ? '1px solid #3B82F6' : '1px solid #E2E8F0', 
                              borderRadius: '20px', cursor: 'pointer', transition: '0.2s',
                              boxShadow: activeCue === i ? '0 10px 15px -3px rgba(59,130,246,0.1)' : 'none'
                           }}
                        >
                           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                              <span style={{ fontSize: '0.7rem', fontWeight: 800, color: activeCue === i ? '#3B82F6' : '#94A3B8' }}>LEVEL {c.level}</span>
                              {activeCue === i && <Zap size={14} color="#3B82F6" />}
                           </div>
                           <p style={{ margin: 0, fontWeight: 800, fontSize: '1rem' }}>{c.title}</p>
                        </div>
                     ))}
                  </div>

                  <div className="glass-card" style={{ padding: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                     <div style={{ width: '80px', height: '80px', background: '#F1F5F9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
                        <Volume2 size={32} color="#3B82F6" />
                     </div>
                     <p style={{ fontSize: '0.8rem', fontWeight: 800, color: '#94A3B8', marginBottom: '1rem' }}>LEVEL {CUEING_HIERARCHY[activeCue].level} PROMPT</p>
                     <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem', height: '80px' }}>{CUEING_HIERARCHY[activeCue].text}</h2>
                     <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '3rem' }}>{CUEING_HIERARCHY[activeCue].detail}</p>
                     
                     <div style={{ display: 'flex', gap: '1rem' }}>
                        <button onClick={() => speak(CUEING_HIERARCHY[activeCue].text)} className="btn-clinical btn-clinical-primary"><Play size={18} /> Trigger Cue</button>
                        <button onClick={() => setActiveCue((activeCue + 1) % 4)} className="btn-clinical btn-clinical-secondary">Next Level <ChevronRight size={18}/></button>
                     </div>
                  </div>
               </div>
            </motion.div>
          )}

          {/* REPORT TAB */}
          {activeTab === 'report' && (
            <motion.div key="report" {...slideIn} style={{ maxWidth: '900px', margin: '0 auto' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                 <h1 style={{ fontSize: '2.5rem' }}>Clinical Report</h1>
                 <button className="btn-clinical btn-clinical-primary"><Download size={18} /> EXPORT PDF</button>
               </div>
               <div style={{ background: 'white', padding: '4rem', borderRadius: '32px', border: '1px solid #E2E8F0' }}>
                  <div style={{ borderBottom: '2px solid #F1F5F9', paddingBottom: '2rem', marginBottom: '3rem', display: 'flex', justifyContent: 'space-between' }}>
                     <div>
                        <p style={{ margin: 0, fontWeight: 900, color: '#3B82F6', fontSize: '1.5rem', fontFamily: 'Space Grotesk' }}>VERBALBRIDGE SESSION RECORD</p>
                        <p style={{ margin: 0, color: '#64748B' }}>Patient ID: VB-8842 • 21 April 2026</p>
                     </div>
                     <CheckCircle2 size={40} color="#10B981" />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
                     <div>
                        <h4 style={{ fontSize: '0.8rem', fontWeight: 800, color: '#94A3B8', marginBottom: '1.5rem' }}>PHASE 1: METRICS</h4>
                        {stats.map(s => (
                           <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #F1F5F9' }}>
                              <span style={{ color: '#64748B' }}>{s.label}</span>
                              <span style={{ fontWeight: 800 }}>{s.val} / 10</span>
                           </div>
                        ))}
                     </div>
                     <div>
                        <h4 style={{ fontSize: '0.8rem', fontWeight: 800, color: '#94A3B8', marginBottom: '1.5rem' }}>CLINICAL PROFILE</h4>
                        <div style={{ background: '#F8FAFC', padding: '1.5rem', borderRadius: '20px' }}>
                           <p style={{ margin: '0 0 0.5rem 0', fontWeight: 800, fontSize: '1.1rem', color: result.color }}>{result.type}</p>
                           <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748B', lineHeight: '1.6' }}>{result.logic}</p>
                        </div>
                     </div>
                  </div>
               </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Floating Status */}
      <div style={{ position: 'fixed', bottom: '2.5rem', right: '3.5rem', background: '#0F172A', color: 'white', padding: '0.8rem 1.5rem', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '1.25rem', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}> <div style={{ width: '8px', height: '8px', background: '#10B981', borderRadius: '50%' }} /> <span style={{ fontSize: '0.8rem', fontWeight: 800 }}>PILOT PHASE ACTIVE</span> </div>
         <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.1)' }} />
         <span style={{ fontSize: '0.8rem', fontWeight: 800, opacity: 0.7 }}>v1.0.8 Excellence</span>
      </div>
    </div>
  );
}

function NavButton({ active, icon, label, onClick }) {
  return (
    <motion.button 
      whileHover={{ x: 5 }}
      onClick={onClick}
      style={{ 
        display: 'flex', alignItems: 'center', gap: '1rem', 
        padding: '1rem 1.25rem', border: 'none', background: active ? '#3B82F6' : 'transparent', 
        color: active ? 'white' : '#64748B', borderRadius: '15px', 
        cursor: 'pointer', transition: '0.2s', width: '100%',
        fontWeight: active ? 700 : 500, fontSize: '0.95rem'
      }}
    >
      {icon}
      <span>{label}</span>
    </motion.button>
  );
}
