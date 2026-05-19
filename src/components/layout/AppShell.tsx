import { Activity, BarChart3, Globe2, Home, Stethoscope } from 'lucide-react';
import { motion } from 'framer-motion';
import { LANG_META } from '../../i18n/ui';
import type { LangCode } from '../../types';
import { cn } from '../../utils/cn';

type AppSection = 'landing' | 'patient' | 'clinician';

interface AppShellProps {
  activeSection: AppSection;
  children: React.ReactNode;
  lang: LangCode;
  onChangeLanguage: () => void;
  onOpenClinician: () => void;
  onOpenHome: () => void;
  onOpenPatient: () => void;
}

const navItems = [
  { id: 'landing', label: 'Home', icon: Home },
  { id: 'patient', label: 'Therapy', icon: Activity },
  { id: 'clinician', label: 'Clinician', icon: BarChart3 },
] as const;

const clinicalNavClass =
  'min-h-11 rounded-full px-4 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500';

export default function AppShell({
  activeSection,
  children,
  lang,
  onChangeLanguage,
  onOpenClinician,
  onOpenHome,
  onOpenPatient,
}: AppShellProps) {
  const openSection = (section: AppSection) => {
    if (section === 'landing') onOpenHome();
    if (section === 'patient') onOpenPatient();
    if (section === 'clinician') onOpenClinician();
  };

  return (
    <div className="min-h-screen bg-[#eef3f7] text-slate-950">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/88 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <button
            className="group flex min-h-12 items-center gap-3 rounded-full px-2 pr-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500"
            onClick={onOpenHome}
            aria-label="Open VerbalBridge home"
          >
            <span className="grid size-11 place-items-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-900/20">
              <Stethoscope className="size-5" aria-hidden="true" />
            </span>
            <span className="leading-tight">
              <span className="block font-['Outfit'] text-lg font-extrabold tracking-normal text-slate-950">
                VerbalBridge
              </span>
              <span className="hidden text-xs font-bold uppercase tracking-[0.16em] text-teal-700 sm:block">
                Aphasia rehab
              </span>
            </span>
          </button>

          <nav className="hidden items-center rounded-full border border-slate-200 bg-slate-100/80 p-1 md:flex">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  className={cn(
                    clinicalNavClass,
                    'relative gap-2',
                    isActive ? 'text-white' : 'text-slate-700 hover:text-slate-950'
                  )}
                  onClick={() => openSection(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {isActive && (
                    <motion.span
                      layoutId="clinical-nav-pill"
                      className="absolute inset-0 rounded-full bg-slate-950 shadow-sm"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    />
                  )}
                  <span className="relative inline-flex items-center gap-2">
                    <Icon className="size-4" aria-hidden="true" />
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              className="min-h-11 rounded-full border border-slate-200 bg-white px-3 text-sm font-bold text-slate-800 shadow-sm transition hover:border-teal-300 hover:text-teal-800 sm:px-4"
              onClick={onChangeLanguage}
            >
              <Globe2 className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">{LANG_META[lang].native}</span>
            </button>
            <button
              className="hidden min-h-11 rounded-full bg-teal-600 px-4 text-sm font-extrabold text-white shadow-lg shadow-teal-700/20 transition hover:bg-teal-700 sm:inline-flex"
              onClick={onOpenPatient}
            >
              Start Session
            </button>
          </div>
        </div>

        <nav className="grid grid-cols-3 border-t border-slate-200 bg-white md:hidden">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                className={cn(
                  'min-h-14 flex-col gap-1 rounded-none text-xs font-bold',
                  isActive ? 'bg-slate-950 text-white' : 'text-slate-600'
                )}
                onClick={() => openSection(item.id)}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className="size-4" aria-hidden="true" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </header>

      <main>{children}</main>
    </div>
  );
}
