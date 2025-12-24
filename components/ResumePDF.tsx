'use client';

import React from 'react';
import { portfolioData } from '@/portfolioData';

interface ResumePDFProps {
  profile?: {
    firstName: string;
    lastName: string;
    role: string;
    bio?: string;
    location?: string;
    email?: string;
    education?: string;
    availability?: string;
  };
  experience?: Array<{
    id: string;
    company: string;
    role: string;
    period: string;
    description: string[];
    skills: string[];
  }>;
  skills?: {
    frontend: string[];
    backend: string[];
    infrastructure: string[];
  };
  languages?: Array<{
    name: string;
    level: number;
  }>;
}

export const ResumePDF: React.FC<ResumePDFProps> = ({
  profile: customProfile,
  experience: customExperience,
  skills: customSkills,
  languages: customLanguages
}) => {
  // Use custom data if provided, otherwise use portfolio data
  const { profile: defaultProfile, socials, experience: defaultExperience, skills: defaultSkillsData, languages: defaultLanguages } = portfolioData;
  
  // For default profile, use IT variant to get the role and summary
  const profileData = customProfile || {
    firstName: defaultProfile.firstName,
    lastName: defaultProfile.lastName,
    role: defaultProfile.variants.it.role,
    location: defaultProfile.location,
    email: defaultProfile.variants.it.tagline,
    bio: defaultProfile.variants.it.summary,
  };
  
  const profile = profileData as any;
  const experience = customExperience || defaultExperience;
  // Use IT skills as default (flatten the structure)
  const skills = (customSkills || (defaultSkillsData.it as any)) as {
    frontend: string[];
    backend: string[];
    infrastructure: string[];
  };
  const languages = customLanguages || defaultLanguages;

  return (
    <div 
      id="resume-document" 
      className="bg-white text-slate-900 w-full max-w-[8.5in] mx-auto print:shadow-none print:m-0" 
      style={{ 
        width: '8.5in',
        height: '11in',
        fontFamily: 'Arial, sans-serif',
        fontSize: '11px',
        lineHeight: '1.4',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <header style={{ padding: '0.5in 0.75in', borderBottom: '2px solid #4f46e5', flexShrink: 0 }}>
        <div style={{ marginBottom: '2px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0', letterSpacing: '-0.5px' }}>
            {profile.firstName} <span style={{ color: '#4f46e5' }}>{profile.lastName}</span>
          </h1>
        </div>
        <p style={{ fontSize: '9px', fontWeight: 'bold', color: '#4f46e5', textTransform: 'uppercase', margin: '0 0 3px 0', letterSpacing: '0.5px' }}>
          {profile.role}
        </p>
        <div style={{ display: 'flex', gap: '8px', fontSize: '8px', color: '#333', flexWrap: 'wrap' }}>
          <span>{customProfile?.email || socials.email}</span>
          <span>•</span>
          <span>{profile.location || 'Remote'}</span>
          <span>•</span>
          <span>brianuche.dev</span>
        </div>
      </header>

      {/* Main Content */}
      <div style={{ padding: '0.35in 0.75in', flex: '1', display: 'flex', flexDirection: 'column', minHeight: 'auto', gap: '0.12in', overflow: 'visible' }}>
        {/* Summary */}
        <section style={{ marginBottom: '0.1in', minHeight: 'auto', overflow: 'visible' }}>
          <h2 style={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', margin: '0 0 3px 0', color: '#000', letterSpacing: '0.5px' }}>
            Professional Summary
          </h2>
          <p style={{ fontSize: '8px', margin: '0', lineHeight: '1.35', color: '#333', whiteSpace: 'normal', wordWrap: 'break-word', overflow: 'visible' }}>
            {profile.bio}
          </p>
        </section>

        {/* Experience */}
        <section style={{ marginBottom: '3px', minHeight: 'auto', overflow: 'visible' }}>
          <h2 style={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', margin: '0 0 4px 0', color: '#000', letterSpacing: '0.5px' }}>
            Professional Experience
          </h2>
          <div>
            {experience.map((exp, idx) => (
              <div key={exp.id} style={{ marginBottom: '4px', paddingBottom: '2px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1px', gap: '8px' }}>
                  <h3 style={{ fontSize: '9px', fontWeight: 'bold', margin: '0', color: '#000' }}>
                    {exp.role}
                  </h3>
                  <span style={{ fontSize: '7px', color: '#666', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                    {exp.period}
                  </span>
                </div>
                <p style={{ fontSize: '8px', fontWeight: 'bold', color: '#4f46e5', margin: '0 0 2px 0' }}>
                  {exp.company}
                </p>
                <ul style={{ margin: '0 0 0 12px', paddingLeft: '0', fontSize: '8px' }}>
                  {exp.description.slice(0, 2).map((point, i) => (
                    <li key={i} style={{ margin: '0.5px 0', color: '#333', lineHeight: '1.3' }}>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section style={{ marginBottom: '0', minHeight: 'auto', overflow: 'visible' }}>
          <h2 style={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', margin: '0 0 3px 0', color: '#000', letterSpacing: '0.5px' }}>
            Skills
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', fontSize: '8px' }}>
            <div>
              <p style={{ fontSize: '7px', fontWeight: 'bold', color: '#4f46e5', margin: '0 0 1px 0', textTransform: 'uppercase' }}>
                Frontend
              </p>
              <div style={{ color: '#333', lineHeight: '1.4' }}>
                {skills.frontend.join(', ')}
              </div>
            </div>
            <div>
              <p style={{ fontSize: '7px', fontWeight: 'bold', color: '#4f46e5', margin: '0 0 1px 0', textTransform: 'uppercase' }}>
                Backend
              </p>
              <div style={{ color: '#333', lineHeight: '1.4' }}>
                {skills.backend.join(', ')}
              </div>
            </div>
            <div>
              <p style={{ fontSize: '7px', fontWeight: 'bold', color: '#4f46e5', margin: '0 0 1px 0', textTransform: 'uppercase' }}>
                Infrastructure
              </p>
              <div style={{ color: '#333', lineHeight: '1.4' }}>
                {skills.infrastructure.join(', ')}
              </div>
            </div>
          </div>
        </section>

        {/* Education & Languages */}
        <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '0', minHeight: 'auto', overflow: 'visible' }}>
          <div>
            <h2 style={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', margin: '0 0 2px 0', color: '#000', letterSpacing: '0.5px' }}>
              Education
            </h2>
            <p style={{ fontSize: '8px', fontWeight: 'bold', margin: '0 0 1px 0', color: '#000' }}>
              {(profile as any).education}
            </p>
            <p style={{ fontSize: '8px', margin: '0', color: '#666' }}>
              Jomo Kenyatta University of Agriculture and Technology (JKUAT) | 2014-2018
            </p>
          </div>
          <div>
            <h2 style={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', margin: '0 0 2px 0', color: '#000', letterSpacing: '0.5px' }}>
              Languages
            </h2>
            {languages.map(l => (
              <div key={l.name} style={{ fontSize: '8px', color: '#333' }}>
                <span style={{ fontWeight: 'bold' }}>{l.name}</span> ({l.level === 100 ? 'Native' : 'Professional'})
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer style={{ padding: '0.15in 0.75in', textAlign: 'center', fontSize: '7px', color: '#666', borderTop: '1px solid #ddd', marginTop: 'auto', flexShrink: 0 }}>
        {(profile as any).availability}
      </footer>
    </div>
  );
};

