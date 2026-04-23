import React, { useState, useEffect } from 'react';
import { useApp, Icons, Reveal } from './shared';
import { ClosingCTA } from './home-bottom';
import { submitOrder } from '../lib/submit';

// Provisioning Shop: catalog + filters + cart drawer + summary page
// Integrates with existing AppCtx routing + .service-card, .btn, .field styles.
// Future: replace PRODUCTS with Voli API / CSV fetch in useEffect.

const PRODUCTS = [
  // Fresh Produce — local Adriatic / Tivat market
  { id: 'p01', name: 'Njeguški Tomatoes', cat: 'fresh', price: 3.40, unit: 'kg', taxFree: false, sameDay: true, diet: ['vegan'], origin: 'Bay of Kotor' },
  { id: 'p02', name: 'Heirloom Courgettes', cat: 'fresh', price: 2.80, unit: 'kg', taxFree: false, sameDay: true, diet: ['vegan'], origin: 'Skadar Valley' },
  { id: 'p03', name: 'Dalmatian Figs', cat: 'fresh', price: 9.20, unit: 'kg', taxFree: false, sameDay: true, diet: ['vegan'], origin: 'Adriatic coast' },
  { id: 'p04', name: 'Lemon, Amalfi', cat: 'fresh', price: 6.10, unit: 'kg', taxFree: false, sameDay: false, diet: ['vegan'], origin: 'Italy' },
  { id: 'p05', name: 'Rocket, wild', cat: 'fresh', price: 18.00, unit: 'kg', taxFree: false, sameDay: true, diet: ['vegan'], origin: 'Lovćen foothills' },
  { id: 'p06', name: 'Avocado, Hass', cat: 'fresh', price: 4.20, unit: 'pc', taxFree: false, sameDay: true, diet: ['vegan'] },
  { id: 'p07', name: 'Black Kale', cat: 'fresh', price: 7.40, unit: 'kg', taxFree: false, sameDay: true, diet: ['vegan'] },
  { id: 'p08', name: 'Peaches, white', cat: 'fresh', price: 5.60, unit: 'kg', taxFree: false, sameDay: true, diet: ['vegan'] },

  // Beverages — non-alcoholic
  { id: 'p10', name: 'San Pellegrino 750ml', cat: 'beverages', price: 3.80, unit: 'bottle', taxFree: false, sameDay: true, diet: ['vegan'] },
  { id: 'p11', name: 'Acqua Panna 750ml', cat: 'beverages', price: 3.60, unit: 'bottle', taxFree: false, sameDay: true, diet: ['vegan'] },
  { id: 'p12', name: 'Fever-Tree Tonic 200ml', cat: 'beverages', price: 2.20, unit: 'bottle', taxFree: false, sameDay: true, diet: ['vegan'] },
  { id: 'p13', name: 'Fresh Orange Juice 1L', cat: 'beverages', price: 8.50, unit: 'bottle', taxFree: false, sameDay: true, diet: ['vegan'] },
  { id: 'p14', name: 'Cold-Brew Coffee 1L', cat: 'beverages', price: 14.00, unit: 'bottle', taxFree: false, sameDay: true, diet: ['vegan'] },
  { id: 'p15', name: 'Kombucha, Ginger 330ml', cat: 'beverages', price: 4.80, unit: 'bottle', taxFree: false, sameDay: true, diet: ['vegan', 'gluten-free'] },
  { id: 'p16', name: 'Coconut Water 1L', cat: 'beverages', price: 6.20, unit: 'bottle', taxFree: false, sameDay: true, diet: ['vegan'] },
  { id: 'p17', name: 'Espresso beans, Piansa 1kg', cat: 'beverages', price: 38.00, unit: 'kg', taxFree: false, sameDay: false, diet: ['vegan'] },

  // Alcohol — Tax-Free (Duty-free for yachts in transit)
  { id: 'p20', name: 'Dom Pérignon Vintage 2013', cat: 'alcohol', price: 185.00, unit: 'bottle', taxFree: true, sameDay: false },
  { id: 'p21', name: 'Château Margaux 2015', cat: 'alcohol', price: 720.00, unit: 'bottle', taxFree: true, sameDay: false },
  { id: 'p22', name: 'Plantaže Vranac 2020', cat: 'alcohol', price: 12.00, unit: 'bottle', taxFree: true, sameDay: true, origin: 'Montenegro' },
  { id: 'p23', name: 'Sancerre, Henri Bourgeois', cat: 'alcohol', price: 32.00, unit: 'bottle', taxFree: true, sameDay: false },
  { id: 'p24', name: 'Hendricks Gin 1L', cat: 'alcohol', price: 42.00, unit: 'bottle', taxFree: true, sameDay: true },
  { id: 'p25', name: 'Belvedere Vodka 1.75L', cat: 'alcohol', price: 68.00, unit: 'bottle', taxFree: true, sameDay: true },
  { id: 'p26', name: 'Lagavulin 16yr', cat: 'alcohol', price: 94.00, unit: 'bottle', taxFree: true, sameDay: false },
  { id: 'p27', name: 'Hennessy XO 700ml', cat: 'alcohol', price: 220.00, unit: 'bottle', taxFree: true, sameDay: false },
  { id: 'p28', name: 'Krstač Drustvo Orahovo', cat: 'alcohol', price: 16.00, unit: 'bottle', taxFree: true, sameDay: true, origin: 'Crmnica, Montenegro' },
  { id: 'p29', name: 'Prosecco, La Marca', cat: 'alcohol', price: 18.00, unit: 'bottle', taxFree: true, sameDay: true },

  // Dairy & Eggs
  { id: 'p30', name: 'Burrata di Andria 250g', cat: 'dairy', price: 8.40, unit: 'pc', taxFree: false, sameDay: true, diet: ['vegetarian'] },
  { id: 'p31', name: 'Parmigiano Reggiano 24mo', cat: 'dairy', price: 58.00, unit: 'kg', taxFree: false, sameDay: false, diet: ['vegetarian'] },
  { id: 'p32', name: 'Free-Range Eggs', cat: 'dairy', price: 6.80, unit: 'dozen', taxFree: false, sameDay: true, diet: ['vegetarian'], origin: 'Tivat' },
  { id: 'p33', name: 'Njeguški Kajmak 500g', cat: 'dairy', price: 14.00, unit: 'pc', taxFree: false, sameDay: true, diet: ['vegetarian'], origin: 'Njeguši' },
  { id: 'p34', name: 'Isle of Mull Cheddar', cat: 'dairy', price: 52.00, unit: 'kg', taxFree: false, sameDay: false, diet: ['vegetarian'] },
  { id: 'p35', name: 'Greek Yoghurt 1kg', cat: 'dairy', price: 7.40, unit: 'pc', taxFree: false, sameDay: true, diet: ['vegetarian'] },
  { id: 'p36', name: 'Oat Milk, Barista 1L', cat: 'dairy', price: 3.80, unit: 'bottle', taxFree: false, sameDay: true, diet: ['vegan'] },

  // Meat & Fish
  { id: 'p40', name: 'Adriatic Sea Bass (whole)', cat: 'meat', price: 42.00, unit: 'kg', taxFree: false, sameDay: true, origin: 'Bay of Kotor' },
  { id: 'p41', name: 'Scampi, live', cat: 'meat', price: 88.00, unit: 'kg', taxFree: false, sameDay: true, origin: 'Adriatic' },
  { id: 'p42', name: 'Chianina Ribeye', cat: 'meat', price: 96.00, unit: 'kg', taxFree: false, sameDay: false },
  { id: 'p43', name: 'Pršut (dry-cured ham)', cat: 'meat', price: 58.00, unit: 'kg', taxFree: false, sameDay: true, origin: 'Njeguši' },
  { id: 'p44', name: 'Wagyu Tenderloin A5', cat: 'meat', price: 360.00, unit: 'kg', taxFree: false, sameDay: false },
  { id: 'p45', name: 'Octopus, fresh', cat: 'meat', price: 34.00, unit: 'kg', taxFree: false, sameDay: true, origin: 'Adriatic' },
  { id: 'p46', name: 'Whole Turbot', cat: 'meat', price: 78.00, unit: 'kg', taxFree: false, sameDay: true, origin: 'Adriatic' },
  { id: 'p47', name: 'Corn-fed Chicken', cat: 'meat', price: 18.00, unit: 'kg', taxFree: false, sameDay: true },
  { id: 'p48', name: 'Lamb rack, local', cat: 'meat', price: 64.00, unit: 'kg', taxFree: false, sameDay: true, origin: 'Durmitor' },

  // Pantry & Dry Goods
  { id: 'p50', name: 'EVOO, Moulin Cauvin 500ml', cat: 'pantry', price: 28.00, unit: 'bottle', taxFree: false, sameDay: true, diet: ['vegan'] },
  { id: 'p51', name: 'Maldon Sea Salt 250g', cat: 'pantry', price: 6.40, unit: 'pc', taxFree: false, sameDay: true, diet: ['vegan', 'gluten-free'] },
  { id: 'p52', name: 'Rustichella Spaghetti', cat: 'pantry', price: 4.80, unit: 'pc', taxFree: false, sameDay: true, diet: ['vegan'] },
  { id: 'p53', name: 'Acquerello Rice 1kg', cat: 'pantry', price: 22.00, unit: 'kg', taxFree: false, sameDay: false, diet: ['vegan', 'gluten-free'] },
  { id: 'p54', name: 'Aged Balsamico 250ml', cat: 'pantry', price: 48.00, unit: 'bottle', taxFree: false, sameDay: false, diet: ['vegan'] },
  { id: 'p55', name: 'Black Truffle, fresh', cat: 'pantry', price: 1400.00, unit: 'kg', taxFree: false, sameDay: false, diet: ['vegan'] },
  { id: 'p56', name: 'Sourdough Loaf', cat: 'pantry', price: 6.40, unit: 'pc', taxFree: false, sameDay: true, diet: ['vegan'] },
  { id: 'p57', name: 'Quinoa, tri-colour 1kg', cat: 'pantry', price: 11.50, unit: 'kg', taxFree: false, sameDay: true, diet: ['vegan', 'gluten-free'] },

  // Cleaning
  { id: 'p60', name: 'Starbrite Deck Cleaner 1L', cat: 'cleaning', price: 16.00, unit: 'bottle', taxFree: true, sameDay: true },
  { id: 'p61', name: 'Teak Oil 500ml', cat: 'cleaning', price: 22.00, unit: 'bottle', taxFree: true, sameDay: true },
  { id: 'p62', name: 'Chamois, XL', cat: 'cleaning', price: 8.00, unit: 'pc', taxFree: false, sameDay: true },
  { id: 'p63', name: 'Biodegradable Dish Soap 5L', cat: 'cleaning', price: 24.00, unit: 'pc', taxFree: false, sameDay: true },
  { id: 'p64', name: 'Stainless Polish 500ml', cat: 'cleaning', price: 18.00, unit: 'bottle', taxFree: true, sameDay: true },
  { id: 'p65', name: 'Microfiber Cloths, 12-pack', cat: 'cleaning', price: 14.00, unit: 'pc', taxFree: false, sameDay: true },

  // Personal Care
  { id: 'p70', name: 'Aesop Hand Wash 500ml', cat: 'personal', price: 36.00, unit: 'bottle', taxFree: false, sameDay: true },
  { id: 'p71', name: 'Sun SPF50, reef-safe', cat: 'personal', price: 28.00, unit: 'bottle', taxFree: false, sameDay: true },
  { id: 'p72', name: 'Egyptian Cotton Towels', cat: 'personal', price: 48.00, unit: 'pc', taxFree: false, sameDay: false },
  { id: 'p73', name: 'Malin+Goetz Shampoo 1L', cat: 'personal', price: 64.00, unit: 'bottle', taxFree: false, sameDay: false },
  { id: 'p74', name: 'Molton Brown Soap', cat: 'personal', price: 12.00, unit: 'pc', taxFree: false, sameDay: true },
  { id: 'p75', name: 'Aspirin 500mg, 20ct', cat: 'personal', price: 4.80, unit: 'pc', taxFree: false, sameDay: true },
];

