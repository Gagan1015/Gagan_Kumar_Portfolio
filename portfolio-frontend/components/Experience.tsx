import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SectionId } from '../types';
import { useExperiences } from '../hooks/usePortfolio';

/* ─── Format employment type ─── */
const formatEmploymentType = (type: string): string => {
  const map: Record<string, string> = {
    full_time: 'Full-time',
    part_time: 'Part-time',
    contract: 'Contract',
    freelance: 'Freelance',
  };
  return map[type] || type;
};

/* ─── Format date range ─── */
const formatDateRange = (start: string, end: string | null, isCurrent: boolean): string => {
  const startDate = new Date(start);
  const startStr = startDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  if (isCurrent) return `${startStr} — Present`;
  if (!end) return startStr;
  const endDate = new Date(end);
  const endStr = endDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  return `${startStr} — ${endStr}`;
};

/* ─── Calculate duration string ─── */
const calcDuration = (start: string, end: string | null, isCurrent: boolean): string => {
  const s = new Date(start);
  const e = isCurrent || !end ? new Date() : new Date(end);
  const totalMonths = (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth());
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  if (years === 0) return `${months} mo`;
  if (months === 0) return `${years} yr`;
  return `${years} yr ${months} mo`;
};

/* ═══════════════════════════════════════════
   EXPERIENCE CARD — Accordion-style expandable
   ═══════════════════════════════════════════ */
