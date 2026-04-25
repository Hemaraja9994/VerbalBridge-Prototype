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
  timestamp: number;
}

export interface TherapySession {
  lang: LangCode;
  aphasia: AphasiaType;
  startedAt: number;
  entries: SessionEntry[];
}
