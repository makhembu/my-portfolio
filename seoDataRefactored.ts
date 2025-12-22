/**
 * REFACTORED SEO Data System (v2)
 * ================================
 * Deterministic, human-maintained static metadata
 * Updated ONLY when actual content changes or strategy shifts
 * NO AI generation, NO runtime regeneration, NO daily changefreq
 * 
 * Last Updated: December 22, 2025
 * Maintenance Frequency: Manual, tied to content changes
 */

import { portfolioData } from '@/portfolioData';

export interface PageSEO {
  title: string;
  description: string;
  keywords: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  author?: string;
  canonicalUrl?: string;
}

export interface SchemaMicrodata {
  '@context': string;
  '@type': string;
  [key: string]: any;
}

/**
 * BASE HOMEPAGE SEO
 * Core metadata for homepage (/)
 * ONLY update when homepage content or positioning changes
 */
export const baseSEO: PageSEO = {
  title: 'Brian Makhembu | Full-Stack Engineer & UX Strategist',
  description:
    'Full-Stack Software Engineer, UX Strategist, and Professional Swahili Linguist. Expert in infrastructure, backend systems, and strategic UX design. 7+ years building production software.',
  keywords: [
    'Full-Stack Engineer',
    'UX Strategist',
    'Software Developer',
    'TypeScript',
    'React',
    'Next.js',
    'Backend Development',
    'Infrastructure Engineering',
    'Product Design',
    'Technical Leadership',
  ],
  ogTitle: 'Brian Makhembu - Full-Stack Engineer & UX Strategist',
  ogDescription:
    'Discover the portfolio of Brian Makhembu, a seasoned full-stack engineer with expertise in modern web development, infrastructure, and UX strategy.',
  ogImage: 'https://brianuche.dev/og-image.jpg',
  author: 'Brian Makhembu',
  canonicalUrl: 'https://brianuche.dev',
};

/**
 * PER-PAGE SEO METADATA
 * Updated manually when page content changes
 * Tied to actual portfolio sections
 * Each page has unique, human-written title and description
 */
export const pageSEOMap: Record<string, PageSEO> = {
  home: baseSEO,

  about: {
    title: 'About Brian Makhembu | Full-Stack Engineer & Linguist',
    description:
      'Learn about Brian\'s 7+ year journey from IT infrastructure specialist to full-stack engineer. Expert in strategic UX design, decision support systems, and professional translation.',
    keywords: [
      'About Brian Makhembu',
      'IT Infrastructure',
      'Full-Stack Developer',
      'UX Design',
      'JKUAT',
      'Swahili Translation',
      'Technical Leadership',
      'Product Strategy',
      'Software Architecture',
      'CX Optimization',
    ],
    ogTitle: 'About - Brian Makhembu',
    ogDescription:
      '7+ years building scalable systems. From IT infrastructure to full-stack engineering to professional translation.',
  },

  projects: {
    title: 'Projects | Brian Makhembu\'s Full-Stack Portfolio',
    description:
      'Explore Brian\'s production-ready projects built with React, Next.js, TypeScript, and Node.js. Full-stack applications spanning SaaS, analytics, and technical localization.',
    keywords: [
      'Portfolio Projects',
      'Full-Stack Applications',
      'React',
      'Next.js',
      'Web Development',
      'SaaS',
      'Software Solutions',
      'GitHub Projects',
      'Production Code',
      'Technical Portfolio',
    ],
    ogTitle: 'Projects - Brian Makhembu',
    ogDescription:
      'Production projects: full-stack development, infrastructure automation, and technical localization.',
  },

  experience: {
    title: 'Work Experience | Brian Makhembu - Software Engineer',
    description:
      '7+ years of professional experience in IT infrastructure, Android development, and full-stack engineering. Roles at Farnham Technologies, Aventus, Notify Logistics, and Jambo Linguists.',
    keywords: [
      'Work Experience',
      'IT Infrastructure',
      'Full-Stack Engineering',
      'Android Development',
      'Technical Leadership',
      'Professional Translation',
      'CX BPO',
      'Software Architecture',
      'Project Management',
      'Cloud Infrastructure',
    ],
    ogTitle: 'Experience - Brian Makhembu',
    ogDescription:
      'Professional journey: IT infrastructure → Android development → full-stack engineering → linguistic expertise.',
  },
};

/**
 * PERSON SCHEMA (JSON-LD)
 * Describes Brian to search engines and social platforms
 * Helps Google understand: who you are, education, roles, social presence
 * Reference: https://schema.org/Person
 */