const CATEGORIES = [
  { id: 'all', label: 'All Categories' },
  { id: 'fresh', label: 'Fresh Produce' },
  { id: 'beverages', label: 'Beverages' },
  { id: 'alcohol', label: 'Alcohol (Tax-Free)' },
  { id: 'dairy', label: 'Dairy & Eggs' },
  { id: 'meat', label: 'Meat & Fish' },
  { id: 'pantry', label: 'Pantry & Dry Goods' },
  { id: 'cleaning', label: 'Cleaning Supplies' },
  { id: 'personal', label: 'Personal Care' },
];

// ---------- Product placeholder visual (no photos — abstract swatch by category) ----------
const CAT_COLOR = {
  fresh: ['#2E4A3A', '#556F47'],
  beverages: ['#2A4657', '#436A7F'],
  alcohol: ['#3C2A3F', '#5E3F5E'],
  dairy: ['#EFE4D1', '#D4C1A3'],
  meat: ['#5E2A2A', '#7A3F3F'],
  pantry: ['#3E3328', '#5E4A36'],
  cleaning: ['#2A4F52', '#416E70'],
  personal: ['#3A3548', '#56506A'],
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

// ---------- Cart store (localStorage-backed) ----------
function useCart() {
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
  const clear = () => setCart([]);
  const subtotal = cart.reduce((s, x) => s + x.price * x.qty, 0);
  const count = cart.reduce((s, x) => s + x.qty, 0);
  return { cart, meta, setMeta, add, setQty, clear, subtotal, count };
}

// ---------- Provisioning Shop Page ----------
function ProvisioningPage() {
  const { setRoute } = useApp();
  const cart = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState('all');
  const [priceMax, setPriceMax] = useState(1500);
  const [taxFreeOnly, setTaxFreeOnly] = useState(false);
  const [sameDayOnly, setSameDayOnly] = useState(false);
  const [diet, setDiet] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtersMobile, setFiltersMobile] = useState(false);

  // TODO: replace with Voli API fetch — GET /products?marina=porto-montenegro
  useEffect(() => { const t = setTimeout(() => setLoading(false), 600); return () => clearTimeout(t); }, []);

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
    <main style={{ paddingTop: 140 }}>
      <div className="container">
        {/* Hero — reuses editorial split pattern */}
        <div className="grid-2" style={{ gap: 72, alignItems: 'end', marginBottom: 80 }}>
          <div>
            <Reveal><div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 24 }}>↳ PROVISIONING SHOP</div></Reveal>
            <Reveal delay={80}>
              <h1 className="display">Yacht<br/>provisioning<br/><em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>catalogue</em>.</h1>
            </Reveal>
          </div>
          <Reveal delay={160}>
            <p className="lede">
              Galley-standard sourcing from Tivat, Kotor, and the Adriatic fleet. Tax-free procurement for yachts in transit. Same-day delivery to berth for the marked lines, 48 hours for European specialty.
            </p>
          </Reveal>
        </div>

        {/* Search bar */}
        <Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 16, marginBottom: 48, alignItems: 'center', paddingTop: 24, paddingBottom: 24, borderTop: '1px solid var(--fg-15)', borderBottom: '1px solid var(--fg-15)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span className="mono" style={{ color: 'var(--fg-50)' }}>↳</span>
              <input
                className="field-input"
                style={{ border: 'none', fontSize: 18, fontFamily: 'var(--serif)', padding: '4px 0' }}
                placeholder="Search products for your yacht..."
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>
            <div className="mono" style={{ color: 'var(--fg-50)', whiteSpace: 'nowrap' }}>
              {loading ? 'LOADING...' : `${filtered.length} of ${PRODUCTS.length} ITEMS`}
            </div>
            <button className="btn btn-ghost" onClick={() => setCartOpen(true)} style={{ position: 'relative' }}>
              Cart ({cart.count}) <Icons.Arrow size={12}/>
            </button>
          </div>
        </Reveal>

        {/* Mobile filters toggle */}
        <div className="shop-mobile-filters" style={{ marginBottom: 24 }}>
          <button className="btn btn-ghost" onClick={() => setFiltersMobile(v => !v)}>
            {filtersMobile ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {/* Main grid */}
        <div className="shop-layout" style={{ gap: 56, alignItems: 'start' }}>
          {/* Filters sidebar */}
          <aside className={`shop-filters${filtersMobile ? ' shop-filters--open' : ''}`} style={{ position: 'sticky', top: 120 }}>
            <FilterBlock label="Category">
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

            <FilterBlock label="Price Maximum">
              <div className="serif" style={{ fontSize: 24, marginBottom: 8 }}>€ {priceMax}</div>
              <input type="range" min="5" max="1500" step="5" value={priceMax}
                onChange={e => setPriceMax(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent)' }}/>
            </FilterBlock>

            <FilterBlock label="Service">
              <Toggle label="Tax-Free only" on={taxFreeOnly} onChange={setTaxFreeOnly}/>
              <Toggle label="Same-Day delivery" on={sameDayOnly} onChange={setSameDayOnly}/>
            </FilterBlock>

            <FilterBlock label="Dietary">
              {['vegan', 'vegetarian', 'gluten-free'].map(d => (
                <Toggle key={d} label={d} on={diet.includes(d)} onChange={() => toggleDiet(d)}/>
              ))}
            </FilterBlock>

            <button
              onClick={() => { setCat('all'); setQuery(''); setPriceMax(1500); setTaxFreeOnly(false); setSameDayOnly(false); setDiet([]); }}
              className="mono"
              style={{ color: 'var(--fg-50)', marginTop: 24, cursor: 'pointer' }}
            >↳ RESET FILTERS</button>
          </aside>

          {/* Product grid */}
          <div>
            {loading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 1, background: 'var(--fg-08)', border: '1px solid var(--fg-08)' }}>
                {[...Array(9)].map((_, i) => <ProductSkeleton key={i}/>)}
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: '96px 32px', textAlign: 'center', border: '1px dashed var(--fg-15)' }}>
                <div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 16 }}>↳ NO RESULTS</div>
                <div className="serif" style={{ fontSize: 28, marginBottom: 12 }}>No items match this brief.</div>
                <div style={{ color: 'var(--fg-70)', fontSize: 14 }}>Adjust filters or contact your coordinator for a bespoke source.</div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 1, background: 'var(--fg-08)', border: '1px solid var(--fg-08)' }}>
                {filtered.map(p => <ProductCard key={p.id} p={p} onAdd={() => { cart.add(p); setCartOpen(true); }}/>)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating cart button */}
      {cart.count > 0 && !cartOpen && (
        <button
          onClick={() => setCartOpen(true)}
          className="btn btn-primary"
          style={{ position: 'fixed', bottom: 32, right: 32, zIndex: 90, boxShadow: '0 12px 40px rgba(0,23,48,0.25)' }}
        >
          Review Cart · {cart.count} · € {cart.subtotal.toFixed(2)}
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

function ProductCard({ p, onAdd }) {
  return (
    <div style={{
      background: 'var(--bg-raised)',
      display: 'flex', flexDirection: 'column',
      transition: 'transform 0.3s var(--ease)',
    }}>
      <ProductSwatch cat={p.cat} name={p.name}/>
      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 10 }}>
          <h4 className="serif" style={{ fontSize: 18, lineHeight: 1.15, letterSpacing: '-0.01em', margin: 0 }}>{p.name}</h4>
          {p.taxFree && (
            <span className="mono" style={{ fontSize: 8.5, padding: '3px 6px', border: '1px solid var(--accent)', color: 'var(--accent)', whiteSpace: 'nowrap' }}>TAX-FREE</span>
          )}
        </div>
        {p.origin && <div className="mono" style={{ color: 'var(--fg-50)', fontSize: 9.5 }}>{p.origin}</div>}
        <div style={{ flex: 1 }}/>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 8 }}>
          <div>
            <span className="serif" style={{ fontSize: 22, letterSpacing: '-0.01em' }}>€ {p.price.toFixed(2)}</span>
            <span className="mono" style={{ color: 'var(--fg-50)', marginLeft: 6 }}>/ {p.unit}</span>
          </div>
          {p.sameDay && <span className="mono" style={{ color: 'var(--fg-50)', fontSize: 9 }}>SAME-DAY</span>}
        </div>
        <button onClick={onAdd} className="mono" style={{
          marginTop: 10, padding: '10px 12px', border: '1px solid var(--fg-15)',
          textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s var(--ease)',
          fontSize: 10, letterSpacing: '0.18em',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--fg)'; e.currentTarget.style.color = 'var(--bg)'; e.currentTarget.style.borderColor = 'var(--fg)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--fg)'; e.currentTarget.style.borderColor = 'var(--fg-15)'; }}
        >
          Add to Order →
        </button>
      </div>
    </div>
  );
}

