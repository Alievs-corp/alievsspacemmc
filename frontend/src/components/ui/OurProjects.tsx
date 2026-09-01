import luxmart from "../../assets/images/luxmart.png";
import lmsImage from "../../assets/images/lms.png";
import academyImage from "../../assets/images/academy.png";
import azennImage from "../../assets/images/azenn.png";
import ederaEventsImage from "../../assets/images/ederaevents.png";
import ssystemsMb from "../../assets/images/ssystems-mb.png"
import turanSK from "../../assets/images/turanSK.png"
import dabiCars from "../../assets/images/dabiCars.png"
import vdvAutoParts from "../../assets/images/vdvAutoParts.png"
import wolfServis from "../../assets/images/wolfServis.png"
import leonCasting from "../../assets/images/leonCasting.png"
import asanyer from "../../assets/images/asanyer.png"
import balakenPark from "../../assets/images/balakenPark.png"
import { ArrowUpRight } from "lucide-react";
import { Section, SectionHeading } from "./Section";
import { Reveal } from "./Reveal";
import { useI18n } from "@/contexts/I18nContext";

type ProjectCard = {
  key: 'luxmart' | 'lms' | 'azenn' | 'academy' | 'ederaEvents' | 'ssystemsMb' | 'turanSK' | 'dabiCars' | 'vdvAutoParts' | 'wolfService' | 'leonCasting' | 'asanyer' | 'balakenPark';
  link: string;
  image: string;
};

const PROJECTS: ProjectCard[] = [
  { key: 'luxmart', link: "https://luxmart.az", image: luxmart },
  { key: 'lms', link: "https://lms.alievsspace.com", image: lmsImage },
  { key: 'azenn', link: "https://azenn.az", image: azennImage },
  { key: 'academy', link: "https://academy.alievsspace.com", image: academyImage },
  { key: 'ederaEvents', link: "https://ederaevents.com", image: ederaEventsImage },
  { key: 'ssystemsMb', link: "https://mb-ssystems.com/", image: ssystemsMb },
  { key: 'turanSK', link: "https://turansk.com/", image: turanSK },
  { key: 'dabiCars', link: "https://dabicars.com/", image: dabiCars },
  { key: 'vdvAutoParts', link: "https://vdvautoparts.com/", image: vdvAutoParts },
  { key: 'wolfService', link: "https://wolfhibridservice.com/", image: wolfServis },
  { key: 'leonCasting', link: "https://leoncasting.az/", image: leonCasting },
  { key: 'asanyer', link: "https://asanyer.com/", image: asanyer },
  { key: 'balakenPark', link: "https://balakenpark.az/", image: balakenPark },
];

const normalizeUrl = (url: string) => {
  const u = url.trim();
  return u.startsWith("http") ? u : "https://" + u;
};

/** Bare domain, shown on the screenshot so each card names its live site. */
const hostOf = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
  }
};

const OurProjects = () => {
  const { t } = useI18n();

  return (
    <Section>
      <SectionHeading
        title={t("public.home.projects.title")}
        subtitle={t("public.home.projects.copy")}
        className="mb-12 md:mb-16"
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {PROJECTS.map((project, i) => {
          const href = normalizeUrl(project.link);
          const name = t(`public.home.projects.items.${project.key}.name`);
          const description = t(`public.home.projects.items.${project.key}.description`);

          return (
            <Reveal as="article" key={project.key} delay={(i % 3) * 80}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface/50 transition-all duration-300 hover:-translate-y-1 hover:border-border-strong hover:shadow-[var(--shadow-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              >
                {/* Screenshots are ~2:1 and anchored to the top, so every card
                    shows the site's hero rather than a slice of its middle. */}
                <div className="relative aspect-16/10 overflow-hidden border-b border-border bg-surface-2">
                  <img
                    src={project.image}
                    alt={name}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  <span className="absolute right-3 top-3 rounded-full border border-border bg-bg/80 px-2.5 py-1 font-mono text-[10.5px] text-text backdrop-blur-sm">
                    {hostOf(href)}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-[17px] font-semibold text-white md:text-[18px]">
                    {name}
                  </h3>
                  <p className="mt-2 flex-1 text-[13px] leading-relaxed text-text-muted">
                    {description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-primary">
                    {t("ui.openSite")}
                    <ArrowUpRight
                      aria-hidden
                      className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </span>
                </div>
              </a>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
};

export default OurProjects;
