import re

path = r'C:\Users\neola\Downloads\TBM-Production-main\TBM-Production-main\scripts\work_section.html'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

# find css classes for work-content-wrapper and work-content-wrap
from urllib.request import urlopen
css_url = 'https://cdn.prod.website-files.com/67d00479a9620d3fd5cfaf2a/css/kookie-kollective.webflow.shared.eb4ab824d.min.css'
with open(r'C:\Users\neola\Downloads\TBM-Production-main\TBM-Production-main\scripts\kookie_extracted_rules.css', 'r', encoding='utf-8') as f:
    rules = f.read()

# Let's inspect all rules for work-content-wrapper and work-content-wrap
for m in re.finditer(r'\.[^\{]*(?:work-content-wrapper|work-content-wrap)[^\{]*\{[^\}]*\}', rules):
    print(m.group(0))
