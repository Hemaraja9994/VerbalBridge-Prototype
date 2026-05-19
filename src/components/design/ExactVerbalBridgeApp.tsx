import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Brain,
  Check,
  Circle,
  Download,
  Ear,
  Globe2,
  Hand,
  HeartPulse,
  Mic,
  Plus,
  Search,
  Settings,
  Sparkles,
  Volume2,
  X,
} from 'lucide-react';
import { getStimuli } from '../../data/stimuli';
import { APHASIA_LABELS, LANG_META, UI } from '../../i18n/ui';
import type {
  AphasiaType,
  CueLevel,
  LangCode,
  ModuleId,
  Outcome,
  SessionEntry,
  StimulusItem,
} from '../../types';

type Screen =
  | 'intro'
  | 'role'
  | 'language'
  | 'aphasia'
  | 'home'
  | 'hub'
  | 'cilt'
  | 'cueing'
  | 'comprehension'
  | 'gesture'
  | 'voice'
  | 'stimuli'
  | 'complete'
  | 'progress'
  | 'clinician';

const langOrder: LangCode[] = ['en', 'kn', 'hi', 'ml', 'ta', 'te'];

const aphasiaOrder: Array<{
  id: AphasiaType;
  icon: typeof Brain;
  subtitle: string;
}> = [
  { id: 'broca', icon: Mic, subtitle: 'Motor · agrammatic speech' },
  { id: 'wernicke', icon: Ear, subtitle: 'Comprehension difficulty' },
  { id: 'anomic', icon: Search, subtitle: 'Word-finding pauses' },
  { id: 'global', icon: Brain, subtitle: 'Severe, all modalities' },
  { id: 'conduction', icon: ArrowRight, subtitle: 'Repetition difficulty' },
  { id: 'transcortical', icon: Sparkles, subtitle: 'Repetition relatively spared' },
];

const cueOrder: CueLevel[] = ['gesture', 'semantic', 'phonological', 'model'];

function speakWord(text: string) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.78;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

function VBChrome({
  back,
  lang,
  onBack,
  right,
}: {
  back?: boolean;
  lang: LangCode;
  onBack?: () => void;
  right?: React.ReactNode;
}) {
  return (
    <div className="vb-chrome">
      {back ? (
        <button className="vb-back" onClick={onBack}>
          <ArrowLeft size={18} strokeWidth={2} /> Back
        </button>
      ) : (
        <div className="vb-chrome-logo">
          <span className="dot" />
          VerbalBridge
        </div>
      )}
      {right ?? (
        <span className="vb-chip">
          <Globe2 size={14} />{' '}
          <span style={{ fontFamily: 'var(--f-indic)' }}>{LANG_META[lang].native}</span>
        </span>
      )}
    </div>
  );
}

