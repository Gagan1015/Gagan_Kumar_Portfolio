import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { useProjects } from '../hooks/usePortfolio';
import { useProjectQuickView } from '../hooks/useProjectQuickView';
import { optimizeCloudinaryUrl } from '../utils/cloudinary';
import { ProjectQuickView } from './ProjectQuickView';

const BENTO_PATTERNS = [
  [
    { col: 'md:col-span-8', row: 'md:row-span-2', aspect: 'aspect-[16/9] md:aspect-auto md:h-full', size: 'hero' },
    { col: 'md:col-span-4', row: 'md:row-span-2', aspect: 'aspect-[4/3] md:aspect-auto md:h-full', size: 'tall' },
  ],
  [
    { col: 'md:col-span-4', row: 'md:row-span-1', aspect: 'aspect-[4/3]', size: 'standard' },
    { col: 'md:col-span-4', row: 'md:row-span-1', aspect: 'aspect-[4/3]', size: 'standard' },
    { col: 'md:col-span-4', row: 'md:row-span-1', aspect: 'aspect-[4/3]', size: 'standard' },
  ],
  [
    { col: 'md:col-span-4', row: 'md:row-span-2', aspect: 'aspect-[4/3] md:aspect-auto md:h-full', size: 'tall' },
    { col: 'md:col-span-8', row: 'md:row-span-2', aspect: 'aspect-[16/9] md:aspect-auto md:h-full', size: 'hero' },
  ],
  [
    { col: 'md:col-span-6', row: 'md:row-span-1', aspect: 'aspect-[16/10]', size: 'wide' },
    { col: 'md:col-span-6', row: 'md:row-span-1', aspect: 'aspect-[16/10]', size: 'wide' },
  ],
  [
    { col: 'md:col-span-7', row: 'md:row-span-1', aspect: 'aspect-[16/9]', size: 'wide' },
    { col: 'md:col-span-5', row: 'md:row-span-1', aspect: 'aspect-[4/3]', size: 'standard' },
  ],
];

