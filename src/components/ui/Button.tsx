import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from './Icon';
import type { IconName } from './icons';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'dark' | 'glass' | 'ghost';

interface BaseProps {
  variant?: ButtonVariant;
  size?: 'md' | 'sm';
  /** Квадратная кнопка-иконка — обязательно с aria-label */
  iconOnly?: boolean;
  /** Иконка перед текстом */
  iconStart?: IconName;
  /** Иконка после текста */
  iconEnd?: IconName;
  className?: string;
  children: ReactNode;
}

type AsButton = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & { to?: undefined };

type AsLink = BaseProps & { to: string; 'aria-label'?: string };

export type ButtonProps = AsButton | AsLink;

function buttonClass({
  variant = 'primary',
  size = 'md',
  iconOnly,
  className,
}: Partial<BaseProps>) {
  return [
    styles.button,
    styles[variant],
    size === 'sm' && styles.sm,
    iconOnly && styles.iconOnly,
    className,
  ]
    .filter(Boolean)
    .join(' ');
}

function Content({ iconStart, iconEnd, children }: Partial<BaseProps>) {
  const size = 18;
  return (
    <>
      {iconStart && <Icon name={iconStart} size={size} className={styles.iconStart} />}
      {children}
      {iconEnd && <Icon name={iconEnd} size={size} className={styles.iconEnd} />}
    </>
  );
}

export function Button(props: ButtonProps) {
  if (props.to !== undefined) {
    const { to, variant, size, iconOnly, iconStart, iconEnd, className, children, ...rest } = props;
    return (
      <Link to={to} className={buttonClass({ variant, size, iconOnly, className })} {...rest}>
        <Content iconStart={iconStart} iconEnd={iconEnd}>
          {children}
        </Content>
      </Link>
    );
  }

  const {
    variant,
    size,
    iconOnly,
    iconStart,
    iconEnd,
    className,
    children,
    type = 'button',
    ...rest
  } = props;
  return (
    <button type={type} className={buttonClass({ variant, size, iconOnly, className })} {...rest}>
      <Content iconStart={iconStart} iconEnd={iconEnd}>
        {children}
      </Content>
    </button>
  );
}
