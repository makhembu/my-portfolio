'use client';

import React, { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
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
 * LanguageContext - React Context for managing app language
 * Provides bilingual support (English/Swahili)
 */
export const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  t: (k) => k
});

/**
 * ThemeContextType - Global theme context
 */
export interface ThemeContextType {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  toggleTheme: (e?: React.MouseEvent) => void;
}

/**
 * ThemeContext - React Context for managing theme
 */
export const ThemeContext = createContext<ThemeContextType>({
  darkMode: false,
  setDarkMode: () => {},
  toggleTheme: () => {},
});

/**
 * ResumeModalContextType - Global resume modal state
 */
export interface ResumeModalContextType {
  isResumeOpen: boolean;
  setIsResumeOpen: (value: boolean) => void;
}

/**
 * ResumeModalContext - React Context for managing resume modal visibility
 */
export const ResumeModalContext = createContext<ResumeModalContextType>({
  isResumeOpen: false,
  setIsResumeOpen: () => {},
});

interface AppContextProviderProps {
  children: ReactNode;
}

/**
 * AppContextProvider - Provides language, theme, and resume modal context to the entire app
 * Handles localStorage persistence and SSR safety
 */
export const AppContextProvider: React.FC<AppContextProviderProps> = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [lang, setLang] = useState<Language>('en');
  const [isResumeOpen, setIsResumeOpen] = useState(false);
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
   * Simple state toggle without animations
   */
  const toggleTheme = useCallback((e?: React.MouseEvent) => {
    setDarkMode(!darkMode);
  }, [darkMode]);

  /**
   * Translation helper - returns translated string or fallback
   * @param key - Translation key from portfolioData.uiTranslations
   * @returns Translated string or key if not found
   */
  const t = (key: string): string => {
    return portfolioData.uiTranslations[lang][key] || portfolioData.uiTranslations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      <ThemeContext.Provider value={{ darkMode, setDarkMode, toggleTheme }}>
        <ResumeModalContext.Provider value={{ isResumeOpen, setIsResumeOpen }}>
          {children}
        </ResumeModalContext.Provider>
      </ThemeContext.Provider>
    </LanguageContext.Provider>
  );
};

/**
 * Hook to use language context
 */
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within AppContextProvider');
  }
  return context;
};

/**
 * Hook to use theme context
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within AppContextProvider');
  }
  return context;
};

/**
 * Hook to use resume modal context
 */
export const useResumeModal = () => {
  const context = useContext(ResumeModalContext);
  if (!context) {
    throw new Error('useResumeModal must be used within AppContextProvider');
  }
  return context;
};
