
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
        "role": "Full-Stack Engineer | Systems Thinking",
        "tagline": "Full-Stack Web Developer | React, TypeScript, Node.js, Python",
        "summary": "I build systems that reduce complexity, not add to it. With 6+ years in infrastructure and support, I know what breaks in production and how to prevent it. I'm comfortable across React, Next.js, TypeScript, Node.js, and PostgreSQL. But here's what matters more: I think in terms of constraints. Bandwidth, compliance, user context. Not just features. I'm looking for remote work where full-stack ownership makes sense. That means owning everything from infrastructure through user experience."
      },
      "translation": {
        "role": "Technical Linguist | Cultural Bridge",
        "tagline": "English-Swahili Translator | Localization & Linguistics Specialist",
        "summary": "I'm not a word-for-word translator. I translate context. Technical documentation, software UI, policy text. I've delivered work across 50+ projects with 70%+ accuracy for global clients. My infrastructure background means I understand the systems I'm explaining. My linguistics background means I know why English structures don't map to Swahili and how to keep meaning intact. Most translators don't understand tech. Most engineers don't understand language. I do both."
      }
    }
  },
  "detailedContext": {
    "universityLore": "At JKUAT (2014-2018), I focused on Decision Support Systems and enterprise data architecture. That taught me something that stuck: systems must be built for actual constraints. Limited infrastructure. Global audiences. Changing requirements. It's not about abstract elegance. It's about practical resilience.",
    "fanharmStories": "At Farnham Technologies (2017-2024), I managed IT infrastructure for CX BPO teams across Kenya and East Africa. I deployed 10+ computer labs in resource-constrained environments, reduced downtime through Linux optimization, and trained new agents who delivered real value. The big lesson: infrastructure isn't separate from people. System design must account for who's using it and what they need to actually succeed.",
    "linguisticBackground": "At Jambo Linguists (2023-present), I deliver professional English-Swahili translation across 50+ projects with 70%+ accuracy. I don't translate words. I translate intent. Technical documentation, software UI, policy text. Language barriers are user experience barriers. The same skill that lets me understand technical architecture helps me explain it in ways that resonate across cultures.",
    "designPhilosophy": "Strategy over aesthetics. Design isn't decoration. It's how you reduce cognitive load for whoever's on the other end. A hiring manager trying to understand your background. A user navigating software in Swahili. A technical team reviewing infrastructure decisions. This portfolio is proof. It uses the same systems thinking I apply to actual work."
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
      "availabilityLabel": "Available",
      "projectsSubtitle": "Kazi / Proof of Competence",
      "projectsDescription": "These are real projects I've shipped. Full-stack work, infrastructure, localization. Each one shows the thinking from initial design through getting it live.",
      "filterAll": "all",
      "filterCode": "code",
      "filterInfra": "infra",
      "filterTranslation": "translation",
      "resumeSection": "Resume Intelligence",
      "resumeSectionTitle": "Your Resume. Actually Useful.",
      "resumeDescription": "A resume that works with ATS systems and with actual recruiters who read them. Plus a tool to match it against specific jobs.",
      "atsTab": "Download Resume",
      "atsReadyLabel": "Download Your Resume",
      "atsReadyDesc": "A resume that actually works. Recruiters can read it. ATS systems can parse it. Download as PDF or copy the text.",
      "optimizerTab": "Match Against a Job",
      "optimizerLabel": "See How You Fit",
      "optimizerDesc": "Paste a job description. I'll reorder your experience by relevance, highlight what matches, and show you your fit score. It's not magic. It's useful.",
      "removeDoubt": "Remove All Doubt.",
      "removeDoubtDesc": "Available for engineering roles where technical judgment and cultural nuance matter.",
      "baseLabel": "Location",
      "footerEmail": "Email"
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
      "tagline": "Mantiki ya uhandisi. Muktadha wa kibinadamu. Ubunifu unaoongozwa na utafiti.",
      "projectsSubtitle": "Kazi / Uthibitisho wa Ustadi",
      "projectsDescription": "Miradi ya uzalishaji inayoambatanisha maendeleo ya kamili ya kuta, automation ya miundombinu, na kwa kutafsiri kwa kiufundi. Kila mmoja anawakilisha umiliki wa moja kwa moja kutoka kwa usanidi hadi kumfukuzwa.",
      "filterAll": "yote",
      "filterCode": "programu",
      "filterInfra": "miundombinu",
      "filterTranslation": "lokalisasi",
      "resumeSection": "Akili ya Wasifu",
      "resumeSectionTitle": "Optimized kwa ATS & Inayoendeshwa na AI.",
      "resumeDescription": "Wasifu wa kitaaluma ulioboreswa kwa mifumo ya ATS na waajiri. Pamoja na kulinganishwa kwa kazi cha AI kurudia wasifu wako ili kuambatana vizuri na fursa maalum.",
      "atsTab": "Pakua Wasifu",
      "atsReadyLabel": "✓ Waajiri & ATS Tayari",
      "atsReadyDesc": "Wasifu wa maandishi safi na wa kiufundi ambayo unafanya kazi na kila mfumo wa ATS na waajiri wa binadamu. Pakua kama PDF au kunakili kama maandishi.",
      "optimizerTab": "Linganisha Kazi ya AI",
      "optimizerLabel": "🤖 Uboreshaji Unaohisi AI",
      "optimizerDesc": "Bandika maelezo yoyote ya kazi. AI yetu inachambua na kurahisisha wasifu wako kulingana na mahusiano ya karibu kucheza vipengele vya kushindwa, kubainisha maarifa yanayolinganisha, na kuboresha alama. Angalia alama yako ya kulinganisha haraka.",
      "dualExpertise": "Uzamili wangu mara mbili kama mhandisi na lugha inaniruhusa kukamatia shida kutoka kwa mtazamo wote mantiki na binadamu, kwa kiwango cha kimataifa.",
      "experienceYears": "Miaka 6+",
      "alumniLabel": "Alumni",
      "baseLabel": "Mahali",
      "roleLabel": "Jukumu",
      "technicalPillar": "Nguzo ya Kiufniki",
      "highPerformance": "Kuboresha Kwa Haraka",
      "highPerformanceDesc": "Kuzingatia kwa undani Next.js, mikakati ya kusimamia hali, na uboreshaji wa web vitals kwa watumiaji wa kimataifa.",
      "professionalTrack": "Rekodi ya Kazi",
      "professionalTrackTitle": "Uzoefu & Alama.",
      "professionalTrackDesc": "Miaka 7+ inayobeba programu ya uzalishaji. Kutoka miundombinu kwa kiwango kikubwa hadi mifumo ya SaaS. Daima iliyozingatia matokeo.",
      "strengths": "Nguvu",
      "fullstackArch": "Miundombinu ya TypeScript/Next.js ya kamili.",
      "productionDB": "Hifadhi za uzalishaji (PostgreSQL/Supabase).",
      "infrastructure": "Miundombinu na utawala wa Linux.",
      "localization": "Hekima ya lokalisasi (Kiswahili/Kingereza).",
      "personalImpact": "Athari ya Kibinafsi",
      "removeDoubt": "Tangu Shaka.",
      "removeDoubtDesc": "Napatikana kwa ajili ya majukumu ya uhandisi ambapo hukumu ya kiufniki na nuansa ya kitamaduni ni muhimu.",
      "directContact": "Wasiliana Moja kwa Moja",
      "downloadTechSpecs": "Pakua Hekima za Kiufniki",
      "footerReady": "Jina ndoto ya kuunganisha timu za uhandisi wa kwanza au lokalisisha uzinduzi wako wa baadae.",
      "footerLocation": "Mahali",
      "footerEmail": "Barua Pepe",
      "viewGitHub": "Tazama GitHub",
      "signalDelivery": "Ishara: Kumkamata Duniani",
      "deliveryDesc": "Miaka 6+ uzoefu wa kusambaza bidhaa zinazo kubadilika na kuoza kwa TypeScript safi kwa washirikiano wenye matatizo duniani.",
      "signalLocalization": "Ishara: Lokalisasi",
      "localizationDesc": "Ujuzi wa kina katika muktadha wa Kiswahili, kuuhakikisha mabadiliko ya juu na UX kwa mifumo ya dijitali duniani.",
      "aiPlayground": "Uwanja wa AI",
      "aiPlaygroundSubtitle": "Digital Twin & Lokalisasi",
      "brianAIAssistant": "Brian Msaada wa AI",
      "directContext": "Muktadha Wa Moja kwa Moja",
      "thinking": "Inakufikiri...",
      "askSomething": "Uliza kitu...",
      "swahiliLocalization": "Lokalisasi ya Kiswahili",
      "pasteText": "Bandika maandishi ya kiufniki...",
      "translate": "Tafsiri",
      "translating": "Inatafsiri...",
      "matokeo": "Matokeo"
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
        "Delivered professional English–Swahili translation and interpreting services for 50+ global clients with 70%+ accuracy (certified) across legal documents, court proceedings, technical documentation, and in-person interpretation. Specialized in criminal justice and software localization with precision required for international clients across East Africa.",
        "Built and maintained full-stack web platform managing translator assignments, client bookings, and project workflows using React, TypeScript, Node.js, and PostgreSQL. Result: Processing 50+ projects, serving clients across 15+ countries, reducing booking time from 2 hours to 15 minutes.",
        "Engineered REST APIs and database schemas with sub-200ms response times, enabling real-time project tracking and seamless communication between translators and clients worldwide."
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
        "Engineered 25+ custom web applications and e-commerce platforms for startups and mid-market companies. Result: 99.5% uptime across all systems, 45% faster page loads than industry average, reducing client infrastructure costs by 30%.",
        "Delivered end-to-end projects from architecture through production deployment with CI/CD pipelines. Implemented automated testing (Jest, Cypress) with 80%+ code coverage, reducing production bugs by 60%.",
        "Specialized in complex data flows and system design. I've built scalable databases, REST APIs, and frontend interfaces that work reliably at scale. Managed 15+ concurrent projects with clean Git workflows and documentation for long-term maintainability."
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
        "Delivered technical support to 500+ end-users across 15+ global office locations with 98% ticket satisfaction rating and 95% first-contact resolution. Result: Eliminated IT backlog within 6 months, enabling business teams to focus on operations rather than support tickets.",
        "Architected and managed Active Directory infrastructure including user access policies, security groups, and network authentication. Designed system that cut onboarding time from 4 hours to 30 minutes per new hire, saving 200+ hours annually.",
        "Engineered automated IT asset tracking system that reduced administrative overhead by 40% and improved license compliance from 70% to 99%. Documented 2,000+ support tickets maintaining 99%+ uptime SLA across enterprise estate."
      ],
      "skills": ["Active Directory", "Windows Server", "IT Support", "Troubleshooting", "Network Admin", "Infrastructure"]
    },
    {
      "id": "exp-3",
      "company": "Fanharm Technologies",
      "role": "IT Technician & Infrastructure Lead",
      "period": "Jan 2017 - Dec 2021",
      "track": "it",
      "description": [
        "Resolved complex hardware issues for 300+ end-user devices (desktops, laptops, peripherals) achieving 96% first-contact resolution rate and 99.2% customer satisfaction scores.",
        "Deployed 10+ fully functional computer labs across Kenya and East Africa in resource-constrained environments using PXE-booting and Linux optimization, enabling education access for 500+ students.",
        "Reduced customer downtime by 40% through proactive system maintenance, security patch management, and Windows infrastructure optimization aligned with ISO 27001 compliance standards across 500-device estate.",
        "Trained 15+ new support agents, creating documentation and runbooks that increased their effectiveness by 35%, enabling them to handle complex tickets independently within 3 months.",
        "Implemented enterprise-wide software deployment strategy using imaging tools, reducing new employee onboarding from 8 hours to 3 hours per device, saving 2,000+ hours annually across 200+ employees.",
        "Managed 99.8% uptime across 500-device estate through proactive system maintenance, security patch management, and Windows infrastructure optimization aligned with ISO 27001 compliance standards."
      ],
      "skills": ["System Administration", "Hardware Repair", "Linux", "Windows Server", "Infrastructure", "Troubleshooting", "Active Directory"]
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
      "description": "Full-stack SaaS platform for professional document editing. Real-time order tracking, payment processing, client portals. 40+ active users, 95% uptime.",
      "longDescription": "I built this from the ground up. React frontend, Node.js backend, PostgreSQL database. Integrated Stripe for payments. Implemented role-based access control so clients can only see their own work. The whole system handles 50+ documents monthly with consistent uptime.",
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
      "imageUrl": "https://raw.githubusercontent.com/makhembu/writing-service/main/public/og-image.png"
    },
    {
      "id": "grade-assist",
      "title": "GradeAssist - Educational Analytics",
      "description": "Study platform for students. Intelligent grading and assignment matching. Connects students with relevant coursework based on their performance. Saved educators 60% of grading time.",
      "longDescription": "This solves a real problem. Teachers were spending hours manually grading and matching assignments. I built a platform that automates both. Used Next.js for the frontend, Supabase for real-time data, and created a custom algorithm that recommends assignments based on student performance. 200+ educators use it now.",
      "metrics": {
        "educatorsUsing": "200+",
        "timeSaved": "60% reduction",
        "loadTime": "<0.8s",
        "timeInvested": "100 hours"
      },
      "tags": ["Next.js", "React", "TypeScript", "Supabase", "EdTech", "Matching Algorithm", "Tailwind"],
      "link": "https://gradeassist-psi.vercel.app/",
      "githubUrl": "https://github.com/makhembu/gradeassist",
      "category": "code",
      "track": "it",
      "imageUrl": "https://raw.githubusercontent.com/makhembu/gradeassist/main/public/og-image.png"
    },
    {
      "id": "jambo-demo",
      "title": "Jambo Localization Portal",
      "description": "Demo and operations portal for Jambo Linguists. Bilingual interface with translation pipelines, project tracking, client dashboard. Converted 15+ international clients. Now used internally.",
      "longDescription": "This was a proof-of-concept that became a production system. I built a bilingual portal showing how translation management works. Next.js frontend, Swahili/English UI, project tracking, glossary management. It was so effective that we started using it internally. 15+ clients came on board through this platform.",
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
      "imageUrl": "https://raw.githubusercontent.com/makhembu/jambo-portal/main/public/og-image.png"
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
