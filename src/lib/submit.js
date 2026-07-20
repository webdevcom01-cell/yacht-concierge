// API_URL is baked in at build time from the VITE_API_URL environment variable
const API_URL = import.meta.env.VITE_API_URL;

// Detect unconfigured or placeholder URL
function isApiConfigured() {
  return API_URL &&
    !API_URL.includes('ZAMENI') &&
    !API_URL.includes('YOUR_') &&
    !API_URL.includes('placeholder') &&
    API_URL.startsWith('https://');
}

// GAS web apps deployed with access "Anyone" return a readable CORS response
// on GET (verified live 2026-07-16: fetch() → HTTP 200, body {"result":"ok"}).
// We therefore await the real response and THROW on any failure, so forms can
// show an honest error state instead of a false success.
async function postJSON(payload) {
  if (!isApiConfigured()) {
    console.warn('[submit] API endpoint not configured — set VITE_API_URL in your environment.');
    throw new Error('api-not-configured');
  }
  const url = API_URL + '?payload=' + encodeURIComponent(JSON.stringify(payload));
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 15000);
  try {
    const res = await fetch(url, { signal: ctrl.signal });
    if (!res.ok) throw new Error('http-' + res.status);
    const body = await res.json();
    if (body.result !== 'ok') throw new Error('gas-' + (body.message || 'error'));
    return body;
  } finally {
    clearTimeout(timer);
  }
}

export async function submitQuote(data, refNum) {
  return postJSON({
    _sheet:   'Quote Requests',
    _subject: `[${refNum}] Quote — ${data.yacht || 'Unknown'} — ${data.eta || 'TBD'}`,
    ref:      refNum,
    name:     data.name,
    role:     data.role,
    email:    data.email,
    phone:    data.phone || '—',
    yacht:    data.yacht,
    loa:      data.loa ? `${data.loa}m` : '—',
    flag:     data.flag || '—',
    port:     data.port,
    eta:      data.eta,
    etd:      data.etd || '—',
    services: data.services.join(', '),
    notes:    data.notes || '—',
  });
}

export async function submitCatalogueRequest(data, refNum) {
  return postJSON({
    _sheet:     'Catalogue Requests',
    _subject:   `[${refNum}] Catalogue request — ${data.yacht || data.name}`,
    ref:        refNum,
    name:       data.name,
    yacht:      data.yacht || '—',
    email:      data.email,
    phone:      data.phone || '—',
    marina:     data.marina || '—',
    categories: data.categories.join(', '),
    notes:      data.notes || '—',
  });
}

export async function submitBunkeringRequest(data, refNum) {
  return postJSON({
    _sheet:        'Bunkering Requests',
    _subject:      `[${refNum}] Fuel & bunkering — ${data.yacht || data.name}`,
    ref:           refNum,
    name:          data.name,
    yacht:         data.yacht || '—',
    email:         data.email,
    phone:         data.phone || '—',
    marina:        data.marina || '—',
    fuelTypes:     data.fuelTypes.join(', '),
    quantity:      data.quantity || '—',
    charterStatus: data.charterStatus,
    notes:         data.notes || '—',
  });
}
