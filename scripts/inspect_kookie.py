import re

path = r'C:\Users\neola\.gemini\antigravity-ide\brain\c00da43f-9f82-4d2c-8e60-c59dc2e33495\.system_generated\steps\548\content.md'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

print('Length:', len(text))
for m in re.finditer(r'(ZARA|VITALPIN|zara-action|work-item|work_item|\#work)', text, re.I):
    start = max(0, m.start() - 150)
    end = min(len(text), m.end() + 150)
    print('MATCH at', m.start(), ':')
    print(text[start:end])
    print('='*50)
