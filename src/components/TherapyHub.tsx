import React from 'react';
import { UI, APHASIA_LABELS } from '../i18n/ui';
import type { AphasiaType, LangCode, ModuleId } from '../types';
import { MODULE_MAP } from './AphasiaProfile';

interface Props {
  lang: LangCode;
  aphasia: AphasiaType;
  onSelectModule: (m: ModuleId) => void;
  onOpenProgress: () => void;
  onBack: () => void;
}

const MODULE_ICON: Record<ModuleId, string> = {
  cilt: '🗣️',
  cueing: '🪜',
  comprehension: '👂',
};

const TherapyHub: React.FC<Props> = ({
  lang,
  aphasia,
  onSelectModule,
  onOpenProgress,
  onBack,
}) => {
  const t = UI[lang];
  const recommended = MODULE_MAP[aphasia];
  const all: ModuleId[] = ['cilt', 'cueing', 'comprehension'];

  const moduleMeta: Record<ModuleId, { title: string; desc: string }> = {
    cilt: { title: t.cilt, desc: t.ciltDesc },
    cueing: { title: t.cueing, desc: t.cueingDesc },
    comprehension: { title: t.comprehension, desc: t.comprehensionDesc },
  };

  return (
    <section className="screen animate-fade-in">
      <button className="back-btn" onClick={onBack}>
        ← {t.back}
      </button>
      <h2 className="screen-title">{t.therapyHub}</h2>
      <p className="screen-subtitle">{APHASIA_LABELS[lang][aphasia]}</p>

      <div className="module-grid mt-xl">
        {all.map((m) => {
          const isRec = recommended.includes(m);
          return (
            <button
              key={m}
              className={`glass-card module-card ${isRec ? 'recommended' : ''}`}
              onClick={() => onSelectModule(m)}
            >
              <div className="module-icon">{MODULE_ICON[m]}</div>
              <h3>{moduleMeta[m].title}</h3>
              <p>{moduleMeta[m].desc}</p>
              {isRec && <span className="badge-rec">★ Recommended</span>}
            </button>
          );
        })}
      </div>

      <div className="future-scope mt-xl">
        <h3 className="future-title">{t.futureScope}</h3>
        <div className="future-grid">
          <div className="glass-card future-tile disabled">
            <div className="module-icon">🎙️</div>
            <h4>{t.voiceClone}</h4>
            <p>Coqui YourTTS — pre-morbid voice restoration</p>
            <span className="badge-soon">{t.comingSoon}</span>
          </div>
          <div className="glass-card future-tile disabled">
            <div className="module-icon">✋</div>
            <h4>{t.gesture}</h4>
            <p>MediaPipe + CNN-LSTM — 8 clinical gestures</p>
            <span className="badge-soon">{t.comingSoon}</span>
          </div>
        </div>
      </div>

      <div className="hub-actions mt-lg">
        <button className="secondary" onClick={onOpenProgress}>
          📊 {t.progress}
        </button>
      </div>
    </section>
  );
};

export default TherapyHub;
