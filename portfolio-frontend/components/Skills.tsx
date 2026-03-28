import React, { useMemo, useEffect, useRef, useState, useCallback } from 'react';
import { SectionId, Skill } from '../types';
import { useSkillsGrouped } from '../hooks/usePortfolio';

// Map skill names to their Simple Icons slug or Devicon class for logo URLs
const SKILL_ICON_MAP: Record<string, { slug: string; type: 'simpleicons' | 'devicon' }> = {
  // Languages
  'javascript': { slug: 'javascript', type: 'devicon' },
  'typescript': { slug: 'typescript', type: 'devicon' },
  'python': { slug: 'python', type: 'devicon' },
  'php': { slug: 'php', type: 'devicon' },
  'java': { slug: 'java', type: 'devicon' },
  'c++': { slug: 'cplusplus', type: 'devicon' },
  'c#': { slug: 'csharp', type: 'devicon' },
  'ruby': { slug: 'ruby', type: 'devicon' },
  'go': { slug: 'go', type: 'devicon' },
  'rust': { slug: 'rust', type: 'devicon' },
  'swift': { slug: 'swift', type: 'devicon' },
  'kotlin': { slug: 'kotlin', type: 'devicon' },
  'dart': { slug: 'dart', type: 'devicon' },

  // Frontend Frameworks
  'react': { slug: 'react', type: 'devicon' },
  'react.js': { slug: 'react', type: 'devicon' },
  'reactjs': { slug: 'react', type: 'devicon' },
  'next.js': { slug: 'nextjs', type: 'devicon' },
  'nextjs': { slug: 'nextjs', type: 'devicon' },
  'vue.js': { slug: 'vuejs', type: 'devicon' },
  'vuejs': { slug: 'vuejs', type: 'devicon' },
  'vue': { slug: 'vuejs', type: 'devicon' },
  'angular': { slug: 'angularjs', type: 'devicon' },
  'svelte': { slug: 'svelte', type: 'devicon' },
  'nuxt.js': { slug: 'nuxtjs', type: 'devicon' },

  // Backend & Runtime
  'node.js': { slug: 'nodejs', type: 'devicon' },
  'nodejs': { slug: 'nodejs', type: 'devicon' },
  'express': { slug: 'express', type: 'devicon' },
  'express.js': { slug: 'express', type: 'devicon' },
  'django': { slug: 'django', type: 'devicon' },
  'flask': { slug: 'flask', type: 'devicon' },
  'laravel': { slug: 'laravel', type: 'devicon' },
  'spring': { slug: 'spring', type: 'devicon' },
  'rails': { slug: 'rails', type: 'devicon' },

  // Databases
  'mysql': { slug: 'mysql', type: 'devicon' },
  'postgresql': { slug: 'postgresql', type: 'devicon' },
  'mongodb': { slug: 'mongodb', type: 'devicon' },
  'redis': { slug: 'redis', type: 'devicon' },
  'sqlite': { slug: 'sqlite', type: 'devicon' },
  'firebase': { slug: 'firebase', type: 'devicon' },

  // DevOps & Cloud
  'docker': { slug: 'docker', type: 'devicon' },
  'kubernetes': { slug: 'kubernetes', type: 'devicon' },
  'aws': { slug: 'amazonwebservices', type: 'devicon' },
  'azure': { slug: 'azure', type: 'devicon' },
  'gcp': { slug: 'googlecloud', type: 'devicon' },
  'google cloud': { slug: 'googlecloud', type: 'devicon' },
  'heroku': { slug: 'heroku', type: 'devicon' },
  'nginx': { slug: 'nginx', type: 'devicon' },
  'linux': { slug: 'linux', type: 'devicon' },
  'git': { slug: 'git', type: 'devicon' },
  'github': { slug: 'github', type: 'devicon' },

  // CSS & Styling
  'css': { slug: 'css3', type: 'devicon' },
  'css3': { slug: 'css3', type: 'devicon' },
  'html': { slug: 'html5', type: 'devicon' },
  'html5': { slug: 'html5', type: 'devicon' },
  'sass': { slug: 'sass', type: 'devicon' },
  'tailwind': { slug: 'tailwindcss', type: 'devicon' },
  'tailwindcss': { slug: 'tailwindcss', type: 'devicon' },
  'tailwind css': { slug: 'tailwindcss', type: 'devicon' },
  'bootstrap': { slug: 'bootstrap', type: 'devicon' },
  'material ui': { slug: 'materialui', type: 'devicon' },

  // Tools & Others
  'figma': { slug: 'figma', type: 'devicon' },
  'webpack': { slug: 'webpack', type: 'devicon' },
  'vite': { slug: 'vitejs', type: 'devicon' },
  'graphql': { slug: 'graphql', type: 'devicon' },
  'redux': { slug: 'redux', type: 'devicon' },
  'jest': { slug: 'jest', type: 'devicon' },
  'storybook': { slug: 'storybook', type: 'devicon' },
  'npm': { slug: 'npm-original-wordmark', type: 'devicon' },

  // Creative / Animation Libraries
  'three.js': { slug: 'threedotjs', type: 'simpleicons' },
  'threejs': { slug: 'threedotjs', type: 'simpleicons' },
  'd3.js': { slug: 'd3dotjs', type: 'simpleicons' },
  'd3': { slug: 'd3dotjs', type: 'simpleicons' },
  'webgl': { slug: 'webgl', type: 'simpleicons' },
  'framer motion': { slug: 'framer', type: 'simpleicons' },
  'gsap': { slug: 'greensock', type: 'simpleicons' },
  'canvas api': { slug: 'html5', type: 'devicon' },

  // Testing
  'jest/vitest': { slug: 'jest', type: 'devicon' },
  'vitest': { slug: 'vitest', type: 'simpleicons' },
  'cypress': { slug: 'cypress', type: 'simpleicons' },

  // CI/CD & Infrastructure
  'ci/cd': { slug: 'githubactions', type: 'simpleicons' },
  'terraform': { slug: 'terraform', type: 'devicon' },

  // System Design
  'system design': { slug: 'archlinux', type: 'simpleicons' },
};

