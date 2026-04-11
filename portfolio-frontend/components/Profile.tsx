import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useProfile, useSkillsGrouped } from '../hooks/usePortfolio';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { SectionId } from '../types';

function useCountUp(target: number, duration: number, prefersReducedMotion: boolean) {
  const [count, setCount] = useState(prefersReducedMotion ? target : 0);
  const hasAnimated = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (prefersReducedMotion) {
      setCount(target);
    }
  }, [prefersReducedMotion, target]);

  const ref = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      if (!node || target <= 0 || hasAnimated.current) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting || hasAnimated.current) return;

          hasAnimated.current = true;
          observer.disconnect();

          if (prefersReducedMotion) {
            setCount(target);
            return;
          }

          let start = 0;
          const step = target / (duration / 16);
          const timer = window.setInterval(() => {
            start += step;
            if (start >= target) {
              setCount(target);
              window.clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
        },
        { threshold: 0.35 }
      );

      observer.observe(node);
      observerRef.current = observer;
    },
    [duration, prefersReducedMotion, target]
  );

  return { count, ref };
}

function highlightKeywords(text: string): React.ReactNode[] {
  const keywords = [
    'Full-Stack',
    'Laravel',
    'PHP',
    'Node.js',
    'MySQL',
    'REST APIs',
    'APIs',
    'SaaS applications',
    'dynamic',
    'frontend',
    'backend',
    'scalable',
  ];

  const sorted = [...keywords].sort((a, b) => b.length - a.length);
  const regex = new RegExp(`(${sorted.map((keyword) => keyword.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')).join('|')})`, 'gi');

  return text.split(regex).map((part, index) => {
    const isKeyword = sorted.some((keyword) => keyword.toLowerCase() === part.toLowerCase());

    if (!isKeyword) {
      return <span key={index}>{part}</span>;
    }

    return (
      <span
        key={index}
        className="underline decoration-2 underline-offset-[0.18em] decoration-[#e27933]/70 dark:decoration-[#f0a35d]/70"
      >
        {part}
      </span>
    );
  });
}

