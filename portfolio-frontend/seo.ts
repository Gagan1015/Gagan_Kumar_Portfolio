import { BlogPost } from './types';

export const SITE_URL = 'https://gagankumar.me';
export const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

export interface SeoMeta {
  title: string;
  description: string;
  url: string;
  image: string;
  type: 'website' | 'article';
  keywords?: string;
  imageAlt?: string;
  publishedTime?: string | null;
  modifiedTime?: string | null;
  jsonLd?: object | object[];
  noindex?: boolean;
}

const DEFAULT_DESCRIPTION = 'Full-Stack Developer specializing in React, TypeScript, Laravel and modern web technology. View projects, skills and blog.';
const DEFAULT_TITLE = 'Gagan Kumar | Full-Stack Developer Portfolio';

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Gagan Kumar',
  url: SITE_URL,
  image: DEFAULT_IMAGE,
  jobTitle: 'Full-Stack Developer',
  description: 'Full-Stack Developer and Software Engineer specializing in React, TypeScript, Laravel, and modern web technologies.',
  sameAs: [
    'https://linkedin.com/in/gagankumar',
    'https://github.com/Gagan1015',
    'https://x.com/gagankumar',
  ],
  knowsAbout: ['React', 'TypeScript', 'Laravel', 'PHP', 'JavaScript', 'Node.js', 'Full-Stack Development', 'Web Development', 'Software Engineering'],
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Gagan Kumar Portfolio',
  url: SITE_URL,
  description: DEFAULT_DESCRIPTION,
};

export const defaultSeo: SeoMeta = {
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  url: `${SITE_URL}/`,
  image: DEFAULT_IMAGE,
  imageAlt: DEFAULT_TITLE,
  type: 'website',
  keywords: 'Gagan Kumar, Full-Stack Developer, Software Engineer, React Developer, TypeScript, Laravel, Portfolio, Web Developer, Frontend Engineer, Backend Developer',
  jsonLd: [personJsonLd, websiteJsonLd],
};

export const blogListSeo: SeoMeta = {
  title: 'Blog | Gagan Kumar',
  description: 'Read posts by Gagan Kumar on web development, React, TypeScript, Laravel, PHP, and modern software engineering topics.',
  url: `${SITE_URL}/blog`,
  image: DEFAULT_IMAGE,
  imageAlt: 'Gagan Kumar blog',
  type: 'website',
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Blog | Gagan Kumar',
    url: `${SITE_URL}/blog`,
    description: 'Technical articles and notes by Gagan Kumar.',
  },
};

export const projectsSeo: SeoMeta = {
  title: 'Projects | Gagan Kumar',
  description: 'Explore projects by Gagan Kumar: web applications, APIs, design systems, and experiments built with React, TypeScript, Laravel, and more.',
  url: `${SITE_URL}/projects`,
  image: DEFAULT_IMAGE,
  imageAlt: 'Gagan Kumar projects',
  type: 'website',
  jsonLd: {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Projects | Gagan Kumar',
    url: `${SITE_URL}/projects`,
    description: 'Selected web development and full-stack software projects by Gagan Kumar.',
  },
};

export const notFoundSeo: SeoMeta = {
  title: 'Page Not Found | Gagan Kumar',
  description: 'The requested page could not be found on Gagan Kumar portfolio.',
  url: SITE_URL,
  image: DEFAULT_IMAGE,
  imageAlt: DEFAULT_TITLE,
  type: 'website',
  noindex: true,
};

export const toAbsoluteUrl = (value?: string | null): string => {
  if (!value) return DEFAULT_IMAGE;
  if (/^https?:\/\//i.test(value)) return value;
  return `${SITE_URL}${value.startsWith('/') ? value : `/${value}`}`;
};

export const createBlogPostSeo = (post: BlogPost, canonicalUrl: string): SeoMeta => {
  const title = post.meta_title || `${post.title} | Blog | Gagan Kumar`;
  const description = post.meta_description || post.excerpt || DEFAULT_DESCRIPTION;
  const image = toAbsoluteUrl(post.og_image || post.featured_image);

  return {
    title,
    description,
    url: canonicalUrl,
    image,
    imageAlt: post.title,
    type: 'article',
    keywords: post.meta_keywords || post.tags?.join(', '),
    publishedTime: post.published_at,
    modifiedTime: post.updated_at,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      image,
      datePublished: post.published_at,
      dateModified: post.updated_at,
      author: {
        '@type': 'Person',
        name: 'Gagan Kumar',
      },
      publisher: {
        '@type': 'Person',
        name: 'Gagan Kumar',
      },
      mainEntityOfPage: canonicalUrl,
      description,
      keywords: post.tags?.join(', '),
    },
  };
};

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const escapeJson = (value: object): string =>
  JSON.stringify(value).replace(/</g, '\\u003c');

const meta = (attr: 'name' | 'property', key: string, value?: string | null): string =>
  value ? `<meta ${attr}="${escapeHtml(key)}" content="${escapeHtml(value)}" />` : '';

export const buildSeoHead = (seo: SeoMeta): string => {
  const canonicalUrl = toAbsoluteUrl(seo.url);
  const image = toAbsoluteUrl(seo.image);
  const jsonLdItems = Array.isArray(seo.jsonLd) ? seo.jsonLd : seo.jsonLd ? [seo.jsonLd] : [];

  return [
    `<title>${escapeHtml(seo.title)}</title>`,
    meta('name', 'title', seo.title),
    meta('name', 'description', seo.description),
    meta('name', 'keywords', seo.keywords),
    meta('name', 'author', 'Gagan Kumar'),
    meta('name', 'robots', seo.noindex ? 'noindex, nofollow' : 'index, follow'),
    meta('name', 'language', 'English'),
    meta('name', 'theme-color', '#121212'),
    `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`,
    meta('property', 'og:type', seo.type),
    meta('property', 'og:url', canonicalUrl),
    meta('property', 'og:title', seo.title),
    meta('property', 'og:description', seo.description),
    meta('property', 'og:image', image),
    meta('property', 'og:image:secure_url', image),
    meta('property', 'og:image:width', '1200'),
    meta('property', 'og:image:height', '630'),
    meta('property', 'og:image:type', 'image/png'),
    meta('property', 'og:image:alt', seo.imageAlt || seo.title),
    meta('property', 'og:site_name', 'Gagan Kumar Portfolio'),
    meta('property', 'og:locale', 'en_US'),
    meta('property', 'article:published_time', seo.publishedTime),
    meta('property', 'article:modified_time', seo.modifiedTime),
    meta('name', 'twitter:card', 'summary_large_image'),
    meta('name', 'twitter:url', canonicalUrl),
    meta('name', 'twitter:title', seo.title),
    meta('name', 'twitter:description', seo.description),
    meta('name', 'twitter:image', image),
    ...jsonLdItems.map((item) => `<script type="application/ld+json">${escapeJson(item)}</script>`),
  ].filter(Boolean).join('\n  ');
};
