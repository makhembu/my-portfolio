/**
 * Browser API utilities for SSR-safe access
 * These utilities prevent runtime errors in Next.js by checking if code is running in the browser
 */

export const isBrowser = (): boolean => {
  return typeof window !== 'undefined';
};

export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (!isBrowser()) return null;
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn(`Failed to read from localStorage (key: ${key}):`, error);
      return null;
    }
  },

  setItem: (key: string, value: string): void => {
    if (!isBrowser()) return;
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.warn(`Failed to write to localStorage (key: ${key}):`, error);
    }
  },

  removeItem: (key: string): void => {
    if (!isBrowser()) return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn(`Failed to remove from localStorage (key: ${key}):`, error);
    }
  },
};

export const safeDocument = {
  setTitle: (title: string): void => {
    if (!isBrowser()) return;
    try {
      document.title = title;
    } catch (error) {
      console.warn('Failed to set document title:', error);
    }
  },

  getTitle: (): string => {
    if (!isBrowser()) return '';
    try {
      return document.title;
    } catch (error) {
      console.warn('Failed to get document title:', error);
      return '';
    }
  },

  getElement: (selector: string): Element | null => {
    if (!isBrowser()) return null;
    try {
      if (selector === 'html') {
        return document.documentElement;
      }
      return document.querySelector(selector);
    } catch (error) {
      console.warn(`Failed to get element with selector "${selector}":`, error);
      return null;
    }
  },

  addClass: (className: string): void => {
    if (!isBrowser()) return;
    try {
      document.documentElement.classList.add(className);
    } catch (error) {
      console.warn('Failed to add class to document:', error);
    }
  },

  removeClass: (className: string): void => {
    if (!isBrowser()) return;
    try {
      document.documentElement.classList.remove(className);
    } catch (error) {
      console.warn('Failed to remove class from document:', error);
    }
  },
};
