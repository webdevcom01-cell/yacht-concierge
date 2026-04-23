import React, { useState, useEffect, useRef, useLayoutEffect, createContext, useContext } from 'react';

// Shared primitives: Logo, Nav, Footer, icons, reveal hook

// ---------- Theme / Route context ----------
const AppCtx = createContext(null);
const useApp = () => useContext(AppCtx);

// ---------- Reveal on scroll ----------
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function Reveal({ children, delay = 0, as: Tag = 'div', className = '', style = {}, ...rest }) {
  const ref = useReveal();
  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`}
      style={{ transitionDelay: `${delay}ms`, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

// ---------- Icons ---------- 1px stroke, vector, neutral
const Icon = ({ children, size = 22, stroke = 1.2, className = '' }) => (
  <svg
    width={size} height={size} viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth={stroke}
    strokeLinecap="round" strokeLinejoin="round"
    className={className}
  >
    {children}
  </svg>
);

const Icons = {
  Anchor: (p) => <Icon {...p}><circle cx="12" cy="5" r="2"/><path d="M12 7v15"/><path d="M5 12h14"/><path d="M4 15a8 8 0 0 0 16 0"/></Icon>,
  Stamp: (p) => <Icon {...p}><path d="M4 20h16"/><path d="M6 17h12v-3H6z"/><path d="M9 14V9a3 3 0 0 1 6 0v5"/><path d="M11 6V4"/></Icon>,
  Basket: (p) => <Icon {...p}><path d="M3 9h18l-2 11H5z"/><path d="M8 9V6a4 4 0 0 1 8 0v3"/><path d="M10 14v3"/><path d="M14 14v3"/></Icon>,
  Droplet: (p) => <Icon {...p}><path d="M12 3s6 6 6 11a6 6 0 0 1-12 0c0-5 6-11 6-11z"/></Icon>,
  Leaf: (p) => <Icon {...p}><path d="M4 20c0-8 6-14 16-14 0 10-6 16-14 16"/><path d="M4 20s4-4 10-6"/></Icon>,
  Gear: (p) => <Icon {...p}><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.2-1.7l2-1.4-2-3.4-2.3.9a7 7 0 0 0-2.9-1.7L13 2h-4l-.6 2.7a7 7 0 0 0-2.9 1.7l-2.3-.9-2 3.4 2 1.4A7 7 0 0 0 3 12c0 .6.1 1.1.2 1.7l-2 1.4 2 3.4 2.3-.9a7 7 0 0 0 2.9 1.7L9 22h4l.6-2.7a7 7 0 0 0 2.9-1.7l2.3.9 2-3.4-2-1.4c.1-.6.2-1.1.2-1.7z"/></Icon>,
  Arrow: (p) => <Icon {...p}><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></Icon>,
  ArrowDown: (p) => <Icon {...p}><path d="M12 5v14"/><path d="M6 13l6 6 6-6"/></Icon>,
  Check: (p) => <Icon {...p}><path d="M4 12l5 5L20 6"/></Icon>,
  Phone: (p) => <Icon {...p}><path d="M5 4h4l2 5-3 2a12 12 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 6a2 2 0 0 1 2-2z"/></Icon>,
  Mail: (p) => <Icon {...p}><rect x="3" y="5" width="18" height="14" rx="1"/><path d="M3 7l9 7 9-7"/></Icon>,
  Pin: (p) => <Icon {...p}><path d="M12 22s7-7.5 7-13a7 7 0 0 0-14 0c0 5.5 7 13 7 13z"/><circle cx="12" cy="9" r="2.5"/></Icon>,
  Sun: (p) => <Icon {...p}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></Icon>,
  Moon: (p) => <Icon {...p}><path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z"/></Icon>,
  Close: (p) => <Icon {...p}><path d="M6 6l12 12M18 6L6 18"/></Icon>,
  Menu: (p) => <Icon {...p}><path d="M4 7h16M4 12h16M4 17h16"/></Icon>,
  Compass: (p) => <Icon {...p}><circle cx="12" cy="12" r="9"/><path d="M16 8l-2 6-6 2 2-6z"/></Icon>,
};

// ---------- Logo: Wordmark + compass rose ----------
function Logo({ onClick }) {
  return (
    <div className="logo" onClick={onClick} aria-label="Yacht Concierge">
      <svg className="logo-mark" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="16" cy="16" r="14" strokeWidth="0.8"/>
        <circle cx="16" cy="16" r="10" strokeWidth="0.5" opacity="0.5"/>
        <path d="M16 3 L18 16 L16 29 L14 16 Z" fill="currentColor" stroke="none"/>
        <path d="M3 16 L16 14 L29 16 L16 18 Z" strokeWidth="0.5" opacity="0.6"/>
        <circle cx="16" cy="16" r="1.2" fill="currentColor" stroke="none"/>
      </svg>
      <div className="logo-text">
        <div className="logo-text-main">YACHT CONCIERGE</div>
        <div className="logo-text-sub">MONTENEGRO · EST. MMXVII</div>
      </div>
    </div>
  );
}

// ---------- Nav ----------
function Nav() {
  const { route, setRoute, theme, setTheme, navStyle } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'provisioning', label: 'Provisioning' },
    { id: 'process', label: 'How it works' },
    { id: 'fleet', label: 'Berths' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header className="nav" data-style={navStyle} data-scrolled={scrolled}>
      <div className="nav-inner">
        <div style={{ justifySelf: 'start' }}>
          <Logo onClick={() => { setRoute({ page: 'home' }); setMenuOpen(false); }} />
        </div>
        <nav>
          <ul className="nav-links">
            {links.map(l => (
              <li key={l.id}>
                <a
                  className="nav-link"
                  data-active={route.page === l.id}
                  onClick={() => setRoute({ page: l.id })}
                >{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="nav-right">
          <button
            className="nav-link"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px' }}
          >
            {theme === 'dark' ? <Icons.Sun size={14} /> : <Icons.Moon size={14} />}
          </button>
          <button className="btn btn-primary" onClick={() => setRoute({ page: 'contact' })}>
            Request Quote <Icons.Arrow size={14} />
          </button>
          <button
            className="nav-menu-btn"
            onClick={() => setMenuOpen(v => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <Icons.Close size={20} /> : <Icons.Menu size={20} />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="nav-mobile-menu">
          {links.map(l => (
            <a
              key={l.id}
              className="nav-mobile-link"
              data-active={route.page === l.id}
              onClick={() => { setRoute({ page: l.id }); setMenuOpen(false); }}
            >
              {l.label}
            </a>
          ))}
          <div className="nav-mobile-cta">
            <button
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => { setRoute({ page: 'contact' }); setMenuOpen(false); }}
            >
              Request Quote <Icons.Arrow size={14} />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

// ---------- Footer ----------
function Footer() {
  const { setRoute } = useApp();
  return (
    <footer style={{ borderTop: '1px solid var(--fg-08)', padding: '72px 0 40px', marginTop: 80 }}>
      <div className="container">
        <div className="grid-footer" style={{ gap: 48, marginBottom: 64 }}>
          <div>
            <Logo onClick={() => setRoute({ page: 'home' })} />
            <p className="lede" style={{ marginTop: 28, fontSize: 14 }}>
              Operational logistics for superyachts transiting the Adriatic.
              Porto Montenegro · Herceg Novi · Bar.
            </p>
            <div className="mono mt-24" style={{ color: 'var(--fg-50)' }}>
              42.4330° N · 18.6881° E
            </div>
          </div>
          {[
            { title: 'Services', items: ['Berth Reservations', 'Customs & Immigration', 'Provisioning', 'Laundry', 'Floristry', 'Maintenance'] },
            { title: 'Operations', items: ['How it works', 'Berth availability', 'Fleet tiers', 'SLA'] },
            { title: 'Office', items: ['Pomorska ulica, Zgrada Baia', 'Porto Montenegro', 'Tivat 85320', '+382 67 144 555', 'info@yacht-concierge.com'] },
          ].map(col => (
            <div key={col.title}>
              <div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 18 }}>{col.title}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {col.items.map(i => <li key={i} style={{ fontSize: 13.5, color: 'var(--fg-70)' }}>{i}</li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="rule" />
        <div className="footer-bar" style={{ marginTop: 28 }}>
          <span>© MMXXVI YACHT CONCIERGE D.O.O.</span>
          <span>ISO 9001 · MYBA · MLC 2017</span>
          <span style={{ display: 'flex', gap: 20 }}>
            <button
              onClick={() => setRoute({ page: 'legal' })}
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'inherit', font: 'inherit', fontSize: 'inherit' }}
            >Legal</button>
            <button
              onClick={() => setRoute({ page: 'privacy' })}
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'inherit', font: 'inherit', fontSize: 'inherit' }}
            >Privacy</button>
            <button
              onClick={() => setRoute({ page: 'terms' })}
              style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: 'inherit', font: 'inherit', fontSize: 'inherit' }}
            >Terms</button>
          </span>
        </div>
      </div>
    </footer>
  );
}

// ---------- Section Header ----------
function SectionHeader({ num, eyebrow, title, lede, align = 'left' }) {
  return (
    <div style={{ textAlign: align, maxWidth: align === 'center' ? 720 : '100%', margin: align === 'center' ? '0 auto' : 0, marginBottom: 72 }}>
      <Reveal>
        <div className="mono" style={{ display: 'flex', gap: 20, justifyContent: align === 'center' ? 'center' : 'flex-start', color: 'var(--fg-50)', marginBottom: 28 }}>
          {num && <span>{num}</span>}
          <span>{eyebrow}</span>
        </div>
      </Reveal>
      <Reveal delay={80}>
        <h2 className="h2">{title}</h2>
      </Reveal>
      {lede && <Reveal delay={160}><p className="lede" style={{ marginTop: 24, marginLeft: align === 'center' ? 'auto' : 0, marginRight: align === 'center' ? 'auto' : 0 }}>{lede}</p></Reveal>}
    </div>
  );
}

export { AppCtx, useApp, Icons, Icon, Logo, Nav, Footer, Reveal, useReveal, SectionHeader };
