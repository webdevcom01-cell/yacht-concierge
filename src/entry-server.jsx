import React from 'react';
import { renderToString } from 'react-dom/server';
import { App } from './App.jsx';
import i18n, { setLanguage } from './i18n.js';
import { computeHeadTags } from './seo.jsx';
import { SERVICE_IDS, SUPPORTED_LANGS, routeToPath } from './routes.js';

// Node/SSR entry — built separately from the browser bundle (see
// scripts/prerender.mjs, which runs `vite build --ssr` against this file)
// and imported by that same script to render each of the 18 pages × 3
// languages ahead of time into static HTML.
//
// Two renderToString passes: this app uses React.lazy() for 5 of the 18
// pages (provisioning, bunkering, legal, privacy, terms — see App.jsx).
// React 18's classic renderToString does not await pending lazy imports —
// the first pass triggers the underlying dynamic import(); by the second
// pass (after a tick) that import has resolved and is cached, so the lazy
// component renders its real content instead of the Suspense fallback.
export async function renderPage(route) {
  await setLanguage(route.lang || 'en');
  renderToString(React.createElement(App, { initialRoute: route }));
  await new Promise(resolve => setTimeout(resolve, 0));
  const html = renderToString(React.createElement(App, { initialRoute: route }));
  // FAQ (Phase 4): read AFTER setLanguage has resolved, so the correct
  // language's resource bundle is guaranteed loaded — safe to call i18n.t()
  // directly here, unlike the browser (see PageSEO in seo.jsx for why that
  // side needs the `ready` flag instead).
  const faqEntries = route.page === 'service'
    ? i18n.t(`serviceDetail.${route.id}.faq`, { returnObjects: true })
    : null;
  const head = computeHeadTags({
    page: route.page, id: route.id, lang: route.lang || 'en',
    faqEntries: Array.isArray(faqEntries) ? faqEntries : null,
  });
  return { html, head };
}

export { SERVICE_IDS, SUPPORTED_LANGS, routeToPath };
