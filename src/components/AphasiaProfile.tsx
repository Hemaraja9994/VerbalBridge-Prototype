import React from 'react';
import { APHASIA_LABELS, UI } from '../i18n/ui';
import type { AphasiaType, LangCode, ModuleId } from '../types';

interface Props {
  lang: LangCode;
  onSelect: (aphasia: AphasiaType) => void;
  onBack: () => void;
}

const TYPES: AphasiaType[] = [
  'broca',
  'wernicke',
  'anomic',
  'global',
  'conduction',
  'transcortical',
];

const ICONS: Record<AphasiaType, string> = {
  broca: '🧠',
  wernicke: '👂',
  anomic: '🔎',
  global: '🌐',
  conduction: '🔁',
  transcortical: '🪞',
};

export const MODULE_MAP: Record<AphasiaType, ModuleId[]> = {
  broca: ['cilt', 'cueing'],
  wernicke: ['comprehension', 'cueing'],
  anomic: ['cueing', 'cilt'],
  global: ['comprehension', 'cilt'],
  conduction: ['cilt', 'cueing'],
  transcortical: ['cilt', 'cueing'],
};

const AphasiaProfile: React.FC<Props> = ({ lang, onSelect, onBack }) => {
  const t = UI[lang];
  const labels = APHASIA_LABELS[lang];

  return (
    <section className="screen animate-fade-in">
      <button className="back-btn" onClick={onBack}>
        ← {t.back}
      </button>
      <h2 className="screen-title">{t.chooseAphasia}</h2>
      <div className="aphasia-grid mt-lg">
        {TYPES.map((type) => (
          <button
            key={type}
            className="glass-card aphasia-tile"
            onClick={() => onSelect(type)}
          >
            <div className="aphasia-icon">{ICONS[type]}</div>
            <div className="aphasia-label">{labels[type]}</div>
          </button>
        ))}
      </div>
    </section>
  );
};

export default AphasiaProfile;
