import uxUiDesigner from '../assets/images/ux-ui-designer.jpg';
import { JobLayout, type JobSpec } from '@/components/site/work/JobLayout';

/** Role page: UX/UI Designer (copy under `public.uiux`). */
const SPEC: JobSpec = {
  ns: 'uiux',
  position: 'ui-ux-designer',
  vacancy: 'uiux',
  image: uxUiDesigner,
  imageAlt: 'UX/UI designer workspace',
  tone: 'burnt',
  num: 'U',
  workOn: ['flows', 'wireframes', 'designSystems', 'translateRequirements', 'collaborateDev', 'improveUsability', 'iterateFeedback'],
  skillsTitle: 'coreSkillsTitle',
  skills: ['uxPrinciples', 'solidUi', 'figmaExperience', 'dataHeavyInterfaces', 'clearThinking', 'portfolioProcess'],
  nice: ['devCollab', 'responsiveMobile', 'designSystemsPatterns', 'adminInternal'],
  how: ['architectureFirstProduct', 'alignedFromStart', 'noRushedVisuals', 'logicBackedDecisions', 'longTermMaintainability'],
  get: ['realProductionNotConcept', 'influenceStructureUx', 'closeCollabEngineering', 'spaceToIterate', 'professionalEnvironment'],
  requirements: ['figma', 'designSystems', 'webMobileUx'],
};

const UiDesigner = () => <JobLayout spec={SPEC} />;

export default UiDesigner;