function VBProgress({ current, total }: { current: number; total: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div
        style={{
          flex: 1,
          height: 5,
          background: 'var(--hairline)',
          borderRadius: 999,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${(current / total) * 100}%`,
            background: 'linear-gradient(90deg, var(--saffron), var(--saffron-dk))',
            borderRadius: 999,
          }}
        />
      </div>
      <span className="vb-pill" style={{ fontVariantNumeric: 'tabular-nums' }}>
        {current}/{total}
      </span>
    </div>
  );
}

function VBWaveform({
  animated,
  color = 'currentColor',
  height = 28,
  n = 18,
}: {
  animated?: boolean;
  color?: string;
  height?: number;
  n?: number;
}) {
  const seed = [3, 7, 12, 18, 14, 22, 10, 6, 14, 18, 24, 16, 8, 12, 18, 20, 14, 8];
  return (
    <div className="vb-wave" style={{ color, height }}>
      {Array.from({ length: n }).map((_, index) => (
        <i
          key={index}
          className={animated ? 'vb-wave-animate' : undefined}
          style={{
            animationDelay: `${index * 0.055}s`,
            height: `${Math.min(height - 4, seed[index % seed.length])}px`,
          }}
        />
      ))}
    </div>
  );
}

function Sparkline({ values }: { values: number[] }) {
  const max = Math.max(...values, 1);
  return (
    <div className="vb-spark" style={{ color: 'var(--sage-dk)' }}>
      {values.map((value, index) => (
        <i key={index} style={{ height: `${(value / max) * 20}px` }} />
      ))}
    </div>
  );
}

function OutcomeButtons({
  disabled,
  onOutcome,
}: {
  disabled?: boolean;
  onOutcome: (outcome: Outcome) => void;
}) {
  return (
    <div className="vb-outcomes">
      <button
        className="vb-outcome"
        data-tone="ok"
        disabled={disabled}
        onClick={() => onOutcome('produced')}
      >
        <span className="glyph">
          <Check size={14} strokeWidth={2.6} />
        </span>
        Produced
      </button>
      <button
        className="vb-outcome"
        data-tone="mid"
        disabled={disabled}
        onClick={() => onOutcome('approximated')}
      >
        <span className="glyph">
          <Circle size={14} strokeWidth={2.4} />
        </span>
        Approx.
      </button>
      <button
        className="vb-outcome"
        data-tone="no"
        disabled={disabled}
        onClick={() => onOutcome('not-attempted')}
      >
        <span className="glyph">
          <X size={14} strokeWidth={2.6} />
        </span>
        Missed
      </button>
    </div>
  );
}

function StimulusCard({ item, compact }: { compact?: boolean; item: StimulusItem }) {
  return (
    <div className="vb-stim" style={compact ? { padding: '18px 16px 20px' } : undefined}>
      <div className="vb-stim-emoji" style={compact ? { fontSize: 72 } : undefined}>
        {item.emoji}
      </div>
      <div className="vb-stim-word" style={compact ? { fontSize: 'var(--t-32)' } : undefined}>
        {item.word}
      </div>
      {item.translit && <div className="vb-stim-translit">/{item.translit}/</div>}
    </div>
  );
}

function completeEntry(
  item: StimulusItem,
  module: ModuleId,
  cueLevel: CueLevel,
  outcome: Outcome
): SessionEntry {
  return {
    cueLevel,
    itemId: item.id,
    module,
    outcome,
    timestamp: Date.now(),
    word: item.word,
  };
}

function ScreenIntro({
  lang,
  onBegin,
  onReturn,
}: {
  lang: LangCode;
  onBegin: () => void;
  onReturn: () => void;
}) {
  return (
    <>
      <VBChrome
        lang={lang}
        right={
          <button className="vb-back" onClick={onReturn} style={{ fontSize: 'var(--t-12)' }}>
            Skip
          </button>
        }
      />
      <div
        className="vb-screen"
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          minHeight: 'calc(100vh - 68px)',
          paddingBottom: 28,
          paddingTop: 0,
        }}
      >
        <div
          style={{
            alignItems: 'center',
            display: 'flex',
            flex: 1,
            justifyContent: 'center',
            paddingBottom: 12,
            paddingTop: 30,
          }}
        >
          <svg width="220" height="220" viewBox="0 0 220 220" fill="none">
            <circle cx="110" cy="110" r="100" stroke="var(--sand)" strokeWidth="1" />
            <circle
              cx="110"
              cy="110"
              r="76"
              stroke="var(--saffron-tint)"
              strokeDasharray="2 6"
              strokeWidth="1"
            />
            <circle cx="110" cy="110" r="54" stroke="var(--sage-tint)" strokeWidth="1.5" />
            <path
              d="M20 110 Q45 70 70 110 T120 110 T170 110 T220 110"
              stroke="var(--saffron)"
              strokeLinecap="round"
              strokeWidth="2.5"
            />
            <path
              d="M20 110 Q45 150 70 110 T120 110 T170 110 T220 110"
              stroke="var(--sage)"
              strokeLinecap="round"
              strokeWidth="2.5"
              opacity="0.6"
            />
            <circle cx="110" cy="110" r="6" fill="var(--ink)" />
            <circle cx="110" cy="110" r="14" stroke="var(--ink)" strokeWidth="1" />
          </svg>
        </div>
        <div>
          <div className="vb-eyebrow">AIISH · Hack'A'Comm 2026</div>
          <h1
            style={{
              fontSize: 'var(--t-40)',
              fontWeight: 500,
              letterSpacing: '-0.035em',
              marginTop: 10,
            }}
          >
            Rebuild speech in the <span className="serif">language of home.</span>
          </h1>
          <p className="vb-sub" style={{ marginTop: 14, maxWidth: '42ch' }}>
            A neuroplasticity-based speech therapy companion for persons with aphasia in
            your mother tongue, with the voices you love.
          </p>
          <div className="vb-col" style={{ gap: 10, marginTop: 24 }}>
            <button className="vb-btn vb-btn--primary vb-btn--block vb-btn--lg" onClick={onBegin}>
              Begin <ArrowRight size={18} strokeWidth={2} />
            </button>
            <button
              className="vb-btn vb-btn--ghost vb-btn--block"
              onClick={onReturn}
              style={{ background: 'transparent' }}
            >
              I've used this before
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function ScreenRole({
  lang,
  onBack,
  onClinician,
  onContinue,
}: {
  lang: LangCode;
  onBack: () => void;
  onClinician: () => void;
  onContinue: () => void;
}) {
  const roles = [
    {
      description: 'I am rebuilding my own speech.',
      icon: HeartPulse,
      label: 'Patient',
      onClick: onContinue,
      tone: 'saffron',
    },
    {
      description: 'I am helping a loved one practise.',
      icon: Hand,
      label: 'Caregiver',
      onClick: onContinue,
      tone: 'sage',
    },
    {
      description: 'I supervise therapy sessions.',
      icon: BarChart3,
      label: 'Clinician',
      onClick: onClinician,
      tone: 'plum',
    },
  ];

  return (
    <>
      <VBChrome back lang={lang} onBack={onBack} />
      <div className="vb-screen">
        <div className="vb-eyebrow">Step 1 of 3</div>
        <h2 className="vb-title">
          Who is using <span className="serif">this device?</span>
        </h2>
        <p className="vb-sub">We'll tailor the home screen and the summaries you see.</p>
        <div className="vb-col" style={{ gap: 10, marginTop: 4 }}>
          {roles.map((role, index) => {
            const Icon = role.icon;
            return (
              <button
                key={role.label}
                className="vb-mod"
                onClick={role.onClick}
                style={
                  index === 0
                    ? { borderColor: 'var(--ink)', boxShadow: '0 6px 14px rgba(21,23,42,0.10)' }
                    : undefined
                }
              >
                <div
                  className="vb-mod-icon"
                  style={{
                    background:
                      role.tone === 'saffron'
                        ? 'var(--saffron-tint)'
                        : role.tone === 'sage'
                          ? 'var(--sage-tint)'
                          : 'rgba(139,90,142,0.18)',
                    color:
                      role.tone === 'saffron'
                        ? 'var(--saffron-dk)'
                        : role.tone === 'sage'
                          ? 'var(--sage-dk)'
                          : 'var(--plum)',
                  }}
                >
                  <Icon size={26} />
                </div>
                <div>
                  <div className="vb-mod-title">{role.label}</div>
                  <div className="vb-mod-desc">{role.description}</div>
                </div>
                <div className="vb-mod-arrow">
                  <ArrowRight size={14} strokeWidth={2} />
                </div>
              </button>
            );
          })}
        </div>
        <button className="vb-btn vb-btn--primary vb-btn--block" onClick={onContinue}>
          Continue <ArrowRight size={16} strokeWidth={2} />
        </button>
      </div>
    </>
  );
}

function ScreenLanguage({
  lang,
  onBack,
  onSelect,
}: {
  lang: LangCode;
  onBack: () => void;
  onSelect: (next: LangCode) => void;
}) {
  return (
    <>
      <VBChrome back lang={lang} onBack={onBack} />
      <div className="vb-screen">
        <div className="vb-eyebrow">Step 2 of 3</div>
        <h2 className="vb-title">
          Therapy <span className="serif">in your</span> mother tongue.
        </h2>
        <p className="vb-sub">
          Familiar phonology recruits stronger semantic networks. Choose the language
          spoken at home.
        </p>
        <div className="vb-langs" style={{ marginTop: 4 }}>
          {langOrder.map((code) => (
            <button
              key={code}
              className={`vb-lang ${code === lang ? 'vb-lang--sel' : ''}`}
              onClick={() => onSelect(code)}
            >
              <div className="vb-lang-native">{LANG_META[code].native}</div>
              <div className="vb-lang-eng">{LANG_META[code].label}</div>
              {code === lang && (
                <div style={{ position: 'absolute', right: 12, top: 12 }}>
                  <Check size={16} strokeWidth={2.4} />
                </div>
              )}
            </button>
          ))}
        </div>
        <div
          className="vb-card"
          style={{
            alignItems: 'flex-start',
            background: 'var(--paper-soft)',
            display: 'flex',
            gap: 10,
            marginTop: 6,
            padding: 14,
          }}
        >
          <div style={{ color: 'var(--saffron-dk)' }}>
            <Sparkles size={20} />
          </div>
          <div style={{ color: 'var(--ink-2)', fontSize: 'var(--t-12)', lineHeight: 1.45 }}>
            <b>Code-switching is welcome.</b> The recognizer accepts mixed home-language
            and English speech common in Indian households.
          </div>
        </div>
        <button className="vb-btn vb-btn--primary vb-btn--block" onClick={() => onSelect(lang)}>
          Continue in {LANG_META[lang].native} <ArrowRight size={16} strokeWidth={2} />
        </button>
      </div>
    </>
  );
}

function ScreenAphasia({
  aphasia,
  lang,
  onBack,
  onContinue,
  onSelect,
}: {
  aphasia: AphasiaType;
  lang: LangCode;
  onBack: () => void;
  onContinue: () => void;
  onSelect: (next: AphasiaType) => void;
}) {
  return (
    <>
      <VBChrome back lang={lang} onBack={onBack} />
      <div className="vb-screen">
        <div className="vb-eyebrow">Step 3 of 3</div>
        <h2 className="vb-title">
          Which <span className="serif">aphasia type</span> describes speech?
        </h2>
        <p className="vb-sub">
          If you are not sure, your clinician can change this later. The choice tunes
          the recommended modules.
        </p>
        <div className="vb-col" style={{ gap: 8 }}>
          {aphasiaOrder.map((item) => {
            const Icon = item.icon;
            const selected = item.id === aphasia;
            return (
              <button
                key={item.id}
                className={`vb-aph ${selected ? 'vb-aph--sel' : ''}`}
                onClick={() => onSelect(item.id)}
              >
                <div
                  className="vb-aph-glyph"
                  style={selected ? { background: 'var(--saffron)', color: 'var(--cream)' } : undefined}
                >
                  <Icon size={18} />
                </div>
                <div>
                  <div className="vb-aph-name">{APHASIA_LABELS[lang][item.id]}</div>
                  <div className="vb-aph-sub">{item.subtitle}</div>
                </div>
                <div style={{ color: selected ? 'var(--saffron-dk)' : 'var(--ink-faint)' }}>
                  {selected ? <Check size={16} strokeWidth={2.4} /> : <ArrowRight size={14} />}
                </div>
              </button>
            );
          })}
        </div>
        <button className="vb-btn vb-btn--saffron vb-btn--block" onClick={onContinue}>
          Start therapy <ArrowRight size={16} strokeWidth={2} />
        </button>
      </div>
    </>
  );
}

function ScreenHome({
  entries,
  lang,
  onClinician,
  onHub,
  onProgress,
}: {
  entries: SessionEntry[];
  lang: LangCode;
  onClinician: () => void;
  onHub: () => void;
  onProgress: () => void;
}) {
  const stimulusCount = getStimuli(lang).items.length;

  return (
    <>
      <VBChrome lang={lang} right={<button className="vb-back" onClick={onClinician}>Clinician</button>} />
      <div className="vb-screen">
        <div className="vb-row" style={{ justifyContent: 'space-between' }}>
          <div>
            <div className="vb-eyebrow">Today · Home practice</div>
            <h2 className="vb-title" style={{ marginTop: 6 }}>
              Welcome back,<br />
              <span className="serif">Hemaraja.</span>
            </h2>
          </div>
          <div className="vb-vbring-wrap">
            <div className="vb-vbring">
              <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" stroke="var(--hairline)" strokeWidth="6" fill="none" />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="var(--saffron)"
                  strokeDasharray={`${42 * 2 * Math.PI * 0.75} ${42 * 2 * Math.PI}`}
                  strokeLinecap="round"
                  strokeWidth="6"
                  fill="none"
                />
              </svg>
              <div className="vb-vbring-num">
                <b>7</b>
                <span>day streak</span>
              </div>
            </div>
          </div>
        </div>

        <button className="vb-mod vb-mod--recommended" onClick={onHub} style={{ marginTop: 8 }}>
          <div className="vb-mod-icon cilt">
            <Mic size={26} />
          </div>
          <div>
            <div className="vb-mod-title">Continue CILT drill</div>
            <div className="vb-mod-desc">{stimulusCount} localized words available · full bank ready</div>
          </div>
          <div className="vb-mod-arrow" style={{ background: 'var(--ink)', borderColor: 'transparent', color: 'var(--paper)' }}>
            <ArrowRight size={14} strokeWidth={2.4} />
          </div>
        </button>

        <div style={{ display: 'grid', gap: 10, gridTemplateColumns: '1fr 1fr' }}>
          <div className="vb-stat">
            <span className="vb-stat-label">This week</span>
            <span className="vb-stat-value">
              {Math.max(entries.length, 128)} <span style={{ color: 'var(--ink-soft)', fontSize: 'var(--t-12)', fontWeight: 500 }}>words</span>
            </span>
            <Sparkline values={[2, 4, 3, 5, 6, 4, 7]} />
          </div>
          <div className="vb-stat">
            <span className="vb-stat-label">Unaided ratio</span>
            <span className="vb-stat-value">42%</span>
            <div style={{ color: 'var(--sage-dk)', fontFamily: 'var(--f-mono)', fontSize: 'var(--t-11)', fontWeight: 700 }}>
              ↑ 8% vs last week
            </div>
          </div>
        </div>

        <div className="vb-section-h" style={{ marginTop: 4 }}>
          <h3>Today's plan</h3>
          <span>3 modules</span>
        </div>
        <div className="vb-col" style={{ gap: 8 }}>
          <button className="vb-card vb-home-plan" onClick={onHub}>
            <div className="vb-mod-icon cueing" style={{ borderRadius: 12, height: 38, width: 38 }}>
              <Brain size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--f-display)', fontSize: 'var(--t-14)', fontWeight: 600 }}>Cueing Hierarchy</div>
              <div style={{ color: 'var(--ink-soft)', fontSize: 'var(--t-11)' }}>{stimulusCount} items · adaptive start</div>
            </div>
            <span className="vb-pill vb-pill--sage">Next</span>
          </button>
          <button className="vb-card vb-home-plan" onClick={onProgress}>
            <div className="vb-mod-icon gesture" style={{ borderRadius: 12, height: 38, width: 38 }}>
              <BarChart3 size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--f-display)', fontSize: 'var(--t-14)', fontWeight: 600 }}>Review progress</div>
              <div style={{ color: 'var(--ink-soft)', fontSize: 'var(--t-11)' }}>Cue load · word constellation</div>
            </div>
          </button>
        </div>
      </div>
    </>
  );
}

function ScreenHub({
  aphasia,
  lang,
  onBack,
  onClinician,
  onModule,
  onProgress,
  onStimuli,
  onVoice,
}: {
  aphasia: AphasiaType;
  lang: LangCode;
  onBack: () => void;
  onClinician: () => void;
  onModule: (module: ModuleId) => void;
  onProgress: () => void;
  onStimuli: () => void;
  onVoice: () => void;
}) {
  const t = UI[lang];
  const stimulusCount = getStimuli(lang).items.length;
  const modules: Array<{
    desc: string;
    icon: typeof Mic;
    id: ModuleId;
    klass: string;
    rec?: boolean;
    title: string;
  }> = [
    { desc: t.ciltDesc, icon: Mic, id: 'cilt', klass: 'cilt', rec: true, title: t.cilt },
    { desc: t.cueingDesc, icon: Brain, id: 'cueing', klass: 'cueing', rec: true, title: t.cueing },
    { desc: t.gestureDesc, icon: Hand, id: 'gesture', klass: 'gesture', rec: true, title: t.gesture },
    { desc: t.comprehensionDesc, icon: Ear, id: 'comprehension', klass: 'comp', title: t.comprehension },
  ];

  return (
    <>
      <VBChrome back lang={lang} onBack={onBack} right={<button className="vb-back" onClick={onClinician}>Clinician</button>} />
      <div className="vb-screen">
        <div className="vb-eyebrow">Therapy hub</div>
        <h2 className="vb-title">
          Three modules <span className="serif">tuned for</span> {APHASIA_LABELS[lang][aphasia]}.
        </h2>
        <div className="vb-col" style={{ gap: 10, marginTop: 4 }}>
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <button
                key={module.id}
                className={`vb-mod ${module.rec ? 'vb-mod--recommended' : ''}`}
                onClick={() => onModule(module.id)}
                style={{ position: 'relative' }}
              >
                <div className={`vb-mod-icon ${module.klass}`}>
                  <Icon size={26} />
                </div>
                <div>
                  <div className="vb-mod-title">{module.title}</div>
                  <div className="vb-mod-desc">{module.desc}</div>
                </div>
                <div className="vb-mod-arrow">
                  <ArrowRight size={14} strokeWidth={2} />
                </div>
                {module.rec && <span className="vb-rec-tag">Recommended</span>}
              </button>
            );
          })}
        </div>
        <button
          className="vb-card vb-home-plan"
          onClick={onVoice}
          style={{ background: 'var(--paper-soft)', marginTop: 4, padding: 14 }}
        >
          <div className="vb-mod-icon" style={{ background: 'var(--ink)', borderRadius: 12, color: 'var(--paper)', height: 40, width: 40 }}>
            <HeartPulse size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--f-display)', fontSize: 'var(--t-14)', fontWeight: 600 }}>Familiar Voice Bank</div>
            <div style={{ color: 'var(--ink-soft)', fontSize: 'var(--t-12)' }}>Record model words in a loved one's voice</div>
          </div>
          <ArrowRight size={16} strokeWidth={2} />
        </button>
        <button
          className="vb-card vb-home-plan"
          onClick={onStimuli}
          style={{ background: 'var(--cream)', marginTop: 4, padding: 14 }}
        >
          <div className="vb-mod-icon cueing" style={{ borderRadius: 12, height: 40, width: 40 }}>
            <Search size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--f-display)', fontSize: 'var(--t-14)', fontWeight: 600 }}>
              Clinical Stimulus Library
            </div>
            <div style={{ color: 'var(--ink-soft)', fontSize: 'var(--t-12)' }}>
              {stimulusCount} localized items across six languages
            </div>
          </div>
          <ArrowRight size={16} strokeWidth={2} />
        </button>
        <div className="vb-row" style={{ justifyContent: 'space-between', marginTop: 4 }}>
          <button className="vb-btn vb-btn--ghost" onClick={onProgress} style={{ padding: '10px 14px' }}>
            <BarChart3 size={16} /> Progress
          </button>
          <button className="vb-btn vb-btn--ghost" style={{ padding: '10px 14px' }}>
            <Settings size={16} /> Settings
          </button>
        </div>
      </div>
    </>
  );
}

function TherapyModuleScreen({
  lang,
  module,
  onBack,
  onComplete,
}: {
  lang: LangCode;
  module: ModuleId;
  onBack: () => void;
  onComplete: (entries: SessionEntry[]) => void;
}) {
  const items = useMemo(() => getStimuli(lang).items, [lang]);
  const [index, setIndex] = useState(0);
  const [entries, setEntries] = useState<SessionEntry[]>([]);
  const [cueStep, setCueStep] = useState(module === 'cueing' ? 1 : 0);
  const [listening, setListening] = useState(false);
  const [chosen, setChosen] = useState<string | null>(null);
  const current = items[index];
  const isLast = index === items.length - 1;

  const advance = (outcome: Outcome, cueLevel: CueLevel) => {
    const next = [...entries, completeEntry(current, module, cueLevel, outcome)];
    setEntries(next);
    setChosen(null);
    setCueStep(module === 'cueing' ? 1 : 0);
    setListening(false);
    if (isLast) onComplete(next);
    else setIndex((value) => value + 1);
  };

  const startListening = () => {
    setListening(true);
    window.setTimeout(() => advance('approximated', module === 'cueing' ? cueOrder[cueStep] : 'model'), 1400);
  };

  if (module === 'comprehension') {
    const options = [current.emoji, ...(current.distractorEmojis ?? []).slice(0, 3)];
    return (
      <>
        <VBChrome back lang={lang} onBack={onBack} />
        <div className="vb-screen">
          <VBProgress current={index + 1} total={items.length} />
          <div className="vb-row" style={{ justifyContent: 'space-between' }}>
            <div>
              <div className="vb-eyebrow">
                <Ear size={12} /> Comprehension
              </div>
              <h3 style={{ fontSize: 'var(--t-20)', marginTop: 4 }}>Listen and tap</h3>
            </div>
          </div>
          <div className="vb-card vb-listen-card">
            <div className="vb-mic-wrap">
              <button className="vb-mic vb-mic-dark" onClick={() => speakWord(current.word)}>
                <Volume2 size={32} />
              </button>
              <div className="vb-mic-label">Tap to hear the word</div>
            </div>
            <VBWaveform color="var(--ink-soft)" n={22} />
          </div>
          <p style={{ color: 'var(--ink-soft)', fontSize: 'var(--t-13)', textAlign: 'center' }}>
            Then tap the picture that matches.
          </p>
          <div className="vb-comp-grid">
            {options.map((emoji) => {
              const correct = emoji === current.emoji;
              const state = chosen === emoji ? (correct ? 'correct' : 'wrong') : '';
              return (
                <button
                  key={emoji}
                  className={`vb-comp-opt ${state}`}
                  onClick={() => {
                    setChosen(emoji);
                    window.setTimeout(() => advance(correct ? 'produced' : 'approximated', 'model'), 650);
                  }}
                  disabled={Boolean(chosen)}
                >
                  {emoji}
                  {state === 'correct' && (
                    <div className="vb-correct-dot">
                      <Check size={16} strokeWidth={2.6} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </>
    );
  }

  if (module === 'gesture') {
    return (
      <>
        <VBChrome back lang={lang} onBack={onBack} />
        <div className="vb-screen">
          <VBProgress current={index + 1} total={items.length} />
          <div className="vb-row" style={{ justifyContent: 'space-between' }}>
            <div>
              <div className="vb-eyebrow">
                <Hand size={12} /> Gesture therapy
              </div>
              <h3 style={{ fontSize: 'var(--t-20)', marginTop: 4 }}>Body and breath</h3>
            </div>
            <span className="vb-pill vb-pill--ink">Item {index + 1}</span>
          </div>
          <div className="vb-card" style={{ padding: 18 }}>
            <div style={{ alignItems: 'center', display: 'grid', gap: 8, gridTemplateColumns: '1fr auto 1fr' }}>
              <div style={{ textAlign: 'center' }}>
                <div className="vb-mini-label">Look & say</div>
                <div style={{ fontSize: 64, lineHeight: 1 }}>{current.emoji}</div>
              </div>
              <div className="vb-plus-dot">+</div>
              <div style={{ textAlign: 'center' }}>
                <div className="vb-mini-label" style={{ color: 'var(--plum)' }}>Do this</div>
                <div style={{ filter: 'drop-shadow(0 4px 10px rgba(139,90,142,0.25))', fontSize: 64, lineHeight: 1 }}>
                  {current.gestureEmoji}
                </div>
              </div>
            </div>
            <div className="vb-gesture-note">{current.gesture}</div>
            <div style={{ marginTop: 16, textAlign: 'center' }}>
              <div className="vb-stim-word" style={{ fontSize: 'var(--t-32)' }}>{current.word}</div>
              {current.translit && <div className="vb-stim-translit">/{current.translit}/</div>}
            </div>
          </div>
          <div className="vb-row" style={{ gap: 8 }}>
            <button className="vb-btn vb-btn--soft" onClick={() => speakWord(current.word)} style={{ flex: 1 }}>
              <Volume2 size={16} /> Model
            </button>
            <button className="vb-btn vb-btn--saffron" onClick={startListening} style={{ flex: 1 }}>
              <Mic size={16} /> Your turn
            </button>
          </div>
          <OutcomeButtons disabled={listening} onOutcome={(outcome) => advance(outcome, 'gesture')} />
        </div>
      </>
    );
  }

  if (module === 'cueing') {
    return (
      <>
        <VBChrome back lang={lang} onBack={onBack} />
        <div className="vb-screen">
          <VBProgress current={index + 1} total={items.length} />
          <div className="vb-row" style={{ justifyContent: 'space-between' }}>
            <div>
              <div className="vb-eyebrow">
                <Brain size={12} /> Cueing hierarchy
              </div>
              <h3 style={{ fontSize: 'var(--t-20)', marginTop: 4 }}>Climbing the ladder</h3>
            </div>
            <span className="vb-pill vb-pill--saffron">Item {index + 1}</span>
          </div>
          <div className="vb-card vb-ai-banner">
            <Sparkles size={18} />
            <div>
              <div style={{ fontSize: 'var(--t-12)', fontWeight: 700, letterSpacing: '0.04em' }}>
                AI starts you at <span style={{ color: 'var(--saffron-dk)' }}>Semantic</span>
              </div>
              <div style={{ color: 'var(--ink-soft)', fontSize: 'var(--t-11)' }}>
                Based on prior attempts with this word.
              </div>
            </div>
          </div>
          <div className="vb-card vb-mini-stim">
            <div style={{ fontSize: 48, lineHeight: 1 }}>{current.emoji}</div>
            <div>
              <div className="vb-stim-word" style={{ fontSize: 'var(--t-28)', textAlign: 'left' }}>{current.word}</div>
              {current.translit && <div className="vb-stim-translit" style={{ textAlign: 'left' }}>/{current.translit}/</div>}
            </div>
            <button className="vb-btn vb-btn--soft vb-icon-button" onClick={() => speakWord(current.word)}>
              <Volume2 size={18} />
            </button>
          </div>
          <div className="vb-ladder">
            {cueOrder.map((level, step) => {
              const active = step === cueStep;
              const past = step < cueStep;
              const cueText =
                level === 'gesture'
                  ? current.gesture
                  : level === 'semantic'
                    ? current.semanticCue
                    : level === 'phonological'
                      ? current.phonologicalCue
                      : `Hear the full word: ${current.word}`;
              return (
                <div
                  key={level}
                  className={`vb-rung cue-${level} ${active ? 'active' : ''} ${past ? 'past' : ''}`}
                >
                  <div className="vb-rung-step">{step + 1}</div>
                  <div>
                    <span className="vb-rung-label">{level} {active ? '· active' : past ? '· done' : ''}</span>
                    <div className="vb-rung-text">{cueText}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="vb-row" style={{ gap: 8 }}>
            <button
              className="vb-btn vb-btn--soft"
              disabled={cueStep >= cueOrder.length - 1}
              onClick={() => setCueStep((value) => Math.min(value + 1, cueOrder.length - 1))}
              style={{ flex: 1 }}
            >
              <Plus size={16} /> Next cue
            </button>
            <button className="vb-btn vb-btn--saffron" onClick={startListening} style={{ flex: 1 }}>
              <Mic size={16} /> Your turn
            </button>
          </div>
          <OutcomeButtons disabled={listening} onOutcome={(outcome) => advance(outcome, cueOrder[cueStep])} />
        </div>
      </>
    );
  }

  return (
    <>
      <VBChrome back lang={lang} onBack={onBack} />
      <div className="vb-screen">
        <VBProgress current={index + 1} total={items.length} />
        <div className="vb-row" style={{ justifyContent: 'space-between' }}>
          <div>
            <div className="vb-eyebrow">
              <Mic size={12} /> CILT drill
            </div>
            <h3 style={{ fontSize: 'var(--t-20)', marginTop: 4 }}>Look · Listen · Speak</h3>
          </div>
          <span className="vb-pill vb-pill--ink">Item {index + 1}</span>
        </div>
        <StimulusCard item={current} />
        <div className="vb-card vb-center-card">
          <button className="vb-btn vb-btn--soft" onClick={() => speakWord(current.word)}>
            <Volume2 size={18} /> Replay
          </button>
          <div className="vb-mic-wrap">
            <button className={`vb-mic ${listening ? 'listening' : ''}`} onClick={startListening}>
              <Mic size={32} strokeWidth={2} />
            </button>
            <div className="vb-mic-label">
              {listening ? 'Listening...' : <>Tap and say <b>{current.word}</b></>}
            </div>
          </div>
          {listening && <VBWaveform animated color="var(--coral)" n={22} />}
        </div>
        <OutcomeButtons disabled={listening} onOutcome={(outcome) => advance(outcome, 'model')} />
        <p style={{ color: 'var(--ink-soft)', fontSize: 'var(--t-12)', textAlign: 'center' }}>
          AI can transcribe automatically, or the SLP can tap an outcome manually.
        </p>
      </div>
    </>
  );
}

function ScreenVoiceBank({
  lang,
  onBack,
}: {
  lang: LangCode;
  onBack: () => void;
}) {
  const items = useMemo(() => getStimuli(lang).items, [lang]);
  const [recorded, setRecorded] = useState<Set<string>>(new Set(items.slice(0, 4).map((item) => item.id)));
  const pct = Math.round((recorded.size / items.length) * 100);

  return (
    <>
      <VBChrome back lang={lang} onBack={onBack} />
      <div className="vb-screen">
        <div className="vb-row" style={{ justifyContent: 'space-between' }}>
          <div>
            <div className="vb-eyebrow">Familiar voice bank</div>
            <h2 className="vb-title">Record words in a <span className="serif">loved voice.</span></h2>
          </div>
          <div className="vb-vbring-wrap">
            <div className="vb-vbring">
              <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" stroke="var(--hairline)" strokeWidth="6" fill="none" />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="var(--sage)"
                  strokeDasharray={`${42 * 2 * Math.PI * (pct / 100)} ${42 * 2 * Math.PI}`}
                  strokeLinecap="round"
                  strokeWidth="6"
                  fill="none"
                />
              </svg>
              <div className="vb-vbring-num">
                <b>{recorded.size}</b>
                <span>of {items.length}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="vb-card" style={{ background: 'var(--paper-soft)', display: 'flex', gap: 10, padding: 14 }}>
          <HeartPulse size={18} style={{ color: 'var(--sage-dk)', marginTop: 2 }} />
          <div style={{ color: 'var(--ink-2)', fontSize: 'var(--t-12)', lineHeight: 1.45 }}>
            <b>Familiar voices recruit richer semantic-emotional networks.</b> Use consent-cleared
            recordings from family or caregivers.
          </div>
        </div>
        <div className="vb-col" style={{ gap: 8 }}>
          {items.map((item) => {
            const hasRecord = recorded.has(item.id);
            return (
              <div key={item.id} className={`vb-voice-row ${hasRecord ? 'recorded' : ''}`}>
                <div className="vb-voice-emoji">{item.emoji}</div>
                <div>
                  <div className="vb-voice-word">{item.word}</div>
                  <div className="vb-voice-meta">
                    {hasRecord ? 'Recorded by family · 2.4s' : 'Not recorded yet'}
                  </div>
                </div>
                <button
                  className={`vb-voice-action ${hasRecord ? 'vb-voice-action--play' : ''}`}
                  onClick={() => {
                    if (hasRecord) speakWord(item.word);
                    else setRecorded((current) => new Set(current).add(item.id));
                  }}
                >
                  {hasRecord ? <Volume2 size={13} /> : <Mic size={13} />}
                  {hasRecord ? 'Play' : 'Record'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

function ScreenStimulusLibrary({
  lang,
  onBack,
  onPractice,
}: {
  lang: LangCode;
  onBack: () => void;
  onPractice: () => void;
}) {
  const items = useMemo(() => getStimuli(lang).items, [lang]);
  const categories = useMemo(
    () => ['All', ...Array.from(new Set(items.map((item) => item.category ?? 'Core')))],
    [items]
  );
  const [category, setCategory] = useState('All');
  const visibleItems = category === 'All'
    ? items
    : items.filter((item) => (item.category ?? 'Core') === category);
  const severeCount = items.filter((item) => item.severityGrade === 'Severe').length;
  const moderateCount = items.filter((item) => item.severityGrade === 'Moderate').length;
  const mildCount = items.filter((item) => item.severityGrade === 'Mild').length;

  return (
    <>
      <VBChrome
        back
        lang={lang}
        onBack={onBack}
        right={<span className="vb-chip">{items.length} stimuli</span>}
      />
      <div className="vb-screen">
        <div className="vb-eyebrow">Clinical stimulus bank</div>
        <h2 className="vb-title">
          Full multilingual <span className="serif">therapy library.</span>
        </h2>
        <p className="vb-sub">
          All prepared concepts are now available inside the redesigned app for
          cueing, CILT, voice bank recording, and clinician review.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          <div className="vb-stat vb-stat-tight">
            <span className="vb-stat-label">Severe</span>
            <span className="vb-stat-value">{severeCount}</span>
          </div>
          <div className="vb-stat vb-stat-tight">
            <span className="vb-stat-label">Moderate</span>
            <span className="vb-stat-value">{moderateCount}</span>
          </div>
          <div className="vb-stat vb-stat-tight">
            <span className="vb-stat-label">Mild</span>
            <span className="vb-stat-value">{mildCount}</span>
          </div>
        </div>

        <div className="vb-category-strip" aria-label="Stimulus categories">
          {categories.map((itemCategory) => (
            <button
              key={itemCategory}
              className={`vb-pill vb-category-pill ${itemCategory === category ? 'on' : ''}`}
              onClick={() => setCategory(itemCategory)}
            >
              {itemCategory}
            </button>
          ))}
        </div>

        <button className="vb-btn vb-btn--saffron vb-btn--block" onClick={onPractice}>
          <Mic size={16} /> Practice full set in CILT
        </button>

        <div className="vb-section-h" style={{ marginTop: 4 }}>
          <h3>{category === 'All' ? 'All stimuli' : category}</h3>
          <span>{visibleItems.length} items</span>
        </div>

        <div className="vb-col" style={{ gap: 8 }}>
          {visibleItems.map((item) => (
            <article className="vb-card vb-stimulus-row" key={item.id}>
              <div className="vb-stimulus-row-emoji">{item.emoji}</div>
              <div className="vb-stimulus-row-body">
                <div className="vb-row" style={{ alignItems: 'baseline', justifyContent: 'space-between' }}>
                  <div className="vb-voice-word">{item.word}</div>
                  <span className="vb-pill vb-pill--sage">{item.severityGrade ?? 'Core'}</span>
                </div>
                {item.translit && <div className="vb-voice-meta">/{item.translit}/</div>}
                <div className="vb-stimulus-row-meta">
                  {item.category ?? 'Core'} · {item.subCategory ?? 'Functional communication'}
                </div>
                <div className="vb-stimulus-cues">
                  <span>{item.semanticCue}</span>
                  <span>{item.phonologicalCue}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}

function ScreenComplete({
  entries,
  lang,
  onHub,
  onProgress,
}: {
  entries: SessionEntry[];
  lang: LangCode;
  onHub: () => void;
  onProgress: () => void;
}) {
  const produced = entries.filter((entry) => entry.outcome === 'produced').length;
  const approximated = entries.filter((entry) => entry.outcome === 'approximated').length;

  return (
    <>
      <VBChrome lang={lang} right={<span className="vb-chip"><Sparkles size={12} /> +{produced} unaided</span>} />
      <div className="vb-screen" style={{ flex: 1, justifyContent: 'space-between', minHeight: 'calc(100vh - 68px)' }}>
        <div className="vb-celebrate">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="40" r="34" stroke="var(--saffron)" strokeWidth="1.5" />
            <circle cx="40" cy="40" r="24" stroke="var(--saffron-dk)" strokeDasharray="2 4" />
            <path d="M22 40 Q31 24 40 40 T58 40" stroke="var(--ink)" strokeLinecap="round" strokeWidth="2.5" />
            <circle cx="40" cy="40" r="3" fill="var(--ink)" />
          </svg>
          <div className="vb-eyebrow">Session complete</div>
          <h2 className="vb-title" style={{ fontSize: 'var(--t-32)', maxWidth: '14ch', textAlign: 'center' }}>
            Ten words. <span className="serif">One more bridge.</span>
          </h2>
          <p className="vb-celebrate-mantra">
            Every repetition rewires a path between meaning and mouth.
          </p>
          <div className="vb-sargam" style={{ marginTop: 8, width: 240 }}>
            {[20, 32, 50, 40, 64, 48, 70, 88].map((height, index) => (
              <div
                key={height}
                style={{
                  background: index > 6 ? 'var(--ink)' : index > 4 ? 'var(--saffron-dk)' : 'var(--saffron)',
                  height: `${height}%`,
                  opacity: index < 2 ? 0.35 : 0.85,
                }}
              />
            ))}
          </div>
          <div className="vb-row" style={{ gap: 14, marginTop: 4 }}>
            <div style={{ textAlign: 'center' }}>
              <div className="vb-complete-value">{produced}</div>
              <div className="vb-complete-label">Produced</div>
            </div>
            <div className="vb-complete-sep" />
            <div style={{ textAlign: 'center' }}>
              <div className="vb-complete-value">{approximated}</div>
              <div className="vb-complete-label">Approx.</div>
            </div>
            <div className="vb-complete-sep" />
            <div style={{ textAlign: 'center' }}>
              <div className="vb-complete-value">5:48</div>
              <div className="vb-complete-label">Minutes</div>
            </div>
          </div>
        </div>
        <div className="vb-col" style={{ gap: 8 }}>
          <button className="vb-btn vb-btn--saffron vb-btn--block vb-btn--lg" onClick={onProgress}>
            <BarChart3 size={16} /> View progress
          </button>
          <button className="vb-btn vb-btn--ghost vb-btn--block" onClick={onHub}>Back to therapy hub</button>
        </div>
      </div>
    </>
  );
}

function ScreenProgress({
  entries,
  lang,
  onBack,
}: {
  entries: SessionEntry[];
  lang: LangCode;
  onBack: () => void;
}) {
  const total = Math.max(entries.length, 14);
  const produced = Math.max(entries.filter((entry) => entry.outcome === 'produced').length, 9);
  const constellationNodes: Array<{
    color: string;
    r: number;
    word: string;
    x: number;
    y: number;
  }> = [
    { color: 'var(--saffron)', r: 8, word: 'rice', x: 40, y: 60 },
    { color: 'var(--saffron-dk)', r: 10, word: 'water', x: 120, y: 30 },
    { color: 'var(--sage)', r: 12, word: 'mother', x: 200, y: 50 },
    { color: 'var(--sage-dk)', r: 9, word: 'cup', x: 300, y: 80 },
    { color: 'var(--sky)', r: 7, word: 'bed', x: 50, y: 100 },
    { color: 'var(--sage)', r: 11, word: 'chair', x: 140, y: 90 },
    { color: 'var(--lavender)', r: 8, word: 'tea', x: 220, y: 110 },
  ];
  const cues = [
    { count: 54, label: 'Unaided', pct: 42, color: 'var(--sage)' },
    { count: 23, label: 'Gesture', pct: 18, color: 'var(--plum)' },
    { count: 20, label: 'Semantic', pct: 16, color: 'var(--lavender)' },
    { count: 18, label: 'Phonological', pct: 14, color: 'var(--sky)' },
    { count: 13, label: 'Model', pct: 10, color: 'var(--saffron)' },
  ];
  const max = Math.max(...cues.map((cue) => cue.pct));

  return (
    <>
      <VBChrome
        back
        lang={lang}
        onBack={onBack}
        right={<button className="vb-back"><Download size={14} /> Export</button>}
      />
      <div className="vb-screen">
        <div className="vb-eyebrow">
          <BarChart3 size={12} /> Progress · last 30 days
        </div>
        <h2 className="vb-title" style={{ fontSize: 'var(--t-26)' }}>
          {total * 9} words climbed.<br />
          <span className="serif">42% unaided.</span>
        </h2>
        <div style={{ display: 'grid', gap: 8, gridTemplateColumns: '1fr 1fr' }}>
          <div className="vb-stat"><span className="vb-stat-label">Sessions</span><span className="vb-stat-value">{total}</span></div>
          <div className="vb-stat"><span className="vb-stat-label">Avg. min/day</span><span className="vb-stat-value">8.2</span></div>
          <div className="vb-stat" style={{ background: 'rgba(94,135,112,0.12)' }}>
            <span className="vb-stat-label">Produced</span>
            <span className="vb-stat-value" style={{ color: 'var(--sage-dk)' }}>{produced}</span>
            <div className="vb-trend-up">↑ 18%</div>
          </div>
          <div className="vb-stat" style={{ background: 'rgba(216,89,90,0.08)' }}>
            <span className="vb-stat-label">Missed</span>
            <span className="vb-stat-value" style={{ color: 'var(--coral)' }}>11</span>
            <div className="vb-trend-down">↓ 6%</div>
          </div>
        </div>
        <div className="vb-card">
          <div className="vb-section-h">
            <h3>Cueing distribution</h3>
            <span style={{ color: 'var(--sage-dk)', fontWeight: 700 }}>+8% unaided</span>
          </div>
          <p style={{ color: 'var(--ink-soft)', fontSize: 'var(--t-12)', marginBottom: 12 }}>
            More <b>unaided</b> retrieval = neuroplasticity progress.
          </p>
          <div className="vb-col" style={{ gap: 8 }}>
            {cues.map((cue) => (
              <div key={cue.label} className="vb-cue-dist-row">
                <span>{cue.label}</span>
                <div className="vb-bar">
                  <div className="vb-bar-fill" style={{ background: cue.color, width: `${(cue.pct / max) * 100}%` }}>
                    {cue.pct >= 12 && `${cue.pct}%`}
                  </div>
                </div>
                <span>{cue.count}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="vb-tree" style={{ minHeight: 160, position: 'relative' }}>
          <h4>Word constellation</h4>
          <svg viewBox="0 0 320 140" style={{ marginTop: 6, width: '100%' }}>
            <path d="M40 60 Q120 30 200 50 T300 80" stroke="rgba(220,122,58,0.5)" strokeWidth="1" fill="none" />
            <path d="M50 100 Q140 90 220 110 T300 100" stroke="rgba(94,135,112,0.5)" strokeWidth="1" fill="none" />
            {constellationNodes.map(({ color, r, word, x, y }) => (
              <g key={word}>
                <circle cx={x} cy={y} r={r} fill={color} opacity="0.9" />
                <text x={x} y={y + r + 12} fontSize="9" fill="rgba(242,234,219,0.7)" textAnchor="middle" fontFamily="JetBrains Mono">
                  {word}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    </>
  );
}

function ScreenClinician({ lang, onBack }: { lang: LangCode; onBack: () => void }) {
  const patients = [
    { initials: 'HN', name: 'Hemaraja N.', meta: "Broca's · 23d", trend: '+12%', unaided: 42, values: [3, 4, 4, 5, 6, 5, 7, 6, 7, 8] },
    { initials: 'RK', name: 'Radha K.', meta: 'Anomic · 51d', trend: '+4%', unaided: 61, values: [5, 6, 6, 5, 7, 6, 7, 7, 8, 7] },
    { initials: 'MS', name: 'Mahesh S.', meta: 'Global · 12d', trend: 'plateau', unaided: 18, values: [3, 4, 3, 4, 3, 4, 3, 4, 3, 4], alert: true },
    { initials: 'PV', name: 'Priya V.', meta: "Wernicke's · 7d", trend: '+22%', unaided: 28, values: [1, 2, 2, 3, 4, 3, 5, 4, 5, 6], fresh: true },
  ];

  return (
    <>
      <VBChrome
        back
        lang={lang}
        onBack={onBack}
        right={<span className="vb-chip vb-chip-dark"><span className="vb-live-dot" /> Dr. Aravind</span>}
      />
      <div className="vb-screen">
        <div className="vb-eyebrow">SLP dashboard · Tuesday</div>
        <h2 className="vb-title" style={{ fontSize: 'var(--t-26)' }}>4 patients <span className="serif">to review.</span></h2>
        <div className="vb-clin-tab">
          <button className="on">Patients</button>
          <button>Sessions</button>
          <button>Stimuli</button>
        </div>
        <div className="vb-row" style={{ gap: 8 }}>
          <div className="vb-stat vb-stat-tight"><span className="vb-stat-label">Active</span><span className="vb-stat-value">11</span></div>
          <div className="vb-stat vb-stat-tight"><span className="vb-stat-label">This week</span><span className="vb-stat-value">72</span></div>
          <div className="vb-stat vb-stat-tight" style={{ background: 'rgba(216,89,90,0.10)' }}>
            <span className="vb-stat-label">Review</span><span className="vb-stat-value" style={{ color: 'var(--coral)' }}>1</span>
          </div>
        </div>
        <div className="vb-section-h" style={{ marginTop: 4 }}>
          <h3>My patients</h3>
          <span>Sorted by activity</span>
        </div>
        <div className="vb-col" style={{ gap: 8 }}>
          {patients.map((patient) => (
            <div
              key={patient.initials}
              className="vb-card vb-patient-card"
              style={{
                background: patient.alert ? 'rgba(216,89,90,0.06)' : 'var(--cream)',
                borderColor: patient.alert ? 'var(--coral)' : 'var(--hairline)',
              }}
            >
              <div className="vb-patient-avatar" style={patient.alert ? { background: 'var(--coral)' } : patient.fresh ? { background: 'var(--sage)' } : undefined}>
                {patient.initials}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div className="vb-row" style={{ gap: 6 }}>
                  <div className="vb-patient-name">{patient.name}</div>
                  {patient.alert && <span className="vb-pill" style={{ background: 'var(--coral)', color: 'var(--cream)' }}>Plateau</span>}
                  {patient.fresh && <span className="vb-pill vb-pill--sage">New</span>}
                </div>
                <div className="vb-patient-meta">{patient.meta} · {patient.unaided}% unaided</div>
                <div style={{ alignItems: 'center', display: 'flex', gap: 8, marginTop: 2 }}>
                  <div style={{ color: patient.alert ? 'var(--saffron-dk)' : 'var(--sage-dk)', width: 88 }}>
                    <Sparkline values={patient.values} />
                  </div>
                  <span className="vb-patient-trend" style={{ color: patient.alert ? 'var(--saffron-dk)' : 'var(--sage-dk)' }}>
                    {patient.alert ? '→' : '↑'} {patient.trend}
                  </span>
                </div>
              </div>
              <div className="vb-mod-arrow"><ArrowRight size={14} /></div>
            </div>
          ))}
        </div>
        <button className="vb-btn vb-btn--soft vb-btn--block">
          <Plus size={16} /> Add patient
        </button>
      </div>
    </>
  );
}

export default function ExactVerbalBridgeApp() {
  const [screen, setScreen] = useState<Screen>('intro');
  const [lang, setLang] = useState<LangCode>('en');
  const [aphasia, setAphasia] = useState<AphasiaType>('broca');
  const [entries, setEntries] = useState<SessionEntry[]>([]);
  const latestEntries = entries.slice(-10);

  const completeModule = (nextEntries: SessionEntry[]) => {
    setEntries((current) => [...current, ...nextEntries]);
    setScreen('complete');
  };

  return (
    <div
      className="vb-shell"
      data-card="soft"
      data-density="comfortable"
      data-font="bricolage"
      data-palette="mother-tongue"
      data-stim="card"
      data-theme="light"
      style={{ '--a11y': 1 } as React.CSSProperties}
    >
      <div className="vb" lang={lang}>
        {screen === 'intro' && (
          <ScreenIntro lang={lang} onBegin={() => setScreen('role')} onReturn={() => setScreen('home')} />
        )}
        {screen === 'role' && (
          <ScreenRole
            lang={lang}
            onBack={() => setScreen('intro')}
            onClinician={() => setScreen('clinician')}
            onContinue={() => setScreen('language')}
          />
        )}
        {screen === 'language' && (
          <ScreenLanguage
            lang={lang}
            onBack={() => setScreen('role')}
            onSelect={(next) => {
              setLang(next);
              setScreen('aphasia');
            }}
          />
        )}
        {screen === 'aphasia' && (
          <ScreenAphasia
            aphasia={aphasia}
            lang={lang}
            onBack={() => setScreen('language')}
            onContinue={() => setScreen('hub')}
            onSelect={setAphasia}
          />
        )}
        {screen === 'home' && (
          <ScreenHome
            entries={entries}
            lang={lang}
            onClinician={() => setScreen('clinician')}
            onHub={() => setScreen('hub')}
            onProgress={() => setScreen('progress')}
          />
        )}
        {screen === 'hub' && (
          <ScreenHub
            aphasia={aphasia}
            lang={lang}
            onBack={() => setScreen('home')}
            onClinician={() => setScreen('clinician')}
            onModule={(module) => setScreen(module)}
            onProgress={() => setScreen('progress')}
            onStimuli={() => setScreen('stimuli')}
            onVoice={() => setScreen('voice')}
          />
        )}
        {(['cilt', 'cueing', 'comprehension', 'gesture'] as Screen[]).includes(screen) && (
          <TherapyModuleScreen
            key={`${screen}-${lang}`}
            lang={lang}
            module={screen as ModuleId}
            onBack={() => setScreen('hub')}
            onComplete={completeModule}
          />
        )}
        {screen === 'voice' && <ScreenVoiceBank lang={lang} onBack={() => setScreen('hub')} />}
        {screen === 'stimuli' && (
          <ScreenStimulusLibrary
            lang={lang}
            onBack={() => setScreen('hub')}
            onPractice={() => setScreen('cilt')}
          />
        )}
        {screen === 'complete' && (
          <ScreenComplete
            entries={latestEntries}
            lang={lang}
            onHub={() => setScreen('hub')}
            onProgress={() => setScreen('progress')}
          />
        )}
        {screen === 'progress' && (
          <ScreenProgress entries={entries} lang={lang} onBack={() => setScreen('home')} />
        )}
        {screen === 'clinician' && (
          <ScreenClinician lang={lang} onBack={() => setScreen('home')} />
        )}
      </div>
    </div>
  );
}
