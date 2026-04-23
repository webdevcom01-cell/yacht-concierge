// API_URL is baked in at build time from VITE_API_URL environment variable
const API_URL = import.meta.env.VITE_API_URL;
console.log('[submit] API_URL:', API_URL);

// Google Apps Script does not return CORS headers on redirected responses.
// mode: 'no-cors' sends the request without reading the response (opaque).
// The submission reaches GAS and is written to the Sheet — we just assume success.
async function postJSON(payload) {
  if (!API_URL) {
    console.warn('[submit] VITE_API_URL not set — submission skipped in dev');
    return { result: 'dev-skip' };
  }
  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(payload),
    mode: 'no-cors',
  });
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
