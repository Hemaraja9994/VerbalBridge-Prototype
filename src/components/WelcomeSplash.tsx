import React from 'react';

interface Props {
  onStart: () => void;
}

const PILLARS = [
  {
    icon: '🧠',
    title: 'Speech Regeneration',
    desc: 'Neuroplasticity-based therapy via CILT and cueing hierarchy.',
  },
  {
    icon: '🌐',
    title: 'Mother-tongue Therapy',
    desc: 'Therapy delivered in 6 Indian languages — not English-only.',
  },
  {
    icon: '🩺',
    title: 'SLP-Guided Workflow',
    desc: 'Structured drills with cue-level logging for clinical review.',
  },
  {
    icon: '🔮',
    title: 'Future: Voice + Gesture',
    desc: 'Voice cloning for familiar models, gesture cues for global aphasia.',
  },
];

const WelcomeSplash: React.FC<Props> = ({ onStart }) => {
  return (
    <section className="welcome-screen">
      <span className="welcome-eyebrow">AIISH Hack'A'Comm 2026 · Mysore</span>

      <h1 className="welcome-title">Rebuild speech in the language of home.</h1>

      <p className="welcome-mission">
        VerbalBridge is an AI-assisted, neuroplasticity-based speech regeneration
        platform for persons with aphasia — guided by Speech-Language Pathologists
        and delivered in the patient's mother tongue.
      </p>

      <div className="welcome-cta">
        <button className="primary" onClick={onStart}>
          Begin therapy session →
        </button>
      </div>

      <div className="welcome-pillars">
        {PILLARS.map((p) => (
          <div key={p.title} className="glass-card pillar-card">
            <div className="pillar-icon">{p.icon}</div>
            <div className="pillar-title">{p.title}</div>
            <div className="pillar-desc">{p.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WelcomeSplash;
