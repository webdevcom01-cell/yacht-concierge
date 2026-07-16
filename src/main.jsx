import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

import './i18n';
import { AppCtx, Nav, Footer, WhatsAppFloat, ErrorBoundary } from './components/shared';
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
const LegalNoticePage   = React.lazy(() => import('./components/legal').then(m => ({ default: m.LegalNoticePage })));
const PrivacyPage       = React.lazy(() => import('./components/legal').then(m => ({ default: m.PrivacyPage })));
const TermsPage         = React.lazy(() => import('./components/legal').then(m => ({ default: m.TermsPage })));

// ── URL ↔ Route helpers ──────────────────────────────────────────────────────

const SERVICE_IDS = ['berth', 'customs', 'provisioning', 'laundry', 'floristry', 'maintenance'];

function routeToPath(r) {
  if (!r) return '/';
  switch (r.page) {
    case 'home':          return '/';
    case 'services':      return '/services';
    case 'service':       return `/services/${r.id}`;
    case 'process':       return '/process';
    case 'contact':       return '/contact';
    case 'fleet':         return '/fleet';
    case 'about':         return '/about';
    case 'provisioning':  return '/provisioning';
    case 'legal':         return '/legal';
    case 'privacy':       return '/privacy';
    case 'terms':         return '/terms';
    default:              return '/';
  }
}

function pathToRoute(path) {
  const p = path.replace(/\/$/, '') || '/';
  if (p === '/' || p === '')              return { page: 'home' };
  if (p === '/services')                  return { page: 'services' };
  if (p.startsWith('/services/')) {
    const id = p.slice('/services/'.length);
    if (SERVICE_IDS.includes(id))         return { page: 'service', id };
  }
  if (p === '/process')                   return { page: 'process' };
  if (p === '/contact')                   return { page: 'contact' };
  if (p === '/fleet')                     return { page: 'fleet' };
  if (p === '/about')                     return { page: 'about' };
  if (p === '/provisioning')              return { page: 'provisioning' };
  if (p === '/legal')                     return { page: 'legal' };
  if (p === '/privacy')                   return { page: 'privacy' };
  if (p === '/terms')                     return { page: 'terms' };
  return { page: '404' };
}

// ── App ──────────────────────────────────────────────────────────────────────

function App() {
  const [route, setRouteState] = useState(() => pathToRoute(window.location.pathname));

  const setRoute = (r) => {
    const path = routeToPath(r);
    window.history.pushState(r, '', path);
    setRouteState(r);
    window.scrollTo({ top: 0, behavior: 'instant' });
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

  // Theme is the only runtime-adjustable design token (nav toggle);
  // accent, nav style and grid density are fixed design decisions.
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const ctx = {
    route, setRoute,
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
  else if (route.page === 'legal')    Page = <LegalNoticePage/>;
  else if (route.page === 'privacy')  Page = <PrivacyPage/>;
  else if (route.page === 'terms')    Page = <TermsPage/>;
  else                                Page = <NotFoundPage/>;

  const labelMap = {
    home: '01 Home', services: '02 Services', service: '03 Service Detail',
    process: '04 How It Works', contact: '05 Contact', fleet: '06 Berths',
    about: '07 About',
    provisioning: '08 Provisioning',
    legal: '09 Legal Notice', privacy: '10 Privacy Policy', terms: '11 Terms of Service',
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
