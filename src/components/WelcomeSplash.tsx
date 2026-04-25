import React from 'react';

interface Props {
  onStart: () => void;
}

const PILLARS = [
  {
    icon: '🤖',
    title: 'AI Speech Recognition',
    desc: 'On-device ASR transcribes each attempt and auto-grades it against the target.',
  },
  {
    icon: '🧠',
    title: 'Adaptive Cueing Engine',
    desc: 'Learns which cue depth each item needs and personalises the starting rung.',
  },
  {
    icon: '🌐',
    title: 'Mother-tongue Therapy',
    desc: 'CILT, cueing, comprehension & gesture in 6 Indian languages.',
  },
  {
    icon: '🎙️',
    title: 'Familiar Voice + Gesture',
    desc: 'Caregivers record voices; gesture cues recruit motor cortex pathways.',
  },
];

const WelcomeSplash: React.FC<Props> = ({ onStart }) => {
  return (
    <section className="welcome-screen">
      <span className="welcome-eyebrow">AIISH Hack'A'Comm 2026 · Problem Statement 3</span>

      <h1 className="welcome-title">Rebuild speech in the language of home.</h1>

      <p className="welcome-mission">
        VerbalBridge is an <b>AI-driven</b>, neuroplasticity-based speech regeneration
        platform for persons with aphasia. Speech recognition grades each attempt,
        an adaptive engine personalises cue depth, and therapy is delivered
        in the patient's mother tongue.
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