export const ProjectsList: React.FC = () => {
  const { data: projects, isLoading, error } = useProjects();
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [headerVisible, setHeaderVisible] = useState(false);
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

  const categories = useMemo(() => {
    if (!projects) return [];
    return Array.from(new Set(projects.map((project) => project.category).filter(Boolean) as string[])).sort();
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (!projects) return [];
    if (!selectedCategory) return projects;
    return projects.filter((project) => project.category === selectedCategory);
  }, [projects, selectedCategory]);

  const bentoGroups = useMemo(() => {
    const groups: { pattern: typeof BENTO_PATTERNS[number]; projects: typeof filteredProjects }[] = [];
    let index = 0;
    let patternIndex = 0;

    while (index < filteredProjects.length) {
      const pattern = BENTO_PATTERNS[patternIndex % BENTO_PATTERNS.length];
      const count = Math.min(pattern.length, filteredProjects.length - index);

      groups.push({
        pattern: pattern.slice(0, count),
        projects: filteredProjects.slice(index, index + count),
      });

      index += count;
      patternIndex++;
    }

    return groups;
  }, [filteredProjects]);

  useEffect(() => {
    document.title = 'Projects | Gagan Kumar';

    return () => {
      document.title = 'Gagan Kumar â€” Full-Stack Developer Portfolio';
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setHeaderVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  let globalIndex = 0;

  return (
    <div className="projects-page min-h-screen bg-[#f4f4f4] transition-colors duration-300 dark:bg-geo-dark-bg">
      <div className="section-frame min-h-screen">
        <div className="section-frame-inner h-full">
      <div className="pt-6 md:px-12 md:pt-32" data-reveal="fade">
        <Link
          to="/"
          className="group inline-flex items-center gap-2 text-sm font-mono uppercase tracking-widest text-neutral-400 transition-colors duration-300 hover:text-black dark:hover:text-white"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:-translate-x-1">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Portfolio
        </Link>
      </div>

      <div className={` pb-10 pt-12 transition-all duration-700 ease-out md:px-12 ${headerVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
        <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="mb-4 text-sm font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-600">
              {filteredProjects.length} {filteredProjects.length === 1 ? 'Project' : 'Projects'}
            </p>
            <h1 className="font-display text-5xl font-semibold leading-[0.9] tracking-tighter text-black dark:text-white md:text-7xl lg:text-8xl">
              ALL
              <br />
              PROJECTS<span className="text-neutral-300 dark:text-neutral-700">.</span>
            </h1>
          </div>
          <div className="max-w-sm pb-2 text-base leading-relaxed text-neutral-500 dark:text-neutral-400 md:col-span-5 md:text-right">
            Deep dives into products I have designed, built, and shipped across web and mobile platforms.
          </div>
        </div>
        <div className="mt-10 h-px bg-neutral-200 dark:bg-neutral-800" />
      </div>

      {categories.length > 0 && (
        <div className={` pb-10 transition-all duration-700 delay-200 ease-out md:px-12 ${headerVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          <div className="flex flex-wrap items-center gap-1">
            <button
              onClick={() => setSelectedCategory(undefined)}
              className={`blog-filter-tab ${!selectedCategory ? 'active' : ''}`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`blog-filter-tab ${selectedCategory === category ? 'active' : ''}`}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="mt-2 h-px bg-neutral-200 dark:bg-neutral-800" />
        </div>
      )}

      {isLoading && (
        <div className="pb-24 md:px-12">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
            <div className="animate-pulse md:col-span-8">
              <div className="aspect-[16/9] border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900" />
            </div>
            <div className="animate-pulse md:col-span-4">
              <div className="aspect-[16/9] border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 md:h-full md:aspect-auto" />
            </div>
            {[1, 2, 3].map((item) => (
              <div key={item} className="animate-pulse md:col-span-4">
                <div className="aspect-[4/3] border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900" />
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="pb-24 md:px-12">
          <div className="border border-neutral-200 p-12 text-center dark:border-neutral-800">
            <p className="font-mono text-sm text-neutral-500 dark:text-neutral-400">
              Error loading projects. Please try again later.
            </p>
          </div>
        </div>
      )}

      {!isLoading && !error && (
        <div className="pb-24 md:px-12">
          {filteredProjects.length === 0 ? (
            <div
              className="border border-neutral-200 p-16 text-center dark:border-neutral-800"
              data-reveal="scale"
            >
              <p className="text-lg text-neutral-500 dark:text-neutral-400">
                No projects found for this category.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {bentoGroups.map((group, groupIndex) => (
                <div
                  key={groupIndex}
                  className="bento-row grid grid-cols-1 gap-4 md:grid-cols-12"
                  style={{ minHeight: group.pattern.some((pattern) => pattern.size === 'hero' || pattern.size === 'tall') ? '420px' : 'auto' }}
                >
                  {group.projects.map((project, itemIndex) => {
                    const layout = group.pattern[itemIndex];
                    const cardIndex = globalIndex++;
                    const number = String(cardIndex + 1).padStart(2, '0');
                    const isLarge = layout.size === 'hero' || layout.size === 'tall';
                    const isSelected = activeProject?.id === project.id && phase !== 'measuring';

                    return (
                      <article
                        key={project.id}
                        className={`group relative ${layout.col} ${layout.row} project-card-enter`}
                        style={{ animationDelay: `${itemIndex * 100 + 150}ms` }}
                      >
                        <button
                          type="button"
                          className={`bento-card block h-full w-full overflow-hidden border border-neutral-200 bg-transparent p-0 text-left transition-all duration-500 dark:border-neutral-800 ${
                            isSelected ? 'opacity-0' : 'opacity-100 hover:border-black dark:hover:border-white'
                          }`}
                          onClick={(event) => openQuickView(project, event.currentTarget)}
                          aria-haspopup="dialog"
                          aria-expanded={isSelected}
                        >
                          <div className={`${layout.aspect} overflow-hidden ${isLarge ? 'h-full' : ''}`}>
                            {project.image_url ? (
                              <img
                                src={optimizeCloudinaryUrl(project.image_url, 800)}
                                alt={project.title}
                                className="h-full w-full object-cover grayscale transition-all duration-700 ease-out group-hover:scale-105 group-hover:grayscale-0"
                                width={800}
                                height={450}
                                loading="lazy"
                                decoding="async"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-neutral-100 font-mono text-xs uppercase tracking-widest text-neutral-400 dark:bg-neutral-900 dark:text-neutral-600">
                                No Preview
                              </div>
                            )}
                          </div>

                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                          <div className="absolute left-4 top-4 z-10">
                            <span className="bento-index inline-flex h-8 w-8 items-center justify-center border border-white/20 bg-black/20 text-[10px] font-mono tracking-widest text-white/60 backdrop-blur-sm transition-all duration-400 group-hover:border-white group-hover:bg-white group-hover:text-black">
                              {number}
                            </span>
                          </div>

                          <div className="absolute right-4 top-4 z-10 translate-y-2 opacity-0 transition-all duration-400 delay-75 group-hover:translate-y-0 group-hover:opacity-100">
                            <span className="bg-black/20 px-2 py-1 text-[10px] font-mono uppercase tracking-[0.15em] text-white/70 backdrop-blur-sm">
                              {project.category || 'General'}
                            </span>
                          </div>

                          <div className="absolute bottom-0 left-0 right-0 z-10 translate-y-4 p-5 opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100 md:p-6">
                            <h2 className={`mb-2 font-display font-semibold leading-tight tracking-tight text-white ${isLarge ? 'text-2xl md:text-3xl' : 'text-lg md:text-xl'}`}>
                              {project.title}
                            </h2>

                            {project.description && isLarge && (
                              <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-white/60">
                                {project.description}
                              </p>
                            )}

                            {project.technologies && project.technologies.length > 0 && (
                              <div className="mb-3 flex flex-wrap gap-1.5">
                                {project.technologies.slice(0, isLarge ? 5 : 3).map((technology) => (
                                  <span
                                    key={technology}
                                    className="border border-white/15 px-1.5 py-0.5 text-[9px] font-mono uppercase tracking-widest text-white/50"
                                  >
                                    {technology}
                                  </span>
                                ))}
                              </div>
                            )}

                            <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-white/80 transition-colors group-hover:text-white">
                              Open Preview
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1">
                                <line x1="7" y1="17" x2="17" y2="7" />
                                <polyline points="7 7 17 7 17 17" />
                              </svg>
                            </div>
                          </div>

                          <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-neutral-200 bg-white/95 p-4 backdrop-blur-sm transition-all duration-400 group-hover:translate-y-2 group-hover:opacity-0 dark:border-neutral-800 dark:bg-geo-dark-bg/95 md:p-5">
                            <div className="flex items-center justify-between gap-4">
                              <div className="min-w-0">
                                <h2 className={`truncate font-display font-semibold tracking-tight text-black dark:text-white ${isLarge ? 'text-lg md:text-xl' : 'text-base'}`}>
                                  {project.title}
                                </h2>
                                <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-neutral-400 dark:text-neutral-600">
                                  {project.category || 'General'}
                                </span>
                              </div>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 text-neutral-300 transition-colors group-hover:text-black dark:text-neutral-700 dark:group-hover:text-white">
                                <line x1="7" y1="17" x2="17" y2="7" />
                                <polyline points="7 7 17 7 17 17" />
                              </svg>
                            </div>
                          </div>
                        </button>
                      </article>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

        </div>
      </div>

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
    </div>
  );
};