// ---------- Cart Drawer ----------
function CartDrawer({ cart, open, onClose, onCheckout }) {
  const { cart: items, meta, setMeta, setQty, subtotal } = cart;
  const setM = (k, v) => setMeta(m => ({ ...m, [k]: v }));
  const canCheckout = items.length > 0 && meta.yacht && meta.marina && meta.berth && meta.date;

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
            <div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 6 }}>↳ ORDER</div>
            <div className="serif" style={{ fontSize: 28, letterSpacing: '-0.01em' }}>Provisioning cart</div>
          </div>
          <button onClick={onClose} style={{ color: 'var(--fg-70)' }}><Icons.Close size={18}/></button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 32 }}>
          {items.length === 0 ? (
            <div style={{ padding: '48px 0', textAlign: 'center' }}>
              <div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 12 }}>EMPTY</div>
              <div className="serif" style={{ fontSize: 22 }}>No items yet.</div>
              <div style={{ color: 'var(--fg-70)', fontSize: 14, marginTop: 8 }}>Select from the catalogue to begin.</div>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {items.map(it => (
                  <div key={it.id} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 16, padding: '16px 0', borderBottom: '1px solid var(--fg-08)', alignItems: 'center' }}>
                    <div>
                      <div className="serif" style={{ fontSize: 17, letterSpacing: '-0.01em' }}>{it.name}</div>
                      <div className="mono" style={{ color: 'var(--fg-50)', marginTop: 4, fontSize: 9.5 }}>€ {it.price.toFixed(2)} / {it.unit}{it.taxFree && ' · TAX-FREE'}</div>
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
                <div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 20 }}>↳ VESSEL & DELIVERY</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div className="field">
                    <label className="field-label">Yacht Name *</label>
                    <input className="field-input" value={meta.yacht || ''} onChange={e => setM('yacht', e.target.value)} placeholder="M/Y Atlas"/>
                  </div>
                  <div className="grid-2" style={{ gap: 16 }}>
                    <div className="field">
                      <label className="field-label">Marina *</label>
                      <select className="field-select" value={meta.marina || ''} onChange={e => setM('marina', e.target.value)}>
                        <option value="">Select...</option>
                        <option>Porto Montenegro</option>
                        <option>Portonovi</option>
                        <option>Kotor</option>
                        <option>Budva</option>
                        <option>Bar</option>
                      </select>
                    </div>
                    <div className="field">
                      <label className="field-label">Berth №*</label>
                      <input className="field-input" value={meta.berth || ''} onChange={e => setM('berth', e.target.value)} placeholder="B-14"/>
                    </div>
                  </div>
                  <div className="grid-2" style={{ gap: 16 }}>
                    <div className="field">
                      <label className="field-label">Delivery Date *</label>
                      <input className="field-input" type="date" value={meta.date || ''} onChange={e => setM('date', e.target.value)}/>
                    </div>
                    <div className="field">
                      <label className="field-label">Time</label>
                      <input className="field-input" type="time" value={meta.time || ''} onChange={e => setM('time', e.target.value)}/>
                    </div>
                  </div>
                  <div className="field">
                    <label className="field-label">Special Instructions</label>
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
              <span className="mono" style={{ color: 'var(--fg-50)' }}>SUBTOTAL</span>
              <span className="serif" style={{ fontSize: 28, letterSpacing: '-0.01em' }}>€ {subtotal.toFixed(2)}</span>
            </div>
            <button
              onClick={canCheckout ? onCheckout : null}
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center', opacity: canCheckout ? 1 : 0.4, pointerEvents: canCheckout ? 'auto' : 'none' }}
            >
              Proceed to Order Summary <Icons.Arrow size={14}/>
            </button>
            {!canCheckout && <div className="mono" style={{ color: 'var(--fg-50)', marginTop: 12, textAlign: 'center' }}>* YACHT, MARINA, BERTH & DATE REQUIRED</div>}
          </div>
        )}
      </aside>
    </>
  );
}

