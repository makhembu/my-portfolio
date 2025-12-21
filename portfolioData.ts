
import { PortfolioData, Project, CareerTrack } from '@/types';

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string[];
  skills: string[];
  track: CareerTrack; // NEW: which career track this belongs to
}

export interface EnhancedPortfolioData extends PortfolioData {
  experience: Experience[];
  detailedContext: {
    universityLore: string;
    fanharmStories: string;
    linguisticBackground: string;
    designPhilosophy: string;
  };
  uiTranslations: {
    en: Record<string, string>;
    sw: Record<string, string>;
  };
}

export const portfolioData: EnhancedPortfolioData = {
  "profile": {
    "firstName": "Brian",
    "lastName": "Makhembu",
    "location": "Nairobi, Kenya",
    "education": "B.S. Computer Technology, JKUAT (2014-2018)",
    "availability": "Available for Remote & Global Opportunities",
    "variants": {
      "it": {
        "role": "Full-Stack Developer | AI/ML & Automation",
        "tagline": "Full-Stack Web Developer | React, TypeScript, Node.js, Python",
        "summary": "Full-stack developer specializing in building end-to-end web applications using React, Next.js, TypeScript, Node.js, PostgreSQL, and Supabase. Experienced in designing database schemas, RESTful APIs, and frontend interfaces that work reliably in production. Background in IT infrastructure and support enables a holistic approach to systems from deployment pipelines to monitoring. Currently focused on remote projects involving modern frameworks, complex data flows, and automation or AI/ML integration where ownership across the entire stack is critical."
      },
      "translation": {
        "role": "Professional English-Swahili Linguist & Technical Translator",
        "tagline": "Expert Technical Translator | Linguistics & Localization Specialist",
        "summary": "Professional English-Swahili linguist with 2+ years of dedicated translation experience and deep expertise in technical terminology. Delivered professional translation services for 50+ global clients with 98%+ accuracy, specializing in document translation, technical interpretation, and software localization. Combine linguistic expertise with full-stack development skills to bridge the gap between software engineering and cultural accessibility. Passionate about ensuring technical products remain accessible and culturally resonant for East African markets."
      }
    }
  },
  "detailedContext": {
    "universityLore": "At the Jomo Kenyatta University of Agriculture and Technology (JKUAT), I was a dedicated member of the School of Computing and Information Technology (SCIT). My academic focus was significantly weighted toward Decision Support Systems (DSS). I produced technical analyses evaluating hardware and software requirements for enterprise platforms like SAP Business Objects, QlikView, and WebFOCUS.",
    "fanharmStories": "My 6-year foundation at Farnham Technologies (2017-2024) and Aventus (2021-2024) involved managing critical IT infrastructure for boutique CX BPO environments. I deployed over 10 school computer labs across Kenya, mastering the art of building resilient systems in resource-constrained environments through PXE-booting and Linux optimization.",
    "linguisticBackground": "As a professional English-Swahili linguist at Jambo Linguists, I view language as a critical component of User Experience. I ensure that technical software remains accessible and culturally resonant for the East African market.",
    "designPhilosophy": "My approach is defined by 'Strategy over Aesthetics'. I view design as a strategic mechanism rather than just visual polish. This requires a deep understanding of the underlying reasons why a product functions, informed by thorough user research and clear technical objectives."
  },
  "uiTranslations": {
    "en": {
      "navHome": "Home",
      "navWork": "Projects",
      "navExp": "Experience",
      "navAbout": "About",
      "navAI": "AI Hub",
      "heroTitle1": "Full-Stack",
      "heroTitle2": "Engineer",
      "heroTitle3": "Linguistic",
      "heroTitle4": "Lead",
      "ctaContact": "Get in Touch",
      "ctaWork": "View Shipped Work",
      "sectionProjects": "Featured Work",
      "sectionActivity": "Latest Activity",
      "sectionIdentity": "Mimi ni Nani / Identity",
      "aboutTitle": "Product-Minded Engineer",
      "footerContact": "Tuongee. Let's Build.",
      "resumeBtn": "Resume",
      "availabilityLabel": "Available"
    },
    "sw": {
      "navHome": "Mwanzo",
      "navWork": "Miradi",
      "navExp": "Uzoefu",
      "navAbout": "Kuhusu",
      "navAI": "Kitovu cha AI",
      "heroTitle1": "Mhandisi wa",
      "heroTitle2": "Programu",
      "heroTitle3": "Mtaalamu wa",
      "heroTitle4": "Lugha",
      "ctaContact": "Wasiliana Nami",
      "ctaWork": "Tazama Miradi",
      "sectionProjects": "Kazi Teule",
      "sectionActivity": "Shughuli za Hivi Karibuni",
      "sectionIdentity": "Mimi ni Nani",
      "aboutTitle": "Mhandisi Anayezingatia Bidhaa",
      "footerContact": "Tuzungumze. Tujenge.",
      "resumeBtn": "Wasifu (CV)",
      "availabilityLabel": "Napatikana",
      "tagline": "Mantiki ya uhandisi. Muktadha wa kibinadamu. Ubunifu unaoongozwa na utafiti."
    }
  },
  "socials": {
    "github": "https://github.com/makhembu",
    "linkedin": "https://linkedin.com/in/brianmakhembu/",
    "email": "makhembu.brian@gmail.com"
  },
  "experience": [
    {
      "id": "exp-1",
      "company": "Jambo Linguists",
      "role": "English-Swahili Linguist & Web Developer",
      "period": "Jan 2023 - Present",
      "track": "both",
      "description": [
        "Delivered professional English–Swahili translation and interpreting services for 50+ global clients with 98%+ accuracy across document translation, telephone/video interpreting, and in-person interpretation.",
        "Architected and maintained full-stack web platform managing translator assignments, client bookings, and project workflows using React, TypeScript, Node.js, and PostgreSQL processing 200+ projects annually.",
        "Engineered REST APIs and database schemas with optimized performance (sub-200ms response times) and managed deployment pipelines connecting language professionals with clients worldwide."
      ],
      "skills": ["React", "TypeScript", "Node.js", "PostgreSQL", "REST APIs", "Translation", "Swahili", "Interpreting"]
    },
    {
      "id": "exp-1b",
      "company": "Self-Employed",
      "role": "Full-Stack Consultant",
      "period": "Jan 2020 - Present",
      "track": "it",
      "description": [
        "Engineered 25+ custom web applications, responsive websites, and e-commerce platforms for Fortune 500 startups and mid-market companies using React, TypeScript, Node.js, and modern frameworks.",
        "Delivered end-to-end projects from requirements gathering and database architecture through production deployment with CI/CD pipelines, maintaining 99.5% uptime across all production systems.",
        "Implemented performance optimizations achieving 45% faster page loads, integrated automated testing (Jest, Cypress) with 80%+ code coverage, and maintained clean Git workflows for 15+ concurrent projects."
      ],
      "skills": ["React", "TypeScript", "Node.js", "Git", "CI/CD", "JavaScript", "Full-Stack Development"]
    },
    {
      "id": "exp-2",
      "company": "Aventus",
      "role": "IT Support Specialist",
      "period": "Jan 2021 - Dec 2023",
      "track": "it",
      "description": [
        "Delivered technical support to 500+ end-users across 15+ global office locations, maintaining 98% ticket satisfaction rating and 95% first-contact resolution through hardware troubleshooting, software installations, and VPN optimization.",
        "Architected and managed Active Directory infrastructure including user access policies, security groups, and network authentication systems, supporting seamless operations for multinational enterprise environment.",
        "Engineered automated IT asset tracking and inventory management system reducing administrative overhead by 40%, and documented 2,000+ support tickets maintaining SLA compliance of 99%+ uptime."
      ],
      "skills": ["Active Directory", "Windows Server", "IT Support", "Troubleshooting", "Network Admin", "Infrastructure"]
    },
    {
      "id": "exp-3",
      "company": "Fanharm Technologies",
      "role": "IT Technician",
      "period": "Jan 2017 - Dec 2021",
      "track": "it",
      "description": [
        "Resolved complex hardware issues for 300+ end-user devices (desktops, laptops, peripherals) achieving 96% first-contact resolution rate and 99.2% customer satisfaction scores.",
        "Implemented enterprise-wide software deployment strategy using imaging tools, reducing new employee onboarding from 8 hours to 3 hours per device, saving 2,000+ hours annually across 200+ employees.",
        "Managed 99.8% uptime across 500-device estate through proactive system maintenance, security patch management, and Windows infrastructure optimization aligned with ISO 27001 compliance standards."
      ],
      "skills": ["System Administration", "Troubleshooting", "Hardware Repair", "Windows", "Active Directory", "Infrastructure"]
    },
    {
      "id": "exp-4",
      "company": "Notify Logistics",
      "role": "Android Developer",
      "period": "Jun 2019 - Dec 2020",
      "track": "it",
      "description": [
        "Architected and engineered 2 production Android applications generating 50K+ downloads and maintaining 4.5-star rating on Google Play Store, enabling real-time fleet tracking and delivery management for logistics network.",
        "Implemented GPS tracking, real-time location updates, and push notifications reducing average delivery notification latency from 8 minutes to 45 seconds through Firebase optimization.",
        "Engineered RESTful API integrations with sophisticated caching and data optimization reducing client-side data consumption by 35% and improving app performance on low-bandwidth networks."
      ],
      "skills": ["Android", "Java", "Kotlin", "Firebase", "GPS APIs", "Real-time Data", "Mobile Development"]
    }
  ],
  "projects": [
    {
      "id": "writing-service",
      "title": "Professional Writing Service",
      "description": "Full-stack SaaS platform for professional document editing. Built real-time order tracking, payment processing via Stripe, and client portals. Result: 40+ active users, 95% uptime SLA.",
      "longDescription": "Architected and deployed a complete SaaS platform from database to production. Implemented Prisma ORM with PostgreSQL for relational data modeling, Next.js API routes for backend services, and React for interactive frontend. Integrated Stripe payment processing and implemented role-based access control.",
      "metrics": {
        "uptime": "95%",
        "activeUsers": "40+",
        "loadTime": "<1.2s",
        "timeInvested": "80 hours"
      },
      "tags": ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "Stripe", "Tailwind"],
      "link": "https://writing-service.vercel.app/",
      "githubUrl": "https://github.com/makhembu/writing-service", 
      "category": "code",
      "track": "it",
      "imageUrl": "https://s0.wp.com/mshots/v1/https%3A%2F%2Fwriting-service.vercel.app%2F?w=800&h=600"
    },
    {
      "id": "grade-assist",
      "title": "GradeAssist - Educational Analytics",
      "description": "Educational assessment platform with intelligent grading logic. Built custom algorithms for grade calculation, bulk import/export, and performance analytics. Reduced grading time by 60% for 200+ educators.",
      "longDescription": "Developed a comprehensive educational tool addressing the inefficiency of manual grading. Implemented complex business logic for weighted grade calculations, curve adjustments, and threshold-based reporting. Integrated with Supabase for real-time data sync and built accessible UI components with React.",
      "metrics": {
        "educatorsUsing": "200+",
        "timeSaved": "60% reduction",
        "loadTime": "<0.8s",
        "timeInvested": "100 hours"
      },
      "tags": ["React", "TypeScript", "Supabase", "EdTech", "UX Strategy", "Tailwind"],
      "link": "https://gradeassist-psi.vercel.app/",
      "githubUrl": "https://github.com/makhembu/gradeassist",
      "category": "code",
      "track": "it",
      "imageUrl": "https://s0.wp.com/mshots/v1/https%3A%2F%2Fgradeassist-psi.vercel.app%2F?w=800&h=600"
    },
    {
      "id": "jambo-demo",
      "title": "Jambo Localization Portal",
      "description": "Bilingual SaaS portal showcasing localization workflows. Built interactive translation pipelines demonstrating English-Swahili technical adaptation. Used by 15+ international clients.",
      "longDescription": "Created a demonstration and client management portal for translation services. Implemented dual-language interface with context-aware translations, project tracking dashboards, and glossary management systems. Showcases practical Swahili localization for tech products.",
      "metrics": {
        "clients": "15+",
        "languages": "2 (EN/SW)",
        "conversionRate": "35%",
        "timeInvested": "60 hours"
      },
      "tags": ["Next.js", "TypeScript", "Linguistics", "i18n", "Localization", "Tailwind"],
      "link": "https://jambo-demo.vercel.app/",
      "githubUrl": "https://github.com/makhembu/jambo-portal",
      "category": "translation",
      "track": "both",
      "imageUrl": "https://s0.wp.com/mshots/v1/https%3A%2F%2Fjambo-demo.vercel.app%2F?w=800&h=600"
    }
  ],
  "services": [
    {
      "title": "UX Strategy",
      "description": "Research-driven design focusing on the strategic 'why' behind product functionality.",
      "icon": "Search",
      "track": "it"
    },
    {
      "title": "Full-Stack Development",
      "description": "Building scalable, type-safe applications from core infrastructure to frontend polish.",
      "icon": "Code2",
      "track": "it"
    },
    {
      "title": "Technical Localization",
      "description": "Expert English-Swahili translation ensuring technical accuracy and cultural resonance.",
      "icon": "Languages",
      "track": "translation"
    },
    {
      "title": "Document Translation",
      "description": "Professional translation for documents, manuals, and technical content with 98%+ accuracy.",
      "icon": "FileText",
      "track": "translation"
    },
    {
      "title": "Live Interpretation",
      "description": "Real-time English-Swahili interpretation for meetings, calls, and presentations.",
      "icon": "Headphones",
      "track": "translation"
    }
  ],
  "skills": {
    "it": {
      "frontend": ["React", "Next.js", "TypeScript", "JavaScript", "HTML5", "CSS3", "Tailwind"],
      "backend": ["Node.js", "Express", "PostgreSQL", "Supabase", "REST APIs", "Prisma"],
      "infrastructure": ["CI/CD", "Kubernetes", "Docker", "Git/GitHub", "NPM", "Postman", "System Administration"]
    },
    "translation": {
      "technical": ["Technical Terminology", "Software Localization", "Document Translation", "API Documentation", "User Interface Translation"],
      "languages": ["Swahili (Native)", "English (Professional)", "Technical Swahili"],
      "specializations": ["Software Localization", "Technical Documentation", "Live Interpretation", "East African Markets", "Cultural Adaptation"]
    }
  },
  "languages": [
    { "name": "Swahili (Native)", "level": 100 },
    { "name": "English (Professional)", "level": 98 }
  ]
};
