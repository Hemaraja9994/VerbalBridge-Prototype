import React, { useState } from 'react';
import { Sliders, Languages, Shield, Clock } from 'lucide-react';

const ClinicalControls = () => {
  const [speed, setSpeed] = useState(1.0);
  const [pitch, setPitch] = useState(1.0);

  return (
    <div style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <Sliders size={20} color="var(--secondary)" />
          <h3 style={{ fontSize: '1.1rem' }}>Adaptive Playback</h3>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>Speech Rate</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--secondary)', fontWeight: 600 }}>{speed}x</span>
          </div>
          <input 
            type="range" 
            min="0.5" 
            max="2.0" 
            step="0.1" 
            value={speed} 
            onChange={(e) => setSpeed(e.target.value)}
            style={{ width: '100%', accentColor: 'var(--secondary)' }}
          />
        </div>

        <div style={{ marginBottom: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>Therapeutic Pitch</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--secondary)', fontWeight: 600 }}>{pitch}x</span>
          </div>
          <input 
            type="range" 
            min="0.5" 
            max="1.5" 
            step="0.05" 
            value={pitch} 
            onChange={(e) => setPitch(e.target.value)}
            style={{ width: '100%', accentColor: 'var(--secondary)' }}
          />
        </div>
      </div>

      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <Languages size={20} color="var(--secondary)" />
          <h3 style={{ fontSize: '1.1rem' }}>Regional Support</h3>
        </div>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {['English', 'Kannada', 'Hindi', 'Tamil', 'Telugu', 'Malayalam'].map(lang => (
            <button key={lang} style={{
              padding: '0.35rem 0.75rem',
              borderRadius: '6px',
              border: '1px solid var(--border)',
              background: lang === 'English' ? 'var(--secondary-soft)' : 'white',
              color: lang === 'English' ? 'var(--secondary)' : 'var(--text-muted)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}>
              {lang}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card" style={{ padding: '1.5rem', background: 'var(--primary)', color: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <Shield size={20} color="#10B981" />
          <h3 style={{ fontSize: '1.1rem', color: 'white' }}>DPDP Compliant</h3>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', lineHeight: '1.4' }}>
          End-to-end encrypted sessions. No audio data is stored after regeneration.
        </p>
      </div>

      <div style={{ padding: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', color: 'var(--text-light)', fontSize: '0.8rem' }}>
          <Clock size={14} />
          <span>Last clinical sync: 2 min ago</span>
        </div>
      </div>
    </div>
  );
};

export default ClinicalControls;
