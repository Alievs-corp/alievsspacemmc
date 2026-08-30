import type { ReactNode } from 'react';
import Container from './Container';
import { Reveal } from './Reveal';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: string;
  align?: 'center' | 'left';
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  className,
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        'flex flex-col gap-4',
        align === 'center' ? 'items-center text-center' : 'items-start text-left',
        className,
      )}
    >
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 className="font-display text-[28px] font-bold leading-tight text-white md:text-[40px] lg:text-[44px] max-w-3xl">
        {title}
      </h2>
      {subtitle && (
        <p className={cn('max-w-2xl text-[14px] leading-relaxed text-text-muted md:text-[17px]')}>
          {subtitle}
        </p>
      )}
    </Reveal>
  );
}

interface SectionProps {
  id?: string;
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  tight?: boolean;
}

export function Section({ id, children, className, containerClassName, tight }: SectionProps) {
  return (
    <section id={id} className={cn(tight ? 'section-tight' : 'section', className)}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}

export default Section;
