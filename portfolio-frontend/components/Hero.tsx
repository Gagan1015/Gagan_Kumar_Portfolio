import React, { useState, useEffect } from 'react';
import { SectionId } from '../types';
import { useProfile } from '../hooks/usePortfolio';

const CODE_TABS = [
  {
    file: 'Hero.tsx',
    lang: 'tsx',
    code: `const InteractiveHero = () => {
  const [active, setActive] = useState(false);

  return (
    <div className="sharp-grid">
      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-6xl font-bold"
      >
        DIGITAL_REALITY
      </motion.h1>
      
      <InteractiveGrid 
        density={12} 
        friction={0.9} 
      />
    </div>
  );
};`
  },
  {
    file: 'Gemini.ts',
    lang: 'ts',
    code: `import { GoogleGenAI } from "@google/genai";

const analyzeContext = async () => {
  const ai = new GoogleGenAI({
    apiKey: process.env.API_KEY
  });

  // Connecting to neural context
  const stream = await ai.models.generateContentStream({
    model: 'gemini-2.5-flash',
    contents: 'Optimize render cycles...'
  });
  
  return stream;
};`
  },
  {
    file: 'Geometry.css',
    lang: 'css',
    code: `.layout-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 2rem;
  
  /* Sharp Aesthetics */
  border: 1px solid #121212;
  box-shadow: 8px 8px 0px 0px #000;
  backdrop-filter: blur(8px);
  
  --grid-color: #E5E5E5;
}`
  }
];

