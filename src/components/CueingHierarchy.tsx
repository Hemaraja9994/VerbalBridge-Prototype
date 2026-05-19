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
import PatientTherapyInterface from './therapy/PatientTherapyInterface';

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

    if (pred.step >= 1) {
      const level = CUE_ORDER[pred.step];
      if (level === 'semantic') speak(current.semanticCue);
      else if (level === 'phonological') speak(current.phonologicalCue);
      else if (level === 'model') void speakItem(current.id, current.word, 0.7);
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

  const playModel = async () => {
    await speakItem(current.id, current.word, 0.72);
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
    const response = await fetchPersonalisedCue({ lang, word: current.word, kind });
    setAiLoading(null);
    if (!response.text) return;
    if (kind === 'semantic') {
      setAiSemantic(response.text);
      speak(response.text);
    } else {
      setAiPhonological(response.text);
      speak(response.text);
    }
  };

  const handleYourTurn = async () => {
    setAsrResult(null);
    const result = await listen(current.word, 5500);
    setAsrResult(result);
    const entry = buildEntry(result.score, {
      autoGraded: true,
      transcript: result.transcript,
      asrConfidence: result.confidence,
      editDistance: result.distance >= 0 ? result.distance : undefined,
    });
    setTimeout(() => finalize(entry), 1400);
  };

  return (
    <PatientTherapyInterface
      adaptiveStart={adaptiveStart}
      aiLoading={aiLoading}
      aiPhonological={aiPhonological}
      aiSemantic={aiSemantic}
      asrResult={asrResult}
      asrSupported={asrSupported}
      cueOrder={CUE_ORDER}
      cueStep={cueStep}
      currentCueLevel={currentCueLevel}
      disableManualOutcome={listening || Boolean(asrResult)}
      item={current}
      itemCount={items.length}
      itemIndex={index}
      labels={t}
      listening={listening}
      onBack={onBack}
      onGiveCue={giveNextCue}
      onOutcome={handleOutcome}
      onPersonalise={personalise}
      onPlayModel={playModel}
      onYourTurn={handleYourTurn}
      progressPct={((index + 1) / items.length) * 100}
    />
  );
};

export default CueingHierarchy;