// Official website URLs for each technology
const SKILL_URL_MAP: Record<string, string> = {
  'javascript': 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
  'typescript': 'https://www.typescriptlang.org',
  'python': 'https://www.python.org',
  'php': 'https://www.php.net',
  'java': 'https://www.java.com',
  'c++': 'https://isocpp.org',
  'c#': 'https://dotnet.microsoft.com/en-us/languages/csharp',
  'ruby': 'https://www.ruby-lang.org',
  'go': 'https://go.dev',
  'rust': 'https://www.rust-lang.org',
  'swift': 'https://www.swift.org',
  'kotlin': 'https://kotlinlang.org',
  'dart': 'https://dart.dev',
  'react': 'https://react.dev',
  'react.js': 'https://react.dev',
  'reactjs': 'https://react.dev',
  'next.js': 'https://nextjs.org',
  'nextjs': 'https://nextjs.org',
  'vue.js': 'https://vuejs.org',
  'vuejs': 'https://vuejs.org',
  'vue': 'https://vuejs.org',
  'angular': 'https://angular.dev',
  'svelte': 'https://svelte.dev',
  'nuxt.js': 'https://nuxt.com',
  'alpine.js': 'https://alpinejs.dev',
  'node.js': 'https://nodejs.org',
  'nodejs': 'https://nodejs.org',
  'express': 'https://expressjs.com',
  'express.js': 'https://expressjs.com',
  'django': 'https://www.djangoproject.com',
  'flask': 'https://flask.palletsprojects.com',
  'laravel': 'https://laravel.com',
  'spring': 'https://spring.io',
  'rails': 'https://rubyonrails.org',
  'mysql': 'https://www.mysql.com',
  'my sql': 'https://www.mysql.com',
  'postgresql': 'https://www.postgresql.org',
  'mongodb': 'https://www.mongodb.com',
  'redis': 'https://redis.io',
  'sqlite': 'https://www.sqlite.org',
  'firebase': 'https://firebase.google.com',
  'docker': 'https://www.docker.com',
  'kubernetes': 'https://kubernetes.io',
  'aws': 'https://aws.amazon.com',
  'azure': 'https://azure.microsoft.com',
  'gcp': 'https://cloud.google.com',
  'google cloud': 'https://cloud.google.com',
  'heroku': 'https://www.heroku.com',
  'nginx': 'https://nginx.org',
  'linux': 'https://www.linux.org',
  'git': 'https://git-scm.com',
  'github': 'https://github.com',
  'css': 'https://developer.mozilla.org/en-US/docs/Web/CSS',
  'css3': 'https://developer.mozilla.org/en-US/docs/Web/CSS',
  'html': 'https://developer.mozilla.org/en-US/docs/Web/HTML',
  'html5': 'https://developer.mozilla.org/en-US/docs/Web/HTML',
  'sass': 'https://sass-lang.com',
  'tailwind': 'https://tailwindcss.com',
  'tailwindcss': 'https://tailwindcss.com',
  'tailwind css': 'https://tailwindcss.com',
  'bootstrap': 'https://getbootstrap.com',
  'material ui': 'https://mui.com',
  'figma': 'https://www.figma.com',
  'webpack': 'https://webpack.js.org',
  'vite': 'https://vitejs.dev',
  'graphql': 'https://graphql.org',
  'redux': 'https://redux.js.org',
  'jest': 'https://jestjs.io',
  'storybook': 'https://storybook.js.org',
  'npm': 'https://www.npmjs.com',
  'three.js': 'https://threejs.org',
  'threejs': 'https://threejs.org',
  'd3.js': 'https://d3js.org',
  'd3': 'https://d3js.org',
  'webgl': 'https://get.webgl.org',
  'framer motion': 'https://www.framer.com/motion',
  'gsap': 'https://gsap.com',
  'canvas api': 'https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API',
  'jest/vitest': 'https://vitest.dev',
  'vitest': 'https://vitest.dev',
  'cypress': 'https://www.cypress.io',
  'ci/cd': 'https://github.com/features/actions',
  'terraform': 'https://www.terraform.io',
  'system design': 'https://github.com/donnemartin/system-design-primer',
  'shad cdn': 'https://ui.shadcn.com',
  'shadcn': 'https://ui.shadcn.com',
};

