import { useEffect, useState } from 'react';
import { canSpeak, hasVoice, loadVoices, speak, stopSpeaking } from '@/lib/speech';
import type { City } from '@/types/city';
import { CitySection } from './CitySection';
import styles from './Phrasebook.module.css';

/** «Разговорник»: клик — озвучка Web Speech API и эквалайзер. Пустой — не рендерится. */
export function Phrasebook({ city }: { city: City }) {
  const [speaking, setSpeaking] = useState(-1);
  const [note, setNote] = useState('');
  const { items, speechLang } = city.phrases;

  useEffect(() => () => stopSpeaking(), []);

  if (!items.length) return null;

  const say = async (i: number) => {
    if (!canSpeak()) {
      setNote('Браузер не умеет озвучивать текст — ориентируйтесь на транскрипцию.');
      return;
    }
    const voices = await loadVoices();
    setNote(
      hasVoice(voices, speechLang)
        ? ''
        : 'Голоса для этого языка нет в системе — браузер прочитает как сможет. Транскрипция под фразой.',
    );
    speak(items[i].native, speechLang, {
      onStart: () => setSpeaking(i),
      onEnd: () => setSpeaking((s) => (s === i ? -1 : s)),
    });
    setSpeaking(i);
  };

  return (
    <CitySection
      id="phrases"
      title="Разговорник"
      aside={<>Нажмите, чтобы послушать. Голос&nbsp;— встроенный в&nbsp;браузер</>}
    >
      <div className={styles.grid}>
        {items.map((p, i) => {
          const on = speaking === i;
          return (
            <button
              key={p.native}
              type="button"
              className={`${styles.card} ${on ? styles.on : ''}`}
              onClick={() => say(i)}
            >
              <span className={styles.top}>
                <span lang={city.greeting.lang} className={styles.native}>
                  {p.native}
                </span>
                <span aria-hidden="true" className={`${styles.eq} ${on ? styles.eqOn : ''}`}>
                  <span />
                  <span />
                  <span />
                </span>
              </span>
              <span className={styles.translit}>{p.translit}</span>
              <span className={styles.ru}>{p.ru}</span>
              <span className="visually-hidden">, послушать</span>
            </button>
          );
        })}
      </div>
      <p className={styles.note} aria-live="polite">
        {note}
      </p>
    </CitySection>
  );
}
