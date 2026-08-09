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

export const Hero: React.FC = () => {
  const { data: profile, isLoading } = useProfile();
  const [phase, setPhase] = useState(0);
  const [roleIndex, setRoleIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);

  // Magnetic refs
  const ctaRef = useMagnetic(0.25);
  const resumeRef = useMagnetic(0.2);

  // Choreographed entrance
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 200),
      setTimeout(() => setPhase(2), 500),
      setTimeout(() => setPhase(3), 900),
      setTimeout(() => setPhase(4), 1400),
      setTimeout(() => setPhase(5), 1800),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  // Rotate role word
  useEffect(() => {
    if (phase < 2) return;
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

  const titleWords = profile?.title?.split(' ').slice(0, -1) || [];

  /* Split the name so the surname can carry the ghosted accent colour */
  const [firstName = '', ...restOfName] = (profile?.full_name ?? '').trim().split(/\s+/);
  const lastName = restOfName.join(' ');

  return (
    <section
      id={SectionId.Hero}
      className="hero-section relative min-h-svh flex flex-col overflow-hidden bg-[#f4f4f4] dark:bg-[#020208] transition-colors duration-300"
    >
      {/* Halftone dot texture — the hero's only background treatment */}
      <div aria-hidden="true" className="hero-halftone" />

      {/* ─── Guard rails: full-height vertical lines + top hairline + outer hatch ─── */}
      <div aria-hidden="true" className="hero-rails">
        <div className="hero-rails-hatch hero-rails-hatch-left" />
        <div className="hero-rails-hatch hero-rails-hatch-right" />
        <div className="hero-rails-frame">
          <span className="hero-rail hero-rail-left" />
          <span className="hero-rail hero-rail-right" />
          <span className="hero-rail-cross hero-rail-cross-left" />
          <span className="hero-rail-cross hero-rail-cross-right" />
        </div>
        <div className="hero-rails-top" />
      </div>

      {/* ─── Main content: centered single column ─── */}
      <div className="hero-content relative z-10 flex flex-col items-center">

        <div className="section-frame section-frame--flush w-full">
          <div className="section-frame-inner w-full flex flex-col items-center text-center">

            {/* Phase 2: Large centered title — Kensei-style */}
            <div className={phase >= 2 ? '' : 'pointer-events-none'}>
              <h1 className="hero-title-centered font-display font-bold tracking-tighter leading-[0.92] text-black dark:text-white">
                {/* Identity line — keeps the name in the h1 without competing with the display type */}
                <span className={`hero-title-name ${phase >= 1 ? 'hero-title-name-in' : ''}`}>
                  {isLoading ? (
                    <span className="inline-block h-[0.7em] w-[8ch] max-w-full animate-pulse rounded bg-neutral-200 align-middle dark:bg-neutral-800" />
                  ) : (
                    <>
                      {firstName}
                      {lastName && (
                        <>
                          {' '}
                          <span className="hero-title-surname">{lastName}</span>
                        </>
                      )}
                    </>
                  )}
                </span>
                {isLoading ? (
                  <span className="inline-block w-[80%] h-20 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
                ) : (
                  <>
                    {titleWords.map((word: string, i: number) => (
                      <span
                        key={i}
                        className={`hero-kinetic-word ${phase >= 2 ? 'hero-kinetic-word-in' : ''}`}
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
                    {/* Small screens: force the rotating word onto its own line so the
                        heading height stays fixed as the word changes */}
                    <span aria-hidden="true" className="hero-title-break" />
                    {/* Rotating last word with gradient — the "Craftsmanship" equivalent */}
                    <span
                      className={`hero-kinetic-word hero-kinetic-rotating ${phase >= 2 ? 'hero-kinetic-word-in' : ''}`}
                      style={{ animationDelay: `${titleWords.length * 120}ms` }}
                    >
                      <span className="hero-role-clip">
                        <span
                          className={`hero-role-word ${
                            isFlipping ? 'hero-role-flip-out' : 'hero-role-flip-in'
                          }`}
                        >
                          {ROLES[roleIndex]}.
                        </span>
                      </span>
                    </span>
                  </>
                )}
              </h1>
            </div>

            {/* Phase 3: Subtitle / Bio */}
            <div className={`mt-4 md:mt-5 hero-phase hero-phase-bio ${phase >= 3 ? 'hero-phase-visible' : ''}`}>
              <p className="hero-subtitle max-w-3xl capitalize">
                {isLoading ? (
                  <span className="space-y-2 block">
                    <span className="block w-full h-6 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
                    <span className="block w-3/4 h-6 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse mx-auto" />
                  </span>
                ) : (
                  profile?.bio
                )}
              </p>
            </div>

            {/* Phase 4: CTA buttons */}
            <div className={`mt-7 flex items-center gap-3 md:gap-4 flex-wrap justify-center hero-phase hero-phase-cta ${phase >= 4 ? 'hero-phase-visible' : ''}`}>
              <div ref={ctaRef} className="hero-magnetic-wrap">
                <button
                  onClick={scrollToProjects}
                  className="hero-cta-primary-new group relative overflow-hidden"
                >
                  <span className="hero-btn-text-wrap relative z-10 flex items-center gap-2">
                    <span className="block overflow-hidden relative">
                      <span className="hero-btn-text block transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full">
                        View My Work
                      </span>
                      <span className="hero-btn-text-clone absolute inset-0 block translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0">
                        View My Work
                      </span>
                    </span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1">
                      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </span>
                  <span className="hero-cta-shine" />
                </button>
              </div>

              {profile?.resume_url && (
                <div ref={resumeRef} className="hero-magnetic-wrap">
                  <button
                    onClick={() => resumeService.download()}
                    className="hero-cta-secondary group"
                  >
                    <span>Download Resume</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-y-0.5">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* ─── Phase 5: Hero image — full-width, no bottom mask, bleeds past the fold ─── */}
      <div className={`hero-image-section relative z-10 ${phase >= 5 ? 'hero-image-visible' : ''}`}>
        <div className="hero-image-container">
          <img
            src="/gagan-hero.png"
            alt={profile?.full_name ? `${profile.full_name} — Hero Visual` : 'Hero Visual'}
            className="hero-image"
            width={1579}
            height={766}
            draggable={false}
          />
        </div>
      </div>
    </section>
  );
};
