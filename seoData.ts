/**
 * SEO Data Management System
 * Stores all SEO metadata for the portfolio website
 * Auto-generated content is powered by AI for continuous optimization
 */

export interface PageSEO {
  title: string;
  description: string;
  keywords: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  author?: string;
  datePublished?: string;
  dateModified?: string;
  twitterHandle?: string;
  canonicalUrl?: string;
}

export interface SchemaMicrodata {
  "@context": string;
  "@type": string;
  name?: string;
  description?: string;
  url?: string;
  image?: string | string[];
  author?: object;
  [key: string]: any;
}

export const baseSEO: PageSEO = {
  title: "Brian Makhembu | Full-Stack Engineer & UX Strategist",
  description:
    "Full-Stack Software Engineer, UX Strategist, and Professional Swahili Linguist. Expert in infrastructure, Android development, and strategic UX design.",
  keywords: [
    "Full-Stack Engineer",
    "UX Strategist",
    "Swahili Linguist",
    "React",
    "Next.js",
    "TypeScript",
    "Software Development",
    "Infrastructure Engineering",
    "Mobile Development",
    "Decision Support Systems",
    "Portfolio",
  ],
  ogTitle: "Brian Makhembu - Full-Stack Engineer & UX Strategist",
  ogDescription:
    "Discover the portfolio of Brian Makhembu, a seasoned full-stack engineer with expertise in infrastructure, UX strategy, and professional translation.",
  author: "Brian Makhembu",
  canonicalUrl: "https://brianuche.dev",
};

// Page-specific SEO configurations
export const pageSEOMap: Record<string, PageSEO> = {
  home: baseSEO,
  about: {
    title: "About Brian Makhembu | Full-Stack Engineer & Linguist",
    description:
      "Learn about Brian's journey from IT infrastructure specialist to full-stack engineer and UX strategist. Expert in DSS, CX optimization, and professional translation.",
    keywords: [
      "About Brian Makhembu",
      "IT Infrastructure",
      "Full-Stack Developer",
      "UX Design",
      "JKUAT",
      "Swahili Translation",
      "CX BPO",
      "Decision Support Systems",
    ],
  },
  projects: {
    title: "Projects | Brian Makhembu's Portfolio",
    description:
      "Explore Brian's showcase of full-stack projects including web applications, mobile development, and strategic UX implementations.",
    keywords: [
      "Portfolio Projects",
      "Web Development",
      "Full-Stack Applications",
      "React",
      "Next.js",
      "Mobile Apps",
      "UX Design Projects",
    ],
  },
  experience: {
    title: "Experience | Brian Makhembu - IT & Software Engineering",
    description:
      "7+ years of professional experience in IT infrastructure, Android development, and full-stack engineering. Expert at Farnham Technologies, Aventus, and Notify Logistics.",
    keywords: [
      "Work Experience",
      "IT Infrastructure",
      "Android Development",
      "Full-Stack Engineering",
      "CX BPO",
      "Technical Leadership",
    ],
  },
};

// Rich snippets schema for structured data
export const personSchema: SchemaMicrodata = {
  "@context": "https://schema.org/",
  "@type": "Person",
  name: "Brian Makhembu",
  url: "https://brianuche.dev",
  image:
    "https://brianuche.dev/profile-image.jpg", // Update with actual image
  jobTitle: "Full-Stack Engineer & UX Strategist",
  description:
    "Full-stack software engineer specializing in infrastructure, UX strategy, and professional translation",
  sameAs: [
    "https://github.com/brianuche",
    "https://linkedin.com/in/brianuche",
    "https://twitter.com/brianuche", // Update with actual handles
  ],
  alumniOf: {
    "@type": "EducationalOrganization",
    name: "JKUAT (Jomo Kenyatta University of Agriculture and Technology)",
    url: "https://www.jkuat.ac.ke/",
  },
  worksFor: [
    {
      "@type": "Organization",
      name: "Farnham Technologies",
      jobTitle: "IT Infrastructure Specialist",
    },
    {
      "@type": "Organization",
      name: "Aventus",
      jobTitle: "IT Infrastructure Manager",
    },
    {
      "@type": "Organization",
      name: "Notify Logistics",
      jobTitle: "Android Developer",
    },
  ],
  knowsLanguage: ["en-US", "sw"],
};

// SEO-optimized descriptions by skill
export const skillSEOMap: Record<string, string> = {
  "Full-Stack Development":
    "Expert in building complete web applications from front-end UI/UX to backend infrastructure using React, Next.js, TypeScript, and Node.js.",
  "Infrastructure Engineering":
    "Specialized in deploying, managing, and optimizing IT infrastructure with 6+ years of enterprise experience in CX BPO environments.",
  "UX Strategy":
    'Philosophy-driven UX design focused on "Strategy over Aesthetics" with research-backed implementations for user-centered solutions.',
  "Mobile Development":
    "Android development expertise with focus on logistics tracking applications and cross-platform solutions.",
  "Decision Support Systems":
    "Advanced knowledge of enterprise DSS platforms including SAP Business Objects, QlikView, and WebFOCUS from JKUAT specialization.",
  Translation: "Professional English-Swahili translator with technical terminology expertise at Jambo Linguists.",
};

// SEO metadata for blog/article pattern (future expansion)
export interface ArticleSEO extends PageSEO {
  articleBody?: string;
  wordCount?: number;
  readingTime?: string;
  category?: string;
  tags?: string[];
}

// Store for AI-generated SEO content (updated automatically)
export interface AIGeneratedSEO {
  pageId: string;
  generatedTitle?: string;
  generatedDescription?: string;
  generatedKeywords?: string[];
  generatedMetaDescription?: string;
  optimizationScore?: number;
  lastUpdated: string;
  aiModel: string;
}

// Sitemap configuration
export const sitemapConfig = {
  siteUrl: "https://brianuche.dev",
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api", "/.well-known"],
      },
    ],
    additionalSitemaps: ["https://brianuche.dev/server-sitemap.xml"],
  },
};

// Open Graph image dimensions for optimal social sharing
export const ogImageConfig = {
  width: 1200,
  height: 630,
  type: "image/jpeg",
};
