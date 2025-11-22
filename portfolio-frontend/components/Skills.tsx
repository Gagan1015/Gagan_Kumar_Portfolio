import React from 'react';
import { SectionId } from '../types';
import { useSkillsGrouped } from '../hooks/usePortfolio';

export const Skills: React.FC = () => {
  const { data: skillsGrouped, isLoading, error } = useSkillsGrouped();

  if (isLoading) {
    return (
      <section id={SectionId.Skills} className="py-24 md:py-32 px-6 md:px-12 bg-white dark:bg-geo-dark-bg border-b border-neutral-200 dark:border-geo-dark-border transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-display text-4xl font-medium tracking-tight mb-6 text-black dark:text-white">
            TECHNICAL<br />SKILLS<span className="text-neutral-300 dark:text-neutral-700">.</span>
          </h2>
          <div className="grid grid-cols-3 gap-8 animate-pulse">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-neutral-200 dark:bg-neutral-800 rounded"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !skillsGrouped) {
    return (
      <section id={SectionId.Skills} className="py-24 md:py-32 px-6 md:px-12 bg-white dark:bg-geo-dark-bg border-b border-neutral-200 dark:border-geo-dark-border transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <p className="text-red-500">Error loading skills. Please try again later.</p>
        </div>
      </section>
    );
  }

  return (
    <section id={SectionId.Skills} className="py-24 md:py-32 px-6 md:px-12 bg-white dark:bg-geo-dark-bg border-b border-neutral-200 dark:border-geo-dark-border transition-colors duration-300">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-4">
          <h2 className="font-display text-4xl font-medium tracking-tight mb-6 text-black dark:text-white">
            TECHNICAL<br />SKILLS<span className="text-neutral-300 dark:text-neutral-700">.</span>
          </h2>
          <div className="w-12 h-1 bg-black dark:bg-white mb-8"></div>
          <p className="text-neutral-500 dark:text-neutral-400 max-w-xs text-sm leading-relaxed">
             A toolkit refined over years of building scalable applications and immersive web experiences.
          </p>
        </div>
        <div className="md:col-span-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-12">
            {Object.entries(skillsGrouped).map(([category, skills]) => (
              <div key={category} className="group">
                 <h3 className="font-mono text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-6 border-b border-neutral-100 dark:border-neutral-800 pb-2">
                   {category}
                 </h3>
                 <ul className="space-y-4">
                   {skills.map((skill) => (
                     <li key={skill.id} className="text-lg text-neutral-800 dark:text-neutral-300 font-light flex items-center gap-3 hover:translate-x-2 transition-transform duration-300 cursor-default group-hover:text-black dark:group-hover:text-white">
                       <span className="w-1 h-1 bg-neutral-200 dark:bg-neutral-700 group-hover:bg-black dark:group-hover:bg-white transition-colors duration-300 rounded-full"></span>
                       {skill.name}
                     </li>
                   ))}
                 </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};