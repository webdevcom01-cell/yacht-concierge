import React, { useState } from 'react';
import { useApp, Icons, Reveal, SectionHeader } from './shared';
import { SERVICES } from '../data/services';
import { ClosingCTA, CoastMap } from './home-bottom';
import { FleetTierSelector } from './services';
import { submitQuote } from '../lib/submit';

// How It Works page & Contact/Quote multi-step form

function ProcessPage() {
  const { setRoute } = useApp();
  const phases = [
    {
      n: '01', code: 'CONTACT',
      title: 'Intake.',
      lede: 'You arrive. We listen. No form-gated discovery — a voice call with a coordinator who will remain on your file.',
      meta: ['Voice call · 20 min', 'Captain, manager, or owner', 'No NDA required for intake'],
      detail: 'Most relationships begin as a captain forwarding our number. The intake is unhurried: your itinerary, your guest profile, what you are expecting from Montenegro, and where the last port fell short. We don\'t circulate notes — one coordinator holds your file.',
    },
    {
      n: '02', code: 'PLAN',
      title: 'Brief.',
      lede: 'A written service brief, scoped to your stay. Itemised, SLA-anchored, no retainer padding.',
      meta: ['Delivered within 72h', 'Itemised by discipline', 'Rate-card transparency'],
      detail: 'We return a brief that reads like a flight plan: berths proposed, customs approach, provisioning calendar, laundry cadence, standing maintenance, and an operational budget. Each line is signed by the discipline lead who will execute it.',
    },
    {
      n: '03', code: 'EXECUTE',
      title: 'Operate.',
      lede: 'Your coordinator becomes your desk. One number, one email, one person who owns every outcome.',
      meta: ['Dedicated coordinator', '06:00 – 22:00 standard', '24h under Tier III'],
      detail: 'From the moment the yacht enters territorial waters, the file is active. Your coordinator is physically in Tivat, moves between marinas as needed, and is on-call for the duration. Escalation ladders are defined; no request sits in an inbox.',
    },
    {
      n: '04', code: 'REVIEW',
      title: 'Report.',
      lede: 'A post-call operational report, returned to the owner or manager. Lessons captured for next season.',
      meta: ['Delivered 14 days after departure', 'Owner-confidential', 'Archived to your vessel file'],
      detail: 'Every visit is closed with a written report: what was requested, what was delivered, what exceeded or fell short. Your file compounds — by the third season, we have met more of your crew than most of their own colleagues have.',
    },
  ];

  return (
    <main className="page-top">
      <div className="container">
        <div className="grid-2" style={{ gap: 72, alignItems: 'end', marginBottom: 120 }}>
          <div>
            <Reveal><div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 24 }}>↳ OPERATIONAL PROTOCOL</div></Reveal>
            <Reveal delay={80}>
              <h1 className="display">How<br/>it <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>works</em>.</h1>
            </Reveal>
          </div>
          <Reveal delay={160}>
            <p className="lede">
              Four measured phases. One file, one coordinator, one escalation path. The protocol is the same for a four-day stay as for a three-month refit — only the volume differs.
            </p>
          </Reveal>
        </div>

        {/* Timeline */}
        <div style={{ position: 'relative', paddingLeft: 0 }}>
          {phases.map((p, i) => (
            <Reveal key={p.n} delay={i * 80}>
              <div className="grid-timeline-row" style={{ gap: 48, padding: '72px 0', borderTop: '1px solid var(--fg-15)', alignItems: 'start' }}>
                <div>
                  <div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 8 }}>{p.n}</div>
                  <div className="mono" style={{ color: i === 2 ? 'var(--accent)' : 'var(--fg)' }}>{p.code}</div>
                </div>
                <h3 className="serif" style={{ fontSize: 'clamp(40px, 4vw, 56px)', letterSpacing: '-0.02em', lineHeight: 1 }}>
                  {p.title}
                </h3>
                <div>
                  <div className="lede" style={{ marginBottom: 24 }}>{p.lede}</div>
                  <div style={{ fontSize: 13.5, color: 'var(--fg-70)', lineHeight: 1.6 }}>{p.detail}</div>
                </div>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {p.meta.map(m => (
                    <li key={m} className="mono" style={{ color: 'var(--fg-50)', display: 'flex', gap: 10 }}>
                      <span style={{ color: 'var(--accent)' }}>—</span>{m}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Principles */}
        <section className="section">
          <SectionHeader num="↳ PRINCIPLES" eyebrow="THE UNWRITTEN SIDE" title={<>Five rules,<br/>none negotiable.</>}/>
          <div className="grid-5" style={{ gap: 0, border: '1px solid var(--fg-08)' }}>
            {[
              { n: 'I', t: 'One desk.', b: 'Every request routes through your coordinator. Never a switchboard.' },
              { n: 'II', t: 'No mark-up.', b: 'Government fees, berthing, technician labour — passed through at invoice.' },
              { n: 'III', t: 'Silent on-site.', b: 'We operate inside the rhythm of the yacht, not across it.' },
              { n: 'IV', t: 'Documented.', b: 'Every action logged, every parts ledger captured, every report filed.' },
              { n: 'V', t: 'Closed file.', b: 'Your stay lives in an encrypted record. Nothing leaves.' },
            ].map((r, i) => (
              <Reveal key={r.n} delay={i * 80}>
                <div style={{ padding: 32, borderRight: i < 4 ? '1px solid var(--fg-08)' : 'none', minHeight: 260, display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div className="serif" style={{ fontSize: 48, color: 'var(--accent)', fontStyle: 'italic' }}>{r.n}</div>
                  <div className="serif" style={{ fontSize: 24, letterSpacing: '-0.01em' }}>{r.t}</div>
                  <div style={{ fontSize: 13, color: 'var(--fg-70)' }}>{r.b}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      </div>
      <ClosingCTA/>
    </main>
  );
}

// ---------- Contact / Quote multi-step ----------
function ContactPage() {
  const [step, setStep] = useState(0);
  const [refNum] = useState(() => {
    const now = new Date();
    const date = `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}`;
    const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
    return `YC-${date}-${rand}`;
  });
  const [data, setData] = useState({
    name: '', role: 'captain', yacht: '', loa: '', flag: '',
    eta: '', etd: '', port: 'Porto Montenegro',
    services: [], notes: '',
    email: '', phone: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const update = (k, v) => setData(d => ({ ...d, [k]: v }));
  const toggleService = (id) => setData(d => ({ ...d, services: d.services.includes(id) ? d.services.filter(s => s !== id) : [...d.services, id] }));

  const steps = ['Identity', 'Vessel', 'Visit', 'Services', 'Contact', 'Submitted'];

  const canProceed = () => {
    if (step === 0) return data.name.trim();
    if (step === 1) return data.yacht.trim() && data.loa;
    if (step === 2) return data.eta && data.port;
    if (step === 3) return data.services.length > 0;
    if (step === 4) return data.email.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
    return true;
  };

  return (
    <main className="page-top" style={{ minHeight: '100vh' }}>
      <div className="container">
        <div className="grid-contact" style={{ gap: 96, alignItems: 'start' }}>
          {/* Left: context */}
          <div className="contact-sticky" style={{ position: 'sticky', top: 140 }}>
            <Reveal><div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 24 }}>↳ REQUEST QUOTE</div></Reveal>
            <Reveal delay={80}>
              <h1 className="display">Submit<br/>your <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>brief</em>.</h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="lede mt-32">
                Five short steps. No sales call. We return a scoped service brief within four operational hours, signed by the coordinator who will hold your file.
              </p>
            </Reveal>
            <div className="mt-48">
              <div className="rule mb-24"/>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {[
                  { icon: 'Phone', label: '+382 67 144 555', sub: 'Operational desk · 24h in season' },
                  { icon: 'Mail', label: 'info@yacht-concierge.me', sub: 'Encrypted channel available on request' },
                  { icon: 'Pin', label: 'Pomorska ulica, Zgrada Baia', sub: 'Porto Montenegro · Tivat 85320' },
                ].map(c => {
                  const IconC = Icons[c.icon];
                  return (
                    <div key={c.label} style={{ display: 'flex', gap: 16, alignItems: 'start' }}>
                      <IconC size={16} stroke={1}/>
                      <div>
                        <div style={{ fontSize: 14 }}>{c.label}</div>
                        <div className="mono" style={{ color: 'var(--fg-50)', marginTop: 4 }}>{c.sub}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: form */}
          <div style={{ border: '1px solid var(--fg-15)', padding: 56, background: 'var(--bg-raised)' }}>
            {/* Step indicator */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 48 }}>
              {steps.slice(0, 5).map((s, i) => (
                <div key={s} style={{ flex: 1 }}>
                  <div style={{ height: 2, background: i <= step ? 'var(--accent)' : 'var(--fg-15)', transition: 'background 0.4s var(--ease)' }}/>
                  <div className="mono" style={{ marginTop: 10, fontSize: 9.5, color: i === step ? 'var(--fg)' : 'var(--fg-50)' }}>
                    {String(i + 1).padStart(2, '0')} · {s}
                  </div>
                </div>
              ))}
            </div>

            {step < 5 && (
              <div key={step} className="reveal in">
                {step === 0 && (
                  <StepWrap title="Who are we speaking with?" sub="Your name and role. We keep this file confidential.">
                    <div className="grid-2" style={{ gap: 32 }}>
                      <div className="field">
                        <label className="field-label">Full name</label>
                        <input className="field-input" value={data.name} onChange={e => update('name', e.target.value)} placeholder="Eleanor Vance"/>
                      </div>
                      <div className="field">
                        <label className="field-label">Role</label>
                        <select className="field-select" value={data.role} onChange={e => update('role', e.target.value)}>
                          <option value="captain">Captain</option>
                          <option value="manager">Management Company</option>
                          <option value="owner">Owner / Representative</option>
                          <option value="broker">Charter Broker</option>
                        </select>
                      </div>
                    </div>
                  </StepWrap>
                )}
                {step === 1 && (
                  <StepWrap title="Tell us about the vessel." sub="Details stay within our encrypted file.">
                    <div className="grid-contact-vessel" style={{ gap: 32 }}>
                      <div className="field">
                        <label className="field-label">Vessel name</label>
                        <input className="field-input" value={data.yacht} onChange={e => update('yacht', e.target.value)} placeholder="M/Y Atlas"/>
                      </div>
                      <div className="field">
                        <label className="field-label">LOA (m)</label>
                        <input className="field-input" type="number" value={data.loa} onChange={e => update('loa', e.target.value)} placeholder="73"/>
                      </div>
                      <div className="field">
                        <label className="field-label">Flag</label>
                        <input className="field-input" value={data.flag} onChange={e => update('flag', e.target.value)} placeholder="Cayman Is."/>
                      </div>
                    </div>
                  </StepWrap>
                )}
                {step === 2 && (
                  <StepWrap title="When and where?" sub="Port call details. Adjustments accepted up to 48h before arrival.">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 32 }}>
                      <div className="field">
                        <label className="field-label">ETA</label>
                        <input className="field-input" type="date" value={data.eta} onChange={e => update('eta', e.target.value)}/>
                      </div>
                      <div className="field">
                        <label className="field-label">ETD</label>
                        <input className="field-input" type="date" value={data.etd} onChange={e => update('etd', e.target.value)}/>
                      </div>
                    </div>
                    <div className="field">
                      <label className="field-label">Port of call</label>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                        {['Porto Montenegro', 'Herceg Novi', 'Kotor', 'Budva', 'Bar', 'TBD'].map(p => (
                          <button key={p} onClick={() => update('port', p)}
                            style={{
                              padding: '10px 18px',
                              border: `1px solid ${data.port === p ? 'var(--fg)' : 'var(--fg-15)'}`,
                              background: data.port === p ? 'var(--fg)' : 'transparent',
                              color: data.port === p ? 'var(--bg)' : 'var(--fg)',
                              fontFamily: 'var(--mono)',
                              fontSize: 10,
                              letterSpacing: '0.18em',
                              textTransform: 'uppercase',
                              cursor: 'pointer',
                              transition: 'all 0.3s var(--ease)',
                            }}
                          >{p}</button>
                        ))}
                      </div>
                    </div>
                  </StepWrap>
                )}
                {step === 3 && (
                  <StepWrap title="Which disciplines?" sub="Select any number. Coordinator will scope each.">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, border: '1px solid var(--fg-15)' }}>
                      {SERVICES.map((s, i) => {
                        const IconC = Icons[s.icon];
                        const on = data.services.includes(s.id);
                        return (
                          <div key={s.id}
                            onClick={() => toggleService(s.id)}
                            style={{
                              padding: 24,
                              cursor: 'pointer',
                              borderRight: i % 2 === 0 ? '1px solid var(--fg-15)' : 'none',
                              borderBottom: i < SERVICES.length - 2 ? '1px solid var(--fg-15)' : 'none',
                              background: on ? 'var(--accent-soft)' : 'transparent',
                              display: 'flex',
                              gap: 16,
                              alignItems: 'start',
                              transition: 'background 0.3s var(--ease)',
                            }}
                          >
                            <div style={{ width: 16, height: 16, border: `1px solid ${on ? 'var(--accent)' : 'var(--fg-30)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 2 }}>
                              {on && <Icons.Check size={10} stroke={2}/>}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                <span className="mono" style={{ color: 'var(--fg-50)' }}>{s.num}</span>
                                <IconC size={18} stroke={0.9}/>
                              </div>
                              <div className="serif" style={{ fontSize: 20, marginTop: 8 }}>{s.title}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="field mt-32">
                      <label className="field-label">Additional notes (optional)</label>
                      <textarea className="field-textarea" value={data.notes} onChange={e => update('notes', e.target.value)} placeholder="Guest dietary notes, A/V issues, arrival protocol, anything else."/>
                    </div>
                  </StepWrap>
                )}
                {step === 4 && (
                  <StepWrap title="How should we reach you?" sub="Encrypted channels available on request.">
                    <div className="grid-2" style={{ gap: 32 }}>
                      <div className="field">
                        <label className="field-label">Email</label>
                        <input className="field-input" type="email" value={data.email} onChange={e => update('email', e.target.value)} placeholder="captain@atlas.example"/>
                      </div>
                      <div className="field">
                        <label className="field-label">Phone (optional)</label>
                        <input className="field-input" value={data.phone} onChange={e => update('phone', e.target.value)} placeholder="+44 7700 900 000"/>
                      </div>
                    </div>
                    <div style={{ marginTop: 48, padding: 24, background: 'var(--bg-warm)', border: '1px solid var(--fg-08)' }}>
                      <div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 12 }}>BRIEF SUMMARY</div>
                      <div style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--fg-70)' }}>
                        <strong style={{ color: 'var(--fg)' }}>{data.yacht || '—'}</strong>{data.loa && ` · ${data.loa}m`}{data.flag && ` · ${data.flag}`} arriving <strong style={{ color: 'var(--fg)' }}>{data.port}</strong> on <strong style={{ color: 'var(--fg)' }}>{data.eta || '—'}</strong>{data.etd && ` until ${data.etd}`}. Requesting <strong style={{ color: 'var(--fg)' }}>{data.services.length}</strong> {data.services.length === 1 ? 'service' : 'services'}.
                      </div>
                    </div>
                  </StepWrap>
                )}
              </div>
            )}

            {step === 5 && (
              <div style={{ padding: '64px 0', textAlign: 'center' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 72, height: 72, border: '1px solid var(--accent)', color: 'var(--accent)', marginBottom: 40, borderRadius: '50%' }}>
                  <Icons.Check size={28} stroke={1.2}/>
                </div>
                <h2 className="serif" style={{ fontSize: 48, letterSpacing: '-0.02em', marginBottom: 20 }}>Brief received.</h2>
                <p className="lede" style={{ margin: '0 auto', maxWidth: 440 }}>
                  Reference №{refNum}. A coordinator will return a scoped service brief within four operational hours.
                </p>
                <div className="mono mt-48" style={{ color: 'var(--fg-50)' }}>
                  ↳ RESPONSE WITHIN 4 OPERATIONAL HOURS · 06:00 – 22:00 CET
                </div>
              </div>
            )}

            {step < 5 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 48, paddingTop: 32, borderTop: '1px solid var(--fg-15)' }}>
                <button className="btn btn-ghost" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} style={{ opacity: step === 0 ? 0.3 : 1 }}>
                  ← Back
                </button>
                <button
                  className="btn btn-primary"
                  onClick={async () => {
                    if (!canProceed()) return;
                    if (step < 4) { setStep(step + 1); return; }
                    setSubmitting(true);
                    setSubmitError('');
                    try {
                      await submitQuote(data, refNum);
                      setStep(5);
                    } catch {
                      setSubmitError('Submission failed — please email info@yacht-concierge.me');
                    } finally {
                      setSubmitting(false);
                    }
                  }}
                  disabled={submitting}
                  style={{ opacity: canProceed() && !submitting ? 1 : 0.4, pointerEvents: canProceed() && !submitting ? 'auto' : 'none' }}
                >
                  {submitting ? 'Sending...' : step === 4 ? 'Submit Brief' : 'Continue'} <Icons.Arrow size={14}/>
                </button>
                {submitError && (
                  <div className="mono" style={{ color: '#c0392b', marginTop: 12, fontSize: 10.5, letterSpacing: '0.12em' }}>
                    ↳ {submitError}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function StepWrap({ title, sub, children }) {
  return (
    <div>
      <div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 16 }}>↳ REQUIRED INFORMATION</div>
      <h2 className="serif" style={{ fontSize: 36, letterSpacing: '-0.01em', marginBottom: 12 }}>{title}</h2>
      <p style={{ color: 'var(--fg-70)', fontSize: 14, marginBottom: 48, maxWidth: '54ch' }}>{sub}</p>
      {children}
    </div>
  );
}

// ---------- Berths / Fleet page (simple) ----------
function FleetPage() {
  return (
    <main className="page-top">
      <div className="container">
        <div className="grid-2" style={{ gap: 72, alignItems: 'end', marginBottom: 96 }}>
          <div>
            <Reveal><div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 24 }}>↳ OPERATIONAL FOOTPRINT</div></Reveal>
            <Reveal delay={80}>
              <h1 className="display">Berths<br/>& <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>conditions</em>.</h1>
            </Reveal>
          </div>
          <Reveal delay={160}>
            <p className="lede">
              Our operational footprint spans five marinas along the Montenegrin coast. Contact us directly for current berth availability and seasonal rates.
            </p>
          </Reveal>
        </div>
      </div>
      <CoastMap/>
      <div className="container">
        <FleetTierSelector/>
      </div>
      <ClosingCTA/>
    </main>
  );
}

// ---------- About page ----------
function AboutPage() {
  const { setRoute } = useApp();

  const stats = [
    { value: '9+',  label: 'Seasons operating' },
    { value: '450+', label: 'Vessels served' },
    { value: '5',   label: 'Montenegrin marinas' },
    { value: '1',   label: 'Dedicated desk' },
  ];

  const team = [
    {
      name:  'Sanja Božović',
      title: 'Founder & CEO',
      bio:   'Founded Montenegro Charter in 2015 after a decade on the water as a charter captain. Built Yacht Concierge to solve the shore-side gaps she kept encountering — paperwork, provisioning, and the absence of anyone who stayed on a problem until it was resolved.',
      phone: '38267201655',
      wa:    'Hello Sanja, I would like to enquire about your yacht concierge services in Montenegro.',
    },
    {
      name:  'Iva Erceg',
      title: 'Operations Director',
      bio:   'Manages real-time logistics across all active vessel files. Former charter coordinator with direct experience in Montenegrin port authority and customs workflows. When the marina office opens at 07:00, Iva is already there.',
      phone: '38267144555',
      wa:    "Hello, I'd like to enquire about yacht concierge services in Montenegro.",
    },
  ];

  return (
    <main className="page-top">
      <div className="container">

        {/* Hero */}
        <div className="grid-2" style={{ gap: 72, alignItems: 'end', marginBottom: 120 }}>
          <div>
            <Reveal>
              <div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 24 }}>↳ ABOUT</div>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="display">
                The desk behind<br/>
                <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>seamless arrivals</em>.
              </h1>
            </Reveal>
          </div>
          <Reveal delay={160}>
            <p className="lede">
              Yacht Concierge is the operational arm of Montenegro Charter — the Adriatic's longest-running charter operator. Nine seasons of shore-side experience, one dedicated desk for your vessel.
            </p>
          </Reveal>
        </div>

        {/* Story */}
        <Reveal>
          <div style={{
            borderTop: '1px solid var(--border)',
            paddingTop: 80,
            marginBottom: 80,
            display: 'grid',
            gridTemplateColumns: '1fr 2fr',
            gap: 64,
          }}>
            <div>
              <div className="mono" style={{ color: 'var(--fg-50)', fontSize: 11, letterSpacing: '0.12em' }}>
                OUR STORY
              </div>
            </div>
            <div>
              <p style={{ fontSize: 18, lineHeight: 1.75, color: 'var(--fg-80)', marginBottom: 28 }}>
                Montenegro Charter was founded in 2015 to bring honest, experienced hands to one of Europe's most underserved sailing grounds. Over nine seasons we built the relationships that make the difference: with port captains, customs offices, provisioning suppliers, and the crews who return year after year.
              </p>
              <p style={{ fontSize: 18, lineHeight: 1.75, color: 'var(--fg-80)', marginBottom: 28 }}>
                Yacht Concierge grew from a straightforward observation: superyacht captains needed someone on the dock who understood the water they came from — not just the regulations of the port they'd arrived at. We created a dedicated operations desk staffed by people who have worked both sides of the gangway.
              </p>
              <p style={{ fontSize: 18, lineHeight: 1.75, color: 'var(--fg-80)', marginBottom: 40 }}>
                Today we handle berth reservations, customs and immigration clearance, provisioning, crew logistics, laundry, floristry, and maintenance coordination for vessels from 30 to 120 metres — across five marinas along the Montenegrin coast.
              </p>
              <a
                href="https://montenegrocharter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}
              >
                Visit Montenegro Charter
                <Icons.Arrow size={15}/>
              </a>
            </div>
          </div>
        </Reveal>

        {/* Stats */}
        <Reveal>
          <div style={{
            background: 'var(--surface)',
            borderRadius: 4,
            padding: '64px 72px',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 0,
            marginBottom: 80,
          }}>
            {stats.map((s, i) => (
              <div key={i} style={{
                textAlign: 'center',
                borderLeft: i > 0 ? '1px solid var(--border)' : 'none',
                padding: '0 32px',
              }}>
                <div style={{
                  fontSize: 52,
                  fontFamily: 'var(--serif)',
                  fontWeight: 300,
                  color: 'var(--accent)',
                  lineHeight: 1,
                  marginBottom: 12,
                }}>
                  {s.value}
                </div>
                <div className="mono" style={{ fontSize: 11, color: 'var(--fg-50)', letterSpacing: '0.1em' }}>
                  {s.label.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Pull quote */}
        <Reveal>
          <div style={{
            borderLeft: '3px solid var(--accent)',
            paddingLeft: 40,
            marginBottom: 100,
            maxWidth: 680,
          }}>
            <p style={{
              fontSize: 24,
              fontFamily: 'var(--serif)',
              fontStyle: 'italic',
              lineHeight: 1.6,
              color: 'var(--fg)',
              marginBottom: 20,
            }}>
              "We built the kind of service we wanted when we were on the water ourselves — direct, accountable, and with no surprises in the invoice."
            </p>
            <div className="mono" style={{ fontSize: 11, color: 'var(--fg-50)', letterSpacing: '0.1em' }}>
              SANJA BOŽOVIĆ — FOUNDER & CEO
            </div>
          </div>
        </Reveal>

        {/* Team */}
        <SectionHeader
          tag="THE TEAM"
          title={<>The people<br/>on <em>your file</em>.</>}
          sub="Two leads. One file. Every request answered by someone with the authority to resolve it."
        />

        <div className="grid-2" style={{ gap: 40, marginBottom: 100, marginTop: 56 }}>
          {team.map((m, i) => (
            <Reveal key={i} delay={i * 100}>
              <div style={{
                background: 'var(--surface)',
                borderRadius: 4,
                padding: '48px 44px',
                display: 'flex',
                flexDirection: 'column',
                gap: 0,
                height: '100%',
              }}>
                <div className="mono" style={{ fontSize: 11, color: 'var(--accent)', letterSpacing: '0.12em', marginBottom: 8 }}>
                  {m.title.toUpperCase()}
                </div>
                <h3 style={{
                  fontFamily: 'var(--serif)',
                  fontSize: 28,
                  fontWeight: 400,
                  color: 'var(--fg)',
                  marginBottom: 20,
                  lineHeight: 1.2,
                }}>
                  {m.name}
                </h3>
                <p style={{
                  fontSize: 15,
                  lineHeight: 1.75,
                  color: 'var(--fg-60)',
                  flexGrow: 1,
                  marginBottom: 32,
                }}>
                  {m.bio}
                </p>
                <a
                  href={`https://wa.me/${m.phone}?text=${encodeURIComponent(m.wa)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 10,
                    color: '#25D366',
                    fontSize: 13,
                    fontWeight: 500,
                    letterSpacing: '0.05em',
                    textDecoration: 'none',
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#25D366">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp {m.name.split(' ')[0]}
                </a>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Values strip */}
        <Reveal>
          <div style={{
            borderTop: '1px solid var(--border)',
            borderBottom: '1px solid var(--border)',
            padding: '56px 0',
            marginBottom: 100,
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 0,
          }}>
            {[
              { label: 'Accountability', text: 'One coordinator owns your file, start to finish. No handoffs, no gaps in the chain.' },
              { label: 'Transparency',   text: 'Itemised invoicing, rate-card pricing. You know the cost before we move.' },
              { label: 'Presence',       text: 'We are physically in Tivat. When you need someone at the marina, they are already there.' },
            ].map((v, i) => (
              <div key={i} style={{
                padding: '0 48px',
                borderLeft: i > 0 ? '1px solid var(--border)' : 'none',
              }}>
                <div className="mono" style={{ fontSize: 11, color: 'var(--accent)', letterSpacing: '0.12em', marginBottom: 16 }}>
                  {v.label.toUpperCase()}
                </div>
                <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--fg-60)' }}>{v.text}</p>
              </div>
            ))}
          </div>
        </Reveal>

      </div>

      <ClosingCTA/>
    </main>
  );
}

// ── 404 Not Found ─────────────────────────────────────────────────────────────

function NotFoundPage() {
  const { setRoute } = useApp();
  return (
    <main className="page-top">
      <div className="container" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
        <div style={{ maxWidth: 560 }}>
          <Reveal>
            <div className="mono" style={{ color: 'var(--accent)', marginBottom: 24, fontSize: 12, letterSpacing: '0.12em' }}>
              ↳ ERROR 404
            </div>
          </Reveal>
          <Reveal delay={60}>
            <h1 className="display" style={{ marginBottom: 32 }}>
              Page not<br/><em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>found</em>.
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p style={{ fontSize: 18, lineHeight: 1.75, color: 'var(--fg-70)', marginBottom: 48 }}>
              The page you're looking for doesn't exist or has moved.
              If you followed a link, it may be outdated.
            </p>
          </Reveal>
          <Reveal delay={180}>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <button
                onClick={() => setRoute({ page: 'home' })}
                className="btn btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}
              >
                Return home
                <Icons.Arrow size={15}/>
              </button>
              <button
                onClick={() => setRoute({ page: 'contact' })}
                className="btn btn-outline"
              >
                Contact us
              </button>
            </div>
          </Reveal>
        </div>
      </div>
    </main>
  );
}

export { ProcessPage, ContactPage, FleetPage, AboutPage, NotFoundPage };
