import React from 'react';
import { createPortal } from 'react-dom';
import { optimizeCloudinaryUrl } from '../utils/cloudinary';
import { Project } from '../types';
import { QuickViewPhase } from '../hooks/useProjectQuickView';

interface ProjectQuickViewProps {
  closeButtonRef: React.RefObject<HTMLButtonElement | null>;
  modalCardRef: React.RefObject<HTMLDivElement | null>;
  onClose: () => void;
  phase: QuickViewPhase;
  prefersReducedMotion: boolean;
  project: Project | null;
  transform: string;
  useSharedTransform: boolean;
}

const formatDateRange = (startDate: string | null, endDate: string | null): string | null => {
  if (!startDate && !endDate) return null;

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });

  if (startDate && endDate) return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  if (startDate) return `${formatDate(startDate)} - Present`;
  if (endDate) return `Until ${formatDate(endDate)}`;
  return null;
};

const getProjectSummary = (project: Project) => {
  if (!project.long_description) {
    return project.description ? [project.description] : [];
  }

  const paragraphs = project.long_description
    .split('\n')
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return paragraphs.length > 0 ? paragraphs.slice(0, 2) : (project.description ? [project.description] : []);
};

export const ProjectQuickView: React.FC<ProjectQuickViewProps> = ({
  closeButtonRef,
  modalCardRef,
  onClose,
  phase,
  prefersReducedMotion,
  project,
  transform,
  useSharedTransform,
}) => {
  if (!project || phase === 'closed' || typeof document === 'undefined') {
    return null;
  }

  const timeline = formatDateRange(project.start_date, project.end_date);
  const summaryParagraphs = getProjectSummary(project);
  const primaryImage = project.image_url || project.gallery_images?.[0] || null;
  const hasFeatures = Boolean(project.features && project.features.length > 0);
  const actionLinks = [
    project.website_url ? { href: project.website_url, label: 'Live Website', variant: 'primary' as const } : null,
    project.demo_url ? { href: project.demo_url, label: 'Demo', variant: 'secondary' as const } : null,
    project.github_url ? { href: project.github_url, label: 'Source Code', variant: 'secondary' as const } : null,
  ].filter(Boolean) as Array<{ href: string; label: string; variant: 'primary' | 'secondary' }>;

  const isOpen = phase === 'open';
  const shouldHideCard = phase === 'measuring';
  const shouldAnimateTransform = useSharedTransform && (phase === 'open' || phase === 'closing');

  return createPortal(
    <div className="fixed inset-0 z-[90]">
      <button
        type="button"
        aria-label={`Close ${project.title} preview`}
        className={`absolute inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      <div className="relative flex min-h-full items-start justify-center overflow-y-auto p-3 pb-24 md:p-5 md:pb-6 lg:items-center lg:p-10">
        <div
          ref={modalCardRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`project-quick-view-title-${project.id}`}
          className="relative my-auto max-h-[calc(100dvh-6.5rem)] w-full max-w-5xl overflow-y-auto border border-neutral-200 bg-white shadow-[0_32px_80px_rgba(0,0,0,0.2)] dark:border-geo-dark-border dark:bg-[#080808] dark:shadow-[0_32px_80px_rgba(0,0,0,0.55)] md:max-h-[calc(100dvh-2.5rem)] xl:overflow-hidden"
          style={{
            opacity: shouldHideCard ? 0 : 1,
            transform: prefersReducedMotion || !useSharedTransform || isOpen ? 'translate3d(0, 0, 0) scale(1, 1)' : transform,
            transformOrigin: 'center center',
            transition: prefersReducedMotion || !shouldAnimateTransform
              ? 'none'
              : 'transform 440ms cubic-bezier(0.22, 1, 0.36, 1), opacity 220ms ease',
            willChange: 'transform, opacity',
          }}
        >
          <div className="absolute inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-black/10 via-black/5 to-transparent dark:from-white/6 dark:via-transparent" />

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white/90 text-black backdrop-blur-md transition-all duration-300 hover:scale-[1.03] hover:border-black/30 dark:border-white/10 dark:bg-black/75 dark:text-white dark:hover:border-white/25"
            aria-label="Close project preview"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <div className="grid grid-cols-1 xl:max-h-[calc(100dvh-2.5rem)] xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
            <div className="relative aspect-[16/9] min-h-0 overflow-hidden border-b border-neutral-200 bg-neutral-100 dark:border-geo-dark-border dark:bg-[#050505] md:aspect-[16/8] xl:min-h-[620px] xl:border-b-0 xl:border-r xl:aspect-auto">
              {primaryImage ? (
                <div className="flex h-full w-full items-center justify-center p-3 md:p-5 xl:p-6">
                  <img
                    src={optimizeCloudinaryUrl(primaryImage, 1400)}
                    alt={project.title}
                    className="h-full w-full object-contain object-top"
                    width={1400}
                    height={900}
                    decoding="async"
                  />
                </div>
              ) : (
                <div className="flex h-full items-center justify-center bg-neutral-100 text-[11px] font-mono uppercase tracking-[0.25em] text-neutral-400 dark:bg-neutral-900 dark:text-neutral-600">
                  Project Preview
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/8 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-4 md:p-6">
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center border border-white/25 bg-black/30 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-white/85 backdrop-blur-sm">
                    {project.category || 'General'}
                  </span>
                  {project.status && (
                    <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-white/60">
                      {project.status}
                    </span>
                  )}
                  {timeline && (
                    <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-white/55">
                      {timeline}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col xl:max-h-[calc(100dvh-2.5rem)] xl:overflow-y-auto">
              <div className="flex-1 px-5 pb-8 pt-16 md:px-7 md:pb-8 md:pt-18 xl:px-8 xl:pb-8 xl:pt-20">
                <h2
                  id={`project-quick-view-title-${project.id}`}
                  className="font-display text-[2rem] font-semibold tracking-tight text-black dark:text-white md:text-[2.5rem]"
                >
                  {project.title}
                </h2>

                {project.technologies && project.technologies.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.technologies.slice(0, 8).map((tech) => (
                      <span
                        key={tech}
                        className="inline-flex items-center border border-neutral-200 px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.16em] text-neutral-500 dark:border-neutral-800 dark:text-neutral-400"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                {summaryParagraphs.length > 0 && (
                  <div className="mt-6 space-y-4 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 md:text-[15px]">
                    {summaryParagraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                )}

                {hasFeatures && (
                  <div className="mt-8 border-t border-neutral-200 pt-6 dark:border-neutral-800">
                    <p className="mb-4 text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-600">
                      Key Features
                    </p>
                    <ul className="space-y-3">
                      {project.features?.slice(0, 6).map((feature) => (
                        <li key={feature} className="flex items-start gap-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-black dark:bg-white" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {(project.client || project.role) && (
                  <div className="mt-8 grid grid-cols-1 gap-4 border-t border-neutral-200 pt-6 dark:border-neutral-800 sm:grid-cols-2">
                    {project.client && (
                      <div>
                        <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-600">
                          Client
                        </p>
                        <p className="mt-2 text-sm text-black dark:text-white">{project.client}</p>
                      </div>
                    )}
                    {project.role && (
                      <div>
                        <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-600">
                          Role
                        </p>
                        <p className="mt-2 text-sm text-black dark:text-white">{project.role}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="border-t border-neutral-200 bg-white px-5 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))] dark:border-neutral-800 dark:bg-[#080808] md:px-7 md:py-5 md:pb-5 xl:sticky xl:bottom-0 xl:z-10 xl:bg-white/96 xl:backdrop-blur-md dark:xl:bg-[#080808]/96 xl:px-8">
                <div className="flex flex-wrap gap-3">
                  {actionLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-2 px-4 py-3 text-[11px] font-mono uppercase tracking-[0.18em] transition-all duration-300 ${
                        link.variant === 'primary'
                          ? 'border border-black bg-black text-white hover:opacity-85 dark:border-white dark:bg-white dark:text-black'
                          : 'border border-neutral-300 text-neutral-600 hover:border-black hover:text-black dark:border-neutral-700 dark:text-neutral-300 dark:hover:border-white dark:hover:text-white'
                      }`}
                    >
                      {link.label}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="7" y1="17" x2="17" y2="7" />
                        <polyline points="7 7 17 7 17 17" />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
