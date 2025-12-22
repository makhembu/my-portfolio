
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, Languages, Cpu, User, Lightbulb } from 'lucide-react';
import { translateText, chatWithBrianAI, getStarterPrompts } from '@/services/geminiService';

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

export const AIHub: React.FC = () => {
  const [chatIn, setChatIn] = useState('');
  const [chatLog, setChatLog] = useState<{role: 'u'|'ai', t: string}[]>([{
    role: 'ai', 
    t: "Hujambo! I summarize Brian's experience on this portfolio. For complete details or career advice, visit brianuche.dev or contact Brian directly on [GitHub](https://github.com/makhembu) or [LinkedIn](https://linkedin.com/in/brianmakhembu/)."
  }]);
  const [isChatting, setIsChatting] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showStarters, setShowStarters] = useState(true);
  const starterPrompts = getStarterPrompts();

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
    setShowStarters(false);
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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-4 md:px-6 py-12 md:py-20 space-y-8 md:space-y-12 overflow-hidden">
      <div className="text-center space-y-4 mb-10 md:mb-16">
        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600">Playground / Digital Twin</h2>
        <h3 className="font-display text-3xl md:text-5xl font-bold dark:text-white text-slate-900 leading-tight">Experience Intelligent Solutions.</h3>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-start">
        {/* Chat */}
        <div className="bg-slate-50 dark:bg-[#0d0e12] border border-slate-200 dark:border-white/5 rounded-[2rem] md:rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl h-[500px] md:h-[600px]">
          <div className="p-5 md:p-8 border-b border-slate-200 dark:border-white/5 flex items-center gap-4 bg-white/50 dark:bg-white/[0.02]">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shrink-0"><Cpu size={20}/></div>
            <div className="min-w-0">
              <h4 className="font-bold text-sm tracking-tight truncate">Brian AI Assistant</h4>
              <p className="text-[9px] md:text-[10px] text-emerald-500 font-black uppercase tracking-widest truncate">Direct Context</p>
            </div>
          </div>
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 md:p-8 space-y-6 scroll-smooth scrollbar-hide">
            {chatLog.map((l, i) => (
              <div key={i} className={`flex ${l.role==='u' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                <div className={`flex gap-3 max-w-[95%] md:max-w-[85%] ${l.role === 'u' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {l.role === 'ai' && <div className="w-8 h-8 rounded-lg bg-indigo-600/10 flex items-center justify-center text-indigo-600 shrink-0 mt-1"><Cpu size={14}/></div>}
                  <div className={`p-4 rounded-2xl text-xs md:text-sm leading-relaxed ${l.role==='u' ? 'bg-indigo-600 text-white shadow-lg rounded-tr-none' : 'bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 rounded-tl-none'}`}>
                    <MessageContent text={l.t} />
                  </div>
                  {l.role === 'u' && <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-white/10 flex items-center justify-center text-slate-500 shrink-0 mt-1"><User size={14}/></div>}
                </div>
              </div>
            ))}
            {showStarters && chatLog.length === 1 && (
              <div className="mt-6 space-y-2">
                <div className="flex items-center gap-2 text-[9px] font-bold text-slate-500 uppercase tracking-widest px-1">
                  <Lightbulb size={12} />
                  Try these questions:
                </div>
                <div className="space-y-2">
                  {starterPrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setChatIn(prompt);
                      }}
                      className="w-full text-left p-3 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 rounded-lg text-xs text-slate-700 dark:text-slate-300 transition-all"
                    >
                      "{prompt}"
                    </button>
                  ))}
                </div>
              </div>
            )}
            {isChatting && (
              <div className="flex justify-start animate-pulse">
                 <div className="flex gap-3 items-center">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600/10 flex items-center justify-center text-indigo-600"><Cpu size={14}/></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Brian AI is thinking...</span>
                 </div>
              </div>
            )}
          </div>
          <div className="p-5 md:p-6 border-t border-slate-200 dark:border-white/5 bg-white/50 dark:bg-transparent">
            <form onSubmit={(e) => { e.preventDefault(); onChat(); }} className="relative">
              <input 
                value={chatIn} 
                onChange={e=>setChatIn(e.target.value)} 
                className="w-full bg-white dark:bg-[#16181d] border border-slate-200 dark:border-white/10 rounded-xl px-4 md:px-5 py-3 md:py-4 text-xs md:text-sm focus:outline-none focus:border-indigo-600 transition-all dark:text-white placeholder:text-slate-400" 
                placeholder="Ask about my JKUAT days or Fanharm work..." 
              />
              <button type="submit" disabled={!chatIn.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 rounded-lg text-white hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-md">
                <Send size={16}/>
              </button>
            </form>
          </div>
        </div>

        {/* Translation */}
        <div className="bg-gradient-to-br from-indigo-50 to-emerald-50 dark:from-indigo-950/10 dark:to-emerald-950/10 p-6 md:p-12 rounded-[2rem] md:rounded-[2.5rem] border border-indigo-200/50 dark:border-white/5 flex flex-col justify-center space-y-8 shadow-xl min-h-[450px] md:min-h-[500px]">
           <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-lg"><Languages size={24}/></div>
              <h4 className="font-display text-2xl md:text-3xl font-bold dark:text-white text-slate-900 leading-tight">Swahili Localization</h4>
              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-light italic">"Ensuring technology is accessible to the East African market through precision translation."</p>
           </div>
           <div className="space-y-4">
             <div className="relative">
               <textarea 
                 value={transIn} 
                 onChange={e=>setTransIn(e.target.value)} 
                 placeholder="Paste technical text to translate..." 
                 className="w-full h-32 md:h-40 bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-2xl p-4 md:p-6 text-xs md:text-sm dark:text-white focus:outline-none focus:border-emerald-500 transition-all resize-none shadow-inner" 
               />
               <div className="absolute top-4 right-4 text-[8px] md:text-[9px] font-bold text-slate-400 uppercase tracking-widest pointer-events-none">English Input</div>
             </div>
             <button 
                onClick={onTrans} 
                disabled={isTrans||!transIn} 
                className="w-full py-3 md:py-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-black uppercase text-[10px] tracking-[0.2em] transition-all shadow-xl shadow-emerald-500/10"
             >
                {isTrans ? 'Mkalimani anafanya kazi...' : 'Translate to Swahili'}
             </button>
           </div>
           {transOut && (
             <div className="p-4 md:p-6 bg-white/80 dark:bg-emerald-500/10 border border-emerald-500/20 rounded-2xl animate-in zoom-in duration-300 shadow-sm relative break-words">
                <div className="absolute -top-2 left-4 px-2 py-0.5 bg-emerald-500 text-white text-[7px] md:text-[8px] font-black rounded uppercase tracking-tighter">Matokeo</div>
                <p className="text-base md:text-lg font-display font-medium text-emerald-800 dark:text-emerald-200 italic">"{transOut}"</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};
