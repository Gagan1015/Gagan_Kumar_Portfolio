import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useProfile } from '../hooks/usePortfolio';
import { SectionId } from '../types';

/* ─── Footer nav links ─── */
const FOOTER_NAV = [
  { label: 'Home', id: SectionId.Hero },
  { label: 'About', id: SectionId.Profile },
  { label: 'Experience', id: SectionId.Experience },
  { label: 'Projects', id: SectionId.Projects },
  { label: 'Skills', id: SectionId.Skills },
  { label: 'Education', id: SectionId.Education },
];

/* ─── Magnetic hover button ─── */
const MagneticLink: React.FC<{
  href: string;
  label: string;
  children: React.ReactNode;
}> = ({ href, label, children }) => {
  const ref = useRef<HTMLAnchorElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'translate(0, 0)';
  }, []);

  return (
    <a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="footer-social-icon"
    >
      {children}
    </a>
  );
};

/* ─── Local time display ─── */
const LocalTime: React.FC = () => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
          timeZone: 'Asia/Kolkata',
        })
      );
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="font-mono text-xs tabular-nums text-neutral-500 dark:text-neutral-500">
      {time} IST
    </span>
  );
};

/* ─── Big CTA text with letter hover effect ─── */
const CTAText: React.FC<{ text: string; href: string }> = ({ text, href }) => {
  return (
    <a href={href} className="footer-cta-link group">
      <span className="footer-cta-text">
        {text.split('').map((char, i) => (
          <span
            key={i}
            className="footer-cta-char"
            style={{ transitionDelay: `${i * 15}ms` }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </span>
      <svg
        className="footer-cta-arrow"
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="7" y1="17" x2="17" y2="7" />
        <polyline points="7 7 17 7 17 17" />
      </svg>
    </a>
  );
};

/* ═══════════════════════════════════════════
   FOOTER COMPONENT
   ═══════════════════════════════════════════ */
export const Footer: React.FC = () => {
  const { data: profile, isLoading } = useProfile();
  const currentYear = new Date().getFullYear();
  const footerRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  /* Intersection Observer for entrance animation */
  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const socialLinks = [
    {
      key: 'github',
      label: 'GitHub',
      url: profile?.github_url,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
        </svg>
      ),
    },
    {
      key: 'linkedin',
      label: 'LinkedIn',
      url: profile?.linkedin_url,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      key: 'twitter',
      label: 'X / Twitter',
      url: profile?.twitter_url,
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
  ];

  return (
    <footer
      ref={footerRef}
      className="relative bg-neutral-50 dark:bg-[#050505] text-neutral-900 dark:text-white overflow-hidden transition-colors duration-300 pb-24 md:pb-0"
    >
      {/* ─── Main content ─── */}
      <div className="section-frame">
        <div className="section-frame-inner pb-10 pt-14 md:pb-12 md:pt-24">

        {/* ROW 1: Big CTA */}
        <div
          className={`transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          {isLoading ? (
            <div className="h-20 md:h-32 w-3/4 bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded" />
          ) : (
            <CTAText
              text="Let's work together"
              href={`mailto:${profile?.email || ''}`}
            />
          )}
        </div>

        {/* Divider */}
        <div
          className={`footer-divider my-10 md:my-16 transition-all duration-700 ease-out delay-100 ${
            isVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
          }`}
        />

        {/* ROW 2: Three-column info grid */}
        <div
          className={`grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 transition-all duration-700 ease-out delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          {/* Col 1: Navigation */}
          <div className="md:col-span-4">
            <h4 className="footer-label">Navigation</h4>
            <ul className="space-y-2 mt-4">
              {FOOTER_NAV.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => scrollTo(item.id)}
                    className="footer-nav-link"
                  >
                    <span className="footer-nav-arrow">&#8599;</span>
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 2: Connect */}
          <div className="md:col-span-4">
            <h4 className="footer-label">Connect</h4>
            <div className="mt-4 space-y-4">
              {/* Social icons */}
              <div className="flex items-center gap-3">
                {isLoading ? (
                  <>
                    <span className="w-10 h-10 bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded-full" />
                    <span className="w-10 h-10 bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded-full" />
                    <span className="w-10 h-10 bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded-full" />
                  </>
                ) : (
                  socialLinks.map(
                    (link) =>
                      link.url && (
                        <MagneticLink key={link.key} href={link.url} label={link.label}>
                          {link.icon}
                        </MagneticLink>
                      )
                  )
                )}
              </div>

              {/* Email */}
              {!isLoading && profile?.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="footer-email group"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  {profile.email}
                </a>
              )}


            </div>
          </div>

          {/* Col 3: Details */}
          <div className="md:col-span-4">
            <h4 className="footer-label">Details</h4>
            <div className="mt-4 space-y-3">
              {/* Location */}
              {!isLoading && profile?.location && (
                <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="flex-shrink-0 text-neutral-400 dark:text-neutral-600">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {profile.location}
                </div>
              )}

              {/* Local time */}
              <div className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="flex-shrink-0 text-neutral-400 dark:text-neutral-600">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <LocalTime />
              </div>

              {/* Availability status */}
              <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
                </span>
                Available for work
              </div>
            </div>
          </div>
        </div>

        {/* ─── Bottom bar ─── */}
        <div
          className={`mt-12 border-t border-neutral-200/60 pt-6 transition-all duration-700 ease-out delay-300 dark:border-neutral-800/60 md:mt-20 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          } flex flex-col items-start justify-between gap-4 md:flex-row md:items-center`}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-6">
            <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-500">
              &copy; {currentYear} &mdash; Built with ❤️ by Gagan Kumar
            </span>
          </div>

          {/* Back to top */}
          <button
            onClick={scrollToTop}
            className="footer-back-to-top group"
            aria-label="Back to top"
          >
            <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-500 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
              Back to top
            </span>
            <span className="footer-back-to-top-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="19" x2="12" y2="5" />
                <polyline points="5 12 12 5 19 12" />
              </svg>
            </span>
          </button>
        </div>
        </div>
      </div>

      {/* ─── Decorative grid overlay ─── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-0 dark:opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
    </footer>
  );
};
