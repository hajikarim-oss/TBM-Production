import re

path = r'C:\Users\neola\.gemini\antigravity-ide\brain\c00da43f-9f82-4d2c-8e60-c59dc2e33495\.system_generated\steps\548\content.md'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

# Find scripts containing GSAP or work animations
scripts = re.findall(r'<script[^>]*>(.*?)</script>', text, re.DOTALL)
print('Total scripts:', len(scripts))

for i, s in enumerate(scripts):
    if 'work' in s.lower() or 'sticky' in s.lower() or 'scrolltrigger' in s.lower() or 'splide' in s.lower():
        print(f'Script {i} matches:')
        for line in s.split('\n'):
            if any(k in line.lower() for k in ['work', 'scrolltrigger', 'pin:', 'scrub:', 'sticky', 'gsap.to', 'gsap.set']):
                print('  ', line[:120])
