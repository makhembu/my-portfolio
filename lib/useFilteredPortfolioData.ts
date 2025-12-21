import { portfolioData, Experience } from '@/portfolioData';
import { Project, CareerTrack } from '@/types';
import { useTrack } from './useTrackContext';

/**
 * Hook to get filtered portfolio data based on active career track
 * - 'it': Only IT/development work
 * - 'translation': Only translation/linguistics work
 * - 'both': All work items
 */
export const useFilteredPortfolioData = () => {
  const { activeTrack } = useTrack();

  const getFilteredExperience = (): Experience[] => {
    if (activeTrack === 'both') return portfolioData.experience;
    return portfolioData.experience.filter((exp) => 
      exp.track === activeTrack || exp.track === 'both'
    );
  };

  const getFilteredProjects = (): Project[] => {
    if (activeTrack === 'both') return portfolioData.projects;
    return portfolioData.projects.filter((proj) =>
      proj.track === activeTrack || proj.track === 'both'
    );
  };

  const getFilteredServices = () => {
    if (activeTrack === 'both') return portfolioData.services;
    return portfolioData.services.filter((service) =>
      service.track === activeTrack || service.track === 'both'
    );
  };

  const getProfileVariant = () => {
    if (activeTrack === 'both') {
      // Return a merged version
      return {
        role: portfolioData.profile.variants.it.role,
        tagline: portfolioData.profile.variants.it.tagline,
        summary: portfolioData.profile.variants.it.summary,
      };
    }
    return portfolioData.profile.variants[activeTrack];
  };

  const getFilteredSkills = () => {
    if (activeTrack === 'it') {
      return portfolioData.skills.it;
    }
    if (activeTrack === 'translation') {
      return portfolioData.skills.translation;
    }
    // For 'both', return a combined version - focus on IT skills but note translation
    return {
      ...portfolioData.skills.it,
      languages: portfolioData.skills.translation.languages,
    };
  };

  return {
    experience: getFilteredExperience(),
    projects: getFilteredProjects(),
    services: getFilteredServices(),
    profileVariant: getProfileVariant(),
    skills: getFilteredSkills(),
    activeTrack,
  };
};
