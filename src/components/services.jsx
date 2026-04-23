import React, { useState } from 'react';
import { useApp, Icons, Reveal, SectionHeader } from './shared';
import { SERVICES } from '../data/services';
import { ClosingCTA } from './home-bottom';

// Services index page & Service detail page

function ServicesPage() {
  const { setRoute } = useApp();
  return (
    <main className="page-top">
      <div className="container">
        <div className="grid-2" style={{ gap: 72, alignItems: 'end', marginBottom: 96 }}>
          <div>
            <Reveal><div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 24 }}>↳ SERVICES INDEX</div></Reveal>
            <Reveal delay={80}>
              <h1 className="display">
                Operational<br/>
                <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>disciplines.</em>
              </h1>
            </Reveal>
          </div>
          <Reveal delay={160}>
            <p className="lede" style={{ marginLeft: 'auto' }}>
              Six services coordinated from a single desk in Tivat. Each carries a documented protocol, a named coordinator, and a measured SLA. Select any discipline for the full brief.
            </p>
          </Reveal>
        </div>

        <div style={{ borderTop: '1px solid var(--fg-15)' }}>
          {SERVICES.map((s, i) => {
            const IconC = Icons[s.icon];
            return (
              <Reveal key={s.id} delay={i * 60}>
                <div
                  onClick={() => setRoute({ page: 'service', id: s.id })}
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
                  <div className="serif" style={{ fontSize: 28, letterSpacing: '-0.01em', lineHeight: 1.1 }}>{s.title}</div>
                  <div style={{ fontSize: 14, color: 'var(--fg-70)', lineHeight: 1.6, paddingLeft: 0 }}>{s.desc}</div>
                  <div className="mono" style={{ textAlign: 'right', color: 'var(--accent)', display: 'flex', gap: 10, justifyContent: 'flex-end', alignItems: 'center' }}>
                    OPEN <Icons.Arrow size={12}/>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <div style={{ marginTop: 96 }}>
          <FleetTierSelector/>
        </div>
      </div>
      <ClosingCTA/>
    </main>
  );
}

// ---------- Fleet Tier Selector ----------
function FleetTierSelector() {
  const [loa, setLoa] = useState(60);
  const tier =
    loa < 40 ? { name: 'Tier I — Intimate', range: '24 – 40m LOA', price: 'On request', desc: 'Single-coordinator coverage, daylight hours, up to 5 discipline requests per visit.' } :
    loa < 70 ? { name: 'Tier II — Standard', range: '40 – 70m LOA', price: 'On request', desc: 'Dedicated coordinator, 06:00–22:00 coverage, unlimited requests, provisioning concierge.' } :
               { name: 'Tier III — Flag', range: '70m+ LOA', price: 'Bespoke', desc: 'Named operations officer, 24h coverage, advance-team deployment, customs expediting, tender crew sourcing.' };

  return (
    <div style={{ padding: 48, border: '1px solid var(--fg-15)', background: 'var(--bg-raised)' }}>
      <div className="grid-fleet-calc" style={{ gap: 72, alignItems: 'center' }}>
        <div>
          <div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 20 }}>FLEET CALCULATOR</div>
          <h3 className="serif" style={{ fontSize: 44, lineHeight: 1.05, letterSpacing: '-0.01em' }}>
            Select by <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>length overall</em>.
          </h3>
          <p style={{ fontSize: 13.5, color: 'var(--fg-70)', marginTop: 20, maxWidth: '36ch' }}>
            Service tier is determined by LOA. Slide to match your vessel.
          </p>
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
            <span className="mono" style={{ color: 'var(--fg-50)' }}>24m</span>
            <div className="serif" style={{ fontSize: 48, lineHeight: 1, letterSpacing: '-0.02em' }}>{loa}<span style={{ fontSize: 20, color: 'var(--fg-50)', marginLeft: 4 }}>m</span></div>
            <span className="mono" style={{ color: 'var(--fg-50)' }}>120m</span>
          </div>
          <input
            type="range"
            min="24"
            max="120"
            value={loa}
            onChange={e => setLoa(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--accent)' }}
          />
          <div className="rule mt-32"/>
          <div style={{ marginTop: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 32 }}>
            <div>
              <div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 8 }}>RECOMMENDED</div>
              <div className="serif" style={{ fontSize: 24 }}>{tier.name}</div>
              <div style={{ fontSize: 13, color: 'var(--fg-70)', marginTop: 4 }}>{tier.range}</div>
              <div style={{ fontSize: 13, color: 'var(--fg-70)', marginTop: 16, maxWidth: '40ch' }}>{tier.desc}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 8 }}>PRICING</div>
              <div className="serif" style={{ fontSize: 40, letterSpacing: '-0.02em' }}>{tier.price}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Service detail ----------
