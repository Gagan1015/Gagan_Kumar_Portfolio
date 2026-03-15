import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProjects } from '../hooks/usePortfolio';
import { optimizeCloudinaryUrl } from '../utils/cloudinary';

// Bento grid layout patterns — each pattern defines spans for a row of cards
// [colSpan, rowSpan] pairs — designed for a 12-column grid
const BENTO_PATTERNS = [
  // Pattern 0: Large hero (8) + tall side (4)
  [
    { col: 'md:col-span-8', row: 'md:row-span-2', aspect: 'aspect-[16/9] md:aspect-auto md:h-full', size: 'hero' },
    { col: 'md:col-span-4', row: 'md:row-span-2', aspect: 'aspect-[4/3] md:aspect-auto md:h-full', size: 'tall' },
  ],
  // Pattern 1: Three equal columns
  [
    { col: 'md:col-span-4', row: 'md:row-span-1', aspect: 'aspect-[4/3]', size: 'standard' },
    { col: 'md:col-span-4', row: 'md:row-span-1', aspect: 'aspect-[4/3]', size: 'standard' },
    { col: 'md:col-span-4', row: 'md:row-span-1', aspect: 'aspect-[4/3]', size: 'standard' },
  ],
  // Pattern 2: Side (4) + Large hero (8)
  [
    { col: 'md:col-span-4', row: 'md:row-span-2', aspect: 'aspect-[4/3] md:aspect-auto md:h-full', size: 'tall' },
    { col: 'md:col-span-8', row: 'md:row-span-2', aspect: 'aspect-[16/9] md:aspect-auto md:h-full', size: 'hero' },
  ],
  // Pattern 3: Two equal halves
  [
    { col: 'md:col-span-6', row: 'md:row-span-1', aspect: 'aspect-[16/10]', size: 'wide' },
    { col: 'md:col-span-6', row: 'md:row-span-1', aspect: 'aspect-[16/10]', size: 'wide' },
  ],
  // Pattern 4: Wide (7) + Narrow (5)
  [
    { col: 'md:col-span-7', row: 'md:row-span-1', aspect: 'aspect-[16/9]', size: 'wide' },
    { col: 'md:col-span-5', row: 'md:row-span-1', aspect: 'aspect-[4/3]', size: 'standard' },
  ],
];

