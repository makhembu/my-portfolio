'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { CareerTrack } from '@/types';

interface TrackContextType {
  activeTrack: CareerTrack;
  setActiveTrack: (track: CareerTrack) => void;
  toggleTrack: () => void;
}

const TrackContext = createContext<TrackContextType | undefined>(undefined);

export const TrackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTrack, setActiveTrack] = useState<CareerTrack>('both');

  const toggleTrack = useCallback(() => {
    setActiveTrack((prev) => {
      if (prev === 'it') return 'translation';
      if (prev === 'translation') return 'it';
      return 'both';
    });
  }, []);

  return (
    <TrackContext.Provider value={{ activeTrack, setActiveTrack, toggleTrack }}>
      {children}
    </TrackContext.Provider>
  );
};

export const useTrack = (): TrackContextType => {
  const context = useContext(TrackContext);
  if (!context) {
    throw new Error('useTrack must be used within a TrackProvider');
  }
  return context;
};
