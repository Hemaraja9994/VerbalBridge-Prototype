import React, { useMemo, useState } from 'react';
import { UI } from '../i18n/ui';
import { getStimuli } from '../data/stimuli';
import type { CueLevel, LangCode, Outcome, SessionEntry } from '../types';

interface Props {
  lang: LangCode;
  onComplete: (entries: SessionEntry[]) => void;
  onBack: () => void;
  speak: (text: string, rate?: number) => void;
}

const CUE_ORDER: CueLevel[] = ['unaided', 'semantic', 'phonological', 'model'];

const CueingHierarchy: React.FC<Props> = ({ lang, onComplete, onBack, speak }) => {
  const t = UI[lang];
  const items = useMemo(() => getStimuli(lang).items, [lang]);
  const [index, setIndex] = useState(0);
  const [entries, setEntries] = useState<SessionEntry[]>([]);
  const [cueStep, setCueStep] = useState(0); // 0 = unaided (no cue shown yet)

  const current = items[index];
  const isLast = index === items.length - 1;
  const currentCueLevel: CueLevel = CUE_ORDER[cueStep];

  const giveNextCue = () => {
    if (cueStep < CUE_ORDER.length - 1) {
      const nextStep = cueStep + 1;
      setCueStep(nextStep);
      const nextLevel = CUE_ORDER[nextStep];
      if (nextLevel === 'semantic') speak(current.semanticCue);
      else if (nextLevel === 'phonological') speak(current.phonologicalCue);
      else if (nextLevel === 'model') speak(current.word, 0.7);
    }
  };

  const handleOutcome = (outcome: Outcome) => {
    const entry: SessionEntry = {
      itemId: current.id,
      word: current.word,
      module: 'cueing',
      cueLevel: currentCueLevel,
      outcome,
      timestamp: Date.now(),
    };
    const next = [...entries, entry];
    setEntries(next);
    setCueStep(0);
    if (isLast) {
      onComplete(next);
    } else {
      setIndex(index + 1);
    }
  };

  return (
    <section className="screen animate-fade-in therapy-session">
      <button className="back-btn" onClick={onBack}>
        ← {t.back}
      </button>

      <div className="progress-bar-container">
        <div
          className="progress-bar"
          style={{ width: `${((index + 1) / items.length) * 100}%` }}
        />
      </div>

      <div className="session-header">
        <h2>{t.cueing}</h2>
        <span className="item-counter">
          {index + 1} / {items.length}
        </span>
      </div>

      <div className="stimulus-card glass-card">
        <div className="stimulus-emoji" aria-hidden="true">
          {current.emoji}
        </div>

        {cueStep >= 1 && (
          <div className="cue-line cue-semantic">
            <span className="cue-label">💡 {t.semanticCue}</span>
            <p>{current.semanticCue}</p>
          </div>
        )}
        {cueStep >= 2 && (
          <div className="cue-line cue-phonological">
            <span className="cue-label">🔤 {t.phonologicalCue}</span>
            <p>{current.phonologicalCue}</p>
          </div>
        )}
        {cueStep >= 3 && (
          <div className="cue-line cue-model">
            <span className="cue-label">🎯 {t.modelCue}</span>
            <p className="cue-model-word">{current.word}</p>
          </div>
        )}

        <div className="cue-actions mt-lg">
          <button
            className="secondary"
            onClick={giveNextCue}
            disabled={cueStep >= CUE_ORDER.length - 1}
          >
            ➕ {t.giveCue}
          </button>
          <div className="cue-step-indicator">
            Level {cueStep} / 3
          </div>
        </div>
      </div>

      <div className="outcome-bar mt-lg">
        <button
          className="outcome-btn outcome-produced"
          onClick={() => handleOutcome('produced')}
        >
          ✅ {t.produced}
        </button>
        <button
          className="outcome-btn outcome-approx"
          onClick={() => handleOutcome('approximated')}
        >
          ➗ {t.approximated}
        </button>
        <button
          className="outcome-btn outcome-none"
          onClick={() => handleOutcome('not-attempted')}
        >
          ⭕ {t.notAttempted}
        </button>
      </div>
    </section>
  );
};

export default CueingHierarchy;
