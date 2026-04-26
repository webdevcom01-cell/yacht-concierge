import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp, Icons, Reveal, SectionHeader } from './shared';
import { HeroEditorial, HeroCinematic, HeroOversized, ServicesPreview, StatsBlock } from './home-top';

// Home page bottom — Interactive coast map, Berth availability widget, Testimonial, CTA

// ── Marina illustration — unique palette per port ────────────────────────────

const MARINA_PALETTES = {
  'herceg-novi': {
    skyTop: '#2A1A0A', skyMid: '#7A3E1A', skyBot: '#C4622A',
    seaTop: '#1A4A5A', seaBot: '#0A2A3A',
    mountains: 'rgba(60,20,5,0.85)',
    glow: '#E8842A', glowR: 45,
    accent: 'rgba(232,132,42,0.15)',
    label: 'GOLDEN HOUR',
  },
  'porto-montenegro': {
    skyTop: '#020E1C', skyMid: '#0a2c4f', skyBot: '#1a3e5e',
    seaTop: '#16354d', seaBot: '#03162a',
    mountains: 'rgba(0,0,0,0.5)',
    glow: '#EFEAE2', glowR: 28,
    accent: 'rgba(184,150,62,0.1)',
    label: 'MIDNIGHT',
  },
  'kotor': {
    skyTop: '#0A0F18', skyMid: '#1A2535', skyBot: '#2E3E52',
    seaTop: '#1A2E3A', seaBot: '#0A1A24',
    mountains: 'rgba(5,10,20,0.9)',
    glow: '#B0C4D8', glowR: 22,
    accent: 'rgba(176,196,216,0.08)',
    label: 'MORNING MIST',
  },
  'budva': {
    skyTop: '#0A2040', skyMid: '#1A4A7A', skyBot: '#2E7AB0',
    seaTop: '#1A6A8A', seaBot: '#0A3A50',
    mountains: 'rgba(10,30,50,0.6)',
    glow: '#7ACFEA', glowR: 36,
    accent: 'rgba(122,207,234,0.12)',
    label: 'AZURE NOON',
  },
  'bar': {
    skyTop: '#080510', skyMid: '#1A0A2E', skyBot: '#2E1A4A',
    seaTop: '#0A1E2E', seaBot: '#03080F',
    mountains: 'rgba(15,5,25,0.88)',
    glow: '#C8A0E0', glowR: 24,
    accent: 'rgba(200,160,224,0.1)',
    label: 'PRE-DAWN',
  },
};

