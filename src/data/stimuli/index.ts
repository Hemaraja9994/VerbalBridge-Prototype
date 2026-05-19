import type { LangCode, LanguageStimuli } from '../../types';
import { buildStimuliForLanguage } from './expandedClinicalBank';

const REGISTRY: Record<LangCode, LanguageStimuli> = {
  en: buildStimuliForLanguage('en'),
  kn: buildStimuliForLanguage('kn'),
  hi: buildStimuliForLanguage('hi'),
  ml: buildStimuliForLanguage('ml'),
  ta: buildStimuliForLanguage('ta'),
  te: buildStimuliForLanguage('te'),
};

export function getStimuli(lang: LangCode): LanguageStimuli {
  return REGISTRY[lang];
}
