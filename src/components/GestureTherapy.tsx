import React, { useMemo, useState } from 'react';
import { UI } from '../i18n/ui';
import { getStimuli } from '../data/stimuli';
import { useFamiliarVoice } from '../hooks/useFamiliarVoice';
import { useRecognition, type AsrResult } from '../hooks/useRecognition';
import { recordCueOutcome } from '../lib/adaptiveEngine';
import type { LangCode, Outcome, SessionEntry } from '../types';

interface Props {
  lang: LangCode;
  onComplete: (entries: SessionEntry[]) => void;
  onBack: () => void;
}

/**
 * Gesture-Verbal Pairing Therapy — pairs a target word with a gesture cue.
 *
 * Especially useful for global aphasia and severe Broca's aphasia where
 * gestural facilitation (Pace Therapy, Communicative Drawing) restores access
 * to the verbal-motor loop. Pulvermüller's mirror-neuron framing: enacting the
 * gesture co-activates motor cortex regions adjacent to Broca's area.
 *
 * Flow per item:
 *   1. Show picture + gesture description
 *   2. Therapist demonstrates gesture; patient mimics
 *   3. Listen to model word (familiar voice if available)
 *   4. Patient attempts the word *while* performing the gesture
 *   5. SLP records outcome
 */
const GestureTherapy: React.FC<Props> = ({ lang, onComplete, onBack }) => {
  const t = UI[lang];
  const items = useMemo(() => getStimuli(lang).items, [lang]);
  const { speakItem, lastSource } = useFamiliarVoice(lang);
  const { listen, listening, supported: asrSupported } = useRecognition(lang);
  const [index, setIndex] = useState(0);
  const [entries, setEntries] = useState<SessionEntry[]>([]);
  const [heardModel, setHeardModel] = useState(false);
  const [asrResult, setAsrResult] = useState<AsrResult | null>(null);

  const current = items[index];
  const isLast = index === items.length - 1;

  const handleListen = async () => {
    await speakItem(current.id, current.word, 0.7);
    setHeardModel(true);
  };

  const advanceWith = (entry: SessionEntry) => {
    if (entry.outcome !== 'not-attempted') {
      recordCueOutcome(current.id, entry.cueLevel);
    }
    const next = [...entries, entry];
    setEntries(next);
    setHeardModel(false);
    setAsrResult(null);
    if (isLast) {
      onComplete(next);
    } else {
      setIndex(index + 1);
    }
  };

  const buildEntry = (
    outcome: Outcome,
    extras: Partial<SessionEntry> = {}
  ): SessionEntry => ({
    itemId: current.id,
    word: current.word,
    module: 'gesture',
    cueLevel: heardModel ? 'model' : 'gesture',
    outcome,
    voiceSource: heardModel ? lastSource() : undefined,
    timestamp: Date.now(),
    ...extras,
  });

  const handleOutcome = (outcome: Outcome) => {
    advanceWith(buildEntry(outcome));
  };

  const handleYourTurn = async () => {
    setAsrResult(null);
    const r = await listen(current.word, 5500);
    setAsrResult(r);
    const entry = buildEntry(r.score, {
      autoGraded: true,
      transcript: r.transcript,
      asrConfidence: r.confidence,
      editDistance: r.distance >= 0 ? r.distance : undefined,
    });
    setTimeout(() => advanceWith(entry), 1400);
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
        <h2>✋ {t.gesture}</h2>
        <span className="item-counter">
          {index + 1} / {items.length}
        </span>
      </div>

      <div className="stimulus-card glass-card">
        <div className="gesture-pair">
          <div className="gesture-side">
            <span className="gesture-side-label">{t.lookAndSay}</span>
            <div className="stimulus-emoji" aria-hidden="true">
              {current.emoji}
            </div>
          </div>
          <div className="gesture-divider">+</div>
          <div className="gesture-side">
            <span className="gesture-side-label">{t.doGesture}</span>
            <div className="stimulus-emoji gesture-emoji" aria-hidden="true">
              {current.gestureEmoji}
            </div>
          </div>
        </div>

        <div className="cue-line cue-gesture mt-md">
          <span className="cue-label">✋ {t.gestureCue}</span>
          <p>{current.gesture}</p>
        </div>

        <div className="stimulus-word mt-md">{current.word}</div>
        {current.translit && (
          <div className="stimulus-translit">/{current.translit}/</div>
        )}

        <div className="cilt-action-row mt-lg">
          <button className="primary listen-btn" onClick={handleListen} disabled={listening}>
            🔊 {t.listenWhileGesturing}
          </button>
          {asrSupported && (
            <button
              className={`primary asr-btn ${listening ? 'listening' : ''}`}
              onClick={handleYourTurn}
              disabled={listening || !!asrResult}
            >
              {listening ? `🎤 ${t.listening}` : `🎤 ${t.yourTurn}`}
            </button>
          )}
        </div>

        {asrResult && (
          <div className={`asr-result asr-${asrResult.score}`}>
            <div className="asr-label">🤖 {t.aiHeard}</div>
            <div className="asr-transcript">
              {asrResult.transcript ? `"${asrResult.transcript}"` : t.noSpeechDetected}
            </div>
            {asrResult.transcript && (
              <div className="asr-meta">
                {t.editDistance}: {asrResult.distance} ·
                {' '}{t.confidence}: {(asrResult.confidence * 100).toFixed(0)}%
              </div>
            )}
          </div>
        )}

        <p className="instruction mt-md">{t.gesturePairInstruction}</p>
      </div>

      <div className="outcome-bar mt-lg">
        <button
          className="outcome-btn outcome-produced"
          onClick={() => handleOutcome('produced')}
          disabled={listening || !!asrResult}
        >
          ✅ {t.produced}
        </button>
        <button
          className="outcome-btn outcome-approx"
          onClick={() => handleOutcome('approximated')}
          disabled={listening || !!asrResult}
        >
          ➗ {t.approximated}
        </button>
        <button
          className="outcome-btn outcome-none"
          onClick={() => handleOutcome('not-attempted')}
          disabled={listening || !!asrResult}
        >
          ⭕ {t.notAttempted}
        </button>
      </div>
    </section>
  );
};

export default GestureTherapy;
