import React from 'react';
import ReactDOM from 'react-dom/client';

import { App, ErrorBoundary } from './App.jsx';
import '../styles.css';
// Fonts: EB Garamond (headings), Inter (body), JetBrains Mono (labels).
// Cormorant Garamond and Fraunces were removed with the design-tweaks panel —
// the heading font is fixed to EB Garamond in styles.css (--serif).
import '@fontsource/eb-garamond/400.css';
import '@fontsource/eb-garamond/400-italic.css';
// Inter: keep 400, 500, 600 (dropped 300 — unused in CSS)
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
// JetBrains Mono: 400 only (dropped 500 — unused in CSS)
import '@fontsource/jetbrains-mono/400.css';

// Client entry point only. The App component itself lives in ./App.jsx so
// that scripts/prerender.mjs (Node/SSR, no `window`/`document`) can import
// and render it directly without pulling in this file's browser-only
// ReactDOM.createRoot(...).render(...) call below.
ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <App/>
  </ErrorBoundary>
);
