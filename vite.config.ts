import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { readdirSync, cpSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const inputs = readdirSync('.').filter((file) => file.endsWith('.html'));
let siteBase = '/';
let buildOutput = 'dist';
const googleAnalyticsId = 'G-Q9P1010PSJ';
for (const entry of [
  'exam/index.html',
  'exam/history/index.html',
  'game/index.html',
  'game/campus/index.html',
]) {
  if (existsSync(entry)) inputs.push(entry);
}

export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [
    vue(),
    {
      name: 'site-html-base-paths',
      configResolved(config) {
        siteBase = config.base;
      },
      transformIndexHtml: {
        order: 'post',
        handler(html) {
          const base = siteBase;
          if (base === '/') return html;
          return html.replace(
            /\b(href|src|poster|action)=(['"])(\/(?!\/)[^'"]*)\2/g,
            (match, attr, quote, path) =>
              path.startsWith(base) ? match : `${attr}=${quote}${base}${path.slice(1)}${quote}`,
          );
        },
      },
    },
    {
      name: 'site-google-analytics',
      apply: 'build',
      transformIndexHtml: {
        order: 'pre',
        handler() {
          return [
            {
              tag: 'script',
              attrs: {
                async: true,
                src: `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`,
              },
              injectTo: 'head',
            },
            {
              tag: 'script',
              children: `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${googleAnalyticsId}');`,
              injectTo: 'head',
            },
          ];
        },
      },
    },
    {
      name: 'preserve-public-assets',
      configResolved(config) {
        buildOutput = config.build.outDir;
      },
      closeBundle() {
        for (const path of ['assets', 'files', 'css', 'js', 'CNAME', 'robots.txt', 'sitemap.xml']) {
          if (existsSync(path)) cpSync(path, resolve(buildOutput, path), { recursive: true });
        }
      },
    },
  ],
  build: { assetsDir: 'bundles', rollupOptions: { input: inputs.map((file) => resolve(file)) } },
});
