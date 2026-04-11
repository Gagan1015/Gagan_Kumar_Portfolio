import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { useExperiences } from '../hooks/usePortfolio';
import { Experience as ExperienceItem, SectionId } from '../types';
import { optimizeCloudinaryUrl } from '../utils/cloudinary';

const formatEmploymentType = (type: ExperienceItem['employment_type']): string => {
  const map: Record<ExperienceItem['employment_type'], string> = {
    full_time: 'Full-time',
    part_time: 'Part-time',
    contract: 'Contract',
    freelance: 'Freelance',
  };

  return map[type] || type;
};

const formatDateRange = (start: string, end: string | null, isCurrent: boolean): string => {
  const startDate = new Date(start);
  const startString = startDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  if (isCurrent) return `${startString} - Present`;
  if (!end) return startString;

  const endDate = new Date(end);
  const endString = endDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  return `${startString} - ${endString}`;
};

const getCompanyInitials = (company: string): string => {
  const words = company.split(/\s+/).filter(Boolean);
  return words.slice(0, 2).map((word) => word[0]?.toUpperCase() || '').join('') || 'EX';
};

const getLogoSource = (logo: string | null): string | null => {
  if (!logo) return null;
  return optimizeCloudinaryUrl(logo, 160);
};

interface ExperienceCardProps {
  desktopHoverEnabled: boolean;
  experience: ExperienceItem;
  index: number;
  isExpanded: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
  onToggle: () => void;
  prefersReducedMotion: boolean;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({
  desktopHoverEnabled,
  experience,
  index,
  isExpanded,
  onActivate,
  onDeactivate,
  onToggle,
  prefersReducedMotion,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);
  const logoSrc = getLogoSource(experience.company_logo);
  const displayRange = formatDateRange(experience.start_date, experience.end_date, experience.is_current);

  useEffect(() => {
    if (!contentRef.current) return;
    setContentHeight(contentRef.current.scrollHeight);
  }, [experience, isExpanded]);

  const handleMouseEnter = () => {
    if (desktopHoverEnabled) {
      onActivate();
    }
  };

  const handleMouseLeave = () => {
    if (desktopHoverEnabled) {
      onDeactivate();
    }
  };

  const handleButtonClick = () => {
    onToggle();
  };

  return (
    <article
      className="group relative border-b border-neutral-200 dark:border-neutral-800 last:border-b-0"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative grid gap-4 py-5 md:grid-cols-[2.75rem_minmax(0,1fr)] md:gap-6 md:py-7">
        <div className="relative hidden md:flex justify-center">
          <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-neutral-200 dark:bg-neutral-800" />
          <div
            className={`absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-sky-500 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
              isExpanded ? 'origin-top scale-y-100' : 'origin-top scale-y-0'
            }`}
          />
          <span
            className={`relative mt-3 h-3 w-3 rounded-full border transition-all duration-500 ${
              isExpanded
                ? 'border-sky-500 bg-[#0f172a] shadow-[0_0_0_4px_rgba(59,130,246,0.12)] dark:bg-sky-950'
                : 'border-neutral-500 bg-black dark:border-neutral-500 dark:bg-white'
            }`}
          />
        </div>

        <div>
          <button
            type="button"
            onClick={handleButtonClick}
            onFocus={onActivate}
            className="block w-full text-left"
            aria-expanded={isExpanded}
          >
            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-start md:gap-6">
              <div className="flex min-w-0 items-start gap-3 md:gap-4">
                <div
                  className={`flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-md border text-xs font-mono uppercase tracking-[0.18em] transition-all duration-500 md:h-14 md:w-14 md:text-sm ${
                    isExpanded
                      ? 'border-neutral-700 bg-neutral-950 text-sky-400 shadow-[0_10px_30px_rgba(0,0,0,0.18)] dark:border-neutral-700 dark:bg-neutral-950'
                      : 'border-neutral-200 bg-neutral-50 text-neutral-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-400'
                  }`}
                >
                  {logoSrc ? (
                    <img
                      src={logoSrc}
                      alt={`${experience.company} logo`}
                      className="h-full w-full object-contain p-2"
                      width={56}
                      height={56}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <span>{getCompanyInitials(experience.company)}</span>
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-start gap-3">
                    <span className="mt-1 font-mono text-[11px] uppercase tracking-[0.22em] text-neutral-300 dark:text-neutral-700 md:hidden">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="min-w-0">
                      <h3
                        className={`truncate font-display text-[1.2rem] leading-tight tracking-tight transition-colors duration-400 sm:text-[1.35rem] md:text-[2rem] ${
                          isExpanded
                            ? 'text-sky-600 dark:text-sky-400'
                            : 'text-black dark:text-white'
                        }`}
                      >
                        {experience.company}
                      </h3>

                      <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-[13px] leading-relaxed text-neutral-500 dark:text-neutral-400 md:mt-2 md:gap-x-3 md:gap-y-2 md:text-sm">
                        <span className="inline-flex items-center gap-2">
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect x="3" y="7" width="18" height="13" rx="2" />
                            <path d="M16 20V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v15" />
                          </svg>
                          <span className="font-medium text-black dark:text-white">{experience.position}</span>
                        </span>

                        <span className="h-1 w-1 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                        <span className="font-mono text-[11px] uppercase tracking-[0.2em]">
                          {formatEmploymentType(experience.employment_type)}
                        </span>

                        {experience.location && (
                          <>
                            <span className="h-1 w-1 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                            <span>{experience.location}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start justify-start md:justify-end">
                <div
                  className={`inline-flex items-center gap-2 rounded-md border px-3.5 py-2 text-[13px] transition-all duration-500 md:px-4 md:text-sm ${
                    isExpanded
                      ? 'border-neutral-700 bg-neutral-950 text-neutral-200 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-200'
                      : 'border-neutral-200 bg-neutral-50 text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400'
                  }`}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <span className="font-medium">{displayRange}</span>
                </div>
              </div>
            </div>
          </button>

          <div
            className="overflow-hidden transition-[max-height,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
            style={{
              maxHeight: isExpanded ? `${contentHeight}px` : '0px',
              opacity: isExpanded ? 1 : 0,
            }}
          >
            <div
              ref={contentRef}
              className={`pt-4 md:pl-[4.2rem] ${
                prefersReducedMotion ? '' : 'transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]'
              } ${isExpanded ? 'translate-y-0' : 'translate-y-2'}`}
            >
              {experience.description && (
                <p className="max-w-4xl text-[0.95rem] leading-relaxed text-neutral-700 dark:text-neutral-300 md:text-[1.05rem]">
                  {experience.description}
                </p>
              )}

              {experience.responsibilities && experience.responsibilities.length > 0 && (
                <div className="mt-5 border-l border-sky-500/40 pl-4 md:pl-6">
                  <ul className="space-y-3">
                    {experience.responsibilities.map((responsibility) => (
                      <li key={responsibility} className="flex items-start gap-3 text-[0.95rem] leading-relaxed text-neutral-500 dark:text-neutral-400 md:text-base">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-sky-500" />
                        <span>{responsibility}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {(experience.technologies?.length || experience.website_url) && (
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  {experience.technologies?.map((technology) => (
                    <span
                      key={technology}
                      className="rounded-md border border-neutral-200 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.16em] text-neutral-500 dark:border-neutral-800 dark:text-neutral-400"
                    >
                      {technology}
                    </span>
                  ))}

                  {experience.website_url && (
                    <a
                      href={experience.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(event) => event.stopPropagation()}
                      className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-black transition-opacity hover:opacity-70 dark:text-white"
                    >
                      Visit site
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="7" y1="17" x2="17" y2="7" />
                        <polyline points="7 7 17 7 17 17" />
                      </svg>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export const Experience: React.FC = () => {
  const { data: experiences, isLoading, error } = useExperiences();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [desktopHoverEnabled, setDesktopHoverEnabled] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 1024px)');
    const syncDesktopHover = () => setDesktopHoverEnabled(mediaQuery.matches);

    syncDesktopHover();
    mediaQuery.addEventListener('change', syncDesktopHover);

    return () => mediaQuery.removeEventListener('change', syncDesktopHover);
  }, []);

  const handleActivate = useCallback((id: number) => {
    setExpandedId(id);
  }, []);

  const handleDeactivate = useCallback((id: number) => {
    setExpandedId((previous) => (previous === id ? null : previous));
  }, []);

  const handleToggle = useCallback((id: number) => {
    setExpandedId((previous) => (previous === id ? null : id));
  }, []);

  const currentRoles = useMemo(
    () => experiences?.filter((experience) => experience.is_current).length ?? 0,
    [experiences]
  );

  if (isLoading) {
    return (
      <section id={SectionId.Experience} className="bg-[#f4f4f4] py-16 transition-colors duration-300 dark:bg-geo-dark-bg md:py-32">
        <div className="section-frame">
          <div className="section-frame-inner animate-pulse">
            <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-12">
              <div className="md:col-span-4">
                <div className="h-12 w-56 bg-neutral-200 dark:bg-neutral-800" />
                <div className="mt-4 h-px w-12 bg-neutral-200 dark:bg-neutral-800" />
                <div className="mt-4 h-4 w-32 bg-neutral-200 dark:bg-neutral-800" />
              </div>
              <div className="md:col-span-8">
                <div className="ml-auto h-16 max-w-xl bg-neutral-200 dark:bg-neutral-800" />
              </div>
            </div>

            <div className="h-px bg-neutral-200 dark:bg-neutral-800" />

            <div className="mt-6 space-y-0">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-28 border-b border-neutral-200 bg-white dark:border-neutral-800 dark:bg-black" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !experiences) {
    return (
      <section id={SectionId.Experience} className="bg-[#f4f4f4] py-16 transition-colors duration-300 dark:bg-geo-dark-bg md:py-32">
        <div className="section-frame">
          <div className="section-frame-inner">
            <p className="text-red-500">Error loading experience data. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id={SectionId.Experience}
      className="bg-[#f4f4f4] py-16 transition-colors duration-300 dark:bg-geo-dark-bg md:py-32"
    >
      <div className="section-frame">
        <div className="section-frame-inner">
          <div className="mb-12 grid grid-cols-1 gap-6 md:mb-16 md:grid-cols-12 md:gap-8">
            <div className="md:col-span-4">
              <h2 className="font-display text-4xl font-medium tracking-tight text-black dark:text-white">
                EXPERIENCE<span className="text-neutral-300 dark:text-neutral-700">.</span>
              </h2>
              <div className="mt-4 h-px w-12 bg-black dark:bg-white" />
              <p className="mt-4 text-sm font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-600">
                Career Timeline
              </p>
            </div>
            <div className="md:col-span-8 md:flex md:items-end md:justify-end">
              <div className="md:max-w-xl md:text-right">
                <p className="text-lg leading-relaxed text-neutral-500 dark:text-neutral-400">
                  Roles across product delivery, implementation, and shipping, presented as a hover-first timeline that opens into the actual work behind each position.
                </p>
                <p className="mt-4 text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-400 dark:text-neutral-600">
                  {desktopHoverEnabled ? 'Hover to expand on desktop' : 'Tap to expand on touch devices'}
                </p>
              </div>
            </div>
          </div>

          <div className="h-px bg-black dark:bg-white" />

          <div className="hidden grid-cols-3 gap-px bg-neutral-200 dark:bg-neutral-800 md:grid">
            <div className="bg-[#f4f4f4] px-3 py-4 dark:bg-black md:px-5 md:py-5">
              <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-400 dark:text-neutral-600">
                Roles
              </p>
              <p className="mt-3 font-display text-[2rem] tracking-tight text-black dark:text-white md:text-3xl">{experiences.length}</p>
            </div>
            <div className="bg-[#f4f4f4] px-3 py-4 dark:bg-black md:px-5 md:py-5">
              <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-400 dark:text-neutral-600">
                Current
              </p>
              <p className="mt-3 font-display text-[2rem] tracking-tight text-black dark:text-white md:text-3xl">{currentRoles}</p>
            </div>
            <div className="bg-[#f4f4f4] px-3 py-4 dark:bg-black md:px-5 md:py-5">
              <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-neutral-400 dark:text-neutral-600">
                Format
              </p>
              <p className="mt-3 text-[12px] leading-snug text-neutral-500 dark:text-neutral-400 md:text-sm md:leading-relaxed">
                Compact by default, expanded on hover with a smooth reveal and a tap fallback for smaller devices.
              </p>
            </div>
          </div>

          <div className="h-px bg-black dark:bg-white" />

          <div className="relative">
            {experiences.map((experience, index) => (
              <ExperienceCard
                key={experience.id}
                desktopHoverEnabled={desktopHoverEnabled}
                experience={experience}
                index={index}
                isExpanded={expandedId === experience.id}
                onActivate={() => handleActivate(experience.id)}
                onDeactivate={() => handleDeactivate(experience.id)}
                onToggle={() => handleToggle(experience.id)}
                prefersReducedMotion={prefersReducedMotion}
              />
            ))}
          </div>

          <div className="h-px bg-black dark:bg-white" />
        </div>
      </div>
    </section>
  );
};
