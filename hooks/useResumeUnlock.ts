'use client';

import { useContext } from 'react';
import { ResumeContext, type ResumeContextType } from '@/lib/contexts';

/**
 * Hook to access resume unlock context
 * Provides resume lock/unlock state and PIN modal visibility
 */
export const useResumeUnlock = (): ResumeContextType => {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResumeUnlock must be used within ResumeProvider');
  }
  return context;
};