// ---------- Order Summary Page ----------
function OrderSummaryPage() {
  const { setRoute } = useApp();
  const cart = useCart();
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [refNum] = useState(() => Math.random().toString(36).slice(2, 9).toUpperCase());

  const vat = cart.subtotal * 0.07; // estimate, actual depends on tax-free split
  const total = cart.subtotal + vat;

  if (cart.cart.length === 0 && !confirmed) {
    return (
      <main style={{ paddingTop: 180 }}>
        <div className="container" style={{ textAlign: 'center', padding: '96px 0' }}>
          <div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 16 }}>↳ EMPTY ORDER</div>
          <div className="serif" style={{ fontSize: 40 }}>No items to review.</div>
          <button onClick={() => setRoute({ page: 'provisioning' })} className="btn btn-primary mt-32">Back to catalogue</button>
        </div>
      </main>
    );
  }

  return (
    <main style={{ paddingTop: 140 }}>
      <div className="container">
        <div className="grid-2" style={{ gap: 72, alignItems: 'end', marginBottom: 72 }}>
          <div>
            <Reveal><div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 24 }}>↳ ORDER SUMMARY · №{refNum}</div></Reveal>
            <Reveal delay={80}>
              <h1 className="display" style={{ fontSize: 'clamp(48px, 6vw, 88px)' }}>
                Review<br/>& <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>confirm</em>.
              </h1>
            </Reveal>
          </div>
          <Reveal delay={160}>
            <p className="lede">
              Verify items, vessel details, and delivery window. Your coordinator will return a confirmation within two operational hours.
            </p>
          </Reveal>
        </div>

        {confirmed ? (
          <div style={{ padding: '96px 32px', textAlign: 'center', border: '1px solid var(--accent-line)', background: 'var(--accent-soft)' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 72, height: 72, border: '1px solid var(--accent)', color: 'var(--accent)', borderRadius: '50%', marginBottom: 32 }}>
              <Icons.Check size={28} stroke={1.2}/>
            </div>
            <h2 className="serif" style={{ fontSize: 48, letterSpacing: '-0.02em' }}>Order received.</h2>
            <p className="lede" style={{ margin: '20px auto 0', maxWidth: 440 }}>
              Reference №{refNum}. Your coordinator will confirm delivery within two operational hours.
            </p>
            <button onClick={() => { cart.clear(); setRoute({ page: 'provisioning' }); }} className="btn btn-ghost mt-48">Return to catalogue</button>
          </div>
        ) : (
          <div className="grid-order-summary" style={{ gap: 56, alignItems: 'start' }}>
            <div>
              <div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 16 }}>ITEMS ({cart.count})</div>
              <div style={{ borderTop: '1px solid var(--fg-15)' }}>
                {cart.cart.map(it => (
                  <div key={it.id} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 24, padding: '20px 0', borderBottom: '1px solid var(--fg-08)' }}>
                    <div>
                      <div className="serif" style={{ fontSize: 18 }}>{it.name}{it.taxFree && <span className="mono" style={{ marginLeft: 10, fontSize: 9, color: 'var(--accent)' }}>TAX-FREE</span>}</div>
                      <div className="mono" style={{ color: 'var(--fg-50)', marginTop: 4 }}>€ {it.price.toFixed(2)} / {it.unit}</div>
                    </div>
                    <div className="mono" style={{ color: 'var(--fg-70)' }}>× {it.qty}</div>
                    <div className="serif" style={{ fontSize: 18, minWidth: 80, textAlign: 'right' }}>€ {(it.price * it.qty).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>
            <aside style={{ position: 'sticky', top: 120, border: '1px solid var(--fg-15)', padding: 32, background: 'var(--bg-raised)' }}>
              <div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 16 }}>↳ DELIVERY</div>
              <dl style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <Row k="Yacht" v={cart.meta.yacht}/>
                <Row k="Marina" v={cart.meta.marina}/>
                <Row k="Berth" v={cart.meta.berth}/>
                <Row k="Date" v={cart.meta.date}/>
                {cart.meta.time && <Row k="Time" v={cart.meta.time}/>}
                {cart.meta.notes && <Row k="Notes" v={cart.meta.notes}/>}
              </dl>
              <div className="rule" style={{ margin: '28px 0' }}/>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <RowMoney k="Subtotal" v={cart.subtotal}/>
                <RowMoney k="VAT (est.)" v={vat}/>
                <div className="rule" style={{ margin: '8px 0' }}/>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span className="mono">TOTAL</span>
                  <span className="serif" style={{ fontSize: 32, letterSpacing: '-0.02em' }}>€ {total.toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={async () => {
                  setSubmitting(true);
                  setSubmitError('');
                  try {
                    await submitOrder(cart.cart, cart.meta, refNum, total);
                    setConfirmed(true);
                    window.scrollTo({ top: 0 });
                  } catch {
                    setSubmitError('Order failed — please email info@yacht-concierge.com');
                  } finally {
                    setSubmitting(false);
                  }
                }}
                disabled={submitting}
                className="btn btn-primary mt-32"
                style={{ width: '100%', justifyContent: 'center', opacity: submitting ? 0.5 : 1 }}
              >
                {submitting ? 'Sending...' : 'Confirm & Place Order'} <Icons.Arrow size={14}/>
              </button>
              {submitError && (
                <div className="mono" style={{ color: '#c0392b', marginTop: 12, fontSize: 10.5, letterSpacing: '0.12em', textAlign: 'center' }}>
                  ↳ {submitError}
                </div>
              )}
              <button onClick={() => setRoute({ page: 'provisioning' })} className="mono mt-24" style={{ color: 'var(--fg-50)', width: '100%', textAlign: 'center' }}>← BACK TO CATALOGUE</button>
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

export { ProvisioningPage, OrderSummaryPage };
