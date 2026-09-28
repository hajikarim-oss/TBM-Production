/**
 * Central configuration for Cloudflare R2 and media assets.
 * 
 * NOTE: Cloudflare S3 endpoint (https://<account_id>.r2.cloudflarestorage.com/<bucket>)
 * is for private API access only. Browser video playback requires either:
 * 1. A public r2.dev domain (e.g. https://pub-xxx.r2.dev)
 * 2. A custom domain connected to R2 (e.g. https://media.theboredmonkey.com)
 */
export const R2_BASE_URL =
  import.meta.env.VITE_R2_URL ||
  'https://pub-1ad682700e73410b958dd10d131d07d5.r2.dev';

export function getR2VideoUrl(filename: string): string {
  if (!filename) return '';
  if (filename.startsWith('http://') || filename.startsWith('https://')) return filename;
  const cleanFilename = filename.startsWith('/') ? filename.slice(1) : filename;
  return `${R2_BASE_URL}/${cleanFilename}`;
}
