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
    icon: '🎙️',
    title: 'Familiar Voice Bank',
    desc: 'Caregivers record words in their own voice — stronger than synthetic TTS.',
  },
  {
    icon: '✋',
    title: 'Gesture Therapy',
    desc: 'Pair every word with a gesture — vital for global & severe aphasia.',
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
