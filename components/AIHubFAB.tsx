'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, Languages, Cpu, User, X } from 'lucide-react';
import { useLanguage, useAIHubModal } from '@/lib/context';
import { translateText, chatWithBrianAI } from '@/services/geminiService';

const MessageContent: React.FC<{ text: string }> = ({ text }) => {
  // Enhanced markdown-style handling for Bold, Newline, and Links [label](url)
  const segments = text.split(/(\*\*.*?\*\*|\[.*?\]\(.*?\)\n|\n|\[.*?\]\(.*?\))/g);
  
  return (
    <div className="space-y-1 break-words overflow-hidden">
      {segments.map((segment, i) => {
        if (!segment) return null;
        if (segment === '\n') return <div key={i} className="h-1" />;
        
        // Bold: **text**
        if (segment.startsWith('**') && segment.endsWith('**')) {
          return (
            <strong key={i} className="font-bold text-slate-900 dark:text-white">
              {segment.slice(2, -2)}
            </strong>
          );
        }
        
        // Link: [label](url)
        const linkMatch = segment.match(/\[(.*?)\]\((.*?)\)/);
        if (linkMatch) {
          const [_, label, url] = linkMatch;
          return (
            <a 
              key={i} 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline transition-all inline-flex items-center gap-1"
            >
              {label}
            </a>
          );
        }
        
        return <span key={i} className="inline">{segment}</span>;
      })}
    </div>
  );
};

