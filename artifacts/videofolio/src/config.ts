/**
 * Central configuration for Cloudflare R2 endpoints.
 * Account 1: https://pub-c3a151aad3544d4297431bb6fef7f945.r2.dev (Holds Atomberg CPJ, Zoff, Vibhor, Blue Tyga)
 * Account 2: https://pub-1ad682700e73410b958dd10d131d07d5.r2.dev (Holds Bombay Sweet Shop, Fiona, Happi Planet, Cheq, and all BTS)
 */
const isDev = import.meta.env.DEV;
const forceRemote = import.meta.env.VITE_FORCE_REMOTE_VIDEOS === 'true';

// Check if running under the live production domain where Cloudflare Edge proxy /studio/cdn-1/ is active
const isLiveDomain =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'www.theboredmonkey.com' ||
    window.location.hostname === 'theboredmonkey.com');

// 1. Local dev: ultra-fast local SSD streaming with HTTP 206
// 2. Live production domain: cached Cloudflare Edge CDN proxy (/studio/cdn-1)
// 3. Fallback / staging: direct R2 public endpoints
export const R2_ACC1_REMOTE_URL = 'https://pub-c3a151aad3544d4297431bb6fef7f945.r2.dev';
export const R2_ACC2_REMOTE_URL = 'https://pub-1ad682700e73410b958dd10d131d07d5.r2.dev';

export const R2_ACC1_URL =
  import.meta.env.VITE_R2_ACC1_URL ||
  (isDev && !forceRemote
    ? '/videos/upload_to_account_1'
    : R2_ACC1_REMOTE_URL);

export const R2_ACC2_URL =
  import.meta.env.VITE_R2_ACC2_URL ||
  (isDev && !forceRemote
    ? '/videos/upload_to_account_2'
    : R2_ACC2_REMOTE_URL);

export const R2_BASE_URL = R2_ACC2_URL;

