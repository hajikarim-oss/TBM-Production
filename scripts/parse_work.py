import re

with open('scripts/work_section.html', 'r', encoding='utf-8') as f:
    html = f.read()

titles = re.findall(r'class="cards-headline">([^<]+)<', html)
print('Titles count:', len(titles))
for i, t in enumerate(titles):
    print(f'{i+1}: {t}')
