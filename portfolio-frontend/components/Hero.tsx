import React, { useState, useEffect, useRef, useMemo } from 'react';
import { SectionId, Profile } from '../types';
import { useProfile } from '../hooks/usePortfolio';
import { resumeService } from '../services/portfolioService';

const ROTATING_WORDS = ['Developer', 'Engineer'];

// Segment: a piece of text with a CSS class
type Segment = { text: string; cls: string };
// A code line: line number + array of styled segments
type CodeLine = { num: string; segments: Segment[] };

const CodeTypewriter: React.FC<{ profile: Profile | undefined; techStack: string[] }> = ({ profile, techStack }) => {
  const [charCount, setCharCount] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedRef = useRef(false);

  // Build lines from profile data — memoized to avoid recalc
  const lines: CodeLine[] = useMemo(() => {
    const propCls = 'text-neutral-600 dark:text-neutral-400';
    const strCls = 'text-green-600 dark:text-green-400';
    const kwCls = 'text-purple-500 dark:text-purple-400';
    const numCls = 'text-amber-500 dark:text-amber-400';
    const defCls = 'text-neutral-400 dark:text-neutral-600';
    const nameCls = 'text-black dark:text-white font-semibold';

    const result: CodeLine[] = [
      { num: '01', segments: [
        { text: 'const', cls: kwCls }, { text: ' ', cls: defCls }, { text: 'developer', cls: nameCls }, { text: ' = {', cls: defCls }
      ]},
      { num: '02', segments: [
        { text: '  ', cls: defCls }, { text: 'name', cls: propCls }, { text: ': ', cls: defCls }, { text: `"${profile?.full_name || '...'}"`, cls: strCls }, { text: ',', cls: defCls }
      ]},
      { num: '03', segments: [
        { text: '  ', cls: defCls }, { text: 'role', cls: propCls }, { text: ': ', cls: defCls }, { text: `"${profile?.title || '...'}"`, cls: strCls }, { text: ',', cls: defCls }
      ]},
      { num: '04', segments: [
        { text: '  ', cls: defCls }, { text: 'location', cls: propCls }, { text: ': ', cls: defCls }, { text: `"${profile?.location || '...'}"`, cls: strCls }, { text: ',', cls: defCls }
      ]},
      { num: '05', segments: [
        { text: '  ', cls: defCls }, { text: 'experience', cls: propCls }, { text: ': ', cls: defCls }, { text: `${profile?.years_of_experience || '0'}+`, cls: numCls }, { text: ' years,', cls: defCls }
      ]},
      { num: '06', segments: [
        { text: '  ', cls: defCls }, { text: 'stack', cls: propCls }, { text: ': [', cls: defCls }
      ]},
    ];

    techStack.forEach((tech, i) => {
      result.push({
        num: String(7 + i).padStart(2, '0'),
        segments: [
          { text: '    ', cls: defCls }, { text: `"${tech}"`, cls: strCls }, { text: i < techStack.length - 1 ? ',' : '', cls: defCls }
        ]
      });
    });

    result.push({ num: String(7 + techStack.length).padStart(2, '0'), segments: [{ text: '  }],', cls: defCls }] });
    result.push({ num: String(8 + techStack.length).padStart(2, '0'), segments: [
      { text: '  ', cls: defCls }, { text: 'available', cls: propCls }, { text: ': ', cls: defCls }, { text: 'true', cls: kwCls }, { text: ',', cls: defCls }
    ]});
    result.push({ num: String(9 + techStack.length).padStart(2, '0'), segments: [{ text: '};', cls: defCls }] });

    return result;
  }, [profile, techStack]);

  // Total characters across all lines
  const totalChars = useMemo(() => {
    return lines.reduce((sum, line) => sum + line.segments.reduce((s, seg) => s + seg.text.length, 0), 0);
  }, [lines]);

  // Keep a ref so the interval callback always reads the latest totalChars (no stale closure)
  const totalCharsRef = useRef(totalChars);
  totalCharsRef.current = totalChars;

  // Start typing after a delay — only once profile data is available
  useEffect(() => {
    if (!profile) return;           // wait for real data before animating
    if (startedRef.current) return; // only start once per mount

    startedRef.current = true;
    setCharCount(0); // reset in case of remount

    const delay = setTimeout(() => {
      timerRef.current = setInterval(() => {
        setCharCount(prev => {
          const target = totalCharsRef.current;
          if (prev >= target) {
            if (timerRef.current) clearInterval(timerRef.current);
            return target;
          }
          return prev + 1;
        });
      }, 30);
    }, 1000);
    return () => {
      clearTimeout(delay);
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
      startedRef.current = false; // allow animation to restart on remount
    };
  }, [profile]);

  // Render lines with partial text reveal
  let charsRemaining = charCount;

  return (
    <>
      {lines.map((line, lineIdx) => {
        const lineCharCount = line.segments.reduce((s, seg) => s + seg.text.length, 0);
        // If we haven't reached this line yet, skip it
        if (charsRemaining <= 0 && charCount > 0) return null;
        // If charCount is 0 (not started), show nothing
        if (charCount === 0) return null;

        const lineCharsToShow = Math.min(charsRemaining, lineCharCount);
        charsRemaining -= lineCharCount;
        const isCurrentLine = lineCharsToShow > 0 && lineCharsToShow < lineCharCount;
        const isLastTypedLine = charsRemaining <= 0 && lineCharsToShow > 0;

        let segCharsLeft = lineCharsToShow;
        return (
          <div key={lineIdx} className="text-neutral-400 dark:text-neutral-600" style={{ minHeight: '1.5rem' }}>
            <span className="text-neutral-300 dark:text-neutral-700 select-none mr-4 inline-block w-5 text-right">{line.num}</span>
            {line.segments.map((seg, segIdx) => {
              if (segCharsLeft <= 0) return null;
              const visibleText = seg.text.slice(0, segCharsLeft);
              segCharsLeft -= seg.text.length;
              return <span key={segIdx} className={seg.cls}>{visibleText}</span>;
            })}
            {/* Blinking cursor */}
            {(isCurrentLine || (isLastTypedLine && charCount >= totalChars)) && (
              <span className="code-cursor">|</span>
            )}
          </div>
        );
      })}
      {/* Show empty lines for lines not yet reached — keeps consistent height */}
      {charCount > 0 && charCount < totalChars && (
        Array.from({ length: lines.length - lines.filter((_, i) => {
          let c = 0;
          for (let j = 0; j <= i; j++) c += lines[j].segments.reduce((s, seg) => s + seg.text.length, 0);
          return charCount >= c - lines[i].segments.reduce((s, seg) => s + seg.text.length, 0) + 1;
        }).length }).map((_, i) => (
          <div key={`empty-${i}`} style={{ minHeight: '1.5rem' }} />
        ))
      )}
    </>
  );
};

