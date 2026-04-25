import { useCallback, useEffect, useRef, useState } from 'react';
import { getRecording } from '../lib/voiceBank';
import type { LangCode, VoiceSource } from '../types';
import { useSpeech } from './useSpeech';

/**
 * Plays the model cue for a stimulus, preferring a familiar-voice recording
 * stored in the Voice Bank, falling back to TTS if none exists.
 *
 * Returns a `speakItem(itemId, fallbackText, rate)` function plus the `useSpeech`
 * primitives so callers can still speak arbitrary text (e.g. semantic cues).
 */
export function useFamiliarVoice(lang: LangCode) {
  const { speak, cancel, speaking, hasVoiceForLang } = useSpeech(lang);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastSourceRef = useRef<VoiceSource>('none');
  const [playing, setPlaying] = useState(false);

  // Stop any familiar-voice playback if language changes or component unmounts.
  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, [lang]);

  const speakItem = useCallback(
    async (itemId: string, fallbackText: string, rate = 0.85): Promise<VoiceSource> => {
      // Stop any in-flight TTS or familiar audio.
      cancel();
      audioRef.current?.pause();
      audioRef.current = null;

      try {
        const rec = await getRecording(lang, itemId);
        if (rec && rec.blob) {
          const url = URL.createObjectURL(rec.blob);
          const audio = new Audio(url);
          audio.playbackRate = Math.max(0.5, Math.min(rate / 0.85, 1.5));
          audioRef.current = audio;
          setPlaying(true);
          audio.onended = () => {
            setPlaying(false);
            URL.revokeObjectURL(url);
          };
          audio.onerror = () => {
            setPlaying(false);
            URL.revokeObjectURL(url);
          };
          await audio.play();
          lastSourceRef.current = 'familiar';
          return 'familiar';
        }
      } catch (err) {
        // IndexedDB or audio playback failed — fall back to TTS.
        console.warn('[familiarVoice] falling back to TTS:', err);
      }

      // Fallback to TTS
      speak(fallbackText, rate);
      lastSourceRef.current = hasVoiceForLang ? 'tts' : 'none';
      return lastSourceRef.current;
    },
    [lang, cancel, speak, hasVoiceForLang]
  );

  const lastSource = (): VoiceSource => lastSourceRef.current;

  return {
    /** Speak a stimulus, prefering familiar voice. Returns the source actually used. */
    speakItem,
    /** Speak arbitrary text via TTS (used for semantic / phonological cues). */
    speak,
    cancel,
    speaking: speaking || playing,
    hasVoiceForLang,
    lastSource,
  };
}
