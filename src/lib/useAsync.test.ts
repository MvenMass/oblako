import { renderHook, waitFor } from '@testing-library/react';
import { useAsync } from './useAsync';

describe('useAsync', () => {
  it('goes from loading to ready', async () => {
    const { result } = renderHook(() => useAsync(async () => 42, []));
    expect(result.current.status).toBe('loading');
    await waitFor(() => expect(result.current).toEqual({ status: 'ready', data: 42 }));
  });

  it('treats null and rejections as empty', async () => {
    const empty = renderHook(() => useAsync(async () => null, []));
    const failed = renderHook(() => useAsync(() => Promise.reject(new Error('x')), []));
    await waitFor(() => expect(empty.result.current.status).toBe('empty'));
    await waitFor(() => expect(failed.result.current.status).toBe('empty'));
  });

  it('shows loading again when deps change and ignores stale answers', async () => {
    const { result, rerender } = renderHook(({ id }) => useAsync(async () => `city:${id}`, [id]), {
      initialProps: { id: 'a' },
    });
    await waitFor(() => expect(result.current.data).toBe('city:a'));
    rerender({ id: 'b' });
    expect(result.current.status).toBe('loading');
    await waitFor(() => expect(result.current.data).toBe('city:b'));
  });
});
