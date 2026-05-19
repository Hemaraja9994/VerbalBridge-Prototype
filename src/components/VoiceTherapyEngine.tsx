import { Component, type PropsWithChildren, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  LockKeyhole,
  Mic2,
  Play,
  ShieldCheck,
  Square,
  Volume2,
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import ConsentModal from './ConsentModal';

interface VoiceTherapyEngineProps {
  clinicianName?: string;
  defaultVoiceId?: string;
  initialText?: string;
  patientName?: string;
  therapyPhrases?: string[];
}

interface VoiceTherapyErrorBoundaryState {
  errorMessage: string;
  hasError: boolean;
}

const defaultPhrases = [
  'Namaste',
  'I want water',
  'I want tea',
  'Call my family',
  'I am feeling better',
  'Please help me speak slowly',
];

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export class VoiceTherapyEngineErrorBoundary extends Component<
  PropsWithChildren,
  VoiceTherapyErrorBoundaryState
> {
  state: VoiceTherapyErrorBoundaryState = {
    errorMessage: '',
    hasError: false,
  };

  static getDerivedStateFromError(error: Error): VoiceTherapyErrorBoundaryState {
    return {
      errorMessage: error.message || 'The voice therapy module could not load.',
      hasError: true,
    };
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="mx-auto max-w-3xl bg-slate-50 px-4 py-8 sm:px-6">
          <div className="rounded-lg border-2 border-rose-800 bg-white p-6 text-slate-900">
            <div className="flex gap-3">
              <AlertCircle className="mt-1 size-7 shrink-0 text-rose-800" aria-hidden="true" />
              <div>
                <h2 className="text-2xl font-extrabold leading-relaxed text-slate-900">
                  Voice restoration module paused
                </h2>
                <p className="mt-2 text-lg leading-relaxed text-slate-900">
                  {this.state.errorMessage}
                </p>
              </div>
            </div>
          </div>
        </section>
      );
    }

    return this.props.children;
  }
}

