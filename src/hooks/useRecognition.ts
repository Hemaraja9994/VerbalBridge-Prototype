import { useCallback, useEffect, useRef, useState } from 'react';
import { LANG_META } from '../i18n/ui';
import type { LangCode } from '../types';

// Minimal type surface for the Web Speech API (not in lib.dom for older TS)
type SpeechRecognitionResult = {
  transcript: string;
  confidence: number;
};
type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((e: { results: ArrayLike<ArrayLike<SpeechRecognitionResult>> }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

function getRecognitionCtor(): (new () => SpeechRecognitionLike) | null {
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  };
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

/** Levenshtein distance — used to grade approximate speech production. */
export function editDistance(a: string, b: string): number {
  const x = a.toLocaleLowerCase().trim();
  const y = b.toLocaleLowerCase().trim();
  if (x === y) return 0;
  const m = x.length;
  const n = y.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const prev = new Array(n + 1).fill(0).map((_, i) => i);
  const curr = new Array(n + 1).fill(0);
  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = x.charCodeAt(i - 1) === y.charCodeAt(j - 1) ? 0 : 1;
      curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
    }
    for (let j = 0; j <= n; j++) prev[j] = curr[j];
  }
  return curr[n];
}

export interface AsrResult {
  transcript: string;
  confidence: number;
  distance: number;
  score: 'produced' | 'approximated' | 'not-attempted';
}

/** Auto-grade an ASR transcript against a target word. */
export function gradeAttempt(target: string, transcript: string, confidence: number): AsrResult {
  if (!transcript || !transcript.trim()) {
    return { transcript: '', confidence, distance: -1, score: 'not-attempted' };
  }
  const distance = editDistance(target, transcript);
  // Lenient scoring: short words are forgiving; long words allow proportional slack.
  const slack = Math.max(2, Math.floor(target.length * 0.34));
  let score: AsrResult['score'];
  if (distance === 0) score = 'produced';
  else if (distance <= slack && confidence >= 0.4) score = 'produced';
  else if (distance <= slack * 2) score = 'approximated';
  else score = 'approximated'; // any audible attempt counts as approximated, not "not attempted"
  return { transcript, confidence, distance, score };
}

/** React hook wrapping the Web Speech API SpeechRecognition. */
export function useRecognition(lang: LangCode) {
  const [supported] = useState(() => getRecognitionCtor() !== null);
  const [listening, setListening] = useState(false);
  const recRef = useRef<SpeechRecognitionLike | null>(null);

  // Stop on unmount or language change
  useEffect(() => {
    return () => {
      try {
        recRef.current?.abort();
      } catch (_) {
        // ignore
      }
      recRef.current = null;
      setListening(false);
    };
  }, [lang]);

  const listen = useCallback(
    (target: string, timeoutMs = 5000): Promise<AsrResult> => {
      return new Promise((resolve) => {
        const Ctor = getRecognitionCtor();
        if (!Ctor) {
          resolve({
            transcript: '',
            confidence: 0,
            distance: -1,
            score: 'not-attempted',
          });
          return;
        }
        try {
          recRef.current?.abort();
        } catch (_) {
          // ignore
        }
        const rec = new Ctor();
        rec.lang = LANG_META[lang].bcp47;
        rec.continuous = false;
        rec.interimResults = false;
        rec.maxAlternatives = 3;

        let settled = false;
        const finish = (r: AsrResult) => {
          if (settled) return;
          settled = true;
          setListening(false);
          recRef.current = null;
          resolve(r);
        };

        const timer = window.setTimeout(() => {
          try {
            rec.stop();
          } catch (_) {
            // ignore
          }
        }, timeoutMs);

        rec.onresult = (e) => {
          window.clearTimeout(timer);
          const alts = e.results[0];
          let best = { transcript: '', confidence: 0 };
          for (let i = 0; i < alts.length; i++) {
            const a = alts[i];
            if (a.confidence > best.confidence) best = a;
          }
          finish(gradeAttempt(target, best.transcript, best.confidence));
        };
        rec.onerror = () => {
          window.clearTimeout(timer);
          finish({ transcript: '', confidence: 0, distance: -1, score: 'not-attempted' });
        };
        rec.onend = () => {
          window.clearTimeout(timer);
          // If onresult never fired, treat as no attempt.
          finish({ transcript: '', confidence: 0, distance: -1, score: 'not-attempted' });
        };

        recRef.current = rec;
        try {
          rec.start();
          setListening(true);
        } catch (err) {
          console.warn('[useRecognition] start failed', err);
          finish({ transcript: '', confidence: 0, distance: -1, score: 'not-attempted' });
        }
      });
    },
    [lang]
  );

  const cancel = useCallback(() => {
    try {
      recRef.current?.abort();
    } catch (_) {
      // ignore
    }
    setListening(false);
  }, []);

  return { listen, cancel, listening, supported };
}