function getSkillUrl(skillName: string): string | null {
  const key = skillName.toLowerCase().trim();
  return SKILL_URL_MAP[key] || null;
}

function getSkillIconUrl(skillName: string, existingIcon?: string | null): string {
  if (existingIcon) return existingIcon;
  const key = skillName.toLowerCase().trim();
  const mapping = SKILL_ICON_MAP[key];
  if (mapping) {
    if (mapping.type === 'devicon') {
      return `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${mapping.slug}/${mapping.slug}-original.svg`;
    } else {
      return `https://cdn.simpleicons.org/${mapping.slug}`;
    }
  }
  const fallbackSlug = skillName.toLowerCase().replace(/[\s.]+/g, '').replace(/[^a-z0-9]/g, '');
  return `https://cdn.simpleicons.org/${fallbackSlug}`;
}

// Category order for consistent display
const CATEGORY_ORDER = [
  'Languages', 'Frontend', 'Backend', 'Database', 'Databases',
  'DevOps', 'DevOps & Cloud', 'Tools', 'Tools & Others',
  'Testing', 'Creative', 'Other',
];

function getCategoryIndex(category: string): number {
  const lower = category.toLowerCase();
  const idx = CATEGORY_ORDER.findIndex(c => c.toLowerCase() === lower || lower.includes(c.toLowerCase()));
  return idx === -1 ? CATEGORY_ORDER.length : idx;
}

// Bento size assignment pattern — repeats for each category's skills
// 'lg' = 2-col span, 'md' = 1.5-col feel (but stays 1col), 'sm' = 1-col
// Pattern creates visual rhythm: first item large, then mix
type BentoSize = 'lg' | 'sm';

function getBentoSize(indexInCategory: number, totalInCategory: number): BentoSize {
  // First skill in category is always large
  if (indexInCategory === 0 && totalInCategory > 2) return 'lg';
  // Every 5th skill gets large to break rhythm
  if (indexInCategory > 0 && indexInCategory % 5 === 0 && indexInCategory + 1 < totalInCategory) return 'lg';
  return 'sm';
}

/* ---- Bento Skill Card ---- */
interface BentoCardProps {
  skill: Skill;
  size: BentoSize;
  index: number;
  isVisible: boolean;
  category: string;
}