const SERVICE_DETAIL = {
  berth: {
    coverage: 'Porto Montenegro · Herceg Novi · Kotor · Budva · Bar',
    sla: 'Confirmation within 90 minutes of request',
    deliverables: ['Priority slot allocation', 'Concessioned seasonal holds', 'Shore-power & freshwater hook-up', 'Security liaison'],
    protocol: [
      { n: '01', step: 'INTAKE', body: 'Captain or manager provides ETA, LOA, beam, draft, call sign, flag state, intended stay length.' },
      { n: '02', step: 'MATCH', body: 'Coordinator confirms slot across our marina network based on current availability and historical berth preferences.' },
      { n: '03', step: 'HOLD', body: 'Slot secured, confirmation issued with berth number, hook-up particulars, and arrival coordinates.' },
      { n: '04', step: 'RECEIVE', body: 'Shore team present at berth on ETA. Lines, power, water, provisioning staging all handled.' },
    ],
    rateNote: 'Berth costs billed at marina list rate, no mark-up. Service fee per night, LOA-dependent.',
  },
  customs: {
    coverage: 'Montenegrin Ministry of Interior · Schengen adjacency',
    sla: 'Cleared on arrival, average 22 minutes',
    deliverables: ['TIP (Temporary Import Permit)', 'Crew list processing', 'Provisions manifest', 'Flag-state liaison'],
    protocol: [
      { n: '01', step: 'PRE-FILE', body: '48 hours pre-arrival, documentation is pre-submitted to Port Authority and Customs. Any flags raised are resolved before the yacht is within territorial waters.' },
      { n: '02', step: 'BOARD', body: 'Licensed clearing agent boards on arrival, typically anchored off the quay. Papers reviewed, stamps issued.' },
      { n: '03', step: 'ISSUE', body: 'TIP issued, crew list endorsed, stores manifest filed. Captain receives originals and digital copies.' },
      { n: '04', step: 'MONITOR', body: 'Agent on-call for the duration of stay. Crew changes, stores replenishment, flag changes handled without re-intake.' },
    ],
    rateNote: 'Government fees at invoice. Service fee fixed per clearance event.',
  },
  provisioning: {
    coverage: 'Tivat, Kotor, Budva markets · Adriatic fishing fleet · European specialty',
    sla: 'Same-day for items sourced locally; 48h for imports',
    deliverables: ['Daily galley orders', 'Dry-store stocking', 'Wine cellar curation', 'Charter-day fresh'],
    protocol: [
      { n: '01', step: 'LIST', body: 'Chef or purser submits order via encrypted portal. Any substitution preferences noted and retained across visits.' },
      { n: '02', step: 'SOURCE', body: 'Fresh sourced at dawn from local markets. Proteins from the Adriatic fleet. Specialty imports routed via Dubrovnik or Bari.' },
      { n: '03', step: 'STAGE', body: 'Cold-chain maintained from source. Provisioning staged at shore base, quality-checked by coordinator before transfer.' },
      { n: '04', step: 'DELIVER', body: 'Berth-side handoff to galley, typically in the two-hour window before service.' },
    ],
    rateNote: 'Produce at market rate, fully receipted. Coordination fee is a flat percentage of the invoice.',
  },
  laundry: {
    coverage: 'On-site laundry partners in Tivat and Budva · MLC 2006 compliant',
    sla: 'Collected before 10:00 returned before 10:00 next day',
    deliverables: ['Guest linen & towelling', 'Crew uniforms', 'Deck towelling', 'Dry cleaning & pressing'],
    protocol: [
      { n: '01', step: 'COLLECT', body: 'Berth-side collection with barcoded bags, logged against your vessel record.' },
      { n: '02', step: 'PROCESS', body: 'Handled at marine-certified facility. Water hardness and detergent matched to your spec if given.' },
      { n: '03', step: 'QC', body: 'Each bag hand-inspected on return. Any replacement items sourced before delivery.' },
      { n: '04', step: 'RETURN', body: 'Returned folded or hanging to your preference, with a reconciliation slip against the original manifest.' },
    ],
    rateNote: 'Billed per kg for linen, per item for uniforms and pressing. Volume tiers for stays over seven nights.',
  },
  floristry: {
    coverage: 'Tivat growers · seasonal bloom calendar · European imports on 72h',
    sla: 'Arrangements in place by 14:00 on charter-start day',
    deliverables: ['Welcome arrangements', 'Mid-charter refresh', 'Event installations', 'Standing orders'],
    protocol: [
      { n: '01', step: 'BRIEF', body: 'Tone, palette, and any charter-specific notes. We retain preferences between visits.' },
      { n: '02', step: 'SOURCE', body: 'Fresh cut from local growers on the morning of installation, or flown in for out-of-season requests.' },
      { n: '03', step: 'INSTALL', body: 'On-board installation by our florist, using vessel-owned vases or ours. Discreet, usually within two hours.' },
      { n: '04', step: 'REFRESH', body: 'Mid-stay refresh or full redo scheduled in advance, executed during a scheduled off-vessel window.' },
    ],
    rateNote: 'Priced per arrangement, with tier pricing for full-vessel specifications.',
  },
  maintenance: {
    coverage: 'Electrical, hydraulics, refrigeration, A/V, hull wash, tender service',
    sla: 'Vetted technician at berth within 4 working hours',
    deliverables: ['Diagnostics', 'Parts sourcing', 'On-board work supervision', 'Sea-trial coordination'],
    protocol: [
      { n: '01', step: 'REPORT', body: 'Engineer or captain describes the fault. Where possible, a diagnostic is run on our in-house systems before dispatch.' },
      { n: '02', step: 'DISPATCH', body: 'The right specialist, not the nearest. We maintain a vetted network of technicians across the Montenegrin coast.' },
      { n: '03', step: 'SUPERVISE', body: 'Our coordinator is present for the visit. Notes are kept, parts reconciled, warranty captured.' },
      { n: '04', step: 'DOCUMENT', body: 'Work report filed to the vessel log, with photographs and a parts ledger. Nothing left undocumented.' },
    ],
    rateNote: 'Labour at technician rate, full pass-through with ledger. Coordination fee per dispatch.',
  },
};

