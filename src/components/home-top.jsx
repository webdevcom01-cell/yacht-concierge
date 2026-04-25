import React from 'react';
import { useTranslation } from 'react-i18next';
import { useApp, Icons, Reveal, SectionHeader } from './shared';
import { SERVICES } from '../data/services';

// Home page — Hero (3 layout variants), Services preview, Stats, Map, Testimonial

// Hero variant A — Editorial split (default)
function HeroEditorial() {
  const { setRoute } = useApp();
  const { t } = useTranslation();
  return (
    <section style={{ paddingTop: 140, paddingBottom: 80 }}>
      <div className="container">
        <div className="grid-hero" style={{ gap: 72, alignItems: 'end' }}>
          <div>
            <Reveal>
              <div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 36, display: 'flex', gap: 24 }}>
                <span>{t('hero.eyebrow')}</span>
                <span>—</span>
                <span>{t('hero.eyebrow2')}</span>
              </div>
            </Reveal>
            <Reveal delay={60}>
              <h1 className="serif" style={{ fontSize: 'clamp(56px, 7.4vw, 112px)', lineHeight: 0.92, letterSpacing: '-0.025em' }}>
                {t('hero.headline1')}<br/>
                <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>{t('hero.headline2')}</em><br/>
                {t('hero.headline3')}<br/>{t('hero.headline4')}
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="lede mt-32" style={{ maxWidth: 460 }}>
                {t('hero.lede')}
              </p>
            </Reveal>
            <Reveal delay={240}>
              <div className="btn-row" style={{ marginTop: 48 }}>
                <button className="btn btn-primary" onClick={() => setRoute({ page: 'contact' })}>
                  {t('hero.btnQuote')} <Icons.Arrow size={14} />
                </button>
                <button className="btn btn-ghost" onClick={() => setRoute({ page: 'services' })}>
                  {t('hero.btnServices')}
                </button>
              </div>
            </Reveal>
          </div>
          <Reveal delay={200}>
            <HeroVisual />
          </Reveal>
        </div>
        <HeroStrip />
      </div>
    </section>
  );
}

// Hero variant B — Cinematic full-bleed
function HeroCinematic() {
  const { setRoute } = useApp();
  const { t } = useTranslation();
  return (
    <section style={{ paddingTop: 0, position: 'relative' }}>
      <div style={{ height: '100vh', minHeight: 700, position: 'relative' }}>
        <div className="hero-canvas" style={{ position: 'absolute', inset: 0 }}>
          <HorizonSVG />
        </div>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 32px' }}>
          <div style={{ color: '#EFEAE2', maxWidth: 960 }}>
            <Reveal>
              <div className="mono" style={{ color: 'rgba(239,234,226,0.6)', marginBottom: 36 }}>
                ↳ MONTENEGRO · EST. MMXVII
              </div>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="serif" style={{ fontSize: 'clamp(48px, 7vw, 104px)', lineHeight: 0.95, letterSpacing: '-0.025em' }}>
                {t('hero.headline1')}<br/>{t('hero.headline2')}
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p style={{ fontSize: 17, color: 'rgba(239,234,226,0.8)', marginTop: 28, fontWeight: 300, maxWidth: 560, marginLeft: 'auto', marginRight: 'auto' }}>
                {t('hero.lede')}
              </p>
            </Reveal>
            <Reveal delay={240}>
              <div style={{ display: 'flex', gap: 14, marginTop: 48, justifyContent: 'center' }}>
                <button className="btn btn-primary" onClick={() => setRoute({ page: 'contact' })}>{t('hero.btnQuote')} <Icons.Arrow size={14}/></button>
                <button className="btn btn-ghost" style={{ borderColor: 'rgba(239,234,226,0.4)', color: '#EFEAE2' }} onClick={() => setRoute({ page: 'services' })}>{t('hero.btnServices')}</button>
              </div>
            </Reveal>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: 32, left: 0, right: 0 }}>
          <div className="container" style={{ color: 'rgba(239,234,226,0.6)' }}>
            <HeroStripInline light />
          </div>
        </div>
      </div>
    </section>
  );
}

