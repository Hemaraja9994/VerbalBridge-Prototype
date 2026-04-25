/**
 * AI-personalised cues — uses an LLM to generate culturally-relevant
 * semantic cues for stimuli, tailored to the patient's region/language.
 *
 * Provider: Pollinations.ai text endpoint (free, no API key, OpenAI-compatible).
 * Falls back gracefully when offline. Caches successful responses in
 * localStorage so re-asking the same question is instant and offline-safe.
 */

import type { LangCode } from '../types';

const CACHE_KEY = 'verbalbridge-ai-cues-v1';
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

interface CacheEntry {
  text: string;
  ts: number;
}
type Cache = Record<string, CacheEntry>;

const LANG_NAME: Record<LangCode, string> = {
  en: 'English',
  kn: 'Kannada',
  hi: 'Hindi',
  ml: 'Malayalam',
  ta: 'Tamil',
  te: 'Telugu',
};

function loadCache(): Cache {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Cache;
  } catch (_) {
    return {};
  }
}

function saveCache(c: Cache) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(c));
  } catch (_) {
    // ignore
  }
}

function makeKey(lang: LangCode, word: string, kind: string, context: string): string {
  return `${lang}|${kind}|${word}|${context}`;
}

function readCache(key: string): string | null {
  const c = loadCache();
  const e = c[key];
  if (!e) return null;
  if (Date.now() - e.ts > CACHE_TTL_MS) return null;
  return e.text;
}

function writeCache(key: string, text: string) {
  const c = loadCache();
  c[key] = { text, ts: Date.now() };
  saveCache(c);
}

export interface PersonalisedCueRequest {
  lang: LangCode;
  word: string;
  /** Cultural / personal context, e.g. "rural Karnataka, 65 year old farmer". */
  context?: string;
  /** Type of cue to regenerate. */
  kind: 'semantic' | 'phonological' | 'gesture';
}

export interface PersonalisedCueResult {
  text: string;
  cached: boolean;
  source: 'llm' | 'cache' | 'fallback';
}

function buildPrompt(req: PersonalisedCueRequest): string {
  const langName = LANG_NAME[req.lang];
  const contextLine = req.context
    ? `The patient context: ${req.context}.`
    : 'The patient is an adult Indian aphasia patient.';
  if (req.kind === 'semantic') {
    return `You are a Speech-Language Pathologist creating a SEMANTIC cue for an aphasia patient who is trying to retrieve the word "${req.word}" in ${langName}.
${contextLine}
Write ONE short, vivid, culturally-relevant semantic cue in ${langName} (10-14 words). Describe its function, appearance, or where it is found in everyday Indian life. Do NOT use the target word itself. Do NOT use English unless the language is English. Output ONLY the cue sentence — no preamble, no quotes, no explanations.`;
  }
  if (req.kind === 'phonological') {
    return `You are a Speech-Language Pathologist creating a PHONOLOGICAL cue for an aphasia patient retrieving the word "${req.word}" in ${langName}.
${contextLine}
Write ONE short phonological hint in ${langName} (8-10 words). Mention the first sound or syllable, plus a word that rhymes or starts the same. Do NOT say the full target word. Output ONLY the cue sentence.`;
  }
  return `Describe an everyday GESTURE in ${langName} (10-14 words) that helps an aphasia patient access the word "${req.word}". Make it physically simple and culturally appropriate for India. Output ONLY the gesture description, in second person ("Mime…", "Cup your hand…").`;
}

/**
 * Fetch a personalised cue from the LLM, with caching + graceful failure.
 */
export async function fetchPersonalisedCue(
  req: PersonalisedCueRequest
): Promise<PersonalisedCueResult> {
  const key = makeKey(req.lang, req.word, req.kind, req.context ?? '');
  const cached = readCache(key);
  if (cached) {
    return { text: cached, cached: true, source: 'cache' };
  }

  const prompt = buildPrompt(req);

  try {
    // Pollinations text API — no auth, just URL-encode the prompt.
    // We pass system=therapy + model=openai for slightly better instruction adherence.
    const url =
      `https://text.pollinations.ai/${encodeURIComponent(prompt)}` +
      `?model=openai&temperature=0.7`;
    const ctrl = new AbortController();
    const tm = setTimeout(() => ctrl.abort(), 9000);
    const res = await fetch(url, { signal: ctrl.signal });
    clearTimeout(tm);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const raw = (await res.text()).trim();
    // Sanitize: drop any leading/trailing quotes or label noise the model might add.
    const cleaned = raw
      .replace(/^["'`]+|["'`]+$/g, '')
      .replace(/^(Cue|Hint|Output|Semantic cue|Gesture)[:\-]\s*/i, '')
      .trim();
    if (cleaned.length < 3) throw new Error('empty response');
    writeCache(key, cleaned);
    return { text: cleaned, cached: false, source: 'llm' };
  } catch (err) {
    console.warn('[aiCues] LLM call failed:', err);
    return {
      text: '',
      cached: false,
      source: 'fallback',
    };
  }
}

export function clearAiCueCache(): void {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch (_) {
    // ignore
  }
}
