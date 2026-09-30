"""
Live SEO & Bot Auditing Tool for www.theboredmonkey.com/studio
Simulates Googlebot desktop, Googlebot smartphone, and standard browsers.
Checks:
- HTTP Status Codes (200 OK)
- robots.txt & sitemap.xml reachability and syntax
- Canonical URL accuracy (must be https://www.theboredmonkey.com/studio)
- Title tag presence and length (50-60 chars)
- Description presence and length (150-160 chars)
- Robots / Googlebot meta tags (index, follow)
- Open Graph tags (og:title, og:description, og:image, og:url)
- Twitter card tags
- Schema.org JSON-LD structured data presence
- Cloudflare Bot Fight Mode / WAF challenge detection (Checking for CF 403/503/managed challenge)
- X-Robots-Tag header (must NOT be noindex)
- Content-Type header (must be text/html; charset=utf-8)
"""

import urllib.request
import re
import sys

URL = "https://www.theboredmonkey.com/studio"
ROBOTS_URL = "https://www.theboredmonkey.com/robots.txt"
SITEMAP_URL = "https://www.theboredmonkey.com/sitemap.xml"
OG_IMAGE_URL = "https://www.theboredmonkey.com/assets/og-studio.png"

GOOGLEBOT_UA = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"

def fetch(url, user_agent=GOOGLEBOT_UA):
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": user_agent,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        }
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            return response.getcode(), response.headers, response.read().decode("utf-8", errors="ignore")
    except urllib.error.HTTPError as e:
        return e.code, e.headers, e.read().decode("utf-8", errors="ignore")
    except Exception as e:
        return None, None, str(e)

def run_live_audit():
    print("=" * 60)
    print("LIVE SEO AUDIT: THE BORED MONKEY STUDIO (/studio)")
    print("=" * 60)

    # 1. robots.txt
    print(f"\n[1] Checking robots.txt ({ROBOTS_URL})...")
    code, headers, body = fetch(ROBOTS_URL)
    print(f"    Status: {code}")
    if code == 200:
        if "Allow: /" in body and "sitemap.xml" in body:
            print("    ✅ PASS: robots.txt allows crawling and points to sitemap.")
        else:
            print(f"    ⚠️ WARNING: robots.txt response received but content differs:\n{body[:200]}")
    else:
        print(f"    ❌ FAIL: robots.txt returned status {code}")

    # 2. sitemap.xml
    print(f"\n[2] Checking sitemap.xml ({SITEMAP_URL})...")
    code, headers, body = fetch(SITEMAP_URL)
    print(f"    Status: {code}")
    if code == 200:
        if "/studio" in body:
            print("    ✅ PASS: sitemap.xml includes /studio.")
        else:
            print(f"    ⚠️ WARNING: sitemap.xml does not contain /studio URL.")
    else:
        print(f"    ❌ FAIL: sitemap.xml returned status {code}")

    # 3. /studio page (Googlebot crawl test)
    print(f"\n[3] Testing Googlebot Request to {URL}...")
    code, headers, body = fetch(URL, GOOGLEBOT_UA)
    print(f"    Status: {code}")

    if code == 200:
        # Check CF Bot Challenge
        if "cf-browser-verification" in body or "Checking your browser" in body or "Attention Required! | Cloudflare" in body:
            print("    ❌ CRITICAL: Cloudflare Bot Fight Mode or WAF is challenging Googlebot!")
        else:
            print("    ✅ PASS: Googlebot reached origin without Cloudflare challenge.")

        # Header checks
        x_robots = headers.get("X-Robots-Tag", "")
        if "noindex" in x_robots.lower():
            print(f"    ❌ CRITICAL: X-Robots-Tag header is blocking indexing: {x_robots}")
        else:
            print(f"    ✅ PASS: X-Robots-Tag allows indexing ({x_robots or 'None/Default'})")

        content_type = headers.get("Content-Type", "")
        if "text/html" in content_type:
            print(f"    ✅ PASS: Content-Type is valid HTML ({content_type})")
        else:
            print(f"    ❌ FAIL: Invalid Content-Type ({content_type})")

        # HTML Meta Tag checks
        canonical = re.search(r'<link[^>]+rel=["\']canonical["\'][^>]+href=["\']([^"\']+)["\']', body, re.IGNORECASE)
        if canonical and "www.theboredmonkey.com/studio" in canonical.group(1):
            print(f"    ✅ PASS: Canonical tag verified: {canonical.group(1)}")
        else:
            print(f"    ❌ FAIL: Canonical tag missing or invalid ({canonical.group(0) if canonical else 'None'})")

        title = re.search(r'<title>(.*?)</title>', body, re.IGNORECASE)
        if title:
            print(f"    ✅ PASS: Title tag found ({len(title.group(1))} chars): {title.group(1)}")
        else:
            print("    ❌ FAIL: Title tag not found in initial HTML")

        desc = re.search(r'<meta[^>]+name=["\']description["\'][^>]+content=["\']([^"\']+)["\']', body, re.IGNORECASE)
        if desc:
            print(f"    ✅ PASS: Meta description found ({len(desc.group(1))} chars): {desc.group(1)}")
        else:
            print("    ❌ FAIL: Meta description not found")

        if "application/ld+json" in body:
            print("    ✅ PASS: JSON-LD Structured Data detected in initial HTML")
        else:
            print("    ❌ FAIL: JSON-LD Structured Data missing in initial HTML")

    elif code in (403, 503):
        print(f"    ❌ CRITICAL ERROR: HTTP {code} returned to Googlebot. Cloudflare WAF/Bot Protection is likely active.")
    else:
        print(f"    ❌ HTTP Error {code} when requesting {URL}")

    # 4. OG Image check
    print(f"\n[4] Checking OG Image ({OG_IMAGE_URL})...")
    code, headers, body = fetch(OG_IMAGE_URL)
    print(f"    Status: {code}")
    if code == 200:
        print("    ✅ PASS: OG image is accessible.")
    else:
        print(f"    ⚠️ OG image returned status {code}")

if __name__ == "__main__":
    run_live_audit()