// Hero variant C — Oversized editorial type
function HeroOversized() {
  const { setRoute } = useApp();
  const { t } = useTranslation();
  return (
    <section style={{ paddingTop: 180, paddingBottom: 80 }}>
      <div className="container">
        <Reveal>
          <div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 48, display: 'flex', justifyContent: 'space-between' }}>
            <span>A / BERTH</span><span>B / CUSTOMS</span><span>C / PROVISIONING</span><span>D / LAUNDRY</span><span>E / FLORISTRY</span><span>F / MAINTENANCE</span>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="serif" style={{ fontSize: 'clamp(64px, 11vw, 180px)', lineHeight: 0.88, letterSpacing: '-0.03em' }}>
            {t('hero.headline1')}<br/>
            <span style={{ color: 'var(--accent)', fontStyle: 'italic' }}>{t('hero.headline2')}</span><br/>
            {t('hero.headline3')} {t('hero.headline4')}
          </h1>
        </Reveal>
        <div className="grid-2" style={{ gap: 64, marginTop: 72, alignItems: 'end' }}>
          <Reveal delay={160}>
            <div style={{ width: '100%', aspectRatio: '2/1' }}>
              <HeroVisual />
            </div>
          </Reveal>
          <Reveal delay={240}>
            <div>
              <p className="lede">{t('hero.lede')}</p>
              <div style={{ display: 'flex', gap: 14, marginTop: 32 }}>
                <button className="btn btn-primary" onClick={() => setRoute({ page: 'contact' })}>{t('hero.btnQuote')} <Icons.Arrow size={14}/></button>
                <button className="btn btn-ghost" onClick={() => setRoute({ page: 'services' })}>{t('hero.btnServices')}</button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <div style={{ position: 'relative', width: '100%', aspectRatio: '4/5', maxHeight: 640 }}>
      <div className="hero-canvas" style={{ position: 'absolute', inset: 0 }}>
        <HorizonSVG />
      </div>
      {/* Metadata overlay */}
      <div style={{ position: 'absolute', top: 20, left: 20, right: 20, display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--mono)', fontSize: 9.5, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(239,234,226,0.7)' }}>
        <span>BAY OF KOTOR / 42.43°N</span>
        <span>EST. MMXVII</span>
      </div>
      <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20, display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--mono)', fontSize: 9.5, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(239,234,226,0.7)' }}>
        <span>TIVAT, MONTENEGRO</span>
        <span>ADRIATIC SEA</span>
      </div>
    </div>
  );
}

function HorizonSVG() {
  return (
    <svg viewBox="0 0 400 500" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%', display: 'block' }}>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a2c4f"/>
          <stop offset="60%" stopColor="#1a3e5e"/>
          <stop offset="100%" stopColor="#2a5068"/>
        </linearGradient>
        <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#16354d"/>
          <stop offset="100%" stopColor="#03162a"/>
        </linearGradient>
      </defs>
      <rect width="400" height="280" fill="url(#sky)"/>
      <rect y="280" width="400" height="220" fill="url(#sea)"/>
      {/* Horizon line */}
      <line x1="0" y1="280" x2="400" y2="280" stroke="rgba(212,183,143,0.15)" strokeWidth="0.5"/>
      {/* Distant mountains */}
      <path d="M0 280 L40 260 L90 275 L140 250 L210 270 L280 255 L340 272 L400 260 L400 280 Z" fill="rgba(0,0,0,0.4)"/>
      {/* Sea texture */}
      {[...Array(12)].map((_, i) => (
        <line key={i} x1="0" y1={295 + i * 15} x2="400" y2={295 + i * 15} stroke="rgba(102,142,155,0.08)" strokeWidth="0.5"/>
      ))}
      {/* Yacht silhouette */}
      <g transform="translate(160, 268)">
        <rect x="0" y="4" width="80" height="4" fill="rgba(239,234,226,0.55)"/>
        <path d="M0 4 L10 0 L70 0 L80 4 Z" fill="rgba(239,234,226,0.75)"/>
        <rect x="20" y="-8" width="40" height="8" fill="rgba(239,234,226,0.55)"/>
        <rect x="28" y="-14" width="24" height="6" fill="rgba(239,234,226,0.45)"/>
        <line x1="40" y1="-20" x2="40" y2="-14" stroke="rgba(239,234,226,0.4)" strokeWidth="0.5"/>
        {/* Reflection */}
        <rect x="2" y="10" width="76" height="1" fill="rgba(239,234,226,0.2)"/>
        <rect x="6" y="12" width="68" height="0.5" fill="rgba(239,234,226,0.15)"/>
      </g>
      {/* Moon/sun */}
      <circle cx="320" cy="100" r="28" fill="rgba(239,234,226,0.08)"/>
      <circle cx="320" cy="100" r="18" fill="rgba(239,234,226,0.12)"/>
    </svg>
  );
}

function HeroStrip() {
  return (
    <div className="hero-strip" style={{ padding: '24px 0', borderTop: '1px solid var(--fg-08)', borderBottom: '1px solid var(--fg-08)' }}>
      <HeroStripInline />
    </div>
  );
}