function getAudioContext() {
  const AudioContextConstructor =
    window.AudioContext ||
    (window as typeof window & { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;

  if (!AudioContextConstructor) {
    throw new Error('Web Audio API is not supported in this browser.');
  }

  return new AudioContextConstructor();
}

function VoiceTherapyEngineContent({
  clinicianName,
  defaultVoiceId,
  initialText = 'I want water',
  patientName,
  therapyPhrases = defaultPhrases,
}: VoiceTherapyEngineProps) {
  const configuredVoiceId =
    defaultVoiceId ?? import.meta.env.VITE_ELEVENLABS_VOICE_ID ?? '';
  const [voiceId, setVoiceId] = useState(configuredVoiceId);
  const [therapyText, setTherapyText] = useState(initialText);
  const [consentGranted, setConsentGranted] = useState(false);
  const [isConsentOpen, setIsConsentOpen] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);

  const canGenerate = useMemo(() => {
    return consentGranted && voiceId.trim().length > 0 && therapyText.trim().length > 0;
  }, [consentGranted, therapyText, voiceId]);

  useEffect(() => {
    return () => {
      sourceRef.current?.stop();
      sourceRef.current?.disconnect();
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        void audioContextRef.current.close();
      }
    };
  }, []);

  const stopAudio = () => {
    if (sourceRef.current) {
      try {
        sourceRef.current.stop();
      } catch {
        sourceRef.current.disconnect();
      }
      sourceRef.current = null;
    }
    setIsPlaying(false);
  };

  const playAudioBuffer = async (arrayBuffer: ArrayBuffer) => {
    stopAudio();

    const context = audioContextRef.current ?? getAudioContext();
    audioContextRef.current = context;

    if (context.state === 'suspended') {
      await context.resume();
    }

    const decodedAudio = await context.decodeAudioData(arrayBuffer.slice(0));
    const source = context.createBufferSource();
    const gain = context.createGain();

    gain.gain.value = 1;
    source.buffer = decodedAudio;
    source.connect(gain);
    gain.connect(context.destination);

    source.onended = () => {
      setIsPlaying(false);
      source.disconnect();
      gain.disconnect();
      if (sourceRef.current === source) {
        sourceRef.current = null;
      }
    };

    sourceRef.current = source;
    setIsPlaying(true);
    source.start(0);
  };

  const generateVoiceCue = async () => {
    if (!consentGranted) {
      setIsConsentOpen(true);
      return;
    }

    const text = therapyText.trim();
    const voice_id = voiceId.trim();

    if (!text || !voice_id) {
      setError('Add both the therapy text and the ElevenLabs voice ID.');
      return;
    }

    setError(null);
    setIsGenerating(true);

    try {
      const response = await fetch('/api/generate-voice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          consent_confirmed: true,
          text,
          voice_id,
        }),
      });

      if (!response.ok) {
        let message = 'Voice generation failed. Please try again.';
        try {
          const data = (await response.json()) as { error?: string };
          if (data.error) message = data.error;
        } catch {
          message = response.statusText || message;
        }
        throw new Error(message);
      }

      const audioData = await response.arrayBuffer();
      await playAudioBuffer(audioData);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Voice generation failed.');
      setIsPlaying(false);
    } finally {
      setIsGenerating(false);
    }
  };

  const unlockConsent = () => {
    setConsentGranted(true);
    setIsConsentOpen(false);
  };

  return (
    <section className="bg-slate-50 px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <ConsentModal
        clinicianName={clinicianName}
        isOpen={isConsentOpen}
        onCancel={() => setIsConsentOpen(false)}
        onConfirm={unlockConsent}
        patientName={patientName}
      />

      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div className="rounded-lg border-2 border-slate-300 bg-white p-5">
          <div className="flex items-start gap-4">
            <span className="grid size-16 shrink-0 place-items-center rounded-lg border-2 border-indigo-900 bg-indigo-700 text-white">
              <Mic2 className="size-8" aria-hidden="true" />
            </span>
            <div>
              <p className="text-lg font-extrabold uppercase tracking-normal text-indigo-800">
                Voice restoration module
              </p>
              <h2 className="mt-1 text-2xl font-extrabold leading-relaxed tracking-normal text-slate-900">
                Pre-morbid voice cueing for CILT
              </h2>
              <p className="mt-3 text-lg leading-relaxed text-slate-900">
                Generate short, supervised speech cues in the patient's cloned or
                restored voice. Keep phrases simple, functional, and clinically
                relevant to the therapy target.
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-lg border-2 border-indigo-700 bg-white p-4">
            <div className="flex items-center gap-3 text-lg font-extrabold text-slate-900">
              {consentGranted ? (
                <CheckCircle2 className="size-7 text-emerald-800" aria-hidden="true" />
              ) : (
                <LockKeyhole className="size-7 text-indigo-800" aria-hidden="true" />
              )}
              {consentGranted ? 'Consent confirmed' : 'Consent required'}
            </div>
            <p className="mt-2 text-lg leading-relaxed text-slate-900">
              The Generate Voice Cue button remains clinically locked until consent
              is confirmed by the responsible clinician.
            </p>
            <button
              type="button"
              className="mt-4 min-h-[60px] rounded-lg border-2 border-indigo-900 bg-white p-4 text-lg font-extrabold text-indigo-900 hover:bg-indigo-50 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-indigo-900"
              onClick={() => setIsConsentOpen(true)}
            >
              <ShieldCheck className="size-6" aria-hidden="true" />
              Review consent
            </button>
          </div>

          <div className="mt-5">
            <label className="block text-lg font-extrabold text-slate-900" htmlFor="voice-id">
              ElevenLabs cloned voice ID
            </label>
            <input
              id="voice-id"
              value={voiceId}
              onChange={(event) => setVoiceId(event.target.value)}
              placeholder="Paste the patient's ElevenLabs voice_id"
              className="mt-2 min-h-[60px] w-full rounded-lg border-2 border-slate-400 bg-white p-4 text-lg font-semibold leading-relaxed text-slate-900 outline-none placeholder:text-slate-700 focus:border-indigo-900 focus:ring-4 focus:ring-indigo-700"
            />
          </div>
        </div>

        <div className="rounded-lg border-2 border-slate-300 bg-white p-5">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-lg font-extrabold uppercase tracking-normal text-indigo-800">
                Patient therapy phrase
              </p>
              <h3 className="mt-1 text-2xl font-extrabold leading-relaxed tracking-normal text-slate-900">
                Choose or type the voice cue
              </h3>
            </div>
            <div className="rounded-lg border-2 border-slate-400 bg-slate-50 px-4 py-3 text-lg font-extrabold text-slate-900">
              CILT cue
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {therapyPhrases.map((phrase) => (
              <button
                key={phrase}
                type="button"
                className={cn(
                  'min-h-[60px] rounded-lg border-2 p-4 text-left text-lg font-extrabold leading-relaxed focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-indigo-900',
                  therapyText === phrase
                    ? 'border-indigo-900 bg-indigo-50 text-slate-900'
                    : 'border-slate-400 bg-white text-slate-900 hover:border-indigo-900 hover:bg-indigo-50'
                )}
                onClick={() => setTherapyText(phrase)}
              >
                {phrase}
              </button>
            ))}
          </div>

          <label className="mt-5 block text-lg font-extrabold text-slate-900" htmlFor="therapy-text">
            Custom therapy text
          </label>
          <textarea
            id="therapy-text"
            value={therapyText}
            onChange={(event) => setTherapyText(event.target.value)}
            rows={4}
            maxLength={600}
            className="mt-2 w-full resize-none rounded-lg border-2 border-slate-400 bg-white p-4 text-xl font-semibold leading-relaxed text-slate-900 outline-none placeholder:text-slate-700 focus:border-indigo-900 focus:ring-4 focus:ring-indigo-700"
          />
          <div className="mt-2 text-right text-lg font-extrabold text-slate-900">
            {therapyText.trim().length}/600 characters
          </div>

          <div className="mt-5 rounded-lg border-2 border-slate-300 bg-slate-50 p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <span
                  className={cn(
                    'grid size-16 place-items-center rounded-lg border-2 text-white',
                    isPlaying
                      ? 'border-indigo-950 bg-indigo-700'
                      : isGenerating
                        ? 'border-indigo-950 bg-indigo-800'
                        : 'border-slate-950 bg-slate-950'
                  )}
                >
                  {isGenerating ? (
                    <Loader2 className="size-8 animate-spin" aria-hidden="true" />
                  ) : isPlaying ? (
                    <Volume2 className="size-8" aria-hidden="true" />
                  ) : (
                    <Play className="size-8" aria-hidden="true" />
                  )}
                </span>
                <div>
                  <p className="text-xl font-extrabold leading-relaxed text-slate-900">
                    {isPlaying ? 'AI voice is speaking' : isGenerating ? 'Generating cue' : 'Ready for cue'}
                  </p>
                  <p className="text-lg leading-relaxed text-slate-900" aria-live="polite">
                    {isPlaying
                      ? 'Listen first. Then ask for the spoken response.'
                      : 'Use short cues for lower cognitive load.'}
                  </p>
                </div>
              </div>

              <div className="flex h-16 items-end gap-2" aria-hidden="true">
                {[0, 1, 2, 3, 4, 5].map((bar) => (
                  <motion.span
                    key={bar}
                    className="block w-3 rounded-full bg-indigo-700"
                    animate={{
                      height: isPlaying || isGenerating ? [18, 54, 28, 48, 18] : 18,
                      opacity: isPlaying || isGenerating ? [0.7, 1, 0.8] : 1,
                    }}
                    transition={{
                      duration: 0.85,
                      repeat: isPlaying || isGenerating ? Infinity : 0,
                      delay: bar * 0.07,
                    }}
                  />
                ))}
              </div>
            </div>

            {error && (
              <div className="mt-4 flex gap-3 rounded-lg border-2 border-rose-800 bg-white p-4 text-lg font-extrabold leading-relaxed text-rose-900">
                <AlertCircle className="mt-1 size-6 shrink-0" aria-hidden="true" />
                {error}
              </div>
            )}
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
            <button
              type="button"
              className="min-h-[72px] rounded-lg border-2 border-indigo-950 bg-indigo-700 p-4 text-xl font-extrabold text-white hover:bg-indigo-800 disabled:cursor-not-allowed disabled:border-slate-500 disabled:bg-slate-300 disabled:text-slate-900 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-indigo-950"
              disabled={!canGenerate || isGenerating}
              onClick={generateVoiceCue}
            >
              {isGenerating ? (
                <Loader2 className="size-7 animate-spin" aria-hidden="true" />
              ) : (
                <Play className="size-7" aria-hidden="true" />
              )}
              Generate Voice Cue
            </button>
            <button
              type="button"
              className="min-h-[72px] rounded-lg border-2 border-slate-700 bg-white p-4 text-lg font-extrabold text-slate-900 hover:bg-slate-100 disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-100 disabled:text-slate-500 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
              disabled={!isPlaying}
              onClick={stopAudio}
            >
              <Square className="size-6" aria-hidden="true" />
              Stop
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function VoiceTherapyEngine(props: VoiceTherapyEngineProps) {
  return (
    <VoiceTherapyEngineErrorBoundary>
      <VoiceTherapyEngineContent {...props} />
    </VoiceTherapyEngineErrorBoundary>
  );
}
