'use client';

import React, { useState, useEffect, useCallback, createContext, ReactNode } from 'react';
import { portfolioData } from '@/portfolioData';
import { safeLocalStorage, safeDocument } from '@/lib/browserUtils';

type Language = 'en' | 'sw';

/**
 * LanguageContextType - Global language and translation context
 * Provides language state and translation helper throughout app
 */
export interface LanguageContextType {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: string) => string;
}

/**
 * ThemeContextType - Global theme context
 */
export interface ThemeContextType {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  toggleTheme: (e?: React.MouseEvent) => void;
}

/**
 * ResumeModalContextType - Global resume modal state
 */
export interface ResumeModalContextType {
  isResumeOpen: boolean;
  setIsResumeOpen: (value: boolean) => void;
}

/**
 * AIHubModalContextType - Global AI Hub modal state
 */
export interface AIHubModalContextType {
  isAIHubOpen: boolean;
  setIsAIHubOpen: (value: boolean) => void;
}

/**
 * LanguageContext - React Context for managing app language
 * Provides bilingual support (English/Swahili)
 */
export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

/**
 * ThemeContext - React Context for managing theme
 */
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * ResumeModalContext - React Context for managing resume modal visibility
 */
export const ResumeModalContext = createContext<ResumeModalContextType | undefined>(undefined);

/**
 * AIHubModalContext - React Context for managing AI Hub modal visibility
 */
export const AIHubModalContext = createContext<AIHubModalContextType | undefined>(undefined);

interface AppContextProviderProps {
  children: ReactNode;
}

/**
 * AppContextProvider - Provides language, theme, and resume modal context to the entire app
 * Handles localStorage persistence and SSR safety
 *
 * ARCHITECTURE:
 * - Split into 4 logical concerns: language, theme, resume modal, AI hub modal
 * - Each context has its own hook for consumption (see useAppContext.ts)
 * - Hydration state ensures SSR safety
 * - localStorage persistence handles client preferences
 */
export const AppContextProvider: React.FC<AppContextProviderProps> = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [lang, setLang] = useState<Language>('en');
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isAIHubOpen, setIsAIHubOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate state from localStorage on client mount
  useEffect(() => {
    const savedTheme = safeLocalStorage.getItem('theme');
    const savedLang = safeLocalStorage.getItem('lang') as Language | null;

    // Default to light mode, respect saved preference
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
    } else {
      setDarkMode(false); // Light mode is default
    }

    if (savedLang && (savedLang === 'en' || savedLang === 'sw')) {
      setLang(savedLang);
    }

    setIsHydrated(true);
  }, []);

  // Persist theme to localStorage and update DOM
  useEffect(() => {
    if (!isHydrated) return;

    const root = safeDocument.getElement('html');
    if (!root) return;

    if (darkMode) {
      root.classList.add('dark');
      safeLocalStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      safeLocalStorage.setItem('theme', 'light');
    }
  }, [darkMode, isHydrated]);

  // Persist language to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    safeLocalStorage.setItem('lang', lang);
  }, [lang, isHydrated]);

  /**
   * Toggle between dark and light theme
   */
  const toggleTheme = useCallback((e?: React.MouseEvent) => {
    setDarkMode((prev) => !prev);
  }, []);

  /**
   * Translation helper - returns translated string or fallback
   * @param key - Translation key from portfolioData.uiTranslations
   * @returns Translated string or key if not found
   */
  const t = (key: string): string => {
    return (
      portfolioData.uiTranslations[lang][key] ||
      portfolioData.uiTranslations['en'][key] ||
      key
    );
  };

  const languageValue: LanguageContextType = { lang, setLang, t };
  const themeValue: ThemeContextType = { darkMode, setDarkMode, toggleTheme };
  const resumeModalValue: ResumeModalContextType = { isResumeOpen, setIsResumeOpen };
  const aiHubModalValue: AIHubModalContextType = { isAIHubOpen, setIsAIHubOpen };

  return (
    <LanguageContext.Provider value={languageValue}>
      <ThemeContext.Provider value={themeValue}>
        <ResumeModalContext.Provider value={resumeModalValue}>
          <AIHubModalContext.Provider value={aiHubModalValue}>
            {children}
          </AIHubModalContext.Provider>
        </ResumeModalContext.Provider>
      </ThemeContext.Provider>
    </LanguageContext.Provider>
  );
};
