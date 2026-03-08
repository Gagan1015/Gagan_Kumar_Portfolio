import React, { useState, useEffect, Suspense, lazy } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { SEOHead } from './components/SEOHead';
import { SectionId, Theme } from './types';
import { useProfile } from './hooks/usePortfolio';

// Lazy-load below-the-fold home sections to reduce initial JS payload
const Profile = lazy(() => import('./components/Profile').then(m => ({ default: m.Profile })));
const Experience = lazy(() => import('./components/Experience').then(m => ({ default: m.Experience })));
const Projects = lazy(() => import('./components/Projects').then(m => ({ default: m.Projects })));
const Skills = lazy(() => import('./components/Skills').then(m => ({ default: m.Skills })));
const Education = lazy(() => import('./components/Education').then(m => ({ default: m.Education })));
const Footer = lazy(() => import('./components/Footer').then(m => ({ default: m.Footer })));
const AIChat = lazy(() => import('./components/AIChat').then(m => ({ default: m.AIChat })));

// Lightweight chat launcher — only loads the 221KB AIChat chunk when user clicks
const AIChatLauncher: React.FC = () => {
  const [showChat, setShowChat] = useState(false);
  return (
    <>
      {showChat ? (
        <Suspense fallback={null}>
          <AIChat />
        </Suspense>
      ) : (
        <button
          onClick={() => setShowChat(true)}
          className="fixed bottom-8 right-8 z-50 flex items-center justify-center w-14 h-14 bg-black dark:bg-white text-white dark:text-black border border-black dark:border-white transition-transform duration-300 hover:scale-105"
          aria-label="Toggle AI Chat"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
        </button>
      )}
    </>
  );
};

// Lazy-load page components for code splitting
const BlogList = lazy(() => import('./components/BlogList').then(m => ({ default: m.BlogList })));
const BlogPostPage = lazy(() => import('./components/BlogPost').then(m => ({ default: m.BlogPostPage })));
const ProjectsList = lazy(() => import('./components/ProjectsList').then(m => ({ default: m.ProjectsList })));
const ProjectDetailPage = lazy(() => import('./components/ProjectDetail').then(m => ({ default: m.ProjectDetailPage })));

// Create QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: 2,
    },
  },
});

// Theme Provider Hook
const useTheme = () => {
  const [theme, setTheme] = useState<Theme>('system');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
    
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const root = window.document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(mediaQuery.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  return { theme, cycleTheme };
};

// Portfolio Home Page
const PortfolioHome: React.FC<{ activeSection: string; setActiveSection: (s: string) => void; theme: Theme; onToggleTheme: () => void }> = ({ 
  activeSection, setActiveSection, theme, onToggleTheme 
}) => {
  const { data: profile } = useProfile();

  useEffect(() => {
    const handleScroll = () => {
      const sections = Object.values(SectionId);
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setActiveSection]);

  return (
    <div className="bg-white dark:bg-geo-dark-bg min-h-screen selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-300">
      <SEOHead 
        title={`${profile?.full_name || 'Gagan Kumar'} — Full-Stack Developer Portfolio`}
        description="Full-Stack Developer specializing in React, TypeScript, Laravel & modern web tech. View projects, skills & blog."
        url="https://gagankumar.me/"
      />
      <Header activeSection={activeSection} theme={theme} onToggleTheme={onToggleTheme} />
      <main>
        <Hero />
        <Suspense fallback={<div className="min-h-screen" />}>
          <Profile />
          <Experience />
          <Skills />
          <Projects />
          <Education />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
      <AIChatLauncher />
    </div>
  );
};

// Content Layout Wrapper (includes Header + Footer)
const ContentLayout: React.FC<{ children: React.ReactNode; theme: Theme; onToggleTheme: () => void; activeNav: string }> = ({
  children, theme, onToggleTheme, activeNav
}) => {
  return (
    <div className="bg-white dark:bg-geo-dark-bg min-h-screen selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-300">
      <Header activeSection={activeNav} theme={theme} onToggleTheme={onToggleTheme} />
      {children}
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
};

const AppContent: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>(SectionId.Hero);
  const { theme, cycleTheme } = useTheme();

  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <Routes>
        <Route 
          path="/" 
          element={
            <PortfolioHome 
              activeSection={activeSection} 
              setActiveSection={setActiveSection} 
              theme={theme} 
              onToggleTheme={cycleTheme} 
            />
          } 
        />
        <Route 
          path="/blog" 
          element={
            <ContentLayout theme={theme} onToggleTheme={cycleTheme} activeNav="blog">
              <SEOHead 
                title="Blog — Gagan Kumar | Full-Stack Developer"
                description="Read blog posts by Gagan Kumar on web development, React, TypeScript, Laravel, PHP, and modern software engineering topics."
                url="https://gagankumar.me/blog"
              />
              <BlogList />
            </ContentLayout>
          } 
        />
        <Route 
          path="/blog/:slug" 
          element={
            <ContentLayout theme={theme} onToggleTheme={cycleTheme} activeNav="blog">
              <BlogPostPage />
            </ContentLayout>
          } 
        />
        <Route
          path="/projects"
          element={
            <ContentLayout theme={theme} onToggleTheme={cycleTheme} activeNav="projects">
              <SEOHead 
                title="Projects — Gagan Kumar | Full-Stack Developer"
                description="Explore projects by Gagan Kumar — web applications, APIs, design systems, and experiments built with React, TypeScript, Laravel, and more."
                url="https://gagankumar.me/projects"
              />
              <ProjectsList />
            </ContentLayout>
          }
        />
        <Route
          path="/projects/:id"
          element={
            <ContentLayout theme={theme} onToggleTheme={cycleTheme} activeNav="projects">
              <ProjectDetailPage />
            </ContentLayout>
          } 
        />
      </Routes>
    </Suspense>
  );
};

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
