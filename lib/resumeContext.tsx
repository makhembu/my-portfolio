'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ResumeContextType {
  isResumeUnlocked: boolean;
  setIsResumeUnlocked: (value: boolean) => void;
  showPINModal: boolean;
  setShowPINModal: (value: boolean) => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const ResumeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isResumeUnlocked, setIsResumeUnlocked] = useState(false);
  const [showPINModal, setShowPINModal] = useState(false);

  return (
    <ResumeContext.Provider value={{ isResumeUnlocked, setIsResumeUnlocked, showPINModal, setShowPINModal }}>
      {children}
    </ResumeContext.Provider>
  );
};

export const useResumeUnlock = () => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResumeUnlock must be used within ResumeProvider');
  }
  return context;
};
