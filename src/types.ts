export type LangCode = 'en' | 'kn' | 'hi' | 'ml' | 'ta' | 'te';

export type AphasiaType =
  | 'broca'
  | 'wernicke'
  | 'anomic'
  | 'global'
  | 'conduction'
  | 'transcortical';

export type ModuleId = 'cilt' | 'cueing' | 'comprehension';

export type CueLevel = 'unaided' | 'semantic' | 'phonological' | 'model';

export type Outcome = 'produced' | 'approximated' | 'not-attempted';

export interface StimulusItem {
  id: string;
  word: string;
  translit?: string;
  emoji: string;
  semanticCue: string;
  phonologicalCue: string;
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
  timestamp: number;
}

export interface TherapySession {
  lang: LangCode;
  aphasia: AphasiaType;
  startedAt: number;
  entries: SessionEntry[];
}
