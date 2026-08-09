// URL ↔ route helpers, shared between main.jsx (the router) and seo.jsx
// (canonical/hreflang link generation). Kept in one place so a route
// structure change can't update one and silently drift from the other.

export const SERVICE_IDS = ['berth', 'customs', 'fuel', 'provisioning', 'laundry', 'floristry', 'maintenance'];

// N7 (Phase 1 — i18n URLs): English is the default, unprefixed language;
// ru/it get a leading /ru or /it path segment. Adding a language here later
// means: add to this list, add the locale bundle in i18n.js, and translate
// SEO_DATA in seo.jsx — none of that is automatic from this array alone.
export const SUPPORTED_LANGS = ['ru', 'it'];

export function routeToPath(r) {
  if (!r) return '/';
  const base = (() => {
    switch (r.page) {
      case 'home':          return '/';
      case 'services':      return '/services';
      case 'service':       return `/services/${r.id}`;
      case 'process':       return '/process';
      case 'contact':       return '/contact';
      case 'about':         return '/about';
      case 'provisioning':  return '/provisioning';
      case 'bunkering':     return '/bunkering';
      case 'legal':         return '/legal';
      case 'privacy':       return '/privacy';
      case 'terms':         return '/terms';
      default:              return '/';
    }
  })();
  if (!r.lang || !SUPPORTED_LANGS.includes(r.lang)) return base;
  return base === '/' ? `/${r.lang}` : `/${r.lang}${base}`;
}

export function pathToRoute(path) {
  // Strip a leading /ru or /it segment, if present, before parsing the rest
  // of the path with the same logic as before. `lang` is null for English
  // (unprefixed) — never the string 'en'; routeToPath relies on that.
  let lang = null;
  let rest = path;
  for (const l of SUPPORTED_LANGS) {
    if (path === `/${l}`) { lang = l; rest = '/'; break; }
    if (path.startsWith(`/${l}/`)) { lang = l; rest = path.slice(l.length + 1); break; }
  }

  const p = rest.replace(/\/$/, '') || '/';
  let route;
  if (p === '/' || p === '')              route = { page: 'home' };
  else if (p === '/services')             route = { page: 'services' };
  else if (p.startsWith('/services/')) {
    const id = p.slice('/services/'.length);
    route = SERVICE_IDS.includes(id) ? { page: 'service', id } : { page: '404' };
  }
  else if (p === '/process')              route = { page: 'process' };
  else if (p === '/contact')              route = { page: 'contact' };
  else if (p === '/about')                route = { page: 'about' };
  else if (p === '/provisioning')         route = { page: 'provisioning' };
  else if (p === '/bunkering')            route = { page: 'bunkering' };
  else if (p === '/legal')                route = { page: 'legal' };
  else if (p === '/privacy')              route = { page: 'privacy' };
  else if (p === '/terms')                route = { page: 'terms' };
  else                                     route = { page: '404' };

  return { ...route, lang };
}
