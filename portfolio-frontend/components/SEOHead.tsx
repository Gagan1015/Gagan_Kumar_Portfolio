import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  type?: string;
}

const DEFAULT_TITLE = 'Gagan Kumar — Full-Stack Developer Portfolio';
const DEFAULT_DESCRIPTION = 'Full-Stack Developer specializing in React, TypeScript, Laravel & modern web tech. View projects, skills & blog.';
const BASE_URL = 'https://gagankumar.me';
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;

/**
 * SEOHead — Dynamically updates document head meta tags for each route.
 * Updates title, description, canonical, OpenGraph, and Twitter meta tags.
 */
export const SEOHead: React.FC<SEOHeadProps> = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  url = BASE_URL,
  image = DEFAULT_IMAGE,
  type = 'website',
}) => {
  useEffect(() => {
    // Update title
    document.title = title;

    // Helper to set or create a meta tag
    const setMeta = (attr: string, key: string, value: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', value);
    };

    // Primary meta tags
    setMeta('name', 'title', title);
    setMeta('name', 'description', description);

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);

    // Open Graph
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:image', image);
    setMeta('property', 'og:type', type);

    // Twitter
    setMeta('property', 'twitter:title', title);
    setMeta('property', 'twitter:description', description);
    setMeta('property', 'twitter:url', url);
    setMeta('property', 'twitter:image', image);
  }, [title, description, url, image, type]);

  return null;
};
