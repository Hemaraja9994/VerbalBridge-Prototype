import { useCallback, useEffect, useState } from 'react';
import { LANG_META } from '../i18n/ui';
import type { LangCode } from '../types';

export function useSpeech(lang: LangCode) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    const load = () => setVoices(synth.getVoices());
    load();
    synth.addEventListener('voiceschanged', load);
    return () => synth.removeEventListener('voiceschanged', load);
  }, []);

  const speak = useCallback(
    (text: string, rate = 0.85) => {
      const synth = window.speechSynthesis;
      if (!synth || !text) return;
      synth.cancel();
      const u = new SpeechSynthesisUtterance(text);
      const bcp = LANG_META[lang].bcp47;
      u.lang = bcp;
      u.rate = rate;
      u.pitch = 1;
      const match =
        voices.find((v) => v.lang === bcp) ||
        voices.find((v) => v.lang.startsWith(bcp.split('-')[0]));
      if (match) u.voice = match;
      u.onstart = () => setSpeaking(true);
      u.onend = () => setSpeaking(false);
      u.onerror = () => setSpeaking(false);
      synth.speak(u);
    },
    [lang, voices]
  );

  const cancel = useCallback(() => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  }, []);

  const hasVoiceForLang = voices.some((v) =>
    v.lang.startsWith(LANG_META[lang].bcp47.split('-')[0])
  );

  return { speak, cancel, speaking, hasVoiceForLang };
}
