import React from 'react';
import { useTranslation } from 'react-i18next';
import { useApp, Icons, Reveal } from './shared';
import { ServicesPreview, StatsBlock } from './home-top';

// Home page bottom — hero CTA and page shell

// ---------- Final CTA ----------
function PlainReveal({ children }) { return <>{children}</>; }
function ClosingCTA({ serviceId = null, hero = false }) {
  const { setRoute } = useApp();
  const { t } = useTranslation();
  const Heading = hero ? 'h1' : 'h2';
  const R = hero ? PlainReveal : Reveal;
  return (
    <section className="section" style={{
      paddingTop: 120,
      paddingBottom: hero ? 0 : 160,
      ...(hero ? { minHeight: '100vh', display: 'flex', flexDirection: 'column' } : {}),
    }}>
      <div className="container" style={{ textAlign: 'center', width: '100%', ...(hero ? { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' } : {}) }}>
        <R>
          <div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 32 }}>{t('cta.engage')}</div>
        </R>
        <R delay={80}>
          <Heading className="serif" style={{ fontSize: 'clamp(48px, 6.5vw, 96px)', lineHeight: 0.95, letterSpacing: '-0.02em', margin: 0 }}>
            {t('cta.title1')}<br/>
            <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>{t('cta.title2')}</em>
          </Heading>
        </R>
        <R delay={160}>
          <p className="lede" style={{ margin: '32px auto 0' }}>{t('cta.lede')}</p>
        </R>
        <R delay={240}>
          <div className="btn-row" style={{ justifyContent: 'center', marginTop: 48 }}>
            <button
              className="btn btn-primary"
              onClick={() => setRoute({ page: 'contact', ...(serviceId && { service: serviceId }) })}
            >
              {t('cta.btnQuote')} <Icons.Arrow size={14}/>
            </button>
            <button className="btn btn-ghost" onClick={() => setRoute({ page: 'services' })}>{t('cta.btnServices')}</button>
          </div>
        </R>
        {hero && (
          <div style={{ position: 'relative', marginTop: 72, height: 'clamp(240px, 38vh, 460px)', overflow: 'hidden', border: '1px solid var(--fg-08)' }}>
            {/* Hero photo — Porto Montenegro marina, Tivat (Unsplash free license, photo by Alex Chernenko) */}
            <picture>
              <source srcSet="/hero-porto.webp" type="image/webp"/>
              <img src="/hero-porto.jpg" alt="" aria-hidden="true" decoding="async"
                   style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 45%' }}/>
            </picture>
            <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,23,48,0.10) 0%, rgba(0,23,48,0) 35%, rgba(0,23,48,0.22) 100%)' }}/>
          </div>
        )}
      </div>
    </section>
  );
}

// ---------- Home page shell ----------
function HomePage() {
  return (
    <main>
      <ClosingCTA hero/>
      <ServicesPreview/>
      <StatsBlock/>
    </main>
  );
}

export { HomePage };
