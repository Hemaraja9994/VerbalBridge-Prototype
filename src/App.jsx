import React, { useState } from 'react';
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
  Play
} from 'lucide-react';

// --- Clinical Logic ---
const calculateAQ = (f, c, r, n) => {
  const aq = (f + c + r + n) * 2.5;
  let type = "Anomic Aphasia";
  let color = "#0D9488"; // Teal
  let desc = "Mild word-finding difficulties. High potential for semantic-phonological recovery.";

  if (aq < 25) {
    type = "Global Aphasia";
    color = "#EF4444"; // Red
    desc = "Severe deficits across all communication modalities. Focus on basic needs cues.";
  } else if (f < 5 && c >= 5) {
    type = "Broca's Aphasia";
    color = "#F59E0B"; // Amber
    desc = "Motor speech deficits and agrammatism. Auditory comprehension relatively preserved.";
  } else if (f >= 5 && c < 5) {
    type = "Wernicke's Aphasia";
    color = "#8B5CF6"; // Purple
    desc = "Fluent but paraphasic speech. Significant deficits in comprehension and naming.";
  } else if (r < 5) {
    type = "Conduction Aphasia";
    color = "#3B82F6"; // Blue
    desc = "Primary deficit in repetition. Spontaneous speech and comprehension are good.";
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
  const [regenStatus, setRegenStatus] = useState('idle');

  const result = calculateAQ(scores.f, scores.c, scores.r, scores.n);

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', color: '#0F172A', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      
      {/* Premium Sidebar */}
      <nav style={{ 
        position: 'fixed', left: 0, top: 0, bottom: 0, width: '80px', 
        background: '#0F172A', display: 'flex', flexDirection: 'column', 
        alignItems: 'center', padding: '2rem 0', gap: '2.5rem', zIndex: 100 
      }}>
        <div style={{ background: '#1D4ED8', padding: '0.75rem', borderRadius: '12px', color: 'white' }}><BrainCircuit size={28} /></div>
        <div onClick={() => setActiveTab('dashboard')} style={{ cursor: 'pointer', color: activeTab === 'dashboard' ? 'white' : '#64748B', transition: '0.3s' }}><LayoutDashboard size={24} /></div>
        <div onClick={() => setActiveTab('assessment')} style={{ cursor: 'pointer', color: activeTab === 'assessment' ? 'white' : '#64748B', transition: '0.3s' }}><Activity size={24} /></div>
        <div onClick={() => setActiveTab('cilt')} style={{ cursor: 'pointer', color: activeTab === 'cilt' ? 'white' : '#64748B', transition: '0.3s' }}><Mic size={24} /></div>
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
          <Settings size={20} color="#64748B" />
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#64748B', border: '2px solid white' }} />
        </div>
      </nav>

      {/* Fluid Main Content Area */}
      <main style={{ marginLeft: '80px', padding: '2rem 3rem', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <AnimatePresence mode="wait">
            
            {/* 1. DASHBOARD */}
            {activeTab === 'dashboard' && (
              <motion.div key="dash" {...fadeIn}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
                  <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#0F172A' }}>Clinical Dashboard</h1>
                    <p style={{ color: '#64748B', fontSize: '1.1rem' }}>VerbalBridge Neural Pilot — <span style={{ fontWeight: 700, color: '#1D4ED8' }}>Ready for Session</span></p>
                  </div>
                  <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                      <div style={{ textAlign: 'right' }}>
                          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', letterSpacing: '1px' }}>SYSTEM STATUS</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end' }}>
                              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }} />
                              <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#10B981' }}>Connected</p>
                          </div>
                      </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                  <div className="card-clinical" onClick={() => setActiveTab('assessment')}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <div style={{ padding: '0.75rem', background: '#F1F5F9', borderRadius: '10px' }}><Activity color="#0F172A" /></div>
                        <ChevronRight size={18} color="#94A3B8" />
                    </div>
                    <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>Aphasia Profile</h3>
                    <p style={{ fontSize: '0.9rem', color: '#64748B', lineHeight: '1.5' }}>WAB-R Assessment logic and real-time clinical taxonomic profiling.</p>
                  </div>

                  <div className="card-clinical" onClick={() => setActiveTab('cilt')}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <div style={{ padding: '0.75rem', background: '#FEF3C7', borderRadius: '10px' }}><Mic color="#D97706" /></div>
                        <ChevronRight size={18} color="#94A3B8" />
                    </div>
                    <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>Speech Regeneration</h3>
                    <p style={{ fontSize: '0.9rem', color: '#64748B', lineHeight: '1.5' }}>CILT enforced verbal module with multi-syllabic regeneration logic.</p>
                  </div>

                  <div className="card-clinical">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <div style={{ padding: '0.75rem', background: '#F0FDF4', borderRadius: '10px' }}><BrainCircuit color="#16A34A" /></div>
                        <ChevronRight size={18} color="#94A3B8" />
                    </div>
                    <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>Adaptive Cueing</h3>
                    <p style={{ fontSize: '0.9rem', color: '#64748B', lineHeight: '1.5' }}>Progressive semantic-phonological hierarchy for autonomous recovery.</p>
                  </div>
                </div>

                <div style={{ background: 'white', padding: '2.5rem', borderRadius: '24px', border: '1px solid #E2E8F0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                      <div style={{ background: '#FFF7ED', padding: '0.5rem', borderRadius: '8px' }}><Zap size={20} color="#F59E0B" fill="#F59E0B" /></div>
                      <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Neural Insight Engine</h3>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
                      <div style={{ padding: '1.5rem', background: '#F8FAFC', borderRadius: '20px', border: '1px solid #F1F5F9' }}>
                        <p style={{ fontSize: '0.75rem', color: '#94A3B8', marginBottom: '0.75rem', fontWeight: 800, letterSpacing: '0.5px' }}>RECOVERY TREND</p>
                        <p style={{ fontSize: '1.1rem', fontWeight: 600, color: '#334155', lineHeight: '1.6' }}>Patient shows 22% improvement in spontaneous fluency. Latency reduced to 1.4s.</p>
                      </div>
                      <div style={{ padding: '1.5rem', background: '#F8FAFC', borderRadius: '20px', border: '1px solid #F1F5F9' }}>
                        <p style={{ fontSize: '0.75rem', color: '#94A3B8', marginBottom: '0.75rem', fontWeight: 800, letterSpacing: '0.5px' }}>CLINICAL GUIDANCE</p>
                        <p style={{ fontSize: '1.1rem', fontWeight: 600, color: '#334155', lineHeight: '1.6' }}>Increase CILT intensity. Transition to multi-clause sentence regeneration.</p>
                      </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 2. ASSESSMENT */}
            {activeTab === 'assessment' && (
              <motion.div key="assessment" {...fadeIn}>
                <div style={{ marginBottom: '3.5rem' }}>
                  <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0F172A' }}>Core Assessment</h1>
                  <p style={{ color: '#64748B', fontSize: '1.1rem' }}>WAB-R Clinical Taxonomy & AQ Profiling</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '3rem', alignItems: 'start' }}>
                  <div style={{ background: 'white', padding: '3rem', borderRadius: '32px', border: '1px solid #E2E8F0', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05)' }}>
                    {[
                      { key: 'f', label: 'Fluency' },
                      { key: 'c', label: 'Comprehension' },
                      { key: 'r', label: 'Repetition' },
                      { key: 'n', label: 'Naming' },
                    ].map(item => (
                      <div key={item.key} style={{ marginBottom: '2.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', alignItems: 'center' }}>
                          <label style={{ fontWeight: 800, fontSize: '0.9rem', color: '#475569', letterSpacing: '0.5px' }}>{item.label.toUpperCase()}</label>
                          <span style={{ fontWeight: 800, color: '#1D4ED8', fontSize: '1.25rem' }}>{scores[item.key].toFixed(1)}</span>
                        </div>
                        <input 
                          type="range" min="0" max="10" step="0.1" 
                          value={scores[item.key]} 
                          onChange={(e) => setScores({...scores, [item.key]: parseFloat(e.target.value)})} 
                          style={{ accentColor: '#1D4ED8' }}
                        />
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div style={{ background: '#0F172A', color: 'white', padding: '3rem', borderRadius: '32px', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(15,23,42,0.3)' }}>
                        <p style={{ fontSize: '0.85rem', opacity: 0.6, fontWeight: 700, letterSpacing: '2px', marginBottom: '1rem' }}>APHASIA QUOTIENT</p>
                        <h2 style={{ fontSize: '5rem', fontWeight: 800, margin: '0', color: '#FFFFFF' }}>{result.aq.toFixed(1)}</h2>
                        <div style={{ background: result.color + '22', border: '1px solid ' + result.color, padding: '0.75rem', borderRadius: '12px', marginTop: '1.5rem' }}>
                          <span style={{ color: result.color, fontWeight: 900, fontSize: '0.9rem' }}>{result.type.toUpperCase()}</span>
                        </div>
                    </div>
                    <div style={{ background: 'white', padding: '2rem', borderRadius: '32px', border: '1px solid #E2E8F0' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem' }}>
                          <Info size={18} color="#64748B" />
                          <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#64748B', letterSpacing: '1px' }}>CLINICAL NOTES</span>
                        </div>
                        <p style={{ fontSize: '1rem', lineHeight: '1.6', color: '#334155', fontWeight: 500 }}>{result.desc}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 3. CILT REGEN */}
            {activeTab === 'cilt' && (
              <motion.div key="cilt" {...fadeIn} style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                <div style={{ marginBottom: '3.5rem' }}>
                  <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0F172A' }}>Speech Regeneration</h1>
                  <p style={{ color: '#64748B', fontSize: '1.1rem' }}>Simulation: CILT Intensive Protocol</p>
                </div>

                <div style={{ 
                  background: 'white', padding: '4rem', borderRadius: '40px', 
                  boxShadow: '0 40px 80px -20px rgba(0,0,0,0.08)', border: '1px solid #E2E8F0', 
                  position: 'relative'
                }}>
                    <AnimatePresence mode="wait">
                      {regenStatus === 'idle' && (
                        <motion.div key="s1" {...scaleUp}>
                          <div style={{ 
                            width: '180px', height: '180px', background: '#F8FAFC', 
                            borderRadius: '50px', margin: '0 auto 3rem', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: '1px solid #F1F5F9'
                          }}>
                            <Volume2 size={80} color="#CBD5E1" />
                          </div>
                          <p style={{ color: '#94A3B8', marginBottom: '0.75rem', fontWeight: 800, letterSpacing: '1px' }}>TARGET STIMULUS</p>
                          <h2 style={{ fontSize: '4.5rem', fontWeight: 900, color: '#0F172A', marginBottom: '4rem', letterSpacing: '-0.02em' }}>"WATER"</h2>
                          
                          <button 
                            onMouseDown={() => setIsRecording(true)} 
                            onMouseUp={() => { setIsRecording(false); setRegenStatus('processing'); setTimeout(() => setRegenStatus('done'), 3000); }}
                            style={{ 
                              background: isRecording ? '#EF4444' : '#1D4ED8', 
                              width: '110px', height: '110px', borderRadius: '50%', 
                              border: 'none', cursor: 'pointer', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                              boxShadow: isRecording ? '0 0 60px rgba(239,68,68,0.5)' : '0 20px 40px rgba(29,78,216,0.3)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto',
                              transform: isRecording ? 'scale(1.15)' : 'scale(1)'
                            }}
                          >
                            <Mic color="white" size={40} />
                          </button>
                          <p style={{ marginTop: '2rem', color: isRecording ? '#EF4444' : '#64748B', fontWeight: 800, letterSpacing: '0.5px' }}>{isRecording ? 'CAPTURING NEURAL INPUT...' : 'HOLD TO START SPEECH SESSION'}</p>
                        </motion.div>
                      )}

                      {regenStatus === 'processing' && (
                        <motion.div key="s2" {...scaleUp} style={{ padding: '6rem 0' }}>
                          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '3rem' }}>
                              {[1,2,3,4,5,6].map(i => (
                                <motion.div 
                                  key={i}
                                  animate={{ height: [30, 90, 30] }}
                                  transition={{ repeat: Infinity, duration: 0.7, delay: i*0.12 }}
                                  style={{ width: '8px', background: '#1D4ED8', borderRadius: '20px' }}
                                  />
                              ))}
                          </div>
                          <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem' }}>AI Processing Engine</h3>
                          <p style={{ color: '#64748B', fontSize: '1.1rem' }}>Generating linguistic bridges via Saaras pipeline...</p>
                        </motion.div>
                      )}

                      {regenStatus === 'done' && (
                        <motion.div key="s3" {...scaleUp}>
                          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem' }}>
                              <div style={{ background: '#F0FDF4', padding: '1.25rem', borderRadius: '24px', color: '#16A34A' }}>
                                <CheckCircle2 size={56} />
                              </div>
                          </div>
                          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1.5rem' }}>Speech Successfully Regenerated</h2>
                          <div style={{ background: '#F8FAFC', padding: '2rem', borderRadius: '24px', marginBottom: '3rem', border: '1px dashed #CBD5E1' }}>
                              <p style={{ fontSize: '1.4rem', fontWeight: 600, color: '#64748B' }}>Patient Attempt: "wa... ter..."</p>
                              <div style={{ height: '1px', background: '#E2E8F0', margin: '1.5rem 0' }} />
                              <p style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1D4ED8' }}>AI Output: "I need some water."</p>
                          </div>
                          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
                              <button className="btn-primary" style={{ padding: '1.25rem 2.5rem' }}><Play size={24} /> PLAY OUTPUT</button>
                              <button className="btn-primary" style={{ background: '#0D9488', padding: '1.25rem 2.5rem' }}><Sparkles size={24} /> CLINICAL (0.7X)</button>
                          </div>
                          <button onClick={() => setRegenStatus('idle')} style={{ marginTop: '3.5rem', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '3.5rem auto 0', fontWeight: 700 }}>
                              <RotateCcw size={18} /> START NEXT TRIAL
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>

      <footer style={{ 
        position: 'fixed', bottom: 0, right: 0, 
        padding: '2rem 4rem', color: '#CBD5E1', 
        fontSize: '0.8rem', fontWeight: 800, letterSpacing: '1px'
      }}>
         VERBALBRIDGE CLINICAL PILOT v1.0.4 — [SECURE SESSION]
      </footer>
    </div>
  );
}
