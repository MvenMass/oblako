import { canSpeak, hasVoice, speak } from './speech';

class FakeUtterance {
  lang = '';
  rate = 1;
  constructor(public text: string) {}
}

afterEach(() => {
  vi.unstubAllGlobals();
  // @ts-expect-error — убираем заглушку
  delete window.speechSynthesis;
});

describe('speech', () => {
  it('reports no support without the API', () => {
    expect(canSpeak()).toBe(false);
    expect(speak('Привет', 'ru-RU')).toBe(false);
  });

  it('cancels the previous phrase and speaks slowly in the given language', () => {
    const synth = { cancel: vi.fn(), speak: vi.fn(), getVoices: () => [] };
    Object.defineProperty(window, 'speechSynthesis', { value: synth, configurable: true });
    vi.stubGlobal('SpeechSynthesisUtterance', FakeUtterance);

    expect(speak('გამარჯობა', 'ka-GE')).toBe(true);
    expect(synth.cancel).toHaveBeenCalled();
    const utterance = synth.speak.mock.calls[0][0] as FakeUtterance;
    expect(utterance).toMatchObject({ text: 'გამარჯობა', lang: 'ka-GE', rate: 0.85 });
  });

  it('matches voices by the first two letters', () => {
    const voices = [{ lang: 'hy-AM' }, { lang: 'en-US' }] as SpeechSynthesisVoice[];
    expect(hasVoice(voices, 'hy')).toBe(true);
    expect(hasVoice(voices, 'ka-GE')).toBe(false);
  });
});
