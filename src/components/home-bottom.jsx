import React, { useState, useEffect, useRef } from 'react';
import { useApp, Icons, Reveal, SectionHeader } from './shared';
import { HeroEditorial, HeroCinematic, HeroOversized, ServicesPreview, StatsBlock } from './home-top';

// Home page bottom — Interactive coast map, Berth availability widget, Testimonial, CTA

function CoastMap() {
  const [selected, setSelected] = useState('porto-montenegro');
  const ports = [
    { id: 'herceg-novi', name: 'Herceg Novi', x: 14, y: 32, coords: '42.45°N 18.54°E', berths: 120, available: 18, status: 'OPEN' },
    { id: 'porto-montenegro', name: 'Porto Montenegro', x: 38, y: 52, coords: '42.43°N 18.69°E', berths: 450, available: 7, status: 'HIGH DEMAND' },
    { id: 'kotor', name: 'Kotor', x: 54, y: 30, coords: '42.42°N 18.77°E', berths: 90, available: 12, status: 'OPEN' },
    { id: 'budva', name: 'Budva', x: 70, y: 60, coords: '42.28°N 18.84°E', berths: 380, available: 24, status: 'OPEN' },
    { id: 'bar', name: 'Bar', x: 88, y: 82, coords: '42.10°N 19.09°E', berths: 160, available: 9, status: 'OPEN' },
  ];
  const cur = ports.find(p => p.id === selected);

  return (
    <section className="section" style={{ background: 'var(--bg-warm)' }}>
      <div className="container">
        <SectionHeader
          num="03 / FLEET"
          eyebrow="LIVE BERTH AVAILABILITY"
          title={<>Five marinas. <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>One coast.</em></>}
          lede="Real-time availability across our operational footprint in Montenegro. Updated at :00 and :30 past the hour."
        />
        <div className="grid-map" style={{ gap: 72, alignItems: 'start' }}>
          <Reveal>
            <div style={{ position: 'relative', aspectRatio: '4/3', background: 'var(--bg-raised)', border: '1px solid var(--fg-08)' }}>
              <MapSVG ports={ports} selected={selected} onSelect={setSelected} />
              <div style={{ position: 'absolute', top: 20, left: 20, fontFamily: 'var(--mono)', fontSize: 9.5, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--fg-50)' }}>
                ADRIATIC COAST · MONTENEGRO
              </div>
              <div style={{ position: 'absolute', top: 20, right: 20, fontFamily: 'var(--mono)', fontSize: 9.5, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--fg-50)' }}>
                {new Date().toISOString().slice(0,10)} · 04:18 UTC
              </div>
              <div style={{ position: 'absolute', bottom: 20, left: 20, display: 'flex', gap: 16, fontFamily: 'var(--mono)', fontSize: 9.5, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)' }}/>
                  Open
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--gold)' }}/>
                  High demand
                </span>
              </div>
            </div>
          </Reveal>
          <div>
            <Reveal delay={120}>
              <div style={{ border: '1px solid var(--fg-08)', background: 'var(--bg-raised)', padding: 36 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 28 }}>
                  <div>
                    <div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 10 }}>{cur.coords}</div>
                    <h3 className="serif" style={{ fontSize: 36, letterSpacing: '-0.01em' }}>{cur.name}</h3>
                  </div>
                  <span
                    className="mono"
                    style={{
                      padding: '6px 10px',
                      border: `1px solid ${cur.status === 'OPEN' ? 'var(--accent-line)' : 'rgba(212,183,143,0.5)'}`,
                      color: cur.status === 'OPEN' ? 'var(--accent)' : 'var(--gold)',
                    }}
                  >
                    {cur.status}
                  </span>
                </div>
                <div className="rule mb-24" style={{ marginTop: 8 }}/>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 28 }}>
                  <div>
                    <div className="mono" style={{ color: 'var(--fg-50)' }}>Total Berths</div>
                    <div className="serif" style={{ fontSize: 40, marginTop: 6 }}>{cur.berths}</div>
                  </div>
                  <div>
                    <div className="mono" style={{ color: 'var(--fg-50)' }}>Available</div>
                    <div className="serif" style={{ fontSize: 40, marginTop: 6, color: 'var(--accent)' }}>{cur.available}</div>
                  </div>
                </div>
                {/* Availability bar */}
                <div style={{ marginBottom: 28 }}>
                  <div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 10 }}>OCCUPANCY</div>
                  <div style={{ height: 4, background: 'var(--fg-08)', position: 'relative' }}>
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      width: `${((cur.berths - cur.available) / cur.berths) * 100}%`,
                      background: 'var(--fg)',
                      transition: 'width 0.6s var(--ease)',
                    }}/>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 12, color: 'var(--fg-50)' }}>
                    <span>{Math.round(((cur.berths - cur.available) / cur.berths) * 100)}% occupied</span>
                    <span>Next release: 14:00 UTC</span>
                  </div>
                </div>
                <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Hold a Berth <Icons.Arrow size={14}/>
                </button>
              </div>
            </Reveal>
            <Reveal delay={200}>
              <div style={{ marginTop: 24, padding: 24, border: '1px solid var(--fg-08)', display: 'flex', gap: 16, alignItems: 'start' }}>
                <Icons.Compass size={20} stroke={1}/>
                <div>
                  <div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 6 }}>OPERATIONAL NOTE</div>
                  <div style={{ fontSize: 13.5, lineHeight: 1.5 }}>
                    For vessels over 60m LOA arriving before June 1, Porto Montenegro B-Quay remains the recommended approach.
                  </div>
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
        const isHigh = p.status === 'HIGH DEMAND';
        return (
          <g key={p.id} style={{ cursor: 'pointer' }} onClick={() => onSelect(p.id)}>
            {isSel && <circle cx={p.x} cy={p.y} r="3.5" fill={isHigh ? 'var(--gold)' : 'var(--accent)'} opacity="0.2">
              <animate attributeName="r" values="2.5;4.5;2.5" dur="2.4s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.35;0;0.35" dur="2.4s" repeatCount="indefinite"/>
            </circle>}
            <circle cx={p.x} cy={p.y} r={isSel ? 1.2 : 0.9} fill={isHigh ? 'var(--gold)' : 'var(--accent)'}/>
            <circle cx={p.x} cy={p.y} r="2.6" fill="none" stroke={isHigh ? 'var(--gold)' : 'var(--accent)'} strokeWidth="0.15" opacity={isSel ? 1 : 0.4}/>
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

// ---------- Testimonial ----------
function Testimonial() {
  return (
    <section className="section">
      <div className="container">
        <div className="grid-testimonial" style={{ gap: 72 }}>
          <Reveal>
            <div>
              <div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 20 }}>04 / LOG</div>
              <div className="mono" style={{ color: 'var(--fg-70)' }}>
                M/Y ATLAS<br/>
                73M · CAYMAN ISLANDS<br/>
                ↳ TIVAT · 14.VI.2025
              </div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <blockquote style={{ margin: 0 }}>
              <div className="serif" style={{ fontSize: 'clamp(28px, 3.4vw, 44px)', lineHeight: 1.25, letterSpacing: '-0.01em' }}>
                <span style={{ color: 'var(--accent)' }}>"</span>We changed course from Corfu at 0200 with a twelve-person charter inbound. Customs cleared, provisioning re-routed, berth held at B-Quay — it was handled before we raised the captain for coffee.<span style={{ color: 'var(--accent)' }}>"</span>
              </div>
              <div className="mt-48" style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--fg-08)', paddingTop: 24 }}>
                <span className="mono" style={{ color: 'var(--fg-50)' }}>CAPT. B.H. ELLIS</span>
                <span className="mono" style={{ color: 'var(--fg-50)' }}>FILE №2025-0614-AT</span>
              </div>
            </blockquote>
          </Reveal>
        </div>
      </div>
    </section>
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
            <p className="lede" style={{ textAlign: 'right', marginLeft: 'auto' }}>
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
      <Testimonial/>
      <ProcessStrip/>
      <ClosingCTA/>
    </main>
  );
}

export { CoastMap, Testimonial, ProcessStrip, ClosingCTA, HomePage };
