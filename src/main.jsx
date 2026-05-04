import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

import './i18n';
import { AppCtx, Nav, Footer, Icons, WhatsAppFloat, ErrorBoundary } from './components/shared';
import { PageSEO } from './seo.jsx';
import { HomePage } from './components/home-bottom';
import { ServicesPage, ServiceDetailPage } from './components/services';
import { ProcessPage, ContactPage, FleetPage, AboutPage, NotFoundPage } from './components/pages';
import { CookieConsent } from './components/cookie-consent';
import '../styles.css';
// N6: Reduced from 17 → 10 font imports — dropped unused weights/styles
// Cormorant: 400 + 400-italic only (dropped 300, 500, 300-italic, 500-italic)
import '@fontsource/cormorant-garamond/400.css';
import '@fontsource/cormorant-garamond/400-italic.css';
// EB Garamond: default heading font — keep both weights
import '@fontsource/eb-garamond/400.css';
import '@fontsource/eb-garamond/400-italic.css';
// Fraunces: 400 + 400-italic only (dropped 500)
import '@fontsource/fraunces/400.css';
import '@fontsource/fraunces/400-italic.css';
// Inter: keep 400, 500, 600 (dropped 300 — unused in CSS)
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
// JetBrains Mono: 400 only (dropped 500 — unused in CSS)
import '@fontsource/jetbrains-mono/400.css';

// N6: Lazy-load heavy route components — provisioning ~40% of bundle, legal ~8%
const ProvisioningPage  = React.lazy(() => import('./components/provisioning').then(m => ({ default: m.ProvisioningPage })));
const OrderSummaryPage  = React.lazy(() => import('./components/provisioning').then(m => ({ default: m.OrderSummaryPage })));
const LegalNoticePage   = React.lazy(() => import('./components/legal').then(m => ({ default: m.LegalNoticePage })));
const PrivacyPage       = React.lazy(() => import('./components/legal').then(m => ({ default: m.PrivacyPage })));
const TermsPage         = React.lazy(() => import('./components/legal').then(m => ({ default: m.TermsPage })));

const TWEAKS = {
  "theme": "light",
  "accent": "gold",
  "navStyle": "glass",
  "heroVariant": "editorial",
  "serviceDensity": "standard",
  "headingFont": "garamond"
};

const FONT_MAP = {
  cormorant: "'Cormorant Garamond', Georgia, serif",
  fraunces: "'Fraunces', Georgia, serif",
  garamond: "'EB Garamond', Georgia, serif",
};

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
    case 'order-summary': return '/order-summary';
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
  if (p === '/order-summary')             return { page: 'order-summary' };
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

  const [tweaks, setTweaks] = useState(TWEAKS);
  const [tweaksOpen, setTweaksOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', tweaks.theme);
    document.documentElement.setAttribute('data-accent', tweaks.accent);
    document.documentElement.style.setProperty('--serif', FONT_MAP[tweaks.headingFont] || FONT_MAP.cormorant);
  }, [tweaks.theme, tweaks.accent, tweaks.headingFont]);

  useEffect(() => {
    const onMsg = (e) => {
      if (e.data?.type === '__activate_edit_mode') { setEditMode(true); setTweaksOpen(true); }
      if (e.data?.type === '__deactivate_edit_mode') { setEditMode(false); setTweaksOpen(false); }
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);

  const setTweak = (k, v) => {
    setTweaks(prev => {
      const next = { ...prev, [k]: v };
      window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { [k]: v } }, '*');
      return next;
    });
  };

  const ctx = {
    route, setRoute,
    theme: tweaks.theme,
    setTheme: (t) => setTweak('theme', t),
    accent: tweaks.accent,
    navStyle: tweaks.navStyle,
    heroVariant: tweaks.heroVariant,
    serviceDensity: tweaks.serviceDensity,
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
  else if (route.page === 'order-summary')  Page = <OrderSummaryPage/>;
  else if (route.page === 'legal')    Page = <LegalNoticePage/>;
  else if (route.page === 'privacy')  Page = <PrivacyPage/>;
  else if (route.page === 'terms')    Page = <TermsPage/>;
  else                                Page = <NotFoundPage/>;

  const labelMap = {
    home: '01 Home', services: '02 Services', service: '03 Service Detail',
    process: '04 How It Works', contact: '05 Contact', fleet: '06 Berths',
    about: '07 About',
    provisioning: '08 Provisioning', 'order-summary': '08 Order Summary',
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
        <CookieConsent/>
      </div>
      {editMode && (
        <div className="tweaks" data-open={tweaksOpen}>
          <div className="tweaks-title">
            <span>Tweaks</span>
            <button onClick={() => setTweaksOpen(false)} style={{ color: 'var(--fg-50)' }}>
              <Icons.Close size={14}/>
            </button>
          </div>
          <TweakGroup label="Theme"        value={tweaks.theme}          options={[['light','Light'],['dark','Dark']]}                         onChange={v => setTweak('theme', v)}/>
          <TweakGroup label="Accent"       value={tweaks.accent}         options={[['teal','Sea Teal'],['gold','Champagne']]}                  onChange={v => setTweak('accent', v)}/>
          <TweakGroup label="Navbar"       value={tweaks.navStyle}       options={[['glass','Glass'],['solid','Solid'],['line','Line']]}        onChange={v => setTweak('navStyle', v)}/>
          <TweakGroup label="Hero Layout"  value={tweaks.heroVariant}    options={[['editorial','Editorial'],['cinematic','Cinematic'],['oversized','Oversized']]} onChange={v => setTweak('heroVariant', v)}/>
          <TweakGroup label="Services Grid" value={tweaks.serviceDensity} options={[['loose','2-col'],['standard','3-col'],['dense','4-col']]}  onChange={v => setTweak('serviceDensity', v)}/>
          <TweakGroup label="Heading Font" value={tweaks.headingFont}    options={[['cormorant','Cormorant'],['fraunces','Fraunces'],['garamond','Garamond']]} onChange={v => setTweak('headingFont', v)}/>
        </div>
      )}
    </AppCtx.Provider>

  );
}

function TweakGroup({ label, value, options, onChange }) {
  return (
    <div className="tweaks-group">
      <div className="tweaks-group-label">{label}</div>
      <div className="tweaks-options">
        {options.map(([v, l]) => (
          <button key={v} className="tweaks-opt" data-on={value === v} onClick={() => onChange(v)}>{l}</button>
        ))}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <App/>
  </ErrorBoundary>
);
