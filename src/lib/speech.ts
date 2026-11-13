/** Озвучка разговорника через Web Speech API */

export function canSpeak(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

/** Голоса в Chrome и Safari загружаются асинхронно — ждём voiceschanged, но не дольше 1 с */
export function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  if (!canSpeak()) return Promise.resolve([]);
  const synth = window.speechSynthesis;
  const now = synth.getVoices();
  if (now.length) return Promise.resolve(now);

  return new Promise((resolve) => {
    const done = () => {
      synth.removeEventListener('voiceschanged', done);
      clearTimeout(timer);
      resolve(synth.getVoices());
    };
    const timer = setTimeout(done, 1000);
    synth.addEventListener('voiceschanged', done);
  });
}

/** Есть ли голос для языка — по первым двум буквам кода (ka-GE → ka) */
export function hasVoice(voices: SpeechSynthesisVoice[], lang: string): boolean {
  const prefix = lang.slice(0, 2).toLowerCase();
  return voices.some((v) => v.lang.slice(0, 2).toLowerCase() === prefix);
}

interface SpeakOptions {
  onStart?: () => void;
  onEnd?: () => void;
}

/** Произносит фразу; предыдущая обрывается. false — API недоступен. */
export function speak(text: string, lang: string, { onStart, onEnd }: SpeakOptions = {}): boolean {
  if (!canSpeak()) return false;
  const synth = window.speechSynthesis;
  synth.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.85;
  if (onStart) utterance.onstart = onStart;
  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
  }
  synth.speak(utterance);
  return true;
}

export function stopSpeaking(): void {
  if (canSpeak()) window.speechSynthesis.cancel();
}
