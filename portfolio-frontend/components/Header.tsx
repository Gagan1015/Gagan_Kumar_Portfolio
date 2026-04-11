import React, { useEffect, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { SectionId, Theme } from '../types';
import { useProfile } from '../hooks/usePortfolio';
import { resumeService } from '../services/portfolioService';

interface HeaderProps {
  activeSection: string;
  theme: Theme;
  onToggleTheme: (e?: React.MouseEvent) => void;
}

/* Human-readable labels for each SectionId */
const SECTION_LABELS: Record<string, string> = {
  [SectionId.Hero]: 'Home',
  [SectionId.Profile]: 'About',
  [SectionId.Experience]: 'Experience',
  [SectionId.Projects]: 'Projects',
  [SectionId.Skills]: 'Skills',
  [SectionId.Education]: 'Education',
  [SectionId.Blog]: 'Blog',
};

export const Header: React.FC<HeaderProps> = ({ activeSection, theme, onToggleTheme }) => {
  const { data: profile } = useProfile();
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const isOnBlogPage = location.pathname.startsWith('/blog');
  const isOnProjectsPage = location.pathname.startsWith('/projects');
  const isHomePage = !isOnBlogPage && !isOnProjectsPage;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docH > 0 ? Math.round((window.scrollY / docH) * 100) : 0;
      setScrollPercent(Math.min(pct, 100));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    if (!mobileDropdownOpen) return;
    const close = () => setMobileDropdownOpen(false);
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [mobileDropdownOpen]);

  const scrollTo = (id: string) => {
    if (isOnBlogPage || isOnProjectsPage) {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setMobileDropdownOpen(false);
  };

  const goToRoute = (route: string) => {
    navigate(route);
    setMobileDropdownOpen(false);
  };

  const navItems = [
    { id: 'projects', label: 'Projects', route: '/projects' },
    { id: 'blog', label: 'Blog', route: '/blog' },
  ];

  /* SVG circular progress for the mobile header pill */
  const circleR = 8;
  const circleC = 2 * Math.PI * circleR;
  const circleOffset = circleC - (scrollPercent / 100) * circleC;

  /* Active section label for mobile header */
  const activeSectionLabel = useMemo(() => {
    if (isOnBlogPage) return 'Blog';
    if (isOnProjectsPage) return 'Projects';
    return SECTION_LABELS[activeSection] || 'Home';
  }, [activeSection, isOnBlogPage, isOnProjectsPage]);

  /* Mobile section dropdown items (only on home page) */
  const sectionItems = Object.values(SectionId).map((id) => ({
    id,
    label: SECTION_LABELS[id] || id,
  }));

  return (
    <>
      {/* ===================== DESKTOP HEADER ===================== */}
      <header
        className={`fixed top-0 left-0 w-full z-40 transition-all hidden md:block ${
          isScrolled ? 'py-4' : 'py-6'
        }`}
      >
        <div className={`mx-auto max-w-7xl flex justify-between items-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] border border-transparent px-6 md:px-12 ${
          isScrolled ? 'desktop-header-pill py-3' : 'py-3'
        }`}>
          <div
            className="header-signature cursor-pointer select-none"
            onClick={() => {
              if (isOnBlogPage || isOnProjectsPage) {
                navigate('/');
              } else {
                scrollTo(SectionId.Hero);
              }
            }}
          >
            {profile?.full_name || 'Loading...'}
          </div>

          <div className="flex items-center gap-6">
            <nav className="flex items-center gap-6">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => goToRoute(item.route)}
                  className={`text-sm font-medium tracking-wide transition-colors relative ${
                    location.pathname.startsWith(item.route)
                      ? 'text-black dark:text-white'
                      : 'text-neutral-400 hover:text-black dark:hover:text-white'
                  }`}
                >
                  {item.label}
                  {location.pathname.startsWith(item.route) && (
                    <span className="absolute -bottom-1 left-0 w-full h-[1.5px] bg-black dark:bg-white rounded-full"></span>
                  )}
                </button>
              ))}
            </nav>

            {profile?.resume_url && (
              <button
                onClick={() => resumeService.download()}
                className={`flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black font-mono text-xs tracking-widest uppercase hover:opacity-80 transition-all duration-300 px-4 py-2 ${
                  isScrolled ? 'rounded-lg' : 'rounded-none'
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" className="transition-all duration-300">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Resume
              </button>
            )}

            <button
              onClick={(e) => onToggleTheme(e)}
              className={`flex items-center justify-center border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-geo-dark-card transition-all duration-300 text-black dark:text-white w-8 h-8 ${
                isScrolled ? 'rounded-lg' : 'rounded'
              }`}
              aria-label={`Current theme: ${theme}. Click to switch.`}
            >
              <ThemeIcon theme={theme} size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* ===================== MOBILE FLOATING HEADER (top pill) ===================== */}
      {createPortal(
        <div
          className="mobile-header-pill md:hidden mobile-header-pill-visible"
        >
          {/* Section name + dropdown */}
          <button
            className="mobile-header-section-btn"
            onClick={(e) => {
              e.stopPropagation();
              setMobileDropdownOpen((prev) => !prev);
            }}
            aria-label="Select section"
          >
            <span className="mobile-header-section-label">{activeSectionLabel}</span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-transform duration-200 ${mobileDropdownOpen ? 'rotate-180' : ''}`}
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>

          {/* Scroll percentage + circular progress */}
          <div className="mobile-header-progress">
            <span className="mobile-header-percent">{scrollPercent}%</span>
            <svg width="22" height="22" viewBox="0 0 22 22" className="mobile-header-circle">
              <circle
                cx="11"
                cy="11"
                r={circleR}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                opacity="0.15"
              />
              <circle
                cx="11"
                cy="11"
                r={circleR}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray={circleC}
                strokeDashoffset={circleOffset}
                strokeLinecap="round"
                className="mobile-header-circle-progress"
              />
            </svg>
          </div>

          {/* Dropdown menu */}
          {mobileDropdownOpen && (
            <div className="mobile-header-dropdown" onClick={(e) => e.stopPropagation()}>
              {isHomePage &&
                sectionItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollTo(item.id)}
                    className={`mobile-header-dropdown-item ${activeSection === item.id ? 'active' : ''}`}
                  >
                    {item.label}
                  </button>
                ))}
              <div className="mobile-header-dropdown-divider" />
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => goToRoute(item.route)}
                  className={`mobile-header-dropdown-item ${location.pathname.startsWith(item.route) ? 'active' : ''}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>,
        document.body
      )}

      {/* ===================== MOBILE BOTTOM DOCK ===================== */}
      {createPortal(
        <nav className="mobile-dock md:hidden" aria-label="Mobile navigation">
          {/* Home */}
          <button
            onClick={() => {
              if (isOnBlogPage || isOnProjectsPage) navigate('/');
              else scrollTo(SectionId.Hero);
            }}
            className={`mobile-dock-btn ${isHomePage && activeSection === SectionId.Hero ? 'active' : ''}`}
            aria-label="Home"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </button>

          {/* GitHub */}
          {profile?.github_url && (
            <a
              href={profile.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mobile-dock-btn"
              aria-label="GitHub"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          )}

          {/* Projects */}
          <button
            onClick={() => goToRoute('/projects')}
            className={`mobile-dock-btn ${isOnProjectsPage ? 'active' : ''}`}
            aria-label="Projects"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
          </button>

          {/* Blog */}
          <button
            onClick={() => goToRoute('/blog')}
            className={`mobile-dock-btn ${isOnBlogPage ? 'active' : ''}`}
            aria-label="Blog"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </button>

          {/* Theme toggle */}
          <button
            onClick={(e) => onToggleTheme(e)}
            className="mobile-dock-btn"
            aria-label={`Current theme: ${theme}. Click to switch.`}
          >
            <ThemeIcon theme={theme} size={20} />
          </button>
        </nav>,
        document.body
      )}
    </>
  );
};

/* Animated sun/moon theme icon with rotation + morph */
const ThemeIcon: React.FC<{ theme: Theme; size: number }> = ({ theme, size }) => {
  const isDark = theme === 'dark';
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`theme-icon ${isDark ? 'theme-icon-dark' : 'theme-icon-light'}`}
    >
      {/* Sun: circle + rays | Moon: crescent path */}
      {isDark ? (
        <path
          className="theme-icon-moon"
          d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
        />
      ) : (
        <>
          <circle className="theme-icon-center" cx="12" cy="12" r="5" />
          <g className="theme-icon-rays">
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </g>
        </>
      )}
    </svg>
  );
};