export const ProjectsList: React.FC = () => {
  const { data: projects, isLoading, error } = useProjects();
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const [headerVisible, setHeaderVisible] = useState(false);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);

  const categories = useMemo(() => {
    if (!projects) return [];
    return Array.from(new Set(projects.map((project) => project.category).filter(Boolean) as string[])).sort();
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (!projects) return [];
    if (!selectedCategory) return projects;
    return projects.filter((project) => project.category === selectedCategory);
  }, [projects, selectedCategory]);

  // Distribute projects into bento layout groups
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
      document.title = 'Gagan Kumar — Full-Stack Developer Portfolio';
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setHeaderVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    cardRefs.current.forEach((el, index) => {
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleCards((prev) => new Set(prev).add(index));
            observer.disconnect();
          }
        },
        { threshold: 0.08 }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((observer) => observer.disconnect());
  }, [filteredProjects]);

  useEffect(() => {
    setVisibleCards(new Set());
  }, [selectedCategory]);

  let globalIndex = 0;

  return (
    <div className="projects-page bg-white dark:bg-geo-dark-bg min-h-screen transition-colors duration-300">
      {/* Back link */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 pt-6 md:pt-32">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-mono uppercase tracking-widest text-neutral-400 hover:text-black dark:hover:text-white transition-colors duration-300 group"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:-translate-x-1">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Portfolio
        </Link>
      </div>

      {/* Header Section */}
      <div className={`max-w-[1400px] mx-auto px-6 md:px-12 pt-12 pb-10 transition-all duration-700 ease-out ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-7">
            <p className="text-sm font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-600 mb-4">
              {filteredProjects.length} {filteredProjects.length === 1 ? 'Project' : 'Projects'}
            </p>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tighter text-black dark:text-white leading-[0.9]">
              ALL<br/>PROJECTS<span className="text-neutral-300 dark:text-neutral-700">.</span>
            </h1>
          </div>
          <div className="md:col-span-5 md:flex md:items-end md:justify-end pb-2">
            <p className="text-neutral-500 dark:text-neutral-400 text-base leading-relaxed md:text-right max-w-sm">
              Deep dives into products I have designed, built, and shipped across web and mobile platforms.
            </p>
          </div>
        </div>
        <div className="h-px bg-neutral-200 dark:bg-neutral-800 mt-10" />
      </div>

      {/* Category Filters */}
      {categories.length > 0 && (
        <div className={`max-w-[1400px] mx-auto px-6 md:px-12 pb-10 transition-all duration-700 delay-200 ease-out ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex items-center gap-1 flex-wrap">
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
          <div className="h-px bg-neutral-200 dark:bg-neutral-800 mt-2" />
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-8 animate-pulse">
              <div className="aspect-[16/9] bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800" />
            </div>
            <div className="md:col-span-4 animate-pulse">
              <div className="aspect-[16/9] md:aspect-auto md:h-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800" />
            </div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="md:col-span-4 animate-pulse">
                <div className="aspect-[4/3] bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 pb-24">
          <div className="border border-neutral-200 dark:border-neutral-800 p-12 text-center">
            <p className="text-neutral-500 dark:text-neutral-400 font-mono text-sm">
              Error loading projects. Please try again later.
            </p>
          </div>
        </div>
      )}

      {/* Bento Grid */}
      {!isLoading && !error && (
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 pb-24">
          {filteredProjects.length === 0 ? (
            <div className="border border-neutral-200 dark:border-neutral-800 p-16 text-center">
              <p className="text-neutral-500 dark:text-neutral-400 text-lg">
                No projects found for this category.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {bentoGroups.map((group, groupIndex) => (
                <div
                  key={groupIndex}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 bento-row"
                  style={{ minHeight: group.pattern.some(p => p.size === 'hero' || p.size === 'tall') ? '420px' : 'auto' }}
                >
                  {group.projects.map((project, itemIndex) => {
                    const layout = group.pattern[itemIndex];
                    const cardIndex = globalIndex++;
                    const num = String(cardIndex + 1).padStart(2, '0');
                    const isVisible = visibleCards.has(cardIndex);
                    const isLarge = layout.size === 'hero' || layout.size === 'tall';

                    return (
                      <article
                        key={project.id}
                        ref={(el) => { cardRefs.current[cardIndex] = el; }}
                        className={`group relative ${layout.col} ${layout.row} transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                          isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-[0.97]'
                        }`}
                        style={{ transitionDelay: `${itemIndex * 100 + 50}ms` }}
                      >
                        <Link
                          to={`/projects/${project.id}`}
                          className="bento-card block relative h-full overflow-hidden border border-neutral-200 dark:border-neutral-800 hover:border-black dark:hover:border-white transition-all duration-500"
                        >
                          {/* Image Layer */}
                          <div className={`${layout.aspect} overflow-hidden ${isLarge ? 'h-full' : ''}`}>
                            {project.image_url ? (
                              <img
                                src={optimizeCloudinaryUrl(project.image_url, 800)}
                                alt={project.title}
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                                width={800}
                                height={450}
                                loading="lazy"
                                decoding="async"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-neutral-100 dark:bg-neutral-900 text-neutral-400 dark:text-neutral-600 font-mono text-xs uppercase tracking-widest">
                                No Preview
                              </div>
                            )}
                          </div>

                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                          {/* Top-left Index Badge */}
                          <div className="absolute top-4 left-4 z-10">
                            <span className="bento-index inline-flex items-center justify-center w-8 h-8 border border-white/20 text-white/60 text-[10px] font-mono tracking-widest backdrop-blur-sm bg-black/20 group-hover:bg-white group-hover:text-black group-hover:border-white transition-all duration-400">
                              {num}
                            </span>
                          </div>

                          {/* Top-right Category */}
                          <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400 delay-75">
                            <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-white/70 backdrop-blur-sm bg-black/20 px-2 py-1">
                              {project.category || 'General'}
                            </span>
                          </div>

                          {/* Bottom Content (appears on hover) */}
                          <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 z-10 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                            <h2 className={`font-display font-semibold tracking-tight text-white mb-2 leading-tight ${
                              isLarge ? 'text-2xl md:text-3xl' : 'text-lg md:text-xl'
                            }`}>
                              {project.title}
                            </h2>

                            {project.description && isLarge && (
                              <p className="text-white/60 text-sm leading-relaxed mb-3 line-clamp-2">
                                {project.description}
                              </p>
                            )}

                            {project.technologies && project.technologies.length > 0 && (
                              <div className="flex gap-1.5 flex-wrap mb-3">
                                {project.technologies.slice(0, isLarge ? 5 : 3).map((tech) => (
                                  <span
                                    key={tech}
                                    className="text-[9px] font-mono uppercase tracking-widest text-white/50 border border-white/15 px-1.5 py-0.5"
                                  >
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            )}

                            <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-white/80 group-hover:text-white transition-colors">
                              View Project
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1">
                                <line x1="7" y1="17" x2="17" y2="7" />
                                <polyline points="7 7 17 7 17 17" />
                              </svg>
                            </div>
                          </div>

                          {/* Static bottom bar (visible when not hovering) */}
                          <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5 bg-white/95 dark:bg-geo-dark-bg/95 backdrop-blur-sm border-t border-neutral-200 dark:border-neutral-800 group-hover:opacity-0 group-hover:translate-y-2 transition-all duration-400 z-10">
                            <div className="flex items-center justify-between gap-4">
                              <div className="min-w-0">
                                <h2 className={`font-display font-semibold tracking-tight text-black dark:text-white truncate ${
                                  isLarge ? 'text-lg md:text-xl' : 'text-base'
                                }`}>
                                  {project.title}
                                </h2>
                                <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-neutral-400 dark:text-neutral-600">
                                  {project.category || 'General'}
                                </span>
                              </div>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-300 dark:text-neutral-700 flex-shrink-0 group-hover:text-black dark:group-hover:text-white transition-colors">
                                <line x1="7" y1="17" x2="17" y2="7" />
                                <polyline points="7 7 17 7 17 17" />
                              </svg>
                            </div>
                          </div>
                        </Link>
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
  );
};
