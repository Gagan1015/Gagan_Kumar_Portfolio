import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { useProjects } from '../hooks/usePortfolio';
import { useProjectQuickView } from '../hooks/useProjectQuickView';
import { SectionId } from '../types';
import { optimizeCloudinaryUrl } from '../utils/cloudinary';
import { ProjectQuickView } from './ProjectQuickView';

export const Projects: React.FC = () => {
  const { data: projects, isLoading, error } = useProjects();
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [visibleRows, setVisibleRows] = useState<Set<number>>(new Set());
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const {
    activeProject,
    closeButtonRef,
    closeQuickView,
    modalCardRef,
    openQuickView,
    phase,
    prefersReducedMotion,
    transform,
    useSharedTransform,
  } = useProjectQuickView();

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!sectionRef.current) return;

    const rect = sectionRef.current.getBoundingClientRect();
    setMousePos({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    rowRefs.current.forEach((element, index) => {
      if (!element) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;

          setVisibleRows((previous) => new Set(previous).add(index));
          observer.disconnect();
        },
        { threshold: 0.15 }
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => observers.forEach((observer) => observer.disconnect());
  }, [projects]);

  if (isLoading) {
    return (
      <section id={SectionId.Projects} className="bg-[#f4f4f4] py-16 transition-colors duration-300 dark:bg-geo-dark-bg md:py-32">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-16 font-display text-4xl font-medium tracking-tight text-black dark:text-white">
            SELECTED WORK<span className="text-neutral-300 dark:text-neutral-700">.</span>
          </h2>
          <div className="space-y-0 animate-pulse">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-24 border-b border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !projects) {
    return (
      <section id={SectionId.Projects} className="bg-[#f4f4f4] py-16 transition-colors duration-300 dark:bg-geo-dark-bg md:py-32">
        <div className="mx-auto max-w-7xl">
          <p className="text-neutral-500">Error loading projects. Please try again later.</p>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id={SectionId.Projects}
      className="relative overflow-hidden bg-[#f4f4f4] py-16 transition-colors duration-300 dark:bg-geo-dark-bg md:py-32"
      onMouseMove={handleMouseMove}
    >
      <div className="section-frame">
        <div className="section-frame-inner">
        <div className="mb-12 grid grid-cols-1 gap-6 md:mb-20 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5">
            <h2 className="font-display text-4xl font-medium tracking-tight text-black dark:text-white">
              SELECTED WORK<span className="text-neutral-300 dark:text-neutral-700">.</span>
            </h2>
            <div className="mt-4 h-px w-12 bg-black dark:bg-white" />
            <p className="mt-4 text-sm font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-600">
              {projects.length} Projects
            </p>
          </div>
          <div className="md:col-span-7 md:flex md:items-end md:justify-end">
            <div className="md:text-right">
              <p className="text-lg leading-relaxed text-neutral-500 dark:text-neutral-400 md:max-w-md">
                A curation of digital products, websites, and experimental interfaces.
              </p>
              <Link
                to="/projects"
                className="mt-6 inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-black transition-opacity hover:opacity-70 dark:text-white"
              >
                Explore all projects
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        <div className="mb-0 h-px bg-black dark:bg-white" />

        <div className="relative">
          {projects.map((project, index) => {
            const isHovered = hoveredId === project.id;
            const isVisible = visibleRows.has(index);
            const isSelected = activeProject?.id === project.id && phase !== 'measuring';
            const number = String(index + 1).padStart(2, '0');

            return (
              <div
                key={project.id}
                ref={(element) => {
                  rowRefs.current[index] = element;
                }}
                className={`transition-all duration-700 ease-out ${
                  isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <button
                  type="button"
                  className={`group block w-full border-b border-neutral-200 bg-transparent p-0 text-left transition-opacity duration-300 dark:border-neutral-800 ${
                    isSelected ? 'opacity-0' : 'opacity-100'
                  }`}
                  onClick={(event) => {
                    setHoveredId(null);
                    openQuickView(project, event.currentTarget);
                  }}
                  onMouseEnter={() => {
                    if (!activeProject) {
                      setHoveredId(project.id);
                    }
                  }}
                  onMouseLeave={() => setHoveredId(null)}
                  aria-haspopup="dialog"
                  aria-expanded={isSelected}
                >
                  <div className={`py-8 transition-all duration-300 md:py-10 ${isHovered ? 'md:pl-6' : 'pl-0'}`}>
                    <div className="md:hidden">
                      <div className="mb-5 aspect-[16/9] overflow-hidden border border-neutral-200 dark:border-neutral-800">
                        <img
                          src={optimizeCloudinaryUrl(project.image_url || '', 800)}
                          alt={project.title}
                          className="h-full w-full object-cover grayscale transition-all duration-700 hover:grayscale-0"
                          width={800}
                          height={450}
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                      <div className="flex items-start gap-4">
                        <span className="mt-1 flex-shrink-0 font-mono text-xs text-neutral-300 dark:text-neutral-700">{number}</span>
                        <div>
                          <h3 className="font-display text-lg font-semibold tracking-tight text-black dark:text-white">{project.title}</h3>
                          <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-neutral-400 dark:text-neutral-600">
                            {project.category}
                          </span>
                          <p className="mt-2 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">{project.description}</p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {project.technologies?.map((technology) => (
                              <span
                                key={technology}
                                className="border border-neutral-200 px-2 py-0.5 text-[10px] font-mono text-neutral-400 dark:border-neutral-800 dark:text-neutral-600"
                              >
                                {technology}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="hidden md:grid md:grid-cols-12 md:items-center md:gap-6">
                      <div className="col-span-1">
                        <span className={`font-mono text-sm transition-colors duration-300 ${isHovered ? 'text-black dark:text-white' : 'text-neutral-300 dark:text-neutral-700'}`}>
                          {number}
                        </span>
                      </div>

                      <div className="col-span-5">
                        <h3
                          className={`font-display text-2xl font-semibold tracking-tight transition-all duration-300 lg:text-3xl ${
                            isHovered ? 'text-black dark:text-white' : 'text-neutral-700 dark:text-neutral-300'
                          }`}
                        >
                          {project.title}
                        </h3>
                      </div>

                      <div className="col-span-2">
                        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-600">
                          {project.category}
                        </span>
                      </div>

                      <div className="col-span-3 flex flex-wrap justify-end gap-2">
                        {project.technologies?.map((technology) => (
                          <span
                            key={technology}
                            className={`border px-2 py-0.5 text-[10px] font-mono transition-colors duration-300 ${
                              isHovered
                                ? 'border-neutral-400 text-neutral-600 dark:border-neutral-500 dark:text-neutral-400'
                                : 'border-neutral-200 text-neutral-400 dark:border-neutral-800 dark:text-neutral-600'
                            }`}
                          >
                            {technology}
                          </span>
                        ))}
                      </div>

                      <div className="col-span-1 flex justify-end">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={`transition-all duration-300 ${
                            isHovered
                              ? 'translate-x-0 translate-y-0 text-black dark:text-white'
                              : '-translate-x-1 translate-y-1 text-neutral-300 dark:text-neutral-700'
                          }`}
                        >
                          <line x1="7" y1="17" x2="17" y2="7" />
                          <polyline points="7 7 17 7 17 17" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`hidden overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:block ${
                      isHovered ? 'max-h-24 opacity-100 pb-8' : 'max-h-0 opacity-0 pb-0'
                    }`}
                  >
                    <div className="grid grid-cols-12 gap-6">
                      <div className="col-span-1" />
                      <p className="col-span-7 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                        {project.description}
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-0 h-px bg-black dark:bg-white" />
        </div>
      </div>

      {hoveredId !== null && !activeProject && (
        <div
          className="pointer-events-none absolute z-50 hidden h-[200px] w-[320px] transition-opacity duration-300 md:block"
          style={{
            left: `${mousePos.x + 24}px`,
            top: `${mousePos.y - 100}px`,
          }}
        >
          <div className="h-full w-full overflow-hidden border border-neutral-200 bg-white shadow-2xl dark:border-neutral-700 dark:bg-black dark:shadow-none">
            <img
              src={optimizeCloudinaryUrl(projects.find((project) => project.id === hoveredId)?.image_url || '', 640)}
              alt={`Preview of ${projects.find((project) => project.id === hoveredId)?.title || 'project'}`}
              className="h-full w-full object-cover"
              width={640}
              height={400}
              decoding="async"
            />
          </div>
        </div>
      )}

      <ProjectQuickView
        closeButtonRef={closeButtonRef}
        modalCardRef={modalCardRef}
        onClose={closeQuickView}
        phase={phase}
        prefersReducedMotion={prefersReducedMotion}
        project={activeProject}
        transform={transform}
        useSharedTransform={useSharedTransform}
      />
    </section>
  );
};
