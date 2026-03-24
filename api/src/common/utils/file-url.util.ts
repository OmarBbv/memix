export const ensureFullUrl = (
  path: string | null | undefined,
): string | null => {
  if (!path || path === '{}' || typeof path !== 'string') return null;
  if (path.startsWith('http')) return path;

  const appUrl = process.env.APP_URL || 'http://localhost:4444';
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  return `${appUrl}${normalizedPath}`;
};
