import re

path = r'C:\Users\neola\.gemini\antigravity-ide\brain\c00da43f-9f82-4d2c-8e60-c59dc2e33495\.system_generated\steps\437\content.md'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

# find all divs with class containing "section" or "bts" or "scenes" or "gallery"
for m in re.finditer(r'<div[^>]*class="[^"]*(?:section|bts|scene|gallery|slider|swiper|splide)[^"]*"[^>]*>', text, re.I):
    print(m.group(0)[:120])

# also look for "behind" in whole text
for m in re.finditer(r'behind[^\w]*the[^\w]*scenes|behind', text, re.I):
    start = max(0, m.start() - 150)
    end = min(len(text), m.end() + 250)
    print('--- MATCH BEHIND ---')
    print(text[start:end])
