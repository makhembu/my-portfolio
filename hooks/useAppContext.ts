'use client';

import { useContext } from 'react';
import {
  LanguageContext,
  ThemeContext,
  ResumeModalContext,
  AIHubModalContext,
  type LanguageContextType,
  type ThemeContextType,
  type ResumeModalContextType,
  type AIHubModalContextType,
} from '@/lib/contexts';

/**
 * Hook to access language context
 * Provides translation function and language switching
 */
export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within AppContextProvider');
  }
  return context;
};

/**
 * Hook to access theme context
 * Provides dark mode toggle and state
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within AppContextProvider');
  }
  return context;
};

/**
 * Hook to access resume modal context
 * Controls visibility of resume modal
 */
export const useResumeModal = (): ResumeModalContextType => {
  const context = useContext(ResumeModalContext);
  if (!context) {
    throw new Error('useResumeModal must be used within AppContextProvider');
  }
  return context;
};

/**
 * Hook to access AI Hub modal context
 * Controls visibility of AI Hub modal
 */
export const useAIHubModal = (): AIHubModalContextType => {
  const context = useContext(AIHubModalContext);
  if (!context) {
    throw new Error('useAIHubModal must be used within AppContextProvider');
  }
  return context;
};
