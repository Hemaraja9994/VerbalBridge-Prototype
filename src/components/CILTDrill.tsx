import React, { useMemo, useState } from 'react';
import { UI } from '../i18n/ui';
import { getStimuli } from '../data/stimuli';
import { useFamiliarVoice } from '../hooks/useFamiliarVoice';
import type { LangCode, Outcome, SessionEntry, VoiceSource } from '../types';

interface Props {
  lang: LangCode;
  onComplete: (entries: SessionEntry[]) => void;
  onBack: () => void;
}

const CILTDrill: React.FC<Props> = ({ lang, onComplete, onBack }) => {
  const t = UI[lang];
  const items = useMemo(() => getStimuli(lang).items, [lang]);
  const { speakItem, lastSource } = useFamiliarVoice(lang);
  const [index, setIndex] = useState(0);
  const [entries, setEntries] = useState<SessionEntry[]>([]);
  const [listened, setListened] = useState(false);
  const [usedSource, setUsedSource] = useState<VoiceSource>('none');

  const current = items[index];
  const isLast = index === items.length - 1;

  const handleListen = async () => {
    const src = await speakItem(current.id, current.word, 0.75);
    setUsedSource(src);
    setListened(true);
  };

  const handleOutcome = (outcome: Outcome) => {
    const entry: SessionEntry = {
      itemId: current.id,
      word: current.word,
      module: 'cilt',
      cueLevel: listened ? 'model' : 'unaided',
      outcome,
      voiceSource: listened ? lastSource() : undefined,
      timestamp: Date.now(),
    };
    const next = [...entries, entry];
    setEntries(next);
    setListened(false);
    setUsedSource('none');
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
        <h2>{t.cilt}</h2>
        <span className="item-counter">
          {index + 1} / {items.length}
        </span>
      </div>

      <div className="stimulus-card glass-card">
        <div className="stimulus-emoji" aria-hidden="true">
          {current.emoji}
        </div>
        <div className="stimulus-word">{current.word}</div>
        {current.translit && (
          <div className="stimulus-translit">/{current.translit}/</div>
        )}

        <button className="primary listen-btn mt-lg" onClick={handleListen}>
          🔊 {t.listen}
        </button>

        {listened && usedSource === 'familiar' && (
          <div className="voice-source-badge familiar">
            ❤️ {t.playedFamiliarVoice}
          </div>
        )}
        {listened && usedSource === 'tts' && (
          <div className="voice-source-badge tts">
            🤖 {t.playedTtsVoice}
          </div>
        )}

        <p className="instruction mt-md">
          Look at the picture. Listen. Say the word aloud.
        </p>
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

export default CILTDrill;
