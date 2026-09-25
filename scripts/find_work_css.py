import urllib.request
import re

url = 'https://cdn.prod.website-files.com/67d00479a9620d3fd5cfaf2a/css/kookie-kollective.webflow.shared.eb4ab824d.min.css'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as resp:
    css = resp.read().decode('utf-8')

for m in re.finditer(r'\.[^\{]*(?:work-content-wrap|work-content-wrapper|cards-headline)[^\{]*\{[^\}]*\}', css):
    print(m.group(0))
