import urllib.request
import re

url = "https://www.theboredmonkey.com/sitemap.xml"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
try:
    with urllib.request.urlopen(req) as resp:
        content = resp.read().decode("utf-8")
except Exception as e:
    content = ""

# Existing URLs from live sitemap
existing_entries = re.findall(r'<url>(.*?)</url>', content, re.DOTALL)

master_urls = [
    """  <!-- Homepage -->
  <url>
    <loc>https://www.theboredmonkey.com/</loc>
    <lastmod>2026-09-30</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.00</priority>
  </url>""",
    """  <!-- Studio (Vercel App Proxied) -->
  <url>
    <loc>https://www.theboredmonkey.com/studio</loc>
    <lastmod>2026-09-30</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.90</priority>
  </url>"""
]

seen_locs = {"https://www.theboredmonkey.com/", "https://theboredmonkey.com/", "https://www.theboredmonkey.com/studio"}

for entry in existing_entries:
    loc_match = re.search(r'<loc>(.*?)</loc>', entry)
    if not loc_match:
        continue
    loc = loc_match.group(1).strip()
    
    # Normalize to www if desired, or preserve
    loc_norm = loc.replace("https://theboredmonkey.com", "https://www.theboredmonkey.com")
    if loc_norm in seen_locs or loc in seen_locs:
        continue
    seen_locs.add(loc_norm)
    seen_locs.add(loc)
    
    # Clean entry
    clean_entry = re.sub(r'https://theboredmonkey\.com', 'https://www.theboredmonkey.com', entry.strip())
    master_urls.append("  <url>\n    " + "\n    ".join([line.strip() for line in clean_entry.splitlines() if line.strip()]) + "\n  </url>")

sitemap_xml = """<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
""" + "\n\n".join(master_urls) + "\n\n</urlset>\n"

with open("hostinger-origin/sitemap.xml", "w", encoding="utf-8") as f:
    f.write(sitemap_xml)

with open("artifacts/videofolio/public/sitemap.xml", "w", encoding="utf-8") as f:
    f.write(sitemap_xml)

print("Generated comprehensive master sitemap.xml with", len(master_urls), "URLs!")
