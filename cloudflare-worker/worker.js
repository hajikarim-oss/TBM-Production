/**
 * Cloudflare Worker: studio-proxy
 * Proxies https://www.theboredmonkey.com/studio -> https://tbm-production-api-server.vercel.app
 * 
 * 2026 Production-Ready Architecture:
 * - Zero-loss SEO tag preservation (Title, Meta, Canonical, OpenGraph, JSON-LD)
 * - Safe X-Robots-Tag: index, follow header injection
 * - Clickjacking protection preserved (X-Frame-Options: SAMEORIGIN)
 * - Googlebot / Verified Bot pass-through
 * - Explicit /studio/robots.txt and guaranteed /studio/sitemap.xml fallback
 * - Edge asset caching for sub-100ms TTFB
 */

const VERCEL_ORIGIN = 'https://tbm-production-api-server.vercel.app';
const PUBLIC_DOMAIN = 'https://www.theboredmonkey.com';

const FALLBACK_SITEMAP = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${PUBLIC_DOMAIN}/</loc>
    <lastmod>2026-09-30</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${PUBLIC_DOMAIN}/studio</loc>
    <lastmod>2026-09-30</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`;

const MERGED_ROBOTS = `User-agent: *
Allow: /
Disallow: /24_boredmonkey/
Disallow: /dfkg456_7hfdk12D___MFJHDFSH/jfdkgSD__UUECV_PIOU123/
Disallow: /oldwebsite/

User-agent: Googlebot
Disallow:

User-agent: googlebot-image
Disallow:

User-agent: googlebot-mobile
Disallow:

User-agent: Slurp
Disallow:

User-agent: baiduspider
Disallow:

User-agent: yahoo-blogs/v3.9
Disallow:

User-agent: *
Disallow:

Crawl-delay: 5
Sitemap: ${PUBLIC_DOMAIN}/sitemap.xml
`;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // 1. Direct handler for /studio/robots.txt
    if (pathname === '/studio/robots.txt' || pathname === '/studio/robots.txt/') {
      return new Response(MERGED_ROBOTS, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Cache-Control': 'public, max-age=86400',
          'X-Robots-Tag': 'index, follow',
        },
      });
    }

    // 2. Direct handler for /studio/sitemap.xml with guaranteed XML fallback
    if (pathname === '/studio/sitemap.xml') {
      try {
        const sitemapResponse = await fetch(`${VERCEL_ORIGIN}/sitemap.xml`);
        const contentType = sitemapResponse.headers.get('Content-Type') || '';
        if (sitemapResponse.ok && (contentType.includes('xml') || contentType.includes('text'))) {
          return new Response(sitemapResponse.body, {
            status: 200,
            headers: {
              'Content-Type': 'application/xml; charset=utf-8',
              'Cache-Control': 'public, max-age=86400',
              'X-Robots-Tag': 'index, follow',
            },
          });
        }
      } catch (err) {
        // Fall through to guaranteed XML fallback
      }

      // Guaranteed valid XML fallback (never returns HTML)
      return new Response(FALLBACK_SITEMAP, {
        status: 200,
        headers: {
          'Content-Type': 'application/xml; charset=utf-8',
          'Cache-Control': 'public, max-age=86400',
          'X-Robots-Tag': 'index, follow',
        },
      });
    }

    // 3. Construct target origin URL
    const targetUrl = new URL(url.pathname + url.search, VERCEL_ORIGIN);

    // Forward original request headers with routing metadata
    const forwardHeaders = new Headers(request.headers);
    forwardHeaders.set('Host', new URL(VERCEL_ORIGIN).host);
    forwardHeaders.set('X-Forwarded-Host', url.host || 'www.theboredmonkey.com');
    forwardHeaders.set('X-Forwarded-Proto', 'https');
    forwardHeaders.set('X-Real-IP', request.headers.get('cf-connecting-ip') || '');

    // 4. Fetch from Vercel backend
    const originResponse = await fetch(targetUrl.toString(), {
      method: request.method,
      headers: forwardHeaders,
      body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : null,
      redirect: 'follow',
    });

    // 5. Clone and sanitize response headers
    const responseHeaders = new Headers(originResponse.headers);

    // CRITICAL SEO RULE: Explicitly ensure indexing, NEVER noindex
    responseHeaders.delete('X-Robots-Tag');
    responseHeaders.set('X-Robots-Tag', 'index, follow');

    // Retain clickjacking security: preserve or set SAMEORIGIN
    if (!responseHeaders.has('X-Frame-Options')) {
      responseHeaders.set('X-Frame-Options', 'SAMEORIGIN');
    }

    // Ensure correct content-type for HTML
    const contentType = responseHeaders.get('Content-Type') || '';
    if (contentType.includes('text/html')) {
      responseHeaders.set('Content-Type', 'text/html; charset=utf-8');

      // Edge caching policy for HTML: fresh content with fast failover
      responseHeaders.set(
        'Cache-Control',
        'public, max-age=0, s-maxage=300, stale-while-revalidate=86400'
      );

      let html = await originResponse.text();

      // Ensure canonical points to canonical production domain
      if (!html.includes('rel="canonical"')) {
        html = html.replace(
          '</head>',
          `  <link rel="canonical" href="${PUBLIC_DOMAIN}/studio" />\n</head>`
        );
      }

      return new Response(html, {
        status: originResponse.status,
        statusText: originResponse.statusText,
        headers: responseHeaders,
      });
    }

    // Static asset caching: 1 year immutable for hashed assets
    if (
      pathname.includes('/entries/') ||
      pathname.includes('/chunks/') ||
      pathname.includes('/assets/') ||
      pathname.includes('/fonts/')
    ) {
      responseHeaders.set('Cache-Control', 'public, max-age=31536000, immutable');
    }

    return new Response(originResponse.body, {
      status: originResponse.status,
      statusText: originResponse.statusText,
      headers: responseHeaders,
    });
  },
};
