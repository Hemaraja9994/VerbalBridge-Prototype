export type LangCode = 'en' | 'kn' | 'hi' | 'ml' | 'ta' | 'te';

export type AphasiaType =
  | 'broca'
  | 'wernicke'
  | 'anomic'
  | 'global'
  | 'conduction'
  | 'transcortical';

export type ModuleId = 'cilt' | 'cueing' | 'comprehension' | 'gesture';

export type CueLevel =
  | 'unaided'
  | 'gesture'
  | 'semantic'
  | 'phonological'
  | 'model';

export type Outcome = 'produced' | 'approximated' | 'not-attempted';

export type VoiceSource = 'familiar' | 'tts' | 'none';

export interface StimulusItem {
  id: string;
  word: string;
  translit?: string;
  emoji: string;
  semanticCue: string;
  phonologicalCue: string;
  /** Short instruction for the gesture (in the stimulus language). */
  gesture: string;
  /** Single emoji depicting the gesture/action. */
  gestureEmoji: string;
  distractorEmojis?: string[];
}

export interface LanguageStimuli {
  lang: LangCode;
  items: StimulusItem[];
}

export interface SessionEntry {
  itemId: string;
  word: string;
  module: ModuleId;
  cueLevel: CueLevel;
  outcome: Outcome;
  /** Which voice was used as the model cue, if any. */
  voiceSource?: VoiceSource;
  /** Whether outcome was auto-graded by speech recognition vs manually tapped. */
  autoGraded?: boolean;
  /** ASR transcript of the patient's attempt, if recognition was used. */
  transcript?: string;
  /** ASR confidence (0..1). */
  asrConfidence?: number;
  /** Levenshtein edit distance between transcript and target word. */
  editDistance?: number;
  /** If the cue level was suggested by the adaptive engine. */
  adaptiveSuggested?: boolean;
  timestamp: number;
}

export interface TherapySession {
  lang: LangCode;
  aphasia: AphasiaType;
  startedAt: number;
  entries: SessionEntry[];
}
