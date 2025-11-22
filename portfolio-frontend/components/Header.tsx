import React, { useEffect, useState } from 'react';
import { SectionId, Theme } from '../types';
import { useProfile } from '../hooks/usePortfolio';

interface HeaderProps {
  activeSection: string;
  theme: Theme;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeSection, theme, onToggleTheme }) => {
  const { data: profile } = useProfile();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems = [
    { id: SectionId.Profile, label: 'About' },
    { id: SectionId.Experience, label: 'Experience' },
    { id: SectionId.Skills, label: 'Skills' },
    { id: SectionId.Projects, label: 'Projects' },
    { id: SectionId.Education, label: 'Education' },
  ];

  return (
    <header className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${isScrolled ? 'bg-white/90 dark:bg-geo-dark-bg/90 backdrop-blur-md border-b border-neutral-200 dark:border-geo-dark-border py-3' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        <div 
          className="font-display font-bold text-xl tracking-tighter cursor-pointer select-none hover:opacity-60 transition-opacity dark:text-white"
          onClick={() => scrollTo(SectionId.Hero)}
        >
          {profile?.full_name?.toUpperCase() || 'LOADING...'}
        </div>

        <div className="flex items-center gap-8">
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`text-sm font-medium uppercase tracking-wider transition-colors relative
                  ${activeSection === item.id ? 'text-black dark:text-white' : 'text-neutral-400 hover:text-black dark:hover:text-white'}
                `}
              >
                {item.label}
                {activeSection === item.id && (
                  <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-black dark:bg-white"></span>
                )}
              </button>
            ))}
          </nav>

          <button 
            onClick={onToggleTheme}
            className="w-8 h-8 flex items-center justify-center border border-neutral-200 dark:border-geo-dark-border rounded hover:bg-neutral-100 dark:hover:bg-geo-dark-card transition-colors text-black dark:text-white"
            aria-label={`Current theme: ${theme}. Click to switch.`}
          >
            {theme === 'light' && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
            )}
            {theme === 'dark' && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
            )}
            {theme === 'system' && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
            )}
          </button>

          <button 
             className="md:hidden p-2 text-black dark:text-white"
             onClick={() => {/* Simple mobile menu placeholder could go here */}}
          >
            <div className="w-6 h-[2px] bg-current mb-1.5"></div>
            <div className="w-6 h-[2px] bg-current"></div>
          </button>
        </div>
      </div>
    </header>
  );
};