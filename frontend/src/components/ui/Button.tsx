import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  asChild?: boolean;
}

export function Button({
  variant = 'default',
  size = 'md',
  className,
  children,
  asChild,
  ...props
}: ButtonProps) {
  const baseClasses = cn(
    'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] disabled:pointer-events-none disabled:opacity-50',
    {
      'bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:opacity-90': variant === 'default',
      'border border-[var(--color-input)] bg-[var(--color-background)] hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-foreground)]':
        variant === 'outline',
      'hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-foreground)]': variant === 'ghost',
      'bg-[var(--color-destructive)] text-[var(--color-destructive-foreground)] hover:opacity-90':
        variant === 'destructive',
      'h-9 px-3 text-sm': size === 'sm',
      'h-10 px-4 py-2': size === 'md',
      'h-11 px-8 text-lg': size === 'lg',
    },
    className
  );

  if (asChild && 'to' in props) {
    return (
      <Link to={props.to as string} className={baseClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button className={baseClasses} {...props}>
      {children}
    </button>
  );
}
