import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import {
  BrainCircuit,
  Check,
  Circle,
  Hand,
  HelpCircle,
  Lightbulb,
  Mic,
  Sparkles,
  Target,
  Volume2,
  X,
} from 'lucide-react';
import type { CueLevel, Outcome, StimulusItem } from '../../types';
import type { UILabels } from '../../i18n/ui';
import { cn } from '../../utils/cn';

type TherapyStimulus = StimulusItem & {
  audioUrl?: string;
  imageUrl?: string;
  regionTag?: string;
};

interface SpeechResult {
  confidence: number;
  distance: number;
  score: Outcome;
  transcript: string;
}

interface PatientTherapyInterfaceProps {
  adaptiveStart: { step: number; samples: number } | null;
  aiLoading: 'semantic' | 'phonological' | null;
  aiPhonological: string | null;
  aiSemantic: string | null;
  asrResult: SpeechResult | null;
  asrSupported: boolean;
  cueOrder: CueLevel[];
  cueStep: number;
  currentCueLevel: CueLevel;
  disableManualOutcome: boolean;
  item: TherapyStimulus;
  itemCount: number;
  itemIndex: number;
  labels: UILabels;
  listening: boolean;
  onBack: () => void;
  onGiveCue: () => void;
  onOutcome: (outcome: Outcome) => void;
  onPersonalise: (kind: 'semantic' | 'phonological') => void;
  onPlayModel: () => void;
  onYourTurn: () => void;
  progressPct: number;
}

const cueTone: Record<CueLevel, string> = {
  unaided: 'border-teal-300 bg-teal-50 text-teal-900',
  gesture: 'border-violet-300 bg-violet-50 text-violet-900',
  semantic: 'border-blue-300 bg-blue-50 text-blue-900',
  phonological: 'border-amber-300 bg-amber-50 text-amber-900',
  model: 'border-rose-300 bg-rose-50 text-rose-900',
};

const cueIcon = {
  unaided: Target,
  gesture: Hand,
  semantic: Lightbulb,
  phonological: HelpCircle,
  model: Volume2,
} satisfies Record<CueLevel, typeof Target>;

const outcomeMeta = {
  produced: {
    icon: Check,
    className: 'border-teal-200 bg-teal-600 text-white hover:bg-teal-700',
  },
  approximated: {
    icon: Circle,
    className: 'border-amber-200 bg-amber-500 text-slate-950 hover:bg-amber-400',
  },
  'not-attempted': {
    icon: X,
    className: 'border-rose-200 bg-rose-600 text-white hover:bg-rose-700',
  },
} satisfies Record<Outcome, { icon: typeof Check; className: string }>;

function cueLabel(level: CueLevel, labels: UILabels) {
  if (level === 'unaided') return labels.cue_unaided;
  if (level === 'gesture') return labels.cue_gesture;
  if (level === 'semantic') return labels.cue_semantic;
  if (level === 'phonological') return labels.cue_phonological;
  return labels.cue_model;
}

