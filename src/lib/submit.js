// API_URL is baked in at build time from VITE_API_URL environment variable
const API_URL = import.meta.env.VITE_API_URL;

// GAS web apps redirect POST requests internally, which breaks no-cors mode.
// Sending data as a GET request with URL-encoded payload is the reliable approach.
async function postJSON(payload) {
  if (!API_URL) {
    console.warn('[submit] VITE_API_URL not set — submission skipped in dev');
    return { result: 'dev-skip' };
  }
  const url = API_URL + '?payload=' + encodeURIComponent(JSON.stringify(payload));
  await fetch(url, { mode: 'no-cors' });
  return { result: 'ok' };
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

export async function submitOrder(cartItems, meta, refNum, total) {
  return postJSON({
    _sheet:     'Provisioning Orders',
    _subject:   `Order №${refNum} — ${meta.yacht || 'Unknown'} — ${meta.marina || ''}`,
    ref:        refNum,
    yacht:      meta.yacht || '—',
    marina:     meta.marina || '—',
    berth:      meta.berth || '—',
    date:       meta.date || '—',
    time:       meta.time || '—',
    notes:      meta.notes || '—',
    items:      cartItems.map(it =>
                  `${it.name} x${it.qty} = €${(it.price * it.qty).toFixed(2)}${it.taxFree ? ' [TF]' : ''}`
                ).join(' | '),
    item_count: String(cartItems.reduce((s, x) => s + x.qty, 0)),
    subtotal:   `€${cartItems.reduce((s, x) => s + x.price * x.qty, 0).toFixed(2)}`,
    total:      `€${total.toFixed(2)}`,
  });
}
