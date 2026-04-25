import React from 'react';
import { UI } from '../i18n/ui';
import type { CueLevel, LangCode, SessionEntry, VoiceSource } from '../types';

interface Props {
  lang: LangCode;
  entries: SessionEntry[];
  onBack: () => void;
}

const CUE_LEVELS: CueLevel[] = [
  'unaided',
  'gesture',
  'semantic',
  'phonological',
  'model',
];

const CUE_LABEL: Record<CueLevel, string> = {
  unaided: 'Unaided',
  gesture: 'Gesture',
  semantic: 'Semantic',
  phonological: 'Phonological',
  model: 'Model',
};

const CUE_COLOR: Record<CueLevel, string> = {
  unaided: '#10b981',
  gesture: '#8b5cf6',
  semantic: '#3b82f6',
  phonological: '#f59e0b',
  model: '#ef4444',
};

const ProgressDashboard: React.FC<Props> = ({ lang, entries, onBack }) => {
  const t = UI[lang];

  const total = entries.length;
  const byCue = CUE_LEVELS.map((level) => ({
    level,
    count: entries.filter((e) => e.cueLevel === level).length,
  }));

  const produced = entries.filter((e) => e.outcome === 'produced').length;
  const approximated = entries.filter((e) => e.outcome === 'approximated').length;
  const notAttempted = entries.filter((e) => e.outcome === 'not-attempted').length;

  const familiarVoiceUses = entries.filter(
    (e) => e.voiceSource === 'familiar'
  ).length;
  const ttsUses = entries.filter((e) => e.voiceSource === 'tts').length;
  const totalVoiceUses = familiarVoiceUses + ttsUses;
  const familiarVoicePct =
    totalVoiceUses === 0 ? 0 : (familiarVoiceUses / totalVoiceUses) * 100;

  const handleExport = () => {
    const header = 'timestamp,module,word,cueLevel,outcome,voiceSource';
    const rows = entries.map(
      (e) =>
        `${new Date(e.timestamp).toISOString()},${e.module},${e.word},${e.cueLevel},${e.outcome},${e.voiceSource ?? ''}`
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `verbalbridge-session-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (total === 0) {
    return (
      <section className="screen animate-fade-in">
        <button className="back-btn" onClick={onBack}>
          ← {t.back}
        </button>
        <h2 className="screen-title">{t.progress}</h2>
        <div className="glass-card empty-state mt-xl">
          <p>No therapy sessions recorded yet.</p>
          <p className="muted">Complete a module to see progress here.</p>
        </div>
      </section>
    );
  }

  const sourceLabel = (s?: VoiceSource): string => {
    if (s === 'familiar') return '❤️ familiar';
    if (s === 'tts') return '🤖 TTS';
    return '—';
  };

  return (
    <section className="screen animate-fade-in">
      <button className="back-btn" onClick={onBack}>
        ← {t.back}
      </button>
      <h2 className="screen-title">{t.progress}</h2>

      <div className="summary-row mt-lg">
        <div className="stat-card">
          <span className="stat-label">Items practiced</span>
          <span className="stat-value">{total}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Produced</span>
          <span className="stat-value text-success">{produced}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Approximated</span>
          <span className="stat-value" style={{ color: '#f59e0b' }}>
            {approximated}
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Not attempted</span>
          <span className="stat-value text-error">{notAttempted}</span>
        </div>
      </div>

      <h3 className="mt-xl">Cueing level distribution</h3>
      <p className="muted">
        Higher share of <b>unaided</b> retrieval over time = neuroplasticity progress.
      </p>
      <div className="cue-chart mt-md">
        {byCue.map(({ level, count }) => {
          const pct = total === 0 ? 0 : (count / total) * 100;
          return (
            <div className="cue-row" key={level}>
              <span className="cue-row-label">{CUE_LABEL[level]}</span>
              <div className="cue-bar-track">
                <div
                  className="cue-bar-fill"
                  style={{
                    width: `${pct}%`,
                    background: CUE_COLOR[level],
                  }}
                />
              </div>
              <span className="cue-row-count">
                {count} ({pct.toFixed(0)}%)
              </span>
            </div>
          );
        })}
      </div>

      {totalVoiceUses > 0 && (
        <div className="voice-source-summary glass-card mt-xl">
          <h3>Voice source for model cues</h3>
          <p className="muted">
            Familiar voice activates richer semantic-emotional networks than synthetic TTS.
          </p>
          <div className="voice-mix-bar mt-md">
            <div
              className="voice-mix-familiar"
              style={{ width: `${familiarVoicePct}%` }}
              title={`Familiar voice: ${familiarVoiceUses}`}
            >
              {familiarVoicePct >= 12 && `❤️ ${familiarVoicePct.toFixed(0)}%`}
            </div>
            <div
              className="voice-mix-tts"
              style={{ width: `${100 - familiarVoicePct}%` }}
              title={`Synthetic: ${ttsUses}`}
            >
              {100 - familiarVoicePct >= 12 &&
                `🤖 ${(100 - familiarVoicePct).toFixed(0)}%`}
            </div>
          </div>
          <div className="voice-mix-legend mt-sm muted">
            ❤️ Familiar: {familiarVoiceUses} · 🤖 TTS: {ttsUses}
          </div>
        </div>
      )}

      <div className="mt-xl">
        <button className="primary" onClick={handleExport}>
          ⬇ {t.exportCsv}
        </button>
      </div>

      <div className="raw-data-table mt-xl">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Module</th>
              <th>Word</th>
              <th>Cue level</th>
              <th>Outcome</th>
              <th>Voice</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e, i) => (
              <tr key={`${e.itemId}-${i}`}>
                <td>{i + 1}</td>
                <td>{e.module}</td>
                <td>{e.word}</td>
                <td>{CUE_LABEL[e.cueLevel]}</td>
                <td
                  className={
                    e.outcome === 'produced'
                      ? 'text-success'
                      : e.outcome === 'not-attempted'
                        ? 'text-error'
                        : ''
                  }
                >
                  {e.outcome}
                </td>
                <td>{sourceLabel(e.voiceSource)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ProgressDashboard;