export const AIHubFAB: React.FC = () => {
  const { isAIHubOpen, setIsAIHubOpen } = useAIHubModal();
  const { lang, t } = useLanguage();
  const [chatIn, setChatIn] = useState('');
  const [chatLog, setChatLog] = useState<{role: 'u'|'ai', t: string}[]>([{
    role: 'ai', 
    t: "Hujambo! I am Brian's AI representative. You can explore my work on [GitHub](https://github.com/makhembu) or connect on [LinkedIn](https://linkedin.com/in/brianmakhembu/). How can I help?"
  }]);
  const [isChatting, setIsChatting] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [transIn, setTransIn] = useState('');
  const [transOut, setTransOut] = useState('');
  const [isTrans, setIsTrans] = useState(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatLog, isChatting]);

  const onChat = async () => {
    if (!chatIn.trim()) return;
    const m = chatIn; 
    setChatIn('');
    setChatLog(p => [...p, {role:'u', t:m}]);
    setIsChatting(true);
    try {
      const resp = await chatWithBrianAI(m);
      setChatLog(p => [...p, {role:'ai', t:resp}]);
    } catch (error) {
      setChatLog(p => [...p, {role:'ai', t: "Pole! (Sorry), I hit a snag. Please try asking again."}]);
    } finally {
      setIsChatting(false);
    }
  };

  const onTrans = async () => {
    if (!transIn.trim()) return;
    setIsTrans(true);
    try {
      const resp = await translateText(transIn);
      setTransOut(resp);
    } catch (error) {
      setTransOut("Pole! I couldn't translate that right now.");
    } finally {
      setIsTrans(false);
    }
  };

  return (
    <>
      {/* FAB Button - More Subtle */}
      <button
        onClick={() => setIsAIHubOpen(true)}
        className="fixed bottom-8 right-8 z-40 w-12 h-12 rounded-full bg-slate-700 hover:bg-slate-800 text-white shadow-md hover:shadow-lg transition-all flex items-center justify-center group print:hidden"
        aria-label="Open AI Tools"
        title="AI-powered tools (experimental)"
      >
        <Cpu size={20} className="group-hover:scale-105 transition-transform" />
      </button>

      {/* Modal Overlay */}
      {isAIHubOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 print:hidden"
          onClick={() => setIsAIHubOpen(false)}
        >
          {/* Modal Content */}
          <div 
            className="bg-white dark:bg-[#0a0a0b] rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-white/5 bg-white/50 dark:bg-white/[0.02]">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center text-white shadow-lg"><Cpu size={20}/></div>
                <div>
                  <h2 className="font-bold text-lg dark:text-white">AI Tools</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Experimental. For exploring my work, not making decisions.</p>
                </div>
              </div>
              <button
                onClick={() => setIsAIHubOpen(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors"
              >
                <X size={20} className="dark:text-white" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto grid lg:grid-cols-2 gap-6 md:gap-8 p-6 md:p-8">
              {/* Chat */}
              <div className="bg-slate-50 dark:bg-[#0d0e12] border border-slate-200 dark:border-white/5 rounded-2xl flex flex-col overflow-hidden shadow-lg h-[400px]">
                <div className="p-4 md:p-6 border-b border-slate-200 dark:border-white/5 flex items-center gap-4 bg-white/50 dark:bg-white/[0.02]">
                  <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-white shadow-lg shrink-0"><Cpu size={16}/></div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-sm tracking-tight truncate">{t('brianAIAssistant')}</h4>
                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest truncate">Summarizes portfolio</p>
                  </div>
                </div>
                <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 scroll-smooth scrollbar-hide">
                  {chatLog.map((l, i) => (
                    <div key={i} className={`flex ${l.role==='u' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                      <div className={`flex gap-2 max-w-[95%] md:max-w-[85%] ${l.role === 'u' ? 'flex-row-reverse' : 'flex-row'}`}>
                        {l.role === 'ai' && <div className="w-6 h-6 rounded-lg bg-indigo-600/10 flex items-center justify-center text-indigo-600 shrink-0 mt-1"><Cpu size={12}/></div>}
                        <div className={`p-3 rounded-xl text-xs leading-relaxed ${l.role==='u' ? 'bg-indigo-600 text-white shadow-lg rounded-tr-none' : 'bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 rounded-tl-none'}`}>
                          <MessageContent text={l.t} />
                        </div>
                        {l.role === 'u' && <div className="w-6 h-6 rounded-lg bg-slate-200 dark:bg-white/10 flex items-center justify-center text-slate-500 shrink-0 mt-1"><User size={12}/></div>}
                      </div>
                    </div>
                  ))}
                  {isChatting && (
                    <div className="flex justify-start animate-pulse">
                       <div className="flex gap-2 items-center">
                          <div className="w-6 h-6 rounded-lg bg-indigo-600/10 flex items-center justify-center text-indigo-600"><Cpu size={12}/></div>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t('thinking')}</span>
                       </div>
                    </div>
                  )}
                </div>
                <div className="p-4 border-t border-slate-200 dark:border-white/5 bg-white/50 dark:bg-transparent">
                  <form onSubmit={(e) => { e.preventDefault(); onChat(); }} className="relative">
                    <input 
                      value={chatIn} 
                      onChange={e=>setChatIn(e.target.value)} 
                      className="w-full bg-white dark:bg-[#16181d] border border-slate-200 dark:border-white/10 rounded-lg px-4 py-2 text-xs focus:outline-none focus:border-indigo-600 transition-all dark:text-white placeholder:text-slate-400" 
                      placeholder={lang === 'sw' ? t('askSomething') : 'Ask something...'} 
                    />
                    <button type="submit" disabled={!chatIn.trim()} className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 bg-indigo-600 rounded-md text-white hover:bg-indigo-700 disabled:opacity-50 transition-all">
                      <Send size={14}/>
                    </button>
                  </form>
                </div>
              </div>

              {/* Translation */}
              <div className="bg-gradient-to-br from-indigo-50 to-emerald-50 dark:from-indigo-950/10 dark:to-emerald-950/10 p-6 rounded-2xl border border-indigo-200/50 dark:border-white/5 flex flex-col justify-center space-y-6 shadow-lg h-[400px]">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center text-white shadow-lg"><Languages size={20}/></div>
                  <h4 className="font-display text-xl md:text-2xl font-bold dark:text-white text-slate-900">{t('swahiliLocalization')}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-light italic">"Kuuhakikisha teknolohia inapatikana kwa soko la Afrika Mashariki."</p>
                </div>
                <div className="space-y-3 flex-1 flex flex-col">
                  <div className="relative flex-1">
                    <textarea 
                      value={transIn} 
                      onChange={e=>setTransIn(e.target.value)} 
                      placeholder={lang === 'sw' ? t('pasteText') : 'Paste technical text...'} 
                      className="w-full h-full bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl p-4 text-xs dark:text-white focus:outline-none focus:border-emerald-500 transition-all resize-none shadow-inner" 
                    />
                    <div className="absolute top-2 right-3 text-[8px] font-bold text-slate-400 uppercase tracking-widest pointer-events-none">{lang === 'sw' ? 'Ingizo' : 'Input'}</div>
                  </div>
                  <button 
                    onClick={onTrans} 
                    disabled={isTrans||!transIn} 
                    className="py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg font-black uppercase text-[9px] tracking-widest transition-all shadow-lg shadow-emerald-500/10"
                  >
                    {isTrans ? t('translating') : t('translate')}
                  </button>
                </div>
                {transOut && (
                  <div className="p-4 bg-white/80 dark:bg-emerald-500/10 border border-emerald-500/20 rounded-xl animate-in zoom-in duration-300 shadow-sm">
                    <p className="text-sm font-display font-medium text-emerald-800 dark:text-emerald-200 italic">"{transOut}"</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