export const Profile: React.FC = () => {
  const { data: profile, isLoading, error } = useProfile();
  const { data: skillsGrouped } = useSkillsGrouped();
  const prefersReducedMotion = usePrefersReducedMotion();

  const availabilityStatus = profile?.availability_status ?? 'available';
  const availabilityTone = availabilityStatus === 'available'
    ? 'bg-emerald-500'
    : availabilityStatus === 'busy'
      ? 'bg-amber-500'
      : 'bg-rose-500';
  const availabilityText = availabilityStatus === 'available'
    ? 'Open to Work'
    : availabilityStatus === 'busy'
      ? 'Busy'
      : 'Unavailable';

  const skillGroups = useMemo(() => Object.entries(skillsGrouped ?? {}), [skillsGrouped]);
  const techCount = skillGroups.reduce((total, [, skills]) => total + skills.length, 0) || 10;
  const domainCount = skillGroups.length || 3;
  const spotlightDomains = [...skillGroups]
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 4)
    .map(([name]) => name);

  const summary = profile?.summary || profile?.bio || 'I build reliable products with a strong backend core and crisp frontend execution.';
  const yearsOfExperience = Math.max(profile?.years_of_experience || 1, 1);
  const stats = useMemo(() => ([
    {
      key: 'years',
      count: yearsOfExperience,
      duration: 1400,
      suffix: '+',
      label: 'Years',
      detail: 'Shipping production work',
    },
    {
      key: 'stack',
      count: techCount,
      duration: 1700,
      suffix: '+',
      label: 'Tools',
      detail: 'Across frontend and backend',
    },
    {
      key: 'domains',
      count: domainCount,
      duration: 1200,
      suffix: '',
      label: 'Domains',
      detail: 'Core areas of depth',
    },
  ]), [domainCount, techCount, yearsOfExperience]);

  const yearsCounter = useCountUp(stats[0].count, stats[0].duration, prefersReducedMotion);
  const toolsCounter = useCountUp(stats[1].count, stats[1].duration, prefersReducedMotion);
  const domainsCounter = useCountUp(stats[2].count, stats[2].duration, prefersReducedMotion);
  const counterRefs = [yearsCounter, toolsCounter, domainsCounter];

  if (isLoading) {
    return (
      <section id={SectionId.Profile} className="bg-[#f4f4f4] py-16 transition-colors duration-300 dark:bg-geo-dark-bg md:py-32">
        <div className="section-frame">
          <div className="section-frame-inner animate-pulse">
            <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-12">
              <div className="md:col-span-4">
                <div className="h-12 w-44 bg-neutral-200 dark:bg-neutral-800" />
                <div className="mt-4 h-px w-12 bg-neutral-200 dark:bg-neutral-800" />
                <div className="mt-4 h-4 w-28 bg-neutral-200 dark:bg-neutral-800" />
              </div>
              <div className="md:col-span-8">
                <div className="ml-auto h-16 max-w-xl bg-neutral-200 dark:bg-neutral-800" />
              </div>
            </div>

            <div className="h-px bg-neutral-200 dark:bg-neutral-800" />

            <div className="grid gap-0 lg:grid-cols-12">
              <div className="h-72 border-b border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 lg:col-span-7 lg:border-b-0 lg:border-r" />
              <div className="grid gap-px bg-neutral-200 dark:bg-neutral-800 sm:grid-cols-2 lg:col-span-5">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="h-36 bg-neutral-100 dark:bg-neutral-900" />
                ))}
              </div>
            </div>

            <div className="h-px bg-neutral-200 dark:bg-neutral-800" />
          </div>
        </div>
      </section>
    );
  }

  if (error || !profile) {
    return (
      <section id={SectionId.Profile} className="bg-[#f4f4f4] py-16 transition-colors duration-300 dark:bg-geo-dark-bg md:py-32">
        <div className="section-frame">
          <div className="section-frame-inner">
            <p className="text-red-500">Error loading profile data. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id={SectionId.Profile}
      className="bg-[#f4f4f4] py-16 transition-colors duration-300 dark:bg-geo-dark-bg md:py-32"
    >
      <div className="section-frame">
        <div className="section-frame-inner">
          <div className="mb-12 grid grid-cols-1 gap-6 md:mb-16 md:grid-cols-12 md:gap-8">
            <div className="md:col-span-4">
              <h2 className="font-display text-4xl font-medium tracking-tight text-black dark:text-white">
                PROFILE<span className="text-neutral-300 dark:text-neutral-700">.</span>
              </h2>
              <div className="mt-4 h-px w-12 bg-black dark:bg-white" />
              <p className="mt-4 text-sm font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-600">
                Core Snapshot
              </p>
            </div>
            <div className="md:col-span-8 md:flex md:items-end md:justify-end">
              <p className="text-lg leading-relaxed text-neutral-500 dark:text-neutral-400 md:max-w-xl md:text-right">
                Full-stack execution with a backend-first mindset, resilient systems thinking, and interfaces that feel considered instead of overdesigned.
              </p>
            </div>
          </div>

          <div className="h-px bg-black dark:bg-white" />

          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="border-b border-neutral-200 dark:border-neutral-800 lg:col-span-7 lg:border-b-0 lg:border-r">
              <div className="p-6 md:p-8 lg:p-10">
                <div className="mb-8 flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-2 border border-neutral-200 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
                    <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${availabilityTone}`}>
                      <span className={`absolute inset-0 rounded-full ${availabilityTone} animate-ping opacity-60 motion-reduce:hidden`} />
                    </span>
                    {availabilityText}
                  </span>
                  <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-600">
                    {profile.location || 'Remote'}
                  </span>
                </div>

                <p className="max-w-3xl font-display text-[1.1rem] leading-[1.5] tracking-tight text-black dark:text-white sm:text-[1.25rem] md:text-[1.5rem] md:leading-[1.35]">
                  {highlightKeywords(summary)}
                </p>

                <div className="mt-8 grid gap-6 border-t border-neutral-200 pt-6 dark:border-neutral-800 md:grid-cols-[minmax(0,1.35fr)_minmax(240px,0.65fr)]">
                  <div>
                    <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-400 dark:text-neutral-600">
                      Current Focus
                    </p>
                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                      Backend systems, APIs, scalable data flows, and frontend layers that communicate structure clearly.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-px border border-neutral-200 bg-neutral-200 dark:border-neutral-800 dark:bg-neutral-800">
                    {spotlightDomains.map((domain) => (
                      <div
                        key={domain}
                        className="bg-[#f4f4f4] px-3 py-3 text-[11px] font-mono uppercase tracking-[0.18em] text-neutral-600 dark:bg-black dark:text-neutral-400"
                      >
                        {domain}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="space-y-px bg-neutral-200 dark:bg-neutral-800">
                <div className="grid grid-cols-3 gap-px bg-neutral-200 dark:bg-neutral-800">
                  {stats.map((stat, index) => {
                    const counter = counterRefs[index];

                    return (
                      <div
                        key={stat.key}
                        ref={counter.ref}
                        className="bg-[#f4f4f4] px-3 py-4 transition-colors duration-300 dark:bg-black md:px-5 md:py-6"
                      >
                        <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-neutral-400 dark:text-neutral-600 md:text-[11px] md:tracking-[0.22em]">
                          {stat.label}
                        </p>
                        <p className="mt-3 font-display text-[2rem] leading-none tracking-tight text-black dark:text-white md:mt-5 md:text-5xl">
                          {counter.count}
                          {stat.suffix}
                        </p>
                        <p className="mt-2 text-[12px] leading-snug text-neutral-500 dark:text-neutral-400 md:mt-3 md:max-w-[15rem] md:text-sm md:leading-relaxed">
                          {stat.detail}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-[#f4f4f4] px-5 py-6 dark:bg-black">
                  <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-400 dark:text-neutral-600">
                    Reach
                  </p>
                  <a
                    href={`mailto:${profile.email}`}
                    className="mt-5 inline-flex items-center gap-2 font-display text-2xl leading-tight tracking-tight text-black transition-opacity hover:opacity-70 dark:text-white"
                  >
                    {profile.email}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                  </a>
                  <p className="mt-3 max-w-[20rem] text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                    Available for full-stack builds, backend-heavy systems, and product-focused collaboration.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-black dark:bg-white" />
        </div>
      </div>
    </section>
  );
};