function MarinaSVG({ id, label }) {
  const p = MARINA_PALETTES[id] || MARINA_PALETTES['porto-montenegro'];
  const isKotor = id === 'kotor';
  const moodLabel = label || p.label;
  return (
    <svg
      viewBox="0 0 400 260"
      preserveAspectRatio="xMidYMid slice"
      style={{ width: '100%', height: '100%', display: 'block', transition: 'opacity 0.4s ease' }}
    >
      <defs>
        <linearGradient id={`sky-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={p.skyTop}/>
          <stop offset="55%"  stopColor={p.skyMid}/>
          <stop offset="100%" stopColor={p.skyBot}/>
        </linearGradient>
        <linearGradient id={`sea-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={p.seaTop}/>
          <stop offset="100%" stopColor={p.seaBot}/>
        </linearGradient>
        <radialGradient id={`glow-${id}`} cx="75%" cy="38%" r="28%">
          <stop offset="0%"   stopColor={p.glow} stopOpacity="0.22"/>
          <stop offset="100%" stopColor={p.glow} stopOpacity="0"/>
        </radialGradient>
      </defs>

      {/* Sky */}
      <rect width="400" height="170" fill={`url(#sky-${id})`}/>
      {/* Glow */}
      <rect width="400" height="170" fill={`url(#glow-${id})`}/>
      {/* Sea */}
      <rect y="170" width="400" height="90" fill={`url(#sea-${id})`}/>
      {/* Horizon */}
      <line x1="0" y1="170" x2="400" y2="170" stroke={p.glow} strokeOpacity="0.18" strokeWidth="0.6"/>

      {/* Mountains — Kotor gets dramatic high peaks */}
      {isKotor ? (
        <path d="M0 170 L30 120 L65 150 L100 100 L145 130 L190 108 L240 125 L285 105 L330 122 L370 110 L400 118 L400 170 Z"
          fill={p.mountains}/>
      ) : (
        <path d="M0 170 L45 148 L95 162 L150 140 L220 158 L285 143 L345 160 L400 148 L400 170 Z"
          fill={p.mountains}/>
      )}

      {/* Moon / sun orb */}
      <circle cx="300" cy="65" r={p.glowR} fill={p.glow} fillOpacity="0.07"/>
      <circle cx="300" cy="65" r={p.glowR * 0.6} fill={p.glow} fillOpacity="0.11"/>

      {/* Stars — small dots */}
      {[[40,30],[80,18],[130,42],[170,22],[220,38],[260,14],[340,28],[380,44],[60,55],[200,10]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="0.8" fill={p.glow} fillOpacity="0.45"/>
      ))}

      {/* Yacht silhouette */}
      <g transform="translate(148, 162)">
        <rect x="0" y="4" width="80" height="4" fill="rgba(239,234,226,0.6)"/>
        <path d="M0 4 L10 0 L70 0 L80 4 Z" fill="rgba(239,234,226,0.8)"/>
        <rect x="20" y="-9" width="40" height="9" fill="rgba(239,234,226,0.55)"/>
        <rect x="28" y="-16" width="24" height="7" fill="rgba(239,234,226,0.45)"/>
        <line x1="40" y1="-22" x2="40" y2="-16" stroke="rgba(239,234,226,0.4)" strokeWidth="0.6"/>
        <rect x="2" y="9"  width="76" height="1"   fill="rgba(239,234,226,0.18)"/>
        <rect x="6" y="11" width="68" height="0.5" fill="rgba(239,234,226,0.12)"/>
      </g>

      {/* Sea reflection lines */}
      {[0,1,2,3,4,5,6].map(i => (
        <line key={i} x1="0" y1={180 + i*11} x2="400" y2={180 + i*11}
          stroke={p.glow} strokeOpacity="0.05" strokeWidth="0.5"/>
      ))}

      {/* Corner label */}
      <text x="12" y="252" fontFamily="monospace" fontSize="8"
        letterSpacing="2" fill="rgba(239,234,226,0.35)" textAnchor="start">
        {moodLabel}
      </text>
    </svg>
  );
}

