import { useMemo, useState } from 'react';
import { BarChart3, CheckCircle2 } from 'lucide-react';
import './App.css';
import LanguagePicker from './components/LanguagePicker';
import AphasiaProfile from './components/AphasiaProfile';
import TherapyHub from './components/TherapyHub';
import CILTDrill from './components/CILTDrill';
import CueingHierarchy from './components/CueingHierarchy';
import ComprehensionPractice from './components/ComprehensionPractice';
import GestureTherapy from './components/GestureTherapy';
import VoiceBank from './components/VoiceBank';
import ProgressDashboard from './components/ProgressDashboard';
import AppShell from './components/layout/AppShell';
import LandingPage from './components/landing/LandingPage';
import ClinicianDashboard from './components/clinician/ClinicianDashboard';
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
  | 'progress'
  | 'clinician-dashboard';

function App() {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [lang, setLang] = useState<LangCode>('en');
  const [aphasia, setAphasia] = useState<AphasiaType>('broca');
  const [allEntries, setAllEntries] = useState<SessionEntry[]>([]);
  const [lastSessionCount, setLastSessionCount] = useState(0);

  const { hasVoiceForLang } = useSpeech(lang);

  const activeSection = useMemo(() => {
    if (screen === 'welcome') return 'landing';
    if (screen === 'clinician-dashboard') return 'clinician';
    return 'patient';
  }, [screen]);

  const handleLang = (nextLang: LangCode) => {
    setLang(nextLang);
    setScreen('aphasia');
  };

  const handleAphasia = (nextAphasia: AphasiaType) => {
    setAphasia(nextAphasia);
    setScreen('hub');
  };

  const handleModule = (moduleId: ModuleId) => {
    if (moduleId === 'cilt') setScreen('module-cilt');
    else if (moduleId === 'cueing') setScreen('module-cueing');
    else if (moduleId === 'comprehension') setScreen('module-comprehension');
    else if (moduleId === 'gesture') setScreen('module-gesture');
  };

  const handleSessionDone = (entries: SessionEntry[]) => {
    setAllEntries((prev) => [...prev, ...entries]);
    setLastSessionCount(entries.length);
    setScreen('session-complete');
  };

  const openPatientFlow = () => {
    setScreen(allEntries.length > 0 ? 'hub' : 'language');
  };

  return (
    <AppShell
      activeSection={activeSection}
      lang={lang}
      onChangeLanguage={() => setScreen('language')}
      onOpenClinician={() => setScreen('clinician-dashboard')}
      onOpenHome={() => setScreen('welcome')}
      onOpenPatient={openPatientFlow}
    >
      {screen === 'welcome' && (
        <LandingPage
          onOpenClinician={() => setScreen('clinician-dashboard')}
          onStartTherapy={() => setScreen('language')}
        />
      )}

      {screen === 'clinician-dashboard' && (
        <ClinicianDashboard
          aphasia={aphasia}
          entries={allEntries}
          lang={lang}
          onBack={() => setScreen('hub')}
        />
      )}

      {screen !== 'welcome' && screen !== 'clinician-dashboard' && (
        <main className="container main-content">
          {screen === 'language' && <LanguagePicker onSelect={handleLang} />}

          {screen === 'aphasia' && (
            <AphasiaProfile
              lang={lang}
              onBack={() => setScreen('language')}
              onSelect={handleAphasia}
            />
          )}

          {screen === 'hub' && (
            <>
              {!hasVoiceForLang && (
                <div className="tts-warn">
                  No on-device voice found for {LANG_META[lang].label}. Record
                  familiar voices in the Voice Bank to bridge the gap.
                </div>
              )}
              <TherapyHub
                aphasia={aphasia}
                lang={lang}
                onBack={() => setScreen('aphasia')}
                onOpenProgress={() => setScreen('progress')}
                onOpenVoiceBank={() => setScreen('voice-bank')}
                onSelectModule={handleModule}
              />
            </>
          )}

          {screen === 'module-cilt' && (
            <CILTDrill
              lang={lang}
              onBack={() => setScreen('hub')}
              onComplete={handleSessionDone}
            />
          )}

          {screen === 'module-cueing' && (
            <CueingHierarchy
              lang={lang}
              onBack={() => setScreen('hub')}
              onComplete={handleSessionDone}
            />
          )}

          {screen === 'module-comprehension' && (
            <ComprehensionPractice
              lang={lang}
              onBack={() => setScreen('hub')}
              onComplete={handleSessionDone}
            />
          )}

          {screen === 'module-gesture' && (
            <GestureTherapy
              lang={lang}
              onBack={() => setScreen('hub')}
              onComplete={handleSessionDone}
            />
          )}

          {screen === 'voice-bank' && (
            <VoiceBank lang={lang} onBack={() => setScreen('hub')} />
          )}

          {screen === 'session-complete' && (
            <section className="screen animate-fade-in text-center">
              <div className="session-complete-card animate-pop">
                <CheckCircle2 className="mx-auto size-16 text-teal-600" aria-hidden="true" />
                <h2 className="mt-md">Session complete</h2>
                <p className="muted mt-sm">
                  {lastSessionCount} items practiced this round. Every repetition
                  adds useful clinical signal for the next adaptive session.
                </p>
                <div className="mt-lg flex flex-wrap justify-center gap-md">
                  <button className="primary" onClick={() => setScreen('clinician-dashboard')}>
                    <BarChart3 className="size-5" aria-hidden="true" />
                    Clinician dashboard
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
              entries={allEntries}
              lang={lang}
              onBack={() => setScreen('hub')}
            />
          )}
        </main>
      )}
    </AppShell>
  );
}

export default App;
