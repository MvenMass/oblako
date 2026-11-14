import { Icon } from '@/components/ui/Icon';
import styles from './Steps.module.css';

interface NextButtonProps {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
  /** Почему кнопка неактивна — для скринридера */
  reason?: string;
}

/** «Дальше»: при disabled остаётся в фокусе (aria-disabled), чтобы было слышно почему */
export function NextButton({
  onClick,
  disabled = false,
  label = 'Дальше',
  reason,
}: NextButtonProps) {
  return (
    <div className={styles.nextWrap}>
      <button
        type="button"
        className={styles.next}
        aria-disabled={disabled || undefined}
        aria-describedby={disabled && reason ? 'next-reason' : undefined}
        onClick={() => !disabled && onClick()}
      >
        {label}
        <Icon name="arrow-right" size={18} />
      </button>
      {disabled && reason && (
        <span id="next-reason" className="visually-hidden">
          {reason}
        </span>
      )}
    </div>
  );
}
