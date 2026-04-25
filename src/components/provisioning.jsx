import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp, Icons, Reveal } from './shared';
import { ClosingCTA } from './home-bottom';
import { submitOrder } from '../lib/submit';
import { PRODUCTS } from '../lib/products';

// Provisioning Shop: catalog + filters + cart drawer + summary page
// Integrates with existing AppCtx routing + .service-card, .btn, .field styles.
// Products sourced from Voli FOOD SERVICE 2025. To refresh: run scripts/import-voli.py

const CATEGORY_IDS = ['all','meat','seafood','dairy','charcuterie','bakery','pasta','spices','jams','condiments','truffles','ristoris','asian','frozen'];

// ---------- Product placeholder visual (no photos — abstract swatch by category) ----------
const CAT_COLOR = {
  meat:        ['#5E2A2A', '#7A3F3F'],
  seafood:     ['#1A3A4A', '#2E5F72'],
  dairy:       ['#EFE4D1', '#D4C1A3'],
  charcuterie: ['#4A2E1A', '#6B4227'],
  bakery:      ['#4A3A28', '#6B5740'],
  pasta:       ['#4A3A1A', '#7A5F2E'],
  spices:      ['#5E2E0A', '#8B4513'],
  jams:        ['#5E1A2E', '#8B3A52'],
  condiments:  ['#2E3E1A', '#4A5E2E'],
  truffles:    ['#1A1A0A', '#3A3A1A'],
  ristoris:    ['#1A2A3E', '#2E4A6B'],
  asian:       ['#2A3A1A', '#4A5E2E'],
  frozen:      ['#1A2A3A', '#2E4A5E'],
};
function ProductSwatch({ cat, name }) {
  const [a, b] = CAT_COLOR[cat] || ['#445', '#667'];
  const initials = name.split(' ').slice(0,2).map(w => w[0]).join('');
  return (
    <div style={{
      aspectRatio: '4/3',
      background: `linear-gradient(135deg, ${a} 0%, ${b} 100%)`,
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    }}>
      <div style={{ fontFamily: 'var(--serif)', fontSize: 42, color: 'rgba(255,255,255,0.9)', fontStyle: 'italic', letterSpacing: '-0.02em' }}>
        {initials}
      </div>
      <div style={{ position: 'absolute', top: 12, left: 12, fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>
        {cat}
      </div>
    </div>
  );
}

// Shows product image if available, falls back to abstract swatch on error or missing URL
function ProductImage({ p }) {
  const [err, setErr] = useState(false);
  if (!p.image || err) return <ProductSwatch cat={p.cat} name={p.name}/>;
  return (
    <div style={{ aspectRatio: '4/3', overflow: 'hidden', background: 'var(--bg-raised)' }}>
      <img
        src={p.image}
        alt={p.name}
        onError={() => setErr(true)}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
    </div>
  );
}

// ---------- Cart context (single instance shared across pages) ----------
const CartContext = createContext(null);

function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('yc-cart') || '[]'); } catch { return []; }
  });
  const [meta, setMeta] = useState(() => {
    try { return JSON.parse(localStorage.getItem('yc-cart-meta') || '{}'); } catch { return {}; }
  });

  useEffect(() => { localStorage.setItem('yc-cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('yc-cart-meta', JSON.stringify(meta)); }, [meta]);

  const add = (p) => setCart(c => {
    const ex = c.find(x => x.id === p.id);
    return ex ? c.map(x => x.id === p.id ? { ...x, qty: x.qty + 1 } : x) : [...c, { ...p, qty: 1 }];
  });
  const setQty = (id, q) => setCart(c => q <= 0 ? c.filter(x => x.id !== id) : c.map(x => x.id === id ? { ...x, qty: q } : x));
  // clearItems — keeps vessel meta (yacht, marina, email etc.) for repeat orders
  const clearItems = () => {
    setCart([]);
    localStorage.removeItem('yc-cart');
  };
  // clear — full reset including delivery details
  const clear = () => {
    setCart([]);
    setMeta({});
    localStorage.removeItem('yc-cart');
    localStorage.removeItem('yc-cart-meta');
  };
  const subtotal = cart.reduce((s, x) => s + x.price * x.qty, 0);
  const count = cart.reduce((s, x) => s + x.qty, 0);

  return (
    <CartContext.Provider value={{ cart, meta, setMeta, add, setQty, clear, clearItems, subtotal, count }}>
      {children}
    </CartContext.Provider>
  );
}

function useCart() {
  return useContext(CartContext);
}

// ---------- Provisioning Shop Page ----------
function ProvisioningPageContent() {
  const { setRoute } = useApp();
  const { t } = useTranslation();
  const cart = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState('all');
  const [priceMax, setPriceMax] = useState(350);
  const [taxFreeOnly, setTaxFreeOnly] = useState(false);
  const [sameDayOnly, setSameDayOnly] = useState(false);
  const [diet, setDiet] = useState([]);
  const [filtersMobile, setFiltersMobile] = useState(false);

  const CATEGORIES = CATEGORY_IDS.map(id => ({ id, label: t(`provisioningPage.categories.${id}`) }));

  const toggleDiet = (d) => setDiet(xs => xs.includes(d) ? xs.filter(x => x !== d) : [...xs, d]);

  const filtered = PRODUCTS.filter(p => {
    if (cat !== 'all' && p.cat !== cat) return false;
    if (query && !p.name.toLowerCase().includes(query.toLowerCase())) return false;
    if (p.price > priceMax) return false;
    if (taxFreeOnly && !p.taxFree) return false;
    if (sameDayOnly && !p.sameDay) return false;
    if (diet.length && !diet.every(d => (p.diet || []).includes(d))) return false;
    return true;
  });

  return (
    <main className="page-top">
      <div className="container">
        {/* Hero — reuses editorial split pattern */}
        <div className="grid-2" style={{ gap: 72, alignItems: 'end', marginBottom: 80 }}>
          <div>
            <Reveal><div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 24 }}>{t('provisioningPage.eyebrow')}</div></Reveal>
            <Reveal delay={80}>
              <h1 className="display">{t('provisioningPage.title1')}<br/>{t('provisioningPage.title2')}<br/><em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>{t('provisioningPage.titleAccent')}</em>.</h1>
            </Reveal>
          </div>
          <Reveal delay={160}>
            <p className="lede">{t('provisioningPage.lede')}</p>
          </Reveal>
        </div>

        {/* Search bar */}
        <Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 16, marginBottom: 48, alignItems: 'center', paddingTop: 24, paddingBottom: 24, borderTop: '1px solid var(--fg-15)', borderBottom: '1px solid var(--fg-15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span className="mono" style={{ color: 'var(--fg-50)' }}>↳</span>
              <input
                className="field-input"
                style={{ border: 'none', fontSize: 18, fontFamily: 'var(--serif)', padding: '4px 0', flex: 1 }}
                placeholder={t('provisioningPage.searchPlaceholder')}
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="mono"
                  style={{ color: 'var(--fg-50)', fontSize: 11, padding: '2px 8px', border: '1px solid var(--fg-15)', letterSpacing: '0.1em' }}
                >
                  {t('provisioningPage.clearBtn')}
                </button>
              )}
            </div>
            <div className="mono" style={{ color: 'var(--fg-50)', whiteSpace: 'nowrap' }}>
              {t('provisioningPage.resultsCount', { filtered: filtered.length, total: PRODUCTS.length })}
            </div>
            <button
              className="btn btn-ghost"
              onClick={() => setCartOpen(true)}
              style={{ position: 'relative' }}
            >
              {cart.count > 0
                ? <><span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 18, height: 18, background: 'var(--accent)', color: 'var(--bg)', borderRadius: '50%', fontSize: 10, fontWeight: 600, marginRight: 6 }}>{cart.count}</span>€ {cart.subtotal.toFixed(2)}</>
                : t('provisioningPage.cartBtn')
              } <Icons.Arrow size={12}/>
            </button>
          </div>
        </Reveal>

        {/* Mobile filters toggle */}
        <div className="shop-mobile-filters" style={{ marginBottom: 24 }}>
          <button className="btn btn-ghost" onClick={() => setFiltersMobile(v => !v)}>
            {filtersMobile ? t('provisioningPage.hideFilters') : t('provisioningPage.showFilters')}
          </button>
        </div>

        {/* Main grid */}
        <div className="shop-layout" style={{ gap: 56, alignItems: 'start' }}>
          {/* Filters sidebar */}
          <aside className={`shop-filters${filtersMobile ? ' shop-filters--open' : ''}`} style={{ position: 'sticky', top: 120 }}>
            <FilterBlock label={t('provisioningPage.filterCategory')}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {CATEGORIES.map(c => (
                  <li key={c.id}>
                    <button
                      onClick={() => setCat(c.id)}
                      style={{
                        fontFamily: 'var(--sans)',
                        fontSize: 14,
                        color: cat === c.id ? 'var(--fg)' : 'var(--fg-70)',
                        fontWeight: cat === c.id ? 500 : 400,
                        padding: '4px 0',
                        borderLeft: cat === c.id ? '2px solid var(--accent)' : '2px solid transparent',
                        paddingLeft: 10,
                        transition: 'all 0.2s var(--ease)',
                        textAlign: 'left',
                      }}
                    >{c.label}</button>
                  </li>
                ))}
              </ul>
            </FilterBlock>

            <FilterBlock label={t('provisioningPage.filterPrice')}>
              <div className="serif" style={{ fontSize: 24, marginBottom: 8 }}>€ {priceMax}</div>
              <input type="range" min="5" max="350" step="5" value={priceMax}
                onChange={e => setPriceMax(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent)' }}/>
            </FilterBlock>

            <FilterBlock label={t('provisioningPage.filterService')}>
              <Toggle label={t('provisioningPage.taxFreeOnly')} on={taxFreeOnly} onChange={setTaxFreeOnly}/>
              <Toggle label={t('provisioningPage.sameDayOnly')} on={sameDayOnly} onChange={setSameDayOnly}/>
            </FilterBlock>

            <FilterBlock label={t('provisioningPage.filterDietary')}>
              {['vegan', 'vegetarian', 'gluten-free'].map(d => (
                <Toggle key={d} label={d} on={diet.includes(d)} onChange={() => toggleDiet(d)}/>
              ))}
            </FilterBlock>

            <button
              onClick={() => { setCat('all'); setQuery(''); setPriceMax(350); setTaxFreeOnly(false); setSameDayOnly(false); setDiet([]); }}
              className="mono"
              style={{ color: 'var(--fg-50)', marginTop: 24, cursor: 'pointer' }}
            >{t('provisioningPage.resetFilters')}</button>
          </aside>

          {/* Product grid */}
          <div>
            {filtered.length === 0 ? (
              <div style={{ padding: '96px 32px', textAlign: 'center', border: '1px dashed var(--fg-15)' }}>
                <div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 16 }}>{t('provisioningPage.noResults')}</div>
                <div className="serif" style={{ fontSize: 28, marginBottom: 12 }}>{t('provisioningPage.noResultsTitle')}</div>
                <div style={{ color: 'var(--fg-70)', fontSize: 14 }}>{t('provisioningPage.noResultsBody')}</div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 1, background: 'var(--fg-08)', border: '1px solid var(--fg-08)' }}>
                {filtered.map(p => {
                  const inCartQty = cart.cart.find(x => x.id === p.id)?.qty || 0;
                  return (
                    <ProductCard
                      key={p.id}
                      p={p}
                      inCartQty={inCartQty}
                      onAdd={() => cart.add(p)}
                      onSetQty={(q) => cart.setQty(p.id, q)}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating cart button — positioned above WhatsApp button */}
      {cart.count > 0 && !cartOpen && (
        <button
          onClick={() => setCartOpen(true)}
          className="btn btn-primary"
          style={{ position: 'fixed', bottom: 104, right: 28, zIndex: 90, boxShadow: '0 12px 40px rgba(0,23,48,0.25)' }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20, background: 'rgba(255,255,255,0.25)', borderRadius: '50%', fontSize: 11, fontWeight: 700, marginRight: 8 }}>{cart.count}</span>
          € {cart.subtotal.toFixed(2)} <Icons.Arrow size={13}/>
        </button>
      )}

      <CartDrawer cart={cart} open={cartOpen} onClose={() => setCartOpen(false)} onCheckout={() => { setCartOpen(false); setRoute({ page: 'order-summary' }); }}/>

      <ClosingCTA/>
    </main>
  );
}

