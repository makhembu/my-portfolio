/**
 * PROJECT SCHEMA GENERATION (JSON-LD)
 * ===================================
 * Generates SoftwareSourceCode and CreativeWork schemas for projects
 * Helps Google understand project structure, tech stack, and outcomes
 * 
 * References:
 * - https://schema.org/SoftwareSourceCode
 * - https://schema.org/CreativeWork
 * - https://developers.google.com/search/docs/appearance/structured-data/software-app
 */

import { portfolioData } from '@/portfolioData';
import type { Project } from '@/types';

export interface ProjectSchemaOptions {
  name: string;
  description: string;
  codeRepository?: string;
  url?: string;
  downloadUrl?: string;
  author?: string;
  datePublished?: string;
  dateModified?: string;
  image?: string;
  keywords?: string[];
  programmingLanguage?: string[];
  applicationCategory?: string;
  operatingSystem?: string[];
}

/**
 * Generate SoftwareSourceCode schema for a project
 * Used for projects with public GitHub repos
 * Reference: https://schema.org/SoftwareSourceCode
 */
export const generateSoftwareSourceCodeSchema = (
  project: ProjectSchemaOptions
) => ({
  '@context': 'https://schema.org',
  '@type': 'SoftwareSourceCode',
  name: project.name,
  description: project.description,
  url: project.url || project.codeRepository,
  codeRepository: project.codeRepository,
  author: {
    '@type': 'Person',
    name: project.author || 'Brian Makhembu',
    url: 'https://brianuche.dev',
  },
  datePublished: project.datePublished,
  dateModified: project.dateModified,
  image: project.image,
  keywords: project.keywords || [],
  programmingLanguage: project.programmingLanguage || [],
  applicationCategory: project.applicationCategory,
  operatingSystem: project.operatingSystem || ['All'],
});

/**
 * Generate CreativeWork schema for a project
 * Used for projects with live demos and case studies
 * Reference: https://schema.org/CreativeWork
 */
export const generateCreativeWorkSchema = (
  project: ProjectSchemaOptions
) => ({
  '@context': 'https://schema.org',
  '@type': 'CreativeWork',
  name: project.name,
  description: project.description,
  url: project.url,
  image: project.image,
  author: {
    '@type': 'Person',
    name: project.author || 'Brian Makhembu',
    url: 'https://brianuche.dev',
  },
  datePublished: project.datePublished,
  dateModified: project.dateModified,
  keywords: project.keywords || [],
  about: {
    '@type': 'Thing',
    name: 'Software Engineering',
  },
});

/**
 * Generate WebApplication schema for live projects
 * Used for projects with interactive functionality
 * Reference: https://schema.org/WebApplication
 */
export const generateWebApplicationSchema = (
  project: ProjectSchemaOptions
) => ({
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: project.name,
  description: project.description,
  url: project.url,
  image: project.image,
  author: {
    '@type': 'Person',
    name: project.author || 'Brian Makhembu',
    url: 'https://brianuche.dev',
  },
  datePublished: project.datePublished,
  dateModified: project.dateModified,
  applicationCategory: project.applicationCategory || 'ProductivityApplication',
  operatingSystem: project.operatingSystem || ['Any'],
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
});

/**
 * PREDEFINED PROJECT SCHEMAS
 * These are static, human-maintained schemas for each project
 * Update when project details change (tech stack, description, URLs)
 */
