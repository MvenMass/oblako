import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Icon } from '@/components/ui/Icon';
import { SectionHead } from '@/components/ui/SectionHead';
import { FAQ, FAQ_FALLBACK } from '@/data/home';
import { useReducedMotion } from '@/lib/motion';
import { typograph } from '@/lib/typograph';
import styles from './FaqChat.module.css';

interface Message {
  id: number;
  mine: boolean;
  text: string;
}

const GREETING: Message = {
  id: 0,
  mine: false,
  text: typograph('Привет! Я Облако. Выберите вопрос слева или напишите свой.'),
};

/** FAQ-чат: вопросы-чипы, «печатает…» и ответ через 1,1 с */
export function FaqChat() {
  const reduced = useReducedMotion();
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [asked, setAsked] = useState<number[]>([]);
  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState('');
  const log = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  // Автоскролл ленты (только самой ленты, не страницы)
  useEffect(() => {
    const el = log.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, typing]);

  const ask = (question: string, answer: string) => {
    if (typing) return;
    setMessages((m) => [...m, { id: m.length, mine: true, text: question }]);
    setTyping(true);
    timer.current = setTimeout(
      () => {
        setMessages((m) => [...m, { id: m.length, mine: false, text: typograph(answer) }]);
        setTyping(false);
      },
      reduced ? 200 : 1100,
    );
  };

  const onChip = (i: number) => {
    if (asked.includes(i) || typing) return;
    setAsked((a) => [...a, i]);
    ask(FAQ[i][0], FAQ[i][1]);
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = draft.trim();
    if (!q || typing) return;
    setDraft('');
    ask(q, FAQ_FALLBACK);
  };

  return (
    <section id="faq" className={`container ${styles.section}`} aria-labelledby="faq-title">
      <div className={styles.side}>
        <SectionHead
          id="faq-title"
          eyebrow="Частые вопросы"
          title={
            <>
              Спросите <span className="grad">Облако</span>
            </>
          }
          lead={typograph('Выберите вопрос — Облако ответит в чате. Ответы короткие, по делу.')}
        />
        <div className={styles.chips} role="group" aria-label="Вопросы">
          {FAQ.map(([q], i) => {
            const done = asked.includes(i);
            return (
              <button
                key={q}
                type="button"
                className={`${styles.chip} ${done ? styles.done : ''}`}
                aria-disabled={done || undefined}
                onClick={() => onChip(i)}
              >
                {typograph(q)}
              </button>
            );
          })}
        </div>
      </div>

      <div className={styles.chat}>
        <div className={styles.head}>
          <span aria-hidden="true" className={styles.bot}>
            <svg width="32" height="22" viewBox="0 0 44 30">
              <path d="M12 28h22a9 9 0 0 0 1-17.9A12 12 0 0 0 12.4 8 10 10 0 0 0 12 28z" />
            </svg>
            <span className={styles.online} />
          </span>
          <span className={styles.who}>
            <b>Облако</b>
            <span className={styles.status}>{typing ? 'печатает…' : 'онлайн · демо-чат'}</span>
          </span>
        </div>

        <div ref={log} className={styles.log} role="log" aria-live="polite" aria-label="Переписка">
          {messages.map((m) => (
            <p key={m.id} className={`${styles.msg} ${m.mine ? styles.mine : styles.bot2}`}>
              <span className="visually-hidden">{m.mine ? 'Вы: ' : 'Облако: '}</span>
              {m.text}
            </p>
          ))}
          {typing && (
            <span className={styles.typing} role="status" aria-label="Облако печатает">
              <span className={styles.dot} />
              <span className={styles.dot} />
              <span className={styles.dot} />
            </span>
          )}
        </div>

        <form className={styles.form} onSubmit={onSubmit}>
          <label className={styles.field}>
            <span className="visually-hidden">Свой вопрос</span>
            <input
              type="text"
              name="q"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Свой вопрос…"
              autoComplete="off"
              className={styles.input}
            />
          </label>
          <button type="submit" className={styles.send} aria-label="Отправить">
            <Icon name="send" size={20} />
          </button>
        </form>
      </div>
    </section>
  );
}