export default function PatientTherapyInterface({
  adaptiveStart,
  aiLoading,
  aiPhonological,
  aiSemantic,
  asrResult,
  asrSupported,
  cueOrder,
  cueStep,
  currentCueLevel,
  disableManualOutcome,
  item,
  itemCount,
  itemIndex,
  labels,
  listening,
  onBack,
  onGiveCue,
  onOutcome,
  onPersonalise,
  onPlayModel,
  onYourTurn,
  progressPct,
}: PatientTherapyInterfaceProps) {
  const reduceMotion = useReducedMotion();
  const CurrentCueIcon = cueIcon[currentCueLevel];

  return (
    <section className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
      <div className="mb-4 flex items-center justify-between gap-3">
        <button
          className="min-h-12 rounded-full border border-slate-200 bg-white px-4 text-sm font-extrabold text-slate-700 shadow-sm hover:border-teal-300"
          onClick={onBack}
        >
          {labels.back}
        </button>
        <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-extrabold text-slate-700 shadow-sm">
          {itemIndex + 1} / {itemCount}
        </div>
      </div>

      <div className="mb-5 h-3 overflow-hidden rounded-full bg-slate-200" aria-hidden="true">
        <motion.div
          className="h-full rounded-full bg-teal-600"
          initial={false}
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: reduceMotion ? 0 : 0.45 }}
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-[0.78fr_1.22fr]">
        <aside className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-28 lg:self-start">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-normal text-slate-500">
                Adaptive cueing
              </p>
              <h2 className="mt-1 font-['Outfit'] text-2xl font-extrabold tracking-normal text-slate-950">
                {labels.cueing}
              </h2>
            </div>
            <span className={cn('grid size-12 place-items-center rounded-lg border', cueTone[currentCueLevel])}>
              <CurrentCueIcon className="size-6" aria-hidden="true" />
            </span>
          </div>

          {adaptiveStart && (
            <div className="mt-4 rounded-lg border border-violet-200 bg-violet-50 p-3 text-sm text-violet-950">
              <div className="flex items-center gap-2 font-extrabold">
                <BrainCircuit className="size-4" aria-hidden="true" />
                {labels.aiAdaptiveStart}
              </div>
              <p className="mt-1">
                {cueLabel(cueOrder[adaptiveStart.step], labels)} based on {adaptiveStart.samples}{' '}
                prior attempts.
              </p>
            </div>
          )}

          <div className="mt-5 space-y-3">
            {cueOrder.map((level, index) => {
              const Icon = cueIcon[level];
              const isActive = index === cueStep;
              const isUnlocked = index <= cueStep;

              return (
                <div
                  key={level}
                  className={cn(
                    'flex items-center gap-3 rounded-lg border p-3 transition',
                    isActive
                      ? cueTone[level]
                      : isUnlocked
                        ? 'border-slate-200 bg-slate-50 text-slate-900'
                        : 'border-slate-100 bg-white text-slate-400'
                  )}
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white/80">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-sm font-extrabold">{cueLabel(level, labels)}</p>
                    <p className="text-xs font-semibold opacity-80">
                      Level {index} {isActive ? 'current' : isUnlocked ? 'available' : 'locked'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        <div className="space-y-5">
          <motion.article
            key={item.id}
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
          >
            <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.word}
                    className="aspect-square w-full object-cover"
                  />
                ) : (
                  <div
                    className="grid aspect-square w-full place-items-center bg-white text-[7rem] leading-none sm:text-[9rem]"
                    aria-label={item.word}
                  >
                    {item.emoji}
                  </div>
                )}
              </div>

              <div>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-extrabold uppercase tracking-normal text-slate-600">
                    Everyday Indian stimulus
                  </span>
                  <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-extrabold uppercase tracking-normal text-teal-700">
                    {item.regionTag ?? 'Home practice'}
                  </span>
                </div>
                <h1 className="mt-4 font-['Outfit'] text-4xl font-extrabold tracking-normal text-slate-950 sm:text-6xl">
                  {item.word}
                </h1>
                {item.translit && (
                  <p className="mt-2 text-lg font-bold text-slate-500">{item.translit}</p>
                )}
                <p className="mt-4 max-w-xl text-lg leading-8 text-slate-600">
                  Look, try the word, and use only the cue level needed for success.
                </p>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <button
                    className="min-h-16 rounded-lg border border-slate-200 bg-slate-950 px-5 text-base font-extrabold text-white shadow-lg shadow-slate-900/20 transition hover:bg-slate-800"
                    onClick={onPlayModel}
                  >
                    <Volume2 className="size-5" aria-hidden="true" />
                    Play model
                  </button>
                  {asrSupported && (
                    <button
                      className={cn(
                        'min-h-16 rounded-lg px-5 text-base font-extrabold text-white shadow-lg transition',
                        listening ? 'bg-rose-600 shadow-rose-700/20' : 'bg-teal-600 shadow-teal-700/20 hover:bg-teal-700'
                      )}
                      onClick={onYourTurn}
                      disabled={listening || Boolean(asrResult)}
                    >
                      <Mic className="size-5" aria-hidden="true" />
                      {listening ? labels.listening : labels.yourTurn}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.article>

          <AnimatePresence mode="popLayout">
            {cueStep >= 1 && (
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="rounded-lg border border-violet-200 bg-violet-50 p-4"
              >
                <p className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-normal text-violet-900">
                  <Hand className="size-4" aria-hidden="true" />
                  {labels.gestureCue}
                </p>
                <p className="mt-2 text-lg font-bold text-violet-950">{item.gesture}</p>
              </motion.div>
            )}

            {cueStep >= 2 && (
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="rounded-lg border border-blue-200 bg-blue-50 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-normal text-blue-900">
                    <Lightbulb className="size-4" aria-hidden="true" />
                    {labels.semanticCue}
                  </p>
                  <button
                    className="min-h-10 rounded-full bg-white px-3 text-xs font-extrabold text-blue-900 shadow-sm"
                    onClick={() => onPersonalise('semantic')}
                    disabled={aiLoading !== null}
                  >
                    <Sparkles className="size-4" aria-hidden="true" />
                    {aiLoading === 'semantic' ? 'Generating' : 'Personalize'}
                  </button>
                </div>
                <p className="mt-2 text-lg font-bold text-blue-950">{aiSemantic ?? item.semanticCue}</p>
              </motion.div>
            )}

            {cueStep >= 3 && (
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="rounded-lg border border-amber-200 bg-amber-50 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-normal text-amber-900">
                    <HelpCircle className="size-4" aria-hidden="true" />
                    {labels.phonologicalCue}
                  </p>
                  <button
                    className="min-h-10 rounded-full bg-white px-3 text-xs font-extrabold text-amber-900 shadow-sm"
                    onClick={() => onPersonalise('phonological')}
                    disabled={aiLoading !== null}
                  >
                    <Sparkles className="size-4" aria-hidden="true" />
                    {aiLoading === 'phonological' ? 'Generating' : 'Personalize'}
                  </button>
                </div>
                <p className="mt-2 text-lg font-bold text-amber-950">
                  {aiPhonological ?? item.phonologicalCue}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center">
              <button
                className="min-h-16 rounded-lg border border-slate-200 bg-slate-100 px-5 text-base font-extrabold text-slate-900 transition hover:bg-slate-200"
                onClick={onGiveCue}
                disabled={cueStep >= cueOrder.length - 1 || listening}
              >
                <HelpCircle className="size-5" aria-hidden="true" />
                {labels.giveCue}
              </button>
              <div className="rounded-lg bg-slate-50 px-4 py-3 text-center text-sm font-extrabold text-slate-600">
                Cue level {cueStep} of {cueOrder.length - 1}
              </div>
            </div>

            {asrResult && (
              <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4" aria-live="polite">
                <p className="text-xs font-extrabold uppercase tracking-normal text-slate-500">
                  {labels.aiHeard}
                </p>
                <p className="mt-1 font-['Outfit'] text-2xl font-extrabold text-slate-950">
                  {asrResult.transcript || labels.noSpeechDetected}
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-500">
                  {labels.editDistance}: {asrResult.distance} | {labels.confidence}:{' '}
                  {(asrResult.confidence * 100).toFixed(0)}%
                </p>
              </div>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {(['produced', 'approximated', 'not-attempted'] as Outcome[]).map((outcome) => {
              const meta = outcomeMeta[outcome];
              const Icon = meta.icon;
              const label =
                outcome === 'produced'
                  ? labels.produced
                  : outcome === 'approximated'
                    ? labels.approximated
                    : labels.notAttempted;

              return (
                <button
                  key={outcome}
                  className={cn(
                    'min-h-20 rounded-lg border px-4 text-base font-extrabold shadow-sm transition disabled:cursor-not-allowed disabled:opacity-45',
                    meta.className
                  )}
                  onClick={() => onOutcome(outcome)}
                  disabled={disableManualOutcome}
                >
                  <Icon className="size-6" aria-hidden="true" />
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
