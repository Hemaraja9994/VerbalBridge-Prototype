import React, { useMemo, useState } from 'react';
import { UI } from '../i18n/ui';
import { getStimuli } from '../data/stimuli';
import { useFamiliarVoice } from '../hooks/useFamiliarVoice';
import { useRecognition, type AsrResult } from '../hooks/useRecognition';
import { recordCueOutcome } from '../lib/adaptiveEngine';
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
  const { listen, listening, supported: asrSupported } = useRecognition(lang);
  const [index, setIndex] = useState(0);
  const [entries, setEntries] = useState<SessionEntry[]>([]);
  const [listened, setListened] = useState(false);
  const [usedSource, setUsedSource] = useState<VoiceSource>('none');
  const [asrResult, setAsrResult] = useState<AsrResult | null>(null);

  const current = items[index];
  const isLast = index === items.length - 1;

  const handleListen = async () => {
    const src = await speakItem(current.id, current.word, 0.75);
    setUsedSource(src);
    setListened(true);
  };

  const advance = (entry: SessionEntry) => {
    const next = [...entries, entry];
    setEntries(next);
    setListened(false);
    setUsedSource('none');
    setAsrResult(null);
    if (isLast) {
      onComplete(next);
    } else {
      setIndex(index + 1);
    }
  };

  const recordEntry = (
    outcome: Outcome,
    extras: Partial<SessionEntry> = {}
  ): SessionEntry => ({
    itemId: current.id,
    word: current.word,
    module: 'cilt',
    cueLevel: listened ? 'model' : 'unaided',
    outcome,
    voiceSource: listened ? lastSource() : undefined,
    timestamp: Date.now(),
    ...extras,
  });

  const handleOutcome = (outcome: Outcome) => {
    const entry = recordEntry(outcome);
    if (outcome !== 'not-attempted') {
      recordCueOutcome(current.id, entry.cueLevel);
    }
    advance(entry);
  };

  const handleYourTurn = async () => {
    setAsrResult(null);
    const result = await listen(current.word, 5500);
    setAsrResult(result);
    // Auto-advance after a short pause so the SLP can see the transcription
    const entry = recordEntry(result.score, {
      autoGraded: true,
      transcript: result.transcript,
      asrConfidence: result.confidence,
      editDistance: result.distance >= 0 ? result.distance : undefined,
    });
    if (result.score !== 'not-attempted') {
      recordCueOutcome(current.id, entry.cueLevel);
    }
    setTimeout(() => advance(entry), 1400);
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

        <div className="cilt-action-row mt-lg">
          <button className="primary listen-btn" onClick={handleListen} disabled={listening}>
            🔊 {t.listen}
          </button>
          {asrSupported && (
            <button
              className={`primary asr-btn ${listening ? 'listening' : ''}`}
              onClick={handleYourTurn}
              disabled={listening}
            >
              {listening ? `🎤 ${t.listening}` : `🎤 ${t.yourTurn}`}
            </button>
          )}
        </div>

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

        {asrResult && (
          <div className={`asr-result asr-${asrResult.score}`}>
            <div className="asr-label">🤖 {t.aiHeard}</div>
            <div className="asr-transcript">
              {asrResult.transcript ? `"${asrResult.transcript}"` : t.noSpeechDetected}
            </div>
            {asrResult.transcript && (
              <div className="asr-meta">
                {t.editDistance}: {asrResult.distance} ·
                {' '}{t.confidence}: {(asrResult.confidence * 100).toFixed(0)}% ·
                {' '}<b>{t[asrResult.score === 'produced' ? 'produced' : asrResult.score === 'approximated' ? 'approximated' : 'notAttempted']}</b>
              </div>
            )}
          </div>
        )}

        <p className="instruction mt-md">
          {asrSupported
            ? 'Look at the picture. Listen, then tap "Your turn" and say the word.'
            : 'Look at the picture. Listen. Say the word aloud.'}
        </p>
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

export default CILTDrill;
