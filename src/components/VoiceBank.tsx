import React, { useEffect, useMemo, useRef, useState } from 'react';
import { getStimuli } from '../data/stimuli';
import {
  deleteRecording,
  listRecordings,
  pickRecorderMime,
  saveRecording,
  type VoiceRecord,
} from '../lib/voiceBank';
import { LANG_META, UI } from '../i18n/ui';
import type { LangCode, StimulusItem } from '../types';

interface Props {
  lang: LangCode;
  onBack: () => void;
}

type RecorderState = 'idle' | 'recording' | 'saving';

const VoiceBank: React.FC<Props> = ({ lang, onBack }) => {
  const t = UI[lang];
  const items = useMemo(() => getStimuli(lang).items, [lang]);
  const [records, setRecords] = useState<Record<string, VoiceRecord>>({});
  const [activeId, setActiveId] = useState<string | null>(null);
  const [state, setState] = useState<RecorderState>('idle');
  const [recordedBy, setRecordedBy] = useState('Family member');
  const [error, setError] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startTsRef = useRef<number>(0);

  const refresh = async () => {
    try {
      const all = await listRecordings(lang);
      const map: Record<string, VoiceRecord> = {};
      all.forEach((r) => {
        map[r.itemId] = r;
      });
      setRecords(map);
    } catch (err) {
      console.error('[VoiceBank] failed to list:', err);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  const startRecording = async (item: StimulusItem) => {
    setError(null);
    if (state !== 'idle') return;
    if (!navigator.mediaDevices?.getUserMedia) {
      setError('Microphone access is not supported on this device.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mime = pickRecorderMime();
      const recorder = mime
        ? new MediaRecorder(stream, { mimeType: mime })
        : new MediaRecorder(stream);

      mediaRef.current = recorder;
      chunksRef.current = [];
      startTsRef.current = Date.now();
      setActiveId(item.id);
      setState('recording');

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = async () => {
        setState('saving');
        const durationMs = Date.now() - startTsRef.current;
        const blob = new Blob(chunksRef.current, { type: mime || 'audio/webm' });
        try {
          await saveRecording({
            lang,
            itemId: item.id,
            word: item.word,
            blob,
            recordedBy: recordedBy.trim() || 'Family member',
            durationMs,
          });
          await refresh();
        } catch (err) {
          console.error('[VoiceBank] save failed:', err);
          setError('Could not save recording — please try again.');
        }
        // Release the mic
        stream.getTracks().forEach((tr) => tr.stop());
        setState('idle');
        setActiveId(null);
      };
      recorder.start();
    } catch (err) {
      console.error('[VoiceBank] mic error:', err);
      setError('Microphone permission denied or unavailable.');
      setState('idle');
      setActiveId(null);
    }
  };

  const stopRecording = () => {
    if (state === 'recording' && mediaRef.current) {
      mediaRef.current.stop();
    }
  };

  const playRecording = (rec: VoiceRecord) => {
    const url = URL.createObjectURL(rec.blob);
    const audio = new Audio(url);
    setPlayingId(rec.itemId);
    audio.onended = () => {
      setPlayingId(null);
      URL.revokeObjectURL(url);
    };
    audio.onerror = () => {
      setPlayingId(null);
      URL.revokeObjectURL(url);
    };
    audio.play().catch(() => setPlayingId(null));
  };

  const removeRecording = async (item: StimulusItem) => {
    if (!records[item.id]) return;
    if (!confirm(`Delete the recording for "${item.word}"?`)) return;
    try {
      await deleteRecording(lang, item.id);
      await refresh();
    } catch (err) {
      console.error('[VoiceBank] delete failed:', err);
    }
  };

  const recordedCount = Object.keys(records).length;
  const totalCount = items.length;
  const completion = Math.round((recordedCount / totalCount) * 100);

  return (
    <section className="screen animate-fade-in">
      <button className="back-btn" onClick={onBack}>
        ← {t.back}
      </button>

      <div className="voice-bank-header">
        <div>
          <h2 className="screen-title">🎙️ {t.voiceBank}</h2>
          <p className="screen-subtitle">
            {t.voiceBankSubtitle} · {LANG_META[lang].native}
          </p>
        </div>
        <div className="voice-bank-progress">
          <div className="vb-ring" style={{ '--pct': completion } as React.CSSProperties}>
            <span>{recordedCount}/{totalCount}</span>
          </div>
          <p className="muted text-center">{t.recordedSoFar}</p>
        </div>
      </div>

      <div className="voice-bank-config glass-card mt-md">
        <label className="vb-label">
          {t.recordedBy}
          <input
            type="text"
            className="vb-input"
            value={recordedBy}
            onChange={(e) => setRecordedBy(e.target.value)}
            placeholder="e.g. Spouse, Daughter…"
          />
        </label>
        <p className="muted vb-hint">{t.familiarVoiceHint}</p>
      </div>

      {error && <div className="tts-warn mt-md">⚠ {error}</div>}

      <div className="voice-list mt-lg">
        {items.map((item) => {
          const rec = records[item.id];
          const isActive = activeId === item.id;
          const isRecording = isActive && state === 'recording';
          const isSaving = isActive && state === 'saving';

          return (
            <div key={item.id} className={`voice-row glass-card ${rec ? 'has-rec' : ''}`}>
              <div className="vb-emoji">{item.emoji}</div>
              <div className="vb-word">
                <strong>{item.word}</strong>
                {item.translit && <span className="vb-translit">/{item.translit}/</span>}
                {rec && (
                  <span className="vb-meta">
                    🎙 {rec.recordedBy} · {(rec.durationMs / 1000).toFixed(1)}s
                  </span>
                )}
              </div>
              <div className="vb-actions">
                {rec && (
                  <button
                    className="ghost vb-btn"
                    onClick={() => playRecording(rec)}
                    disabled={playingId === item.id}
                    title="Play recording"
                  >
                    {playingId === item.id ? '🔊' : '▶️'}
                  </button>
                )}
                {isRecording ? (
                  <button className="primary vb-btn vb-stop" onClick={stopRecording}>
                    ⏹ Stop
                  </button>
                ) : (
                  <button
                    className={`secondary vb-btn ${rec ? 'vb-rerecord' : ''}`}
                    onClick={() => startRecording(item)}
                    disabled={state !== 'idle'}
                  >
                    {isSaving ? '…saving' : rec ? '↻ Re-record' : '🎙 Record'}
                  </button>
                )}
                {rec && (
                  <button
                    className="ghost vb-btn vb-delete"
                    onClick={() => removeRecording(item)}
                    disabled={state !== 'idle'}
                    title="Delete recording"
                  >
                    🗑
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="voice-bank-footer mt-lg muted">
        <p>
          ℹ️ Recordings stay on this device (IndexedDB). They are used as the model
          cue in CILT, Cueing, and Comprehension modules — falling back to TTS when
          no recording exists.
        </p>
      </div>
    </section>
  );
};

export default VoiceBank;
