import Container from '@/components/ui/Container';
import { Reveal } from '@/components/ui/Reveal';
import { useI18n } from '@/contexts/I18nContext';

interface Stat {
  value: string;
  label: string;
}

/** Hard numbers immediately under the hero — the first credibility check. */
const StatsBand = () => {
  const { tRaw } = useI18n();
  const stats = tRaw<Stat[]>('home.stats', []) || [];

  return (
    <section className="border-y border-border bg-ink-950">
      <Container className="py-10 md:py-12">
        <dl className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 70} className="text-center">
              <dt className="sr-only">{stat.label}</dt>
              <dd>
                <span className="block font-display text-[28px] font-bold text-primary md:text-[38px]">
                  {stat.value}
                </span>
                <span className="mt-1 block text-[12.5px] leading-snug text-text-muted md:text-[14px]">
                  {stat.label}
                </span>
              </dd>
            </Reveal>
          ))}
        </dl>
      </Container>
    </section>
  );
};

export default StatsBand;
