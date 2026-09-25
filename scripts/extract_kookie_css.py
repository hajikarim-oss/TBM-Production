import urllib.request
import re

url = 'https://cdn.prod.website-files.com/67d00479a9620d3fd5cfaf2a/css/kookie-kollective.webflow.shared.eb4ab824d.min.css'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req) as resp:
        css = resp.read().decode('utf-8')
    print('CSS length:', len(css))
    
    # search for work classes
    classes = [
        'section-work', 'work-wrapper', 'work-sticky-wrap', 'work-content-item',
        'cards-headline', 'work-content-services', 'work-content-service-line',
        'behind-the-scene-wrap', 'behind-scene-headline', 'project-image-splide',
        'our-work-image', 'work-corners', 'work-cross'
    ]
    
    with open('scripts/kookie_extracted_rules.css', 'w', encoding='utf-8') as out:
        for c in classes:
            # find rules starting with .class
            pattern = re.compile(r'(\.[^\{]*' + re.escape(c) + r'[^\{]*\{[^\}]*\})')
            matches = pattern.findall(css)
            out.write(f'/* === {c} ({len(matches)} rules) === */\n')
            for m in matches:
                out.write(m + '\n')
            out.write('\n')
    print('Extracted rules saved to scripts/kookie_extracted_rules.css')
except Exception as e:
    print('Error:', e)
