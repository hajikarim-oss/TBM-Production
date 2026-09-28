/**
 * Central configuration for Cloudflare R2 endpoints.
 * Account 1: https://pub-c3a151aad3544d4297431bb6fef7f945.r2.dev (Holds Atomberg CPJ, Zoff, Vibhor, Blue Tyga)
 * Account 2: https://pub-1ad682700e73410b958dd10d131d07d5.r2.dev (Holds Bombay Sweet Shop, Fiona, Happi Planet, Cheq, and all BTS)
 */
export const R2_ACC1_URL =
  import.meta.env.VITE_R2_ACC1_URL ||
  'https://pub-c3a151aad3544d4297431bb6fef7f945.r2.dev';

export const R2_ACC2_URL =
  import.meta.env.VITE_R2_ACC2_URL ||
  'https://pub-1ad682700e73410b958dd10d131d07d5.r2.dev';

export const R2_BASE_URL = R2_ACC2_URL;
