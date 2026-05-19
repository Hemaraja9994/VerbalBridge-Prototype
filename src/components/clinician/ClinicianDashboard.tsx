import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Activity,
  BrainCircuit,
  ClipboardCheck,
  Download,
  Gauge,
  TrendingUp,
} from 'lucide-react';
import { motion } from 'framer-motion';
import type { AphasiaType, CueLevel, LangCode, Outcome, SessionEntry } from '../../types';
import { APHASIA_LABELS, LANG_META } from '../../i18n/ui';

interface ClinicianDashboardProps {
  aphasia: AphasiaType;
  entries: SessionEntry[];
  lang: LangCode;
  onBack: () => void;
}

const cueLabels: Record<CueLevel, string> = {
  unaided: 'Unaided',
  gesture: 'Gesture',
  semantic: 'Semantic',
  phonological: 'Phonological',
  model: 'Model',
};

const outcomeColors: Record<Outcome, string> = {
  produced: '#0f766e',
  approximated: '#d97706',
  'not-attempted': '#e11d48',
};

const sampleSessions = [
  { session: 'S1', aq: 48, accuracy: 42, cueLoad: 4.1 },
  { session: 'S2', aq: 51, accuracy: 48, cueLoad: 3.8 },
  { session: 'S3', aq: 55, accuracy: 54, cueLoad: 3.1 },
  { session: 'S4', aq: 58, accuracy: 61, cueLoad: 2.7 },
  { session: 'S5', aq: 62, accuracy: 67, cueLoad: 2.2 },
];

const wabScores = {
  spontaneousSpeech: 11,
  auditoryComprehension: 156,
  repetition: 63,
  naming: 66,
};

function calculateAq() {
  return (
    (wabScores.spontaneousSpeech +
      wabScores.auditoryComprehension / 20 +
      wabScores.repetition / 10 +
      wabScores.naming / 10) *
    2
  );
}

function classifySeverity(aq: number) {
  if (aq >= 76) return 'Mild';
  if (aq >= 51) return 'Moderate';
  if (aq >= 26) return 'Severe';
  return 'Very severe';
}

function buildOutcomeData(entries: SessionEntry[]) {
  const seed: Record<Outcome, number> = {
    produced: 0,
    approximated: 0,
    'not-attempted': 0,
  };

  const counts = entries.reduce((acc, entry) => {
    acc[entry.outcome] += 1;
    return acc;
  }, seed);

  if (entries.length === 0) {
    return [
      { name: 'Produced', value: 18, outcome: 'produced' as Outcome },
      { name: 'Approximated', value: 8, outcome: 'approximated' as Outcome },
      { name: 'Not attempted', value: 4, outcome: 'not-attempted' as Outcome },
    ];
  }

  return [
    { name: 'Produced', value: counts.produced, outcome: 'produced' as Outcome },
    { name: 'Approximated', value: counts.approximated, outcome: 'approximated' as Outcome },
    { name: 'Not attempted', value: counts['not-attempted'], outcome: 'not-attempted' as Outcome },
  ];
}

function buildCueData(entries: SessionEntry[]) {
  const levels: CueLevel[] = ['unaided', 'gesture', 'semantic', 'phonological', 'model'];

  if (entries.length === 0) {
    return [
      { cue: 'Unaided', count: 10 },
      { cue: 'Gesture', count: 8 },
      { cue: 'Semantic', count: 6 },
      { cue: 'Sound', count: 4 },
      { cue: 'Model', count: 2 },
    ];
  }

  return levels.map((level) => ({
    cue: cueLabels[level] === 'Phonological' ? 'Sound' : cueLabels[level],
    count: entries.filter((entry) => entry.cueLevel === level).length,
  }));
}

