import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SectionId } from '../types';
import { useProfile } from '../hooks/usePortfolio';
import { resumeService } from '../services/portfolioService';

const ROLES = ['Developer', 'Engineer', 'Creator'];

/* ─── Magnetic element hook: pulls toward cursor when nearby ─── */
function useMagnetic(strength: number = 0.3) {
  const ref = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>(0);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!ref.current) return;
    cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const radius = 150;

      if (dist < radius) {
        const pull = (1 - dist / radius) * strength;
        el.style.transform = `translate(${dx * pull}px, ${dy * pull}px)`;
      } else {
        el.style.transform = 'translate(0, 0)';
      }
    });
  }, [strength]);

  const handleMouseLeave = useCallback(() => {
    if (ref.current) {
      ref.current.style.transform = 'translate(0, 0)';
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(frameRef.current);
    };
  }, [handleMouseMove, handleMouseLeave]);

  return ref;
}

/* ─── 3D tilt hook for avatar ─── */
function useTilt(maxDeg: number = 15) {
  const ref = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>(0);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!ref.current) return;
    cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const radius = 300;

      if (dist < radius) {
        const rotY = (dx / radius) * maxDeg;
        const rotX = -(dy / radius) * maxDeg;
        el.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.05)`;
      } else {
        el.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)';
      }
    });
  }, [maxDeg]);

  const handleMouseLeave = useCallback(() => {
    if (ref.current) {
      ref.current.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)';
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(frameRef.current);
    };
  }, [handleMouseMove, handleMouseLeave]);

  return ref;
}

export const Hero: React.FC = () => {
  const { data: profile, isLoading } = useProfile();
  const [phase, setPhase] = useState(0);
  const [roleIndex, setRoleIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  // Magnetic refs
  const ctaRef = useMagnetic(0.25);
  const resumeRef = useMagnetic(0.2);
  const avatarTiltRef = useTilt(12);

  // Choreographed entrance
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 200),
      setTimeout(() => setPhase(2), 500),
      setTimeout(() => setPhase(3), 900),
      setTimeout(() => setPhase(4), 1600),
      setTimeout(() => setPhase(5), 2000),
      setTimeout(() => setPhase(6), 2400),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  // Rotate role word
  useEffect(() => {
    if (phase < 3) return;
    const interval = setInterval(() => {
      setIsFlipping(true);
      setTimeout(() => {
        setRoleIndex(prev => (prev + 1) % ROLES.length);
        setIsFlipping(false);
      }, 300);
    }, 3000);
    return () => clearInterval(interval);
  }, [phase]);

  const scrollToProjects = () => {
    document.getElementById(SectionId.Projects)?.scrollIntoView({ behavior: 'smooth' });
  };

  const socialLinks = [
    { key: 'github', label: 'GitHub', url: profile?.github_url, icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg> },
    { key: 'linkedin', label: 'LinkedIn', url: profile?.linkedin_url, icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
    { key: 'twitter', label: 'X', url: profile?.twitter_url, icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
    { key: 'email', label: 'Email', url: profile?.email ? `mailto:${profile.email}` : null, icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg> },
  ];

  const titleWords = profile?.title?.split(' ').slice(0, -1) || [];

  return (
    <section
      id={SectionId.Hero}
      className="hero-section relative min-h-screen flex items-center overflow-hidden bg-white dark:bg-[#0a0a0a] transition-colors duration-300"
    >
      {/* Main content — two column on desktop */}
      <div className="section-frame w-full">
        <div className="section-frame-inner w-full py-16 md:py-24 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:gap-16 xl:gap-20">

          {/* ─── Left column: Text content ─── */}
          <div className="flex-1 min-w-0 lg:max-w-[60%]">

            {/* Mobile/Tablet avatar — top of hero on small screens */}
            <div className={`mb-8 flex justify-center lg:hidden hero-phase hero-phase-visual ${phase >= 1 ? 'hero-phase-visible' : ''}`}>
              <div className="hero-mobile-avatar">
                <div className="hero-visual-avatar-glow" />
                <div className="hero-avatar-accent-arc" />
                <img
                  src={profile?.avatar
                    ? (profile.avatar.includes('cloudinary')
                        ? profile.avatar.replace('/upload/', '/upload/f_auto,q_auto,w_240,h_240,c_fill/')
                        : profile.avatar)
                    : '/88609526.jpg'}
                  alt={profile?.full_name || 'Profile'}
                  className="hero-mobile-avatar-img"
                  width={120}
                  height={120}
                  decoding="async"
                />
              </div>
            </div>

            {/* Phase 1: Availability badge */}
            <div className={`hero-phase hero-phase-badge ${phase >= 1 ? 'hero-phase-visible' : ''}`}>
              {!isLoading && profile?.availability_status === 'available' && (
                <span className="hero-availability-badge">
                  <span className="hero-availability-dot" />
                  Available for new projects
                </span>
              )}
            </div>

            {/* Phase 2: Greeting with name + verified badge */}
            <div className={`mt-6 hero-phase hero-phase-name ${phase >= 2 ? 'hero-phase-visible' : ''}`}>
              {isLoading ? (
                <span className="inline-block w-64 h-10 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
              ) : (
                <h2 className="hero-greeting">
                  <span className="hero-greeting-text">Hi, I'm {profile?.full_name}</span>
                  <img
                    src="/Twitter_Verified_Badge.svg.png"
                    alt="Verified"
                    className="hero-verified-badge"
                    width={26}
                    height={26}
                  />
                </h2>
              )}
            </div>

            {/* Phase 3: Kinetic title */}
            <div className={`mt-6 md:mt-8 ${phase >= 3 ? '' : 'pointer-events-none'}`}>
              <h1 className="hero-title font-display font-bold tracking-tighter leading-[0.9] text-black dark:text-white">
                {isLoading ? (
                  <span className="inline-block w-[80%] h-20 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
                ) : (
                  <>
                    {titleWords.map((word: string, i: number) => (
                      <span
                        key={i}
                        className={`hero-kinetic-word ${phase >= 3 ? 'hero-kinetic-word-in' : ''}`}
                        style={{ animationDelay: `${i * 120}ms` }}
                      >
                        {word.split('').map((char, ci) => (
                          <span
                            key={ci}
                            className="hero-kinetic-char"
                            style={{ animationDelay: `${i * 120 + ci * 30}ms` }}
                          >
                            {char}
                          </span>
                        ))}
                        <span className="hero-kinetic-char" style={{ animationDelay: `${i * 120 + word.length * 30}ms` }}>&nbsp;</span>
                      </span>
                    ))}
                    {/* Rotating last word — inline with title */}
                    <span
                      className={`hero-kinetic-word hero-kinetic-rotating ${phase >= 3 ? 'hero-kinetic-word-in' : ''}`}
                      style={{ animationDelay: `${titleWords.length * 120}ms` }}
                    >
                      <span className="hero-role-clip">
                        <span
                          className={`hero-role-word ${
                            isFlipping ? 'hero-role-flip-out' : 'hero-role-flip-in'
                          }`}
                        >
                          {ROLES[roleIndex]}
                        </span>
                      </span>
                    </span>
                  </>
                )}
              </h1>
            </div>

            {/* Phase 4: Bio */}
            <div className={`mt-6 md:mt-8 hero-phase hero-phase-bio ${phase >= 4 ? 'hero-phase-visible' : ''}`}>
              <p className="hero-bio text-lg md:text-xl leading-relaxed text-neutral-500 dark:text-neutral-400 max-w-2xl">
                {isLoading ? (
                  <span className="space-y-2 block">
                    <span className="block w-full h-6 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
                    <span className="block w-3/4 h-6 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
                  </span>
                ) : (
                  profile?.bio
                )}
              </p>
            </div>

            {/* Phase 5: CTA + Social */}
            <div className={`mt-10 md:mt-12 flex items-center gap-6 flex-wrap hero-phase hero-phase-cta ${phase >= 5 ? 'hero-phase-visible' : ''}`}>
              <div ref={ctaRef} className="hero-magnetic-wrap">
                <button
                  onClick={scrollToProjects}
                  className="hero-cta-primary group relative overflow-hidden"
                >
                  <span className="hero-btn-text-wrap relative z-10 block overflow-hidden">
                    <span className="hero-btn-text block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full">
                      View My Work
                    </span>
                    <span className="hero-btn-text-clone absolute inset-0 block translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0">
                      View My Work
                    </span>
                  </span>
                  <span className="hero-cta-shine" />
                </button>
              </div>

              {profile?.resume_url && (
                <div ref={resumeRef} className="hero-magnetic-wrap">
                  <button
                    onClick={() => resumeService.download()}
                    className="hero-cta-secondary group relative overflow-hidden"
                  >
                    <span className="hero-btn-text-wrap relative z-10 flex items-center gap-2 overflow-hidden">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                      <span className="block overflow-hidden relative">
                        <span className="block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full">
                          Resume
                        </span>
                        <span className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0">
                          Resume
                        </span>
                      </span>
                    </span>
                  </button>
                </div>
              )}

              <div className="hidden md:block w-px h-8 bg-neutral-200 dark:bg-neutral-800" />

              <div className="flex items-center gap-2">
                {socialLinks.map((link, i) => {
                  if (!link.url) return null;
                  return (
                    <a
                      key={link.key}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`hero-social-icon ${phase >= 5 ? 'hero-social-icon-in' : ''}`}
                      style={{ animationDelay: `${i * 80}ms` }}
                      title={link.label}
                    >
                      {link.icon}
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Phase 6: Location line */}
            <div className={`mt-8 hero-phase hero-phase-location ${phase >= 6 ? 'hero-phase-visible' : ''}`}>
              {!isLoading && profile?.location && (
                <span className="hero-location-line">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  Based in {profile.location}
                </span>
              )}
            </div>
          </div>

          {/* ─── Right column: Visual composition (desktop only) ─── */}
          <div className={`hidden lg:flex flex-1 items-center justify-center relative hero-phase hero-phase-visual ${phase >= 2 ? 'hero-phase-visible' : ''}`}>
            <div className="hero-visual-composition">
              {/* Outer orbit ring */}
              <div className="hero-orbit hero-orbit-outer">
                <div className="hero-orbit-dot hero-orbit-dot-1" />
                <div className="hero-orbit-dot hero-orbit-dot-2" />
                <div className="hero-orbit-dot hero-orbit-dot-3" />
              </div>

              {/* Inner orbit ring */}
              <div className="hero-orbit hero-orbit-inner">
                <div className="hero-orbit-dot hero-orbit-dot-4" />
                <div className="hero-orbit-dot hero-orbit-dot-5" />
              </div>

              {/* Center avatar — large */}
              <div ref={avatarTiltRef} className="hero-visual-avatar-wrap hero-avatar-tilt">
                <div className="hero-visual-avatar">
                  <div className="hero-visual-avatar-glow" />
                  <div className="hero-avatar-accent-arc" />
                  <img
                    src={profile?.avatar
                      ? (profile.avatar.includes('cloudinary')
                          ? profile.avatar.replace('/upload/', '/upload/f_auto,q_auto,w_400,h_400,c_fill/')
                          : profile.avatar)
                      : '/88609526.jpg'}
                    alt={profile?.full_name || 'Profile'}
                    className="hero-visual-avatar-img"
                    width={160}
                    height={160}
                    fetchPriority="high"
                    decoding="async"
                  />
                </div>
              </div>

              {/* Floating accent cards */}
              <div className={`hero-float-card hero-float-card-1 ${phase >= 3 ? 'hero-float-card-visible' : ''}`}>
                <span className="hero-float-card-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                </span>
                <span className="hero-float-card-text">Clean Code</span>
              </div>

              <div className={`hero-float-card hero-float-card-2 ${phase >= 4 ? 'hero-float-card-visible' : ''}`}>
                <span className="hero-float-card-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                </span>
                <span className="hero-float-card-text">Full Stack</span>
              </div>

              <div className={`hero-float-card hero-float-card-3 ${phase >= 5 ? 'hero-float-card-visible' : ''}`}>
                <span className="hero-float-card-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                </span>
                <span className="hero-float-card-text">Web Apps</span>
              </div>

              {/* Corner decorative lines */}
              <div className="hero-deco-corner hero-deco-corner-tl" />
              <div className="hero-deco-corner hero-deco-corner-br" />
            </div>
          </div>

        </div>
      </div>
      </div>

      {/* Scroll indicator */}
      <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-700 ${phase >= 6 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="w-5 h-9 border-2 border-neutral-300 dark:border-neutral-700 rounded-full flex items-start justify-center p-1.5">
          <div className="w-0.5 h-2.5 bg-neutral-400 dark:bg-neutral-600 rounded-full hero-scroll-dot" />
        </div>
      </div>
    </section>
  );
};
