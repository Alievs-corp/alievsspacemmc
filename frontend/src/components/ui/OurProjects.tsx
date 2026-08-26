import luxmart from "../../../assets/images/luxmart.png";
import lmsImage from "../../../assets/images/lms.png";
import academyImage from "../../../assets/images/academy.png";
import azennImage from "../../../assets/images/azenn.png";
import ederaEventsImage from "../../../assets/images/ederaevents.png";
import ssystemsMb from "../../../assets/images/ssystems-mb.png"
import turanSK from "../../../assets/images/turanSK.png"
import dabiCars from "../../../assets/images/dabiCars.png"
import vdvAutoParts from "../../../assets/images/vdvAutoParts.png"
import wolfServis from "../../../assets/images/wolfServis.png"
import leonCasting from "../../../assets/images/leonCasting.png"
import asanyer from "../../../assets/images/asanyer.png"
import Container from "../Container";
import { useI18n } from "@/contexts/I18nContext";

type ProjectCard = {
  key: 'luxmart' | 'lms' | 'azenn' | 'academy' | 'ederaEvents' | 'ssystemsMb' | 'turanSK' | 'dabiCars' | 'vdvAutoParts' | 'wolfService' | 'leonCasting' | 'asanyer';
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
];

const OurProjects = () => {
  const { t } = useI18n();

  const normalizeUrl = (url: string) => {
    const u = url.trim();
    return u.startsWith("http") ? u : "https://" + u;
  };

  return (
    <section className="mt-[80px] md:mt-[100px] lg:mt-[120px] mb-16 md:mb-24 px-4">
      <Container className="flex flex-col justify-center items-center">
        <div className="w-full flex flex-col justify-center items-center gap-[10px] text-center">
          <h2 className="text-white font-display text-[26px] md:text-[38px] font-bold">
            {t("public.home.projects.title")}
          </h2>
          <p className="font-inter text-text-muted max-w-[370px] md:max-w-[800px] text-center text-[13px] md:text-[18px]">
            {t("public.home.projects.copy")}
          </p>
        </div>

        <div className="mt-[60px] w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[40px] lg:gap-[20px]">
          {PROJECTS.map((project) => {
            const href = normalizeUrl(project.link);
            const name = t(`public.home.projects.items.${project.key}.name`);
            const description = t(`public.home.projects.items.${project.key}.description`);
            return (
              <a
                key={project.key}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-full flex-col gap-3 card card-interactive p-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              >
                <img
                  src={project.image}
                  alt={name}
                  className="w-full h-[140px] md:h-[160px] object-cover rounded-md bg-surface-2"
                />
                <h4 className="font-display text-white text-[20px] md:text-[24px] font-semibold">
                  {name}
                </h4>
                <p className="font-inter text-text-muted text-[13px] md:text-[16px]">
                  {description}
                </p>
              </a>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

export default OurProjects;
