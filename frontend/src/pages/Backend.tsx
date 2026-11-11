import backend from '../assets/images/backend.jpg';
import { JobLayout, type JobSpec } from '@/components/site/work/JobLayout';

/** Role page: Backend Developer (copy under `public.backend`). */
const SPEC: JobSpec = {
  ns: 'backend',
  position: 'backend-developer',
  vacancy: 'backend',
  image: backend,
  imageAlt: 'Backend background',
  tone: 'rust',
  num: 'B',
  workOn: ['architecture', 'apis', 'databasesLogic', 'authRbac', 'performanceReliability', 'collaborateFrontend', 'improveWithoutBreaking'],
  skillsTitle: 'technicalSkillsTitle',
  skills: ['language', 'apiDesign', 'relationalModeling', 'securityAuth', 'cleanMaintainable', 'productionBehavior'],
  nice: ['scalableTraffic', 'jobsQueuesCaching', 'loggingMonitoring', 'adminInternal'],
  how: ['architectureFirst', 'clearOwnership', 'noRushedFeatures', 'stabilityIntegrity', 'closeCollaboration'],
  get: ['realProduction', 'businessLogic', 'collaboration', 'cleanArchitecture', 'engineeringEnvironment'],
  requirements: ['restSql', 'authRbacSense', 'performanceMindset'],
};

const Backend = () => <JobLayout spec={SPEC} />;

export default Backend;
