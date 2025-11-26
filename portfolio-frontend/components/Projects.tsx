import React from 'react';
import { SectionId } from '../types';
import { useProjects } from '../hooks/usePortfolio';

export const Projects: React.FC = () => {
  const { data: projects, isLoading, error } = useProjects();

  if (isLoading) {
    return (
      <section id={SectionId.Projects} className="py-24 md:py-32 px-6 md:px-12 bg-white dark:bg-geo-dark-bg border-b border-neutral-200 dark:border-geo-dark-border transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-display text-4xl font-medium tracking-tight text-black dark:text-white mb-16">
            SELECTED WORK<span className="text-neutral-300 dark:text-neutral-700">.</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-96 bg-neutral-200 dark:bg-neutral-800 rounded"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !projects) {
    return (
      <section id={SectionId.Projects} className="py-24 md:py-32 px-6 md:px-12 bg-white dark:bg-geo-dark-bg border-b border-neutral-200 dark:border-geo-dark-border transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <p className="text-red-500">Error loading projects. Please try again later.</p>
        </div>
      </section>
    );
  }

  return (
    <section id={SectionId.Projects} className="py-24 md:py-32 px-6 md:px-12 bg-white dark:bg-geo-dark-bg border-b border-neutral-200 dark:border-geo-dark-border transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <h2 className="font-display text-4xl font-medium tracking-tight text-black dark:text-white">
            SELECTED WORK<span className="text-neutral-300 dark:text-neutral-700">.</span>
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 mt-4 md:mt-0 max-w-md text-right">
            A curation of digital products, websites, and experimental interfaces.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
          {projects.map((project) => {
            const ProjectWrapper = project.website_url ? 'a' : 'div';
            const wrapperProps = project.website_url 
              ? { href: project.website_url, target: '_blank', rel: 'noopener noreferrer' }
              : {};
            
            return (
              <ProjectWrapper key={project.id} className="group cursor-pointer" {...wrapperProps}>
                <div className="aspect-[4/3] overflow-hidden bg-neutral-100 dark:bg-neutral-900 mb-6 relative border border-neutral-100 dark:border-neutral-800">
                  <img 
                    src={project.image_url || 'https://picsum.photos/800/600'} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0 dark:opacity-80 dark:group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 border-[1px] border-transparent group-hover:border-white/20 transition-all duration-300 m-4 pointer-events-none"></div>
                  {project.website_url && (
                    <div className="absolute top-4 right-4 bg-black/50 dark:bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between items-start border-t border-neutral-200 dark:border-neutral-800 pt-4">
                  <div>
                    <h3 className="text-xl font-bold tracking-tight text-black dark:text-white group-hover:text-neutral-600 dark:group-hover:text-neutral-400 transition-colors">{project.title}</h3>
                    <span className="text-sm text-neutral-400 dark:text-neutral-500 font-mono uppercase">{project.category}</span>
                  </div>
                  <div className="hidden md:flex gap-2">
                     {project.technologies?.slice(0, 2).map(t => (
                       <span key={t} className="text-[10px] border border-neutral-200 dark:border-neutral-800 px-1.5 py-0.5 text-neutral-400 dark:text-neutral-500">{t}</span>
                     ))}
                  </div>
                </div>
                <p className="mt-3 text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed max-w-sm">
                  {project.description}
                </p>
              </ProjectWrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
};