export const Hero: React.FC = () => {
  const { data: profile, isLoading } = useProfile();
  const [isVisible, setIsVisible] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [rotatingIndex, setRotatingIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 150);
    return () => clearTimeout(timer);
  }, []);

  // Auto-rotate the last word
  useEffect(() => {
    const interval = setInterval(() => {
      setIsRotating(true);
      setTimeout(() => {
        setRotatingIndex(prev => (prev + 1) % ROTATING_WORDS.length);
        setIsRotating(false);
      }, 300); // halfway through the animation
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const scrollToProjects = () => {
    document.getElementById(SectionId.Projects)?.scrollIntoView({ behavior: 'smooth' });
  };

  const socialLinks = [
    {
      key: 'resume',
      label: 'Resume',
      url: null,
      action: () => resumeService.download(),
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
        </svg>
      ),
    },
    {
      key: 'linkedin',
      label: 'LinkedIn',
      url: profile?.linkedin_url,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
    },
    {
      key: 'twitter',
      label: 'X',
      url: profile?.twitter_url,
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
    },
    {
      key: 'github',
      label: 'GitHub',
      url: profile?.github_url,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
        </svg>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      url: profile?.email ? `mailto:${profile.email}` : null,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
          <polyline points="22,6 12,13 2,6"></polyline>
        </svg>
      ),
    },
  ];

  const keywords = ['Laravel', 'PHP', 'JavaScript', 'WordPress', 'React', 'TypeScript', 'Node.js', 'Python', 'Full-Stack', 'Backend', 'Frontend'];

  // Right-side decorative stats
  const techStack = ['React', 'Laravel', 'TypeScript', 'Node.js', 'PHP', 'WordPress'];

  return (
    <section
      id={SectionId.Hero}
      className="relative min-h-screen flex items-center overflow-hidden bg-white dark:bg-[#0a0a0a] border-b border-neutral-200 dark:border-neutral-800 transition-colors duration-300"
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: 'linear-gradient(var(--grid-color) 1px, transparent 1px), linear-gradient(to right, var(--grid-color) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      {/* Ambient glow */}
      <div className="hero-glow-1 absolute w-[500px] h-[500px] rounded-full pointer-events-none top-[-150px] right-[-80px]" />
      <div className="hero-glow-2 absolute w-[400px] h-[400px] rounded-full pointer-events-none bottom-[-120px] left-[-60px]" />

      {/* Main content — same max-w and px as all other sections */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full py-16 md:py-40 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* ─── LEFT COLUMN (Content) ─── */}
          <div className="lg:col-span-7">

            {/* ROW 1: Avatar + Name */}
            <div className={`flex items-center gap-5 transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {/* Avatar with animated border */}
              <div className="relative flex-shrink-0">
                <div className="hero-avatar-container">
                  <div className="hero-avatar-glow-ring" />
                  <img
                    src={profile?.avatar 
                      ? (profile.avatar.includes('cloudinary') 
                          ? profile.avatar.replace('/upload/', '/upload/f_auto,q_auto,w_150,h_150,c_fill/') 
                          : profile.avatar)
                      : '/88609526.jpg'}
                    alt={profile?.full_name || 'Profile'}
                    className="hero-avatar-image"
                    width={76}
                    height={76}
                    fetchPriority="high"
                    decoding="async"
                  />
                </div>
                {/* Status dot - outside overflow:hidden container */}
                <div className="absolute -bottom-1 -right-1 z-10">
                  <span className="absolute w-3.5 h-3.5 rounded-full bg-green-500 animate-ping opacity-75" />
                  <span className="relative block w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-white dark:border-[#0a0a0a]" />
                </div>
              </div>

              {/* Name + meta */}
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-display text-2xl md:text-3xl font-semibold tracking-tight text-black dark:text-white">
                    {isLoading ? (
                      <span className="inline-block w-48 h-7 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
                    ) : (
                      profile?.full_name
                    )}
                  </h1>
                  <svg className="flex-shrink-0 drop-shadow-[0_0_4px_rgba(59,130,246,0.4)]" width="20" height="20" viewBox="0 0 24 24" fill="#3B82F6">
                    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  </svg>
                </div>
                <div className="flex items-center gap-3 mt-1 flex-wrap">
                  {!isLoading && profile?.years_of_experience && (
                    <span className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-500 font-mono">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                      {profile.years_of_experience}+ yrs exp
                    </span>
                  )}
                  {!isLoading && profile?.location && (
                    <span className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-500 font-mono">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      {profile.location}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Horizontal rule */}
            <div className={`my-8 h-px bg-neutral-200 dark:bg-neutral-800 transition-all duration-700 ease-out delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} />

            {/* ROW 2: Title with rotating last word */}
            <div className={`transition-all duration-700 ease-out delay-150 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-[0.95] text-black dark:text-white">
                {isLoading ? (
                  <span className="inline-block w-80 h-14 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
                ) : (
                  <>
                    {/* Static prefix words (e.g. "Full Stack") */}
                    {profile?.title?.split(' ').slice(0, -1).map((word: string, i: number) => (
                      <span key={i} className="hero-text-reveal inline-block mr-[0.3em] overflow-hidden">
                        <span className="hero-text-reveal-inner inline-block">
                          {word}
                        </span>
                      </span>
                    ))}
                    {/* Rotating last word */}
                    <span className="inline-block overflow-hidden align-bottom" style={{ height: '1.1em' }}>
                      <span
                        className={`inline-block transition-all duration-500 ease-in-out ${
                          isRotating
                            ? '-translate-y-full opacity-0'
                            : 'translate-y-0 opacity-100'
                        }`}
                      >
                        {ROTATING_WORDS[rotatingIndex]}
                      </span>
                    </span>
                  </>
                )}
              </h2>
            </div>

            {/* ROW 3: Bio with keyword highlights */}
            <div className={`mt-6 transition-all duration-700 ease-out delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <p className="text-base md:text-lg leading-relaxed text-neutral-500 dark:text-neutral-400 max-w-xl border-l-2 border-neutral-200 dark:border-neutral-700 pl-5">
                {isLoading ? (
                  <span className="space-y-2 block">
                    <span className="block w-full h-5 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
                    <span className="block w-4/5 h-5 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
                  </span>
                ) : (
                  profile?.bio?.split(' ').map((word: string, i: number) => {
                    const clean = word.replace(/[,.!?;:]/g, '');
                    const isKw = keywords.some(k => clean.toLowerCase() === k.toLowerCase());
                    return isKw ? (
                      <span key={i} className="text-black dark:text-white font-medium hero-keyword">{word} </span>
                    ) : (
                      <span key={i}>{word} </span>
                    );
                  })
                )}
              </p>
            </div>

            {/* ROW 4: Social icons */}
            <div className={`mt-8 flex items-center gap-3 flex-wrap transition-all duration-700 ease-out delay-[400ms] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {socialLinks.map((link) => {
                if (link.key === 'resume' && !profile?.resume_url) return null;
                if (link.key !== 'resume' && !link.url) return null;

                const cls = "flex items-center justify-center w-10 h-10 rounded-full border border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-500 hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white transition-all duration-300 hover:-translate-y-1";

                if (link.action) {
                  return (
                    <button key={link.key} onClick={link.action} className={cls} title={link.label}>
                      {link.icon}
                    </button>
                  );
                }
                return (
                  <a key={link.key} href={link.url!} target="_blank" rel="noopener noreferrer" className={cls} title={link.label}>
                    {link.icon}
                  </a>
                );
              })}

              {/* Vertical separator */}
              <div className="w-px h-6 bg-neutral-200 dark:bg-neutral-800 mx-1" />

              {/* Quick contact copy */}
              {!isLoading && profile?.email && (
                <button
                  onClick={() => handleCopy(profile.email, 'email')}
                  className="group flex items-center gap-1.5 text-xs font-mono text-neutral-400 dark:text-neutral-600 hover:text-black dark:hover:text-white transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  {profile.email}
                  <span className={`text-[10px] font-semibold uppercase tracking-wider transition-all duration-300 ${copiedField === 'email' ? 'text-green-500 opacity-100' : 'opacity-0 group-hover:opacity-100 text-neutral-400'}`}>
                    {copiedField === 'email' ? '✓' : 'copy'}
                  </span>
                </button>
              )}
            </div>

            {/* ROW 5: CTA buttons */}
            <div className={`mt-8 flex items-center gap-4 flex-wrap transition-all duration-700 ease-out delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <button
                onClick={scrollToProjects}
                className="hero-btn-slide group relative overflow-hidden px-8 py-4 bg-black dark:bg-white text-white dark:text-black font-mono text-xs tracking-widest uppercase border border-black dark:border-white transition-colors"
              >
                <span className="hero-btn-text-wrap relative z-10 block overflow-hidden">
                  <span className="hero-btn-text block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full">
                    View Selected Work
                  </span>
                  <span className="hero-btn-text-clone absolute inset-0 block translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0">
                    View Selected Work
                  </span>
                </span>
                <span className="hero-cta-shine" />
              </button>

              {profile?.resume_url && (
                <button
                  onClick={() => resumeService.download()}
                  className="hero-btn-slide group relative overflow-hidden px-8 py-4 bg-transparent text-neutral-600 dark:text-neutral-400 border border-neutral-300 dark:border-neutral-700 font-mono text-xs tracking-widest uppercase hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white transition-all duration-300"
                >
                  <span className="hero-btn-text-wrap relative z-10 flex items-center gap-2 overflow-hidden">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    <span className="block overflow-hidden relative">
                      <span className="block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full">
                        Download Resume
                      </span>
                      <span className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0">
                        Download Resume
                      </span>
                    </span>
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* ─── RIGHT COLUMN (Decorative Panel) ─── */}
          <div className={`hidden lg:block lg:col-span-5 transition-all duration-700 ease-out delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="relative">
              {/* Decorative vertical line */}
              <div className="absolute -left-8 top-0 bottom-0 w-px bg-neutral-200 dark:bg-neutral-800" />

              {/* Terminal-style code block */}
              <div className="border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 overflow-hidden">
                {/* Terminal header — macOS style */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-100/50 dark:bg-neutral-800/30">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#FF5F57] hover:brightness-110 transition-all cursor-default shadow-[0_0_4px_rgba(255,95,87,0.3)]" />
                    <div className="w-3 h-3 rounded-full bg-[#FFBD2E] hover:brightness-110 transition-all cursor-default shadow-[0_0_4px_rgba(255,189,46,0.3)]" />
                    <div className="w-3 h-3 rounded-full bg-[#27C93F] hover:brightness-110 transition-all cursor-default shadow-[0_0_4px_rgba(39,201,63,0.3)]" />
                  </div>
                  <span className="ml-3 text-[10px] font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-500">about.tsx</span>
                </div>
                {/* Code content with character-by-character typewriter */}
                <div className="p-5 font-mono text-xs leading-6">
                  <CodeTypewriter profile={profile} techStack={techStack} />
                </div>
              </div>

              {/* Mini stats below the terminal */}
              <div className="grid grid-cols-3 gap-px mt-px">
                <div className="bg-neutral-50/50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-4 text-center group hover:bg-white dark:hover:bg-black transition-colors">
                  <div className="font-display text-2xl font-bold text-black dark:text-white tracking-tight">{profile?.years_of_experience || '1'}+</div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-600 mt-1">Years Exp</div>
                </div>
                <div className="bg-neutral-50/50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-4 text-center group hover:bg-white dark:hover:bg-black transition-colors">
                  <div className="font-display text-2xl font-bold text-black dark:text-white tracking-tight">10+</div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-600 mt-1">Projects</div>
                </div>
                <div className="bg-neutral-50/50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 p-4 text-center group hover:bg-white dark:hover:bg-black transition-colors">
                  <div className="font-display text-2xl font-bold text-black dark:text-white tracking-tight">15+</div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-600 mt-1">Tech Stack</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-5 h-9 border-2 border-neutral-300 dark:border-neutral-700 rounded-full flex items-start justify-center p-1.5">
          <div className="w-0.5 h-2.5 bg-neutral-400 dark:bg-neutral-600 rounded-full hero-scroll-dot" />
        </div>
      </div>
    </section>
  );
};