import luxmart from "../../../assets/images/luxmart.png";
import lmsImage from "../../../assets/images/lms.png";
import academyImage from "../../../assets/images/academy.png";
import azennImage from "../../../assets/images/azenn.png";
import ederaEventsImage from "../../../assets/images/ederaevents.png";
import Container from "../Container";
import { useI18n } from "@/contexts/I18nContext";

type ProjectCard = {
  key: 'luxmart' | 'lms' | 'azenn' | 'academy' | 'ederaEvents';
  link: string;
  image: string;
};

const PROJECTS: ProjectCard[] = [
  { key: 'luxmart', link: "https://luxmart.az", image: luxmart },
  { key: 'lms', link: "https://lms.alievsspace.com", image: lmsImage },
  { key: 'azenn', link: "https://azenn.az", image: azennImage },
  { key: 'academy', link: "https://academy.alievsspace.com", image: academyImage },
  { key: 'ederaEvents', link: "https://ederaevents.com", image: ederaEventsImage },
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
          <h2 className="text-white font-inter text-[26px] md:text-[38px] font-bold">
            {t("public.home.projects.title")}
          </h2>
          <p className="font-inter text-[#C5C5C5] max-w-[370px] md:max-w-[800px] text-center text-[13px] md:text-[18px]">
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
                className="flex h-full flex-col gap-3 p-5 border-b-[1px] border-l-[1px] border-white rounded-[10px] cursor-pointer transition-all duration-200 ease-out hover:-translate-y-1 hover:bg-white/5 hover:border-[#133FA6] hover:shadow-[0_8px_24px_rgba(19,63,166,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#133FA6]/50"
              >
                <img
                  src={project.image}
                  alt={name}
                  className="w-full h-[140px] md:h-[160px] object-cover rounded-[8px] bg-[#0A0A1E]"
                />
                <h4 className="font-inter text-white text-[20px] md:text-[24px] font-semibold">
                  {name}
                </h4>
                <p className="font-inter text-[#C5C5C5] text-[13px] md:text-[16px]">
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