export default function ClinicianDashboard({
  aphasia,
  entries,
  lang,
  onBack,
}: ClinicianDashboardProps) {
  const aq = calculateAq();
  const severity = classifySeverity(aq);
  const total = entries.length || 30;
  const produced = entries.filter((entry) => entry.outcome === 'produced').length || 18;
  const accuracy = Math.round((produced / total) * 100);
  const outcomeData = buildOutcomeData(entries);
  const cueData = buildCueData(entries);

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <button
            className="mb-4 min-h-11 rounded-full border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm hover:border-teal-300"
            onClick={onBack}
          >
            Back to therapy
          </button>
          <p className="text-sm font-extrabold uppercase tracking-normal text-teal-700">
            Clinician dashboard
          </p>
          <h1 className="mt-2 font-['Outfit'] text-3xl font-extrabold tracking-normal text-slate-950 sm:text-5xl">
            Progress, AQ worksheet, and adaptive engine view
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
            Active profile: {APHASIA_LABELS[lang][aphasia]} in {LANG_META[lang].label}.
            Use the WAB-R fields as an SLP-reviewed scoring worksheet, not as an
            automated diagnosis.
          </p>
        </div>
        <button className="min-h-12 rounded-full bg-slate-950 px-5 text-sm font-extrabold text-white shadow-lg shadow-slate-900/20">
          <Download className="size-4" aria-hidden="true" />
          Export report
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Current AQ', value: aq.toFixed(1), icon: Gauge, helper: severity },
          { label: 'Therapy items', value: String(total), icon: Activity, helper: 'Last active set' },
          { label: 'Speech accuracy', value: `${accuracy}%`, icon: TrendingUp, helper: 'Produced responses' },
          { label: 'Engine class', value: 'Adaptive', icon: BrainCircuit, helper: 'Cue depth learning' },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.article
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.04 }}
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-normal text-slate-500">
                    {stat.label}
                  </p>
                  <p className="mt-2 font-['Outfit'] text-3xl font-extrabold tracking-normal text-slate-950">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm font-bold text-teal-700">{stat.helper}</p>
                </div>
                <span className="grid size-11 place-items-center rounded-lg bg-slate-100 text-slate-900">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
              </div>
            </motion.article>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-['Outfit'] text-xl font-extrabold tracking-normal text-slate-950">
                AQ and functional trend
              </h2>
              <p className="text-sm text-slate-500">Demo trend until connected to baseline assessments.</p>
            </div>
            <ClipboardCheck className="size-6 text-teal-700" aria-hidden="true" />
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sampleSessions} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="session" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Line type="monotone" dataKey="aq" stroke="#0f766e" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="accuracy" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-['Outfit'] text-xl font-extrabold tracking-normal text-slate-950">
            Outcome mix
          </h2>
          <p className="text-sm text-slate-500">Patient response quality across the current session.</p>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={outcomeData} layout="vertical" margin={{ top: 4, right: 20, left: 8, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" width={96} stroke="#64748b" />
                <Tooltip />
                <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                  {outcomeData.map((entry) => (
                    <Cell key={entry.name} fill={outcomeColors[entry.outcome]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-['Outfit'] text-xl font-extrabold tracking-normal text-slate-950">
            WAB-R AQ worksheet
          </h2>
          <div className="mt-4 space-y-3">
            {[
              ['Spontaneous speech', wabScores.spontaneousSpeech, '/20'],
              ['Auditory comprehension', wabScores.auditoryComprehension, '/200'],
              ['Repetition', wabScores.repetition, '/100'],
              ['Naming', wabScores.naming, '/100'],
            ].map(([label, value, max]) => (
              <div className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3" key={label}>
                <span className="text-sm font-bold text-slate-700">{label}</span>
                <span className="font-['Outfit'] text-lg font-extrabold text-slate-950">
                  {value}
                  <span className="text-sm text-slate-500"> {max}</span>
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-lg bg-slate-950 p-4 text-white">
            <p className="text-xs font-bold uppercase tracking-normal text-teal-200">Calculated AQ</p>
            <p className="font-['Outfit'] text-4xl font-extrabold">{aq.toFixed(1)}</p>
          </div>
        </article>

        <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-['Outfit'] text-xl font-extrabold tracking-normal text-slate-950">
            Cue load distribution
          </h2>
          <p className="text-sm text-slate-500">
            Lower cue load over time suggests stronger independent retrieval.
          </p>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="cue" stroke="#64748b" />
                <YAxis allowDecimals={false} stroke="#64748b" />
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="#0f766e" fill="#ccfbf1" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>
      </div>
    </section>
  );
}
