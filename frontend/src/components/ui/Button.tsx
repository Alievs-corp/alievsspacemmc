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
    'inline-flex items-center justify-center gap-2 cursor-pointer rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:pointer-events-none disabled:opacity-50',
    {
      'bg-primary hover:bg-primary-hover text-on-primary': variant === 'default',
      'border border-border-strong bg-transparent hover:bg-surface-3 text-text':
        variant === 'outline',
      'hover:bg-surface-3 text-text': variant === 'ghost',
      'bg-danger hover:opacity-90 text-ink-950':
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
