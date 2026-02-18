export type Locale = 'en' | 'az' | 'ru';

export const SUPPORTED_LOCALES: Array<{ code: Locale; label: string }> = [
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Русский' },
  { code: 'az', label: 'Azərbaycanca' },
];

export const DEFAULT_LOCALE: Locale = 'az';

const LOCALE_KEY = 'alievs_space_locale';

function getNavigatorLocale(): Locale | null {
  try {
    const nav = navigator.language || (navigator.languages && navigator.languages[0]);
    if (!nav) return null;
    const short = nav.slice(0, 2).toLowerCase() as Locale;
    const supported = SUPPORTED_LOCALES.map((l) => l.code);
    if (supported.includes(short)) return short;
    return null;
  } catch {
    return null;
  }
}

export function getLocale(): Locale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE;
  const stored = localStorage.getItem(LOCALE_KEY);
  if (stored && SUPPORTED_LOCALES.some((l) => l.code === stored)) {
    return stored as Locale;
  }
  return getNavigatorLocale() || DEFAULT_LOCALE;
}

export function setLocale(code: Locale): void {
  if (!SUPPORTED_LOCALES.some((l) => l.code === code)) return;
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCALE_KEY, code);
    document.documentElement.lang = code;
  }
}

const translations: Record<Locale, Record<string, any>> = {
  en: {
    ui: {
      language: 'Language',
      menu: 'Menu',
      close: 'Close',
      openSite: 'Open Website',
      logout: 'Logout',
      logo: 'Logo',
      translate: 'Translate',
    },
    nav: {
      home: 'Home',
      about: 'About',
      company: 'Company',
      services: 'Services',
      industries: 'Industries',
      caseStudies: 'Case Studies',
      careers: 'Careers',
      academy: 'Academy',
      blog: 'Blog',
      contact: 'Contact',
      contactSales: 'Contact Sales',
      cta: 'Request a Proposal',
      admin: 'Admin',
      login: 'Login',
    },
    company: {
      name: 'ALIEVS SPACE MMC',
      tagline: 'Premium Digital & Commerce Ecosystem',
    },
    admin: {
      panel: 'Admin Panel',
      dashboard: 'Dashboard',
      services: 'Services',
      projects: 'Projects',
      blog: 'Blog',
      careers: 'Careers',
      inquiries: 'Inquiries',
      users: 'Users',
      settings: 'Settings',
      goToSite: 'Go to Site',
      welcome: 'Welcome back',
      manageContent: 'Manage your site content, services, projects, blog posts, careers, and inquiries.',
      quickActions: 'Quick Actions',
      editServices: 'Edit Services',
      editProjects: 'Edit Projects',
      editBlog: 'Edit Blog',
      viewInquiries: 'View Inquiries',
      manageUsers: 'Manage Users',
      editHome: 'Edit Home',
      editAbout: 'Edit About',
      overview: 'Overview',
      generalStats: 'General statistics and management',
      contentManagement: 'Content management tools',
      generalManagement: 'General Management',
      management: 'Management',
      allSystemsActive: 'All systems active',
      loading: 'Loading...',
      tip: 'Tip: Use Settings → Export JSON to save a backup.',
      new: 'New',
      edit: 'Edit',
      create: 'Create',
      delete: 'Delete',
      save: 'Save',
      cancel: 'Cancel',
      saving: 'Saving...',
      actions: 'Actions',
      title: 'Title',
      location: 'Location',
      type: 'Type',
      category: 'Category',
      industry: 'Industry',
      summary: 'Summary',
      description: 'Description',
      tags: 'Tags',
      link: 'Link',
      externalLink: 'External link',
      noItemsYet: 'No items yet. Click "{button}" to create one.',
      confirmDelete: 'Are you sure you want to delete this item?',
      failedToLoad: 'Failed to load',
      failedToSave: 'Failed to save',
      failedToDelete: 'Failed to delete',
      manageDescription: 'Manage items shown on the public website.',
      newService: 'New service',
      newProject: 'New project',
      newPost: 'New post',
      newVacancy: 'New vacancy',
      newMember: 'New member',
      editService: 'Edit service',
      createService: 'Create service',
      editProject: 'Edit project',
      createProject: 'Create project',
      editPost: 'Edit post',
      createPost: 'Create post',
      editVacancy: 'Edit vacancy',
      createVacancy: 'Create vacancy',
      editMember: 'Edit member',
      createMember: 'Create member',
      noServicesYet: 'No services yet. Click "New service" to create one.',
      noProjectsYet: 'No projects yet. Click "New project" to create one.',
      noPostsYet: 'No blog posts yet. Click "New post" to create one.',
      noCareersYet: 'No careers yet. Click "New vacancy" to create one.',
      noEmployeesYet: 'No employees yet. Click "New member" to create one.',
      bullets: 'Bullets',
      bulletsPlaceholder: 'One per line',
      tagsPlaceholder: 'Comma-separated',
      status: 'Status',
      open: 'Open',
      closed: 'Closed',
      name: 'Name',
      position: 'Position',
      requirements: 'Requirements',
      requirementsPlaceholder: 'One requirement per line',
      team: 'Team',
      teamDescription: 'Add team members with photo, role, and experience.',
      role: 'Role',
      experience: 'Experience',
      experienceYears: 'Experience (years)',
      photoUrl: 'Photo URL',
      bio: 'Bio',
      fullName: 'Full name',
    },
    auth: {
      login: {
        brandTagline: 'Premium Digital & Commerce Ecosystems',
        title: 'Sign in to your account',
        noAccount: "Don't have an account?",
        signUp: 'Sign up',
        fields: {
          email: 'Email',
          password: 'Password',
        },
        placeholders: {
          email: 'you@example.com',
          password: '••••••••',
        },
        rememberMe: 'Remember me',
        forgotPassword: 'Forgot password?',
        submit: 'Sign in',
        submitting: 'Signing in...',
        backHome: 'Return to homepage',
        error: 'Login failed',
        copyright: 'All rights reserved.',
      },
      register: {
        brandTitle: 'Alievs Space',
        brandTagline: 'Premium Digital & Commerce Ecosystems',
        title: 'Create your account',
        haveAccount: 'Already have an account?',
        signIn: 'Sign in',
        fields: {
          name: 'Full Name *',
          email: 'Email *',
          password: 'Password *',
          phone: 'Phone Number',
          company: 'Company Name',
        },
        placeholders: {
          name: 'John Doe',
          email: 'you@example.com',
          password: '••••••••',
          phone: '+994 ...',
          company: 'Your Company Inc.',
        },
        submit: 'Create account',
        submitting: 'Creating account...',
        backHome: 'Return to homepage',
        error: 'Registration failed',
        copyright: 'All rights reserved.',
      },
    },
    public: {
      footerDesc:
        'Premium web & mobile development, e-commerce/marketplace systems, and banking-ready dashboards.',
      industriesCta: 'Discuss this industry',
      requirements: 'Requirements:',
      apply: 'Apply',
      notFoundProject: 'Project not found',
      notFoundPost: 'Post not found',
      contactThanks: "Thank you — we received your request. We'll reply soon.",
      contactValidation: 'Please provide at least your name and email/phone.',
      contactStatusNew: 'New',
      heroTagline: 'Premium • Platinum • Blue',
      buildWhat: 'What we build',
      buildDesc:
        'A structured ecosystem across software, commerce, and banking-focused dashboards — designed premium and built to last.',
      premiumProcess: 'Premium process',
      focusIndustries: 'Focus industries',
      processDesc:
        'We keep delivery structured: architecture first, premium UI, quality control, then launch & support.',
      focusDesc:
        'E-commerce & marketplaces, banking/fintech dashboards, and operational systems where control and reporting matter.',
      adminIncluded: 'Admin Panel Included',
      adminDesc:
        'Manage services, projects, blog, careers, and incoming inquiries in a dedicated admin dashboard. Changes reflect instantly across the site.',
      loading: 'Loading...',
      marketplaceMvp: {
        back: '← Back to Case Studies',
        badge: 'E-commerce · Marketplace',
        title: 'Multi-vendor Marketplace MVP',
        intro:
          'A production-ready multi-vendor marketplace MVP designed with scalable architecture, structured admin control, and vendor level dashboard to support early growth and future expansion.',
        contextTitle: 'Project context',
        contextItems: {
          industry: 'Industry: E-commerce/Marketplace',
          projectType: 'Project type: MVP',
          scope: 'Scope: Full system design & development',
          focus: 'Focus: Admin tooling, vendor management, analytics',
        },
        challengeTitle: 'The challenge',
        challengeCopy:
          'The client needed a marketplace MVP that could support multiple vendors while maintaining clear administrative control, structured product management, and reliable reporting — without overengineering the initial release.',
        solutionTitle: 'Our solution',
        solutionCopy:
          'We designed and implemented a modular marketplace system with a centralized admin panel, individual vendor dashboards, and structured workflows for products, categories, and reporting. The architecture was built to scale as vendors and data volume grow.',
        deliveredTitle: 'What we delivered',
        deliveredItems: {
          admin: 'Central admin panel with role-based access',
          vendors: 'Vendor onboarding and store dashboards',
          products: 'Product and category management',
          analytics: 'Analytics and reporting tools',
          backend: 'Scalable backend architecture',
        },
        deliveryTitle: 'Delivery approach',
        deliveryCopy:
          'We followed an architecture-first approach, defined the UI system early, and delivered the platform in controlled milestones with continuous validation and support.',
        ctaTitle: 'Looking to build a similar system?',
        ctaButton: 'Start a conversation',
      },
      fintechDashboard: {
        back: '← Back to Case Studies',
        badge: 'Banking · Fintech',
        title: 'Fintech Reporting Dashboard',
        intro:
          'A secure, role-based reporting dashboard designed for financial operations, with audit-ready reports, controlled access layers, and clear data visibility to support compliance and internal decision-making.',
        contextTitle: 'Project context',
        contextItems: {
          industry: 'Industry: Banking/ Fintech',
          projectType: 'Project type: internal system',
          scope: 'Scope: Dashboard design & backend implementation',
          focus: 'Focus: RBAC, reporting, audit readiness',
        },
        challengeTitle: 'The challenge',
        challengeCopy:
          'The client required a financial reporting system that could provide accurate, structured data access while meeting internal control and audit requirements. Different user roles needed clearly defined permissions, reliable reporting outputs, and confidence in data integrity — without increasing operational complexity.',
        solutionTitle: 'Our solution',
        solutionCopy:
          'We designed and implemented a role-based reporting dashboard with controlled access layers and structured report generation. The system provides permission-based views, audit-friendly data outputs, and clear financial visibility, supporting both operational use and compliance review.',
        deliveredTitle: 'What we delivered',
        deliveredItems: {
          rbac: 'Role-based access control (RBAC)',
          reports: 'Audit-friendly financial reports',
          security: 'Secure data access layers',
          dashboards: 'Structured reporting dashboards',
          backend: 'Scalable backend foundations',
        },
        deliveryTitle: 'Delivery approach',
        deliveryCopy:
          'We followed a security-first and architecture-driven approach, defining access models early and validating reporting logic throughout development to ensure reliability and compliance readiness.',
        ctaTitle: 'Looking to build a similar system?',
        ctaButton: 'Start a conversation',
      },
      inventory: {
        back: '← Back to Case Studies',
        badge: 'Manufacturing · Operations',
        title: 'Operations & Inventory System',
        intro:
          'An internal operations and inventory management system built to improve stock visibility, financial tracking, and day-to-day operational clarity through structured dashboards and reporting.',
        contextTitle: 'Project context',
        contextItems: {
          industry: 'Industry: Manufacturing / Operations',
          projectType: 'Project type: Internal management system',
          scope: 'Scope:  System design & implementation',
          focus: 'Focus: Inventory, finance tracking, dashboards',
        },
        challengeTitle: 'The challenge',
        challengeCopy:
          'The client needed a centralized system to track inventory levels, income and expenses, and operational data across teams. Existing processes lacked real-time visibility and made it difficult to manage stock accuracy and financial oversight efficiently.',
        solutionTitle: 'Our solution',
        solutionCopy:
          'We built an internal operations platform that centralizes inventory data, financial tracking, and management dashboards. The system provides clear operational views, structured workflows, and reliable data access to support daily decision-making and long-term planning.',
        deliveredTitle: 'What we delivered',
        deliveredItems: {
          inventory: 'Inventory and stock tracking',
          finance: 'Income and expense monitoring',
          dashboards: 'Operational dashboards',
          reporting: 'Management reporting tools',
          backend: 'Scalable internal system architecture',
        },
        deliveryTitle: 'Delivery approach',
        deliveryCopy:
          'We prioritized clarity and reliability by defining system workflows early and delivering the platform in structured stages, ensuring accurate data handling and ease of use for operational teams.',
        ctaTitle: 'Looking to build a similar system?',
        ctaButton: 'Start a conversation',
      },
      home: {
        heroTitle: 'Build premium digital products that scale',
        heroCopy:
          'We deliver web & mobile development, e-commerce/marketplace systems, and banking-ready dashboards with a security-first mindset.',
        ctas: {
          contact: 'Contact Sales',
          services: 'Explore Services',
          caseStudies: 'View Case Studies',
        },
        advantages: {
          headings: {
            years: '4.5+',
            enterprise: 'Enterprise',
            premium: 'Premium',
            secure: 'Secure',
            fast: 'Fast',
          },
          yearsText: 'Years building production systems',
          enterpriseText: 'Ready for real business operations',
          premiumText: 'High-quality UI/UX design systems',
          secureText: 'Access control and auditing built-in',
          fastText: 'Lean delivery without shortcuts',
        },
        build: {
          items: {
            ecommerce: {
              title: 'E-commerce & Marketplaces',
              text: 'Multi-vendor platforms, checkout flows, commissions, analytics.',
              alt: 'eCommerce',
            },
            software: {
              title: 'Software & Product Development',
              text: 'Web apps, mobile apps, admin dashboards, internal systems.',
              alt: 'software',
            },
            banking: {
              title: 'Banking / Fintech Systems',
              text: 'Role-based access, audit-ready reporting, secure data flows.',
              alt: 'banking',
            },
          },
        },
        process: {
          phases: {
            discovery: { title: 'Discovery', desc: 'requirements & constraints' },
            uxui: { title: 'UX/UI', desc: 'flows & interfaces' },
            development: { title: 'Development', desc: 'engineering & integrations' },
            qa: { title: 'QA', desc: 'testing & validation' },
            launch: { title: 'Launch', desc: 'deployment & rollout' },
            support: { title: 'Support', desc: 'maintenance & improvements' },
          },
        },
        projects: {
          title: 'Our Projects',
          copy: 'A selection of projects delivered for different business needs and product types.',
          items: {
            luxmart: { name: 'LuxMart', description: 'Global e‑commerce platform for multi‑category retail.' },
            lms: { name: 'Alievs Space LMS', description: 'Our own learning management system for courses, tracking, and internal training.' },
            azenn: { name: 'Azenn', description: 'E‑commerce platform built for Azenn company’s online retail.' },
            academy: { name: 'Alievs Space Academy', description: 'Our Academy website for education programs, applications, and student journeys.' },
            ederaEvents: { name: 'EderaEvents', description: 'EderaEvents is a dance academy platform' },
          },
        },
      },
      aboutWho: 'Who we are',
      aboutValues: 'Values',
      aboutHow: 'How we deliver',
      aboutDelivery:
        'A structured delivery pipeline designed to stay stable and maintainable as you scale.',
      stepLabel: 'Step',
      serviceFallback: 'Service',
      servicesIntro:
        'Premium engineering & design across software development, e-commerce/marketplaces, and banking-ready dashboards.',
      services: {
        items: {
          web: {
            category: 'Software',
            title: 'Web & Mobile Development',
            description:
              'Corporate websites, web apps, mobile apps, admin dashboards, internal platforms.',
            reqs: {
              premiumUi: 'Premium UI systems',
              performancePages: 'Performance-first pages',
              analyticsReady: 'Analytics-ready structure',
              cleanDocs: 'Clean documentation',
            },
          },
          ecommerce: {
            category: 'Commerce',
            title: 'E-commerce & Marketplace Systems',
            description:
              'Online stores and multi-vendor marketplaces with full operational tooling.',
            reqs: {
              catalogFiltersSearch: 'Catalog + filters + search',
              cartCheckout: 'Cart & checkout flows',
              commissionPayout: 'Commission & payout reporting',
              ownerDashboards: 'Store owner dashboards',
            },
          },
          banking: {
            category: 'Banking',
            title: 'Banking-ready Dashboards',
            description:
              'Secure, audit-friendly systems with roles, reporting, and controlled data access.',
            reqs: {
              rbac: 'Role-based access control',
              auditReporting: 'Audit logs & reporting views',
              secureWorkflow: 'Secure workflow design',
              complianceFriendly: 'Compliance-friendly',
            },
          },
        },
      },
      deliveryTitle: 'Delivery model',
      deliveryCopy:
        'We start with the architecture and UI system. Then we build modules, integrate analytics, and ship in controlled milestones — with ongoing support.',
      delivery: {
        steps: {
          1: { title: 'Architecture & UI System', desc: 'Define system architecture and establish a scalable UI design system.' },
          2: { title: 'Module Development', desc: 'Build core features and modules based on validated requirements.' },
          3: { title: 'Integration & Analytics', desc: 'Integrate services, analytics, and supporting infrastructure.' },
          4: { title: 'Controlled Delivery', desc: 'Release in structured milestones with validation at each stage.' },
          5: { title: 'Ongoing Support', desc: 'Maintain, monitor, and improve the system post-launch.' },
        },
        result: 'Result: predictable delivery, scalable systems, and long-term operational stability.',
      },
      projectsIntro: 'Selected examples across marketplaces, banking dashboards, and operational systems.',
      blogIntro: 'Insights on marketplaces, premium UX, admin systems, and banking-ready dashboards.',
      careersIntro: 'We build premium systems. Join a team that cares about design, structure, and reliability.',
      backend: {
        heroTitle: 'Backend Developer (API/DB)',
        buildTitle: 'Build reliable, scalable systems behind production platforms',
        buildCopy:
          "We’re looking for a Backend Developer who focuses on system reliability, clean architecture, and long-term maintainability. You’ll work on the core logic behind dashboards, marketplaces, and internal platforms where data integrity, performance, and security are critical.",
        workOnTitle: 'What you’ll work on',
        workOn: {
          items: {
            architecture: 'Designing and implementing backend architectures for production systems',
            apis: 'Building and maintaining APIs used by web and mobile applications',
            databasesLogic: 'Working with databases, data models, and business logic',
            authRbac: 'Integrating authentication, authorization, and access control',
            performanceReliability: 'Ensuring system performance, reliability, and scalability',
            collaborateFrontend: 'Collaborating closely with frontend developers and designers',
            improveWithoutBreaking: 'Improving existing systems without breaking production workflows',
          },
        },
        expectTitle: 'What we expect',
        technicalSkillsTitle: 'Technical Skills',
        skills: {
          items: {
            language: 'Strong experience with at least one backend language (e.g. Node.js, Python, Java, or similar)',
            apiDesign: 'Solid understanding of API design (REST, structured data flows)',
            relationalModeling: 'Experience with relational databases and data modeling',
            securityAuth: 'Knowledge of authentication, authorization, and basic security principles',
            cleanMaintainable: 'Ability to write clean, maintainable, and well-structured code',
            productionBehavior: 'Understanding of system behavior in production environments',
          },
        },
        niceToHaveTitle: 'Nice to have',
        nice: {
          items: {
            scalableTraffic: 'Experience with scalable or high-traffic systems',
            jobsQueuesCaching: 'Familiarity with background jobs, queues, or caching',
            loggingMonitoring: 'Understanding of logging, monitoring, and error handling',
            adminInternal: 'Experience working on admin panels or internal tools',
          },
        },
        howWeWorkTitle: 'How we work',
        how: {
          items: {
            architectureFirst: 'Architecture-first backend design',
            clearOwnership: 'Clear ownership and responsibility',
            noRushedFeatures: 'No rushed features without understanding impact',
            stabilityIntegrity: 'Focus on stability, data integrity, and maintainability',
            closeCollaboration: 'Close collaboration between backend, frontend, and design',
          },
        },
        whatYouGetTitle: 'What you get',
        get: {
          items: {
            realProduction: 'Work on real production systems, not toy projects',
            businessLogic: 'Responsibility over core business logic',
            collaboration: 'Collaboration with experienced frontend and UX teams',
            cleanArchitecture: 'Emphasis on clean architecture and long-term thinking',
            engineeringEnvironment: 'A professional engineering environment with clear expectations',
          },
        },
        locationTitle: 'Location & format',
        location: {
          items: {
            country: 'Azerbaijan',
            format: 'Full-time / Hybrid (depending on role and experience)',
          },
        },
        applyTitle: 'Ready to apply?',
        applyCopy:
          'If you care about building stable, scalable backend systems — and want your work to hold up in real production environments — we’d like to hear from you.',
        applyCta: 'Apply for this role',
      },
      uiux: {
        heroTitle: 'UX/UI Designer',
        buildTitle: 'Design systems and interfaces for real, production-ready platforms',
        buildCopy:
          "We’re looking for a UX/UI Designer who understands that good design is not decoration — it’s structure, clarity, and decision-making. You’ll work on real products such as dashboards, marketplaces, and internal systems where usability, consistency, and long-term scalability matter.",
        workOnTitle: 'What you’ll work on',
        workOn: {
          items: {
            flows: 'Designing end-to-end user flows for complex products',
            wireframes: 'Creating wireframes, UI layouts, and interactive prototypes',
            designSystems: 'Defining and maintaining design systems and reusable components',
            translateRequirements: 'Translating business and technical requirements into clear UX solutions',
            collaborateDev: 'Collaborating closely with frontend and backend developers',
            improveUsability: 'Improving usability, accessibility, and consistency across products',
            iterateFeedback: 'Iterating based on feedback, real usage, and constraints',
          },
        },
        expectTitle: 'What we expect',
        coreSkillsTitle: 'Core Skills',
        skills: {
          items: {
            uxPrinciples: 'Strong understanding of UX principles and user-centered design',
            solidUi: 'Solid UI design skills with attention to layout, spacing, and hierarchy',
            figmaExperience: 'Experience with Figma (components, variants, auto layout)',
            dataHeavyInterfaces: 'Ability to design for data-heavy interfaces (dashboards, admin panels)',
            clearThinking: 'Clear thinking and structured problem-solving',
            portfolioProcess: 'Portfolio showing process, not just visuals',
          },
        },
        niceToHaveTitle: 'Nice to have',
        nice: {
          items: {
            devCollab: 'Experience working with developers on real products',
            responsiveMobile: 'Understanding of responsive and mobile-first design',
            designSystemsPatterns: 'Familiarity with design systems and scalable UI patterns',
            adminInternal: 'Experience working on admin panels or internal tools',
          },
        },
        howWeWorkTitle: 'How we work',
        how: {
          items: {
            architectureFirstProduct: 'Architecture-first product thinking',
            alignedFromStart: 'UX, UI, and engineering aligned from the start',
            noRushedVisuals: 'No rushed visuals without understanding the problem',
            logicBackedDecisions: 'Design decisions backed by logic, not trends',
            longTermMaintainability: 'Long-term maintainability over short-term polish',
          },
        },
        whatYouGetTitle: 'What you get',
        get: {
          items: {
            realProductionNotConcept: 'Work on real production systems, not concept designs',
            influenceStructureUx: 'Influence product structure and user experience',
            closeCollabEngineering: 'Close collaboration with engineering teams',
            spaceToIterate: 'Space to think, iterate, and improve designs properly',
            professionalEnvironment: 'A professional environment that values clarity and quality',
          },
        },
        locationTitle: 'Location & format',
        location: {
          items: {
            country: 'Azerbaijan',
            format: 'Full-time / Hybrid (depending on role and experience)',
          },
        },
        applyTitle: 'Ready to apply?',
        applyCopy:
          'If you care about building stable, scalable backend systems — and want your work to hold up in real production environments — we’d like to hear from you.',
        applyCta: 'Apply for this role',
      },
      frontend: {
        heroTitle: 'Frontend Developer (JS / TS)',
        buildTitle: 'Build production-ready interfaces used in real business systems',
        buildCopy:
          'We’re looking for a Frontend Developer who cares about structure, performance, and long-term maintainability — not just visuals. You’ll work on real products such as dashboards, marketplaces, and internal platforms that are used daily in production environments.',
        workOnTitle: 'What you’ll work on',
        workOn: {
          items: {
            architecture: 'Designing and building scalable frontend architectures',
            adminDashboards: 'Developing admin panels, dashboards, and data-heavy interfaces',
            translateDesigns: 'Translating UI/UX designs into clean, maintainable code',
            integrateApis: 'Working closely with backend developers to integrate APIs',
            performanceAccessibility: 'Improving performance, accessibility, and usability across devices',
            maintainEvolve: 'Maintaining and evolving existing systems without breaking them',
          },
        },
        expectTitle: 'What we expect',
        technicalSkillsTitle: 'Technical Skills',
        skills: {
          items: {
            jsTs: 'Strong experience with JavaScript (ES6+) / TypeScript',
            react: 'Solid knowledge of React (or similar modern frameworks)',
            componentArchitecture: 'Understanding of component-based architecture',
            restAsync: 'Experience with REST APIs and async data handling',
            responsive: 'Familiarity with responsive and adaptive UI design',
            cleanCode: 'Clean code mindset (readability, structure, reuse)',
          },
        },
        niceToHaveTitle: 'Nice to have',
        nice: {
          items: {
            adminSaaS: 'Experience with admin dashboards or SaaS products',
            uiPerformance: 'Understanding of UI performance and optimization',
            designSystems: 'Experience working with design systems',
            portfolio: 'GitHub portfolio or real project examples',
          },
        },
        howWeWorkTitle: 'How we work',
        how: {
          items: {
            architectureFirst: 'Architecture-first development',
            clearRequirements: 'Clear requirements and structured delivery',
            noHacks: 'No rushed features, no messy hacks',
            longTermStability: 'Focus on long-term stability over quick wins',
            collaboration: 'Collaboration between design, frontend, and backend from day one',
          },
        },
        whatYouGetTitle: 'What you get',
        get: {
          items: {
            realProduction: 'Work on real, production systems — not demo apps',
            ownership: 'Clear technical ownership and responsibility',
            collaboration: 'Collaboration with designers and backend engineers',
            longTermThinking: 'Long-term product thinking instead of short-term tasks',
            engineeringCulture: 'A clean, professional engineering culture',
          },
        },
        locationTitle: 'Location & format',
        location: {
          items: {
            country: 'Azerbaijan',
            format: 'Full-time / Hybrid (depending on role and experience)',
          },
        },
        applyTitle: 'Ready to apply?',
        applyCopy:
          'If this role sounds like how you want to work — not just what you want to code — we’d like to hear from you.',
        applyCta: 'Apply for this role',
      },
      careers: {
        viewRoleCta: 'View role',
        whyTitle: 'Why work with us',
        whyCopy:
          'We hire engineers and designers who care about system quality, clarity, and long-term impact. Our work focuses on real production systems, not short-lived prototypes.',
        workWithUsAlt: 'Work With Us',
        viewMore: 'View More',
        showLess: 'Show Less',
        vacancies: {
          frontend: {
            title: 'Frontend Developer (JS/TS)',
            description: 'Build premium interfaces and dashboards',
            location: 'Full-time, Baku / Hybrid',
            reqs: {
              htmlCssJs: 'Strong HTML/CSS/JS(TS) skills',
              uiSense: 'UI sense',
              cleanCode: 'Clean Code',
            },
          },
          backend: {
            title: 'Backend Developer (API/DB)',
            description: 'Design APIs, data models, and secure access.',
            location: 'Full-time, Baku / Hybrid',
            reqs: {
              restSql: 'REST/SQL',
              authRbacSense: 'Auth/RBAC sense',
              performanceMindset: 'Performance mindset',
            },
          },
          uiux: {
            title: 'UI/UX Designer',
            description: 'Build premium interfaces and dashboards',
            location: 'Contract / Full-time, Remote / Hybrid',
            reqs: {
              figma: 'Figma',
              designSystems: 'Design systems',
              webMobileUx: 'Web / Mobile UX',
            },
          },
        },
        teamMembers: {
          ismat: {
            name: 'Ismat Cahangirov',
            role: 'Frontend Developer',
            description:
              'Frontend developer at AlievsSpace MMC for over a year.',
          },
          elshan: {
            name: 'Elshan Hasanov',
            role: 'Frontend Developer',
            description:
              'Frontend developer with 1+ years at AlievsSpace MMC.',
          },
          ismayil: {
            name: 'Ismayil Ismayilov',
            role: 'Frontend Developer',
            description:
              'Focused on Frontend Development for 2 years; previously mentor/instructor at Developia Engineering.',
          },
          ravena: {
            name: 'Ravena Balagözova',
            role: 'Frontend Developer',
            description:
              'Continuously improving Frontend Development skills for about a year.',
          },
          zehra: {
            name: 'Zehra Mahmudova',
            role: 'Frontend Developer',
            description:
              'Actively learning Frontend Development for roughly a year and refining practical skills.',
          },
          elmar: {
            name: 'Elmar Azimli',
            role: 'Frontend Developer',
            description:
              'Learning and growing in Frontend for over a year.',
          },
          parvin: {
            name: 'Parvin Ahmadov',
            role: 'Frontend Developer',
            description:
              'Gaining experience in Software Development for over a year and continuously improving skills.',
          },
        },
        team: {
          members: {
            john: {
              role: 'Sales & Marketing Lead',
              description:
                'Leaders building and reporting digital systems with a strong focus on business organisation, sales operations, and logistics-related business development.',
            },
            jane: {
              role: 'Data Analytics Lead',
              description:
                'Developed sustainable analytics frameworks, efficient and ready for customization, sales chain architecture.',
            },
            mike: {
              role: 'Business Development',
              description:
                'Focus on clear requirements and long-term stability and work time management.',
            },
            sarah: {
              role: 'Operations Manager',
              description:
                "Managing high-quality sales databases and displayed values in the Group's top-level capital.",
            },
            robert: {
              role: 'Logistics Specialist',
              description:
                'Expert in logistics-related business development and system optimization.',
            },
            emily: {
              role: 'Sales Operations',
              description:
                'Specialized in sales operations and digital system reporting.',
            },
            david: {
              role: 'Marketing Analyst',
              description:
                'Analyzing sales data and creating actionable insights for business growth.',
            },
            lisa: {
              role: 'Customer Relations',
              description:
                'Building strong customer relationships and ensuring satisfaction.',
            },
          },
        },
      },
            caseStudiesIntro:
              'We showcase real-world projects where structured architecture, thoughtful UX, and disciplined engineering resulted in stable, production-ready systems. Our case studies focus on practical challenges, design decisions, and delivery outcomes that support scalable growth and operational clarity.',
            caseStudies: {
              viewCta: 'View case study',
              keyFocusLabel: 'Key focus',
              requestTitle: 'Request project review',
              requestCopy:
                'Tell us about your project. We receive every request and respond with clear next steps — or previews, via generic sub-pack.',
              tip:
                'Tip: Share your industry, key requirements, and target market. Even a rough idea is enough to start.',
              privacy:
                "We don't share your details. Your message goes directly to our engineering team.",
              chooseField: 'Choose your field',
              items: {
                marketplace: {
                  category: 'E-commerce · Marketplace',
                  title: 'Multi-vendor Marketplace MVP',
                  description:
                    'We designed and built a production-ready multi-vendor marketplace MVP with a strong focus on scalable architecture and operational clarity. The system includes a centralized admin panel, individual vendor dashboards, structured product and category management, and built-in reporting to support early growth and long-term expansion.',
                  focus: [
                    'Marketplace architecture',
                    'Admin & vendor management',
                    'Reporting & analytics',
                  ],
                },
                fintech: {
                  category: 'Banking · Fintech',
                  title: 'Fintech Reporting Dashboard',
                  description:
                    'We designed and built a secure, role-based reporting dashboard for financial operations, focused on audit readiness, data integrity, and controlled access. The system provides structured financial reports, permission-based views, and reliable data visibility to support compliance and internal decision-making.',
                  focus: [
                    'Role-based access control (RBAC)',
                    'Audit-friendly reporting',
                    'Secure data flows',
                  ],
                },
                operations: {
                  category: 'Manufacturing · Operations',
                  title: 'Operations & Inventory System',
                  description:
                    'This project focused on building an internal operations and inventory management system to improve operational clarity and data accuracy. The platform supports stock tracking, income and expense monitoring, and management dashboards designed to streamline day-to-day business operations.',
                  focus: [
                    'Inventory management',
                    'Financial tracking',
                    'Operational dashboards',
                  ],
                },
              },
            },
      teamTitle: 'Our team',
      contactIntro: "Tell us what you're building. We'll reply with a structured proposal.",
      contactFormTitle: 'Send a request',
      contactName: 'Your name *',
      contactCompany: 'Company',
      contactEmail: 'Email',
      contactPhone: 'Phone',
      contactInterest: 'Interest',
      contactTopic: 'Topic',
      contactMessage: 'Message',
      contactCompanyPlaceholder: 'Company name',
      contactTopicPlaceholder: 'What do you want to build?',
      contactMessagePlaceholder: 'Describe your project, timeline, and goals...',
      contactInterestSoftware: 'Software Development',
      contactInterestCommerce: 'E-commerce / Marketplace',
      contactInterestBanking: 'Banking / Fintech Dashboard',
      contactInterestDesign: 'UI/UX & Design System',
      contactInterestSupport: 'Support & Scaling',
      contactHelper:
        'Tip: mention industry (e-commerce/banking), required modules, and target markets.',
      contactSubmit: 'Send request',
      companyDetails: 'Company details',
      companyDetailsCopy:
        'We combine premium UI/UX with stable engineering and admin tooling — across commerce and banking-ready systems.',
      noteBadge: 'Note',
      noteCopy: 'Contact requests are saved and visible in Admin → Inquiries.',
      industriesIntro:
        'We build systems where reliability, reporting, and premium UX are business-critical.',
      about: {
        headerTitle: 'We design and build systems meant to last.',
        headerCopy:
          'Focused on long-term reliability, clear architecture, and systems that remain stable as teams and data grow.',
        whoTitle: 'Who we are',
        whoCopy:
          'Alievs Space MMC is a digital and commerce-focused engineering company building production-ready systems with premium UI and strong operational control. We combine backend architecture, UX systems, and business logic to deliver platforms that are scalable, secure, and easy to operate through structured admin tooling. Our work spans multi-vendor marketplaces, internal management platforms, and banking-oriented dashboards with role-based access, reporting, and audit-ready workflows.',
        who: {
          values: {
            responsibility: 'Responsibility',
            transparency: 'Transparency',
            premiumQuality: 'Premium quality',
            securityReliability: 'Security & reliability',
            longTermPartnership: 'Long-term partnership',
          },
        },
        deliverTitle: 'How we deliver',
        deliverIntro:
          'A structured delivery approach built to reduce risk, ensure quality, and support sustainable product growth.',
        deliver: {
          items: {
            analysis: {
              alt: 'Analysis & Strategy',
              title: 'Analysis & Strategy',
              text:
                'We analyze business goals, technical constraints, and user requirements to define scope, priorities, and a clear delivery roadmap.',
            },
            uxui: {
              alt: 'UX/UI & Architecture',
              title: 'UX/UI & Architecture',
              text:
                'We design the user experience and system architecture together, ensuring usability, scalability, and long-term maintainability from the start.',
            },
            development: {
              alt: 'Development',
              title: 'Development',
              text:
                'We implement core features using modular, production-ready code, following defined architecture and security standards.',
            },
            quality: {
              alt: 'Quality Control',
              title: 'Quality Control',
              text:
                'We validate functionality, performance, and edge cases through structured testing to ensure reliability before release.',
            },
            launch: {
              alt: 'Launch',
              title: 'Launch',
              text:
                'We deploy in controlled stages, monitor system behavior, and ensure a smooth transition into real-world use.',
            },
            support: {
              alt: 'Support & Scaling',
              title: 'Support',
              text:
                'We provide ongoing support, improvements, and scaling strategies as usage grows and business needs evolve.',
            },
          },
        },
        approachTitle: 'Our Approach',
        approachCopy:
          'We build with intention, starting from architecture and operational needs to deliver systems that scale responsibly and perform reliably in production.',
        approachWhoTitle: 'Who we work with',
        approachWhoCopy:
          'We work with teams that need reliable systems, clear reporting, and long-term stability — not temporary solutions. Our approach combines structured engineering, premium UI/UX, and disciplined delivery to ensure the systems we build remain dependable after launch, not just during development.',
        approachResponsibilityTitle: 'Our responsibility beyond code',
        approachResponsibilityCopy:
          'We take responsibility beyond delivery by supporting systems after launch, maintaining clear communication, and building platforms designed to last.',
      },
      industries: {
        items: {
          retail: {
            category: 'Retail & E-commerce',
            title: 'Designed to convert and scale',
            description:
              'Conversion-focused storefronts, checkout UX, analytics, and operational clarity — built to support growth without friction.',
          },
          marketplaces: {
            category: 'Marketplaces',
            title: 'Built for multi-vendor complexity',
            description:
              'Multi-vendor architecture with store dashboards, commissions, payouts, and moderation tools — structured for control and scalability.',
          },
          banking: {
            category: 'Banking / Finance',
            title: 'Security, access, and compliance first',
            description:
              'Role-based access, audit ready reporting, and controlled workflows — designed for regulated financial environments.',
          },
          manufacturing: {
            category: 'Manufacturing & Inventory',
            title: 'Operational clarity at every level',
            description:
              'Stock tracking, cost control, income and expense visibility, and dashboards that support real operational decisions.',
          },
          beauty: {
            category: 'Beauty / Salon Systems',
            title: 'Systems that simplify daily operations',
            description:
              'Bookings, inventory, reminders, staff tools, and client management — designed to reduce overhead and manual work.',
          },
          logistics: {
            category: 'Logistics & Delivery',
            title: 'Visibility across every delivery stage',
            description:
              'Order flows, status tracking, store/admin coordination, and reporting layers that keep operations aligned.',
          },
          startup: {
            category: 'Startups / MVP',
            title: 'From idea to production ready MVP',
            description:
              'Lean MVP delivery with premium UI and scalable architecture — built to validate fast and grow safely.',
          },
        },
        trustedTitle: 'Trusted to deliver production-ready systems',
        trustedCopy1:
          'We work with teams that need reliable systems, clear reporting, and long-term stability — not temporary solutions. Our approach combines structured engineering, premium UI/UX, and disciplined delivery to ensure the systems we build remain dependable after launch, not just during development.',
        trustedCopy2:
          'Every project is handled with clear scope, transparent communication, and architecture-first thinking. We focus on building platforms that teams can operate, extend, and trust as their business grows.',
      },
      projectDetails: 'Details',
      industry: 'Industry',
      tags: 'Tags',
      nextStep: 'Next step',
      projectNextCopy:
        'Want a similar system? We can estimate and propose a clean architecture with premium UI.',
      openLink: 'Open link',
      postLabel: 'Post',
      postHelpTitle: 'Need help?',
      postHelpCopy:
        "If you're building a marketplace, e-commerce platform, or a banking-ready dashboard — we can propose a premium architecture.",
      contact: {
        loading: 'Loading...',
        heroTitle: 'Why teams choose us',
        heroCopy:
          'We design and engineer production-ready digital systems by combining premium UI/UX, stable backend architecture, and admin tooling — across commerce and banking-ready platforms.',
        hero: {
          items: {
            premiumUi: 'Premium UI systems',
            scalableBackend: 'Scalable backend architecture',
            marketplaceInfra: 'Marketplace infrastructure',
            adminDashboards: 'Production admin dashboards',
          },
        },
        details: {
          phone: 'Phone: +994 (51) 700 35 00',
          email: 'Email: alievsspacemmc@gmail.com' ,
          location: 'Location: Azerbaijan',
        },
        form: {
          title: 'Request project review',
          copy:
            'Tell us about your project. We receive every request and respond with clear next steps — or previews, via generic sub-pack.',
          labels: {
            name: 'Your name *',
            company: 'Company name',
            email: 'Email',
            phone: 'Phone',
            industry: 'Industry',
            projectOverview: 'Project overview',
            message: 'Message',
          },
          placeholders: {
            name: 'Name',
            company: 'Company name',
            email: 'name@gmail.com',
            phone: '+994 …',
            projectOverview: 'What do you want to build?',
            message:
              'Describe your project, goals, and expected timeline. Key requirements and target market are enough to start.',
          },
          options: {
            choose: 'Choose your field',
            banking: 'Banking',
            ecommerce: 'E-commerce',
            software: 'Software Development',
          },
          tip:
            'Tip: Share your industry, key requirements, and target market. Even a rough idea is enough to start.',
          submit: 'Send request',
          privacy:
            "We don't share your details. Your message goes directly to our engineering team.",
        },
        alt: {
          phone: 'Phone icon',
          mail: 'Mail icon',
          location: 'Location icon',
        },
      },
    },
  },


  ru: {
    ui: {
      language: 'Язык',
      menu: 'Меню',
      close: 'Закрыть',
      openSite: 'Открыть сайт',
      logout: 'Выйти',
      logo: 'Логотип',
      translate: 'Перевести',
    },
    nav: {
      home: 'Главная',
      about: 'О нас',
      company: 'Компания',
      services: 'Услуги',
      industries: 'Отрасли',
      caseStudies: 'Кейсы',
      projects: 'Кейсы',
      careers: 'Карьера',
      academy: 'Академия',
      blog: 'Блог',
      contact: 'Контакты',
      contactSales: 'Связаться с продажами',
      cta: 'Запросить предложение',
      admin: 'Админ',
      login: 'Войти',
    },
    company: {
      name: 'ALIEVS SPACE MMC',
      tagline: 'Премиальная цифровая и коммерческая экосистема',
    },
    admin: {
      panel: 'Админ-панель',
      dashboard: 'Панель управления',
      services: 'Услуги',
      projects: 'Проекты',
      blog: 'Блог',
      careers: 'Карьера',
      inquiries: 'Запросы',
      users: 'Пользователи',
      settings: 'Настройки',
      goToSite: 'Перейти на сайт',
      welcome: 'Добро пожаловать',
      manageContent: 'Управляйте контентом сайта, услугами, проектами, записями блога, карьерой и запросами.',
      quickActions: 'Быстрые действия',
      editServices: 'Редактировать услуги',
      editProjects: 'Редактировать проекты',
      editBlog: 'Редактировать блог',
      viewInquiries: 'Просмотр запросов',
      manageUsers: 'Управление пользователями',
      editHome: 'Редактировать главную',
      editAbout: 'Редактировать о нас',
      overview: 'Обзор',
      generalStats: 'Общая статистика и управление',
      contentManagement: 'Инструменты управления контентом',
      generalManagement: 'Общее управление',
      management: 'Управление',
      allSystemsActive: 'Все системы активны',
      loading: 'Загрузка...',
      tip: 'Совет: Используйте Настройки → Экспорт JSON для сохранения резервной копии.',
      new: 'Новый',
      edit: 'Редактировать',
      create: 'Создать',
      delete: 'Удалить',
      save: 'Сохранить',
      cancel: 'Отмена',
      saving: 'Сохранение...',
      actions: 'Действия',
      title: 'Название',
      location: 'Местоположение',
      type: 'Тип',
      category: 'Категория',
      industry: 'Отрасль',
      summary: 'Краткое описание',
      description: 'Описание',
      tags: 'Теги',
      link: 'Ссылка',
      externalLink: 'Внешняя ссылка',
      noItemsYet: 'Пока нет элементов. Нажмите "{button}", чтобы создать.',
      confirmDelete: 'Вы уверены, что хотите удалить этот элемент?',
      failedToLoad: 'Не удалось загрузить',
      failedToSave: 'Не удалось сохранить',
      failedToDelete: 'Не удалось удалить',
      manageDescription: 'Управление элементами, отображаемыми на публичном сайте.',
      newService: 'Новая услуга',
      newProject: 'Новый проект',
      newPost: 'Новая запись',
      newVacancy: 'Новая вакансия',
      newMember: 'Новый сотрудник',
      editService: 'Редактировать услугу',
      createService: 'Создать услугу',
      editProject: 'Редактировать проект',
      createProject: 'Создать проект',
      editPost: 'Редактировать запись',
      createPost: 'Создать запись',
      editVacancy: 'Редактировать вакансию',
      createVacancy: 'Создать вакансию',
      editMember: 'Редактировать сотрудника',
      createMember: 'Создать сотрудника',
      noServicesYet: 'Пока нет услуг. Нажмите "Новая услуга", чтобы создать.',
      noProjectsYet: 'Пока нет проектов. Нажмите "Новый проект", чтобы создать.',
      noPostsYet: 'Пока нет записей в блоге. Нажмите "Новая запись", чтобы создать.',
      noCareersYet: 'Пока нет вакансий. Нажмите "Новая вакансия", чтобы создать.',
      noEmployeesYet: 'Пока нет сотрудников. Нажмите "Новый сотрудник", чтобы создать.',
      bullets: 'Пункты',
      bulletsPlaceholder: 'По одному на строку',
      tagsPlaceholder: 'Через запятую',
      status: 'Статус',
      open: 'Открыта',
      closed: 'Закрыта',
      name: 'Имя',
      position: 'Должность',
      requirements: 'Требования',
      requirementsPlaceholder: 'Одно требование на строку',
      team: 'Команда',
      teamDescription: 'Добавьте членов команды с фотографией, ролью и опытом.',
      role: 'Роль',
      experience: 'Опыт',
      experienceYears: 'Опыт (лет)',
      photoUrl: 'URL фотографии',
      bio: 'Биография',
      fullName: 'Полное имя',
      brand: 'Бренд',
      brandName: 'Название бренда',
      tagline: 'Слоган',
      email: 'Электронная почта',
      phone: 'Телефон',
      address: 'Адрес',
      instagramUrl: 'URL Instagram',
      linkedinUrl: 'URL LinkedIn',
      youtubeUrl: 'URL YouTube',
      ctaPrimaryText: 'Текст основной CTA',
      ctaPrimaryHref: 'Ссылка основной CTA',
      export: 'Экспорт',
      import: 'Импорт',
      exportDescription: 'Экспортировать весь контент как JSON',
      importDescription: 'Импортировать контент из JSON файла',
    },
    auth: {
      login: {
        brandTagline: 'Премиальные цифровые и коммерческие экосистемы',
        title: 'Войдите в свой аккаунт',
        noAccount: 'Нет аккаунта?',
        signUp: 'Зарегистрироваться',
        fields: {
          email: 'Электронная почта',
          password: 'Пароль',
        },
        placeholders: {
          email: 'you@example.com',
          password: '••••••••',
        },
        rememberMe: 'Запомнить меня',
        forgotPassword: 'Забыли пароль?',
        submit: 'Войти',
        submitting: 'Вход...',
        backHome: 'Вернуться на главную',
        error: 'Ошибка входа',
        copyright: 'Все права защищены.',
      },
      register: {
        brandTitle: 'Alievs Space',
        brandTagline: 'Премиальные цифровые и коммерческие экосистемы',
        title: 'Создайте аккаунт',
        haveAccount: 'Уже есть аккаунт?',
        signIn: 'Войти',
        fields: {
          name: 'Полное имя *',
          email: 'Электронная почта *',
          password: 'Пароль *',
          phone: 'Номер телефона',
          company: 'Название компании',
        },
        placeholders: {
          name: 'Иван Иванов',
          email: 'you@example.com',
          password: '••••••••',
          phone: '+7 (999) 123-45-67',
          company: 'Ваша Компания',
        },
        submit: 'Создать аккаунт',
        copyright: 'Все права защищены.',
        submitting: 'Создание аккаунта...',
        backHome: 'Вернуться на главную',
        error: 'Регистрация не удалась',
      },
    },
    public: {
      footerDesc:
        'Премиальная разработка веб и мобильных продуктов, e-commerce/маркетплейсы и банковские дашборды.',
      industriesCta: 'Обсудить отрасль',
      requirements: 'Требования:',
      apply: 'Откликнуться',
      notFoundProject: 'Проект не найден',
      notFoundPost: 'Статья не найдена',
      contactThanks: 'Спасибо — мы получили запрос и скоро ответим.',
      contactValidation: 'Укажите имя и контакт (email или телефон).',
      contactStatusNew: 'Новая',
      heroTagline: 'Premium • Platinum • Blue',
      buildWhat: 'Что мы делаем',
      buildDesc:
        'Структурированная экосистема ПО, e-commerce и банковских дашбордов — премиальный дизайн и надежная реализация.',
      premiumProcess: 'Премиальный процесс',
      focusIndustries: 'Ключевые отрасли',
      processDesc:
        'Структурированный процесс: архитектура, премиальный UI, контроль качества, запуск и поддержка.',
      focusDesc:
        'E-commerce и маркетплейсы, финтех-дашборды и операционные системы с отчетностью.',
      adminIncluded: 'Админ-панель включена',
      adminDesc:
        'Управляйте услугами, кейсами, блогом, вакансиями и лидами. Изменения сразу на сайте.',
      loading: 'Загрузка…',
      marketplaceMvp: {
        back: '← Назад к кейсам',
        badge: 'E-commerce · Маркетплейс',
        title: 'MVP маркетплейса с мультивендорами',
        intro:
          'Готовый к продакшену MVP маркетплейса с масштабируемой архитектурой, структурированным админ‑контролем и дашбордом для продавцов — для раннего роста и будущего расширения.',
        contextTitle: 'Контекст проекта',
        contextItems: {
          industry: 'Отрасль: E-commerce/Маркетплейс',
          projectType: 'Тип проекта: MVP',
          scope: 'Объем: Полный дизайн и разработка системы',
          focus: 'Фокус: Админ‑инструменты, управление продавцами, аналитика',
        },
        challengeTitle: 'Задача',
        challengeCopy:
          'Клиенту нужен был MVP маркетплейса, поддерживающий нескольких продавцов, с понятным админ‑контролем, структурированным управлением товарами и надежной отчетностью — без переусложнения первого релиза.',
        solutionTitle: 'Решение',
        solutionCopy:
          'Мы спроектировали и реализовали модульную систему маркетплейса с централизованной админ‑панелью, отдельными дашбордами продавцов и структурированными потоками для товаров, категорий и отчетности. Архитектура спроектирована для роста количества продавцов и объема данных.',
        deliveredTitle: 'Что мы сделали',
        deliveredItems: {
          admin: 'Центральная админ‑панель с ролевым доступом',
          vendors: 'Онбординг продавцов и дашборды магазинов',
          products: 'Управление товарами и категориями',
          analytics: 'Аналитика и отчетность',
          backend: 'Масштабируемая backend‑архитектура',
        },
        deliveryTitle: 'Подход к поставке',
        deliveryCopy:
          'Мы придерживались архитектуры на первом месте, рано определили UI‑систему и поставляли платформу по контролируемым этапам с непрерывной валидацией и поддержкой.',
        ctaTitle: 'Хотите построить похожую систему?',
        ctaButton: 'Начать диалог',
      },
      fintechDashboard: {
        back: '← Назад к кейсам',
        badge: 'Банкинг · Финтех',
        title: 'Дашборд отчетности для финтеха',
        intro:
          'Защищенный дашборд отчетности с ролевым доступом для финансовых операций: отчеты, готовые к аудиту, контролируемые уровни доступа и понятная видимость данных для соответствия и внутренних решений.',
        contextTitle: 'Контекст проекта',
        contextItems: {
          industry: 'Отрасль: Банкинг/ Финтех',
          projectType: 'Тип проекта: внутренняя система',
          scope: 'Объем: дизайн дашборда и реализация backend',
          focus: 'Фокус: RBAC, отчетность, готовность к аудиту',
        },
        challengeTitle: 'Задача',
        challengeCopy:
          'Клиенту требовалась система финансовой отчетности, обеспечивающая точный и структурированный доступ к данным при соблюдении внутренних контролей и требований аудита. Разным ролям нужны четкие права, надежные выходы отчетов и уверенность в целостности данных — без усложнения операций.',
        solutionTitle: 'Решение',
        solutionCopy:
          'Мы спроектировали и реализовали дашборд отчетности с ролевой моделью доступа, контролируемыми уровнями и структурированной генерацией отчетов. Система обеспечивает представления по правам, аудито‑дружелюбные выгрузки и прозрачность финансов — для операционного использования и проверки соответствия.',
        deliveredTitle: 'Что мы сделали',
        deliveredItems: {
          rbac: 'Ролевой доступ (RBAC)',
          reports: 'Финансовые отчеты, удобные для аудита',
          security: 'Защищенные уровни доступа к данным',
          dashboards: 'Структурированные дашборды отчетности',
          backend: 'Масштабируемые backend‑основания',
        },
        deliveryTitle: 'Подход к поставке',
        deliveryCopy:
          'Мы следовали принципу «безопасность прежде всего» и подходу, основанному на архитектуре: рано определили модели доступа и валидировали логику отчетности на протяжении разработки, чтобы обеспечить надежность и готовность к соответствию.',
        ctaTitle: 'Хотите построить похожую систему?',
        ctaButton: 'Начать диалог',
      },
      inventory: {
        back: '← Назад к кейсам',
        badge: 'Производство · Операции',
        title: 'Система операций и инвентаризации',
        intro:
          'Внутренняя система управления операциями и инвентаризацией для улучшения видимости запасов, финансового учета и ежедневной операционной ясности через структурированные дашборды и отчетность.',
        contextTitle: 'Контекст проекта',
        contextItems: {
          industry: 'Отрасль: Производство / Операции',
          projectType: 'Тип проекта: внутренняя система управления',
          scope: 'Объем: дизайн и реализация системы',
          focus: 'Фокус: инвентарь, финучет, дашборды',
        },
        challengeTitle: 'Задача',
        challengeCopy:
          'Клиенту нужна была централизованная система для отслеживания уровней запасов, доходов и расходов, а также операционных данных по командам. Текущие процессы не давали видимости в реальном времени, усложняя точный учет запасов и эффективный финансовый контроль.',
        solutionTitle: 'Решение',
        solutionCopy:
          'Мы создали внутреннюю операционную платформу, централизующую данные об инвентаре, финансовый учет и управленческие дашборды. Система обеспечивает понятные операционные представления, структурированные процессы и надежный доступ к данным для принятия повседневных решений и долгосрочного планирования.',
        deliveredTitle: 'Что мы сделали',
        deliveredItems: {
          inventory: 'Отслеживание инвентаря и запасов',
          finance: 'Мониторинг доходов и расходов',
          dashboards: 'Операционные дашборды',
          reporting: 'Инструменты управленческой отчетности',
          backend: 'Масштабируемая архитектура внутренней системы',
        },
        deliveryTitle: 'Подход к поставке',
        deliveryCopy:
          'Мы обеспечили ясность и надежность, рано определив рабочие процессы системы и поставляя платформу по структурированным этапам, чтобы гарантировать точную обработку данных и удобство для операционных команд.',
        ctaTitle: 'Хотите построить похожую систему?',
        ctaButton: 'Начать диалог',
      },
      home: {
        heroTitle: 'Строим премиальные цифровые продукты, которые масштабируются',
        heroCopy:
          'Мы всегда ставим безопасность на первый план, предоставляя веб- и мобильную разработку, системы электронной коммерции и панели управления, соответствующие банковским стандартам.',
        ctas: {
          contact: 'Связаться с отделом продаж',
          services: 'Посмотреть услуги',
          caseStudies: 'Смотреть кейсы',
        },
        advantages: {
          headings: {
            years: '4.5+',
            enterprise: 'Предприятие',
            premium: 'Премиум',
            secure: 'Безопасно',
            fast: 'Быстро',
          },
          yearsText: 'Годы работы над производственными системами',
          enterpriseText: 'Готов к реальным деловым операциям',
          premiumText: 'Высококачественные UI/UX дизайн-системы',
          secureText: 'Встроенный контроль доступа и аудит',
          fastText: 'Эффективная доставка без сокращений',
        },
        build: {
          items: {
            ecommerce: {
              title: 'E-commerce и маркетплейсы',
              text: 'Мультивендорные платформы, платежные потоки, комиссии, аналитика.',
              alt: 'eCommerce',
            },
            software: {
              title: 'Разработка ПО и продуктов',
              text: 'Веб-приложения, мобильные приложения, админ-панели, внутренние системы.',
              alt: 'software',
            },
            banking: {
              title: 'Банковские / финтех-системы',
              text: 'Ролевой доступ, отчеты для аудита, защищенные потоки данных.',
              alt: 'banking',
            },
          },
        },
        process: {
          phases: {
            discovery: { title: 'Аналитика', desc: 'требования и ограничения' },
            uxui: { title: 'UX/UI', desc: 'потоки и интерфейсы' },
            development: { title: 'Разработка', desc: 'инжиниринг и интеграции' },
            qa: { title: 'QA', desc: 'тестирование и валидация' },
            launch: { title: 'Запуск', desc: 'деплой и развертывание' },
            support: { title: 'Поддержка', desc: 'сопровождение и улучшения' },
          },
        },
        projects: {
          title: 'Наши проекты',
          copy: 'Подборка проектов, выполненных для разных бизнес-задач и типов продуктов.',
          items: {
            luxmart: { name: 'LuxMart', description: 'Глобальная e‑commerce платформа для мульти-категорийной розницы.' },
            lms: { name: 'Alievs Space LMS', description: 'Наша система управления обучением: курсы, трекинг и внутреннее обучение.' },
            azenn: { name: 'Azenn', description: 'E‑commerce платформа для онлайн-продаж компании Azenn.' },
            academy: { name: 'Alievs Space Academy', description: 'Сайт нашей Академии: образовательные программы, заявки и путь студента.' },
            ederaEvents: { name: 'EderaEvents', description: 'EderaEvents — платформа танцевальной академии' },
          },
        },
      },
      aboutWho: 'Кто мы',
      aboutValues: 'Ценности',
      aboutHow: 'Как мы работаем',
      aboutDelivery: 'Структурированный процесс поставки, который остаётся стабильным при росте.',
      stepLabel: 'Шаг',
      serviceFallback: 'Услуга',
      servicesIntro:
        'Премиальная инженерия и дизайн: разработка, e-commerce/маркетплейсы и банковские дашборды.',
      contact: {
        loading: 'Загрузка…',
        heroTitle: 'Почему команды выбирают нас',
        heroCopy:
          'Мы проектируем и создаем производственные цифровые системы, сочетая премиальный UI/UX, стабильную backend-архитектуру и админ-инструменты — для платформ коммерции и банковского уровня.',
        hero: {
          items: {
            premiumUi: 'Премиальные UI‑системы',
            scalableBackend: 'Масштабируемая backend‑архитектура',
            marketplaceInfra: 'Инфраструктура маркетплейса',
            adminDashboards: 'Админ‑панели для продакшена',
          },
        },
        details: {
          phone: 'Телефон: +994 (51) 700 35 00',
          email: 'Email: alievsspacemmc@gmail.com',
          location: 'Локация: Азербайджан',
        },
        form: {
          title: 'Запрос на обзор проекта',
          copy:
            'Расскажите нам о проекте. Мы получаем каждый запрос и отвечаем понятными следующими шагами — или предварительным пакетом.',
          labels: {
            name: 'Ваше имя *',
            company: 'Название компании',
            email: 'Email',
            phone: 'Телефон',
            industry: 'Отрасль',
            projectOverview: 'Обзор проекта',
            message: 'Сообщение',
          },
          placeholders: {
            name: 'Имя',
            company: 'Название компании',
            email: 'name@gmail.com',
            phone: '+994 …',
            projectOverview: 'Что вы хотите построить?',
            message:
              'Опишите проект, цели и ожидаемые сроки. Ключевые требования и целевой рынок — этого достаточно, чтобы начать.',
          },
          options: {
            choose: 'Выберите сферу',
            banking: 'Банкинг',
            ecommerce: 'E‑commerce',
            software: 'Разработка ПО',
          },
          tip:
            'Совет: Укажите отрасль, ключевые требования и целевой рынок. Даже наброска достаточно, чтобы начать.',
          submit: 'Отправить запрос',
          privacy:
            'Мы не передаем ваши данные. Сообщение попадет напрямую в инженерную команду.',
        },
        alt: {
          phone: 'Иконка телефона',
          mail: 'Иконка почты',
          location: 'Иконка локации',
        },
      },
      services: {
        items: {
          web: {
            category: 'Софтвер',
            title: 'Веб и мобильная разработка',
            description:
              'Корпоративные сайты, веб‑приложения, мобильные приложения, админ‑панели и внутренние платформы.',
            reqs: {
              premiumUi: 'Премиальные UI‑системы',
              performancePages: 'Страницы с упором на производительность',
              analyticsReady: 'Структура, готовая к аналитике',
              cleanDocs: 'Чистая документация',
            },
          },
          ecommerce: {
            category: 'Коммерция',
            title: 'E‑commerce и маркетплейсы',
            description:
              'Интернет‑магазины и мультивендорные маркетплейсы с полным операционным инструментарием.',
            reqs: {
              catalogFiltersSearch: 'Каталог + фильтры + поиск',
              cartCheckout: 'Корзина и процессы оплаты',
              commissionPayout: 'Отчётность по комиссиям и выплатам',
              ownerDashboards: 'Панели владельцев магазинов',
            },
          },
          banking: {
            category: 'Банкинг',
            title: 'Банковские дашборды',
            description:
              'Безопасные, аудит‑дружелюбные системы с ролями, отчётностью и контролируемым доступом к данным.',
            reqs: {
              rbac: 'Ролевой доступ (RBAC)',
              auditReporting: 'Аудит‑логи и отчётные представления',
              secureWorkflow: 'Безопасные workflows',
              complianceFriendly: 'Соответствие требованиям',
            },
          },
        },
      },
      deliveryTitle: 'Модель поставки',
      deliveryCopy:
        'Начинаем с архитектуры и UI системы, затем строим модули, подключаем аналитику и сдаём контролируемыми этапами с поддержкой.',
      delivery: {
        steps: {
          1: { title: 'Архитектура и UI‑система', desc: 'Определяем архитектуру и закладываем масштабируемую UI‑систему.' },
          2: { title: 'Разработка модулей', desc: 'Строим ключевые функции и модули на основе валидированных требований.' },
          3: { title: 'Интеграции и аналитика', desc: 'Подключаем сервисы, аналитику и инфраструктуру поддержки.' },
          4: { title: 'Контролируемая поставка', desc: 'Выпуск по этапам с проверкой и валидацией на каждом шаге.' },
          5: { title: 'Непрерывная поддержка', desc: 'Сопровождаем, мониторим и улучшаем систему после запуска.' },
        },
        result: 'Результат: предсказуемая поставка, масштабируемые системы и долгосрочная стабильность.',
      },
      projectsIntro: 'Примеры проектов: маркетплейсы, банковские дашборды и операционные системы.',
      blogIntro: 'Мысли о маркетплейсах, премиальном UX, админ-системах и банковских панелях.',
      careersIntro:
        'Мы строим премиальные системы. Присоединяйтесь, если важны дизайн, структура и надежность.',
      backend: {
        heroTitle: 'Backend‑разработчик (API/DB)',
        buildTitle: 'Надёжные и масштабируемые системы для продакшена',
        buildCopy:
          'Мы ищем бэкенд‑разработчика, который фокусируется на надёжности систем, чистой архитектуре и долгосрочной поддерживаемости. Вы будете работать над ядром логики для дашбордов, маркетплейсов и внутренних платформ, где критичны целостность данных, производительность и безопасность.',
        workOnTitle: 'Чем будете заниматься',
        workOn: {
          items: {
            architecture: 'Проектирование и реализация бэкенд‑архитектур для продакшенных систем',
            apis: 'Разработка и поддержка API для веб и мобильных приложений',
            databasesLogic: 'Работа с базами данных, моделями данных и бизнес‑логикой',
            authRbac: 'Интеграция аутентификации, авторизации и контролей доступа',
            performanceReliability: 'Обеспечение производительности, надёжности и масштабируемости систем',
            collaborateFrontend: 'Тесное сотрудничество с фронтенд‑разработчиками и дизайнерами',
            improveWithoutBreaking: 'Улучшение существующих систем без поломок рабочих процессов',
          },
        },
        expectTitle: 'Что мы ожидаем',
        technicalSkillsTitle: 'Технические навыки',
        skills: {
          items: {
            language: 'Опыт с одним из бэкенд‑языков (например, Node.js, Python, Java и т.п.)',
            apiDesign: 'Понимание проектирования API (REST, структурированные потоки данных)',
            relationalModeling: 'Опыт с реляционными БД и моделированием данных',
            securityAuth: 'Знание аутентификации, авторизации и базовых принципов безопасности',
            cleanMaintainable: 'Умение писать чистый, поддерживаемый и хорошо структурированный код',
            productionBehavior: 'Понимание поведения систем в продакшен‑среде',
          },
        },
        niceToHaveTitle: 'Плюсом будет',
        nice: {
          items: {
            scalableTraffic: 'Опыт со масштабируемыми или высоконагруженными системами',
            jobsQueuesCaching: 'Понимание фоновых задач, очередей или кэширования',
            loggingMonitoring: 'Знание логирования, мониторинга и обработки ошибок',
            adminInternal: 'Опыт разработки админ‑панелей или внутренних инструментов',
          },
        },
        howWeWorkTitle: 'Как мы работаем',
        how: {
          items: {
            architectureFirst: 'Архитектура‑в‑приоритете для бэкенда',
            clearOwnership: 'Чёткое владение зонами ответственности',
            noRushedFeatures: 'Без спешки и функций без понимания последствий',
            stabilityIntegrity: 'Фокус на стабильности, целостности данных и поддерживаемости',
            closeCollaboration: 'Тесная работа бэкенда, фронтенда и дизайна',
          },
        },
        whatYouGetTitle: 'Что вы получаете',
        get: {
          items: {
            realProduction: 'Работа с реальными продакшен‑системами, а не учебными проектами',
            businessLogic: 'Ответственность за ключевую бизнес‑логику',
            collaboration: 'Сотрудничество с опытными фронтенд и UX командами',
            cleanArchitecture: 'Акцент на чистую архитектуру и долгосрочное мышление',
            engineeringEnvironment: 'Профессиональная инженерная среда с ясными ожиданиями',
          },
        },
        locationTitle: 'Локация и формат',
        location: {
          items: {
            country: 'Азербайджан',
            format: 'Полный день / Гибрид (в зависимости от роли и опыта)',
          },
        },
        applyTitle: 'Готовы откликнуться?',
        applyCopy:
          'Если вам важно строить стабильные, масштабируемые бэкенд‑системы — и вы хотите, чтобы ваша работа держалась в реальном продакшене — мы хотим вас услышать.',
        applyCta: 'Откликнуться на вакансию',
      },
      uiux: {
        heroTitle: 'UX/UI дизайнер',
        buildTitle: 'Дизайн‑системы и интерфейсы для продакшен‑платформ',
        buildCopy:
          'Ищем UX/UI дизайнера, который понимает: хороший дизайн — это не декор, а структура, ясность и принятие решений. Работа над реальными продуктами: дашборды, маркетплейсы, внутренние системы, где важны удобство, консистентность и долгосрочная масштабируемость.',
        workOnTitle: 'Чем будете заниматься',
        workOn: {
          items: {
            flows: 'Проектирование сквозных пользовательских сценариев для сложных продуктов',
            wireframes: 'Создание wireframes, UI‑макетов и интерактивных прототипов',
            designSystems: 'Определение и поддержка дизайн‑систем и переиспользуемых компонентов',
            translateRequirements: 'Перевод бизнес/технических требований в понятные UX‑решения',
            collaborateDev: 'Тесная работа с фронтенд и бэкенд разработчиками',
            improveUsability: 'Улучшение удобства, доступности и консистентности продуктов',
            iterateFeedback: 'Итерации на основе фидбэка, реального использования и ограничений',
          },
        },
        expectTitle: 'Что мы ожидаем',
        coreSkillsTitle: 'Ключевые навыки',
        skills: {
          items: {
            uxPrinciples: 'Понимание UX‑принципов и user‑centered подхода',
            solidUi: 'Сильные UI‑навыки: композиция, отступы, иерархия',
            figmaExperience: 'Опыт работы с Figma (компоненты, варианты, auto‑layout)',
            dataHeavyInterfaces: 'Умение проектировать интерфейсы с данными (дашборды, админ‑панели)',
            clearThinking: 'Структурное мышление и решение задач',
            portfolioProcess: 'Портфолио, показывающее процесс, а не только визуал',
          },
        },
        niceToHaveTitle: 'Плюсом будет',
        nice: {
          items: {
            devCollab: 'Опыт работы с разработчиками над реальными продуктами',
            responsiveMobile: 'Понимание responsive и mobile‑first подхода',
            designSystemsPatterns: 'Знание дизайн‑систем и масштабируемых UI‑паттернов',
            adminInternal: 'Опыт работы над админ‑панелями или внутренними инструментами',
          },
        },
        howWeWorkTitle: 'Как мы работаем',
        how: {
          items: {
            architectureFirstProduct: 'Продуктовое мышление с архитектурой в приоритете',
            alignedFromStart: 'UX, UI и инженерия синхронизированы с начала',
            noRushedVisuals: 'Без поспешного визуала без понимания задачи',
            logicBackedDecisions: 'Дизайн‑решения на основе логики, а не трендов',
            longTermMaintainability: 'Долгосрочная поддерживаемость вместо краткосрочного блеска',
          },
        },
        whatYouGetTitle: 'Что вы получаете',
        get: {
          items: {
            realProductionNotConcept: 'Работа с реальными продакшен‑системами, а не концепт‑дизайнами',
            influenceStructureUx: 'Влияние на структуру продукта и пользовательский опыт',
            closeCollabEngineering: 'Тесная работа с инженерными командами',
            spaceToIterate: 'Пространство для мысли, итераций и качественных улучшений',
            professionalEnvironment: 'Профессиональная среда, ценящая ясность и качество',
          },
        },
        locationTitle: 'Локация и формат',
        location: {
          items: {
            country: 'Азербайджан',
            format: 'Полный день / Гибрид (в зависимости от роли и опыта)',
          },
        },
        applyTitle: 'Готовы откликнуться?',
        applyCopy:
          'Если вам важно строить стабильные, масштабируемые бэкенд‑системы — и вы хотите, чтобы ваша работа держалась в реальном продакшене — мы хотим вас услышать.',
        applyCta: 'Откликнуться на вакансию',
      },
      frontend: {
        heroTitle: 'Frontend‑разработчик (JS / TS)',
        buildTitle: 'Строить продакшен‑готовые интерфейсы для реальных бизнес‑систем',
        buildCopy:
          'Мы ищем фронтенд‑разработчика, которому важны структура, производительность и долгосрочная поддерживаемость — не только визуал. Вы будете работать над реальными продуктами: дашборды, маркетплейсы и внутренние платформы, используемые ежедневно в продакшене.',
        workOnTitle: 'Чем будете заниматься',
        workOn: {
          items: {
            architecture: 'Проектирование и построение масштабируемой фронтенд‑архитектуры',
            adminDashboards: 'Разработка админ‑панелей, дашбордов и интерфейсов с данными',
            translateDesigns: 'Перевод UI/UX‑макетов в чистый, поддерживаемый код',
            integrateApis: 'Совместная работа с бэкендом для интеграции API',
            performanceAccessibility: 'Повышение производительности, доступности и удобства на разных устройствах',
            maintainEvolve: 'Поддержка и развитие существующих систем без поломок',
          },
        },
        expectTitle: 'Что мы ожидаем',
        technicalSkillsTitle: 'Технические навыки',
        skills: {
          items: {
            jsTs: 'Опыт с JavaScript (ES6+) / TypeScript',
            react: 'Знание React (или подобных современных фреймворков)',
            componentArchitecture: 'Понимание компонентной архитектуры',
            restAsync: 'Опыт работы с REST API и асинхронными данными',
            responsive: 'Знание адаптивного/отзывчивого дизайна',
            cleanCode: 'Мышление чистого кода (читаемость, структура, переиспользование)',
          },
        },
        niceToHaveTitle: 'Плюсом будет',
        nice: {
          items: {
            adminSaaS: 'Опыт с админ‑дашбордами или SaaS‑продуктами',
            uiPerformance: 'Понимание UI‑производительности и оптимизации',
            designSystems: 'Опыт работы с дизайн‑системами',
            portfolio: 'GitHub‑портфолио или примеры реальных проектов',
          },
        },
        howWeWorkTitle: 'Как мы работаем',
        how: {
          items: {
            architectureFirst: 'Архитектура — в приоритете',
            clearRequirements: 'Чёткие требования и структурированная поставка',
            noHacks: 'Без спешки и грязных хакающих решений',
            longTermStability: 'Фокус на долгосрочной стабильности, а не быстрых победах',
            collaboration: 'С первого дня — синхрон дизайна, фронта и бэка',
          },
        },
        whatYouGetTitle: 'Что вы получаете',
        get: {
          items: {
            realProduction: 'Работа с реальными продакшен‑системами, а не демо',
            ownership: 'Понятная техническая ответственность и владение',
            collaboration: 'Сотрудничество с дизайнерами и бэкенд‑инженерами',
            longTermThinking: 'Долгосрочное продуктовое мышление вместо краткосрочных задач',
            engineeringCulture: 'Чистая, профессиональная инженерная культура',
          },
        },
        locationTitle: 'Локация и формат',
        location: {
          items: {
            country: 'Азербайджан',
            format: 'Полный день / Гибрид (в зависимости от роли и опыта)',
          },
        },
        applyTitle: 'Готовы откликнуться?',
        applyCopy:
          'Если этот формат похож на то, как вы хотите работать — а не просто что писать в коде — нам будет интересно вас услышать.',
        applyCta: 'Откликнуться на вакансию',
      },
      careers: {
        viewRoleCta: 'Открыть вакансию',
        whyTitle: 'Почему именно мы',
        whyCopy:
          'Мы нанимаем инженеров и дизайнеров, которым важны качество систем, ясность и долгосрочный эффект. Мы работаем с реальными продакшен‑системами, а не короткоживущими прототипами.',
        workWithUsAlt: 'Работа с нами',
        viewMore: 'Показать больше',
        showLess: 'Показать меньше',
        vacancies: {
          frontend: {
            title: 'Frontend‑разработчик (JS/TS)',
            description: 'Строить премиальные интерфейсы и дашборды',
            location: 'Полная занятость, Баку / Гибрид',
            reqs: {
              htmlCssJs: 'Сильные HTML/CSS/JS(TS) навыки',
              uiSense: 'Чувство UI',
              cleanCode: 'Точный и чистый код',
            },
          },
          backend: {
            title: 'Backend‑разработчик (API/DB)',
            description: 'Проектировать API, модели данных и безопасные доступы.',
            location: 'Полная занятость, Баку / Гибрид',
            reqs: {
              restSql: 'REST/SQL',
              authRbacSense: 'Понимание Auth/RBAC',
              performanceMindset: 'Ориентация на производительность',
            },
          },
          uiux: {
            title: 'UI/UX дизайнер',
            description: 'Строить премиальные интерфейсы и дашборды',
            location: 'Контракт / Полная занятость, Удалённо / Гибрид',
            reqs: {
              figma: 'Figma',
              designSystems: 'Дизайн‑системы',
              webMobileUx: 'Веб / Мобильный UX',
            },
          },
        },
        teamMembers: {
          ismat: {
            name: 'Исмат Джахангиров',
            role: 'Frontend‑разработчик',
            description:
              'Frontend‑разработчик в AlievsSpace MMC более года.',
          },
          elshan: {
            name: 'Элшан Гасанов',
            role: 'Frontend‑разработчик',
            description:
              'Frontend‑разработчик, более 1 года в AlievsSpace MMC.',
          },
          ismayil: {
            name: 'Исмаил Исмаилов',
            role: 'Frontend‑разработчик',
            description:
              'Занимается Frontend‑разработкой около 2 лет; ранее — ментор/инструктор в Developia Engineering.',
          },
          ravena: {
            name: 'Равена Балагёзова',
            role: 'Frontend‑разработчик',
            description:
              'Около года непрерывно развивает навыки в Frontend‑разработке.',
          },
          zehra: {
            name: 'Зехра Махмудова',
            role: 'Frontend‑разработчик',
            description:
              'Активно изучает Frontend около года и совершенствует практические навыки.',
          },
          elmar: {
            name: 'Эльмар Азимли',
            role: 'Frontend‑разработчик',
            description:
              'Более года изучает и развивается в Frontend‑направлении.',
          },
          parvin: {
            name: 'Парвин Ахмедов',
            role: 'Frontend‑разработчик',
            description:
              'Получаю опыт в разработке ПО более года и постоянно развиваю свои навыки.',
          },
        },
        team: {
          members: {
            john: {
              role: 'Лидер продаж и маркетинга',
              description:
                'Лидирует в построении и отчётности цифровых систем с фокусом на организацию бизнеса, операционные продажи и развитие логистики.',
            },
            jane: {
              role: 'Руководитель аналитики данных',
              description:
                'Разработала устойчивые аналитические фреймворки, эффективные и пригодные для кастомизации; архитектура цепочек продаж.',
            },
            mike: {
              role: 'Бизнес‑развитие',
              description:
                'Фокус на ясных требованиях, долгосрочной стабильности и управлении рабочим временем.',
            },
            sarah: {
              role: 'Операционный менеджер',
              description:
                'Управление высококачественными базами продаж и отражёнными показателями на уровне капитала группы.',
            },
            robert: {
              role: 'Специалист по логистике',
              description:
                'Эксперт по логистическому развитию бизнеса и оптимизации систем.',
            },
            emily: {
              role: 'Операции продаж',
              description:
                'Специализация на операциях продаж и отчётности цифровых систем.',
            },
            david: {
              role: 'Маркетинговый аналитик',
              description:
                'Анализирует данные продаж и формирует практические инсайты для роста бизнеса.',
            },
            lisa: {
              role: 'Работа с клиентами',
              description:
                'Строит крепкие отношения с клиентами и обеспечивает их удовлетворённость.',
            },
          },
        },
      },
            caseStudiesIntro:
              'Мы показываем реальные проекты, где структурная архитектура, продуманный UX и дисциплинированная инженерия привели к стабильным продакшен‑системам. Кейсы фокусируются на практических вызовах, продуктовых решениях и результатах поставки для масштабируемого роста и операционной ясности.',
            caseStudies: {
              viewCta: 'Открыть кейс',
              keyFocusLabel: 'Ключевой фокус',
              requestTitle: 'Запрос на обзор проекта',
              requestCopy:
                'Расскажите о проекте. Мы получаем каждый запрос и отвечаем с понятными следующими шагами — или предварительным обзором (generic sub‑pack).',
              tip:
                'Совет: Укажите отрасль, ключевые требования и целевой рынок. Достаточно даже приблизительной идеи.',
              privacy:
                'Мы не делимся вашими данными. Сообщение идёт напрямую в команду инженеров.',
              chooseField: 'Sahəni seçin',
              items: {
                marketplace: {
                  category: 'E‑commerce · Маркетплейс',
                  title: 'MVP маркетплейса на нескольких продавцов',
                  description:
                    'Мы спроектировали и построили продакшен‑готовый MVP мультивендор‑маркетплейса, уделив особое внимание масштабируемой архитектуре и операционной ясности. Система включает централизованную админ‑панель, панели продавцов, структурное управление товарами/категориями и встроенную отчётность для раннего роста и долгосрочного масштабирования.',
                  focus: [
                    'Архитектура маркетплейса',
                    'Админ‑панель и управление продавцами',
                    'Отчётность и аналитика',
                  ],
                },
                fintech: {
                  category: 'Банкинг · Финтех',
                  title: 'Финтех‑дашборд отчётности',
                  description:
                    'Мы разработали безопасную, ролевую панель отчётности для финансовых операций с фокусом на готовность к аудиту, целостность данных и контролируемые доступы. Система предоставляет структурные финансовые отчёты, разрешённые представления и надёжную видимость данных для соответствия и принятия решений.',
                  focus: [
                    'Ролевой доступ (RBAC)',
                    'Отчётность, дружелюбная к аудиту',
                    'Безопасные потоки данных',
                  ],
                },
                operations: {
                  category: 'Производство · Операции',
                  title: 'Система операций и складского учёта',
                  description:
                    'Проект направлен на внутреннюю систему операций и учёта запасов для повышения операционной ясности и точности данных. Платформа поддерживает учёт запасов, мониторинг доходов/расходов и управленческие дашборды для упрощения ежедневных операций.',
                  focus: [
                    'Управление запасами',
                    'Финансовый учёт',
                    'Операционные дашборды',
                  ],
                },
              },
            },
      teamTitle: 'Наша команда',
      contactIntro: 'Расскажите, что хотите создать. Ответим структурным предложением.',
      contactFormTitle: 'Отправить запрос',
      contactName: 'Ваше имя *',
      contactCompany: 'Компания',
      contactEmail: 'Email',
      contactPhone: 'Телефон',
      contactInterest: 'Интерес',
      contactTopic: 'Тема',
      contactMessage: 'Сообщение',
      contactCompanyPlaceholder: 'Название компании',
      contactTopicPlaceholder: 'Что хотите построить?',
      contactMessagePlaceholder: 'Опишите проект, сроки и цели...',
      contactInterestSoftware: 'Разработка ПО',
      contactInterestCommerce: 'E-commerce / Маркетплейс',
      contactInterestBanking: 'Банковский / финтех дашборд',
      contactInterestDesign: 'UI/UX и дизайн-система',
      contactInterestSupport: 'Поддержка и масштабирование',
      contactHelper: 'Совет: укажите отрасль, нужные модули и целевые рынки.',
      contactSubmit: 'Отправить',
      companyDetails: 'Данные компании',
      companyDetailsCopy:
        'Мы соединяем премиальный UX/UI с надежной инженерией и админ-инструментами для commerce и банковских систем.',
      noteBadge: 'Заметка',
      noteCopy: 'В демо запросы сохраняются локально и видны в Admin → Leads.',
      industriesIntro:
        'Мы делаем системы, где критичны надежность, отчетность и премиальный UX.',
      about: {
        headerTitle: 'Мы создаём и проектируем системы на долгий срок.',
        headerCopy:
          'Фокус на долгосрочной надёжности, чёткой архитектуре и стабильности систем при росте команд и данных.',
        whoTitle: 'Кто мы',
        whoCopy:
          'Alievs Space MMC — инженерная компания с фокусом на digital и commerce, создающая продакшен‑готовые системы с премиальным UI и операционным контролем. Мы соединяем backend‑архитектуру, UX‑системы и бизнес‑логику, чтобы строить платформы, которые масштабируются, безопасны и удобны в эксплуатации через структурированные админ‑инструменты. Наши проекты охватывают мультивендор‑маркетплейсы, внутренние управленческие платформы и банковские дашборды с ролями, отчётностью и аудит‑готовыми процессами.',
        who: {
          values: {
            responsibility: 'Ответственность',
            transparency: 'Прозрачность',
            premiumQuality: 'Премиальное качество',
            securityReliability: 'Безопасность и надёжность',
            longTermPartnership: 'Долгосрочное партнёрство',
          },
        },
        deliverTitle: 'Как мы поставляем',
        deliverIntro:
          'Структурированный подход к поставке, снижающий риски, обеспечивающий качество и поддерживающий устойчивый рост продукта.',
        deliver: {
          items: {
            analysis: {
              alt: 'Аналитика и стратегия',
              title: 'Аналитика и стратегия',
              text:
                'Анализируем бизнес‑цели, технические ограничения и требования пользователей, определяем scope, приоритеты и понятную дорожную карту поставки.',
            },
            uxui: {
              alt: 'UX/UI и архитектура',
              title: 'UX/UI и архитектура',
              text:
                'Проектируем UX и архитектуру вместе, чтобы с самого начала обеспечить удобство, масштабируемость и поддержку в долгосрочной перспективе.',
            },
            development: {
              alt: 'Разработка',
              title: 'Разработка',
              text:
                'Реализуем ключевые функции модульным, продакшен‑готовым кодом в соответствии с архитектурными и безопасностными стандартами.',
            },
            quality: {
              alt: 'Контроль качества',
              title: 'Контроль качества',
              text:
                'Проверяем функциональность, производительность и крайние случаи структурированным тестированием, чтобы обеспечить надёжность перед релизом.',
            },
            launch: {
              alt: 'Запуск',
              title: 'Запуск',
              text:
                'Постепенно внедряем, мониторим поведение системы и обеспечиваем плавный переход к реальному использованию.',
            },
            support: {
              alt: 'Поддержка и масштабирование',
              title: 'Поддержка',
              text:
                'Обеспечиваем непрерывную поддержку, улучшения и стратегии масштабирования по мере роста использования и бизнес‑потребностей.',
            },
          },
        },
        approachTitle: 'Подход',
        approachCopy:
          'Строим осознанно: от архитектуры и операционных потребностей к системам, которые масштабируются ответственно и надёжно работают в продакшене.',
        approachWhoTitle: 'С кем мы работаем',
        approachWhoCopy:
          'Мы работаем с командами, которым нужны надёжные системы, понятная отчётность и долгосрочная стабильность — вместо временных решений. Структурная инженерия, премиальный UI/UX и дисциплинированная поставка обеспечивают надёжность не только при разработке, но и после запуска.',
        approachResponsibilityTitle: 'Ответственность за пределами кода',
        approachResponsibilityCopy:
          'Берём ответственность и после релиза: поддерживаем системы, обеспечиваем прозрачную коммуникацию и строим платформы с прицелом на долгую жизнь.',
      },
      industries: {
        items: {
          retail: {
            category: 'Ритейл и E‑commerce',
            title: 'Создано для конверсии и роста',
            description:
              'Витрины с упором на конверсию, UX оплаты, аналитика и операционная прозрачность — без трения при масштабировании.',
          },
          marketplaces: {
            category: 'Маркетплейсы',
            title: 'Под сложность мульти‑вендор моделей',
            description:
              'Архитектура для множества продавцов: панели магазинов, комиссии, выплаты и модерация — для контроля и масштабируемости.',
          },
          banking: {
            category: 'Банкинг / Финансы',
            title: 'Безопасность, доступы и соответствие — в приоритете',
            description:
              'Ролевой доступ, отчёты готовые к аудиту и контролируемые процессы — под регулируемую среду.',
          },
          manufacturing: {
            category: 'Производство и склад',
            title: 'Операционная ясность на каждом уровне',
            description:
              'Учёт остатков, контроль затрат, видимость доходов/расходов и дашборды для реальных управленческих решений.',
          },
          beauty: {
            category: 'Бьюти / Салоны',
            title: 'Системы, упрощающие ежедневную работу',
            description:
              'Записи, учёт, напоминания, инструменты для персонала и управление клиентами — меньше ручной рутины и накладных.',
          },
          logistics: {
            category: 'Логистика и доставка',
            title: 'Видимость на каждом этапе доставки',
            description:
              'Заказы, статусы, координация магазинов/админов и отчётные слои, поддерживающие согласованность операций.',
          },
          startup: {
            category: 'Стартапы / MVP',
            title: 'От идеи до продакшен‑MVP',
            description:
              'Лёгкая поставка MVP с премиальным UI и масштабируемой архитектурой — быстрая валидация и безопасный рост.',
          },
        },
        trustedTitle: 'Нам доверяют продакшен‑системы',
        trustedCopy1:
          'Мы работаем с командами, где важны надёжность, отчётность и долгосрочная стабильность — вместо временных решений. Структурная инженерия, премиальный UI/UX и дисциплинированная поставка гарантируют надёжность систем после запуска, а не только во время разработки.',
        trustedCopy2:
          'Каждый проект ведём с чётким scope, прозрачной коммуникацией и архитектурным мышлением. Строим платформы, которые команды могут эксплуатировать, расширять и которым доверяют при росте бизнеса.',
      },
      projectDetails: 'Детали',
      industry: 'Отрасль',
      tags: 'Теги',
      nextStep: 'Следующий шаг',
      projectNextCopy:
        'Хотите похожую систему? Рассчитаем и предложим архитектуру с премиальным UI.',
      openLink: 'Открыть ссылку',
      postLabel: 'Статья',
      postHelpTitle: 'Нужна помощь?',
      postHelpCopy:
        'Если строите маркетплейс, e-commerce или банковский дашборд — подготовим архитектуру с премиальным UX.',
    },
    },

    az: {
    ui: {
      language: 'Dil',
      menu: 'Menyu',
      close: 'Bağla',
      openSite: 'Saytı aç',
      logout: 'Çıxış',
      logo: 'Loqo',
      translate: 'Tərcümə et',
    },
    nav: {
      home: 'Baş səhifə',
      about: 'Haqqımızda',
      company: 'Şirkət',
      services: 'Xidmətlər',
      industries: 'Sahələr',
      caseStudies: 'Layihələr',
      projects: 'Layihələr',
      careers: 'Karyera',
      academy: 'Akademiya',
      blog: 'Bloq',
      contact: 'Əlaqə',
      contactSales: 'Satışla əlaqə',
      cta: 'Təklif istəyin',
      admin: 'Admin',
      login: 'Daxil ol',
    },
    company: {
      name: 'ALIEVS SPACE MMC',
      tagline: 'Premium Rəqəmsal və Ticarət Ekosistemi',
    },
    admin: {
      panel: 'İdarəetmə Paneli',
      dashboard: 'İdarəetmə Paneli',
      services: 'Xidmətlər',
      projects: 'Layihələr',
      blog: 'Blog',
      careers: 'Vakansiyalar',
      inquiries: 'Müraciətlər',
      users: 'İstifadəçilər',
      settings: 'Parametrlər',
      goToSite: 'Sayta Keçid',
      welcome: 'Xoş gəlmisiniz',
      manageContent: 'Sayt məzmununu, xidmətləri, layihələri, blog yazılarını, vakansiyaları və müraciətləri idarə edin.',
      quickActions: 'Tez Hərəkətlər',
      editServices: 'Xidmətləri Redaktə Et',
      editProjects: 'Layihələri Redaktə Et',
      editBlog: 'Bloqu Redaktə Et',
      viewInquiries: 'Müraciətlərə Bax',
      manageUsers: 'İstifadəçiləri İdarə Et',
      editHome: 'Ana Səhifəni Redaktə Et',
      editAbout: 'Haqqımızda Redaktə Et',
      overview: 'Ümumi Baxış',
      generalStats: 'Ümumi statistikalar və idarəetmə',
      contentManagement: 'Məzmunun idarə edilməsi',
      generalManagement: 'Ümumi İdarəetmə',
      management: 'İdarəetmə',
      allSystemsActive: 'Bütün sistemlər aktiv',
      loading: 'Yüklənir...',
      tip: 'Məsləhət: Yedəkləməni saxlamaq üçün Parametrlər → JSON İxrac istifadə edin.',
      new: 'Yeni',
      edit: 'Redaktə et',
      create: 'Yarat',
      delete: 'Sil',
      save: 'Saxla',
      cancel: 'Ləğv et',
      saving: 'Saxlanılır...',
      actions: 'Əməliyyatlar',
      title: 'Başlıq',
      location: 'Yer',
      type: 'Tip',
      category: 'Kateqoriya',
      industry: 'Sənaye',
      summary: 'Xülasə',
      description: 'Təsvir',
      tags: 'Teqlər',
      link: 'Link',
      externalLink: 'Xarici link',
      noItemsYet: 'Hələ element yoxdur. Yaratmaq üçün "{button}" düyməsinə basın.',
      confirmDelete: 'Bu elementi silmək istədiyinizə əminsiniz?',
      failedToLoad: 'Yükləmək mümkün olmadı',
      failedToSave: 'Saxlamaq mümkün olmadı',
      failedToDelete: 'Silmək mümkün olmadı',
      manageDescription: 'İctimai saytda göstərilən elementləri idarə edin.',
      newService: 'Yeni xidmət',
      newProject: 'Yeni layihə',
      newPost: 'Yeni yazı',
      newVacancy: 'Yeni vakansiya',
      newMember: 'Yeni üzv',
      editService: 'Xidməti redaktə et',
      createService: 'Xidmət yarat',
      editProject: 'Layihəni redaktə et',
      createProject: 'Layihə yarat',
      editPost: 'Yazını redaktə et',
      createPost: 'Yazı yarat',
      editVacancy: 'Vakansiyanı redaktə et',
      createVacancy: 'Vakansiya yarat',
      editMember: 'Üzvü redaktə et',
      createMember: 'Üzv yarat',
      noServicesYet: 'Hələ xidmət yoxdur. Yaratmaq üçün "Yeni xidmət" düyməsinə basın.',
      noProjectsYet: 'Hələ layihə yoxdur. Yaratmaq üçün "Yeni layihə" düyməsinə basın.',
      noPostsYet: 'Hələ blog yazısı yoxdur. Yaratmaq üçün "Yeni yazı" düyməsinə basın.',
      noCareersYet: 'Hələ vakansiya yoxdur. Yaratmaq üçün "Yeni vakansiya" düyməsinə basın.',
      noEmployeesYet: 'Hələ üzv yoxdur. Yaratmaq üçün "Yeni üzv" düyməsinə basın.',
      bullets: 'Maddələr',
      bulletsPlaceholder: 'Hər sətirdə bir',
      tagsPlaceholder: 'Vergüllə ayrılmış',
      status: 'Status',
      open: 'Açıq',
      closed: 'Bağlı',
      name: 'Ad',
      position: 'Vəzifə',
      requirements: 'Tələblər',
      requirementsPlaceholder: 'Hər sətirdə bir tələb',
      team: 'Komanda',
      teamDescription: 'Foto, rol və təcrübə ilə komanda üzvləri əlavə edin.',
      role: 'Rol',
      experience: 'Təcrübə',
      experienceYears: 'Təcrübə (il)',
      photoUrl: 'Foto URL',
      bio: 'Bio',
      fullName: 'Tam ad',
      brand: 'Brend',
      brandName: 'Brend adı',
      tagline: 'Sloqan',
      email: 'E-poçt',
      phone: 'Telefon',
      address: 'Ünvan',
      instagramUrl: 'Instagram URL',
      linkedinUrl: 'LinkedIn URL',
      youtubeUrl: 'YouTube URL',
      ctaPrimaryText: 'Əsas CTA mətni',
      ctaPrimaryHref: 'Əsas CTA linki',
      export: 'İxrac',
      import: 'İdxal',
      exportDescription: 'Bütün məzmunu JSON kimi ixrac et',
      importDescription: 'JSON faylından məzmun idxal et',
    },
    auth: {
      login: {
        brandTagline: 'Premium Rəqəmsal və Ticarət Ekosistemləri',
        title: 'Hesabınıza daxil olun',
        noAccount: 'Hesabınız yoxdur?',
        signUp: 'Qeydiyyatdan keçin',
        fields: {
          email: 'E-poçt ünvanı',
          password: 'Şifrə',
        },
        placeholders: {
          email: 'you@example.com',
          password: '••••••••',
        },
        rememberMe: 'Məni xatırla',
        forgotPassword: 'Şifrəni unutmusunuz?',
        submit: 'Daxil ol',
        submitting: 'Daxil olunur...',
        backHome: 'Ana səhifəyə qayıt',
        error: 'Daxil olmaq mümkün olmadı',
        copyright: 'Bütün hüquqlar qorunur.',
      },
      register: {
        brandTitle: 'Alievs Space',
        brandTagline: 'Premium Rəqəmsal və Ticarət Ekosistemləri',
        title: 'Hesab yaradın',
        haveAccount: 'Artıq hesabınız var?',
        signIn: 'Daxil olun',
        fields: {
          name: 'Tam ad *',
          email: 'E-poçt ünvanı *',
          password: 'Şifrə *',
          phone: 'Telefon nömrəsi',
          company: 'Şirkət adı',
        },
        placeholders: {
          name: 'Ad Soyad',
          email: 'you@example.com',
          password: '••••••••',
          phone: '+994 (50) 123-45-67',
          company: 'Şirkətiniz',
        },
        submit: 'Hesab yaradın',
        copyright: 'Bütün hüquqlar qorunur.',
        submitting: 'Hesab yaradılır...',
        backHome: 'Ana səhifəyə qayıt',
        error: 'Qeydiyyat alınmadı',
      },
    },
    public: {
      footerDesc:
        'Premium veb və mobil inkişaf, e-ticarət/marketpleys sistemləri və bank paneli həlləri.',
      industriesCta: 'Bu sahəni müzakirə edək',
      requirements: 'Tələblər:',
      apply: 'Müraciət et',
      notFoundProject: 'Layihə tapılmadı',
      notFoundPost: 'Məqalə tapılmadı',
      contactThanks: 'Təşəkkürlər — sorğunuzu aldıq, tezliklə cavab verəcəyik.',
      contactValidation: 'Zəhmət olmasa ad və əlaqə məlumatı (email və ya telefon) daxil edin.',
      contactStatusNew: 'Yeni',
      heroTagline: 'Premium • Platinum • Blue',
      buildWhat: 'Biz nələri qururuq',
      buildDesc:
        'Premium dizayn və uzunömürlü proqramlar, e-ticarət və bank yönümlü panellər üzrə strukturlaşdırılmış ekosistemlər qururuq.',
      premiumProcess: 'Premium proses',
      focusIndustries: 'Prioritet sahələr',
      processDesc:
        'Arxitektura, premium UI, keyfiyyətə nəzarət, buraxılış və dəstək.',
      focusDesc:
        'E-ticarət və marketpleyslər, fintex panelləri və hesabatlı əməliyyat sistemləri.',
      adminIncluded: 'Admin panel daxildir',
      adminDesc:
        'Xidmətlərə, layihələrə, bloqa, vakansiyalara və sorğulara nəzarət edin. Dəyişikliklər dərhal saytda görünür.',
      loading: 'Yüklənir…',
      marketplaceMvp: {
        back: '← Case Studies bölməsinə qayıt',
        badge: 'E‑ticarət · Marketpleys',
        title: 'Çox‑satıcılı Marketpleys MVP',
        intro:
          'Erkən böyüməni və gələcək genişlənməni dəstəkləmək üçün miqyaslana bilən arxitektura, strukturlaşdırılmış admin idarəsi və satıcı səviyyəli panel ilə hazırlanmış istehsalata hazır çox-satıcı bazar MVP.',
        contextTitle: 'Layihə konteksti',
        contextItems: {
          industry: 'Sahə: E‑ticarət/Marketpleys',
          projectType: 'Layihə tipi: MVP',
          scope: 'Həcm: Tam sistem dizaynı və inkişafı',
          focus: 'Fokus: Admin alətləri, satıcı idarəetməsi, analitika',
        },
        challengeTitle: 'Çağırış',
        challengeCopy:
          'Müştəriyə bir neçə satıcını dəstəkləyən, aydın admin nəzarəti, strukturlaşdırılmış məhsul idarəetməsi və etibarlı hesabatlılıq təmin edən marketpleys MVP lazım idi — ilkin buraxılışı həddən artıq mürəkkəbləşdirmədən.',
        solutionTitle: 'Həllimiz',
        solutionCopy:
          'Mərkəzləşdirilmiş admin panel, ayrı satıcı dörd panelləri və məhsullar, kateqoriyalar və hesabat axınları üçün strukturlaşdırılmış iş axınları ilə modulyar marketpleys sistemi dizayn edib tətbiq etdik. Memarlıq satıcıların və məlumat həcminin artımı ilə miqyaslana bilmək üçün quruldu.',
        deliveredTitle: 'Nələri çatdırdıq',
        deliveredItems: {
          admin: 'Rola əsaslı girişlə mərkəzi admin panel',
          vendors: 'Satıcı onbordinqi və mağaza panelləri',
          products: 'Məhsul və kateqoriya idarəetməsi',
          analytics: 'Analitika və hesabat alətləri',
          backend: 'Miqyaslana bilən backend memarlıq',
        },
        deliveryTitle: 'Çatdırılma yanaşması',
        deliveryCopy:
          'Memarlıq‑öncəli yanaşmaya əməl etdik, UI sistemini erkən müəyyənləşdirdik və platformanı davamlı doğrulama və dəstəklə idarə olunan mərhələlərlə çatdırdıq.',
        ctaTitle: 'Oxşar sistemi qurmaq istəyirsiniz?',
        ctaButton: 'Dialoqa başlayın',
      },
      fintechDashboard: {
        back: '← Case Studies bölməsinə qayıt',
        badge: 'Bankçılıq · Fintex',
        title: 'Fintex Hesabat Paneli',
        intro:
          'Maliyyə əməliyyatları üçün təhlükəsiz, rola əsaslı hesabat paneli: auditə hazır hesabatlar, idarə olunan giriş qatları və uyğunluq və daxili qərarlar üçün aydın məlumat görünürlüğü.',
        contextTitle: 'Layihə konteksti',
        contextItems: {
          industry: 'Sahə: Bankçılıq/ Fintex',
          projectType: 'Layihə tipi: daxili sistem',
          scope: 'Həcm: Panel dizaynı və backend icrası',
          focus: 'Fokus: RBAC, hesabatlılıq, auditə hazır',
        },
        challengeTitle: 'Çağırış',
        challengeCopy:
          'Müştəriyə, daxili nəzarət və audit tələblərinə cavab verən, dəqiq və strukturlaşdırılmış məlumat girişi təmin edən maliyyə hesabat sistemi lazım idi. Müxtəlif rol sahibləri üçün aydın icazələr, etibarlı hesabat nəticələri və məlumat bütövlüyünə inam tələb olunurdu — əməliyyat mürəkkəbliyini artırmadan.',
        solutionTitle: 'Həllimiz',
        solutionCopy:
          'Rola əsaslı giriş modelləri və strukturlaşdırılmış hesabat generasiyası ilə nəzarət olunan giriş qatlarına malik hesabat paneli dizayn edib tətbiq etdik. Sistem icazə‑əsaslı baxışlar, auditə uyğun məlumat çıxışları və aydın maliyyə görünürlüğü təmin edir — həm əməliyyat, həm də uyğunluq yoxlamaları üçün.',
        deliveredTitle: 'Nələri çatdırdıq',
        deliveredItems: {
          rbac: 'Rola əsaslı giriş nəzarəti (RBAC)',
          reports: 'Audit üçün uyğun maliyyə hesabatları',
          security: 'Təhlükəsiz məlumat giriş qatları',
          dashboards: 'Strukturlaşdırılmış hesabat panelləri',
          backend: 'Miqyaslana bilən backend əsasları',
        },
        deliveryTitle: 'Çatdırılma yanaşması',
        deliveryCopy:
          'Təhlükəsizlik‑öncəli və memarlıq‑əsaslı yanaşma ilə işlədik: giriş modellərini erkən müəyyən etdik və hesabat məntiqini inkişaf müddətində doğruladıq ki, etibarlılıq və uyğunluq hazır olsun.',
        ctaTitle: 'Oxşar sistemi qurmaq istəyirsiniz?',
        ctaButton: 'Dialoqa başlayın',
      },
      inventory: {
        back: '← Case Studies bölməsinə qayıt',
        badge: 'İstehsal · Əməliyyatlar',
        title: 'Əməliyyat və İnventar Sistemləri',
        intro:
          'Ehtiyatların görünürlüğünü, maliyyə uçotunu və gündəlik əməliyyat aydınlığını artırmaq üçün strukturlaşdırılmış panellər və hesabatlar vasitəsilə qurulmuş daxili əməliyyat və inventar idarəetmə sistemi.',
        contextTitle: 'Layihə konteksti',
        contextItems: {
          industry: 'Sahə: İstehsal / Əməliyyatlar',
          projectType: 'Layihə tipi: Daxili idarəetmə sistemi',
          scope: 'Həcm: Sistem dizaynı və tətbiqi',
          focus: 'Fokus: Inventar, maliyyə izləmə, panellər',
        },
        challengeTitle: 'Çağırış',
        challengeCopy:
          'Komandalar üzrə inventar səviyyələrini, gəlir‑xərc axınlarını və əməliyyat məlumatlarını izləyən mərkəzləşdirilmiş sistemə ehtiyac var idi. Mövcud proseslər real‑vaxt görünürlüğü vermirdi və ehtiyat dəqiqliyini, maliyyə nəzarətini effektiv idarə etməyi çətinləşdirirdi.',
        solutionTitle: 'Həllimiz',
        solutionCopy:
          'Inventar məlumatlarını, maliyyə izləməsini və idarəetmə panellərini mərkəzləşdirən daxili əməliyyat platforması qurduq. Sistem aydın əməliyyat görünüşləri, strukturlaşdırılmış iş axınları və etibarlı məlumat girişi təmin edir — gündəlik qərarvermə və uzunmüddətli planlama üçün.',
        deliveredTitle: 'Nələri çatdırdıq',
        deliveredItems: {
          inventory: 'Inventar və ehtiyat izləmə',
          finance: 'Gəlir və xərclərin monitorinqi',
          dashboards: 'Əməliyyat panelləri',
          reporting: 'İdarəetmə hesabat alətləri',
          backend: 'Miqyaslana bilən daxili sistem memarlığı',
        },
        deliveryTitle: 'Çatdırılma yanaşması',
        deliveryCopy:
          'Aydınlıq və etibarlılığı prioritet tutaraq sistem iş axınlarını erkən müəyyən etdik və platformanı strukturlaşdırılmış mərhələlərlə çatdırdıq ki, məlumatların düzgün işlənməsi və komandalar üçün rahat istifadə təmin olunsun.',
        ctaTitle: 'Oxşar sistemi qurmaq istəyirsiniz?',
        ctaButton: 'Dialoqa başlayın',
      },
      home: {
        heroTitle: 'Miqyaslana bilən premium rəqəmsal məhsullar qururuq',
        heroCopy:
          'Hər zaman təhlükəsizliyi öndə tutaraq veb və mobil development, e-ticarət sistemləri və bank standartlarına uyğun panellər  təqdim edirik.',
        ctas: {
          contact: 'Satışla əlaqə',
          services: 'Xidmətləri araşdır',
          caseStudies: 'Layihələrə bax',
        },
        advantages: {
          headings: {
            years: '4.5+',
            enterprise: 'Müəssisə',
            premium: 'Premium',
            secure: 'Təhlükəsiz',
            fast: 'Sürətli',
          },
          yearsText: 'İllərə dayanan iş təcrübəsi',
          enterpriseText: 'Real biznes əməliyyatlarına hazır',
          premiumText: 'Yüksək keyfiyyətli UI/UX dizaynları',
          secureText: 'Giriş nəzarəti və daxili təhlükəsizlik',
          fastText: 'Səmərəli çatdırılma',
        },
        build: {
          items: {
            ecommerce: {
              title: 'E‑ticarət və Marketpleyslər',
              text: 'Çox‑satıcı platformalar, ödəniş axınları, komissiyalar, analitika.',
              alt: 'eCommerce',
            },
            software: {
              title: 'Proqram və Məhsul İnkişafı',
              text: 'Veb tətbiqlər, mobil tətbiqlər, admin panellər, daxili sistemlər.',
              alt: 'software',
            },
            banking: {
              title: 'Bankçılıq / Fintex Sistemləri',
              text: 'Rola əsaslı giriş, auditə hazır hesabatlar, təhlükəsiz məlumat axınları.',
              alt: 'banking',
            },
          },
        },
        process: {
          phases: {
            discovery: { title: 'Araşdırma', desc: 'tələblər və məhdudiyyətlər' },
            uxui: { title: 'UX/UI', desc: 'axınlar və interfeyslər' },
            development: { title: 'İnkişaf', desc: 'mühəndislik və inteqrasiyalar' },
            qa: { title: 'QA', desc: 'test və doğrulama' },
            launch: { title: 'Buraxılış', desc: 'deploy və yayımlama' },
            support: { title: 'Dəstək', desc: 'texniki xidmət və təkmilləşdirmələr' },
          },
        },
        projects: {
          title: 'Layihələrimiz',
          copy: 'Müxtəlif biznes ehtiyacları və məhsul tipləri üçün həyata keçirilmiş layihələrimiz',
          items: {
            luxmart: { name: 'LuxMart', description: 'Çoxkateqoriyalı pərakəndə satış üçün qlobal e‑ticarət platforması.' },
            lms: { name: 'Alievs Space LMS', description: 'Kurslar, izləmə və daxili təlim üçün öz öyrənmə idarəetmə sistemimiz.' },
            azenn: { name: 'Azenn', description: 'Azenn şirkəti üçün onlayn satış e‑ticarət platforması.' },
            academy: { name: 'Alievs Space Academy', description: 'Təhsil proqramları, müraciətlər və tələbə səyahəti üçün Akademiya saytımız.' },
            ederaEvents: { name: 'EderaEvents', description: 'EderaEvents — rəqs akademiyası platformasıdır' },
          },
        },
      },
      aboutWho: 'Biz kimik',
      aboutValues: 'Dəyərlər',
      aboutHow: 'Necə çatdırırıq',
      aboutDelivery: 'Miqyası saxlayan sabit və idarə olunan çatdırılma prosesi.',
      stepLabel: 'Addım',
      serviceFallback: 'Xidmət',
      servicesIntro:
        'Premium mühəndislik və dizayn: proqram yaradıcıllığı, e-ticarət və bank panelləri.',
      services: {
        items: {
          web: {
            category: 'Proqram',
            title: 'Veb və mobil inkişaf',
            description:
              'Korporativ saytlar, veb tətbiqlər, mobil tətbiqlər, admin panellər və daxili platformalar.',
            reqs: {
              premiumUi: 'Premium UI sistemləri',
              performancePages: 'Yüksək performanslı səhifələr',
              analyticsReady: 'Analitikaya hazır struktur',
              cleanDocs: 'Təmiz sənədləşmə',
            },
          },
          ecommerce: {
            category: 'Kommersiya',
            title: 'E‑ticarət və marketpleys sistemləri',
            description:
              'Tam funksional onlayn mağazalar və çox satıcılı bazarlar.',
            reqs: {
              catalogFiltersSearch: 'Kataloq + filtrlər + axtarış',
              cartCheckout: 'Səbət və ödəmə formaları',
              commissionPayout: 'Komissiya və ödəniş hesabatları',
              ownerDashboards: 'Mağaza sahibi panelləri',
            },
          },
          banking: {
            category: 'Bank',
            title: 'Bank yönümlü panellər',
            description:
              'Rollar, hesabatlar və nəzarətli məlumat girişinə malik təhlükəsiz sistemlər.',
            reqs: {
              rbac: 'Rolla idarə olunan giriş (RBAC)',
              auditReporting: 'Audit‑jurnalları və hesabat görünüşləri',
              secureWorkflow: 'Təhlükəsiz iş formaları',
              complianceFriendly: 'Uyğunluğa dost',
            },
          },
        },
      },
      deliveryTitle: 'Çatdırılma modeli',
      deliveryCopy:
        'Əvvəlcə arxitektura və UI sistemi qururuq, sonra modullar əlavə edir, analitikanı qoşur və mərhələli şəkildə dəstəklə təqdim edirik.',
      delivery: {
        steps: {
          1: { title: 'Arxitektura və UI sistemi', desc: 'Sistem arxitekturasını təyin edin və miqyasa uyğun UI dizayn sistemi qurulur.' },
          2: { title: 'Modul inkişafı', desc: 'Təsdiqlənmiş tələblərə əsasən əsas funksiyalar və modullar hazırlanır.' },
          3: { title: 'İnteqrasiya və analitika', desc: 'Servislər, analitika və dayaq infrastrukturu inteqrasiya edilir.' },
          4: { title: 'Kontrollu təqdimat', desc: 'Hər mərhələdə yoxlama ilə strukturlaşdırılmış buraxılış.' },
          5: { title: 'Davamlı dəstək', desc: 'Launchdan sonra sistemin saxlanması, monitorinqi və təkmilləşdirilməsi.' },
        },
        result: 'Nəticə: proqnozlaşdırılan çatdırılma, miqyasa uyğun sistemlər və uzunmüddətli sabitlik.',
      },
      projectsIntro: 'Marketpleyslər, bank panelləri və əməliyyat sistemləri üzrə nümunələr.',
      blogIntro: 'Marketpleyslər, premium UX, admin sistemləri və bank panelləri barədə fikirlər.',
      careersIntro:
        'Premium sistemlər qururuq. Dizayn və etibarlılığı önəmli sayan komandaya qoşulun.',
      backend: {
        heroTitle: 'Backend Developer (API/DB)',
        buildTitle: 'İstehsal platformalarının arxasında etibarlı və miqyasa uyğun sistemlər',
        buildCopy:
          'Sistem etibarlılığına, təmiz memarlığa və uzunmüddətli dəstəklənməyə fokuslanan Backend Developer axtarırıq. Dashboardlar, marketpleyslər və daxili platformaların əsas məntiqi üzərində işləyəcəksiniz. Burada data bütövlüyü, performans və təhlükəsizlik kritikdir.',
        workOnTitle: 'Nə üzərində işləyəcəksiniz',
        workOn: {
          items: {
            architecture: 'İstehsal sistemləri üçün backend arxitekturalarını dizayn və implementasiya etmək',
            apis: 'Veb və mobil tətbiqlər tərəfindən istifadə olunan API‑ləri qurmaq və dəstəkləmək',
            databasesLogic: 'Məlumat bazaları, data modelləri və biznes məntiqi ilə işləmək',
            authRbac: 'Autentifikasiya, autorizasiya və giriş nəzarətlərini inteqrasiya etmək',
            performanceReliability: 'Sistem performansı, etibarlılığı və miqyaslanmanı təmin etmək',
            collaborateFrontend: 'Frontend developerlər və dizaynerlərlə sıx əməkdaşlıq etmək',
            improveWithoutBreaking: 'Mövcud sistemləri istehsalı pozmadan yaxşılaşdırmaq',
          },
        },
        expectTitle: 'Nə gözləyirik',
        technicalSkillsTitle: 'Texniki bacarıqlar',
        skills: {
          items: {
            language: 'Ən az bir backend dili ilə təcrübə (məs: Node.js, Python, Java və s.)',
            apiDesign: 'API dizaynını anlama (REST, strukturlaşdırılmış data axınları)',
            relationalModeling: 'Relyasion bazalar və data modelləşdirmə təcrübəsi',
            securityAuth: 'Autentifikasiya, autorizasiya və təhlükəsizlik prinsipləri biliyi',
            cleanMaintainable: 'Təmiz, dəstəklənə bilən və yaxşı strukturlu kod yazmaq bacarığı',
            productionBehavior: 'İstehsal mühitində sistem davranışını anlamaq',
          },
        },
        niceToHaveTitle: 'Üstünlük sayılır',
        nice: {
          items: {
            scalableTraffic: 'Miqyasa uyğun və ya yüksək trafikli sistemlərlə təcrübə',
            jobsQueuesCaching: 'Fon işləri, növbələr və ya caching ilə tanışlıq',
            loggingMonitoring: 'Loglama, monitorinq və səhv idarəetməsini anlamaq',
            adminInternal: 'Admin panelləri və ya daxili alətlər üzərində təcrübə',
          },
        },
        howWeWorkTitle: 'Necə işləyirik',
        how: {
          items: {
            architectureFirst: 'Backend üçün arxitektura‑öncül dizayn',
            clearOwnership: 'Aydın sahiblənmə və məsuliyyət',
            noRushedFeatures: 'Təsirini anlamadan tələsik xüsusiyyətlər yoxdur',
            stabilityIntegrity: 'Sabitlik, data bütövlüyü və dəstəklənməyə fokus',
            closeCollaboration: 'Backend, frontend və dizayn arasında sıx əməkdaşlıq',
          },
        },
        whatYouGetTitle: 'Nə əldə edirsiniz',
        get: {
          items: {
            realProduction: 'Demo deyil, real istehsal sistemlərində iş',
            businessLogic: 'Əsas biznes məntiqinə cavabdehlik',
            collaboration: 'Təcrübəli frontend və UX komandaları ilə əməkdaşlıq',
            cleanArchitecture: 'Təmiz memarlığa və uzunmüddətli düşüncəyə vurğu',
            engineeringEnvironment: 'Aydın gözləntiləri olan peşəkar mühəndislik mühiti',
          },
        },
        locationTitle: 'Məkan və format',
        location: {
          items: {
            country: 'Azərbaycan',
            format: 'Tam ştat / Hibrid (rol və təcrübədən asılı olaraq)',
          },
        },
        applyTitle: 'Müraciət etməyə hazırsınız?',
        applyCopy:
          'Əgər sabit, genişlənə bilən Backend sistemləri yaratmaqla maraqlanırsınızsa və işinizin real istehsal mühitində olmasını istəyirsinizsə, sizinlə tanış olmaq istərdik.',
        applyCta: 'Bu rola müraciət et',
      },
      uiux: {
        heroTitle: 'UX/UI Dizayner',
        buildTitle: 'İstehsala hazır platformalar üçün dizayn sistemləri və interfeyslər',
        buildCopy:
          'Biz yaxşı dizaynın yalnız bəzək olmadığını, dizaynın struktur, aydınlıq və qərar qəbul etmə olduğunu anlayan  bir UX/UI Dizayner axtarırıq . Siz istifadə rahatlığı, ardıcıllıq və uzunmüddətli miqyaslana bilən mühüm panellər, bazarlar və daxili sistemlər kimi real məhsullar üzərində işləyəcəksiniz.',
        workOnTitle: 'Nə üzərində işləyəcəksiniz',
        workOn: {
          items: {
            flows: 'Mürəkkəb məhsullar üçün başdan‑sona istifadəçi axınlarını dizayn etmək',
            wireframes: 'Wireframe, UI layout və interaktiv prototiplər hazırlamaq',
            designSystems: 'Dizayn sistemlərini və təkrar istifadə olunan komponentləri müəyyənləşdirmək və qorumaq',
            translateRequirements: 'Biznes/texniki tələbləri aydın UX həllərinə çevirmək',
            collaborateDev: 'Frontend və backend developerlərlə sıx əməkdaşlıq',
            improveUsability: 'Məhsullar üzrə istifadə rahatlığı, əlçatanlıq və konsistentliyi yaxşılaşdırmaq',
            iterateFeedback: 'Rəy, real istifadə və məhdudiyyətlərə görə iterasiya etmək',
          },
        },
        expectTitle: 'Nə gözləyirik',
        coreSkillsTitle: 'Əsas bacarıqlar',
        skills: {
          items: {
            uxPrinciples: 'UX prinsipləri və istifadəçi‑mərkəzli dizaynı anlamaq',
            solidUi: 'Layout, boşluqlar və ierarxiyaya diqqətlə UI dizayn bacarıqları',
            figmaExperience: 'Figma təcrübəsi (komponentlər, variantlar, auto layout)',
            dataHeavyInterfaces: 'Data‑yüklü interfeyslər üçün dizayn bacarığı (dashboard, admin panellər)',
            clearThinking: 'Aydın düşüncə və strukturlaşdırılmış problem həlli',
            portfolioProcess: 'Yalnız vizuallar deyil, prosesi göstərən portfolio',
          },
        },
        niceToHaveTitle: 'Üstünlük sayılır',
        nice: {
          items: {
            devCollab: 'Real məhsullarda developerlərlə iş təcrübəsi',
            responsiveMobile: 'Responsiv və mobile‑first dizayn anlayışı',
            designSystemsPatterns: 'Dizayn sistemləri və miqyasa uyğun UI patternləri ilə tanışlıq',
            adminInternal: 'Admin panelləri və ya daxili alətlər üzərində təcrübə',
          },
        },
        howWeWorkTitle: 'Necə işləyirik',
        how: {
          items: {
            architectureFirstProduct: 'Arxitektura‑öncül məhsul düşüncəsi',
            alignedFromStart: 'UX, UI və mühəndislik başlanğıcdan uyğunlaşdırılır',
            noRushedVisuals: 'Problemi anlamadan tələsik vizual yoxdur',
            logicBackedDecisions: 'Dizayn qərarları trendlərlə yox, məntiqlə dəstəklənir',
            longTermMaintainability: 'Qısamüddətli parıltı yox, uzunmüddətli dəstəklənmə',
          },
        },
        whatYouGetTitle: 'Nə əldə edirsiniz',
        get: {
          items: {
            realProductionNotConcept: 'Konsept dizaynlar yox, real istehsal sistemlərində iş',
            influenceStructureUx: 'Məhsulun strukturu və istifadəçi təcrübəsinə təsir etmək',
            closeCollabEngineering: 'Mühəndislik komandaları ilə yaxın əməkdaşlıq',
            spaceToIterate: 'Düzgün iterasiya və təkmilləşdirmə üçün zaman və məkan',
            professionalEnvironment: 'Aydınlıq və keyfiyyəti qiymətləndirən peşəkar mühit',
          },
        },
        locationTitle: 'Məkan və format',
        location: {
          items: {
            country: 'Azərbaycan',
            format: 'Tam ştat / Hibrid (rol və təcrübədən asılı olaraq)',
          },
        },
        applyTitle: 'Müraciət etməyə hazırsınız?',
        applyCopy:
          'Əgər istifadəçi yönümlü, estetik və funksional UX/UI dizaynlar yaratmaqla maraqlanırsınızsa və işinizin real istehsal mühitində istifadə olunmasını istəyirsinizsə, sizinlə tanış olmaq istərdik.',
        applyCta: 'Bu rola müraciət et',
      },
      frontend: {
        heroTitle: 'Frontend Developer (JS / TS)',
        buildTitle: 'Real biznes sistemlərində istifadə olunan istehsala hazır interfeyslər qurun',
        buildCopy:
          'Vizualdan daha çox struktur, performans və uzunmüddətli dayanıqlılığa önəm verən Frontend Developer axtarırıq. Gündəlik istehsalda istifadə olunan dashboardlar, marketpleyslər və daxili platformalar üzərində işləyəcəksiniz.',
        workOnTitle: 'Nə üzərində işləyəcəksiniz',
        workOn: {
          items: {
            architecture: 'Miqyasa uyğun frontend arxitekturalarını dizaynı və qurulması',
            adminDashboards: 'Admin panellər, dashboardlar və data‑yüklü interfeyslər hazırlamaq',
            translateDesigns: 'UI/UX dizaynlarını təmiz və dəstəklənən kodla reallaşdırmaq',
            integrateApis: 'Backend komandası ilə API inteqrasiyası üzərində sıx əməkdaşlıq',
            performanceAccessibility: 'Cihazlar üzrə performans, əlçatanlıq və istifadə rahatlığını yaxşılaşdırmaq',
            maintainEvolve: 'Mövcud sistemləri pozmadan dəstəkləmək və inkişaf etdirmək',
          },
        },
        expectTitle: 'Nə gözləyirik',
        technicalSkillsTitle: 'Texniki bacarıqlar',
        skills: {
          items: {
            jsTs: 'JavaScript (ES6+) / TypeScript üzrə təcrübə',
            react: 'React (və ya oxşar müasir frameworklər) biliyi',
            componentArchitecture: 'Komponent əsaslı arxitektura anlayışı',
            restAsync: 'REST API və asinxron data ilə iş təcrübəsi',
            responsive: 'Responsiv və adaptiv UI dizaynına bələdlik',
            cleanCode: 'Təmiz və anlaşılan kod yanaşması (oxunaqlılıq, struktur, təkrar istifadə)',
          },
        },
        niceToHaveTitle: 'Üstünlük sayılır',
        nice: {
          items: {
            adminSaaS: 'Admin dashboard və ya SaaS məhsullarla təcrübə',
            uiPerformance: 'UI performansı və optimallaşdırma anlayışı',
            designSystems: 'Dizayn sistemləri ilə işləmə təcrübəsi',
            portfolio: 'GitHub portfoli və ya real layihə nümunələri',
          },
        },
        howWeWorkTitle: 'Necə işləyirik',
        how: {
          items: {
            architectureFirst: 'Arxitektura‑öncül inkişaf',
            clearRequirements: 'Aydın tələblər və strukturlaşdırılmış çatdırılma',
            noHacks: 'Tələsik xüsusiyyətlər və qarışıq hacklər yoxdur',
            longTermStability: 'Qısa qalibiyyətlər deyil, uzunmüddətli sabitliyə fokus',
            collaboration: 'Dizayn, frontend və backend arasında ilk gündən əməkdaşlıq',
          },
        },
        whatYouGetTitle: 'Nə əldə edirsiniz',
        get: {
          items: {
            realProduction: 'Demo tətbiqlər deyil, real istehsal sistemləri ilə iş',
            ownership: 'Aydın texniki məsuliyyət və sahiblənmə',
            collaboration: 'Dizaynerlər və backend mühəndisləri ilə əməkdaşlıq',
            longTermThinking: 'Qısamüddətli tapşırıqlar yox, uzunmüddətli məhsul yanaşması',
            engineeringCulture: 'Təmiz və peşəkar mühəndislik mədəniyyəti',
          },
        },
        locationTitle: 'Məkan və format',
        location: {
          items: {
            country: 'Azərbaycan',
            format: 'Tam ştat / Hibrid (rol və təcrübədən asılı olaraq)',
          },
        },
        applyTitle: 'Müraciət etməyə hazırsınız?',
        applyCopy:
          'Əgər bu rol sizin yalnız yazmaq istədiyiniz kodla deyil, işləmək istədiyiniz tərzə uyğundursa sizdən eşitmək istərdik.',
        applyCta: 'Bu rola müraciət et',
      },
      careers: {
        viewRoleCta: 'Vakansiyaya bax',
        whyTitle: 'Niyə bizimlə işləmək?',
        whyCopy:
          'Biz sistem keyfiyyətinə, aydınlığa və uzunmüddətli təsirə önəm verən mühəndis və dizaynerləri işə alırıq. İşimiz qısamüddətli prototiplər yox, real istehsal sistemləridir.',
        workWithUsAlt: 'Bizimlə işləyin',
        viewMore: 'Daha çox',
        showLess: 'Daha az',
        vacancies: {
          frontend: {
            title: 'Frontend Developer (JS/TS)',
            description: 'Premium interfeyslər və panellər qurun',
            location: 'Tam ştat, Bakı / Hibrid',
            reqs: {
              htmlCssJs: 'Güclü HTML/CSS/JS(TS) bacarıqları',
              uiSense: 'Figma ilə işləmə anlayışı',
              cleanCode: 'Təmiz və anlaşılan kod',
            },
          },
          backend: {
            title: 'Backend Developer (API/DB)',
            description: 'API-lər, data modelləri və təhlükəsiz girişlər dizayn edin.',
            location: 'Tam ştat, Bakı / Hibrid',
            reqs: {
              restSql: 'REST/SQL',
              authRbacSense: 'Auth/RBAC anlayışı',
              performanceMindset: 'Performans yönümlü yanaşma',
            },
          },
          uiux: {
            title: 'UI/UX Dizayner',
            description: 'Premium interfeyslər və panellər qurun',
            location: 'Müqavilə / Tam ştat, Uzaqdan / Hibrid',
            reqs: {
              figma: 'Figma',
              designSystems: 'Dizayn sistemləri',
              webMobileUx: 'Veb / Mobil UX',
            },
          },
        },
        teamMembers: {
          ismat: {
            name: 'Cahangirov İsmət',
            role: 'Frontend Developer',
            description:
              '1 ildən artıqdır AlievsSpace MMC şirkətində Frontend Developer kimi fəaliyyət göstərirəm.',
          },
          elshan: {
            name: 'Elşən Həsənov',
            role: 'Frontend Developer',
            description:
              'Frontend developerəm, artıq 1 ildən çoxdur ki, AlievsSpace MMC şirkətində çalışıram.',
          },
          ismayil: {
            name: 'İsmayıl İsmayılov',
            role: 'Frontend Developer',
            description:
              'Frontend Development sahəsi üzrə 2 ildir ki özümü inkişaf etdirməyə çalışıram. Developia Engineering şirkətində mentor və instructor olaraq işləmişəm.',
          },
          ravena: {
            name: 'Ravena Balagözova',
            role: 'Frontend Developer',
            description:
              'Təxminən bir ildir Frontend Development sahəsində bilik və bacarıqlarımı davamlı şəkildə inkişaf etdirirəm.',
          },
          zehra: {
            name: 'Zəhra Mahmudova',
            role: 'Frontend Developer',
            description:
              'Front end Development sahəsində təxminən bir ildir aktiv şəkildə öyrənir və praktiki bacarıqlarımı təkmilləşdirirəm.',
          },
          elmar: {
            name: 'Elmar Əzimli',
            role: 'Frontend Developer',
            description:
              'Frontend üzrə 1 ildən artıq müddətdir öyrənməyə davam edirəm.',
          },
          parvin: {
            name: 'Pərvin Əhmədov',
            role: 'Frontend Developer',
            description:
              'Software Developer sahəsində 1 ildən artıqdır təcrübə qazanıram və biliklərimi davamlı olaraq inkişaf etdirirəm.',
          },
        },


      },
            caseStudiesIntro:
              'Biz strukturlu arxitektura, düşünülmüş istifadəçi təcrübəsi və disiplinli mühəndisliyin sabit, istehsalata hazır sistemlər yaratdığı real layihələri təqdim edirik. Bizim tədqiqat nümunələrimiz praktik çətinliklərə, dizayn qərarlarına və ölçülə bilən artımı və əməliyyat aydınlığını dəstəkləyən çatdırılma nəticələrinə fokuslanır.',
            caseStudies: {
              viewCta: 'İş nümunələrinə bax',
              keyFocusLabel: 'Əsas fokus',
              requestTitle: 'Layihə nəzərdən keçirmə sorğusu',
              requestCopy:
                'Layihənizdən bəhs edin. Hər sorğunu alırıq və aydın növbəti addımlarla cavablayırıq.',
              tip:
                'Tövsiyə: Sənayeni, əsas tələbləri və hədəf bazarı paylaşın. Təxmini fikir belə başlamağa kifayətdir.',
              privacy:
                'Məlumatlarınızı paylaşmırıq. Mesajınız birbaşa mühəndislik komandasına gedir.',
              chooseField: 'Sahəni seçin',
              items: {
                marketplace: {
                  category: 'E‑ticarət · Marketpleys',
                  title: 'Çox‑satıcılı Marketpleys MVP',
                  description:
                    'Biz miqyaslana bilən arxitektura və əməliyyat aydınlığına böyük diqqət yetirərək istehsalata hazır çoxsatıcılı bazar yerinin MVP-sini dizayn edib yaradırıq. Sistemdə mərkəzləşdirilmiş idarə paneli, strukturlaşdırılmış məhsul və kateqoriya idarəsi, həmçinin erkən böyümə və uzunmüddətli inkişafı dəstəkləyən daxili hesabatlar mövcuddur.',
                  focus: [
                    'Marketpleys arxitekturası',
                    'Admin və satıcı idarəetməsi',
                    'Hesabat və analitika',
                  ],
                },
                fintech: {
                  category: 'Bank · Fintex',
                  title: 'Fintex hesabat paneli',
                  description:
                    'Biz maliyyə əməliyyatları üçün audit hazırlığına, məlumat bütövlüyünə və nəzarət olunan girişə yönəlmiş təhlükəsiz, rol əsaslı hesabat paneli dizayn edib yaradırıq. Sistem strukturlaşdırılmış maliyyə hesabatları, icazəyə əsaslanan baxışlar və etibarlı məlumat görünürlüğü təmin edərək uyğunluq və daxili qərar qəbul etmə prosesinə dəstək olur.',
                  focus: [
                    'Rolla idarə olunan giriş (RBAC)',
                    'Audit‑dostu hesabat',
                    'Təhlükəsiz məlumat axınları',
                  ],
                },
                operations: {
                  category: 'İstehsal · Əməliyyatlar',
                  title: 'Əməliyyat və inventar sistemi',
                  description:
                    'Bu layihə daxili əməliyyatlar və inventar idarəetmə sistemi qurmağa yönəlir ki, əməliyyatların aydınlığını və verilənlərin dəqiqliyini artırmaq mümkün olsun. Platforma stok izləməyi, gəlir və xərclərin monitorinqini, həmçinin gündəlik biznes əməliyyatlarını səmərəli idarə etmək üçün nəzərdə tutulmuş idarəetmə panellərini dəstəkləyir.',
                  focus: [
                    'İnventar idarəetməsi',
                    'Maliyyə izləmə',
                    'Operativ panellər',
                  ],
                },
              },
            },
      teamTitle: 'Komandamız',
      contactIntro: 'Nə qurmaq istədiyinizi deyin, strukturlu təklif göndərək.',
      contactFormTitle: 'Sorğu göndərin',
      contactName: 'Adınız *',
      contactCompany: 'Şirkət',
      contactEmail: 'Email',
      contactPhone: 'Telefon',
      contactInterest: 'Maraq',
      contactTopic: 'Mövzu',
      contactMessage: 'Mesaj',
      contactCompanyPlaceholder: 'Şirkətin adı',
      contactTopicPlaceholder: 'Nə qurmaq istəyirsiniz?',
      contactMessagePlaceholder: 'Layihəni, müddətləri və məqsədləri təsvir edin...',
      contactInterestSoftware: 'Proqram inkişafı',
      contactInterestCommerce: 'E-ticarət / Marketpleys',
      contactInterestBanking: 'Bank / Fintex paneli',
      contactInterestDesign: 'UI/UX və dizayn sistemi',
      contactInterestSupport: 'Dəstək və miqyaslama',
      contactHelper: 'Tövsiyə: sahəni, lazımi modulları və hədəf bazarları qeyd edin.',
      contactSubmit: 'Sorğunu göndər',
      companyDetails: 'Şirkət məlumatı',
      companyDetailsCopy:
        'Premium UI/UX-i sabit mühəndislik və admin alətləri ilə birləşdiririk — commerce və bank sistemləri üçün.',
      noteBadge: 'Qeyd',
      noteCopy: 'Sorğular saxlanılır və Admin → Inquiries bölməsində görünür.',
      industriesIntro: 'Etibarlılıq, hesabat və premium UX vacib olan sistemlər qururuq.',
      about: {
        headerTitle: 'Uzunmüddətli istifadəyə uyğun sistemlər dizayn edirik.',
        headerCopy:
          'Uzunmüddətli etibarlılıq, artan komandalar və data üçün aydın memarlıq sistemlərinə fokuslanırıq.',
        whoTitle: 'Biz kimik',
        whoCopy:
          'Alievs Space MMC — digital və commerce fokuslu mühəndislik şirkətidir. Premium UI və güclü operativ nəzarət ilə istehsala hazır sistemlər qururuq. Backend memarlığı, UX sistemləri və biznes məntiqini birləşdirərək miqyasa uyğun, təhlükəsiz və admin alətləri ilə rahat idarə olunan platformalar yaradırıq. İşimiz multi‑vendor marketpleyslər, daxili idarəetmə platformaları və rollara, hesabatlara, audit‑hazır proseslərə malik bank yönümlü panelləri əhatə edir.',
        who: {
          values: {
            responsibility: 'Məsuliyyət',
            transparency: 'Şəffaflıq',
            premiumQuality: 'Premium keyfiyyət',
            securityReliability: 'Təhlükəsizlik və etibarlılıq',
            longTermPartnership: 'Uzunmüddətli tərəfdaşlıq',
          },
        },
        deliverTitle: 'Necə çatdırırıq',
        deliverIntro:
          'Riskləri azaldan, keyfiyyəti təmin edən və dayanıqlı məhsul artımını dəstəkləyən strukturlaşdırılmış çatdırılma yanaşması.',
        deliver: {
          items: {
            analysis: {
              alt: 'Analiz və strategiya',
              title: 'Analiz və strategiya',
              text:
                'Biznes məqsədləri, texniki məhdudiyyətlər və istifadəçi tələblərini analiz edirik; scope, prioritetlər və aydın çatdırılma yol xəritəsi müəyyənləşdiririk.',
            },
            uxui: {
              alt: 'UX/UI və arxitektura',
              title: 'UX/UI və arxitektura',
              text:
                'İstifadəçi təcrübəsi və sistem arxitekturasını birlikdə dizayn edirik; başlanğıcdan istifadə rahatlığı, miqyasa uyğunluq və uzunmüddətli dəstəklənmə təmin olunur.',
            },
            development: {
              alt: 'İnkişaf',
              title: 'İnkişaf',
              text:
                'Arxitektura və təhlükəsizlik standartlarına uyğun, modular və istehsala hazır kodla əsas funksiyaları reallaşdırırıq.',
            },
            quality: {
              alt: 'Keyfiyyətə nəzarət',
              title: 'Keyfiyyətə nəzarət',
              text:
                'Funksionallıq, performans və kənar hallar strukturlaşdırılmış testlərlə yoxlanılır ki, buraxılışdan əvvəl etibarlılıq təmin olunsun.',
            },
            launch: {
              alt: 'Buraxılış',
              title: 'Buraxılış',
              text:
                'Nəzarətli mərhələlərlə yerləşdiririk, sistem davranışını monitorinq edirik və real istifadəyə yumşaq keçid təmin edirik.',
            },
            support: {
              alt: 'Dəstək və miqyaslama',
              title: 'Dəstək',
              text:
                'İstifadə artdıqca və biznes ehtiyacları dəyişdikcə davamlı dəstək, təkmilləşdirmələr və miqyaslama strategiyaları təqdim edirik.',
            },
          },
        },
        approachTitle: 'Yanaşmamız',
        approachCopy:
          'Memarlıq və operativ ehtiyaclardan başlayaraq, məsuliyyətli şəkildə miqyaslana bilən və istehsalda etibarlı işləyən sistemlər qururuq.',
        approachWhoTitle: 'Kimlərlə işləyirik',
        approachWhoCopy:
          'Müvəqqəti həllər deyil, etibarlı sistemlər, aydın hesabat və uzunmüddətli sabitlik tələb edən komandalarla işləyirik. Strukturlaşdırılmış mühəndislik, premium UI/UX və intizamlı çatdırılma sayəsində sistemlərimiz təkcə inkişafda yox, launchdan sonra da etibarlı qalır.',
        approachResponsibilityTitle: 'Koddan kənar məsuliyyətimiz',
        approachResponsibilityCopy:
          'Buraxılışdan sonra da sistemləri dəstəkləyirik, aydın ünsiyyət saxlayırıq və uzunömürlü platformalar qururuq.',
      },
      industries: {
        items: {
          retail: {
            category: 'Pərakəndə və e‑ticarət',
            title: 'Konversiya və miqyasa uyğun dizayn',
            description:
              'Konversiyaya yönəlmiş mağazalar, ödəniş təcrübəsi (UX), analitika və əməliyyat aydınlığı',
          },
          marketplaces: {
            category: 'Marketpleyslər',
            title: 'Çox‑satıcılı mürəkkəbliyə hazır',
            description:
              'Mağaza panelləri, komissiyalar, ödənişlər və moderasiya ilə multi‑vendor arxitektura — nəzarət və miqyas üçün.',
          },
          banking: {
            category: 'Bank / Maliyyə',
            title: 'Təhlükəsizlik, giriş və uyğunluq',
            description:
              'Tənzimlənən mühitlər üçün rolla idarə olunan giriş, auditə hazır hesabatlar və nəzarətli iş axınları',
          },
          manufacturing: {
            category: 'İstehsal və inventar',
            title: 'Hər səviyyədə operativ aydınlıq',
            description:
              'Stok, xərclərə nəzarət, gəlir‑xərc görünürlüğü və real qərarlara dəstək verən panellər.',
          },
          beauty: {
            category: 'Gözəllik / Salon sistemləri',
            title: 'Gündəlik əməliyyatları sadələşdirən sistemlər',
            description:
              'Əlavə yükü və manual işi azaldan rezervasiyalar, inventar, xatırlatmalar və müştəri idarəetməsi.',
          },
          logistics: {
            category: 'Logistika və çatdırılma',
            title: 'Çatdırılmanın hər mərhələsində görünürlük',
            description:
              'Sifariş axınları, statuslar, mağaza/admin koordinasiyası və əməliyyatları uyğun saxlayan hesabatlayıcı təbəqələr.',
          },
          startup: {
            category: 'Startaplar / MVP',
            title: 'İdeyadan istehsala hazır MVP‑yə',
            description:
              'Sürətli doğrulama və təhlükəsiz böyümə üçün premium UI və miqyasa uyğun arxitektura ilə lean MVP',
          },
        },
        trustedTitle: 'İstehsala hazır sistemləri çatdırmaqda etibarlı',
        trustedCopy1:
          'Biz etibarlı sistemlərə, aydın hesabatlılığa və uzunmüddətli sabitliyə ehtiyacı olan komandalarla işləyirik. Yanaşmamız strukturlaşdırılmış mühəndislik, yüksək səviyyəli UI/UX və disiplinli çatdırılmanı birləşdirir ki, yaratdığımız sistemlər yalnız inkişaf zamanı deyil, istifadəyə verildikdən sonra da etibarlı qalır.',
        trustedCopy2:
          'Hər bir layihə aydın həcmlə, şəffaf ünsiyyətlə və arxitektura-prioritetli düşüncələrlə idarə olunur. Biz komandaların biznesləri böyüdükcə istifadə edə, inkişaf etdirə və etibar edə biləcəyi platformalar qurmağa fokuslanırıq.',
      },
      projectDetails: 'Təfərrüatlar',
      industry: 'Sahə',
      tags: 'Teqlər',
      nextStep: 'Növbəti addım',
      projectNextCopy:
        'Oxşar sistem lazımdır? Büdcəni və premium UI ilə memarlığı təklif edə bilərik.',
      openLink: 'Linki aç',
      postLabel: 'Məqalə',
      postHelpTitle: 'Kömək lazımdır?',
      postHelpCopy:
        'Marketpleys, e-ticarət və ya bank paneli qurursunuzsa, premium memarlıq təklif edə bilərik.',
      contact: {
        loading: 'Yüklənir…',
        heroTitle: 'Komandalar niyə bizi seçir',
        heroCopy:
          'Biz ticarət və bank səviyyəli platformalar üçün premium UI/UX, sabit backend arxitekturası və admin alətlərini birləşdirərək, istehsala hazır rəqəmsal sistemlər dizayn edir və qururuq.',
        hero: {
          items: {
            premiumUi: 'Premium UI sistemləri',
            scalableBackend: 'Miqyaslana bilən backend arxitekturası',
            marketplaceInfra: 'Marketplace infrastruktur',
            adminDashboards: 'İstehsal üçün admin panelləri',
          },
        },
        details: {
          phone: 'Telefon: +994 (51) 700 35 00',
          email: 'Email: alievsspacemmc@gmail.com',
          location: 'Məkan: Azərbaycan',
        },
        form: {
          title: 'Layihə icmalı üçün müraciət',
          copy:
            'Layihəniz barədə məlumat verin. Hər müraciəti qəbul edirik və aydın növbəti addımlarla cavab veririk.',
          labels: {
            name: 'Adınız *',
            company: 'Şirkət adı',
            email: 'Email',
            phone: 'Telefon',
            industry: 'Sənaye',
            projectOverview: 'Layihənin icmalı',
            message: 'Mesaj',
          },
          placeholders: {
            name: 'Ad',
            company: 'Şirkət adı',
            email: 'name@gmail.com',
            phone: '+994 …',
            projectOverview: 'Nə qurmaq istəyirsiniz?',
            message:
              'Layihənizi, məqsədləri və gözlənilən vaxtı təsvir edin. Əsas tələblər və hədəf bazar — başlamaq üçün kifayətdir.',
          },
          options: {
            choose: 'Sahənizi seçin',
            banking: 'Bankçılıq',
            ecommerce: 'E‑commerce',
            software: 'Proqram təminatı inkişafı',
          },
          tip:
            'Məsləhət: Sənayenizi, əsas tələbləri və hədəf bazarı paylaşın. Hətta təxmini fikir başlamaq üçün kifayətdir.',
          submit: 'Müraciəti göndər',
          privacy:
            'Məlumatlarınızı paylaşmırıq. Mesajınız birbaşa mühəndis komandasına çatır.',
        },
        alt: {
          phone: 'Telefon ikonu',
          mail: 'Poçt ikonu',
          location: 'Məkan ikonu',
        },
      },
    },
  },
};

function getPath(obj: any, path: string): any {
  return path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj);
}

export function t(key: string, fallback = ''): string {
  const lang = getLocale();
  const byLang = translations[lang] || translations[DEFAULT_LOCALE] || {};
  const val = getPath(byLang, key);
  return val ?? fallback ?? key;
}

