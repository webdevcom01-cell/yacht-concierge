// Production static file server (Railway's `npm start`). Replaces the
// `serve` package — see the Phase 2 write-up: `serve -s` does not resolve
// nested `<dir>/index.html` files for clean-URL requests (confirmed by
// testing directly), which broke prerendered per-route/per-language pages.
// `sirv`, used here as a library (not its CLI, so we can set headers per
// request), resolves real files/directories first and only falls back to
// the root index.html for genuinely unmatched paths.
import { createServer } from 'http';
import sirv from 'sirv';

const PORT = process.env.PORT || 3000;

const serve = sirv('dist', {
  single: true, // SPA fallback to /index.html for paths with no matching file
  etag: true,
  setHeaders(res, pathname) {
    if (pathname.startsWith('/assets/')) {
      // Hashed filenames — safe to cache for a year, immutable.
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    } else if (/\.(jpg|jpeg|png|svg|webp|ico)$/i.test(pathname)) {
      res.setHeader('Cache-Control', 'public, max-age=86400');
    } else {
      // Everything else — root, every prerendered route's index.html (served
      // under its clean URL, not literally ending in "index.html"), sitemap.xml,
      // robots.txt, etc. — must revalidate so route content updates show up
      // immediately after a deploy. Mirrors the old public/serve.json policy.
      res.setHeader('Cache-Control', 'no-cache');
    }
  },
});

createServer((req, res) => serve(req, res)).listen(PORT, () => {
  console.log(`yacht-concierge server listening on ${PORT}`);
});
