import fs from 'fs';

const css = fs.readFileSync('scripts/kookie.css', 'utf8');

function findRules(selector) {
  const regex = new RegExp(`(\\.[^{]*${selector}[^{]*)\\{([^}]+)\\}`, 'g');
  let match;
  const results = [];
  while ((match = regex.exec(css)) !== null) {
    results.push({ selector: match[1].trim(), body: match[2].trim() });
  }
  return results;
}

console.log('--- work-content-wrapper ---');
console.log(findRules('work-content-wrapper'));

console.log('--- work-content-item ---');
console.log(findRules('work-content-item'));

console.log('--- work-content-image ---');
console.log(findRules('work-content-image'));

console.log('--- cards-headline ---');
console.log(findRules('cards-headline'));

console.log('--- work-corners ---');
console.log(findRules('work-corner'));

console.log('--- work-cross ---');
console.log(findRules('work-cross'));
