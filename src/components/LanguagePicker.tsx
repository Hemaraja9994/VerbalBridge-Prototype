import React from 'react';
import { LANG_META } from '../i18n/ui';
import type { LangCode } from '../types';

interface Props {
  onSelect: (lang: LangCode) => void;
}

const ORDER: LangCode[] = ['en', 'kn', 'hi', 'ml', 'ta', 'te'];

const LanguagePicker: React.FC<Props> = ({ onSelect }) => {
  return (
    <section className="screen animate-fade-in">
      <h2 className="screen-title">Choose your language</h2>
      <p className="screen-subtitle">
        Therapy is delivered in the patient's mother tongue.
      </p>
      <div className="language-grid mt-xl">
        {ORDER.map((code) => (
          <button
            key={code}
            className="glass-card language-tile"
            onClick={() => onSelect(code)}
          >
            <div className="language-native">{LANG_META[code].native}</div>
            <div className="language-english">{LANG_META[code].label}</div>
          </button>
        ))}
      </div>
    </section>
  );
};

export default LanguagePicker;
