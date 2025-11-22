import React from 'react';
import { SectionId } from '../types';
import { useProfile } from '../hooks/usePortfolio';

export const Profile: React.FC = () => {
  const { data: profile, isLoading, error } = useProfile();

  if (isLoading) {
    return (
      <section id={SectionId.Profile} className="py-24 md:py-32 px-6 md:px-12 bg-white dark:bg-geo-dark-bg border-b border-neutral-200 dark:border-geo-dark-border transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-12 bg-neutral-200 dark:bg-neutral-800 rounded w-48 mb-6"></div>
            <div className="h-1 w-12 bg-neutral-200 dark:bg-neutral-800 mb-8"></div>
            <div className="space-y-4">
              <div className="h-8 bg-neutral-200 dark:bg-neutral-800 rounded w-full"></div>
              <div className="h-8 bg-neutral-200 dark:bg-neutral-800 rounded w-5/6"></div>
              <div className="h-8 bg-neutral-200 dark:bg-neutral-800 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !profile) {
    return (
      <section id={SectionId.Profile} className="py-24 md:py-32 px-6 md:px-12 bg-white dark:bg-geo-dark-bg border-b border-neutral-200 dark:border-geo-dark-border transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          <p className="text-red-500">Error loading profile data. Please try again later.</p>
        </div>
      </section>
    );
  }

  const availabilityColor = profile.availability_status === 'available' ? 'bg-green-500' : 
                           profile.availability_status === 'busy' ? 'bg-yellow-500' : 'bg-red-500';
  const availabilityText = profile.availability_status === 'available' ? 'Open' : 
                          profile.availability_status === 'busy' ? 'Busy' : 'Not Available';

  return (
    <section id={SectionId.Profile} className="py-24 md:py-32 px-6 md:px-12 bg-white dark:bg-geo-dark-bg border-b border-neutral-200 dark:border-geo-dark-border transition-colors duration-300">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-4">
          <h2 className="font-display text-4xl font-medium tracking-tight mb-6 text-black dark:text-white">
            PROFILE<span className="text-neutral-300 dark:text-neutral-700">.</span>
          </h2>
          <div className="w-12 h-1 bg-black dark:bg-white mb-8"></div>
        </div>
        <div className="md:col-span-8">
          <p className="text-xl md:text-3xl leading-tight font-light text-neutral-800 dark:text-neutral-200">
            {profile.summary || profile.bio}
          </p>
          
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-sm uppercase tracking-wider mb-2 text-neutral-400 dark:text-neutral-500">Location</h3>
              <p className="text-lg text-black dark:text-white">{profile.location || 'Remote'}</p>
            </div>
            <div>
              <h3 className="font-bold text-sm uppercase tracking-wider mb-2 text-neutral-400 dark:text-neutral-500">Experience</h3>
              <p className="text-lg text-black dark:text-white">{profile.years_of_experience}+ Years</p>
            </div>
            <div>
              <h3 className="font-bold text-sm uppercase tracking-wider mb-2 text-neutral-400 dark:text-neutral-500">Availability</h3>
              <p className="text-lg flex items-center gap-2 text-black dark:text-white">
                <span className={`w-2 h-2 ${availabilityColor} rounded-full`}></span>
                {availabilityText}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};