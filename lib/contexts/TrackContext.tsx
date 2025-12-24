'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CareerTrack } from '@/types';

export interface TrackContextType {
  activeTrack: CareerTrack;
  setActiveTrack: (track: CareerTrack) => void;
  toggleTrack: () => void;
}

/**
 * TrackContext - React Context for managing active career track
 * Allows users to filter portfolio content by IT or Translation work
 */
export const TrackContext = createContext<TrackContextType | undefined>(undefined);

interface TrackProviderProps {
  children: ReactNode;
}

/**
 * TrackProvider - Manages career track state (IT, Translation, or Both)
 * Allows users to filter portfolio content by their area of interest
 */
export const TrackProvider: React.FC<TrackProviderProps> = ({ children }) => {
  const [activeTrack, setActiveTrack] = useState<CareerTrack>('both');

  const toggleTrack = useCallback(() => {
    setActiveTrack((prev) => {
      if (prev === 'it') return 'translation';
      if (prev === 'translation') return 'it';
      return 'both';
    });
  }, []);

  const value: TrackContextType = { activeTrack, setActiveTrack, toggleTrack };

  return (
    <TrackContext.Provider value={value}>
      {children}
    </TrackContext.Provider>
  );
};
