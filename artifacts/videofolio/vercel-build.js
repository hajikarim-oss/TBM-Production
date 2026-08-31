const fs = require('fs');
const { execSync } = require('child_process');

execSync('pnpm --filter @workspace/videofolio build', { stdio: 'inherit' });

fs.mkdirSync('/vercel/path0/dist/studio', { recursive: true });
fs.cpSync('/vercel/path0/artifacts/videofolio/dist', '/vercel/path0/dist/studio', { recursive: true });
fs.writeFileSync('/vercel/path0/dist/index.html', '<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0;url=/studio"></head></html>');
