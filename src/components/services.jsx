import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp, Icons, Reveal, SectionHeader } from './shared';
import { SERVICES } from '../data/services';
import { ServiceArt } from './service-art';

// Services index page & Service detail page

// Per-service hero photography — real photos (Unsplash, free license) for
// all seven service detail pages. ServiceArt (service-art.jsx) is the SVG
// fallback for any service id not listed here.
// webp siblings (Phase 3, retroactive) generated from these exact jpg files
// at quality 80 via sharp — same treatment as fleet-bg/hero-porto/map-yacht/
// services-band/stats-band elsewhere on the site. jpg stays as the <img>
// fallback; browsers that support webp use the smaller <source> instead.
const SERVICE_PHOTOS = {
  berth:        { src: '/service-berth.jpg',       webp: '/service-berth.webp',       position: 'center 22%' },
  customs:      { src: '/service-customs.jpg',      webp: '/service-customs.webp',      position: 'center 45%' },
  fuel:         { src: '/service-fuel.jpg',         webp: '/service-fuel.webp',         position: '61% 55%' },
  provisioning: { src: '/service-provisioning.jpg', webp: '/service-provisioning.webp', position: 'center 65%' },
  laundry:      { src: '/service-laundry.jpg',      webp: '/service-laundry.webp',      position: 'center 42%' },
  floristry:    { src: '/service-floristry.jpg',    webp: '/service-floristry.webp',    position: 'center 45%' },
  maintenance:  { src: '/service-maintenance.jpg',  webp: '/service-maintenance.webp',  position: 'center 40%' },
};

// Hero photo for the /services index page (below the intro, above the list) —
// same real-photo treatment as the per-service detail pages. Unsplash, free
// license: brass-and-teak ship's wheel, photo by Pierre Goiffon.
const SERVICES_HERO_PHOTO = { src: '/services-hero.jpg', webp: '/services-hero.webp', position: '46% 58%' };

function ServicesPage() {
  const { setRoute } = useApp();
  const { t } = useTranslation();
  return (
    <main className="page-top">
      <div className="container">
        <div className="grid-2" style={{ gap: 72, alignItems: 'end', marginBottom: 96 }}>
          <div>
            <Reveal><div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 24 }}>{t('servicesPage.eyebrow')}</div></Reveal>
            <Reveal delay={80}>
              <h1 className="display">
                {t('servicesPage.title1')}<br/>
                <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>{t('servicesPage.titleAccent')}</em>
              </h1>
            </Reveal>
          </div>
          <Reveal delay={160}>
            <p className="lede" style={{ marginLeft: 'auto' }}>
              {t('servicesPage.lede')}
            </p>
          </Reveal>
        </div>

        {/* Hero photography — see SERVICES_HERO_PHOTO above */}
        <Reveal>
          <div style={{ position: 'relative', marginBottom: 96, border: '1px solid var(--fg-08)', overflow: 'hidden', height: 'clamp(220px, 30vw, 340px)' }}>
            <picture>
              <source srcSet={SERVICES_HERO_PHOTO.webp} type="image/webp"/>
              <img src={SERVICES_HERO_PHOTO.src} alt="" aria-hidden="true" loading="lazy" decoding="async"
                   style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: SERVICES_HERO_PHOTO.position }}/>
            </picture>
            <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,23,48,0.20) 0%, rgba(0,23,48,0) 45%, rgba(0,23,48,0.30) 100%)' }}/>
            <div className="mono" style={{ position: 'absolute', left: 20, bottom: 14, color: 'rgba(239,234,226,0.75)', letterSpacing: '0.18em', fontSize: 10, textTransform: 'uppercase' }}>
              {t('servicesPage.heroCaption')}
            </div>
          </div>
        </Reveal>

        <div style={{ borderTop: '1px solid var(--fg-15)' }}>
          {SERVICES.map((s, i) => {
            const IconC = Icons[s.icon];
            return (
              <Reveal key={s.id} delay={i * 60}>
                <div
                  role="link"
                  tabIndex={0}
                  aria-label={t(`services.${s.id}_title`)}
                  onClick={() => setRoute({ page: 'service', id: s.id })}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setRoute({ page: 'service', id: s.id }); } }}
                  className="service-row"
                  style={{
                    gap: 48,
                    alignItems: 'center',
                    padding: '48px 0',
                    borderBottom: '1px solid var(--fg-15)',
                    cursor: 'pointer',
                    transition: 'all 0.4s var(--ease)',
                  }}
                  onMouseEnter={e => e.currentTarget.style.paddingLeft = '24px'}
                  onMouseLeave={e => e.currentTarget.style.paddingLeft = '0px'}
                >
                  <span className="mono" style={{ color: 'var(--fg-50)' }}>{s.num}</span>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <IconC size={32} stroke={0.9}/>
                  </div>
                  <div className="serif" style={{ fontSize: 28, letterSpacing: '-0.01em', lineHeight: 1.1 }}>{t(`services.${s.id}_title`)}</div>
                  <div style={{ fontSize: 14, color: 'var(--fg-70)', lineHeight: 1.6, paddingLeft: 0 }}>{t(`services.${s.id}_desc`)}</div>
                  <div className="mono" style={{ textAlign: 'right', color: 'var(--accent)', display: 'flex', gap: 10, justifyContent: 'flex-end', alignItems: 'center' }}>
                    {t('servicesPage.openBtn')} <Icons.Arrow size={12}/>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

      </div>
    </main>
  );
}

