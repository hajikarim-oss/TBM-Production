import os
import re
import sys

def verify():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    dist_dir = os.path.join(base_dir, "artifacts", "videofolio", "dist")
    
    errors = []
    successes = []

    # 1. Check robots.txt
    robots_path = os.path.join(dist_dir, "robots.txt")
    if not os.path.exists(robots_path):
        errors.append("robots.txt not found in dist")
    else:
        content = open(robots_path, "r", encoding="utf-8").read()
        if "Allow: /" not in content or "Sitemap: https://www.theboredmonkey.com/sitemap.xml" not in content:
            errors.append(f"robots.txt missing allow or sitemap: {content}")
        else:
            successes.append("robots.txt is valid and includes sitemap")

    # 2. Check sitemap.xml
    sitemap_path = os.path.join(dist_dir, "sitemap.xml")
    if not os.path.exists(sitemap_path):
        errors.append("sitemap.xml not found in dist")
    else:
        content = open(sitemap_path, "r", encoding="utf-8").read()
        if "https://www.theboredmonkey.com/studio" not in content:
            errors.append("sitemap.xml missing studio URL")
        else:
            successes.append("sitemap.xml is valid and includes https://www.theboredmonkey.com/studio")

    # 3. Check OG image
    og_img_path = os.path.join(dist_dir, "assets", "og-studio.png")
    if not os.path.exists(og_img_path):
        errors.append(f"OG image not found at {og_img_path}")
    else:
        size = os.path.getsize(og_img_path)
        if size > 1048576 or size < 1000:
            errors.append(f"OG image size abnormal: {size} bytes")
        else:
            successes.append(f"OG image exists and is {size} bytes (< 1MB)")

    # 4. Check index.html & studio/index.html
    for html_file in ["index.html", "studio/index.html"]:
        full_path = os.path.join(dist_dir, html_file)
        if not os.path.exists(full_path):
            errors.append(f"{html_file} does not exist in dist")
            continue
        content = open(full_path, "r", encoding="utf-8").read()

        # Canonical
        if '<link rel="canonical" href="https://www.theboredmonkey.com/studio"' not in content:
            errors.append(f"{html_file} canonical tag missing or incorrect")
        else:
            successes.append(f"{html_file} canonical is exact")

        # Title
        if "<title>The Bored Monkey Studio — Commercials, DVCs &amp; Brand Films</title>" not in content:
            errors.append(f"{html_file} title tag missing or incorrect")
        else:
            successes.append(f"{html_file} title tag is exact")

        # Description
        if 'name="description"' not in content:
            errors.append(f"{html_file} description tag missing")
        else:
            successes.append(f"{html_file} meta description present")

        # Robots & Googlebot
        if 'name="robots" content="index, follow"' not in content or 'name="googlebot" content="index, follow"' not in content:
            errors.append(f"{html_file} robots or googlebot tag missing")
        else:
            successes.append(f"{html_file} robots & googlebot meta tags present")

        # OpenGraph
        if 'property="og:image" content="https://www.theboredmonkey.com/assets/og-studio.png"' not in content:
            errors.append(f"{html_file} og:image tag missing or incorrect")
        else:
            successes.append(f"{html_file} og:image tag present")

        # JSON-LD
        if 'application/ld+json' not in content or 'schema.org' not in content:
            errors.append(f"{html_file} JSON-LD structured data missing")
        else:
            successes.append(f"{html_file} JSON-LD structured data graph present")

    print("=== SEO BUILD VERIFICATION RESULTS ===")
    for s in successes:
        print(f" [PASS] {s}")
    
    if errors:
        print("\n=== ERRORS ===")
        for e in errors:
            print(f" [FAIL] {e}")
        sys.exit(1)
    else:
        print("\nALL SEO BUILD CHECKS PASSED PERFECTLY!")

if __name__ == "__main__":
    verify()
