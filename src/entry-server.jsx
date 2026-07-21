import React from 'react';
import { renderToString } from 'react-dom/server';
import { App } from './App.jsx';
import { setLanguage } from './i18n.js';
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
  const head = computeHeadTags({ page: route.page, id: route.id, lang: route.lang || 'en' });
  return { html, head };
}

export { SERVICE_IDS, SUPPORTED_LANGS, routeToPath };
