import { useEffect } from 'react';
import { SITE_NAME } from '@/app/routes';

/** Заголовок вкладки: «Раздел — OBLAKO» */
export function usePageTitle(title?: string): void {
  useEffect(() => {
    document.title = title ? `${title} — ${SITE_NAME}` : SITE_NAME;
  }, [title]);
}
