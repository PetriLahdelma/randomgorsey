import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

interface PageMetaProps {
  title: string;
  description?: string;
  path?: string;
}

const PageMeta: React.FC<PageMetaProps> = ({ title, description, path }) => {
  const url = typeof window !== 'undefined'
    ? `${window.location.origin}${path || window.location.pathname}`
    : `https://randomgorsey.com${path || ''}`;

  useEffect(() => {
    if (typeof document === 'undefined') return;

    document.title = title;

    const ensureMeta = (selector: string, attr: string, key: string, content?: string) => {
      let element = document.head.querySelector(selector) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, key);
        document.head.appendChild(element);
      }
      if (typeof content === 'string') {
        element.setAttribute('content', content);
      }
    };

    const ensureLink = (rel: string, href: string) => {
      let element = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    if (description) {
      ensureMeta('meta[name="description"]', 'name', 'description', description);
    }
    ensureLink('canonical', url);
    ensureMeta('meta[property="og:title"]', 'property', 'og:title', title);
    if (description) {
      ensureMeta('meta[property="og:description"]', 'property', 'og:description', description);
    }
    ensureMeta('meta[property="og:url"]', 'property', 'og:url', url);
    ensureMeta('meta[property="og:type"]', 'property', 'og:type', 'website');
  }, [title, description, url]);

  return (
    <Helmet>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
    </Helmet>
  );
};

export default PageMeta;
