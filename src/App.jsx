import React, { useState } from 'react';
import { 
  Activity, 
  Mic, 
  Play, 
  Settings, 
  User, 
  BrainCircuit, 
  History, 
  BookOpen, 
  ChevronRight,
  Volume2,
  Sparkles,
  ShieldCheck,
  Languages,
  LayoutDashboard
} from 'lucide-react';

// --- Logic Layer (Aphasia Engine Mock) ---
const calculateAQ = (f, c, r, n) => {
  const aq = (f + c + r + n) * 2.5;
  let type = "Undefined";
  let description = "Evaluating metrics...";

  if (aq < 25) {
    type = "Global Aphasia";
    description = "Severe deficits across all communication modalities.";
  } else if (f < 5 && c >= 5) {
    type = "Broca's Aphasia";
    description = "Motor speech deficits and agrammatism. Comprehension preserved.";
  } else if (f >= 5 && c < 5) {
    type = "Wernicke's Aphasia";
    description = "Fluent but paraphasic speech with significant deficits.";
  } else if (r < 5) {
    type = "Conduction Aphasia";
    description = "Primary deficit in repetition. Fluency/Comprehension good.";
  } else {
    type = "Anomic Aphasia";
    description = "Primary deficit in word retrieval (naming).";
  }

  return { aq, type, description };
};

// --- Components ---

const Navbar = () => (
  <nav style={{ padding: '1rem 2rem', background: '#1A237E', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <BrainCircuit size={28} />
      <h2 style={{ fontSize: '1.25rem', letterSpacing: '1px' }}>VERBALBRIDGE</h2>
    </div>
    <div style={{ display: 'flex', gap: '1.5rem' }}>
      <LayoutDashboard size={20} />
      <Settings size={20} />
      <User size={20} />
    </div>
  </nav>
);

const Dashboard = ({ onNavigate }) => (
  <div style={{ padding: '2rem' }}>
    <div style={{ background: '#1A237E', color: 'white', padding: '2rem', borderRadius: '15px', marginBottom: '2rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Clinician Portal</h1>
      <p style={{ color: '#E0E0E0' }}>Assessment & AI Speech Regeneration Dashboard</p>
    </div>

    <div style={{ display: 'grid', gap: '1rem' }}>
      <div onClick={() => onNavigate('assessment')} style={{ padding: '1.5rem', background: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <div style={{ background: '#E8EAF6', padding: '1rem', borderRadius: '10px', marginRight: '1rem' }}><Activity color="#1A237E" /></div>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: 0 }}>Aphasia Profile</h3>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>WAB-R Assessment & Scoring</p>
        </div>
        <ChevronRight color="#FF6D00" />
      </div>

      <div onClick={() => onNavigate('cilt')} style={{ padding: '1.5rem', background: 'white', borderRadius: '12px', display: 'flex', alignItems: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <div style={{ background: '#FFF3E0', padding: '1rem', borderRadius: '10px', marginRight: '1rem' }}><Mic color="#FF6D00" /></div>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: 0 }}>Speech Regeneration</h3>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>CILT Verbatim Module</p>
        </div>
        <ChevronRight color="#FF6D00" />
      </div>
    </div>
  </div>
);

const AssessmentScreen = ({ onBack }) => {
  const [f, setF] = useState(5);
  const [c, setC] = useState(5);
  const [r, setR] = useState(5);
  const [n, setN] = useState(5);
  
  const result = calculateAQ(f, c, r, n);

  return (
    <div style={{ padding: '2rem' }}>
      <button onClick={onBack} style={{ border: 'none', background: 'none', color: '#1A237E', fontWeight: 'bold', marginBottom: '1rem', cursor: 'pointer' }}>← BACK</button>
      <h2 style={{ marginBottom: '2rem' }}>WAB-R Clinical Assessment</h2>
      
      {[
        { label: 'Fluency', val: f, set: setF },
        { label: 'Comprehension', val: c, set: setC },
        { label: 'Repetition', val: r, set: setR },
        { label: 'Naming', val: n, set: setN },
      ].map(row => (
        <div key={row.label} style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontWeight: 'bold' }}>{row.label}</span>
            <span style={{ color: '#1A237E', fontWeight: 'bold' }}>{row.val}</span>
          </div>
          <input type="range" min="0" max="10" step="0.1" value={row.val} onChange={(e) => row.set(parseFloat(e.target.value))} style={{ width: '100%', accentColor: '#1A237E' }} />
        </div>
      ))}

      <div style={{ marginTop: '3rem', background: '#1A237E', color: 'white', padding: '2rem', borderRadius: '15px', textAlign: 'center' }}>
        <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>CALCULATED RESULT</p>
        <h2 style={{ fontSize: '3rem', margin: '0.5rem 0' }}>AQ: {result.aq.toFixed(1)}</h2>
        <h3 style={{ color: '#FF6D00', letterSpacing: '1px' }}>{result.type.toUpperCase()}</h3>
        <p style={{ fontSize: '0.85rem', opacity: 0.9, marginTop: '1rem' }}>{result.description}</p>
      </div>
    </div>
  );
};

const CiltScreen = ({ onBack }) => (
  <div style={{ padding: '1.5rem', textAlign: 'center' }}>
    <button onClick={onBack} style={{ position: 'absolute', left: '2rem', top: '6rem', border: 'none', background: 'none', color: '#1A237E', fontWeight: 'bold', cursor: 'pointer' }}>← BACK</button>
    <div style={{ height: '240px', background: '#F5F5F5', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '4rem 0 2rem' }}>
      <Volume2 size={80} color="#CCC" />
    </div>
    <p style={{ color: '#666' }}>Clinical Instruction: Say the word</p>
    <h1 style={{ fontSize: '3.5rem', color: '#1A237E', margin: '0.5rem 0 3rem' }}>"WATER"</h1>
    
    <button style={{ background: '#FF6D00', color: 'white', border: 'none', padding: '1.5rem 3rem', borderRadius: '50px', fontSize: '1.1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '1rem', margin: '0 auto', cursor: 'pointer', boxShadow: '0 4px 15px rgba(255,109,0,0.3)' }}>
      <Mic size={24} /> TAP TO RECORD
    </button>
    
    <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center', gap: '2rem', color: '#666', fontSize: '0.85rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Languages size={16} /> Regional Support</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ShieldCheck size={16} /> DPDP Act Compliant</div>
    </div>
  </div>
);

export default function App() {
  const [screen, setScreen] = useState('dashboard');

  return (
    <div style={{ maxWidth: '450px', margin: '0 auto', background: '#FAFAFA', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      <Navbar />
      {screen === 'dashboard' && <Dashboard onNavigate={setScreen} />}
      {screen === 'assessment' && <AssessmentScreen onBack={() => setScreen('dashboard')} />}
      {screen === 'cilt' && <CiltScreen onBack={() => setScreen('dashboard')} />}
      
      <footer style={{ position: 'fixed', bottom: 0, width: '450px', padding: '1rem', textAlign: 'center', color: '#BBB', fontSize: '0.75rem' }}>
        VerbalBridge Clinical Prototype v1.0 • AIISH Hackathon
      </footer>
    </div>
  );
}