function CoastMap() {
  const { setRoute } = useApp();
  const { t } = useTranslation();
  const [selected, setSelected] = useState('porto-montenegro');
  const ports = [
    { id: 'herceg-novi', name: 'Herceg Novi', x: 14, y: 32, coords: '42.45°N 18.54°E', berths: 120 },
    { id: 'porto-montenegro', name: 'Porto Montenegro', x: 38, y: 52, coords: '42.43°N 18.69°E', berths: 450 },
    { id: 'kotor', name: 'Kotor', x: 54, y: 30, coords: '42.42°N 18.77°E', berths: 90 },
    { id: 'budva', name: 'Budva', x: 70, y: 60, coords: '42.28°N 18.84°E', berths: 380 },
    { id: 'bar', name: 'Bar', x: 88, y: 82, coords: '42.10°N 19.09°E', berths: 160 },
  ];
  const cur = ports.find(p => p.id === selected);

  return (
    <section className="section" style={{ background: 'var(--bg-warm)' }}>
      <div className="container">
        <SectionHeader
          num="03 / FLEET"
          eyebrow={t('map.eyebrow')}
          title={<>{t('map.title1')} <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>{t('map.title2')}</em></>}
          lede={t('map.lede')}
        />
        <div className="grid-map" style={{ gap: 72, alignItems: 'start' }}>
          <Reveal>
            <div style={{ position: 'relative', aspectRatio: '4/3', background: 'var(--bg-raised)', border: '1px solid var(--fg-08)' }}>
              <MapSVG ports={ports} selected={selected} onSelect={setSelected} />
              <div style={{ position: 'absolute', top: 20, left: 20, fontFamily: 'var(--mono)', fontSize: 9.5, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--fg-50)' }}>
                {t('map.mapLabel')}
              </div>
              <div style={{ position: 'absolute', top: 20, right: 20, fontFamily: 'var(--mono)', fontSize: 9.5, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--fg-50)' }}>
                {t('map.mapLabel2')}
              </div>
              <div style={{ position: 'absolute', bottom: 20, left: 20, fontFamily: 'var(--mono)', fontSize: 9.5, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--fg-50)' }}>
                {t('map.selectMarina')}
              </div>
            </div>
          </Reveal>
          <div>
            <Reveal delay={120}>
              <div style={{ border: '1px solid var(--fg-08)', background: 'var(--bg-raised)', overflow: 'hidden' }}>
                {/* Marina illustration */}
                <div style={{ height: 180, overflow: 'hidden' }}>
                  <MarinaSVG id={selected} label={t(`map.mood_${selected.replace(/-/g, '_')}`)} />
                </div>
                {/* Info panel */}
                <div style={{ padding: '28px 32px 32px' }}>
                  <div style={{ marginBottom: 20 }}>
                    <div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 8, fontSize: 10 }}>{cur.coords}</div>
                    <h3 className="serif" style={{ fontSize: 32, letterSpacing: '-0.01em' }}>{cur.name}</h3>
                  </div>
                  <div className="rule mb-24" style={{ marginTop: 4 }}/>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
                    <div>
                      <div className="mono" style={{ color: 'var(--fg-50)' }}>{t('map.totalBerths')}</div>
                      <div className="serif" style={{ fontSize: 40, marginTop: 6 }}>{cur.berths}</div>
                    </div>
                    <div>
                      <div className="mono" style={{ color: 'var(--fg-50)' }}>{t('map.availability')}</div>
                      <div className="serif" style={{ fontSize: 16, marginTop: 10, color: 'var(--fg-70)', lineHeight: 1.5 }}>{t('map.availabilityText')}</div>
                    </div>
                  </div>
                  <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center' }}
                    onClick={() => setRoute({ page: 'contact', service: 'berth' })}>
                    {t('map.enquire')} <Icons.Arrow size={14}/>
                  </button>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function MapSVG({ ports, selected, onSelect }) {
  return (
    <svg viewBox="0 0 100 75" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%', display: 'block' }}>
      {/* Sea */}
      <rect width="100" height="75" fill="var(--bg-warm)"/>

      {/* Grid */}
      <g stroke="var(--fg-08)" strokeWidth="0.08">
        {[...Array(10)].map((_, i) => <line key={`h${i}`} x1="0" y1={i * 7.5} x2="100" y2={i * 7.5}/>)}
        {[...Array(14)].map((_, i) => <line key={`v${i}`} x1={i * 7.5} y1="0" x2={i * 7.5} y2="75"/>)}
      </g>

      {/* Landmass — Montenegrin coast (stylized) */}
      <path
        d="M 0 0 L 100 0 L 100 18 Q 90 19 85 24 Q 80 28 70 26 Q 60 22 52 24 Q 45 28 42 38 Q 42 48 48 52 Q 58 58 70 56 Q 85 56 95 66 Q 100 72 100 75 L 0 75 L 0 0 Z"
        fill="var(--bg)"
        stroke="var(--fg-15)"
        strokeWidth="0.15"
        opacity="0.4"
      />
      {/* Land label */}
      <text x="20" y="14" fontFamily="var(--mono)" fontSize="1.4" fill="var(--fg-50)" letterSpacing="0.4">MONTENEGRO</text>
      <text x="78" y="72" fontFamily="var(--mono)" fontSize="1.4" fill="var(--fg-50)" letterSpacing="0.4">ALBANIA →</text>
      <text x="4" y="70" fontFamily="var(--mono)" fontSize="1.4" fill="var(--fg-50)" letterSpacing="0.4">← ADRIATIC</text>

      {/* Bay of Kotor shading */}
      <path d="M 14 32 Q 28 38 38 52 Q 46 46 54 30 Z" fill="var(--accent)" opacity="0.08"/>

      {/* Ports */}
      {ports.map(p => {
        const isSel = p.id === selected;
        return (
          <g key={p.id} style={{ cursor: 'pointer' }} onClick={() => onSelect(p.id)}>
            {isSel && <circle cx={p.x} cy={p.y} r="3.5" fill="var(--accent)" opacity="0.2">
              <animate attributeName="r" values="2.5;4.5;2.5" dur="2.4s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.35;0;0.35" dur="2.4s" repeatCount="indefinite"/>
            </circle>}
            <circle cx={p.x} cy={p.y} r={isSel ? 1.2 : 0.9} fill="var(--accent)"/>
            <circle cx={p.x} cy={p.y} r="2.6" fill="none" stroke="var(--accent)" strokeWidth="0.15" opacity={isSel ? 1 : 0.4}/>
            <text
              x={p.x + 3.5}
              y={p.y + 0.8}
              fontFamily="var(--serif)"
              fontSize={isSel ? '2.4' : '2'}
              fill="var(--fg)"
              style={{ transition: 'font-size 0.3s' }}
            >{p.name}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ---------- Process preview strip ----------
function ProcessStrip() {
  const { setRoute } = useApp();
  const { t } = useTranslation();
  const steps = [
    { n: t('process.step1_n'), label: t('process.step1_label'), desc: t('process.step1_desc') },
    { n: t('process.step2_n'), label: t('process.step2_label'), desc: t('process.step2_desc') },
    { n: t('process.step3_n'), label: t('process.step3_label'), desc: t('process.step3_desc') },
    { n: t('process.step4_n'), label: t('process.step4_label'), desc: t('process.step4_desc') },
  ];
  return (
    <section className="section" style={{ background: 'var(--bg-warm)' }}>
      <div className="container">
        <div className="grid-2" style={{ gap: 72, marginBottom: 72, alignItems: 'end' }}>
          <div>
            <Reveal><div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 24 }}>{t('process.eyebrow')}</div></Reveal>
            <Reveal delay={80}><h2 className="h2">{t('process.title')}</h2></Reveal>
          </div>
          <Reveal delay={160}>
            <p className="lede lede-right">{t('process.lede')}</p>
          </Reveal>
        </div>
        <div className="grid-4" style={{ gap: 0 }}>
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 80}>
              <div style={{ padding: '32px 24px 32px 0', borderTop: '1px solid var(--fg)', position: 'relative' }}>
                <div style={{ position: 'absolute', top: -6, left: 0, width: 12, height: 12, background: i === 2 ? 'var(--accent)' : 'var(--fg)', borderRadius: '50%' }}/>
                <div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 16 }}>{s.n}</div>
                <div className="serif" style={{ fontSize: 28, letterSpacing: '-0.01em', marginBottom: 12 }}>{s.label}</div>
                <div style={{ fontSize: 13.5, color: 'var(--fg-70)', maxWidth: '20ch' }}>{s.desc}</div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={400}>
          <div style={{ marginTop: 48 }}>
            <a className="btn-link mono" onClick={() => setRoute({ page: 'process' })}>
              {t('process.fullProtocol')} <Icons.Arrow size={12}/>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ---------- Testimonials ----------
function TestimonialsSection() {
  const { t } = useTranslation();
  const testimonials = [
    { quote: t('testimonials.t1_quote'), name: t('testimonials.t1_name'), detail: t('testimonials.t1_detail') },
    { quote: t('testimonials.t2_quote'), name: t('testimonials.t2_name'), detail: t('testimonials.t2_detail') },
    { quote: t('testimonials.t3_quote'), name: t('testimonials.t3_name'), detail: t('testimonials.t3_detail') },
  ];

  return (
    <section className="section" style={{ background: 'var(--surface, var(--bg-warm))' }}>
      <div className="container">
        <SectionHeader
          eyebrow={t('testimonials.eyebrow')}
          title={<>{t('testimonials.title1')}<br/><em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>{t('testimonials.title2')}</em></>}
          lede={t('testimonials.lede')}
        />
        <div className="grid-3" style={{ gap: 32, marginTop: 56 }}>
          {testimonials.map((item, i) => (
            <Reveal key={i} delay={i * 100}>
              <div style={{
                background: 'var(--bg-raised, var(--bg))',
                border: '1px solid var(--border, var(--fg-08))',
                borderRadius: 4,
                padding: '44px 40px',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}>
                {/* Opening mark */}
                <div style={{
                  fontFamily: 'var(--serif)',
                  fontSize: 64,
                  lineHeight: 0.7,
                  color: 'var(--accent)',
                  marginBottom: 24,
                  opacity: 0.6,
                }}>"</div>

                {/* Quote */}
                <p style={{
                  fontSize: 16,
                  lineHeight: 1.8,
                  color: 'var(--fg-80)',
                  fontStyle: 'italic',
                  fontFamily: 'var(--serif)',
                  flex: 1,
                  marginBottom: 32,
                }}>
                  {item.quote}
                </p>

                {/* Rule */}
                <div style={{ height: 1, background: 'var(--border, var(--fg-08))', marginBottom: 24 }}/>

                {/* Attribution */}
                <div>
                  <div style={{
                    fontFamily: 'var(--mono)',
                    fontSize: 12,
                    fontWeight: 500,
                    letterSpacing: '0.06em',
                    color: 'var(--fg)',
                    marginBottom: 6,
                  }}>
                    {item.name}
                  </div>
                  <div className="mono" style={{ fontSize: 10, color: 'var(--fg-50)', letterSpacing: '0.08em' }}>
                    {item.detail}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------- Final CTA ----------
function ClosingCTA({ serviceId = null }) {
  const { setRoute } = useApp();
  const { t } = useTranslation();
  return (
    <section className="section" style={{ paddingTop: 120, paddingBottom: 160 }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <Reveal>
          <div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 32 }}>{t('cta.engage')}</div>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="serif" style={{ fontSize: 'clamp(48px, 6.5vw, 96px)', lineHeight: 0.95, letterSpacing: '-0.02em' }}>
            {t('cta.title1')}<br/>
            <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>{t('cta.title2')}</em>
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p className="lede" style={{ margin: '32px auto 0' }}>{t('cta.lede')}</p>
        </Reveal>
        <Reveal delay={240}>
          <div className="btn-row" style={{ justifyContent: 'center', marginTop: 48 }}>
            <button
              className="btn btn-primary"
              onClick={() => setRoute({ page: 'contact', ...(serviceId && { service: serviceId }) })}
            >
              {t('cta.btnQuote')} <Icons.Arrow size={14}/>
            </button>
            <button className="btn btn-ghost" onClick={() => setRoute({ page: 'services' })}>{t('cta.btnServices')}</button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ---------- Home page shell ----------
function HomePage() {
  const { heroVariant } = useApp();
  return (
    <main>
      {heroVariant === 'cinematic' && <HeroCinematic/>}
      {heroVariant === 'oversized' && <HeroOversized/>}
      {heroVariant === 'editorial' && <HeroEditorial/>}
      <ServicesPreview/>
      <StatsBlock/>
      <CoastMap/>
      <ProcessStrip/>
      <TestimonialsSection/>
      <ClosingCTA/>
    </main>
  );
}

export { CoastMap, ProcessStrip, ClosingCTA, HomePage };
