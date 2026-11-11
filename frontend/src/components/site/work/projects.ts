import luxmart from '@/assets/images/luxmart.png';
import lmsImage from '@/assets/images/lms.png';
import academyImage from '@/assets/images/academy.png';
import azennImage from '@/assets/images/azenn.png';
import ederaEventsImage from '@/assets/images/ederaevents.png';
import ssystemsMb from '@/assets/images/ssystems-mb.png';
import turanSK from '@/assets/images/turanSK.png';
import dabiCars from '@/assets/images/dabiCars.png';
import vdvAutoParts from '@/assets/images/vdvAutoParts.png';
import wolfServis from '@/assets/images/wolfServis.png';
import leonCasting from '@/assets/images/leonCasting.png';
import asanyer from '@/assets/images/asanyer.png';
import balakenPark from '@/assets/images/balakenPark.png';

/** Live sites we shipped; the same set (and copy keys) as the home page grid. */
export const PROJECTS = [
  { key: 'luxmart', link: 'https://luxmart.az', image: luxmart },
  { key: 'lms', link: 'https://lms.alievsspace.com', image: lmsImage },
  { key: 'azenn', link: 'https://azenn.az', image: azennImage },
  { key: 'academy', link: 'https://academy.alievsspace.com', image: academyImage },
  { key: 'ederaEvents', link: 'https://ederaevents.com', image: ederaEventsImage },
  { key: 'ssystemsMb', link: 'https://mb-ssystems.com/', image: ssystemsMb },
  { key: 'turanSK', link: 'https://turansk.com/', image: turanSK },
  { key: 'dabiCars', link: 'https://dabicars.com/', image: dabiCars },
  { key: 'vdvAutoParts', link: 'https://vdvautoparts.com/', image: vdvAutoParts },
  { key: 'wolfService', link: 'https://wolfhibridservice.com/', image: wolfServis },
  { key: 'leonCasting', link: 'https://leoncasting.az/', image: leonCasting },
  { key: 'asanyer', link: 'https://asanyer.com/', image: asanyer },
  { key: 'balakenPark', link: 'https://balakenpark.az/', image: balakenPark },
] as const;

export const hostOf = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
  }
};

export function projectNames(t: (k: string) => string) {
  return PROJECTS.map((p) => t(`public.home.projects.items.${p.key}.name`));
}