// ---------- Contextual CTA block on service detail pages ----------
function DetailCTA({ label, title, body, btn, onClick }) {
  const { theme } = useApp();
  // Inverted "bookend" — same pattern as Footer (shared.jsx): this callout
  // always contrasts with the page's current theme instead of tracking it
  // 1:1, so it stays a distinct navy block in light mode (unchanged) but
  // flips to a light block in dark mode rather than vanishing into the
  // page's own navy background. #8C6C3B is the site's existing a11y-safe
  // gold-on-paper accent token (styles.css [data-accent="gold"]).
  const isDark = theme === 'dark';
  const bg = isDark ? '#FAF9F8' : 'var(--navy, #001730)';
  const labelColor = isDark ? 'rgba(0,23,48,0.45)' : 'rgba(255,255,255,0.45)';
  const titleColor = isDark ? '#001730' : '#fff';
  const bodyColor = isDark ? 'rgba(0,23,48,0.6)' : 'rgba(255,255,255,0.6)';
  const accentColor = isDark ? '#8C6C3B' : '#D4B78F';
  return (
    <Reveal>
      <div
        role="link"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } }}
        style={{
          marginBottom: 96,
          padding: 'clamp(32px, 4vw, 56px) clamp(28px, 5vw, 72px)',
          background: bg,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 48,
          flexWrap: 'wrap',
          transition: 'opacity 0.3s var(--ease)',
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
      >
        <div>
          <div className="mono" style={{ color: labelColor, marginBottom: 16, fontSize: 11, letterSpacing: '0.1em' }}>
            {label}
          </div>
          <h3 className="serif" style={{ fontSize: 'clamp(28px, 3vw, 44px)', color: titleColor, margin: '0 0 14px', lineHeight: 1.1 }}>
            {title}
          </h3>
          <p style={{ fontSize: 15, color: bodyColor, fontFamily: 'var(--sans)', lineHeight: 1.6, maxWidth: 440, margin: 0 }}>
            {body}
          </p>
        </div>
        <div className="mono" style={{ color: accentColor, fontSize: 11, letterSpacing: '0.12em', whiteSpace: 'nowrap', display: 'flex', gap: 12, alignItems: 'center', flexShrink: 0 }}>
          {btn} <Icons.Arrow size={13}/>
        </div>
      </div>
    </Reveal>
  );
}

// ---------- FAQ accordion (Phase 4) ----------
// Same disclosure pattern already used elsewhere on the site (LangSwitcher,
// shared.jsx): useState open/closed + aria-expanded + a rotating chevron.
// The answer stays in the DOM at all times (only visually collapsed via
// max-height, never unmounted) so prerendered HTML always contains the full
// text regardless of default open/closed state — matches Google's FAQPage
// guidance, and means this on-page text and the FAQPage schema built from
// the identical serviceDetail.<id>.faq array (src/seo.jsx buildFaqSchema)
// can never disagree with each other.
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: '1px solid var(--fg-15)' }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        className="mono"
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 24,
          padding: '28px 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          font: 'inherit',
          color: 'inherit',
        }}
      >
        <span className="serif" style={{ fontSize: 19, letterSpacing: '-0.01em', fontFamily: 'var(--serif)' }}>{q}</span>
        <span style={{ flexShrink: 0, display: 'inline-flex', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.25s var(--ease)', color: 'var(--fg-50)' }}>
          <Icons.ArrowDown size={16} stroke={1.2}/>
        </span>
      </button>
      <div style={{ maxHeight: open ? 400 : 0, overflow: 'hidden', transition: 'max-height 0.35s var(--ease)' }}>
        <p style={{ margin: '0 0 28px', fontSize: 15, color: 'var(--fg-70)', lineHeight: 1.6, maxWidth: 640, fontFamily: 'var(--sans)' }}>{a}</p>
      </div>
    </div>
  );
}

