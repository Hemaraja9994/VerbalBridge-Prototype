import { useEffect, useId, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, FileText, LockKeyhole, ShieldCheck, X } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ConsentModalProps {
  clinicianName?: string;
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  patientName?: string;
}

const auditTerms = [
  'The patient, legal guardian, or authorized caregiver has explicitly consented to AI voice restoration for aphasia therapy.',
  'The cloned or restored voice will be used only for supervised rehabilitation cues and not for impersonation, messaging, diagnosis, or non-clinical communication.',
  'The clinician has explained that generated audio may not perfectly match the patient pre-morbid voice and may occasionally produce artifacts.',
  'The patient or representative understands how consent can be withdrawn and how therapy staff will stop using the restored voice if consent is withdrawn.',
  'The clinician confirms that generated phrases will be short, therapy-relevant, and free of unnecessary sensitive personal information.',
  'The ElevenLabs API key remains server-side only; no secret key is entered into or exposed through the browser.',
];

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function ConsentModal({
  clinicianName,
  isOpen,
  onCancel,
  onConfirm,
  patientName,
}: ConsentModalProps) {
  const [hasScrolledTerms, setHasScrolledTerms] = useState(false);
  const [hasConsent, setHasConsent] = useState(false);
  const consentId = useId();
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (isOpen) {
      setHasScrolledTerms(false);
      setHasConsent(false);
    }
  }, [isOpen]);

  const handleTermsScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const element = event.currentTarget;
    const distanceFromBottom =
      element.scrollHeight - element.scrollTop - element.clientHeight;
    if (distanceFromBottom <= 8) {
      setHasScrolledTerms(true);
    }
  };

  const handleConfirm = () => {
    if (!hasScrolledTerms || !hasConsent) return;
    onConfirm();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          aria-hidden={!isOpen}
          className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/90 px-4 py-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            className="w-full max-w-3xl overflow-hidden rounded-lg border-2 border-slate-900 bg-white"
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <div className="border-b-2 border-slate-900 bg-slate-950 px-5 py-5 text-white sm:px-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4">
                  <span className="grid size-14 shrink-0 place-items-center rounded-lg border-2 border-white bg-indigo-700 text-white">
                    <ShieldCheck className="size-7" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-base font-extrabold uppercase tracking-normal text-white">
                      Ethical audit gate
                    </p>
                    <h2
                      id={titleId}
                      className="mt-1 text-2xl font-extrabold leading-relaxed tracking-normal text-white"
                    >
                      Confirm documented consent before voice restoration
                    </h2>
                  </div>
                </div>
                <button
                  type="button"
                  aria-label="Close consent modal"
                  className="grid min-h-[60px] min-w-[60px] shrink-0 place-items-center rounded-lg border-2 border-white bg-slate-950 p-4 text-white hover:bg-slate-800 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-white"
                  onClick={onCancel}
                >
                  <X className="size-6" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="px-5 py-5 sm:px-6">
              <div
                id={descriptionId}
                className="rounded-lg border-2 border-amber-700 bg-amber-50 p-4 text-slate-900"
              >
                <div className="flex gap-3">
                  <AlertTriangle className="mt-1 size-6 shrink-0 text-amber-800" aria-hidden="true" />
                  <div>
                    <p className="text-lg font-extrabold leading-relaxed text-slate-900">
                      This is a clinical configuration screen, not a patient-facing therapy task.
                    </p>
                    <p className="mt-2 text-lg font-semibold leading-relaxed text-slate-900">
                      Voice cloning can be emotionally powerful. This module remains locked
                      until the clinician reads the terms and confirms documented consent.
                    </p>
                  </div>
                </div>
              </div>

              <dl className="mt-5 grid gap-3 rounded-lg border-2 border-slate-300 bg-slate-50 p-4 text-lg sm:grid-cols-2">
                <div>
                  <dt className="font-extrabold text-slate-900">Patient</dt>
                  <dd className="mt-1 font-extrabold text-slate-900">
                    {patientName?.trim() || 'Current therapy patient'}
                  </dd>
                </div>
                <div>
                  <dt className="font-extrabold text-slate-900">Responsible clinician</dt>
                  <dd className="mt-1 font-extrabold text-slate-900">
                    {clinicianName?.trim() || 'Logged-in clinician'}
                  </dd>
                </div>
              </dl>

              <div className="mt-5">
                <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2 text-lg font-extrabold text-slate-900">
                    <FileText className="size-6 text-indigo-700" aria-hidden="true" />
                    Consent and safety terms
                  </div>
                  <div
                    className={cn(
                      'rounded-lg border-2 px-4 py-2 text-base font-extrabold',
                      hasScrolledTerms
                        ? 'border-emerald-900 bg-emerald-100 text-emerald-950'
                        : 'border-slate-500 bg-white text-slate-900'
                    )}
                  >
                    {hasScrolledTerms ? 'Read complete' : 'Scroll required'}
                  </div>
                </div>

                <div
                  className="max-h-60 overflow-y-auto rounded-lg border-2 border-slate-400 bg-white p-4 text-lg leading-relaxed text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-700"
                  onScroll={handleTermsScroll}
                  tabIndex={0}
                >
                  <p className="font-extrabold text-slate-900">
                    Before accessing AI voice restoration, the clinician must verify:
                  </p>
                  <ol className="mt-4 space-y-4">
                    {auditTerms.map((term, index) => (
                      <li key={term} className="flex gap-3">
                        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-indigo-700 text-lg font-extrabold text-white">
                          {index + 1}
                        </span>
                        <span>{term}</span>
                      </li>
                    ))}
                  </ol>
                  <div className="mt-5 rounded-lg border-2 border-slate-900 bg-slate-950 p-4 text-white">
                    <p className="text-lg font-extrabold">Audit note</p>
                    <p className="mt-2 text-lg leading-relaxed text-white">
                      This UI gate supports ethical workflow discipline, but your
                      deployment should still maintain institutional consent records
                      according to local hospital policy and applicable law.
                    </p>
                  </div>
                </div>
              </div>

              <label
                htmlFor={consentId}
                className={cn(
                  'mt-5 flex gap-4 rounded-lg border-2 p-4',
                  hasScrolledTerms
                    ? 'cursor-pointer border-slate-900 bg-white hover:border-indigo-700 hover:bg-indigo-50'
                    : 'cursor-not-allowed border-slate-300 bg-slate-100'
                )}
              >
                <input
                  id={consentId}
                  type="checkbox"
                  checked={hasConsent}
                  disabled={!hasScrolledTerms}
                  onChange={(event) => setHasConsent(event.target.checked)}
                  className="mt-1 size-7 shrink-0 accent-indigo-700 disabled:cursor-not-allowed"
                />
                <span className="text-lg leading-relaxed text-slate-900">
                  <span className="block font-extrabold text-slate-900">
                    I confirm documented consent is available and clinically valid.
                  </span>
                  The patient or authorized representative has consented to using this
                  cloned/restored voice for supervised aphasia rehabilitation cues.
                </span>
              </label>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t-2 border-slate-300 bg-slate-50 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
              <button
                type="button"
                className="min-h-[60px] rounded-lg border-2 border-slate-700 bg-white p-4 text-lg font-extrabold text-slate-900 hover:bg-slate-100 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
                onClick={onCancel}
              >
                Cancel
              </button>
              <button
                type="button"
                className="min-h-[60px] rounded-lg border-2 border-indigo-900 bg-indigo-700 p-4 text-lg font-extrabold text-white hover:bg-indigo-800 disabled:cursor-not-allowed disabled:border-slate-400 disabled:bg-slate-300 disabled:text-slate-900 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-indigo-900"
                disabled={!hasScrolledTerms || !hasConsent}
                onClick={handleConfirm}
              >
                {hasScrolledTerms && hasConsent ? (
                  <CheckCircle2 className="size-6" aria-hidden="true" />
                ) : (
                  <LockKeyhole className="size-6" aria-hidden="true" />
                )}
                Unlock voice restoration
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
