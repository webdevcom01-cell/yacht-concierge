import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

import { setLanguage } from './i18n';
import { SUPPORTED_LANGS, routeToPath, pathToRoute } from './routes.js';
import { AppCtx, Nav, Footer, WhatsAppFloat, ErrorBoundary } from './components/shared';
import { getInitialTheme } from './lib/theme';
import { PageSEO } from './seo.jsx';
import { HomePage } from './components/home-bottom';
import { ServicesPage, ServiceDetailPage } from './components/services';
import { ProcessPage, ContactPage, FleetPage, AboutPage, NotFoundPage } from './components/pages';
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

// N6: Lazy-load heavy route components
const ProvisioningPage  = React.lazy(() => import('./components/provisioning').then(m => ({ default: m.ProvisioningPage })));
const BunkeringPage     = React.lazy(() => import('./components/bunkering').then(m => ({ default: m.BunkeringPage })));
const LegalNoticePage   = React.lazy(() => import('./components/legal').then(m => ({ default: m.LegalNoticePage })));
const PrivacyPage       = React.lazy(() => import('./components/legal').then(m => ({ default: m.PrivacyPage })));
const TermsPage         = React.lazy(() => import('./components/legal').then(m => ({ default: m.TermsPage })));

// ── App ──────────────────────────────────────────────────────────────────────
// URL ↔ route helpers (SUPPORTED_LANGS, routeToPath, pathToRoute) now live in
// ./routes.js — seo.jsx imports the same module for hreflang link generation,
// so the two can never drift apart.

function App() {
  const [route, setRouteState] = useState(() => pathToRoute(window.location.pathname));

  const setRoute = (r) => {
    // Internal nav (nav links, cards, buttons) never specifies a language —
    // carry the current one forward so switching pages doesn't reset it.
    const next = { lang: route.lang, ...r };
    const path = routeToPath(next);
    window.history.pushState(next, '', path);
    setRouteState(next);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Changes only the language segment of the URL, keeping the current page.
  // Called by the LangSwitcher — does not touch i18next directly; the
  // useEffect below is the single place that does, reacting to route.lang.
  const setLang = (lang) => {
    const next = { ...route, lang: SUPPORTED_LANGS.includes(lang) ? lang : null };
    const path = routeToPath(next);
    window.history.pushState(next, '', path);
    setRouteState(next);
  };

  // Handle browser back / forward
  useEffect(() => {
    const onPop = (e) => {
      setRouteState(e.state || pathToRoute(window.location.pathname));
      window.scrollTo({ top: 0, behavior: 'instant' });
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // URL is the single source of truth for language (never localStorage —
  // see i18n.js). This runs on first mount (derives from the URL the page
  // was loaded with) and again whenever route.lang changes via setLang or
  // browser back/forward.
  useEffect(() => {
    setLanguage(route.lang || 'en');
  }, [route.lang]);

  // Theme is the only runtime-adjustable design token (nav toggle);
  // accent, nav style and grid density are fixed design decisions.
  // Initial value is timezone-aware (dark in the evening/night, light by
  // day) with a per-visit manual override — see src/lib/theme.js. The
  // index.html inline script already applied this same theme before first
  // paint; this just brings React's state in sync with what's on screen.
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const ctx = {
    route, setRoute, setLang,
    theme, setTheme,
    accent: 'gold',
    navStyle: 'glass',
    serviceDensity: 'standard',
  };

  let Page = null;
  if (route.page === 'home')          Page = <HomePage/>;
  else if (route.page === 'services') Page = <ServicesPage/>;
  else if (route.page === 'service')  Page = <ServiceDetailPage id={route.id}/>;
  else if (route.page === 'process')  Page = <ProcessPage/>;
  else if (route.page === 'contact')  Page = <ContactPage/>;
  else if (route.page === 'fleet')    Page = <FleetPage/>;
  else if (route.page === 'about')    Page = <AboutPage/>;
  else if (route.page === 'provisioning')   Page = <ProvisioningPage/>;
  else if (route.page === 'bunkering')      Page = <BunkeringPage/>;
  else if (route.page === 'legal')    Page = <LegalNoticePage/>;
  else if (route.page === 'privacy')  Page = <PrivacyPage/>;
  else if (route.page === 'terms')    Page = <TermsPage/>;
  else                                Page = <NotFoundPage/>;

  const labelMap = {
    home: '01 Home', services: '02 Services', service: '03 Service Detail',
    process: '04 How It Works', contact: '05 Contact', fleet: '06 Berths',
    about: '07 About',
    provisioning: '08 Provisioning',
    bunkering: '09 Fuel & Bunkering',
    legal: '10 Legal Notice', privacy: '11 Privacy Policy', terms: '12 Terms of Service',
  };

  return (

    <AppCtx.Provider value={ctx}>
      <div data-screen-label={labelMap[route.page] || 'Page'}>
        <PageSEO page={route.page} id={route.id} />
        <Nav/>
        <React.Suspense fallback={<div style={{ minHeight: '60vh' }}/>}>
          {Page}
        </React.Suspense>
        <Footer/>
        <WhatsAppFloat/>
      </div>
    </AppCtx.Provider>

  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <App/>
  </ErrorBoundary>
);
