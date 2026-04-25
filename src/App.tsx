import { useState } from 'react';
import './App.css';
import WelcomeSplash from './components/WelcomeSplash';
import LanguagePicker from './components/LanguagePicker';
import AphasiaProfile from './components/AphasiaProfile';
import TherapyHub from './components/TherapyHub';
import CILTDrill from './components/CILTDrill';
import CueingHierarchy from './components/CueingHierarchy';
import ComprehensionPractice from './components/ComprehensionPractice';
import GestureTherapy from './components/GestureTherapy';
import VoiceBank from './components/VoiceBank';
import ProgressDashboard from './components/ProgressDashboard';
import { useSpeech } from './hooks/useSpeech';
import { LANG_META } from './i18n/ui';
import type { AphasiaType, LangCode, ModuleId, SessionEntry } from './types';

type Screen =
  | 'welcome'
  | 'language'
  | 'aphasia'
  | 'hub'
  | 'module-cilt'
  | 'module-cueing'
  | 'module-comprehension'
  | 'module-gesture'
  | 'voice-bank'
  | 'session-complete'
  | 'progress';

function App() {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [lang, setLang] = useState<LangCode>('en');
  const [aphasia, setAphasia] = useState<AphasiaType>('broca');
  const [allEntries, setAllEntries] = useState<SessionEntry[]>([]);
  const [lastSessionCount, setLastSessionCount] = useState(0);

  const { hasVoiceForLang } = useSpeech(lang);

  const handleLang = (l: LangCode) => {
    setLang(l);
    setScreen('aphasia');
  };

  const handleAphasia = (a: AphasiaType) => {
    setAphasia(a);
    setScreen('hub');
  };

  const handleModule = (m: ModuleId) => {
    if (m === 'cilt') setScreen('module-cilt');
    else if (m === 'cueing') setScreen('module-cueing');
    else if (m === 'comprehension') setScreen('module-comprehension');
    else if (m === 'gesture') setScreen('module-gesture');
  };

  const handleSessionDone = (entries: SessionEntry[]) => {
    setAllEntries((prev) => [...prev, ...entries]);
    setLastSessionCount(entries.length);
    setScreen('session-complete');
  };

  const changeLanguage = () => {
    setScreen('language');
  };

  const goHome = () => {
    setScreen('welcome');
  };

  return (
    <div className="app-container">
      <header className="main-header">
        <div className="container flex items-center justify-between">
          <button className="logo logo-button" onClick={goHome} aria-label="Home">
            <span className="logo-accent">Verbal</span>Bridge
          </button>
          <div className="header-right">
            <button className="lang-chip" onClick={changeLanguage}>
              🌐 {LANG_META[lang].native}
            </button>
          </div>
        </div>
      </header>

      <main className="container main-content">
        {screen === 'welcome' && (
          <WelcomeSplash onStart={() => setScreen('language')} />
        )}

        {screen === 'language' && <LanguagePicker onSelect={handleLang} />}

        {screen === 'aphasia' && (
          <AphasiaProfile
            lang={lang}
            onSelect={handleAphasia}
            onBack={() => setScreen('language')}
          />
        )}

        {screen === 'hub' && (
          <>
            {!hasVoiceForLang && (
              <div className="tts-warn">
                ⚠ No on-device voice found for {LANG_META[lang].label}. Record
                familiar voices in the Voice Bank to bridge the gap.
              </div>
            )}
            <TherapyHub
              lang={lang}
              aphasia={aphasia}
              onSelectModule={handleModule}
              onOpenVoiceBank={() => setScreen('voice-bank')}
              onOpenProgress={() => setScreen('progress')}
              onBack={() => setScreen('aphasia')}
            />
          </>
        )}

        {screen === 'module-cilt' && (
          <CILTDrill
            lang={lang}
            onComplete={handleSessionDone}
            onBack={() => setScreen('hub')}
          />
        )}

        {screen === 'module-cueing' && (
          <CueingHierarchy
            lang={lang}
            onComplete={handleSessionDone}
            onBack={() => setScreen('hub')}
          />
        )}

        {screen === 'module-comprehension' && (
          <ComprehensionPractice
            lang={lang}
            onComplete={handleSessionDone}
            onBack={() => setScreen('hub')}
          />
        )}

        {screen === 'module-gesture' && (
          <GestureTherapy
            lang={lang}
            onComplete={handleSessionDone}
            onBack={() => setScreen('hub')}
          />
        )}

        {screen === 'voice-bank' && (
          <VoiceBank lang={lang} onBack={() => setScreen('hub')} />
        )}

        {screen === 'session-complete' && (
          <section className="screen animate-fade-in text-center">
            <div className="session-complete-card animate-pop">
              <div className="big-check">✅</div>
              <h2>Session complete</h2>
              <p className="muted mt-sm">
                {lastSessionCount} items practised this round. Great work — every
                repetition strengthens neural pathways.
              </p>
              <div className="flex justify-center gap-md mt-lg">
                <button className="primary" onClick={() => setScreen('progress')}>
                  📊 View progress
                </button>
                <button className="secondary" onClick={() => setScreen('hub')}>
                  Back to therapy hub
                </button>
              </div>
            </div>
          </section>
        )}

        {screen === 'progress' && (
          <ProgressDashboard
            lang={lang}
            entries={allEntries}
            onBack={() => setScreen('hub')}
          />
        )}
      </main>

      <footer className="main-footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-info">
              <div className="logo white">
                <span className="logo-accent">Verbal</span>Bridge
              </div>
              <p className="mt-md">
                AI-based adaptive speech regeneration for persons with aphasia.
                Neuroplasticity-based therapy, guided by SLP, delivered in the mother tongue.
              </p>
            </div>
            <div className="footer-languages">
              <h4>Therapy languages</h4>
              <div className="language-tags mt-sm">
                <span>English</span> <span>ಕನ್ನಡ</span> <span>हिन्दी</span>
                <span>മലയാളം</span> <span>தமிழ்</span> <span>తెలుగు</span>
              </div>
            </div>
          </div>
          <div className="footer-bottom mt-xl text-center">
            <p>
              © 2026 VerbalBridge · Hack'A'Comm 2026 · AIISH Mysore · Mr. Hemaraja Nayaka S
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
