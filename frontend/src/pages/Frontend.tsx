import frontend from '../assets/images/frontend.jpg';
import { JobLayout, type JobSpec } from '@/components/site/work/JobLayout';

/** Role page: Frontend Developer (copy under `public.frontend`). */
const SPEC: JobSpec = {
  ns: 'frontend',
  position: 'frontend-developer',
  vacancy: 'frontend',
  image: frontend,
  imageAlt: 'Frontend developer workspace',
  tone: 'amber',
  num: 'F',
  workOn: ['architecture', 'adminDashboards', 'translateDesigns', 'integrateApis', 'performanceAccessibility', 'maintainEvolve'],
  skillsTitle: 'technicalSkillsTitle',
  skills: ['jsTs', 'react', 'componentArchitecture', 'restAsync', 'responsive', 'cleanCode'],
  nice: ['adminSaaS', 'uiPerformance', 'designSystems', 'portfolio'],
  how: ['architectureFirst', 'clearRequirements', 'noHacks', 'longTermStability', 'collaboration'],
  get: ['realProduction', 'ownership', 'collaboration', 'longTermThinking', 'engineeringCulture'],
  requirements: ['htmlCssJs', 'uiSense', 'cleanCode'],
};

const Frontend = () => <JobLayout spec={SPEC} />;

export default Frontend;
