import React from 'react';
import { Helmet } from 'react-helmet-async';
import { toAbsoluteSiteUrl } from '../config/site';

interface PageMetaProps {
  title: string;
  description?: string;
  path?: string;
}

const PageMeta: React.FC<PageMetaProps> = ({ title, description, path }) => {
  const resolvedPath =
    path || (typeof window !== "undefined" ? window.location.pathname : "/");
  const url = toAbsoluteSiteUrl(resolvedPath);
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
