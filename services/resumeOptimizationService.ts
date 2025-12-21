/**
 * Resume Optimization Service
 * Uses Gemini AI to tailor resume content based on job descriptions
 * Analyzes job requirements and matches them with candidate experience
 * Now supports filtering by career track (IT vs Translation)
 */

import { portfolioData } from '@/portfolioData';
import { CareerTrack } from '@/types';

export interface OptimizedResume {
  summary: string;
  experience: Array<{
    id: string;
    role: string;
    company: string;
    period: string;
    description: string[];
    skills: string[];
    relevanceScore: number;
  }>;
  skills: {
    frontend: string[];
    backend: string[];
    infrastructure: string[];
  };
  relevantProjects: string[];
  keywordMatches: string[];
  matchScore: number;
  track: CareerTrack;
}

export async function optimizeResumeForJob(
  jobDescription: string,
  track: CareerTrack = 'both'
): Promise<OptimizedResume> {
  try {
    // Filter experience by track AND recency (last 5 years only)
    let filteredExperience = track === 'both' 
      ? portfolioData.experience 
      : portfolioData.experience.filter(exp => exp.track === track || exp.track === 'both');
    
    // Apply 5-year recency filter (same as normal PDF)
    const now = new Date();
    const fiveYearsAgo = new Date(now.getFullYear() - 5, now.getMonth(), now.getDate());
    
    filteredExperience = filteredExperience.filter(exp => {
      // Keep "Present" jobs always
      if (exp.period.includes('Present')) return true;
      
      // Parse start date (e.g., "Jan 2017 - Dec 2021" -> "Jan 2017")
      const parts = exp.period.split(' - ');
      if (parts.length === 2) {
        const startDateStr = parts[0].trim();
        const [month, year] = startDateStr.split(' ');
        const monthMap: { [key: string]: number } = {
          'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
          'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
        };
        const startDate = new Date(parseInt(year), monthMap[month], 1);
        return startDate >= fiveYearsAgo;
      }
      return true; // Keep if can't parse
    });
    
    const filteredProjects = track === 'both'
      ? portfolioData.projects
      : portfolioData.projects.filter(proj => proj.track === track || proj.track === 'both');

    const response = await fetch('/api/resume/optimize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jobDescription,
        candidateData: {
          profile: portfolioData.profile,
          experience: filteredExperience,
          skills: track === 'it' ? portfolioData.skills.it : track === 'translation' ? portfolioData.skills.translation : portfolioData.skills.it,
          projects: filteredProjects,
        },
        track,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to optimize resume');
    }

    const optimized = await response.json();
    return { ...optimized, track };
  } catch (error) {
    console.error('Resume optimization error:', error);
    throw error;
  }
}

/**
 * Extract keywords from job description for highlighting
 */
export function extractJobKeywords(jobDescription: string): string[] {
  const commonKeywords = [
    // Technical skills
    'typescript', 'javascript', 'react', 'next.js', 'node.js', 'python', 'sql', 'postgres',
    'mongodb', 'aws', 'gcp', 'docker', 'kubernetes', 'rest', 'graphql', 'api',
    'html', 'css', 'tailwind', 'figma', 'ui', 'ux', 'design',
    
    // Soft skills
    'communication', 'leadership', 'teamwork', 'problem solving', 'project management',
    'agile', 'scrum', 'jira', 'git', 'github',
    
    // Domain
    'saas', 'ecommerce', 'fintech', 'healthcare', 'education', 'mobile',
    'full-stack', 'frontend', 'backend', 'devops', 'infrastructure',
  ];

  const lowerDescription = jobDescription.toLowerCase();
  return commonKeywords.filter(keyword => lowerDescription.includes(keyword));
}

/**
 * Calculate resume match score (0-100)
 */
export function calculateMatchScore(jobDescription: string, keywords: string[]): number {
  const lowerJob = jobDescription.toLowerCase();
  const matches = keywords.length;
  
  // Additional scoring factors
  let score = (matches / 20) * 100; // Base score from keyword matches
  
  // Bonus for specific requirement matches
  if (lowerJob.includes('7+') || lowerJob.includes('8+') || lowerJob.includes('6+')) {
    const yearsRequired = parseInt(jobDescription.match(/(\d+)\+/)?.[1] || '0');
    if (yearsRequired <= 7) score += 15;
  }
  
  if (lowerJob.includes('typescript') && lowerJob.includes('react') && lowerJob.includes('node')) {
    score += 20; // Perfect tech stack match
  }

  return Math.min(100, Math.round(score));
}