function HeroStripInline({ light = false }) {
  const { t } = useTranslation();
  const items = [
    { label: t('hero.labelBase'),    value: t('hero.stripBase') },
    { label: t('hero.labelCoords'),  value: t('hero.stripCoords') },
    { label: t('hero.labelMarinas'), value: t('hero.stripMarinas') },
    { label: t('hero.labelSeason'),  value: t('hero.stripSeason') },
    { label: t('hero.labelContact'), value: t('hero.stripContact') },
  ];
  return (
    <div className="grid-stats-strip" style={{ gap: 24 }}>
      {items.map(i => (
        <div key={i.label} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span className="mono" style={{ color: light ? 'rgba(239,234,226,0.5)' : 'var(--fg-50)' }}>{i.label}</span>
          <span style={{ fontFamily: 'var(--serif)', fontSize: 20, letterSpacing: '-0.01em', color: light ? '#EFEAE2' : 'var(--fg)' }}>{i.value}</span>
        </div>
      ))}
    </div>
  );
}

// ---------- Services preview grid ----------
function ServicesPreview() {
  const { setRoute, serviceDensity } = useApp();
  const { t } = useTranslation();
  return (
    <section className="section">
      <div className="container">
        <div className="grid-2 services-preview-header" style={{ alignItems: 'end' }}>
          <div>
            <Reveal>
              <div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 24 }}>
                {t('services.eyebrow')}
              </div>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="h2">
                {t('services.title1')}<br/>
                <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>{t('services.title2')}</em>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={160}>
            <p className="lede lede-right">{t('services.lede')}</p>
          </Reveal>
        </div>

        <div className={`services-grid services-grid--${serviceDensity === 'dense' ? 'dense' : serviceDensity === 'loose' ? 'loose' : 'standard'}`} style={{ gap: 0, border: '1px solid var(--fg-08)' }}>
          {SERVICES.map((s, i) => {
            const IconC = Icons[s.icon];
            const colCount = serviceDensity === 'dense' ? 4 : serviceDensity === 'loose' ? 2 : 3;
            const isRight = (i + 1) % colCount === 0;
            const isBottom = i >= SERVICES.length - colCount;
            return (
              <Reveal key={s.id} delay={i * 60}>
                <div
                  className="service-card"
                  style={{
                    border: 'none',
                    borderRight: isRight ? 'none' : '1px solid var(--fg-08)',
                    borderBottom: isBottom ? 'none' : '1px solid var(--fg-08)',
                    borderRadius: 0,
                    background: 'transparent',
                  }}
                  onClick={() => setRoute({ page: 'service', id: s.id })}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <span className="service-card-num">{s.num}</span>
                    <IconC size={28} stroke={1} />
                  </div>
                  <h3 className="service-card-title">{s.title}</h3>
                  <p className="service-card-body">{s.desc}</p>
                  <div className="service-card-arrow">
                    {t('services.viewProtocol')} <Icons.Arrow size={12}/>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ---------- Stats / SLA ----------
function StatsBlock() {
  const { t } = useTranslation();
  const items = [
    { value: t('stats.disciplines_value'), label: t('stats.disciplines_label'), sub: t('stats.disciplines_sub') },
    { value: t('stats.sla_value'),         label: t('stats.sla_label'),         sub: t('stats.sla_sub') },
    { value: t('stats.season_value'),      label: t('stats.season_label'),      sub: t('stats.season_sub') },
    { value: t('stats.coordinator_value'), label: t('stats.coordinator_label'), sub: t('stats.coordinator_sub') },
  ];
  return (
    <section className="section" style={{ paddingTop: 80 }}>
      <div className="container">
        <SectionHeader num="02" eyebrow={t('stats.eyebrow')} title={<>{t('stats.title')}</>} />
        <div className="grid-4" style={{ gap: 0, borderTop: '1px solid var(--fg-08)', borderBottom: '1px solid var(--fg-08)' }}>
          {items.map((s, i) => (
            <Reveal key={i} delay={i * 80}>
              <div style={{ padding: '56px 32px', borderRight: i < 3 ? '1px solid var(--fg-08)' : 'none' }}>
                <div className="serif" style={{ fontSize: 64, lineHeight: 0.95, letterSpacing: '-0.02em' }}>
                  {s.value}
                </div>
                <div className="mono mt-24" style={{ color: 'var(--fg-70)' }}>{s.label}</div>
                <div style={{ fontSize: 12.5, color: 'var(--fg-50)', marginTop: 8 }}>{s.sub}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export { HeroEditorial, HeroCinematic, HeroOversized, ServicesPreview, StatsBlock };