export const projectSchemas: Record<string, ProjectSchemaOptions> = {
  resumeOptimizer: {
    name: 'Resume Optimizer & ATS Analyzer',
    description:
      'AI-powered resume optimization tool that analyzes job descriptions and tailors resumes for maximum ATS compatibility and recruiter impact. Features real-time matching scores and actionable improvement suggestions.',
    codeRepository: 'https://github.com/makhembu/resume-optimizer',
    url: 'https://brianuche.dev#projects',
    datePublished: '2024-06-15',
    dateModified: '2025-12-22',
    image: 'https://brianuche.dev/projects/resume-optimizer.jpg',
    keywords: [
      'ATS Optimization',
      'Resume Builder',
      'Job Matching',
      'AI',
      'Career',
    ],
    programmingLanguage: ['TypeScript', 'React', 'Node.js'],
    applicationCategory: 'ProductivityApplication',
    operatingSystem: ['Web'],
  },

  aihub: {
    name: 'AI Hub - Multi-Tool Integration Platform',
    description:
      'Unified interface integrating Gemini AI, document processing, and productivity tools. Features include PDF generation, trend analysis, and SEO optimization with real-time API integration.',
    url: 'https://brianuche.dev#aihub',
    datePublished: '2024-08-01',
    dateModified: '2025-12-22',
    image: 'https://brianuche.dev/projects/ai-hub.jpg',
    keywords: [
      'AI Integration',
      'API',
      'Productivity',
      'Document Processing',
      'Gemini',
    ],
    programmingLanguage: ['TypeScript', 'React', 'Next.js', 'Node.js'],
    applicationCategory: 'ProductivityApplication',
    operatingSystem: ['Web'],
  },

  portfolio: {
    name: 'Professional Portfolio Website',
    description:
      'Full-stack Next.js portfolio featuring dynamic project showcase, multilingual support (English/Swahili), dark mode, and production-grade SEO optimization. Includes resume builder and AI-powered job matching.',
    codeRepository: 'https://github.com/makhembu/portfolio',
    url: 'https://brianuche.dev',
    datePublished: '2024-01-20',
    dateModified: '2025-12-22',
    image: 'https://brianuche.dev/og-image.jpg',
    keywords: [
      'Portfolio',
      'Next.js',
      'Full-Stack',
      'TypeScript',
      'SEO',
      'Multilingual',
    ],
    programmingLanguage: ['TypeScript', 'React', 'Next.js', 'CSS'],
    applicationCategory: 'WebApplication',
    operatingSystem: ['Web'],
  },

  analyticsApp: {
    name: 'Analytics Dashboard Application',
    description:
      'Real-time analytics platform for tracking user behavior, engagement metrics, and performance KPIs. Built with Next.js, Supabase, and PostgreSQL for scalable data handling.',
    datePublished: '2024-03-10',
    dateModified: '2025-12-22',
    image: 'https://brianuche.dev/projects/analytics.jpg',
    keywords: [
      'Analytics',
      'Dashboard',
      'Data Visualization',
      'Real-time',
      'Metrics',
    ],
    programmingLanguage: ['TypeScript', 'React', 'Node.js', 'PostgreSQL'],
    applicationCategory: 'DataAnalyticsApplication',
    operatingSystem: ['Web'],
  },

  localizationTool: {
    name: 'Technical Localization Platform',
    description:
      'Professional English-Swahili localization platform for software applications. Streamlines translation workflows for technical documentation, UI strings, and multilingual content management.',
    datePublished: '2024-05-20',
    dateModified: '2025-12-22',
    image: 'https://brianuche.dev/projects/localization.jpg',
    keywords: [
      'Localization',
      'Translation',
      'Swahili',
      'i18n',
      'Language',
      'Content Management',
    ],
    programmingLanguage: ['TypeScript', 'React', 'Node.js'],
    applicationCategory: 'ContentManagementSystem',
    operatingSystem: ['Web'],
  },
};

/**
 * Generate complete schema markup for a project
 * Automatically selects appropriate schema type based on project characteristics
 */
export const generateProjectSchema = (
  projectKey: string,
  includeSourceCode: boolean = true,
  includeWebApp: boolean = false
) => {
  const project = projectSchemas[projectKey];
  if (!project) return null;

  const schemas = [];

  if (includeSourceCode && project.codeRepository) {
    schemas.push(generateSoftwareSourceCodeSchema(project));
  }

  if (includeWebApp && project.url) {
    schemas.push(generateWebApplicationSchema(project));
  }

  // Always include CreativeWork as fallback
  if (schemas.length === 0) {
    schemas.push(generateCreativeWorkSchema(project));
  }

  return schemas.length === 1 ? schemas[0] : schemas;
};

/**
 * Generate structured data for ALL projects
 * Useful for sitemap and schema.org integration
 */
export const generateAllProjectSchemas = () => {
  return Object.keys(projectSchemas).map((key) =>
    generateProjectSchema(key, true, key === 'portfolio' || key === 'aihub')
  );
};
