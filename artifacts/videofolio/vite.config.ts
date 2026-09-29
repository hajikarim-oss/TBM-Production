import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

import fs from 'fs';
import runtimeErrorOverlay from '@replit/vite-plugin-runtime-error-modal';

function videoStreamPlugin() {
  return {
    name: 'video-stream-middleware',
    configureServer(server: any) {
      server.middlewares.use((req: any, res: any, next: any) => {
        const rawUrl = req.url ? req.url.split('?')[0] : '';
        if (!rawUrl.endsWith('.mp4')) {
          return next();
        }

        const decoded = decodeURIComponent(rawUrl);
        let filePath = path.join(import.meta.dirname, 'public', decoded);
        if (!fs.existsSync(filePath)) {
          const baseName = path.basename(decoded);
          filePath = path.join(import.meta.dirname, 'public', 'videos', baseName);
          if (!fs.existsSync(filePath)) {
            filePath = path.join(import.meta.dirname, 'public', 'videos', 'bts', baseName);
          }
        }

        if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
          return next();
        }

        const stat = fs.statSync(filePath);
        const fileSize = stat.size;
        const range = req.headers.range;

        res.setHeader('Accept-Ranges', 'bytes');
        res.setHeader('Content-Type', 'video/mp4');

        if (range) {
          const parts = range.replace(/bytes=/, '').split('-');
          const start = parseInt(parts[0], 10);
          const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
          const chunksize = end - start + 1;
          const file = fs.createReadStream(filePath, { start, end });

          res.writeHead(206, {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Content-Length': chunksize,
          });
          file.pipe(res);
        } else {
          res.writeHead(200, {
            'Content-Length': fileSize,
          });
          fs.createReadStream(filePath).pipe(res);
        }
      });
    },
  };
}

function copyStudioPlugin() {
  return {
    name: 'copy-studio-dist',
    closeBundle() {
      const distDir = path.resolve(import.meta.dirname, 'dist');
      const studioDir = path.resolve(distDir, 'studio');
      if (fs.existsSync(distDir)) {
        if (!fs.existsSync(studioDir)) {
          fs.mkdirSync(studioDir, { recursive: true });
        }
        const items = fs.readdirSync(distDir);
        for (const item of items) {
          if (item === 'studio') continue;
          const srcPath = path.join(distDir, item);
          const destPath = path.join(studioDir, item);
          try {
            fs.cpSync(srcPath, destPath, { recursive: true, force: true });
          } catch (e) {
            // Ignore copy conflicts if any
          }
        }
      }
    },
  };
}

function devSubpathFallbackPlugin() {
  return {
    name: 'dev-subpath-fallback',
    configureServer(server: any) {
      server.middlewares.use((req: any, res: any, next: any) => {
        if (req.url && req.url.startsWith('/studio/')) {
          req.url = req.url.replace(/^\/studio\//, '/');
        }
        next();
      });
    },
  };
}

const port = process.env.PORT ? parseInt(process.env.PORT) : 5173;

export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [
    videoStreamPlugin(),
    copyStudioPlugin(),
    devSubpathFallbackPlugin(),
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== 'production' &&
    process.env.REPL_ID !== undefined
      ? [
          await import('@replit/vite-plugin-cartographer').then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, '..'),
            }),
          ),
          await import('@replit/vite-plugin-dev-banner').then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
      '@assets': path.resolve(
        import.meta.dirname,
        '..',
        '..',
        'attached_assets',
      ),
    },
    dedupe: ['react', 'react-dom'],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2022',
    cssMinify: 'lightningcss',
    reportCompressedSize: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-motion': ['framer-motion'],
        },
        // Deterministic hashed names for immutable caching
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'chunks/[name]-[hash].js',
        entryFileNames: 'entries/[name]-[hash].js',
      },
    },
  },
  server: {
    port,
    strictPort: true,
    host: '0.0.0.0',
    allowedHosts: true,
    fs: {
      strict: true,
    },
    watch: {
      ignored: ['**/*.mp4', '**/public/videos/**', '**/node_modules/**', '**/.git/**'],
    },
  },
  preview: {
    port,
    host: '0.0.0.0',
    allowedHosts: true,
  },
});