interface ExperienceCardProps {
  job: {
    id: number;
    company: string;
    position: string;
    location: string | null;
    employment_type: string;
    start_date: string;
    end_date: string | null;
    is_current: boolean;
    description: string | null;
    responsibilities: string[] | null;
    technologies: string[] | null;
    company_logo: string | null;
    website_url: string | null;
  };
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  isVisible: boolean;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({
  job,
  index,
  isExpanded,
  onToggle,
  isVisible,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [isExpanded, job]);

  return (
    <div
      className={`exp-card transition-all duration-700 ease-out ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-12'
      }`}
      style={{ transitionDelay: `${150 + index * 100}ms` }}
    >
      {/* ─── Clickable header ─── */}
      <button
        onClick={onToggle}
        className="exp-card-header group"
        aria-expanded={isExpanded}
      >
        {/* Left: Timeline node + number */}
        <div className="exp-timeline-col">
          <div className={`exp-node ${isExpanded ? 'exp-node--active' : ''} ${job.is_current ? 'exp-node--current' : ''}`}>
            {job.is_current && (
              <span className="absolute inset-0 rounded-full animate-ping bg-green-500/30" />
            )}
          </div>
          <span className="exp-index">{String(index + 1).padStart(2, '0')}</span>
        </div>

        {/* Center: Role & company */}
        <div className="exp-header-main">
          <div className="exp-header-top-row">
            <h3 className="exp-role">{job.position}</h3>
            {job.is_current && (
              <span className="exp-current-badge">Current</span>
            )}
          </div>
          <div className="exp-header-meta">
            <span className="exp-company">
              {job.website_url ? (
                <a
                  href={job.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="exp-company-link"
                >
                  {job.company}
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="inline-block ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
                  </svg>
                </a>
              ) : (
                job.company
              )}
            </span>
            <span className="exp-meta-dot" />
            <span className="exp-meta-text">{formatEmploymentType(job.employment_type)}</span>
            {job.location && (
              <>
                <span className="exp-meta-dot" />
                <span className="exp-meta-text">{job.location}</span>
              </>
            )}
          </div>
        </div>

        {/* Right: Date + expand icon */}
        <div className="exp-header-right">
          <div className="exp-date-col">
            <span className="exp-date">{formatDateRange(job.start_date, job.end_date, job.is_current)}</span>
            <span className="exp-duration">{calcDuration(job.start_date, job.end_date, job.is_current)}</span>
          </div>
          <div className={`exp-expand-icon ${isExpanded ? 'exp-expand-icon--open' : ''}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" className={`exp-expand-vline ${isExpanded ? 'exp-expand-vline--hidden' : ''}`} />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </div>
        </div>
      </button>

      {/* ─── Expandable content ─── */}
      <div
        className="exp-content-wrapper"
        style={{ maxHeight: isExpanded ? `${contentHeight}px` : '0px' }}
      >
        <div ref={contentRef} className="exp-content">
          {/* Description */}
          {job.description && (
            <p className="exp-description">{job.description}</p>
          )}

          {/* Responsibilities */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <div className="exp-responsibilities">
              <h4 className="exp-sub-label">Key Responsibilities</h4>
              <ul className="exp-resp-list">
                {job.responsibilities.map((item, i) => (
                  <li key={i} className="exp-resp-item">
                    <span className="exp-resp-arrow">&#8250;</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Technologies */}
          {job.technologies && job.technologies.length > 0 && (
            <div className="exp-tech-section">
              <h4 className="exp-sub-label">Stack</h4>
              <div className="exp-tech-list">
                {job.technologies.map((tech) => (
                  <span key={tech} className="exp-tech-tag">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   EXPERIENCE SECTION
   ═══════════════════════════════════════════ */
export const Experience: React.FC = () => {
  const { data: experiences, isLoading, error } = useExperiences();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  /* Intersection Observer for entrance animation */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleToggle = useCallback(
    (id: number) => {
      setExpandedId((prev) => (prev === id ? null : id));
    },
    []
  );

  /* ─── Section wrapper classes ─── */
  const sectionClasses =
    'bg-white dark:bg-geo-dark-bg py-24 md:py-32 px-6 md:px-12 border-b border-neutral-200 dark:border-geo-dark-border transition-colors duration-300';

  return (
    <section id={SectionId.Experience} ref={sectionRef} className={sectionClasses}>
      <div className="max-w-7xl mx-auto">
        {/* ─── Loading state ─── */}
        {isLoading && (
          <>
            <div className="mb-16">
              <h2 className="font-display text-4xl font-medium tracking-tight text-black dark:text-white">
                EXPERIENCE<span className="text-neutral-300 dark:text-neutral-700">.</span>
              </h2>
            </div>
            <div className="space-y-6 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="exp-skeleton">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-3 h-3 rounded-full bg-neutral-200 dark:bg-neutral-800" />
                    <div className="h-6 w-48 bg-neutral-200 dark:bg-neutral-800 rounded" />
                  </div>
                  <div className="h-4 w-72 bg-neutral-100 dark:bg-neutral-800/60 rounded ml-7" />
                  <div className="h-4 w-32 bg-neutral-100 dark:bg-neutral-800/60 rounded ml-7 mt-2" />
                </div>
              ))}
            </div>
          </>
        )}

        {/* ─── Error state ─── */}
        {!isLoading && (error || !experiences) && (
          <p className="text-red-500">Error loading experience data. Please try again later.</p>
        )}

        {/* ─── Data loaded ─── */}
        {!isLoading && experiences && experiences.length > 0 && (
          <>
            {/* Section header */}
            <div
              className={`mb-20 transition-all duration-700 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-neutral-400 dark:text-neutral-600 block mb-3">
                    Career Path
                  </span>
                  <h2 className="font-display text-4xl md:text-5xl font-medium tracking-tight text-black dark:text-white">
                    EXPERIENCE<span className="text-neutral-300 dark:text-neutral-700">.</span>
                  </h2>
                  <div className="w-12 h-1 bg-black dark:bg-white mt-6" />
                </div>
                <p className="text-sm text-neutral-500 dark:text-neutral-500 max-w-xs font-mono leading-relaxed">
                  {experiences.length} role{experiences.length !== 1 ? 's' : ''} &mdash; click to expand details
                </p>
              </div>
            </div>

            {/* Timeline thread + cards */}
            <div className="exp-timeline">
              {experiences.map((job, index) => (
                <ExperienceCard
                  key={job.id}
                  job={job}
                  index={index}
                  isExpanded={expandedId === job.id}
                  onToggle={() => handleToggle(job.id)}
                  isVisible={isVisible}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};
