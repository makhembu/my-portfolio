'use client';

import React, { useState } from 'react';
import { X, Lock } from 'lucide-react';

interface PINModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  correctPin: string;
}

export const PINModal: React.FC<PINModalProps> = ({ isOpen, onClose, onSuccess, correctPin }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate a small delay for UX
    await new Promise(resolve => setTimeout(resolve, 300));

    if (pin === correctPin) {
      onSuccess();
      setPin('');
    } else {
      setError('Incorrect PIN. Please try again.');
      setPin('');
    }
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm" 
        onClick={onClose}
      ></div>
      
      <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl animate-in zoom-in duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
              <Lock size={20} />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm dark:text-white">Recruiter Access</h3>
              <p className="text-[10px] uppercase font-black tracking-widest text-indigo-600">PIN Required</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
          >
            <X size={20} className="dark:text-white" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 mb-3">
              Enter PIN
            </label>
            <input
              type="password"
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                if (error) setError('');
              }}
              placeholder="••••••"
              maxLength={6}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 dark:text-white text-lg tracking-widest text-center font-bold focus:outline-none focus:border-indigo-600 transition-colors"
              autoFocus
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-500/20 rounded-xl">
              <p className="text-sm text-red-700 dark:text-red-300 font-medium">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || pin.length === 0}
            className="w-full px-6 py-3 rounded-xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg active:scale-95"
          >
            {isLoading ? 'Verifying...' : 'Unlock'}
          </button>

          <p className="text-[10px] text-slate-500 dark:text-slate-400 text-center">
            This section contains premium resume optimization tools for recruiters.
          </p>
        </form>
      </div>
    </div>
  );
};
