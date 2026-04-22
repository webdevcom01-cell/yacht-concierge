// Home page — Hero (3 layout variants), Services preview, Stats, Map, Testimonial

window.SERVICES = [
  { id: 'berth', num: '01', title: 'Berth Reservations', icon: 'Anchor', desc: 'Priority berth allocation across Porto Montenegro, Herceg Novi, and Bar. Negotiated seasonal rates and dedicated slip-holding.' },
  { id: 'customs', num: '02', title: 'Customs & Immigration', icon: 'Stamp', desc: 'End-to-end clearance for crew and guests. TIP processing, Schengen coordination, and flag-state documentation.' },
  { id: 'provisioning', num: '03', title: 'Provisioning', icon: 'Basket', desc: 'Galley-standard sourcing. Daily market runs, dry stores, wine cellar curation, and specialty imports.' },
  { id: 'laundry', num: '04', title: 'Laundry & Linen', icon: 'Droplet', desc: 'Certified marine laundry. Guest linen, crew uniforms, deck towels — tracked, returned within 24 hours.' },
  { id: 'floristry', num: '05', title: 'Floristry', icon: 'Leaf', desc: 'Arrangements from Tivat growers. Charter-day installations, refreshes, and seasonal standing orders.' },
  { id: 'maintenance', num: '06', title: 'Maintenance Coordination', icon: 'Gear', desc: 'Vetted technicians dispatched to the berth. Electrical, hydraulic, refrigeration, tender service, hull wash.' },
];

// Hero variant A — Editorial split (default)
function HeroEditorial() {
  const { setRoute } = useApp();
  return (
    <section style={{ paddingTop: 140, paddingBottom: 80 }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 1fr', gap: 72, alignItems: 'end' }}>
          <div>
            <Reveal>
              <div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 36, display: 'flex', gap: 24 }}>
                <span>↳ EST. MMXIX</span>
                <span>—</span>
                <span>OPERATIONAL SEASON 2026</span>
              </div>
            </Reveal>
            <Reveal delay={60}>
              <h1 className="serif" style={{ fontSize: 'clamp(56px, 7.4vw, 112px)', lineHeight: 0.92, letterSpacing: '-0.025em' }}>
                Pure logistics.<br/>
                <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>Pure reliability.</em><br/>
                For superyachts<br/>in Montenegro.
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="lede mt-32" style={{ maxWidth: 460 }}>
                Berth, customs, provisioning, laundry, floristry, maintenance —
                coordinated discreetly from a single operational desk in Tivat.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <div style={{ display: 'flex', gap: 16, marginTop: 48 }}>
                <button className="btn btn-primary" onClick={() => setRoute({ page: 'contact' })}>
                  Request Quote <Icons.Arrow size={14} />
                </button>
                <button className="btn btn-ghost" onClick={() => setRoute({ page: 'services' })}>
                  View Services
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
                ↳ MONTENEGRO · EST. MMXIX
              </div>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="serif" style={{ fontSize: 'clamp(48px, 7vw, 104px)', lineHeight: 0.95, letterSpacing: '-0.025em' }}>
                Pure Logistics.<br/>Pure Reliability.
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p style={{ fontSize: 17, color: 'rgba(239,234,226,0.8)', marginTop: 28, fontWeight: 300, maxWidth: 560, marginLeft: 'auto', marginRight: 'auto' }}>
                For superyachts transiting the Adriatic. A single operational desk for berth, customs, provisioning, and ground services.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <div style={{ display: 'flex', gap: 14, marginTop: 48, justifyContent: 'center' }}>
                <button className="btn btn-primary" onClick={() => setRoute({ page: 'contact' })}>Request Quote <Icons.Arrow size={14}/></button>
                <button className="btn btn-ghost" style={{ borderColor: 'rgba(239,234,226,0.4)', color: '#EFEAE2' }} onClick={() => setRoute({ page: 'services' })}>View Services</button>
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
            Pure<br/>
            <span style={{ color: 'var(--accent)', fontStyle: 'italic' }}>logistics</span>.<br/>
            Pure reliability.
          </h1>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, marginTop: 72, alignItems: 'end' }}>
          <Reveal delay={160}>
            <div style={{ width: '100%', aspectRatio: '2/1' }}>
              <HeroVisual />
            </div>
          </Reveal>
          <Reveal delay={240}>
            <div>
              <p className="lede">
                For superyachts transiting Montenegro. Berth, customs, provisioning, and ground services coordinated from a single operational desk in Tivat.
              </p>
              <div style={{ display: 'flex', gap: 14, marginTop: 32 }}>
                <button className="btn btn-primary" onClick={() => setRoute({ page: 'contact' })}>Request Quote <Icons.Arrow size={14}/></button>
                <button className="btn btn-ghost" onClick={() => setRoute({ page: 'services' })}>View Services</button>
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
        <span>FR / 04:18 UTC</span>
      </div>
      <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20, display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--mono)', fontSize: 9.5, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(239,234,226,0.7)' }}>
        <span>SEA: 1.2M</span>
        <span>WIND: 8KT NE</span>
        <span>VIS: 12NM</span>
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
    <div style={{ marginTop: 96, padding: '24px 0', borderTop: '1px solid var(--fg-08)', borderBottom: '1px solid var(--fg-08)' }}>
      <HeroStripInline />
    </div>
  );
}

