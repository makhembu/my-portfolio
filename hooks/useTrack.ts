'use client';

import { useContext } from 'react';
import { TrackContext, type TrackContextType } from '@/lib/contexts';

/**
 * Hook to access career track context
 * Provides active track and toggle functionality
 */
export const useTrack = (): TrackContextType => {
  const context = useContext(TrackContext);
  if (!context) {
    throw new Error('useTrack must be used within TrackProvider');
  }
  return context;
};
