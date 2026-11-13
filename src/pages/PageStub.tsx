import { Aurora } from '@/components/ui/Aurora';
import { SectionHead } from '@/components/ui/SectionHead';
import { usePageTitle } from '@/lib/usePageTitle';
import styles from './PageStub.module.css';

interface PageStubProps {
  eyebrow: string;
  title: string;
  /** Акцентное слово заголовка */
  accent: string;
}

/** Временная страница раздела — заменяется на своём этапе */
export function PageStub({ eyebrow, title, accent }: PageStubProps) {
  usePageTitle(`${title} ${accent}`.trim());
  return (
    <div className={styles.page}>
      <Aurora grain={false} />
      <div className={`container ${styles.content}`}>
        <SectionHead
          level={1}
          eyebrow={eyebrow}
          title={
            <>
              {title} <span className="grad">{accent}</span>
            </>
          }
          lead={<>Раздел в&nbsp;разработке.</>}
        />
      </div>
    </div>
  );
}