function ServiceDetailPage({ id }) {
  const { setRoute } = useApp();
  const s = SERVICES.find(x => x.id === id) || SERVICES[0];
  const detail = SERVICE_DETAIL[s.id];
  const IconC = Icons[s.icon];
  const otherServices = SERVICES.filter(x => x.id !== s.id);

  return (
    <main className="page-top">
      <div className="container">
        <Reveal>
          <a className="mono" onClick={() => setRoute({ page: 'services' })} style={{ display: 'inline-flex', gap: 10, color: 'var(--fg-70)', cursor: 'pointer', marginBottom: 64 }}>
            ← ALL SERVICES
          </a>
        </Reveal>

        <div className="grid-fleet-calc" style={{ gap: 96, marginBottom: 96, alignItems: 'end' }}>
          <div>
            <Reveal>
              <div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 20 }}>{s.num} / SERVICE BRIEF</div>
            </Reveal>
            <Reveal delay={80}>
              <div style={{ marginBottom: 32 }}><IconC size={48} stroke={0.8}/></div>
            </Reveal>
            <Reveal delay={160}>
              <h1 className="display" style={{ fontSize: 'clamp(48px, 6vw, 88px)' }}>{s.title}</h1>
            </Reveal>
          </div>
          <Reveal delay={240}>
            <p className="lede">{s.desc}</p>
          </Reveal>
        </div>

        {/* Coverage / SLA strip */}
        <Reveal>
          <div className="grid-3" style={{ borderTop: '1px solid var(--fg-15)', borderBottom: '1px solid var(--fg-15)', marginBottom: 96 }}>
            <div style={{ padding: '32px 0', paddingRight: 32, borderRight: '1px solid var(--fg-15)' }}>
              <div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 12 }}>COVERAGE</div>
              <div style={{ fontSize: 16, fontFamily: 'var(--serif)' }}>{detail.coverage}</div>
            </div>
            <div style={{ padding: '32px 0', paddingLeft: 32, paddingRight: 32, borderRight: '1px solid var(--fg-15)' }}>
              <div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 12 }}>SLA</div>
              <div style={{ fontSize: 16, fontFamily: 'var(--serif)' }}>{detail.sla}</div>
            </div>
            <div style={{ padding: '32px 0', paddingLeft: 32 }}>
              <div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 12 }}>DELIVERABLES</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {detail.deliverables.map(d => <li key={d} style={{ fontSize: 14, color: 'var(--fg-70)' }}>— {d}</li>)}
              </ul>
            </div>
          </div>
        </Reveal>

        {/* Protocol */}
        <div style={{ marginBottom: 96 }}>
          <Reveal>
            <div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 24 }}>PROTOCOL</div>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="h2" style={{ marginBottom: 64 }}>How this service is delivered.</h2>
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
            <div className="mono" style={{ color: 'var(--accent)', whiteSpace: 'nowrap', paddingTop: 4 }}>¶ RATES</div>
            <div style={{ fontSize: 17, fontFamily: 'var(--serif)', lineHeight: 1.5 }}>{detail.rateNote}</div>
          </div>
        </Reveal>

        {/* Cross-sell */}
        <div style={{ marginBottom: 96 }}>
          <Reveal>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 48 }}>
              <h3 className="serif" style={{ fontSize: 32 }}>Adjacent services.</h3>
              <span className="mono" style={{ color: 'var(--fg-50)' }}>05 / RELATED</span>
            </div>
          </Reveal>
          <div className="grid-5" style={{ gap: 0, border: '1px solid var(--fg-08)' }}>
            {otherServices.map((o, i) => {
              const OIcon = Icons[o.icon];
              return (
                <div key={o.id} onClick={() => setRoute({ page: 'service', id: o.id })}
                  style={{ padding: 28, cursor: 'pointer', borderRight: i < otherServices.length - 1 ? '1px solid var(--fg-08)' : 'none', display: 'flex', flexDirection: 'column', gap: 16, transition: 'background 0.3s var(--ease)' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-warm)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div className="mono" style={{ color: 'var(--fg-50)' }}>{o.num}</div>
                  <OIcon size={22} stroke={1}/>
                  <div className="serif" style={{ fontSize: 20 }}>{o.title}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <ClosingCTA/>
    </main>
  );
}

export { ServicesPage, ServiceDetailPage, FleetTierSelector };