const BentoCard: React.FC<BentoCardProps> = ({ skill, size, index, isVisible, category }) => {
  const url = getSkillUrl(skill.name);

  const inner = (
    <div
      className={`bento-card ${isVisible ? 'bento-card-visible' : ''}`}
      style={{ transitionDelay: isVisible ? `${index * 50}ms` : '0ms' }}
    >
      {/* Icon */}
      <div className="bento-card-icon">
        <img
          src={getSkillIconUrl(skill.name, skill.icon)}
          alt={`${skill.name} logo`}
          className="bento-card-img"
          loading="lazy"
          decoding="async"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent && !parent.querySelector('.bento-card-fallback')) {
              const fb = document.createElement('div');
              fb.className = 'bento-card-fallback';
              fb.textContent = skill.name.charAt(0).toUpperCase();
              parent.appendChild(fb);
            }
          }}
        />
      </div>

      {/* Name */}
      <div className="bento-card-text">
        <span className="bento-card-name">{skill.name}</span>
      </div>

      {/* Link arrow */}
      {url && (
        <svg className="bento-card-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="7" y1="17" x2="17" y2="7" />
          <polyline points="7 7 17 7 17 17" />
        </svg>
      )}
    </div>
  );

  if (url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`bento-card-link bento-span-${size}`}
        title={`Visit ${skill.name}`}
      >
        {inner}
      </a>
    );
  }

  return <div className={`bento-span-${size}`}>{inner}</div>;
};

/* ---- Main Skills Section ---- */
export const Skills: React.FC = () => {
  const { data: skillsGrouped, isLoading, error } = useSkillsGrouped();
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [gridVisible, setGridVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setHeaderVisible(true); observer.disconnect(); }
      },
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setGridVisible(true); observer.disconnect(); }
      },
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [skillsGrouped]);

  // Sort categories, flatten into bento items with size assignments
  const bentoItems = useMemo(() => {
    if (!skillsGrouped) return [];
    const sorted = Object.entries(skillsGrouped)
      .sort(([a], [b]) => getCategoryIndex(a) - getCategoryIndex(b));

    const items: { skill: Skill; size: BentoSize; category: string }[] = [];
    for (const [category, skills] of sorted) {
      // Sort by proficiency descending within category
      const catSkills = [...skills].sort((a, b) => b.proficiency_level - a.proficiency_level);
      catSkills.forEach((skill, i) => {
        items.push({
          skill,
          size: getBentoSize(i, catSkills.length),
          category,
        });
      });
    }
    return items;
  }, [skillsGrouped]);

  const totalSkills = bentoItems.length;

  const renderContent = useCallback(() => {
    if (isLoading) {
      return (
        <div className="section-frame">
          <div className="section-frame-inner">
          <div className="skills-header-block">
            <h2 className="font-display text-4xl font-medium tracking-tight mb-6 text-black dark:text-white">
              TECHNICAL SKILLS<span className="text-neutral-300 dark:text-neutral-700">.</span>
            </h2>
          </div>
          <div className="bento-grid animate-pulse">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className={`h-20 bg-neutral-100 dark:bg-neutral-900 rounded-xl ${i <= 2 ? 'bento-span-lg' : 'bento-span-sm'}`} />
            ))}
          </div>
          </div>
        </div>
      );
    }

    if (error || !skillsGrouped) {
      return (
        <div className="section-frame">
          <div className="section-frame-inner">
          <p className="text-red-500">Error loading skills. Please try again later.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="section-frame">
        <div className="section-frame-inner">
        {/* Section Header */}
        <div className={`skills-header-block ${headerVisible ? 'skills-header-visible' : ''}`}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16 md:mb-20">
            <div className="md:col-span-5">
              <h2 className="font-display text-4xl md:text-5xl font-medium tracking-tight text-black dark:text-white">
                TECHNICAL<br />SKILLS<span className="text-neutral-300 dark:text-neutral-700">.</span>
              </h2>
              <div className="h-px w-12 bg-black dark:bg-white mt-4" />
              <p className="text-sm font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-600 mt-4">
                {totalSkills} Technologies
              </p>
            </div>
            <div className="md:col-span-7 md:flex md:items-end md:justify-end">
              <p className="text-neutral-500 dark:text-neutral-400 text-lg leading-relaxed md:max-w-md md:text-right">
                A toolkit refined over years of building scalable applications and immersive web experiences.
              </p>
            </div>
          </div>
        </div>

        {/* Bento Grid */}
        <div ref={gridRef} className="bento-grid">
          {bentoItems.map((item, i) => (
            <BentoCard
              key={item.skill.id}
              skill={item.skill}
              size={item.size}
              index={i}
              isVisible={gridVisible}
              category={item.category}
            />
          ))}
        </div>
        </div>
      </div>
    );
  }, [isLoading, error, skillsGrouped, headerVisible, gridVisible, totalSkills, bentoItems]);

  return (
    <section ref={sectionRef} id={SectionId.Skills} className="skills-section">
      {renderContent()}
    </section>
  );
};
