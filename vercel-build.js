const fs = require('fs');
const { execSync } = require('child_process');

execSync('pnpm --filter @workspace/videofolio build', { stdio: 'inherit' });

const src = '/vercel/path0/artifacts/videofolio/dist';
const dst = '/vercel/path0/dist/studio';
const root = '/vercel/path0/dist';

fs.mkdirSync(dst, { recursive: true });
fs.cpSync(src, dst, { recursive: true });
fs.writeFileSync(root + '/index.html', '<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0;url=/studio"></head></html>');