// ---------- Service detail ----------
function ServiceDetailPage({ id }) {
  const { setRoute } = useApp();
  const { t } = useTranslation();
  const s = SERVICES.find(x => x.id === id) || SERVICES[0];
  const IconC = Icons[s.icon];
  const otherServices = SERVICES.filter(x => x.id !== s.id);

  const detail = {
    coverage:    t(`serviceDetail.${s.id}.coverage`),
    sla:         t(`serviceDetail.${s.id}.sla`),
    deliverables: t(`serviceDetail.${s.id}.deliverables`, { returnObjects: true }),
    protocol:    t(`serviceDetail.${s.id}.protocol`, { returnObjects: true }),
    rateNote:    t(`serviceDetail.${s.id}.rateNote`),
    // Phase 4 — identical array also read by src/seo.jsx (SSR: i18n.t()
    // directly; browser: PageSEO's useTranslation()) to build the FAQPage
    // schema, so the accordion below and the structured data always match.
    faq:         t(`serviceDetail.${s.id}.faq`, { returnObjects: true }),
  };

  return (
    <main className="page-top">
      <div className="container">
        <Reveal>
          <a
            className="mono"
            href="/services"
            onClick={(e) => { e.preventDefault(); setRoute({ page: 'services' }); }}
            style={{ display: 'inline-flex', gap: 10, color: 'var(--fg-70)', cursor: 'pointer', marginBottom: 64 }}
          >
            {t('servicesPage.allServices')}
          </a>
        </Reveal>

        <div className="grid-fleet-calc" style={{ gap: 96, marginBottom: 96, alignItems: 'end' }}>
          <div>
            <Reveal>
              <div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 20 }}>{s.num} / {t('servicesPage.serviceBrief')}</div>
            </Reveal>
            <Reveal delay={80}>
              <div style={{ marginBottom: 32 }}><IconC size={48} stroke={0.8}/></div>
            </Reveal>
            <Reveal delay={160}>
              <h1 className="display" style={{ fontSize: 'clamp(48px, 6vw, 88px)' }}>{t(`services.${s.id}_title`)}</h1>
            </Reveal>
          </div>
          <Reveal delay={240}>
            <p className="lede">{t(`services.${s.id}_desc`)}</p>
          </Reveal>
        </div>

        {/* Per-service hero photography — see SERVICE_PHOTOS above */}
        <Reveal>
          <div style={{ position: 'relative', marginBottom: 96, border: '1px solid var(--fg-08)', overflow: 'hidden', height: SERVICE_PHOTOS[s.id] ? 'clamp(220px, 30vw, 340px)' : 'clamp(200px, 28vw, 300px)' }}>
            {SERVICE_PHOTOS[s.id] ? (
              <>
                <picture>
                  <source srcSet={SERVICE_PHOTOS[s.id].webp} type="image/webp"/>
                  <img src={SERVICE_PHOTOS[s.id].src} alt="" aria-hidden="true" loading="lazy" decoding="async"
                       style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: SERVICE_PHOTOS[s.id].position }}/>
                </picture>
                <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,23,48,0.20) 0%, rgba(0,23,48,0) 45%, rgba(0,23,48,0.30) 100%)' }}/>
                <div className="mono" style={{ position: 'absolute', left: 20, bottom: 14, color: 'rgba(239,234,226,0.75)', letterSpacing: '0.18em', fontSize: 10, textTransform: 'uppercase' }}>
                  {t(`services.${s.id}_title`)}
                </div>
              </>
            ) : (
              <ServiceArt id={s.id} label={t(`services.${s.id}_title`)}/>
            )}
          </div>
        </Reveal>

        {/* Coverage / SLA strip */}
        <Reveal>
          <div className="grid-3" style={{ borderTop: '1px solid var(--fg-15)', borderBottom: '1px solid var(--fg-15)', marginBottom: 96 }}>
            <div style={{ padding: '32px 0', paddingRight: 32, borderRight: '1px solid var(--fg-15)' }}>
              <div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 12 }}>{t('servicesPage.coverageLabel')}</div>
              <div style={{ fontSize: 16, fontFamily: 'var(--serif)' }}>{detail.coverage}</div>
            </div>
            <div style={{ padding: '32px 0', paddingLeft: 32, paddingRight: 32, borderRight: '1px solid var(--fg-15)' }}>
              <div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 12 }}>{t('servicesPage.slaLabel')}</div>
              <div style={{ fontSize: 16, fontFamily: 'var(--serif)' }}>{detail.sla}</div>
            </div>
            <div style={{ padding: '32px 0', paddingLeft: 32 }}>
              <div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 12 }}>{t('servicesPage.deliverablesLabel')}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {detail.deliverables.map(d => <li key={d} style={{ fontSize: 14, color: 'var(--fg-70)' }}>— {d}</li>)}
              </ul>
            </div>
          </div>
        </Reveal>

        {/* Protocol */}
        <div style={{ marginBottom: 96 }}>
          <Reveal>
            <div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 24 }}>{t('servicesPage.protocolLabel')}</div>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="h2" style={{ marginBottom: 64 }}>{t('servicesPage.protocolTitle')}</h2>
          </Reveal>
          <div className="grid-2" style={{ gap: 64 }}>
            {detail.protocol.map((p, i) => (
              <Reveal key={p.n} delay={i * 100}>
                <div style={{ display: 'grid', gridTemplateColumns: '60px 1fr', gap: 24, paddingTop: 32, borderTop: '1px solid var(--fg)' }}>
                  <div className="mono" style={{ color: 'var(--fg-70)' }}>{p.n}</div>
                  <div>
                    <div className="serif" style={{ fontSize: 24, letterSpacing: '-0.01em', marginBottom: 12 }}>{p.step}</div>
                    <div style={{ fontSize: 14, color: 'var(--fg-70)', lineHeight: 1.6 }}>{p.body}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Rate note */}
        <Reveal>
          <div style={{ padding: '40px 48px', background: 'var(--accent-soft)', border: '1px solid var(--accent-line)', marginBottom: 96, display: 'flex', gap: 32, alignItems: 'start' }}>
            <div className="mono" style={{ color: 'var(--accent)', whiteSpace: 'nowrap', paddingTop: 4 }}>{t('servicesPage.ratesLabel')}</div>
            <div style={{ fontSize: 17, fontFamily: 'var(--serif)', lineHeight: 1.5 }}>{detail.rateNote}</div>
          </div>
        </Reveal>

        {/* Contextual CTA — provisioning detail links to the catalogue request page */}
        {s.id === 'provisioning' && (
          <DetailCTA
            label={t('servicesPage.provCatLabel')}
            title={t('servicesPage.provCatTitle')}
            body={t('servicesPage.provCatBody')}
            btn={t('servicesPage.provCatBtn')}
            onClick={() => setRoute({ page: 'provisioning' })}
          />
        )}

        {/* Contextual CTA — fuel detail links to the bunkering request page */}
        {s.id === 'fuel' && (
          <DetailCTA
            label={t('servicesPage.fuelCtaLabel')}
            title={t('servicesPage.fuelCtaTitle')}
            body={t('servicesPage.fuelCtaBody')}
            btn={t('servicesPage.fuelCtaBtn')}
            onClick={() => setRoute({ page: 'bunkering' })}
          />
        )}

        {/* FAQ (Phase 4) */}
        <div style={{ marginBottom: 96 }}>
          <Reveal>
            <div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 24 }}>{t('servicesPage.faqLabel')}</div>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="h2" style={{ marginBottom: 32 }}>{t('servicesPage.faqTitle')}</h2>
          </Reveal>
          <div style={{ borderTop: '1px solid var(--fg-15)' }}>
            {detail.faq.map((item) => <FaqItem key={item.q} q={item.q} a={item.a}/>)}
          </div>
        </div>

        {/* Cross-sell */}
        <div style={{ marginBottom: 96 }}>
          <Reveal>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 48 }}>
              <h3 className="serif" style={{ fontSize: 32 }}>{t('servicesPage.adjacentTitle')}</h3>
              <span className="mono" style={{ color: 'var(--fg-50)' }}>{String(otherServices.length).padStart(2, '0')} / {t('servicesPage.adjacentLabel')}</span>
            </div>
          </Reveal>
          <div className="grid-6" style={{ gap: 0, border: '1px solid var(--fg-08)' }}>
            {otherServices.map((o, i) => {
              const OIcon = Icons[o.icon];
              return (
                <div key={o.id}
                  role="link"
                  tabIndex={0}
                  aria-label={t(`services.${o.id}_title`)}
                  onClick={() => setRoute({ page: 'service', id: o.id })}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setRoute({ page: 'service', id: o.id }); } }}
                  style={{ padding: 28, cursor: 'pointer', borderRight: i < otherServices.length - 1 ? '1px solid var(--fg-08)' : 'none', display: 'flex', flexDirection: 'column', gap: 16, transition: 'background 0.3s var(--ease)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-warm)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div className="mono" style={{ color: 'var(--fg-50)' }}>{o.num}</div>
                  <OIcon size={22} stroke={1}/>
                  <div className="serif" style={{ fontSize: 20 }}>{t(`services.${o.id}_title`)}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}

export { ServicesPage, ServiceDetailPage };
