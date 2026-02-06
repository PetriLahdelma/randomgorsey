const DEFAULT_SITE_ORIGIN = "https://randomgorsey.com";

const normalizeOrigin = (origin: string): string => origin.replace(/\/+$/, "");

const getSiteOrigin = (): string => {
  const envOrigin = process.env.REACT_APP_SITE_ORIGIN;
  if (envOrigin && envOrigin.trim().length > 0) {
    return normalizeOrigin(envOrigin.trim());
  }
  return DEFAULT_SITE_ORIGIN;
};

export const SITE_ORIGIN = getSiteOrigin();

export const toAbsoluteSiteUrl = (path: string): string => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_ORIGIN}${normalizedPath}`;
};