export const Hero: React.FC = () => {
  const { data: profile, isLoading } = useProfile();
  const currentYear = new Date().getFullYear();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState(0);
  const [displayedCode, setDisplayedCode] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  
  // Mouse interaction for parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Tab rotation timer (10s)
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % CODE_TABS.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Typewriter effect
  useEffect(() => {
    setDisplayedCode('');
    setIsTyping(true);
    const fullCode = CODE_TABS[activeTab].code;
    let charIndex = 0;
    
    const typeInterval = setInterval(() => {
      if (charIndex <= fullCode.length) {
        setDisplayedCode(fullCode.slice(0, charIndex));
        charIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typeInterval);
      }
    }, 30); // Typing speed

    return () => clearInterval(typeInterval);
  }, [activeTab]);

  const highlightSyntax = (code: string) => {
    // Simple syntax highlighting helper with dark mode support
    const keywords = ['const', 'return', 'import', 'from', 'export', 'async', 'await', 'function', 'class', 'interface', 'var', 'let'];
    const text = code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    
    // Split by newlines to handle comments safely
    return text.split('\n').map((line, i) => {
      let processedLine = line;
      
      // Highlight comments
      if (line.trim().startsWith('//') || line.trim().startsWith('/*')) {
        return <div key={i} className="text-neutral-400 dark:text-neutral-500 italic">{line}</div>;
      }

      // Highlight keywords
      keywords.forEach(kw => {
        const regex = new RegExp(`\\b${kw}\\b`, 'g');
        processedLine = processedLine.replace(regex, `<span class="text-black dark:text-white font-bold">${kw}</span>`);
      });
      
      // Highlight strings (basic)
      processedLine = processedLine.replace(/(['"`])(.*?)\1/g, '<span class="text-neutral-500 dark:text-neutral-400">$&</span>');

      // Highlight function calls (basic)
      processedLine = processedLine.replace(/\b([a-zA-Z0-9_]+)\(/g, '<span class="text-black dark:text-white font-medium">$1</span>(');

      return <div key={i} dangerouslySetInnerHTML={{ __html: processedLine || ' ' }} />;
    });
  };

  const scrollToProjects = () => {
    document.getElementById(SectionId.Projects)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <section id={SectionId.Hero} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white dark:bg-geo-dark-bg pt-20 md:pt-0 transition-colors duration-300">
      {/* Dynamic Background Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]" 
        style={{ 
          backgroundImage: 'linear-gradient(var(--grid-color) 1px, transparent 1px), linear-gradient(to right, var(--grid-color) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          transform: `translate(${mousePos.x * -0.5}px, ${mousePos.y * -0.5}px)`
        }}>
      </div>

      <div className="max-w-7xl w-full mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* Left Column: Text & CTA */}
        <div className="flex flex-col justify-center space-y-8 order-2 lg:order-1">
          <div className="relative">
            <div className="overflow-hidden">
              <h2 className="font-mono text-sm md:text-base text-neutral-500 dark:text-neutral-400 mb-4 tracking-widest uppercase animate-in slide-in-from-bottom duration-700 delay-100">
                {isLoading ? (
                  <span className="inline-block h-5 w-48 bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded"></span>
                ) : (
                  `${profile?.full_name} — Portfolio ${currentYear}`
                )}
              </h2>
            </div>
            <h1 className="font-display text-6xl md:text-8xl font-bold tracking-tighter leading-[0.9] text-black dark:text-white mix-blend-darken dark:mix-blend-normal">
              {isLoading ? (
                <>
                  <span className="block h-20 w-3/4 bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded mb-4"></span>
                  <span className="block h-20 w-2/3 bg-neutral-300 dark:bg-neutral-700 animate-pulse rounded"></span>
                </>
              ) : (
                <>
                  <span className="block hover:translate-x-2 transition-transform duration-300 cursor-default">
                    {profile?.title?.split(' ')[0]}
                  </span>
                  <span className="block text-neutral-400 dark:text-neutral-600 hover:text-black dark:hover:text-white transition-colors duration-500 cursor-default" 
                        style={{ transform: `translateX(${mousePos.x}px)` }}>
                    {profile?.title?.split(' ').slice(1).join(' ')}
                  </span>
                </>
              )}
            </h1>
          </div>

          <p className="max-w-md text-neutral-600 dark:text-neutral-400 text-lg leading-relaxed border-l-2 border-black dark:border-white pl-6 transition-colors">
            {isLoading ? (
              <span className="block space-y-2">
                <span className="block h-6 w-full bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded"></span>
                <span className="block h-6 w-5/6 bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded"></span>
              </span>
            ) : (
              profile?.bio
            )}
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button 
              onClick={scrollToProjects}
              className="group relative px-8 py-4 bg-black dark:bg-white text-white dark:text-black font-mono text-sm tracking-widest uppercase overflow-hidden border border-black dark:border-white"
            >
              <span className="relative z-10 group-hover:text-black dark:group-hover:text-white transition-colors duration-300">View Selected Work</span>
              <div className="absolute inset-0 bg-white dark:bg-black transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
            </button>
            {profile?.resume_url ? (
              <a 
                href={profile.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-transparent text-black dark:text-white border border-neutral-300 dark:border-neutral-700 font-mono text-sm tracking-widest uppercase hover:border-black dark:hover:border-white transition-colors duration-300 flex items-center gap-2"
              >
                View Resume
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </a>
            ) : (
              <button 
                disabled
                className="px-8 py-4 bg-transparent text-neutral-400 dark:text-neutral-600 border border-neutral-200 dark:border-neutral-800 font-mono text-sm tracking-widest uppercase cursor-not-allowed flex items-center gap-2"
              >
                Resume Not Available
              </button>
            )}
          </div>

          {/* Static Contact Info Grid */}
          <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-neutral-800 w-full">
             <div className="flex flex-col gap-4">
               
               {/* Status */}
               <div className="flex items-center gap-3">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                    Status: Available for Contracts
                  </span>
               </div>

               {/* Details */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm font-mono text-neutral-700 dark:text-neutral-300">
                 
                 {isLoading ? (
                   <>
                     <div className="flex items-center gap-3">
                       <span className="h-3.5 w-3.5 bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded"></span>
                       <span className="h-4 w-40 bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded"></span>
                     </div>
                     <div className="flex items-center gap-3">
                       <span className="h-3.5 w-3.5 bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded"></span>
                       <span className="h-4 w-32 bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded"></span>
                     </div>
                     <div className="flex items-center gap-3">
                       <span className="h-3.5 w-3.5 bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded"></span>
                       <span className="h-4 w-28 bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded"></span>
                     </div>
                     <div className="flex items-center gap-3">
                       <span className="h-3.5 w-3.5 bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded"></span>
                       <span className="h-4 w-36 bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded"></span>
                     </div>
                   </>
                 ) : (
                   <>
                     <div 
                        className="group flex items-center gap-3 cursor-pointer hover:text-black dark:hover:text-white transition-colors"
                        onClick={() => handleCopy(profile?.email || '', 'email')}
                     >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                        <span>{profile?.email}</span>
                        <span className={`text-[10px] text-neutral-400 transition-opacity duration-300 ${copiedField === 'email' ? 'opacity-100 text-green-500' : 'opacity-0 group-hover:opacity-100'}`}>
                          {copiedField === 'email' ? 'COPIED' : 'COPY'}
                        </span>
                     </div>

                     <div 
                        className="group flex items-center gap-3 cursor-pointer hover:text-black dark:hover:text-white transition-colors"
                        onClick={() => handleCopy(profile?.phone || '', 'phone')}
                     >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                        <span>{profile?.phone}</span>
                        <span className={`text-[10px] text-neutral-400 transition-opacity duration-300 ${copiedField === 'phone' ? 'opacity-100 text-green-500' : 'opacity-0 group-hover:opacity-100'}`}>
                          {copiedField === 'phone' ? 'COPIED' : 'COPY'}
                        </span>
                     </div>

                     <div className="flex items-center gap-3 text-neutral-600 dark:text-neutral-400">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                        <span>{profile?.location}</span>
                     </div>

                     <div className="flex items-center gap-3 text-neutral-600 dark:text-neutral-400">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        <span>{profile?.years_of_experience}+ Years Experience</span>
                     </div>
                   </>
                 )}

               </div>
             </div>
          </div>
        </div>

        {/* Right Column: Live Code Editor */}
        <div className="order-1 lg:order-2">
          <div className="relative bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden transition-colors duration-300">
            
            {/* Window Chrome */}
            <div className="flex items-center justify-between px-4 py-3 bg-neutral-100 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="flex-1 text-center">
                <span className="font-mono text-xs text-neutral-500 dark:text-neutral-400">~/portfolio/{CODE_TABS[activeTab].file}</span>
              </div>
              <div className="w-16"></div>
            </div>

            {/* Tab Bar */}
            <div className="flex bg-neutral-100 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 overflow-x-auto">
              {CODE_TABS.map((tab, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTab(idx)}
                  className={`px-4 py-2 text-xs font-mono border-r border-neutral-200 dark:border-neutral-700 whitespace-nowrap transition-colors ${
                    activeTab === idx
                      ? 'bg-neutral-50 dark:bg-neutral-900 text-black dark:text-white'
                      : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                  }`}
                >
                  {tab.file}
                  <span className="ml-2 text-neutral-400 dark:text-neutral-600">{tab.lang}</span>
                </button>
              ))}
            </div>

            {/* Code Display */}
            <div className="p-6 font-mono text-xs leading-relaxed overflow-auto max-h-[500px] bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200">
              <pre className="whitespace-pre-wrap">
                {highlightSyntax(displayedCode)}
                {isTyping && <span className="inline-block w-2 h-4 bg-black dark:bg-white ml-1 animate-pulse"></span>}
              </pre>
            </div>

            {/* Status Bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-neutral-100 dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700 text-[10px] font-mono text-neutral-500 dark:text-neutral-400">
              <div className="flex items-center gap-4">
                <span>TypeScript React</span>
                <span>UTF-8</span>
              </div>
              <div className="flex items-center gap-2">
                {isTyping ? (
                  <>
                    <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
                    <span>Rendering...</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Ready</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Code Tab Indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {CODE_TABS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  activeTab === idx 
                    ? 'bg-black dark:bg-white w-8' 
                    : 'bg-neutral-300 dark:bg-neutral-600 hover:bg-neutral-400 dark:hover:bg-neutral-500'
                }`}
                aria-label={`Switch to ${CODE_TABS[idx].file}`}
              />
            ))}
          </div>
        </div>

      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-neutral-300 dark:border-neutral-600 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-neutral-400 dark:bg-neutral-500 rounded-full"></div>
        </div>
      </div>
    </section>
  );
};