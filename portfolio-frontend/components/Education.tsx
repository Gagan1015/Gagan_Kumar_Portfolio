import React from 'react';
import { SectionId } from '../types';
import { useEducation } from '../hooks/usePortfolio';

export const Education: React.FC = () => {
  const { data: education, isLoading, error } = useEducation();

  if (isLoading) {
    return (
      <section id={SectionId.Education} className="py-24 md:py-32 px-6 md:px-12 bg-neutral-50 dark:bg-geo-dark-card transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-display text-4xl font-medium tracking-tight mb-6 text-black dark:text-white">
            EDUCATION<span className="text-neutral-300 dark:text-neutral-700">.</span>
          </h2>
          <div className="space-y-8 animate-pulse">
            {[1, 2].map(i => (
              <div key={i} className="h-24 bg-neutral-200 dark:bg-neutral-800 rounded"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !education) {
    return (
      <section id={SectionId.Education} className="py-24 md:py-32 px-6 md:px-12 bg-neutral-50 dark:bg-geo-dark-card transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <p className="text-red-500">Error loading education data. Please try again later.</p>
        </div>
      </section>
    );
  }

  return (
    <section id={SectionId.Education} className="py-24 md:py-32 px-6 md:px-12 bg-neutral-50 dark:bg-geo-dark-card transition-colors duration-300">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-4">
          <h2 className="font-display text-4xl font-medium tracking-tight mb-6 text-black dark:text-white">
            EDUCATION<span className="text-neutral-300 dark:text-neutral-700">.</span>
          </h2>
        </div>
        <div className="md:col-span-8 space-y-12">
          {education.map((edu) => (
            <div key={edu.id} className="flex flex-col md:flex-row md:justify-between md:items-end border-b border-neutral-200 dark:border-neutral-800 pb-8">
              <div>
                <h3 className="text-xl font-medium tracking-tight text-black dark:text-white">{edu.institution}</h3>
                <p className="text-neutral-600 dark:text-neutral-400 mt-1">{edu.degree}</p>
                {edu.field_of_study && (
                  <p className="text-sm text-neutral-500 dark:text-neutral-500 mt-1">{edu.field_of_study}</p>
                )}
              </div>
              <div className="mt-2 md:mt-0">
                <span className="font-mono text-sm text-neutral-400 dark:text-neutral-500">
                  {edu.end_date ? new Date(edu.end_date).getFullYear() : 'Present'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};