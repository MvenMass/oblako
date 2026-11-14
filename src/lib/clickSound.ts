/** Щелчок табло: короткий шум с затухающей огибающей через полосовой фильтр (Web Audio) */
type AC = typeof AudioContext;

let ctx: AudioContext | null = null;

/** Создаёт контекст — вызывать из обработчика клика (иначе Safari не даст звук) */
export function unlockClicks(): void {
  if (ctx) {
    void ctx.resume();
    return;
  }
  const Ctor: AC | undefined =
    window.AudioContext ?? (window as unknown as { webkitAudioContext?: AC }).webkitAudioContext;
  if (Ctor) ctx = new Ctor();
}

export function playClick(): void {
  if (!ctx || ctx.state !== 'running') return;
  const len = Math.floor(ctx.sampleRate * 0.018);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const ch = buf.getChannelData(0);
  for (let i = 0; i < len; i++) ch[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3);
  const src = ctx.createBufferSource();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();
  filter.type = 'bandpass';
  filter.frequency.value = 2400;
  gain.gain.value = 0.25;
  src.buffer = buf;
  src.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  src.start();
}
