import { createHash } from 'node:crypto';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { readdirSync, cpSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { relative, resolve } from 'node:path';
import imageVariants from './src/content/image-variants.json';

const inputs = readdirSync('.').filter((file) => file.endsWith('.html'));
let siteBase = '/';
let buildOutput = 'dist';
const googleAnalyticsId = 'G-Q9P1010PSJ';
const siteOrigin = 'https://cactusbeing.github.io';
const excludedFromSearch = new Set(['404.html', 'coming.html']);
const canonicalFile = (file: string) => (file === 'post-old.html' ? 'post.html' : file);
const publicUrl = (file: string) =>
  new URL(
    siteBase + canonicalFile(file).replace(/(^|\/)index\.html$/, '$1')
      .split('/').map(encodeURIComponent).join('/'),
    siteOrigin,
  ).href;
const hasNoindex = (html: string) =>
  [...html.matchAll(/<meta\b[^>]*>/gi)].some(
    ([tag]) => /\bname=["'](?:robots|googlebot)["']/i.test(tag) &&
      /\bcontent=["'][^"']*\bnoindex\b/i.test(tag),
  );
for (const entry of [
  'exam/index.html',
  'exam/history/index.html',
  'game/index.html',
  'game/campus/index.html',
  'game/money/index.html',
  'game/chat-relay/index.html',
]) {
  if (existsSync(entry)) inputs.push(entry);
}

export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [
    vue(),
    {
      name: 'site-banner-preload',
      transformIndexHtml: {
        order: 'post',
        handler() {
          const variants = imageVariants['/assets/img/home-bg.jpg'];
          const url = (path: string) => siteBase + path.slice(1);
          return [{
            tag: 'link',
            attrs: {
              rel: 'preload',
              as: 'image',
              href: url(variants.find(({ width }) => width === 1280)!.src),
              imagesrcset: variants.map(({ src, width }) => `${url(src)} ${width}w`).join(', '),
              imagesizes: '(max-width: 767px) 540px, 100vw',
              fetchpriority: 'high',
            },
            injectTo: 'head',
          }];
        },
      },
    },
    {
      name: 'site-search-indexing',
      transformIndexHtml: {
        order: 'post',
        handler(html, context) {
          const file = relative(process.cwd(), context.filename).split('\\').join('/');
          if (excludedFromSearch.has(file)) {
            return {
              html,
              tags: [{ tag: 'meta', attrs: { name: 'robots', content: 'noindex' }, injectTo: 'head' }],
            };
          }
          if (hasNoindex(html)) return html;
          return {
            html: html.replace(/<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>/gi, ''),
            tags: [{ tag: 'link', attrs: { rel: 'canonical', href: publicUrl(file) }, injectTo: 'head' }],
          };
        },
      },
      generateBundle() {
        const pages = inputs.filter((file) =>
          !excludedFromSearch.has(file) && canonicalFile(file) === file &&
          !hasNoindex(readFileSync(file, 'utf8')),
        );
        const pdfs = existsSync('files')
          ? readdirSync('files', { recursive: true, encoding: 'utf8' })
              .filter((file) => file.toLowerCase().endsWith('.pdf'))
              .map((file) => `files/${file.split('\\').join('/')}`)
          : [];
        const escapeXml = (value: string) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;')
          .replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
        const urls = [...new Set([...pages, ...pdfs].map(publicUrl))].sort();
        this.emitFile({
          type: 'asset',
          fileName: 'sitemap.xml',
          source: '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
            urls.map((url) => `  <url><loc>${escapeXml(url)}</loc></url>`).join('\n') +
            '\n</urlset>\n',
        });
        this.emitFile({
          type: 'asset',
          fileName: 'robots.txt',
          source: `User-agent: *\nAllow: /\n\nSitemap: ${publicUrl('sitemap.xml')}\n`,
        });
      },
    },
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
      name: 'chat-relay-offline',
      apply: 'build',
      writeBundle(_options, bundle) {
        const entry = Object.values(bundle).find((item) => item.type === 'chunk' &&
          item.isEntry && item.facadeModuleId?.endsWith('/game/chat-relay/index.html'));
        if (!entry || entry.type !== 'chunk') throw new Error('Missing chat relay bundle entry');
        const files = new Set(['game/chat-relay/index.html']);
        const visit = (name: string) => {
          if (files.has(name)) return;
          files.add(name);
          const item = bundle[name];
          if (item?.type === 'chunk') {
            [...item.imports, ...item.dynamicImports].forEach(visit);
            const metadata = Reflect.get(item, 'viteMetadata') as
              { importedCss?: Set<string>; importedAssets?: Set<string> } | undefined;
            metadata?.importedCss?.forEach(visit);
            metadata?.importedAssets?.forEach(visit);
          }
        };
        visit(entry.fileName);
        const html = readFileSync(resolve(buildOutput, 'game/chat-relay/index.html'), 'utf8');
        for (const [, path] of html.matchAll(/(?:src|href)=["']([^"']+)["']/g)) {
          if (path.startsWith(siteBase + 'bundles/')) visit(path.slice(siteBase.length));
        }
        const fingerprint = createHash('sha256');
        [...files].sort().forEach((file) => fingerprint.update(readFileSync(resolve(buildOutput, file))));
        const revision = fingerprint.digest('hex').slice(0, 16);
        const urls = [...files].map((file) => siteBase + file);
        urls.push(siteBase + 'game/chat-relay/');
        const worker = `const PREFIX='cactus-chat-relay-'+encodeURIComponent(self.registration.scope)+'-';
const CACHE=PREFIX+'${revision}';
const URLS=${JSON.stringify(urls)};
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(URLS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith(PREFIX)&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==self.location.origin||!URLS.includes(u.pathname))return;e.respondWith(caches.open(CACHE).then(async c=>{const old=await c.match(u.pathname);if(e.request.mode==='navigate'){try{return await fetch(e.request);}catch{return old||Response.error();}}return old||fetch(e.request);}));});
`;
        writeFileSync(resolve(buildOutput, 'game/chat-relay/sw.js'), worker);
        writeFileSync(resolve(buildOutput, 'game/chat-relay/offline-manifest.json'),
          JSON.stringify({ revision, urls }, null, 2) + '\n');
      },
    },
    {
      name: 'preserve-public-assets',
      configResolved(config) {
        buildOutput = config.build.outDir;
      },
      closeBundle() {
        for (const path of ['assets', 'files', 'css', 'js', 'CNAME']) {
          if (existsSync(path)) cpSync(path, resolve(buildOutput, path), { recursive: true });
        }
      },
    },
  ],
  build: { assetsDir: 'bundles', rollupOptions: { input: inputs.map((file) => resolve(file)) } },
});
