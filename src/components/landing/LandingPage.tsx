import { motion } from 'framer-motion';
import {
  ArrowRight,
  AudioLines,
  BookOpenCheck,
  BrainCircuit,
  CheckCircle2,
  ClipboardCheck,
  HandHeart,
  Headphones,
  Languages,
  LineChart,
  MapPinned,
  Mic2,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';

interface LandingPageProps {
  onOpenClinician: () => void;
  onStartTherapy: () => void;
}

const metrics = [
  { label: 'Languages', value: '6' },
  { label: 'Core modules', value: '4' },
  { label: 'Cue levels', value: '5' },
];

const trustPoints = [
  'Adaptive challenge level',
  'Real-time progress feedback',
  'Clinician-supervised home practice',
  'Indian ADL stimulus bank',
];

const evidenceCards = [
  {
    title: 'Neuroplasticity loops',
    body: 'Short, repeated retrieval attempts with immediate cue adjustment keep practice effortful without overwhelming the patient.',
    icon: BrainCircuit,
    tone: 'bg-teal-50 text-teal-800 ring-teal-100',
  },
  {
    title: 'WAB-R informed tracking',
    body: 'Dashboard-ready AQ fields, subscale trend views, and transparent severity bands help SLPs discuss change over time.',
    icon: ClipboardCheck,
    tone: 'bg-blue-50 text-blue-800 ring-blue-100',
  },
  {
    title: 'CILT task design',
    body: 'Verbal-response first therapy rounds encourage spoken attempts while still allowing clinically useful cueing and shaping.',
    icon: Users,
    tone: 'bg-amber-50 text-amber-800 ring-amber-100',
  },
];

const indiaHighlights = [
  {
    title: 'Mother-tongue first',
    body: 'English, Kannada, Hindi, Malayalam, Tamil, and Telugu are represented in the therapy stimulus layer.',
    icon: Languages,
  },
  {
    title: 'Daily-life stimuli',
    body: 'Food, home objects, family routines, local transit, and hospital vocabulary keep therapy recognizable.',
    icon: MapPinned,
  },
  {
    title: 'Caregiver bridge',
    body: 'Familiar voice recording supports home practice when on-device TTS is limited for regional languages.',
    icon: ShieldCheck,
  },
];

const moduleCards = [
  {
    title: 'CILT spoken practice',
    body: 'Structured request-response drills for verbal initiation and constraint-based shaping.',
    icon: Mic2,
  },
  {
    title: 'Adaptive cueing ladder',
    body: 'Semantic, phonemic, repetition, and model cues arranged as a clear clinical hierarchy.',
    icon: BrainCircuit,
  },
  {
    title: 'Comprehension practice',
    body: 'Large, touch-friendly listening tasks for word recognition and everyday commands.',
    icon: Headphones,
  },
  {
    title: 'Gesture-to-speech bridge',
    body: 'Multimodal support that gradually moves functional gestures toward spoken output.',
    icon: HandHeart,
  },
  {
    title: 'Voice restoration cues',
    body: 'Consent-gated familiar voice cueing for emotionally salient therapy prompts.',
    icon: AudioLines,
  },
  {
    title: 'Stimulus library',
    body: 'Localized clinical vocabulary across basic needs, hospital, kitchen, family, transit, and verbs.',
    icon: BookOpenCheck,
  },
];

const workflowBars = [
  { label: 'Assessment baseline', value: 94, color: 'bg-blue-600' },
  { label: 'Stimulus selection', value: 89, color: 'bg-teal-600' },
  { label: 'Guided therapy session', value: 92, color: 'bg-indigo-600' },
  { label: 'Clinician review', value: 86, color: 'bg-amber-600' },
];

export default function LandingPage({
  onOpenClinician,
  onStartTherapy,
}: LandingPageProps) {
  return (
    <div className="bg-[#eef3f7]">
      <section className="relative min-h-[74vh] overflow-hidden bg-slate-950 text-white">
        <img
          src="/hero.png"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,0.96),rgba(15,23,42,0.84),rgba(15,23,42,0.28))]"
          aria-hidden="true"
        />

        <div className="relative mx-auto grid min-h-[74vh] max-w-7xl content-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold !text-teal-100 backdrop-blur">
              <Sparkles className="size-4" aria-hidden="true" />
              AIISH Hack'A'Comm 2026 finalist prototype
            </div>
            <h1 className="max-w-4xl font-['Outfit'] text-4xl font-extrabold leading-[1.04] tracking-normal !text-white sm:text-6xl lg:text-7xl">
              Clinical aphasia rehab that speaks the language of home.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 !text-slate-100 sm:text-xl">
              VerbalBridge brings evidence-informed aphasia practice, adaptive cueing,
              multilingual stimuli, and clinician-readable progress into one calm
              patient-first interface.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                className="min-h-14 rounded-full bg-teal-500 px-6 text-base font-extrabold text-slate-950 shadow-xl shadow-teal-950/30 transition hover:bg-teal-300"
                onClick={onStartTherapy}
              >
                Start patient therapy
                <ArrowRight className="size-5" aria-hidden="true" />
              </button>
              <button
                className="min-h-14 rounded-full border border-white/25 bg-white/10 px-6 text-base font-extrabold !text-white backdrop-blur transition hover:bg-white/18"
                onClick={onOpenClinician}
              >
                View clinician dashboard
                <LineChart className="size-5" aria-hidden="true" />
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="self-end lg:self-center"
          >
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-lg border border-white/18 bg-slate-950/55 p-4 shadow-xl shadow-slate-950/20 backdrop-blur-md"
                >
                  <div className="font-['Outfit'] text-3xl font-extrabold !text-white">
                    {metric.value}
                  </div>
                  <div className="mt-1 text-sm font-bold uppercase tracking-normal !text-teal-100">
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-4">
          {trustPoints.map((item) => (
            <div
              className="flex min-h-16 items-center gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
              key={item}
            >
              <CheckCircle2 className="size-5 shrink-0 text-teal-600" aria-hidden="true" />
              <span className="text-sm font-extrabold text-slate-800">{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-extrabold uppercase tracking-normal text-teal-700">
            Evidence-based approach
          </p>
          <h2 className="mt-3 font-['Outfit'] text-3xl font-extrabold tracking-normal text-slate-950 sm:text-5xl">
            Built for measured, repeatable clinical practice.
          </h2>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {evidenceCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.article
                key={card.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
                whileHover={{ y: -4 }}
                className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className={`mb-5 inline-grid size-12 place-items-center rounded-lg ring-1 ${card.tone}`}>
                  <Icon className="size-6" aria-hidden="true" />
                </div>
                <h3 className="font-['Outfit'] text-xl font-extrabold tracking-normal text-slate-950">
                  {card.title}
                </h3>
                <p className="mt-3 text-base leading-7 text-slate-600">{card.body}</p>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-normal text-teal-700">
              Practical for India
            </p>
            <h2 className="mt-3 font-['Outfit'] text-3xl font-extrabold tracking-normal text-slate-950 sm:text-5xl">
              Designed around access, language, and family support.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              The interface keeps screens simple for patients and gives SLPs
              structured controls for multilingual, culturally familiar practice.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {indiaHighlights.map((item) => {
              const Icon = item.icon;
              return (
                <motion.article
                  key={item.title}
                  whileHover={{ y: -3 }}
                  className="rounded-lg border border-slate-200 bg-[#f8fafc] p-5"
                >
                  <Icon className="size-8 text-slate-900" aria-hidden="true" />
                  <h3 className="mt-5 font-['Outfit'] text-lg font-extrabold tracking-normal text-slate-950">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{item.body}</p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.84fr_1.16fr]">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-normal text-teal-700">
              Clinical modules
            </p>
            <h2 className="mt-3 font-['Outfit'] text-3xl font-extrabold tracking-normal text-slate-950 sm:text-5xl">
              A complete therapy workflow without visual noise.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Each module heading maps to a real rehabilitation activity, so the
              platform remains easy to explain in a clinical demo or family setting.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {moduleCards.map((module, index) => {
              const Icon = module.icon;
              return (
                <motion.article
                  key={module.title}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.32, delay: index * 0.04 }}
                  className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <Icon className="size-8 text-slate-950" aria-hidden="true" />
                  <h3 className="mt-5 font-['Outfit'] text-lg font-extrabold tracking-normal text-slate-950">
                    {module.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{module.body}</p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-950">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-normal !text-teal-200">
              Progress tick bars
            </p>
            <h2 className="mt-3 font-['Outfit'] text-3xl font-extrabold tracking-normal !text-white sm:text-5xl">
              A quieter way to show clinical readiness.
            </h2>
            <p className="mt-5 text-lg leading-8 !text-slate-100">
              These bars communicate the therapy pathway without the distracting
              moving ticker. Use the folder <span className="font-extrabold !text-white">public/clinical-media</span>
              for approved cabin images or session videos when available.
            </p>
          </div>

          <div className="rounded-lg border border-white/15 bg-white/10 p-6 backdrop-blur">
            <div className="space-y-5">
              {workflowBars.map((item) => (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between gap-4">
                    <span className="text-sm font-extrabold !text-white">{item.label}</span>
                    <span className="text-xs font-extrabold uppercase !text-teal-100">
                      {item.value}% ready
                    </span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-white/15">
                    <motion.div
                      className={`h-full rounded-full ${item.color}`}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${item.value}%` }}
                      viewport={{ once: true, amount: 0.45 }}
                      transition={{ duration: 0.7 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
