import React, { useState } from 'react';
import { useApp, Icons, Reveal, SectionHeader } from './shared';
import { HeroEditorial, HeroCinematic, HeroOversized, ServicesPreview, StatsBlock } from './home-top';

// Home page bottom — Interactive coast map, Berth availability widget, Testimonial, CTA

function CoastMap() {
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
          eyebrow="BERTH AVAILABILITY"
          title={<>Five marinas. <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>One coast.</em></>}
          lede="Our operational footprint spans five marinas along the Montenegrin coast. Contact us directly for current berth availability and seasonal rates."
        />
        <div className="grid-map" style={{ gap: 72, alignItems: 'start' }}>
          <Reveal>
            <div style={{ position: 'relative', aspectRatio: '4/3', background: 'var(--bg-raised)', border: '1px solid var(--fg-08)' }}>
              <MapSVG ports={ports} selected={selected} onSelect={setSelected} />
              <div style={{ position: 'absolute', top: 20, left: 20, fontFamily: 'var(--mono)', fontSize: 9.5, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--fg-50)' }}>
                ADRIATIC COAST · MONTENEGRO
              </div>
              <div style={{ position: 'absolute', top: 20, right: 20, fontFamily: 'var(--mono)', fontSize: 9.5, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--fg-50)' }}>
                MONTENEGRIN COAST
              </div>
              <div style={{ position: 'absolute', bottom: 20, left: 20, fontFamily: 'var(--mono)', fontSize: 9.5, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--fg-50)' }}>
                SELECT A MARINA
              </div>
            </div>
          </Reveal>
          <div>
            <Reveal delay={120}>
              <div style={{ border: '1px solid var(--fg-08)', background: 'var(--bg-raised)', padding: 36 }}>
                <div style={{ marginBottom: 28 }}>
                  <div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 10 }}>{cur.coords}</div>
                  <h3 className="serif" style={{ fontSize: 36, letterSpacing: '-0.01em' }}>{cur.name}</h3>
                </div>
                <div className="rule mb-24" style={{ marginTop: 8 }}/>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 28 }}>
                  <div>
                    <div className="mono" style={{ color: 'var(--fg-50)' }}>Total Berths</div>
                    <div className="serif" style={{ fontSize: 40, marginTop: 6 }}>{cur.berths}</div>
                  </div>
                  <div>
                    <div className="mono" style={{ color: 'var(--fg-50)' }}>Availability</div>
                    <div className="serif" style={{ fontSize: 18, marginTop: 10, color: 'var(--fg-70)', lineHeight: 1.4 }}>Contact us for current berth availability</div>
                  </div>
                </div>
                <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => {/* contact */}}>
                  Enquire About Availability <Icons.Arrow size={14}/>
                </button>
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
  const steps = [
    { n: '01', label: 'CONTACT', desc: 'Intake call with your captain or manager.' },
    { n: '02', label: 'PLAN', desc: 'Itinerary brief, service scope, SLAs, quote.' },
    { n: '03', label: 'EXECUTE', desc: 'Dedicated coordinator on-call for the stay.' },
    { n: '04', label: 'REVIEW', desc: 'Post-call report, next-season recommendations.' },
  ];
  return (
    <section className="section" style={{ background: 'var(--bg-warm)' }}>
      <div className="container">
        <div className="grid-2" style={{ gap: 72, marginBottom: 72, alignItems: 'end' }}>
          <div>
            <Reveal><div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 24 }}>05 / PROTOCOL</div></Reveal>
            <Reveal delay={80}><h2 className="h2">A considered protocol.</h2></Reveal>
          </div>
          <Reveal delay={160}>
            <p className="lede lede-right">
              Every yacht we serve moves through four measured steps. No rushed handoffs, no lost context.
            </p>
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
              FULL PROTOCOL <Icons.Arrow size={12}/>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ---------- Testimonials ----------
function TestimonialsSection() {
  const testimonials = [
    {
      quote: "We arrived with a last-minute crew change and a customs issue from our previous port. The desk had both resolved before we were tied up. I have never seen that kind of turnaround outside of Monaco.",
      name: "Capt. R. Voss",
      detail: "M/Y NORTHERN STAR · 58m · German flag",
    },
    {
      quote: "Provisioning was ready on the berth, cold chain intact, exactly as specified — including three items I expected to have substituted. The coordinator had sourced them from Podgorica overnight.",
      name: "Capt. S. Marin",
      detail: "S/Y ALBA · 42m · Cayman Islands flag",
    },
    {
      quote: "Three seasons in Montenegro, three seasons with this desk. Everything is simpler when the person you're calling knows your vessel file. I don't brief them anymore — they brief me.",
      name: "Capt. J. Lindqvist",
      detail: "M/Y AURELIA · 72m · Malta flag",
    },
  ];

  return (
    <section className="section" style={{ background: 'var(--surface, var(--bg-warm))' }}>
      <div className="container">
        <SectionHeader
          eyebrow="FROM THE LOG"
          title={<>What captains<br/><em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>say.</em></>}
          lede="Nine seasons. The record speaks."
        />
        <div className="grid-3" style={{ gap: 32, marginTop: 56 }}>
          {testimonials.map((t, i) => (
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
                  {t.quote}
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
                    {t.name}
                  </div>
                  <div className="mono" style={{ fontSize: 10, color: 'var(--fg-50)', letterSpacing: '0.08em' }}>
                    {t.detail}
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
function ClosingCTA() {
  const { setRoute } = useApp();
  return (
    <section className="section" style={{ paddingTop: 120, paddingBottom: 160 }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <Reveal>
          <div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 32 }}>↳ ENGAGE</div>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="serif" style={{ fontSize: 'clamp(48px, 6.5vw, 96px)', lineHeight: 0.95, letterSpacing: '-0.02em' }}>
            Arriving in Montenegro?<br/>
            <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>Let the desk work.</em>
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p className="lede" style={{ margin: '32px auto 0' }}>
            Submit your ETA, LOA, and call sign. We'll return a coordinated service brief within four operational hours.
          </p>
        </Reveal>
        <Reveal delay={240}>
          <div className="btn-row" style={{ justifyContent: 'center', marginTop: 48 }}>
            <button className="btn btn-primary" onClick={() => setRoute({ page: 'contact' })}>Request Quote <Icons.Arrow size={14}/></button>
            <button className="btn btn-ghost" onClick={() => setRoute({ page: 'services' })}>View All Services</button>
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
