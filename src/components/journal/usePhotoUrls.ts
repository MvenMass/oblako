import { useEffect, useState } from 'react';
import { getPhoto } from '@/lib/photos';
import type { TripPhoto } from '@/lib/journal';

/** Адреса фото: демо — из public, свои — объектные URL из IndexedDB (освобождаются при размонтировании) */
export function usePhotoUrls(photos: TripPhoto[]): Record<string, string> {
  const ownIds = photos.filter((p) => !p.demoSrc).map((p) => p.id);
  const key = ownIds.join('|');
  const [own, setOwn] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!key) return;
    let alive = true;
    const created: string[] = [];
    void Promise.all(
      key.split('|').map(async (id) => {
        const blob = await getPhoto(id);
        if (!blob) return null;
        const url = URL.createObjectURL(blob);
        created.push(url);
        return [id, url] as const;
      }),
    ).then((pairs) => {
      if (alive) setOwn(Object.fromEntries(pairs.filter((p) => p !== null)));
    });
    return () => {
      alive = false;
      created.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [key]);

  const out: Record<string, string> = {};
  photos.forEach((p) => {
    const src = p.demoSrc ?? own[p.id];
    if (src) out[p.id] = src;
  });
  return out;
}
