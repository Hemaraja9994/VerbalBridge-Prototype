import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  Mic, 
  Settings, 
  User, 
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
  RotateCcw
} from 'lucide-react';

// --- Clinical Logic ---
const calculateAQ = (f, c, r, n) => {
  const aq = (f + c + r + n) * 2.5;
  let type = "Anomic Aphasia";
  let color = "#0D9488"; // Teal
  let desc = "Mild word-finding difficulties.";

  if (aq < 25) {
    type = "Global Aphasia";
    color = "#EF4444"; // Red
    desc = "Severe across all modalities.";
  } else if (f < 5 && c >= 5) {
    type = "Broca's Aphasia";
    color = "#F59E0B"; // Amber
    desc = "Agrammatic speech, comprehension preserved.";
  } else if (f >= 5 && c < 5) {
    type = "Wernicke's Aphasia";
    color = "#8B5CF6"; // Purple
    desc = "Fluent but paraphasic output.";
  } else if (r < 5) {
    type = "Conduction Aphasia";
    color = "#3B82F6"; // Blue
    desc = "Primary repetition deficit.";
  }

  return { aq, type, desc, color };
};

// --- Animations ---
const fadeIn = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 } };
const scaleUp = { initial: { scale: 0.95, opacity: 0 }, animate: { scale: 1, opacity: 1 }, transition: { type: 'spring', damping: 20 } };

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [scores, setScores] = useState({ f: 5, c: 5, r: 5, n: 5 });
  const [isRecording, setIsRecording] = useState(false);
  const [regenStatus, setRegenStatus] = useState('idle'); // idle, processing, done

  const result = calculateAQ(scores.f, scores.c, scores.r, scores.n);

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      
      {/* Sidebar Navigation (Mockup) */}
      <nav style={{ 
        position: 'fixed', left: 0, top: 0, bottom: 0, width: '80px', 
        background: '#0F172A', display: 'flex', flexDirection: 'column', 
        alignItems: 'center', padding: '2rem 0', gap: '2.5rem', zIndex: 100 
      }}>
        <div style={{ background: '#1D4ED8', padding: '0.75rem', borderRadius: '12px', color: 'white' }}><BrainCircuit size={28} /></div>
        <div onClick={() => setActiveTab('dashboard')} style={{ cursor: 'pointer', color: activeTab === 'dashboard' ? 'white' : '#64748B' }}><LayoutDashboard size={24} /></div>
        <div onClick={() => setActiveTab('assessment')} style={{ cursor: 'pointer', color: activeTab === 'assessment' ? 'white' : '#64748B' }}><Activity size={24} /></div>
        <div onClick={() => setActiveTab('cilt')} style={{ cursor: 'pointer', color: activeTab === 'cilt' ? 'white' : '#64748B' }}><Mic size={24} /></div>
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
          <Settings size={20} color="#64748B" />
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#64748B', border: '2px solid white' }} />
        </div>
      </nav>

      {/* Main Content Area */}
      <main style={{ marginLeft: '80px', padding: '3rem' }}>
        
        <AnimatePresence mode="wait">
          
          {/* DASHBOARD */}
          {activeTab === 'dashboard' && (
            <motion.div key="dash" {...fadeIn}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
                <div>
                  <h1 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Dashboard</h1>
                  <p style={{ color: '#64748B', fontSize: '1.1rem' }}>Clinical Overview — <span style={{ fontWeight: 700, color: '#0F172A' }}>VerbalBridge v1.0</span></p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B' }}>LAST ASSESSMENT</p>
                        <p style={{ fontSize: '0.9rem', fontWeight: 700 }}>21 Apr 2026</p>
                    </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                <div className="card-clinical" onClick={() => setActiveTab('assessment')}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                      <div style={{ padding: '0.75rem', background: '#F1F5F9', borderRadius: '10px' }}><Activity color="#0F172A" /></div>
                      <ChevronRight size={18} color="#94A3B8" />
                   </div>
                   <h3 style={{ marginBottom: '0.5rem' }}>WAB-R Profile</h3>
                   <p style={{ fontSize: '0.85rem', color: '#64748B' }}>Score: {result.aq.toFixed(1)} — {result.type}</p>
                </div>

                <div className="card-clinical" onClick={() => setActiveTab('cilt')}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                      <div style={{ padding: '0.75rem', background: '#FEF3C7', borderRadius: '10px' }}><Mic color="#D97706" /></div>
                      <ChevronRight size={18} color="#94A3B8" />
                   </div>
                   <h3 style={{ marginBottom: '0.5rem' }}>Speech Regeneration</h3>
                   <p style={{ fontSize: '0.85rem', color: '#64748B' }}>Module: CILT forced verbal use.</p>
                </div>

                <div className="card-clinical">
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                      <div style={{ padding: '0.75rem', background: '#F0FDF4', borderRadius: '10px' }}><BrainCircuit color="#16A34A" /></div>
                      <ChevronRight size={18} color="#94A3B8" />
                   </div>
                   <h3 style={{ marginBottom: '0.5rem' }}>Adaptive Cueing</h3>
                   <p style={{ fontSize: '0.85rem', color: '#64748B' }}>Semantic-Phonological logic hierarchy.</p>
                </div>
              </div>

              <div style={{ background: 'white', padding: '2rem', borderRadius: '24px', border: '1px solid #E2E8F0' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                    <Zap size={20} color="#F59E0B" fill="#F59E0B" />
                    <h3 style={{ fontSize: '1.25rem' }}>AI Insights</h3>
                 </div>
                 <div style={{ display: 'flex', gap: '2rem' }}>
                    <div style={{ flex: 1, padding: '1.5rem', background: '#F8FAFC', borderRadius: '16px' }}>
                       <p style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: '0.5rem' }}>NEURAL RECOVERY TREND</p>
                       <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>Consistent progress in naming latency. Semantic cueing efficacy at 84%.</p>
                    </div>
                    <div style={{ flex: 1, padding: '1.5rem', background: '#F8FAFC', borderRadius: '16px' }}>
                       <p style={{ fontSize: '0.9rem', color: '#64748B', marginBottom: '0.5rem' }}>RECOMMENDED MODULE</p>
                       <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>CILT Intensive — Focus on multi-syllabic noun retrieval.</p>
                    </div>
                 </div>
              </div>
            </motion.div>
          )}

          {/* ASSESSMENT */}
          {activeTab === 'assessment' && (
            <motion.div key="assessment" {...fadeIn} style={{ maxWidth: '800px', margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                 <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Clinical Assessment</h1>
                 <p style={{ color: '#64748B' }}>Adjust the WAB-R sub-scores below for real-time profiling.</p>
              </div>

              <div style={{ display: 'flex', gap: '2rem', marginBottom: '3rem' }}>
                <div style={{ flex: 1.5, background: 'white', padding: '2rem', borderRadius: '24px', border: '1px solid #E2E8F0' }}>
                  {[
                    { key: 'f', label: 'Fluency' },
                    { key: 'c', label: 'Comprehension' },
                    { key: 'r', label: 'Repetition' },
                    { key: 'n', label: 'Naming' },
                  ].map(item => (
                    <div key={item.key} style={{ marginBottom: '2rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <label style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0F172A' }}>{item.label.toUpperCase()}</label>
                        <span style={{ fontWeight: 800, color: '#1D4ED8' }}>{scores[item.key].toFixed(1)}</span>
                      </div>
                      <input 
                        type="range" min="0" max="10" step="0.1" 
                        value={scores[item.key]} 
                        onChange={(e) => setScores({...scores, [item.key]: parseFloat(e.target.value)})} 
                      />
                    </div>
                  ))}
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                   <div style={{ background: '#0F172A', color: 'white', padding: '2rem', borderRadius: '24px', textAlign: 'center' }}>
                      <p style={{ fontSize: '0.75rem', opacity: 0.6, fontWeight: 700, letterSpacing: '1px' }}>AQ SCORE</p>
                      <h2 style={{ fontSize: '4rem', fontWeight: 800, margin: '1rem 0' }}>{result.aq.toFixed(1)}</h2>
                      <div style={{ background: result.color + '33', border: '1px solid ' + result.color, padding: '0.5rem', borderRadius: '10px' }}>
                        <span style={{ color: result.color, fontWeight: 800, fontSize: '0.8rem' }}>{result.type}</span>
                      </div>
                   </div>
                   <div style={{ background: 'white', padding: '1.5rem', borderRadius: '24px', border: '1px solid #E2E8F0' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                         <Info size={16} color="#64748B" />
                         <span style={{ fontWeight: 700, fontSize: '0.8rem', color: '#64748B' }}>DESCRIPTION</span>
                      </div>
                      <p style={{ fontSize: '0.9rem', lineHeight: '1.5', color: '#334155' }}>{result.desc}</p>
                   </div>
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                 <button className="btn-primary">
                    <ShieldCheck size={20} /> SYNC TO CLINICAL CLOUD
                 </button>
              </div>
            </motion.div>
          )}

          {/* CILT REGEN */}
          {activeTab === 'cilt' && (
            <motion.div key="cilt" {...fadeIn} style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
               <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Speech Regeneration</h1>
               <p style={{ color: '#64748B', marginBottom: '3rem' }}>Clinical Module: CILT Verbatim Retrieval</p>

               <div style={{ 
                 background: 'white', padding: '3rem', borderRadius: '32px', 
                 boxShadow: '0 30px 60px -12px rgba(0,0,0,0.05)', border: '1px solid #E2E8F0', 
                 position: 'relative', overflow: 'hidden' 
               }}>
                  <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', display: 'flex', gap: '0.5rem' }}>
                      <span style={{ padding: '0.4rem 0.75rem', background: '#F1F5F9', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 700 }}>MONTH 1 ROADMAP</span>
                  </div>

                  <AnimatePresence mode="wait">
                    {regenStatus === 'idle' && (
                      <motion.div key="s1" {...scaleUp}>
                        <div style={{ 
                          width: '160px', height: '160px', background: '#F1F5F9', 
                          borderRadius: '40px', margin: '0 auto 2.5rem', 
                          display: 'flex', alignItems: 'center', justifyContent: 'center' 
                        }}>
                          <Volume2 size={64} color="#94A3B8" />
                        </div>
                        <p style={{ color: '#64748B', marginBottom: '0.5rem', fontWeight: 600 }}>Visual Stimulus Targeting</p>
                        <h2 style={{ fontSize: '3.5rem', fontWeight: 800, color: '#0F172A', marginBottom: '3rem' }}>"WATER"</h2>
                        
                        <button 
                          onMouseDown={() => setIsRecording(true)} 
                          onMouseUp={() => { setIsRecording(false); setRegenStatus('processing'); setTimeout(() => setRegenStatus('done'), 3000); }}
                          style={{ 
                            background: isRecording ? '#EF4444' : '#1D4ED8', 
                            width: '100px', height: '100px', borderRadius: '50%', 
                            border: 'none', cursor: 'pointer', transition: 'all 0.3s',
                            boxShadow: isRecording ? '0 0 40px rgba(239,68,68,0.4)' : '0 15px 30px rgba(29,78,216,0.2)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto'
                          }}
                        >
                          <Mic color="white" size={32} />
                        </button>
                        <p style={{ marginTop: '1.5rem', color: isRecording ? '#EF4444' : '#64748B', fontWeight: 700 }}>{isRecording ? 'Capturing Speech...' : 'Press and Hold to Speak'}</p>
                      </motion.div>
                    )}

                    {regenStatus === 'processing' && (
                      <motion.div key="s2" {...scaleUp} style={{ padding: '4rem 0' }}>
                         <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '2rem' }}>
                            {[1,2,3,4,5].map(i => (
                               <motion.div 
                                 key={i}
                                 animate={{ height: [20, 60, 20] }}
                                 transition={{ repeat: Infinity, duration: 0.6, delay: i*0.1 }}
                                 style={{ width: '6px', background: '#0D9488', borderRadius: '10px' }}
                                />
                            ))}
                         </div>
                         <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>AI Regeneration Engine</h3>
                         <p style={{ color: '#64748B' }}>Normalizing phonemic pathways for 'Saaras' output...</p>
                      </motion.div>
                    )}

                    {regenStatus === 'done' && (
                      <motion.div key="s3" {...scaleUp}>
                         <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
                            <div style={{ background: '#F0FDF4', padding: '1rem', borderRadius: '20px', color: '#16A34A' }}>
                               <CheckCircle2 size={48} />
                            </div>
                         </div>
                         <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>Speech Regenerated</h2>
                         <div style={{ background: '#F8FAFC', padding: '1.5rem', borderRadius: '20px', marginBottom: '2rem', border: '1px dashed #CBD5E1' }}>
                            <p style={{ fontSize: '1.25rem', fontWeight: 600 }}>Audio Input: <span style={{ color: '#64748B' }}>"wa... wa... ter..."</span></p>
                            <p style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '0.5rem' }}>AI Output: <span style={{ color: '#1D4ED8' }}>"Give me water."</span></p>
                         </div>
                         <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <button className="btn-primary"><Play size={20} /> PLAY NORMAL</button>
                            <button className="btn-primary" style={{ background: '#0D9488' }}><Sparkles size={20} /> PLAY CLINICAL (0.7x)</button>
                         </div>
                         <button onClick={() => setRegenStatus('idle')} style={{ marginTop: '2rem', background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '2rem auto 0' }}>
                            <RotateCcw size={16} /> RESTART TASK
                         </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
               </div>

               <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center', gap: '2rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', padding: '0.75rem 1.25rem', background: 'white', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                     <Languages size={18} color="#64748B" />
                     <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>Regional: CANARESE</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', padding: '0.75rem 1.25rem', background: 'white', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                     <ShieldCheck size={18} color="#0D9488" />
                     <span style={{ fontWeight: 700, fontSize: '0.85rem' }}>E2E ENCRYPTED (DPDP)</span>
                  </div>
               </div>
            </motion.div>
          )}

        </AnimatePresence>

      </main>

      <footer style={{ 
        position: 'fixed', bottom: 0, right: 0, 
        padding: '1.5rem 3rem', color: '#94A3B8', 
        fontSize: '0.85rem', fontWeight: 600 
      }}>
         © 2026 VERBALBRIDGE AI • CLINICAL PILOT
      </footer>
    </div>
  );
}
