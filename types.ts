
import React from 'react';

export type CareerTrack = 'it' | 'translation' | 'both';

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  metrics?: {
    [key: string]: string | number;
  };
  tags: string[];
  link?: string;
  githubUrl?: string;
  category: 'code' | 'translation' | 'infra' | 'both';
  imageUrl: string;
  track: CareerTrack; // NEW: which track(s) this project belongs to
}

export interface Service {
  title: string;
  description: string;
  icon: string;
  track: CareerTrack; // NEW: which track(s) this service belongs to
}

export interface SkillItem {
  name: string;
  level: number;
}

export interface ProfileVariant {
  role: string;
  tagline: string;
  summary: string;
}

export interface PortfolioData {
  profile: {
    firstName: string;
    lastName: string;
    location: string;
    education: string;
    availability: string;
    variants: {
      it: ProfileVariant;
      translation: ProfileVariant;
    };
  };
  socials: {
    github: string;
    linkedin: string;
    email: string;
  };
  projects: Project[];
  services: Service[];
  skills: {
    it: {
      frontend: string[];
      backend: string[];
      infrastructure: string[];
    };
    translation: {
      technical: string[];
      languages: string[];
      specializations: string[];
    };
  };
  languages: SkillItem[];
}
