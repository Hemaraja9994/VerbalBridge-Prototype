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
  MessageSquare
} from 'lucide-react';

// --- Comprehensive Clinical Assessment Engine ---
const calculateAQ = (f, c, r, n) => {
  const aq = (f + c + r + n) * 2.5;
  let type = "Anomic Aphasia";
  let color = "#10B981"; // Emerald
  let severity = "Mild";
  let prognosis = "Excellent";
  let logic = "High potential for word-retrieval recovery through phonemic cueing.";

  if (aq < 25) {
    type = "Global Aphasia";
    color = "#F43F5E"; // Rose
    severity = "Severe";
    prognosis = "Guarded";
    logic = "Total language loss across all modalities. Focus on sensory stimulation and basic needs cueing.";
  } else if (f < 5 && c >= 5) {
    type = "Broca's Aphasia";
    color = "#F59E0B"; // Amber
    severity = "Moderate-Severe";
    prognosis = "Fair-Good";
    logic = "Non-fluent, effortful speech. Auditory comprehension is a strength to be leveraged in therapy.";
  } else if (f >= 5 && c < 5) {
    type = "Wernicke's Aphasia";
    color = "#8B5CF6"; // Violet
    severity = "Moderate";
    prognosis = "Fair";
    logic = "Fluent but paraphasic output. Critical need for comprehension monitoring and feedback loops.";
  } else if (r < 5) {
    type = "Conduction Aphasia";
    color = "#3B82F6"; // Blue
    severity = "Mild-Moderate";
    prognosis = "Good";
    logic = "Repetition impairment. Spontaneous speech and comprehension intact. Focus on auditory-verbal memory.";
  }

  return { aq, type, color, severity, prognosis, logic };
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
  
  const result = calculateAQ(scores.f, scores.c, scores.r, scores.n);

  const stats = [
    { label: 'Fluency', val: scores.f },
    { label: 'Comp', val: scores.c },
    { label: 'Repetition', val: scores.r },
    { label: 'Naming', val: scores.n },
  ];

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
          <NavButton active={activeTab === 'assessment'} icon={<Activity size={20}/>} label="Assessment" onClick={() => setActiveTab('assessment')} />
          <NavButton active={activeTab === 'therapy'} icon={<Mic size={20}/>} label="Speech Regen" onClick={() => setActiveTab('therapy')} />
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
                    <p style={{ color: '#64748B', fontWeight: 500 }}>Active Session: Patient ID-8842 (Anomic Aphasia Pilot)</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                     <div style={{ display: 'inline-flex', gap: '0.5rem', padding: '0.5rem 1rem', background: 'white', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '0.5rem' }}>
                        <ShieldCheck size={18} color="#10B981" />
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#10B981' }}>DATA ENCRYPTED & HIPAA READY</span>
                     </div>
                  </div>
               </header>

               <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                     {/* Dynamic Stats View */}
                     <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem' }}>
                        {stats.map(s => (
                           <div key={s.label} className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
                              <p style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94A3B8', marginBottom: '0.5rem' }}>{s.label.toUpperCase()}</p>
                              <p style={{ fontSize: '1.75rem', fontWeight: 800 }}>{s.val}</p>
                              <div style={{ height: '4px', background: '#F1F5F9', borderRadius: '2px', marginTop: '0.5rem', overflow: 'hidden' }}>
                                 <motion.div initial={{ width: 0 }} animate={{ width: `${s.val * 10}%` }} transition={{ duration: 1.5 }} style={{ height: '100%', background: '#3B82F6' }} />
                              </div>
                           </div>
                        ))}
                     </div>

                     {/* Recovery Track Graph Simulation */}
                     <div style={{ background: 'white', padding: '2rem', borderRadius: '24px', border: '1px solid #E2E8F0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                           <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Linguistic Recovery Trend</h3>
                           <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', fontWeight: 700 }}>
                              <span style={{ color: '#3B82F6' }}>● Fluency</span>
                              <span style={{ color: '#10B981' }}>● Naming Accuracy</span>
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
                      <div style={{ background: '#0F172A', color: 'white', padding: '2rem', borderRadius: '24px', position: 'relative', overflow: 'hidden' }}>
                         <Zap size={60} color="rgba(255,255,255,0.05)" style={{ position: 'absolute', right: '-10px', top: '-10px' }} />
                         <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 700, color: '#3B82F6' }}>AI DIAGNOSTIC SUMMARY</p>
                         <h3 style={{ margin: '1rem 0', fontSize: '1.5rem', color: result.color }}>{result.type}</h3>
                         <p style={{ fontSize: '0.9rem', lineHeight: '1.6', opacity: 0.8 }}>Current AQ: <strong style={{color: 'white'}}>{result.aq.toFixed(1)}</strong>. Recommendation: Focus on Semantic Hierarchy Cueing (SHC) for {activeLang === 'EN' ? 'English' : 'Regional'} substrates.</p>
                         <button onClick={() => setActiveTab('assessment')} className="btn-clinical btn-clinical-primary" style={{ marginTop: '1.5rem', width: '100%', justifyContent: 'center', background: '#3B82F6' }}>RE-ASSESS NOW</button>
                      </div>

                      <div style={{ background: 'white', padding: '1.5rem', borderRadius: '24px', border: '1px solid #E2E8F0' }}>
                         <h3 style={{ fontSize: '1rem', marginBottom: '1.25rem' }}>Recent Activity Logs</h3>
                         {[
                           { t: 'Speech Regen', d: '24 trials completed', s: '84%' },
                           { t: 'Naming Task', d: 'Category: Utensils', s: '72%' }
                         ].map((log, i) => (
                           <div key={i} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: i === 0 ? '1px solid #F1F5F9' : 'none' }}>
                              <div style={{ background: '#F1F5F9', padding: '0.5rem', borderRadius: '8px' }}><Clock size={16} /></div>
                              <div>
                                 <p style={{ margin: 0, fontWeight: 700, fontSize: '0.85rem' }}>{log.t}</p>
                                 <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748B' }}>{log.d} • Success: {log.s}</p>
                              </div>
                           </div>
                         ))}
                      </div>
                  </div>
               </div>
            </motion.div>
          )}

          {/* THERAPY TAB (Enhanced) */}
          {activeTab === 'therapy' && (
            <motion.div key="therapy" {...slideIn} style={{ maxWidth: '800px', margin: '0 auto' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                  <div>
                    <h1 style={{ fontSize: '2.5rem' }}>Speech Regeneration</h1>
                    <p style={{ color: '#64748B' }}>Clinical Module: CILT Intensive Regeneration Loop</p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', background: 'white', padding: '0.5rem', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                     {['EN', 'KN', 'HI'].map(l => (
                        <button key={l} onClick={() => setActiveLang(l)} style={{ 
                           padding: '0.5rem 1rem', border: 'none', background: activeLang === l ? '#0F172A' : 'transparent', 
                           color: activeLang === l ? 'white' : '#64748B', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' 
                        }}>{l}</button>
                     ))}
                  </div>
               </div>

               <div className="glass-card" style={{ padding: '4rem', textAlign: 'center', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '2rem', left: '2rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                     <Sparkles size={16} color="#3B82F6" />
                     <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#3B82F6' }}>AI-DRIVEN CILT PIPELINE</span>
                  </div>

                  <div style={{ margin: '0 auto 4rem', width: '220px', height: '220px', background: '#F8FAFC', borderRadius: '40px', border: '2px dashed #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     {regenProgress > 0 && regenProgress < 100 ? (
                        <div className="waveform">
                           {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="wave-bar" style={{ animationDelay: `${i*0.1}s`, height: `${30 + Math.random()*70}%` }} />)}
                        </div>
                     ) : (
                        <img src="https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=200" style={{ width: '160px', borderRadius: '20px' }} alt="WATER" />
                     )}
                  </div>

                  <p style={{ fontSize: '0.9rem', color: '#94A3B8', fontWeight: 700 }}>VERBAL STIMULUS</p>
                  <h2 style={{ fontSize: '4.5rem', margin: '0.5rem 0 3rem' }}>{activeLang === 'EN' ? 'WATER' : activeLang === 'KN' ? 'ನೀರು' : 'पानी'}</h2>

                  <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto' }}>
                     <AnimatePresence>
                        {isRecording && (
                           <motion.div 
                              initial={{ scale: 0.8, opacity: 0 }} 
                              animate={{ scale: 1.5, opacity: 0.15 }} 
                              exit={{ scale: 2, opacity: 0 }} 
                              transition={{ repeat: Infinity, duration: 1.5 }}
                              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: '#F43F5E', borderRadius: '50%' }} 
                           />
                        )}
                     </AnimatePresence>
                     <motion.button 
                        whileTap={{ scale: 0.9 }}
                        onMouseDown={() => setIsRecording(true)}
                        onMouseUp={() => {
                           setIsRecording(false);
                           let p = 0;
                           const interval = setInterval(() => {
                              p += 5;
                              setRegenProgress(p);
                              if (p >= 100) clearInterval(interval);
                           }, 100);
                        }}
                        style={{ width: '100%', height: '100%', borderRadius: '50%', background: isRecording ? '#F43F5E' : '#3B82F6', border: 'none', cursor: 'pointer', position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 40px rgba(59,130,246,0.3)' }}
                     >
                        <Mic color="white" size={40} />
                     </motion.button>
                  </div>
                  <p style={{ marginTop: '2rem', fontWeight: 800, color: isRecording ? '#F43F5E' : '#64748B' }}>{isRecording ? 'Capturing Speech Energy...' : regenProgress >= 100 ? 'Analysis Complete' : 'Press & Hold to Initiate Forced Verbal Trial'}</p>
               </div>

               {regenProgress >= 100 && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                      <div style={{ flex: 1, background: '#F0FDF4', padding: '1.5rem', borderRadius: '20px', border: '1px solid #BBF7D0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                         <div style={{ background: '#10B981', color: 'white', padding: '0.5rem', borderRadius: '8px' }}><CheckCircle2 size={24} /></div>
                         <div>
                            <p style={{ margin: 0, fontWeight: 800, color: '#065F46' }}>Phonemic Match: 92%</p>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: '#166534' }}>Target acquired. Regenerated output ready.</p>
                         </div>
                      </div>
                      <button className="btn-clinical btn-clinical-primary" style={{ flex: 1, justifyContent: 'center' }}><Play size={20} /> Play Authentic (0.7x)</button>
                  </motion.div>
               )}
            </motion.div>
          )}

          {/* REPORT TAB (Comprehensive) */}
          {activeTab === 'report' && (
            <motion.div key="report" {...slideIn} style={{ maxWidth: '900px', margin: '0 auto' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
                  <div>
                    <h1 style={{ fontSize: '2.5rem' }}>Clinical Report</h1>
                    <p style={{ color: '#64748B' }}>Session ID: #VB-2026-0421-A</p>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                     <button className="btn-clinical btn-clinical-secondary"><Download size={18} /> EXPORT PDF</button>
                     <button className="btn-clinical btn-clinical-primary"><RefreshCw size={18} /> SYNC DATA</button>
                  </div>
               </div>

               <div style={{ background: 'white', padding: '4rem', borderRadius: '32px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #F1F5F9', paddingBottom: '2rem', marginBottom: '2rem' }}>
                     <div>
                        <p style={{ margin: 0, fontWeight: 800, color: '#3B82F6', fontSize: '1.5rem', fontFamily: 'Space Grotesk' }}>VERBALBRIDGE ANALYTICS</p>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748B' }}>Clinical Validation Report — Month 1</p>
                     </div>
                     <div style={{ textAlign: 'right', fontSize: '0.85rem' }}>
                        <p style={{ margin: '0 0 0.25rem 0' }}><strong>Date:</strong> 21 April 2026</p>
                        <p style={{ margin: 0 }}><strong>Clinician:</strong> Dr. Hemaraja9994</p>
                     </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
                     <div>
                        <h4 style={{ fontSize: '1rem', borderLeft: '4px solid #3B82F6', paddingLeft: '1rem', marginBottom: '1.5rem' }}>Core WAB-R Metrics</h4>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                           <tbody>
                              {stats.map(s => (
                                 <tr key={s.label} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                    <td style={{ padding: '0.75rem 0', color: '#64748B' }}>{s.label}</td>
                                    <td style={{ padding: '0.75rem 0', fontWeight: 800, textAlign: 'right' }}>{s.val} / 10</td>
                                 </tr>
                              ))}
                              <tr>
                                 <td style={{ padding: '1rem 0', color: '#0F172A', fontWeight: 800 }}>Aphasia Quotient</td>
                                 <td style={{ padding: '1rem 0', fontWeight: 900, textAlign: 'right', color: result.color, fontSize: '1.25rem' }}>{result.aq.toFixed(1)}</td>
                              </tr>
                           </tbody>
                        </table>
                     </div>
                     <div>
                        <h4 style={{ fontSize: '1rem', borderLeft: '4px solid #10B981', paddingLeft: '1rem', marginBottom: '1.5rem' }}>Diagnostic Prognosis</h4>
                        <div style={{ background: '#F8FAFC', padding: '1.5rem', borderRadius: '16px', marginBottom: '1.5rem' }}>
                           <p style={{ margin: '0 0 0.5rem 0', fontWeight: 800, color: '#64748B', fontSize: '0.75rem' }}>TAXONOMY</p>
                           <p style={{ margin: 0, fontWeight: 700, color: result.color }}>{result.type}</p>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                           <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '16px' }}>
                              <p style={{ margin: '0 0 0.5rem 0', fontWeight: 800, color: '#64748B', fontSize: '0.7rem' }}>SEVERITY</p>
                              <p style={{ margin: 0, fontWeight: 700 }}>{result.severity}</p>
                           </div>
                           <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '16px' }}>
                              <p style={{ margin: '0 0 0.5rem 0', fontWeight: 800, color: '#64748B', fontSize: '0.7rem' }}>PROGNOSIS</p>
                              <p style={{ margin: 0, fontWeight: 700, color: '#10B981' }}>{result.prognosis}</p>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div style={{ marginTop: '3rem', background: '#F1F5F9', padding: '1.5rem', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                     <h4 style={{ fontSize: '0.9rem', margin: '0 0 0.75rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Zap size={16}/> Clinical Logic Note</h4>
                     <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.6', color: '#475569' }}>{result.logic}</p>
                  </div>

                  <div style={{ marginTop: '4rem', textAlign: 'center', opacity: 0.3 }}>
                     <ShieldCheck size={40} style={{ marginBottom: '0.5rem' }} />
                     <p style={{ fontSize: '0.7rem', fontWeight: 800 }}>OFFICIAL CLINICAL RECORD — GENERATED VIA VERBALBRIDGE PROTOTYPE</p>
                  </div>
               </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Floating Status Bar */}
      <motion.div initial={{ y: 100 }} animate={{ y: 0 }} style={{ 
        position: 'fixed', bottom: '2rem', right: '3rem', zIndex: 1000,
        background: '#0F172A', color: 'white', padding: '0.75rem 1.5rem', 
        borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '1.5rem',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
           <div style={{ width: '10px', height: '10px', background: '#10B981', borderRadius: '50%' }} />
           <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>SESSION ACTIVE</span>
        </div>
        <div style={{ height: '20px', width: '1px', background: 'rgba(255,255,255,0.2)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
           <MessageSquare size={16} color="#3B82F6" />
           <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>AI FEEDBACK: ON</span>
        </div>
      </motion.div>
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
        padding: '1rem 1.25rem', border: 'none', background: active ? '#1D4ED8' : 'transparent', 
        color: active ? 'white' : '#64748B', borderRadius: '15px', 
        cursor: 'pointer', transition: '0.2s', width: '100%',
        fontWeight: active ? 700 : 500,
        fontSize: '0.95rem'
      }}
    >
      {icon}
      <span>{label}</span>
    </motion.button>
  );
}
