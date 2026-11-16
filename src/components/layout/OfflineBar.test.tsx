import { act, render, screen } from '@testing-library/react';
import { OfflineBar } from './OfflineBar';

describe('OfflineBar', () => {
  afterEach(() => vi.restoreAllMocks());

  it('appears when the network goes away and hides when it returns', () => {
    const online = vi.spyOn(navigator, 'onLine', 'get').mockReturnValue(true);
    render(<OfflineBar />);
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
    online.mockReturnValue(false);
    act(() => {
      window.dispatchEvent(new Event('offline'));
    });
    expect(screen.getByRole('status')).toHaveTextContent('Нет сети: показываем сохранённые данные');
    online.mockReturnValue(true);
    act(() => {
      window.dispatchEvent(new Event('online'));
    });
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
  });
});
