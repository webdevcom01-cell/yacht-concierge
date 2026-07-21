// Runs after `vite build` (see package.json's "build" script). Builds a
// Node-targeted SSR bundle of src/entry-server.jsx, uses it to render all
// 18 pages × 3 languages (54 routes total — same enumeration as
// public/sitemap.xml), and writes each as a static dist/<path>/index.html
// so crawlers that don't execute JavaScript see real, per-route,
// per-language content — not just the empty SPA shell.
import { build } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const SSR_OUT = path.join(ROOT, 'dist-ssr');

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function main() {
  // 1. Build the SSR-targeted bundle of entry-server.jsx into dist-ssr/.
  //    Separate from the client build in dist/ — this one is Node-only and
  //    gets deleted at the end of this script; it never ships to production.
  // configFile: false — deliberately does NOT load vite.config.js. That
  // config's manualChunks (react/react-dom split into a 'vendor' chunk for
  // browser caching) is a client-only concern; SSR builds externalize
  // node_modules deps by default, and Rollup rejects manualChunks that
  // reference an external module. Re-declaring just the react() plugin here
  // keeps this SSR build minimal and independent of client-only tuning.
  await build({
    root: ROOT,
    logLevel: 'warn',
    configFile: false,
    plugins: [react()],
    build: {
      ssr: 'src/entry-server.jsx',
      outDir: 'dist-ssr',
      emptyOutDir: true,
      rollupOptions: { output: { format: 'es' } },
    },
  });

  const entryFiles = fs.readdirSync(SSR_OUT).filter(f => f.endsWith('.js') || f.endsWith('.mjs'));
  const entryFile = entryFiles.find(f => f.startsWith('entry-server')) || entryFiles[0];
  if (!entryFile) throw new Error(`prerender: no SSR entry file found in ${SSR_OUT} (found: ${entryFiles.join(', ') || 'nothing'})`);

  const { renderPage, SERVICE_IDS, SUPPORTED_LANGS, routeToPath } =
    await import(pathToFileURL(path.join(SSR_OUT, entryFile)).href);

  // 2. Same 18-page list as public/sitemap.xml's generator (routes.js is the
  //    single source of truth for the *shape* of a route; this list is the
  //    site's fixed page inventory, mirrored from src/seo.jsx's SEO_DATA keys).
  const PAGES = [
    { page: 'home' }, { page: 'services' },
    ...SERVICE_IDS.map(id => ({ page: 'service', id })),
    { page: 'provisioning' }, { page: 'bunkering' },
    { page: 'process' }, { page: 'fleet' }, { page: 'contact' }, { page: 'about' },
    { page: 'legal' }, { page: 'privacy' }, { page: 'terms' },
  ];

  const routes = [];
  for (const p of PAGES) {
    for (const lang of [null, ...SUPPORTED_LANGS]) {
      routes.push({ ...p, lang });
    }
  }
  if (routes.length !== 54) {
    throw new Error(`prerender: expected 54 routes (18 pages x 3 langs), got ${routes.length} — page list or SUPPORTED_LANGS drifted, check before shipping`);
  }

  // 3. Snapshot the client build's index.html ONCE — it's the template for
  //    every output file, including the one we're about to overwrite in place
  //    (the English homepage route maps to dist/index.html itself).
  const template = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
  const seoBlockRe = /<!-- SEO:START[\s\S]*?<!-- SEO:END -->/;
  if (!seoBlockRe.test(template)) throw new Error('prerender: SEO:START/SEO:END markers not found in dist/index.html — check index.html was built from the current source');
  if (!template.includes('<!-- ROOT:CONTENT -->')) throw new Error('prerender: ROOT:CONTENT marker not found in dist/index.html');

  let written = 0;
  for (const route of routes) {
    const { html, head } = await renderPage(route);
    const lang = route.lang || 'en';

    const seoBlock = [
      `<title>${escapeHtml(head.title)}</title>`,
      `<meta name="description" content="${escapeHtml(head.description)}"/>`,
      head.robots ? `<meta name="robots" content="${escapeHtml(head.robots)}"/>` : '',
      head.canonical ? `<link rel="canonical" href="${escapeHtml(head.canonical)}"/>` : '',
      ...head.hreflangs.map(({ hreflang, href }) => `<link rel="alternate" hreflang="${escapeHtml(hreflang)}" href="${escapeHtml(href)}"/>`),
      ...head.og.map(([prop, content]) => `<meta property="${escapeHtml(prop)}" content="${escapeHtml(content)}"/>`),
      ...head.twitter.map(([name, content]) => `<meta name="${escapeHtml(name)}" content="${escapeHtml(content)}"/>`),
      ...head.schemas.map(schema => `<script type="application/ld+json">${JSON.stringify(schema)}</script>`),
    ].filter(Boolean).join('\n');

    let out = template;
    out = out.replace('lang="en"', `lang="${lang}"`); // first occurrence only = the <html> tag
    out = out.replace(seoBlockRe, seoBlock);
    out = out.replace('<!-- ROOT:CONTENT -->', html);

    const urlPath = routeToPath(route); // e.g. '/', '/ru', '/services/fuel', '/it/services/fuel'
    const outPath = urlPath === '/'
      ? path.join(DIST, 'index.html')
      : path.join(DIST, urlPath.replace(/^\//, ''), 'index.html');

    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, out);
    written++;
  }

  fs.rmSync(SSR_OUT, { recursive: true, force: true });

  console.log(`prerender: wrote ${written}/54 static pages`);
  if (written !== 54) throw new Error(`prerender: only wrote ${written}/54 pages — aborting build`);
}

main().catch(err => {
  console.error('prerender failed:', err);
  process.exit(1);
});
