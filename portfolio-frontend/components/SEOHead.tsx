import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  type?: string;
}

const DEFAULT_TITLE = 'Gagan Kumar | Full-Stack Developer Portfolio';
const DEFAULT_DESCRIPTION = 'Full-Stack Developer specializing in React, TypeScript, Laravel & modern web tech. View projects, skills & blog.';
const BASE_URL = 'https://gagankumar.me';
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;

/**
 * Dynamically updates document head meta tags after client-side route changes.
 * Initial crawler-visible tags are emitted by the SSR server.
 */
export const SEOHead: React.FC<SEOHeadProps> = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  url = BASE_URL,
  image = DEFAULT_IMAGE,
  type = 'website',
}) => {
  useEffect(() => {
    document.title = title;

    const setMeta = (attr: string, key: string, value: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', value);
    };

    setMeta('name', 'title', title);
    setMeta('name', 'description', description);

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);

    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:image', image);
    setMeta('property', 'og:type', type);

    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:url', url);
    setMeta('name', 'twitter:image', image);
  }, [title, description, url, image, type]);

  return null;
};
