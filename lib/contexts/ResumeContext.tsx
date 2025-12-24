'use client';

import React, { createContext, useState, ReactNode } from 'react';

export interface ResumeContextType {
  isResumeUnlocked: boolean;
  setIsResumeUnlocked: (value: boolean) => void;
  showPINModal: boolean;
  setShowPINModal: (value: boolean) => void;
}

/**
 * ResumeContext - React Context for managing resume unlock state
 * Tracks whether resume content is visible and PIN modal visibility
 */
export const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

interface ResumeProviderProps {
  children: ReactNode;
}

/**
 * ResumeProvider - Manages resume unlock state and PIN modal visibility
 * Enables conditional rendering of premium resume content
 */
export const ResumeProvider: React.FC<ResumeProviderProps> = ({ children }) => {
  const [isResumeUnlocked, setIsResumeUnlocked] = useState(false);
  const [showPINModal, setShowPINModal] = useState(false);

  const value: ResumeContextType = {
    isResumeUnlocked,
    setIsResumeUnlocked,
    showPINModal,
    setShowPINModal,
  };

  return (
    <ResumeContext.Provider value={value}>
      {children}
    </ResumeContext.Provider>
  );
};
