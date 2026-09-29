import { twMerge } from 'tailwind-merge';

import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Safely resolves an asset path against the base deployment path (e.g. '/studio/' or '/')
 * Handles full URLs (https://...), data URLs, and root-relative paths.
 */
export function assetUrl(path: string): string {
  if (!path) return '';
  // Preserve absolute external URLs (R2 bucket, CDN, HTTP/HTTPS) and data URIs
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('//') ||
    path.startsWith('data:')
  ) {
    return path;
  }

  // 1. Use Vite's configured base URL
  let base = import.meta.env.BASE_URL || '/';

  // 2. Runtime safeguard: If hosted at /studio and base was root '/', adapt automatically
  if (typeof window !== 'undefined') {
    const pathname = window.location.pathname;
    if (pathname === '/studio' || pathname.startsWith('/studio/')) {
      base = '/studio/';
    }
  }

  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  return `${cleanBase}${cleanPath}`;
}
