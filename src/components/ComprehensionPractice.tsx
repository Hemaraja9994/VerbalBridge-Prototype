import React, { useEffect, useMemo, useState } from 'react';
import { UI } from '../i18n/ui';
import { getStimuli } from '../data/stimuli';
import { useFamiliarVoice } from '../hooks/useFamiliarVoice';
import type { LangCode, Outcome, SessionEntry } from '../types';

interface Props {
  lang: LangCode;
  onComplete: (entries: SessionEntry[]) => void;
  onBack: () => void;
}

const shuffle = <T,>(arr: T[]): T[] => {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

const ComprehensionPractice: React.FC<Props> = ({ lang, onComplete, onBack }) => {
  const t = UI[lang];
  const items = useMemo(() => getStimuli(lang).items, [lang]);
  const { speakItem, lastSource } = useFamiliarVoice(lang);
  const [index, setIndex] = useState(0);
  const [entries, setEntries] = useState<SessionEntry[]>([]);
  const [options, setOptions] = useState<string[]>([]);
  const [chosen, setChosen] = useState<string | null>(null);
  const [listened, setListened] = useState(false);

  const current = items[index];
  const isLast = index === items.length - 1;

  useEffect(() => {
    const distractors = (current.distractorEmojis || []).slice(0, 3);
    setOptions(shuffle([current.emoji, ...distractors]));
    setChosen(null);
    setListened(false);
  }, [current]);

  const handleListen = async () => {
    await speakItem(current.id, current.word, 0.75);
    setListened(true);
  };

  const recordAndAdvance = (outcome: Outcome) => {
    const entry: SessionEntry = {
      itemId: current.id,
      word: current.word,
      module: 'comprehension',
      cueLevel: listened ? 'model' : 'unaided',
      outcome,
      voiceSource: listened ? lastSource() : undefined,
      timestamp: Date.now(),
    };
    const next = [...entries, entry];
    setEntries(next);
    if (isLast) {
      onComplete(next);
    } else {
      setIndex(index + 1);
    }
  };

  const handlePick = (emoji: string) => {
    if (chosen) return;
    setChosen(emoji);
    const outcome: Outcome = emoji === current.emoji ? 'produced' : 'approximated';
    setTimeout(() => recordAndAdvance(outcome), 700);
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
        <h2>{t.comprehension}</h2>
        <span className="item-counter">
          {index + 1} / {items.length}
        </span>
      </div>

      <div className="comprehension-prompt glass-card">
        <button className="primary listen-btn-lg" onClick={handleListen}>
          🔊 {t.listen}
        </button>
        <p className="instruction mt-md">{t.pickPicture}</p>
      </div>

      <div className="comprehension-grid mt-lg">
        {options.map((em) => {
          const isCorrect = em === current.emoji;
          const state =
            chosen === em ? (isCorrect ? 'correct' : 'wrong') : '';
          return (
            <button
              key={em}
              className={`glass-card comp-option ${state}`}
              onClick={() => handlePick(em)}
              disabled={!!chosen}
            >
              <span className="comp-emoji">{em}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default ComprehensionPractice;
