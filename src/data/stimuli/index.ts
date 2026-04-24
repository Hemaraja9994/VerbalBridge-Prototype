import type { LangCode, LanguageStimuli } from '../../types';
import en from './en.json';
import kn from './kn.json';
import hi from './hi.json';
import ml from './ml.json';
import ta from './ta.json';
import te from './te.json';

const REGISTRY: Record<LangCode, LanguageStimuli> = {
  en: en as LanguageStimuli,
  kn: kn as LanguageStimuli,
  hi: hi as LanguageStimuli,
  ml: ml as LanguageStimuli,
  ta: ta as LanguageStimuli,
  te: te as LanguageStimuli,
};

export function getStimuli(lang: LangCode): LanguageStimuli {
  return REGISTRY[lang];
}
