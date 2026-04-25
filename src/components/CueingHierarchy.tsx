import React, { useEffect, useMemo, useState } from 'react';
import { UI } from '../i18n/ui';
import { getStimuli } from '../data/stimuli';
import { useFamiliarVoice } from '../hooks/useFamiliarVoice';
import { useRecognition, type AsrResult } from '../hooks/useRecognition';
import {
  CUE_ORDER,
  predictStartCueStep,
  recordCueOutcome,
} from '../lib/adaptiveEngine';
import { fetchPersonalisedCue } from '../lib/aiCues';
import type { CueLevel, LangCode, Outcome, SessionEntry } from '../types';

interface Props {
  lang: LangCode;
  onComplete: (entries: SessionEntry[]) => void;
  onBack: () => void;
}

const CueingHierarchy: React.FC<Props> = ({ lang, onComplete, onBack }) => {
  const t = UI[lang];
  const items = useMemo(() => getStimuli(lang).items, [lang]);
  const { speak, speakItem, lastSource } = useFamiliarVoice(lang);
  const { listen, listening, supported: asrSupported } = useRecognition(lang);
  const [index, setIndex] = useState(0);
  const [entries, setEntries] = useState<SessionEntry[]>([]);
  const [cueStep, setCueStep] = useState(0);
  const [adaptiveStart, setAdaptiveStart] = useState<{
    step: number;
    samples: number;
  } | null>(null);
  const [asrResult, setAsrResult] = useState<AsrResult | null>(null);
  const [aiSemantic, setAiSemantic] = useState<string | null>(null);
  const [aiPhonological, setAiPhonological] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState<'semantic' | 'phonological' | null>(null);

  const current = items[index];
  const isLast = index === items.length - 1;
  const currentCueLevel: CueLevel = CUE_ORDER[cueStep];

  // Apply adaptive starting step whenever the current item changes.
  useEffect(() => {
    const pred = predictStartCueStep(current.id);
    setCueStep(pred.step);
    setAdaptiveStart(
      pred.basis === 'history' ? { step: pred.step, samples: pred.samples } : null
    );
    setAsrResult(null);
    setAiSemantic(null);
    setAiPhonological(null);
    setAiLoading(null);
    // Auto-deliver any cues for the predicted starting step
    if (pred.step >= 1) {
      // If the predicted step requires a cue to be spoken, speak the latest cue.
      const lvl = CUE_ORDER[pred.step];
      if (lvl === 'semantic') speak(current.semanticCue);
      else if (lvl === 'phonological') speak(current.phonologicalCue);
      else if (lvl === 'model') speakItem(current.id, current.word, 0.7);
      // gesture is silent — visual only
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current.id]);

  const giveNextCue = async () => {
    if (cueStep < CUE_ORDER.length - 1) {
      const nextStep = cueStep + 1;
      setCueStep(nextStep);
      const nextLevel = CUE_ORDER[nextStep];
      if (nextLevel === 'semantic') speak(current.semanticCue);
      else if (nextLevel === 'phonological') speak(current.phonologicalCue);
      else if (nextLevel === 'model') await speakItem(current.id, current.word, 0.7);
    }
  };

  const buildEntry = (
    outcome: Outcome,
    extras: Partial<SessionEntry> = {}
  ): SessionEntry => ({
    itemId: current.id,
    word: current.word,
    module: 'cueing',
    cueLevel: currentCueLevel,
    outcome,
    voiceSource: currentCueLevel === 'model' ? lastSource() : undefined,
    adaptiveSuggested: adaptiveStart !== null && cueStep === adaptiveStart.step,
    timestamp: Date.now(),
    ...extras,
  });

  const finalize = (entry: SessionEntry) => {
    if (entry.outcome !== 'not-attempted') {
      recordCueOutcome(current.id, currentCueLevel);
    }
    const next = [...entries, entry];
    setEntries(next);
    setAsrResult(null);
    if (isLast) {
      onComplete(next);
    } else {
      setIndex(index + 1);
    }
  };

  const handleOutcome = (outcome: Outcome) => {
    finalize(buildEntry(outcome));
  };

  const personalise = async (kind: 'semantic' | 'phonological') => {
    setAiLoading(kind);
    const r = await fetchPersonalisedCue({ lang, word: current.word, kind });
    setAiLoading(null);
    if (!r.text) return;
    if (kind === 'semantic') {
      setAiSemantic(r.text);
      speak(r.text);
    } else {
      setAiPhonological(r.text);
      speak(r.text);
    }
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
    setTimeout(() => finalize(entry), 1400);
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

      {adaptiveStart && (
        <div className="adaptive-banner">
          🧠 {t.aiAdaptiveStart}: <b>{t[`cue_${CUE_ORDER[adaptiveStart.step]}` as keyof typeof t] || CUE_ORDER[adaptiveStart.step]}</b>
          <span className="adaptive-samples">({adaptiveStart.samples} prior {adaptiveStart.samples === 1 ? 'attempt' : 'attempts'})</span>
        </div>
      )}

      <div className="stimulus-card glass-card">
        <div className="stimulus-emoji" aria-hidden="true">
          {current.emoji}
        </div>

        {cueStep >= 1 && (
          <div className="cue-line cue-gesture">
            <span className="cue-label">
              ✋ {t.gestureCue} <span className="cue-emoji-inline">{current.gestureEmoji}</span>
            </span>
            <p>{current.gesture}</p>
          </div>
        )}
        {cueStep >= 2 && (
          <div className="cue-line cue-semantic">
            <div className="cue-line-header">
              <span className="cue-label">💡 {t.semanticCue}</span>
              <button
                className="ai-personalise-btn"
                onClick={() => personalise('semantic')}
                disabled={aiLoading !== null}
                title="Generate culturally-personalised cue with AI"
              >
                {aiLoading === 'semantic' ? '⏳' : '✨'} AI
              </button>
            </div>
            <p>{aiSemantic ?? current.semanticCue}</p>
            {aiSemantic && <span className="ai-cue-tag">✨ AI-personalised</span>}
          </div>
        )}
        {cueStep >= 3 && (
          <div className="cue-line cue-phonological">
            <div className="cue-line-header">
              <span className="cue-label">🔤 {t.phonologicalCue}</span>
              <button
                className="ai-personalise-btn"
                onClick={() => personalise('phonological')}
                disabled={aiLoading !== null}
                title="Generate culturally-personalised cue with AI"
              >
                {aiLoading === 'phonological' ? '⏳' : '✨'} AI
              </button>
            </div>
            <p>{aiPhonological ?? current.phonologicalCue}</p>
            {aiPhonological && <span className="ai-cue-tag">✨ AI-personalised</span>}
          </div>
        )}
        {cueStep >= 4 && (
          <div className="cue-line cue-model">
            <span className="cue-label">🎯 {t.modelCue}</span>
            <p className="cue-model-word">{current.word}</p>
          </div>
        )}

        <div className="cue-actions mt-lg">
          <button
            className="secondary"
            onClick={giveNextCue}
            disabled={cueStep >= CUE_ORDER.length - 1 || listening}
          >
            ➕ {t.giveCue}
          </button>
          <div className="cue-step-indicator">
            Level {cueStep} / {CUE_ORDER.length - 1}
          </div>
        </div>

        {asrSupported && (
          <div className="cue-asr-row mt-md">
            <button
              className={`primary asr-btn ${listening ? 'listening' : ''}`}
              onClick={handleYourTurn}
              disabled={listening || !!asrResult}
            >
              {listening ? `🎤 ${t.listening}` : `🎤 ${t.yourTurn}`}
            </button>
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
                {' '}{t.confidence}: {(asrResult.confidence * 100).toFixed(0)}%
              </div>
            )}
          </div>
        )}
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

export default CueingHierarchy;
