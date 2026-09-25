import re

with open(r'C:\Users\neola\.gemini\antigravity-ide\brain\c00da43f-9f82-4d2c-8e60-c59dc2e33495\.system_generated\steps\437\content.md', 'r', encoding='utf-8') as f:
    text = f.read()

m = re.search(r'<div class="behind-the-scene-wrap".*?(?:<footer|<div class="footer|</body>)', text, re.DOTALL)
if m:
    with open('scripts/bts_dump.html', 'w', encoding='utf-8') as out:
        out.write(m.group(0)[:8000])
    print('Dumped bts_dump.html, length:', len(m.group(0)))
else:
    print('Not found')
