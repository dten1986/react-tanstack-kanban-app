import type { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'icon';
  tone?: 'neutral' | 'danger';
}

const BASE =
  'cursor-pointer rounded-lg border border-line bg-canvas font-sans text-sm ' +
  'text-ink-strong transition-colors focus-visible:outline-2 ' +
  'focus-visible:outline-offset-2 focus-visible:outline-accent ' +
  'disabled:cursor-not-allowed disabled:opacity-45';

const VARIANTS: Record<NonNullable<ButtonProps['variant']>, string> = {
  default: 'px-3 py-1.5',
  icon: 'min-w-8 px-2 py-1 leading-snug',
};

const TONES: Record<NonNullable<ButtonProps['tone']>, string> = {
  neutral: 'enabled:hover:border-accent-line enabled:hover:text-accent',
  danger: 'enabled:hover:border-danger enabled:hover:text-danger',
};

export function Button({
  variant = 'default',
  tone = 'neutral',
  className = '',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`${BASE} ${VARIANTS[variant]} ${TONES[tone]} ${className}`}
      {...props}
    />
  );
}