export const personSchema: SchemaMicrodata = {
  '@context': 'https://schema.org/',
  '@type': 'Person',
  name: 'Brian Makhembu',
  url: 'https://brianuche.dev',
  image: 'https://brianuche.dev/profile-image.jpg',
  jobTitle: 'Full-Stack Engineer & UX Strategist',
  description:
    'Full-stack software engineer specializing in infrastructure, UX strategy, and professional translation. 7+ years building production systems.',
  sameAs: [
    'https://github.com/makhembu',
    'https://linkedin.com/in/brianmakhembu/',
    'https://twitter.com/brianuche',
  ],
  alumniOf: {
    '@type': 'EducationalOrganization',
    name: 'JKUAT (Jomo Kenyatta University of Agriculture and Technology)',
    url: 'https://www.jkuat.ac.ke',
    sameAs: 'https://www.jkuat.ac.ke',
  },
  workLocation: {
    '@type': 'City',
    name: 'Nairobi',
    addressCountry: 'KE',
  },
  knowsLanguage: [
    {
      '@type': 'Language',
      name: 'English',
    },
    {
      '@type': 'Language',
      name: 'Swahili',
    },
  ],
};

/**
 * ORG SCHEMA (JSON-LD)
 * Optional: Represents you as a professional entity
 * Useful for Google Knowledge Panel recognition
 * Reference: https://schema.org/Organization
 */
export const orgSchema: SchemaMicrodata = {
  '@context': 'https://schema.org/',
  '@type': 'Organization',
  name: 'Brian Makhembu',
  url: 'https://brianuche.dev',
  logo: 'https://brianuche.dev/logo.png',
  description: 'Full-Stack Engineering & Technical Strategy',
  sameAs: [
    'https://github.com/makhembu',
    'https://linkedin.com/in/brianmakhembu/',
    'https://twitter.com/brianuche',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Professional Inquiry',
    url: 'https://brianuche.dev#contact',
  },
};

/**
 * BREADCRUMB SCHEMA (JSON-LD)
 * Helps search engines understand page hierarchy
 * Improves navigation in search results
 * Reference: https://schema.org/BreadcrumbList
 */
export const breadcrumbSchema = (
  currentPage: string,
  currentPageName: string
): SchemaMicrodata => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: 'https://brianuche.dev',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: currentPageName,
      item: `https://brianuche.dev${currentPage}`,
    },
  ],
});

/**
 * SKILLS FOR SEO
 * Structured list of professional skills
 * Used for internal linking and project associations
 * Updated when new skills acquired or old skills deprecated
 */
export const skillsList = [
  // Full-Stack Development
  { name: 'React', category: 'frontend' },
  { name: 'Next.js', category: 'frontend' },
  { name: 'TypeScript', category: 'language' },
  { name: 'Node.js', category: 'backend' },
  { name: 'PostgreSQL', category: 'database' },
  { name: 'Supabase', category: 'backend' },
  { name: 'RESTful APIs', category: 'backend' },
  { name: 'GraphQL', category: 'backend' },

  // Infrastructure
  { name: 'Linux Administration', category: 'infrastructure' },
  { name: 'Docker', category: 'infrastructure' },
  { name: 'CI/CD Pipelines', category: 'infrastructure' },
  { name: 'Cloud Deployment', category: 'infrastructure' },

  // UX & Design
  { name: 'UX Strategy', category: 'design' },
  { name: 'Responsive Design', category: 'design' },
  { name: 'User Research', category: 'design' },
  { name: 'Accessibility (A11y)', category: 'design' },

  // Translation & Localization
  { name: 'English-Swahili Translation', category: 'translation' },
  { name: 'Technical Documentation', category: 'translation' },
  { name: 'Software Localization', category: 'translation' },

  // Other
  { name: 'Project Management', category: 'soft-skills' },
  { name: 'Technical Leadership', category: 'soft-skills' },
];

/**
 * SEO CHANGELOG
 * Track when metadata changes occur and why
 * Helps identify stale or outdated content
 * Format: YYYY-MM-DD | section | change | reason
 */
export const seoChangelog = [
  {
    date: '2025-12-22',
    section: 'system',
    change: 'Deprecated AI-generated keywords and SEO scoring',
    reason: 'Deterministic, human-maintained metadata improves search ranking stability',
  },
  {
    date: '2025-12-22',
    section: 'baseSEO',
    change: 'Updated description to mention 7+ years experience',
    reason: 'Content updated to reflect portfolio changes',
  },
];