function HeroStripInline({ light = false }) {
  const items = [
    { label: 'Active Yachts', value: '34' },
    { label: 'Bay of Kotor', value: '42.43°N · 18.76°E' },
    { label: 'Sea Conditions', value: 'Calm / 1.2m' },
    { label: 'Wind', value: '8kt NE' },
    { label: 'Season', value: 'OPEN · APR – OCT' },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${items.length}, 1fr)`, gap: 24 }}>
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
  const cols = serviceDensity === 'dense' ? 'repeat(4, 1fr)' : serviceDensity === 'loose' ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)';
  return (
    <section className="section" style={{ paddingTop: 160 }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 96, marginBottom: 80, alignItems: 'end' }}>
          <div>
            <Reveal>
              <div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 24 }}>
                01 / SERVICES
              </div>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="h2">
                Six disciplines.<br/>
                <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>One desk.</em>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={160}>
            <p className="lede" style={{ textAlign: 'right', marginLeft: 'auto' }}>
              Every request, from a late-arriving provisioning pallet to a hull wash before charter, routes through a single captain-facing coordinator.
            </p>
          </Reveal>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: cols, gap: 0, border: '1px solid var(--fg-08)' }}>
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
                    View protocol <Icons.Arrow size={12}/>
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
function useCountUp(target, duration = 1600, trigger) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let start = null;
    let raf;
    const tick = (ts) => {
      if (!start) start = ts;
      const p = Math.min(1, (ts - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [trigger, target, duration]);
  return val;
}

function StatsBlock() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), { threshold: 0.3 });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const a = useCountUp(312, 1600, visible);
  const b = useCountUp(99.4, 1800, visible);
  const c = useCountUp(18, 1400, visible);
  const d = useCountUp(7, 1200, visible);

  return (
    <section className="section" ref={ref} style={{ paddingTop: 80 }}>
      <div className="container">
        <SectionHeader num="02 / SLA" eyebrow="OPERATIONAL STANDARDS" title={<>Discretion, measured in minutes.</>} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, borderTop: '1px solid var(--fg-08)', borderBottom: '1px solid var(--fg-08)' }}>
          {[
            { n: a, suffix: '', label: 'Yachts served', sub: 'Season 2019 – 2025' },
            { n: b, suffix: '%', label: 'On-time delivery', sub: '24-month rolling avg.', decimals: 1 },
            { n: c, suffix: ' min', label: 'Avg. response', sub: 'Captain → Coordinator' },
            { n: d, suffix: 'd / 24h', label: 'Operating window', sub: 'Apr – Oct, dawn to dusk' },
          ].map((s, i) => (
            <Reveal key={i} delay={i * 80}>
              <div style={{ padding: '56px 32px', borderRight: i < 3 ? '1px solid var(--fg-08)' : 'none' }}>
                <div className="serif" style={{ fontSize: 72, lineHeight: 0.95, letterSpacing: '-0.02em' }}>
                  {s.decimals ? s.n.toFixed(s.decimals) : Math.round(s.n)}<span style={{ fontSize: 28, color: 'var(--fg-50)' }}>{s.suffix}</span>
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

Object.assign(window, { HeroEditorial, HeroCinematic, HeroOversized, ServicesPreview, StatsBlock });