function FilterBlock({ label, children }) {
  return (
    <div style={{ marginBottom: 32, paddingBottom: 32, borderBottom: '1px solid var(--fg-08)' }}>
      <div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 16 }}>{label}</div>
      {children}
    </div>
  );
}

function Toggle({ label, on, onChange }) {
  return (
    <button
      onClick={() => onChange(!on)}
      style={{
        display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '6px 0',
        fontSize: 13.5, color: on ? 'var(--fg)' : 'var(--fg-70)', textTransform: 'capitalize', textAlign: 'left',
      }}
    >
      <span style={{
        width: 14, height: 14, border: `1px solid ${on ? 'var(--accent)' : 'var(--fg-30)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: on ? 'var(--accent)' : 'transparent',
      }}>
        {on && <Icons.Check size={10} stroke={2.5}/>}
      </span>
      {label}
    </button>
  );
}

function ProductSkeleton() {
  return (
    <div style={{ background: 'var(--bg-raised)', padding: 0 }}>
      <div style={{ aspectRatio: '4/3', background: 'var(--bg-warm)' }}/>
      <div style={{ padding: 20 }}>
        <div style={{ height: 16, background: 'var(--fg-08)', marginBottom: 10, width: '70%' }}/>
        <div style={{ height: 12, background: 'var(--fg-08)', width: '40%' }}/>
      </div>
    </div>
  );
}

function ProductCard({ p, inCartQty, onAdd, onSetQty }) {
  const [flash, setFlash] = useState(false);
  const { t } = useTranslation();

  const handleAdd = () => {
    onAdd();
    setFlash(true);
    setTimeout(() => setFlash(false), 1500);
  };

  const inCart = inCartQty > 0;

  return (
    <div style={{
      background: 'var(--bg-raised)',
      display: 'flex', flexDirection: 'column',
      outline: inCart ? '2px solid var(--accent)' : 'none',
      outlineOffset: -2,
      transition: 'outline 0.2s var(--ease)',
      position: 'relative',
    }}>
      {/* In-cart qty badge */}
      {inCart && (
        <div style={{
          position: 'absolute', top: 10, right: 10, zIndex: 2,
          background: 'var(--accent)', color: 'var(--bg)',
          width: 24, height: 24, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--mono)', fontSize: 11, fontWeight: 700,
        }}>
          {inCartQty}
        </div>
      )}

      <ProductImage p={p}/>

      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 10 }}>
          <h4 className="serif" style={{ fontSize: 18, lineHeight: 1.15, letterSpacing: '-0.01em', margin: 0 }}>{p.name}</h4>
          {p.taxFree && (
            <span className="mono" style={{ fontSize: 8.5, padding: '3px 6px', border: '1px solid var(--accent)', color: 'var(--accent)', whiteSpace: 'nowrap' }}>{t('provisioningPage.taxFreeLabel')}</span>
          )}
        </div>
        {p.origin && <div className="mono" style={{ color: 'var(--fg-50)', fontSize: 9.5 }}>{p.origin}</div>}
        <div style={{ flex: 1 }}/>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 8 }}>
          <div>
            <span className="serif" style={{ fontSize: 22, letterSpacing: '-0.01em' }}>€ {p.price.toFixed(2)}</span>
            <span className="mono" style={{ color: 'var(--fg-50)', marginLeft: 6 }}>/ {p.unit}</span>
          </div>
          {p.sameDay && <span className="mono" style={{ color: 'var(--fg-50)', fontSize: 9 }}>{t('provisioningPage.sameDayLabel')}</span>}
        </div>

        {inCart ? (
          /* Qty controls when item is already in cart */
          <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', border: '1px solid var(--accent)' }}>
            <button
              onClick={() => onSetQty(inCartQty - 1)}
              style={{ flex: 1, padding: '9px 0', fontFamily: 'var(--mono)', fontSize: 16, color: 'var(--accent)', borderRight: '1px solid var(--accent)' }}
            >−</button>
            <span style={{ flex: 1, textAlign: 'center', fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--accent)', fontWeight: 600 }}>
              {inCartQty}
            </span>
            <button
              onClick={handleAdd}
              style={{ flex: 1, padding: '9px 0', fontFamily: 'var(--mono)', fontSize: 16, color: 'var(--accent)', borderLeft: '1px solid var(--accent)' }}
            >+</button>
          </div>
        ) : (
          /* Add button when not in cart */
          <button
            onClick={handleAdd}
            className="mono"
            style={{
              marginTop: 10, padding: '10px 12px',
              border: `1px solid ${flash ? 'var(--accent)' : 'var(--fg-15)'}`,
              background: flash ? 'var(--accent-soft)' : 'transparent',
              color: flash ? 'var(--accent)' : 'var(--fg)',
              textAlign: 'center', cursor: 'pointer',
              transition: 'all 0.3s var(--ease)',
              fontSize: 10, letterSpacing: '0.18em',
            }}
            onMouseEnter={e => { if (!flash) { e.currentTarget.style.background = 'var(--fg)'; e.currentTarget.style.color = 'var(--bg)'; e.currentTarget.style.borderColor = 'var(--fg)'; }}}
            onMouseLeave={e => { if (!flash) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--fg)'; e.currentTarget.style.borderColor = 'var(--fg-15)'; }}}
          >
            {flash ? t('provisioningPage.addedLabel') : t('provisioningPage.addToOrder')}
          </button>
        )}
      </div>
    </div>
  );
}

// ---------- Cart Drawer ----------
function CartDrawer({ cart, open, onClose, onCheckout }) {
  const { cart: items, meta, setMeta, setQty, subtotal } = cart;
  const { t } = useTranslation();
  const setM = (k, v) => setMeta(m => ({ ...m, [k]: v }));
  const canCheckout = items.length > 0 && meta.yacht && meta.marina && meta.berth && meta.date && meta.email;

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,23,48,0.4)', zIndex: 190,
          opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.4s var(--ease)', backdropFilter: 'blur(4px)',
        }}
      />
      <aside style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 'min(520px, 100vw)',
        background: 'var(--bg-raised)', zIndex: 200,
        transform: open ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.5s var(--ease)', display: 'flex', flexDirection: 'column',
        borderLeft: '1px solid var(--fg-15)',
      }}>
        <div style={{ padding: '32px 32px 24px', borderBottom: '1px solid var(--fg-08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 6 }}>{t('provisioningPage.cartOrder')}</div>
            <div className="serif" style={{ fontSize: 28, letterSpacing: '-0.01em' }}>{t('provisioningPage.cartTitle')}</div>
          </div>
          <button onClick={onClose} style={{ color: 'var(--fg-70)' }}><Icons.Close size={18}/></button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 32 }}>
          {items.length === 0 ? (
            <div style={{ padding: '48px 0', textAlign: 'center' }}>
              <div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 12 }}>{t('provisioningPage.cartEmpty')}</div>
              <div className="serif" style={{ fontSize: 22 }}>{t('provisioningPage.cartEmptyTitle')}</div>
              <div style={{ color: 'var(--fg-70)', fontSize: 14, marginTop: 8 }}>{t('provisioningPage.cartEmptyBody')}</div>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {items.map(it => (
                  <div key={it.id} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 16, padding: '16px 0', borderBottom: '1px solid var(--fg-08)', alignItems: 'center' }}>
                    <div>
                      <div className="serif" style={{ fontSize: 17, letterSpacing: '-0.01em' }}>{it.name}</div>
                      <div className="mono" style={{ color: 'var(--fg-50)', marginTop: 4, fontSize: 9.5 }}>€ {it.price.toFixed(2)} / {it.unit}{it.taxFree && ` · ${t('provisioningPage.taxFreeLabel')}`}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--fg-15)' }}>
                      <button onClick={() => setQty(it.id, it.qty - 1)} style={{ padding: '6px 12px', fontFamily: 'var(--mono)' }}>−</button>
                      <span style={{ minWidth: 28, textAlign: 'center', fontFamily: 'var(--mono)', fontSize: 12 }}>{it.qty}</span>
                      <button onClick={() => setQty(it.id, it.qty + 1)} style={{ padding: '6px 12px', fontFamily: 'var(--mono)' }}>+</button>
                    </div>
                    <div className="serif" style={{ fontSize: 17, minWidth: 70, textAlign: 'right' }}>€ {(it.price * it.qty).toFixed(2)}</div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: 40 }}>
                <div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 20 }}>{t('provisioningPage.vesselDelivery')}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div className="field">
                    <label className="field-label">{t('provisioningPage.yachtNameLabel')}</label>
                    <input className="field-input" value={meta.yacht || ''} onChange={e => setM('yacht', e.target.value)} placeholder="M/Y Atlas"/>
                  </div>
                  <div className="field">
                    <label className="field-label">{t('provisioningPage.emailLabel')}</label>
                    <input className="field-input" type="email" value={meta.email || ''} onChange={e => setM('email', e.target.value)} placeholder="captain@vessel.com"/>
                  </div>
                  <div className="grid-2" style={{ gap: 16 }}>
                    <div className="field">
                      <label className="field-label">{t('provisioningPage.marinaLabel')}</label>
                      <select className="field-select" value={meta.marina || ''} onChange={e => setM('marina', e.target.value)}>
                        <option value="">{t('provisioningPage.selectMarina')}</option>
                        <option>Porto Montenegro</option>
                        <option>Portonovi</option>
                        <option>Kotor</option>
                        <option>Budva</option>
                        <option>Bar</option>
                      </select>
                    </div>
                    <div className="field">
                      <label className="field-label">{t('provisioningPage.berthLabel')}</label>
                      <input className="field-input" value={meta.berth || ''} onChange={e => setM('berth', e.target.value)} placeholder="B-14"/>
                    </div>
                  </div>
                  <div className="grid-2" style={{ gap: 16 }}>
                    <div className="field">
                      <label className="field-label">{t('provisioningPage.dateLabel')}</label>
                      <input className="field-input" type="date" value={meta.date || ''} onChange={e => setM('date', e.target.value)}/>
                    </div>
                    <div className="field">
                      <label className="field-label">{t('provisioningPage.timeLabel')}</label>
                      <input className="field-input" type="time" value={meta.time || ''} onChange={e => setM('time', e.target.value)}/>
                    </div>
                  </div>
                  <div className="field">
                    <label className="field-label">{t('provisioningPage.notesLabel')}</label>
                    <textarea className="field-textarea" value={meta.notes || ''} onChange={e => setM('notes', e.target.value)} placeholder="Gate code, chef contact, cold-chain notes..."/>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {items.length > 0 && (
          <div style={{ padding: 32, borderTop: '1px solid var(--fg-08)', background: 'var(--bg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <span className="mono" style={{ color: 'var(--fg-50)' }}>{t('provisioningPage.subtotal')}</span>
              <span className="serif" style={{ fontSize: 28, letterSpacing: '-0.01em' }}>€ {subtotal.toFixed(2)}</span>
            </div>
            <button
              onClick={canCheckout ? onCheckout : null}
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', opacity: canCheckout ? 1 : 0.4, pointerEvents: canCheckout ? 'auto' : 'none' }}
            >
              {t('provisioningPage.proceedToSummary')} <Icons.Arrow size={14}/>
            </button>
            {!canCheckout && <div className="mono" style={{ color: 'var(--fg-50)', marginTop: 12, textAlign: 'center' }}>{t('provisioningPage.requiredFields')}</div>}
          </div>
        )}
      </aside>
    </>
  );
}

// ---------- Order Summary Page ----------
function OrderSummaryPageContent() {
  const { setRoute } = useApp();
  const { t } = useTranslation();
  const cart = useCart();
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [refNum] = useState(() => {
    const now = new Date();
    const date = `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}`;
    const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
    return `YC-${date}-${rand}`;
  });

  // VAT depends on item category and tax-free status — confirmed on coordinator invoice.
  const taxFreeTotal = cart.cart.filter(i => i.taxFree).reduce((s, i) => s + i.price * i.qty, 0);
  const taxableTotal = cart.subtotal - taxFreeTotal;

  if (cart.cart.length === 0 && !confirmed) {
    return (
      <main className="page-top">
        <div className="container" style={{ textAlign: 'center', padding: '96px 0' }}>
          <div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 16 }}>{t('provisioningPage.emptyOrder')}</div>
          <div className="serif" style={{ fontSize: 40 }}>{t('provisioningPage.emptyOrderTitle')}</div>
          <button onClick={() => setRoute({ page: 'provisioning' })} className="btn btn-primary mt-32">{t('provisioningPage.backBtn')}</button>
        </div>
      </main>
    );
  }

  return (
    <main className="page-top">
      <div className="container">
        <div className="grid-2" style={{ gap: 72, alignItems: 'end', marginBottom: 72 }}>
          <div>
            <Reveal><div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 24 }}>{t('provisioningPage.orderSummaryLabel')} · №{refNum}</div></Reveal>
            <Reveal delay={80}>
              <h1 className="display" style={{ fontSize: 'clamp(48px, 6vw, 88px)' }}>
                {t('provisioningPage.reviewTitle')}<br/>& <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>{t('provisioningPage.reviewAccent')}</em>.
              </h1>
            </Reveal>
          </div>
          <Reveal delay={160}>
            <p className="lede">{t('provisioningPage.reviewLede')}</p>
          </Reveal>
        </div>

        {confirmed ? (
          <div style={{ padding: '96px 32px', textAlign: 'center', border: '1px solid var(--accent-line)', background: 'var(--accent-soft)' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 72, height: 72, border: '1px solid var(--accent)', color: 'var(--accent)', borderRadius: '50%', marginBottom: 32 }}>
              <Icons.Check size={28} stroke={1.2}/>
            </div>
            <h2 className="serif" style={{ fontSize: 48, letterSpacing: '-0.02em' }}>{t('provisioningPage.orderReceived')}</h2>
            <p className="lede" style={{ margin: '20px auto 0', maxWidth: 440 }}>
              {t('provisioningPage.orderReceivedLede', { ref: refNum })}
            </p>
            <button onClick={() => { cart.clearItems(); setRoute({ page: 'provisioning' }); }} className="btn btn-ghost mt-48">{t('provisioningPage.backToCatalogue')}</button>
          </div>
        ) : (
          <div className="grid-order-summary" style={{ gap: 56, alignItems: 'start' }}>
            <div>
              <div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 16 }}>{t('provisioningPage.itemsCount', { n: cart.count })}</div>
              <div style={{ borderTop: '1px solid var(--fg-15)' }}>
                {cart.cart.map(it => (
                  <div key={it.id} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 24, padding: '20px 0', borderBottom: '1px solid var(--fg-08)' }}>
                    <div>
                      <div className="serif" style={{ fontSize: 18 }}>{it.name}{it.taxFree && <span className="mono" style={{ marginLeft: 10, fontSize: 9, color: 'var(--accent)' }}>{t('provisioningPage.taxFreeLabel')}</span>}</div>
                      <div className="mono" style={{ color: 'var(--fg-50)', marginTop: 4 }}>€ {it.price.toFixed(2)} / {it.unit}</div>
                    </div>
                    <div className="mono" style={{ color: 'var(--fg-70)' }}>× {it.qty}</div>
                    <div className="serif" style={{ fontSize: 18, minWidth: 80, textAlign: 'right' }}>€ {(it.price * it.qty).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>
            <aside style={{ position: 'sticky', top: 120, border: '1px solid var(--fg-15)', padding: 32, background: 'var(--bg-raised)' }}>
              <div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 16 }}>{t('provisioningPage.deliveryLabel')}</div>
              <dl style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <Row k={t('provisioningPage.yachtRow')} v={cart.meta.yacht}/>
                <Row k={t('provisioningPage.marinaRow')} v={cart.meta.marina}/>
                <Row k={t('provisioningPage.berthRow')} v={cart.meta.berth}/>
                <Row k={t('provisioningPage.dateRow')} v={cart.meta.date}/>
                {cart.meta.time && <Row k={t('provisioningPage.timeRow')} v={cart.meta.time}/>}
                <Row k={t('provisioningPage.emailRow')} v={cart.meta.email}/>
                {cart.meta.notes && <Row k={t('provisioningPage.notesRow')} v={cart.meta.notes}/>}
              </dl>
              <div className="rule" style={{ margin: '28px 0' }}/>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <RowMoney k={t('provisioningPage.taxableItems')} v={taxableTotal}/>
                <RowMoney k={t('provisioningPage.taxFreeItems')} v={taxFreeTotal}/>
                <div className="rule" style={{ margin: '8px 0' }}/>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span className="mono">{t('provisioningPage.subtotal')}</span>
                  <span className="serif" style={{ fontSize: 32, letterSpacing: '-0.02em' }}>€ {cart.subtotal.toFixed(2)}</span>
                </div>
                <div className="mono" style={{ color: 'var(--fg-50)', fontSize: 9.5, marginTop: 4 }}>
                  {t('provisioningPage.vatNote')}
                </div>
              </div>
              <button
                onClick={async () => {
                  setSubmitting(true);
                  setSubmitError('');
                  try {
                    await submitOrder(cart.cart, cart.meta, refNum, cart.subtotal);
                    setConfirmed(true);
                    window.scrollTo({ top: 0 });
                  } catch {
                    setSubmitError(t('provisioningPage.orderError'));
                  } finally {
                    setSubmitting(false);
                  }
                }}
                disabled={submitting}
                className="btn btn-primary mt-32"
                style={{ width: '100%', justifyContent: 'center', opacity: submitting ? 0.5 : 1 }}
              >
                {submitting ? t('provisioningPage.sending') : t('provisioningPage.confirmOrder')} <Icons.Arrow size={14}/>
              </button>
              {submitError && (
                <div className="mono" style={{ color: '#c0392b', marginTop: 12, fontSize: 10.5, letterSpacing: '0.12em', textAlign: 'center' }}>
                  ↳ {submitError}
                </div>
              )}
              <button onClick={() => setRoute({ page: 'provisioning' })} className="mono mt-24" style={{ color: 'var(--fg-50)', width: '100%', textAlign: 'center' }}>{t('provisioningPage.backCatalogue')}</button>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}

function Row({ k, v }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16 }}>
      <dt className="mono" style={{ color: 'var(--fg-50)' }}>{k}</dt>
      <dd style={{ margin: 0, fontFamily: 'var(--serif)', fontSize: 16, textAlign: 'right' }}>{v || '—'}</dd>
    </div>
  );
}
function RowMoney({ k, v }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span className="mono" style={{ color: 'var(--fg-50)' }}>{k}</span>
      <span className="serif" style={{ fontSize: 18 }}>€ {v.toFixed(2)}</span>
    </div>
  );
}

function ProvisioningPage()  { return <CartProvider><ProvisioningPageContent /></CartProvider>; }
function OrderSummaryPage()  { return <CartProvider><OrderSummaryPageContent /></CartProvider>; }

export { ProvisioningPage, OrderSummaryPage };
