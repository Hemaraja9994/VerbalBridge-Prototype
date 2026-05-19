import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface ClinicalMediaBackdropProps {
  poster?: string;
  videoSources?: string[];
}

const defaultVideoSources = [
  '/clinical-media/therapy-cabin-loop.mp4',
  '/clinical-media/speech-therapy-session.webm',
  '/clinical-media/clinical-rehab-background.mp4',
];

export default function ClinicalMediaBackdrop({
  poster = '/hero.png',
  videoSources = defaultVideoSources,
}: ClinicalMediaBackdropProps) {
  const prefersReducedMotion = useReducedMotion();
  const [failedSources, setFailedSources] = useState<string[]>([]);
  const activeVideo = videoSources.find((source) => !failedSources.includes(source));

  const markVideoFailed = () => {
    if (!activeVideo) return;
    setFailedSources((current) =>
      current.includes(activeVideo) ? current : [...current, activeVideo]
    );
  };

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {activeVideo && !prefersReducedMotion ? (
        <video
          key={activeVideo}
          className="absolute inset-0 h-full w-full scale-105 object-cover opacity-70"
          autoPlay
          muted
          loop
          playsInline
          poster={poster}
          onError={markVideoFailed}
        >
          <source src={activeVideo} />
        </video>
      ) : (
        <img
          src={poster}
          alt=""
          className="absolute inset-0 h-full w-full scale-105 object-cover opacity-80"
        />
      )}

      <motion.div
        className="absolute inset-0 opacity-75"
        style={{
          background:
            'linear-gradient(120deg, rgba(2, 6, 23, 0.96), rgba(15, 23, 42, 0.82), rgba(13, 148, 136, 0.36), rgba(30, 64, 175, 0.36))',
          backgroundSize: '260% 260%',
        }}
        animate={
          prefersReducedMotion
            ? undefined
            : { backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }
        }
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(45,212,191,0.24),transparent_32%),radial-gradient(circle_at_78%_12%,rgba(129,140,248,0.22),transparent_34%),linear-gradient(90deg,rgba(2,6,23,0.96),rgba(15,23,42,0.82),rgba(15,23,42,0.36))]" />
    </div>
  );
}
