import { Aurora } from '@/components/ui/Aurora';
import { Button } from '@/components/ui/Button';
import { usePageTitle } from '@/lib/usePageTitle';
import { SadCloud } from './SadCloud';
import styles from './NotFound.module.css';

export default function NotFound() {
  usePageTitle('Такого облака нет');
  return (
    <div className={styles.page}>
      <Aurora />
      <div className={`container ${styles.content}`}>
        <SadCloud className={styles.cloud} />
        <p className={styles.code}>Ошибка 404</p>
        <h1 className={styles.title}>
          Такого <span className="grad">облака нет</span>
        </h1>
        <p className={styles.text}>
          Похоже, страница улетела. Вернитесь на&nbsp;главную или подберите поездку заново.
        </p>
        <div className={styles.actions}>
          <Button to="/">На&nbsp;главную</Button>
          <Button to="/quiz" variant="glass" iconEnd="arrow-right">
            Подобрать поездку
          </Button>
        </div>
      </div>
    </div>
  );
}
