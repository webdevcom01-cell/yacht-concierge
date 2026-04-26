import React, { useState, useEffect, useRef, useLayoutEffect, createContext, useContext } from 'react';
import { useTranslation } from 'react-i18next';

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

// ---------- WhatsApp config ----------
const WA_NUMBER  = '38267144555';
const WA_MESSAGE = encodeURIComponent("Hello, I'd like to enquire about yacht concierge services in Montenegro.");
export const WA_URL = `https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`;

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
  WhatsApp: (p) => <Icon {...p}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
    <path d="M9.1 9a.4.4 0 0 0-.4.3l-.1.3c-.1.3 0 .6.2.9.4.7.9 1.3 1.6 1.7.3.2.7.2 1 0l.2-.2.9.4c.2.1.3.3.3.5v.3c0 .3-.3.5-.6.5-2.2-.3-3.9-2-4.2-4.2 0-.3.2-.6.5-.6h.4c.2 0 .4.1.5.3l.4.9c.1.2 0 .5-.2.7l-.2.2c.3.5.7 1 1.2 1.3l.2-.2c.2-.2.5-.3.7-.2l.9.4c.2.1.3.3.3.5v.5"/>
  </Icon>,
};

// ---------- WhatsApp Floating Button ----------
function WhatsAppFloat() {
  const { t } = useTranslation();
  return (
    <>
      <style>{`
        .wa-float {
          position: fixed;
          bottom: 28px;
          right: 28px;
          z-index: 9001; /* above cookie banner (8999) */
          width: 58px;
          height: 58px;
          background: #25D366;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 18px rgba(37,211,102,0.45), 0 2px 6px rgba(0,0,0,0.18);
          text-decoration: none;
          transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.22s ease;
        }
        .wa-float:hover {
          transform: scale(1.1);
          box-shadow: 0 8px 28px rgba(37,211,102,0.55), 0 4px 10px rgba(0,0,0,0.2);
        }
        .wa-float::after {
          content: '';
          position: absolute;
          inset: -5px;
          border-radius: 50%;
          border: 2px solid rgba(37,211,102,0.5);
          animation: wa-pulse 2.6s ease-out infinite;
          pointer-events: none;
        }
        @keyframes wa-pulse {
          0%   { transform: scale(1);   opacity: 0.8; }
          70%  { transform: scale(1.5); opacity: 0;   }
          100% { transform: scale(1.5); opacity: 0;   }
        }
        .wa-tooltip {
          position: absolute;
          right: 70px;
          top: 50%;
          transform: translateY(-50%);
          background: var(--bg, #fff);
          color: var(--fg, #1a1a1a);
          border: 1px solid var(--fg-08, rgba(0,0,0,0.08));
          padding: 7px 13px;
          border-radius: 3px;
          font-size: 10px;
          font-family: 'JetBrains Mono', monospace;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.18s ease;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .wa-float:hover .wa-tooltip { opacity: 1; }
      `}</style>
      <a
        href={WA_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="wa-float"
        aria-label="Chat with us on WhatsApp — +382 67 144 555"
      >
        <span className="wa-tooltip">{t('nav.chatWhatsapp')}</span>
        <svg width="29" height="29" viewBox="0 0 24 24" fill="white" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
        </svg>
      </a>
    </>
  );
}

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

// ---------- Language Switcher ----------
function LangSwitcher() {
  const { i18n } = useTranslation();
  const langs = [
    { code: 'en', label: 'EN' },
    { code: 'ru', label: 'RU' },
    { code: 'it', label: 'IT' },
  ];
  return (
    <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      {langs.map((l, idx) => (
        <React.Fragment key={l.code}>
          <button
            className="nav-link"
            onClick={() => i18n.changeLanguage(l.code)}
            style={{
              padding: '10px 12px', /* C-03: was 4px 6px — ~18px target → ~44px */
              fontFamily: 'var(--mono)',
              fontSize: 11, /* C-03: was 10 */
              letterSpacing: '0.1em',
              opacity: i18n.language === l.code ? 1 : 0.4,
              fontWeight: i18n.language === l.code ? 600 : 400,
              color: i18n.language === l.code ? 'var(--accent)' : 'inherit',
              transition: 'opacity 0.2s, color 0.2s',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
            }}
          >
            {l.label}
          </button>
          {idx < langs.length - 1 && (
            <span style={{ color: 'var(--fg-15)', fontSize: 9 }}>·</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// ---------- Nav ----------
const WA_SVG = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
  </svg>
);

function Nav() {
  const { route, setRoute, theme, setTheme, navStyle } = useApp();
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when overlay is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [route]);

  const links = [
    { id: 'services',     label: t('nav.services') },
    { id: 'provisioning', label: t('nav.provisioning') },
    { id: 'process',      label: t('nav.process') },
    { id: 'fleet',        label: t('nav.fleet') },
    { id: 'about',        label: t('nav.about') },
  ];

  return (
    <>
      <header className="nav" data-style={navStyle} data-scrolled={scrolled}>
        <div className="nav-inner">
          {/* Left — Logo */}
          <div style={{ justifySelf: 'start' }}>
            <Logo onClick={() => setRoute({ page: 'home' })} />
          </div>

          {/* Centre — Primary links (desktop only) */}
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

          {/* Right — Utilities + CTA + Hamburger */}
          <div className="nav-right">
            {/* Lang switcher — desktop only via CSS */}
            <div className="nav-lang-desktop">
              <LangSwitcher />
            </div>

            {/* Theme toggle */}
            <button
              className="nav-link nav-icon-btn"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Icons.Sun size={14} /> : <Icons.Moon size={14} />}
            </button>

            {/* CTA — desktop only */}
            <button
              className="btn btn-primary nav-cta-desktop"
              onClick={() => setRoute({ page: 'contact' })}
            >
              {t('nav.requestQuote')} <Icons.Arrow size={14} />
            </button>

            {/* Hamburger — mobile only */}
            <button
              className="nav-menu-btn"
              onClick={() => setMenuOpen(v => !v)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <Icons.Close size={20} /> : <Icons.Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen mobile overlay — inline styles as primary guard, CSS classes for animation */}
      <div
        className={`nav-overlay${menuOpen ? ' nav-overlay--open' : ''}`}
        aria-hidden={!menuOpen}
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 300,
          background: 'var(--bg)',
          transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.55s cubic-bezier(0.76, 0, 0.24, 1)',
          visibility: menuOpen ? 'visible' : 'hidden',
          pointerEvents: menuOpen ? 'auto' : 'none',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div className="nav-overlay-inner">

          {/* Overlay header */}
          <div className="nav-overlay-header">
            <LangSwitcher />
            <button
              onClick={() => setMenuOpen(false)}
              style={{ color: 'var(--fg-70)', display: 'flex', alignItems: 'center', padding: 12 }} /* M-03: was 6 → 44px target */
              aria-label="Close menu"
            >
              <Icons.Close size={22} />
            </button>
          </div>

          {/* Primary links */}
          <nav className="nav-overlay-links">
            {links.map((l, i) => (
              <a
                key={l.id}
                className="nav-overlay-link"
                data-active={route.page === l.id}
                onClick={() => setRoute({ page: l.id })}
                style={{ transitionDelay: menuOpen ? `${i * 45}ms` : '0ms' }}
              >
                <span className="nav-overlay-num">0{i + 1}</span>
                {l.label}
              </a>
            ))}
          </nav>

          {/* Bottom CTA area */}
          <div className="nav-overlay-cta">
            <button
              className="btn btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => setRoute({ page: 'contact' })}
            >
              {t('nav.requestQuote')} <Icons.Arrow size={14} />
            </button>
            <a
              href={WA_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-overlay-wa"
              onClick={() => setMenuOpen(false)}
            >
              {WA_SVG}
              {t('nav.chatWhatsapp')}
            </a>
          </div>

        </div>
      </div>
    </>
  );
}

// ---------- Footer ----------
function Footer() {
  const { setRoute } = useApp();
  const { t } = useTranslation();
  return (
    <footer style={{ borderTop: '1px solid var(--fg-08)', padding: '72px 0 40px', marginTop: 80 }}>
      <div className="container">
        <div className="grid-footer" style={{ gap: 48, marginBottom: 64 }}>
          <div>
            <Logo onClick={() => setRoute({ page: 'home' })} />
            <p className="lede" style={{ marginTop: 28, fontSize: 14 }}>
              {t('footer.tagline')}
            </p>
            <div className="mono mt-24" style={{ color: 'var(--fg-50)' }}>
              42.4330° N · 18.6881° E
            </div>
          </div>
          {[
            { titleKey: 'footer.services', itemsKey: 'footer.servicesItems' },
            { titleKey: 'footer.operations', itemsKey: 'footer.operationsItems' },
          ].map(col => (
            <div key={col.titleKey}>
              <div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 18 }}>{t(col.titleKey)}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {t(col.itemsKey, { returnObjects: true }).map(i => <li key={i} style={{ fontSize: 13.5, color: 'var(--fg-70)' }}>{i}</li>)}
              </ul>
            </div>
          ))}
          <div>
            <div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 18 }}>{t('footer.office')}</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['Pomorska ulica, Zgrada Baia', 'Porto Montenegro', 'Tivat 85320'].map(i => (
                <li key={i} style={{ fontSize: 13.5, color: 'var(--fg-70)' }}>{i}</li>
              ))}
              <li style={{ fontSize: 13.5 }}>
                <a
                  href={WA_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#25D366', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#25D366" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                  </svg>
                  +382 67 144 555
                </a>
              </li>
              <li style={{ fontSize: 13.5 }}>
                <a href="mailto:info@yacht-concierge.me" style={{ color: 'var(--fg-70)', textDecoration: 'none' }}>
                  info@yacht-concierge.me
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="rule" />
        <div className="footer-bar" style={{ marginTop: 28 }}>
          <span>{t('footer.copyright')}</span>
          <span>{t('footer.certifications')}</span>
          <span style={{ display: 'flex', gap: 20 }}>
            <button
              onClick={() => setRoute({ page: 'legal' })}
              style={{ background: 'none', border: 'none', padding: '8px 0', cursor: 'pointer', color: 'inherit', font: 'inherit', fontSize: 'inherit' }} /* M-10: was 0 → 8px vertical tap area */
            >{t('footer.legal')}</button>
            <button
              onClick={() => setRoute({ page: 'privacy' })}
              style={{ background: 'none', border: 'none', padding: '8px 0', cursor: 'pointer', color: 'inherit', font: 'inherit', fontSize: 'inherit' }} /* M-10: was 0 → 8px vertical tap area */
            >{t('footer.privacy')}</button>
            <button
              onClick={() => setRoute({ page: 'terms' })}
              style={{ background: 'none', border: 'none', padding: '8px 0', cursor: 'pointer', color: 'inherit', font: 'inherit', fontSize: 'inherit' }} /* M-10: was 0 → 8px vertical tap area */
            >{t('footer.terms')}</button>
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

export { AppCtx, useApp, Icons, Icon, Logo, Nav, Footer, Reveal, useReveal, SectionHeader, WhatsAppFloat, LangSwitcher };
