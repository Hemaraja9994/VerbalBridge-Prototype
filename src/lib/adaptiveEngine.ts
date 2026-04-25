/**
 * Adaptive Cueing Engine — predicts the optimal starting cue level for each
 * stimulus based on the patient's history.
 *
 * Algorithm:
 *  - Each item has a per-patient cue history: { itemId -> recent cue levels needed }
 *  - For each item we keep the last N (default 5) cue levels needed.
 *  - Predicted starting step = max(0, mode(last N) - 1)
 *      i.e. start *one rung below* what they typically need, so we give them
 *      a chance to perform unaided/cued at a lower level (challenge principle).
 *  - If no history exists, start at 0 (unaided) — standard Howard 1985 protocol.
 *
 * This is rule-based "AI" — interpretable, explainable, no training data required.
 * Storage: localStorage (lightweight, persists across sessions, no backend).
 */

import type { CueLevel } from '../types';

const STORAGE_KEY = 'verbalbridge-adaptive-history-v1';
const HISTORY_WINDOW = 5;

export const CUE_ORDER: CueLevel[] = [
  'unaided',
  'gesture',
  'semantic',
  'phonological',
  'model',
];

const cueLevelToIndex = (lvl: CueLevel): number => CUE_ORDER.indexOf(lvl);
const indexToCueLevel = (i: number): CueLevel =>
  CUE_ORDER[Math.max(0, Math.min(CUE_ORDER.length - 1, i))];

type History = Record<string, CueLevel[]>; // itemId -> recent cue levels

function loadHistory(): History {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as History;
  } catch (_) {
    return {};
  }
}

function saveHistory(h: History) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(h));
  } catch (_) {
    // ignore quota errors
  }
}

/**
 * Record that an item was successfully responded to AT a given cue level.
 * This means the patient produced/approximated the word with this level of help.
 */
export function recordCueOutcome(itemId: string, cueLevel: CueLevel): void {
  const h = loadHistory();
  const list = h[itemId] ?? [];
  list.push(cueLevel);
  while (list.length > HISTORY_WINDOW) list.shift();
  h[itemId] = list;
  saveHistory(h);
}

/** Statistical mode (most frequent value) of cue levels needed for an item. */
function modeIndex(levels: CueLevel[]): number {
  if (levels.length === 0) return 0;
  const counts = new Array(CUE_ORDER.length).fill(0);
  levels.forEach((l) => {
    counts[cueLevelToIndex(l)]++;
  });
  let bestI = 0;
  let bestC = counts[0];
  for (let i = 1; i < counts.length; i++) {
    if (counts[i] > bestC) {
      bestC = counts[i];
      bestI = i;
    }
  }
  return bestI;
}

/**
 * Predict the starting cue step (index into CUE_ORDER) for an item.
 * Returns 0 (unaided) when no history exists.
 */
export function predictStartCueStep(itemId: string): {
  step: number;
  level: CueLevel;
  basis: 'no-history' | 'history';
  samples: number;
} {
  const h = loadHistory();
  const list = h[itemId] ?? [];
  if (list.length === 0) {
    return { step: 0, level: 'unaided', basis: 'no-history', samples: 0 };
  }
  const m = modeIndex(list);
  // Start one rung BELOW what they typically need — challenge principle.
  const step = Math.max(0, m - 1);
  return { step, level: indexToCueLevel(step), basis: 'history', samples: list.length };
}

/** Wipe all adaptive history (for resetting between patients). */
export function clearAdaptiveHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (_) {
    // ignore
  }
}

/** Read full history (for debugging / patient review). */
export function getAdaptiveSnapshot(): History {
  return loadHistory();
}
