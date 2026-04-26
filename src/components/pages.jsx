import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp, Icons, Reveal, SectionHeader } from './shared';
import { SERVICES } from '../data/services';
import { ClosingCTA, CoastMap } from './home-bottom';
import { FleetTierSelector } from './services';
import { submitQuote } from '../lib/submit';

// How It Works page & Contact/Quote multi-step form

function ProcessPage() {
  const { setRoute } = useApp();
  const { t } = useTranslation();
  const phases = t('processPage.phases', { returnObjects: true });

  return (
    <main className="page-top">
      <div className="container">
        <div className="grid-2" style={{ gap: 72, alignItems: 'end', marginBottom: 120 }}>
          <div>
            <Reveal><div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 24 }}>{t('processPage.eyebrow')}</div></Reveal>
            <Reveal delay={80}>
              <h1 className="display">{t('processPage.title1')}<br/>{t('processPage.title2')} <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>{t('processPage.titleAccent')}</em>.</h1>
            </Reveal>
          </div>
          <Reveal delay={160}>
            <p className="lede">{t('processPage.lede')}</p>
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
          <SectionHeader num={t('processPage.principlesEyebrow')} eyebrow={t('processPage.principlesSubtitle')} title={<>{t('processPage.principlesTitle1')}<br/>{t('processPage.principlesTitle2')}</>}/>
          <div className="grid-5" style={{ gap: 0, border: '1px solid var(--fg-08)' }}>
            {t('processPage.principles', { returnObjects: true }).map((r, i) => (
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
  const { t } = useTranslation();
  const { route: appRoute } = useApp();
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
    services: appRoute.service ? [appRoute.service] : [],
    notes: '',
    email: '', phone: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const update = (k, v) => setData(d => ({ ...d, [k]: v }));
  const toggleService = (id) => setData(d => ({ ...d, services: d.services.includes(id) ? d.services.filter(s => s !== id) : [...d.services, id] }));

  const steps = t('contactPage.stepLabels', { returnObjects: true });

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
            <Reveal><div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 24 }}>{t('contactPage.eyebrow')}</div></Reveal>
            <Reveal delay={80}>
              <h1 className="display">{t('contactPage.title1')}<br/>{t('contactPage.title2')} <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>{t('contactPage.titleAccent')}</em>.</h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="lede mt-32">{t('contactPage.lede')}</p>
            </Reveal>
            <div className="mt-48">
              <div className="rule mb-24"/>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {[
                  { icon: 'Phone', label: '+382 67 144 555', sub: t('contactPage.phoneSub') },
                  { icon: 'Mail', label: 'info@yacht-concierge.me', sub: t('contactPage.emailSub') },
                  { icon: 'Pin', label: 'Pomorska ulica, Zgrada Baia', sub: t('contactPage.addressSub') },
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
                  <StepWrap title={t('contactPage.step0_title')} sub={t('contactPage.step0_sub')}>
                    <div className="grid-2" style={{ gap: 32 }}>
                      <div className="field">
                        <label className="field-label" htmlFor="cf-name">{t('contactPage.fieldName')}</label>
                        <input id="cf-name" className="field-input" value={data.name} onChange={e => update('name', e.target.value)} placeholder="Eleanor Vance"/>
                      </div>
                      <div className="field">
                        <label className="field-label" htmlFor="cf-role">{t('contactPage.fieldRole')}</label>
                        <select id="cf-role" className="field-select" value={data.role} onChange={e => update('role', e.target.value)}>
                          <option value="captain">{t('contactPage.roleCaption')}</option>
                          <option value="manager">{t('contactPage.roleManager')}</option>
                          <option value="owner">{t('contactPage.roleOwner')}</option>
                          <option value="broker">{t('contactPage.roleBroker')}</option>
                        </select>
                      </div>
                    </div>
                  </StepWrap>
                )}
                {step === 1 && (
                  <StepWrap title={t('contactPage.step1_title')} sub={t('contactPage.step1_sub')}>
                    <div className="grid-contact-vessel" style={{ gap: 32 }}>
                      <div className="field">
                        <label className="field-label" htmlFor="cf-yacht">{t('contactPage.fieldVessel')}</label>
                        <input id="cf-yacht" className="field-input" value={data.yacht} onChange={e => update('yacht', e.target.value)} placeholder="M/Y Atlas"/>
                      </div>
                      <div className="field">
                        <label className="field-label" htmlFor="cf-loa">{t('contactPage.fieldLoa')}</label>
                        <input id="cf-loa" className="field-input" type="number" min="24" max="300" step="0.1" value={data.loa} onChange={e => update('loa', e.target.value)} placeholder="73"/>
                      </div>
                      <div className="field">
                        <label className="field-label" htmlFor="cf-flag">{t('contactPage.fieldFlag')}</label>
                        <input id="cf-flag" className="field-input" value={data.flag} onChange={e => update('flag', e.target.value)} placeholder="Cayman Is."/>
                      </div>
                    </div>
                  </StepWrap>
                )}
                {step === 2 && (
                  <StepWrap title={t('contactPage.step2_title')} sub={t('contactPage.step2_sub')}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 32 }}>
                      <div className="field">
                        <label className="field-label" htmlFor="cf-eta">{t('contactPage.fieldEta')}</label>
                        <input id="cf-eta" className="field-input" type="date" value={data.eta} onChange={e => update('eta', e.target.value)}/>
                      </div>
                      <div className="field">
                        <label className="field-label" htmlFor="cf-etd">{t('contactPage.fieldEtd')}</label>
                        <input id="cf-etd" className="field-input" type="date" value={data.etd} onChange={e => update('etd', e.target.value)}/>
                      </div>
                    </div>
                    <div className="field">
                      <label className="field-label">{t('contactPage.fieldPort')}</label>
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
                  <StepWrap title={t('contactPage.step3_title')} sub={t('contactPage.step3_sub')}>
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
                              <div className="serif" style={{ fontSize: 20, marginTop: 8 }}>{t(`services.${s.id}_title`)}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="field mt-32">
                      <label className="field-label" htmlFor="cf-notes">{t('contactPage.fieldNotes')}</label>
                      <textarea id="cf-notes" className="field-textarea" value={data.notes} onChange={e => update('notes', e.target.value)} placeholder={t('contactPage.notesPlaceholder')}/>
                    </div>
                  </StepWrap>
                )}
                {step === 4 && (
                  <StepWrap title={t('contactPage.step4_title')} sub={t('contactPage.step4_sub')}>
                    <div className="grid-2" style={{ gap: 32 }}>
                      <div className="field">
                        <label className="field-label" htmlFor="cf-email">{t('contactPage.fieldEmail')}</label>
                        <input id="cf-email" className="field-input" type="email" value={data.email} onChange={e => update('email', e.target.value)} placeholder="captain@atlas.example"/>
                      </div>
                      <div className="field">
                        <label className="field-label" htmlFor="cf-phone">{t('contactPage.fieldPhone')}</label>
                        <input id="cf-phone" className="field-input" value={data.phone} onChange={e => update('phone', e.target.value)} placeholder="+44 7700 900 000"/>
                      </div>
                    </div>
                    <div style={{ marginTop: 48, padding: 24, background: 'var(--bg-warm)', border: '1px solid var(--fg-08)' }}>
                      <div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 12 }}>{t('contactPage.briefSummary')}</div>
                      <div style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--fg-70)' }}>
                        <strong style={{ color: 'var(--fg)' }}>{data.yacht || '—'}</strong>{data.loa && ` · ${data.loa}m`}{data.flag && ` · ${data.flag}`} {t('contactPage.arriving')} <strong style={{ color: 'var(--fg)' }}>{data.port}</strong> {t('contactPage.on')} <strong style={{ color: 'var(--fg)' }}>{data.eta || '—'}</strong>{data.etd && ` ${t('contactPage.until')} ${data.etd}`}. {t('contactPage.requesting')} <strong style={{ color: 'var(--fg)' }}>{data.services.length}</strong> {data.services.length === 1 ? t('contactPage.service') : t('contactPage.services')}.
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
                <h2 className="serif" style={{ fontSize: 48, letterSpacing: '-0.02em', marginBottom: 20 }}>{t('contactPage.successTitle')}</h2>
                <p className="lede" style={{ margin: '0 auto', maxWidth: 440 }}>
                  {t('contactPage.successLede', { ref: refNum })}
                </p>
                <div className="mono mt-48" style={{ color: 'var(--fg-50)' }}>
                  {t('contactPage.successMono')}
                </div>
              </div>
            )}

            {step < 5 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 48, paddingTop: 32, borderTop: '1px solid var(--fg-15)' }}>
                <button className="btn btn-ghost" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} style={{ opacity: step === 0 ? 0.3 : 1 }}>
                  {t('contactPage.back')}
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
                      setSubmitError(t('contactPage.errorMsg'));
                    } finally {
                      setSubmitting(false);
                    }
                  }}
                  disabled={submitting}
                  style={{ opacity: canProceed() && !submitting ? 1 : 0.4, pointerEvents: canProceed() && !submitting ? 'auto' : 'none' }}
                >
                  {submitting ? t('contactPage.sending') : step === 4 ? t('contactPage.submit') : t('contactPage.continue')} <Icons.Arrow size={14}/>
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
  const { t } = useTranslation();
  return (
    <div>
      <div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 16 }}>{t('contactPage.requiredInfo')}</div>
      <h2 className="serif" style={{ fontSize: 36, letterSpacing: '-0.01em', marginBottom: 12 }}>{title}</h2>
      <p style={{ color: 'var(--fg-70)', fontSize: 14, marginBottom: 48, maxWidth: '54ch' }}>{sub}</p>
      {children}
    </div>
  );
}

// ---------- Berths / Fleet page (simple) ----------
function FleetPage() {
  const { t } = useTranslation();
  return (
    <main className="page-top">
      <div className="container">
        <div className="grid-2" style={{ gap: 72, alignItems: 'end', marginBottom: 96 }}>
          <div>
            <Reveal><div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 24 }}>{t('fleetPage.eyebrow')}</div></Reveal>
            <Reveal delay={80}>
              <h1 className="display">{t('fleetPage.title1')}<br/>{t('fleetPage.title2')} <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>{t('fleetPage.titleAccent')}</em>.</h1>
            </Reveal>
          </div>
          <Reveal delay={160}>
            <p className="lede">{t('fleetPage.lede')}</p>
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
  const { t } = useTranslation();

  const stats = [
    { value: t('aboutPage.seasons_value'),  label: t('aboutPage.seasons_label') },
    { value: t('aboutPage.vessels_value'),  label: t('aboutPage.vessels_label') },
    { value: t('aboutPage.marinas_value'),  label: t('aboutPage.marinas_label') },
    { value: t('aboutPage.desk_value'),     label: t('aboutPage.desk_label') },
  ];

  const team = [
    {
      name:  'Sanja Božović',
      title: 'Founder & CEO',
      bio:   t('aboutPage.teamBio_sanja'),
      phone: '38267201655',
      wa:    'Hello Sanja, I would like to enquire about your yacht concierge services in Montenegro.',
    },
    {
      name:  'Iva Erceg',
      title: 'Operations Director',
      bio:   t('aboutPage.teamBio_iva'),
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
              <div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 24 }}>{t('aboutPage.eyebrow')}</div>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="display">
                {t('aboutPage.title1')}<br/>
                <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>{t('aboutPage.titleAccent')}</em>.
              </h1>
            </Reveal>
          </div>
          <Reveal delay={160}>
            <p className="lede">{t('aboutPage.lede')}</p>
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
                {t('aboutPage.storyLabel')}
              </div>
            </div>
            <div>
              <p style={{ fontSize: 18, lineHeight: 1.75, color: 'var(--fg-80)', marginBottom: 28 }}>{t('aboutPage.story1')}</p>
              <p style={{ fontSize: 18, lineHeight: 1.75, color: 'var(--fg-80)', marginBottom: 28 }}>{t('aboutPage.story2')}</p>
              <p style={{ fontSize: 18, lineHeight: 1.75, color: 'var(--fg-80)', marginBottom: 40 }}>{t('aboutPage.story3')}</p>
              <a
                href="https://montenegrocharter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}
              >
                {t('aboutPage.visitCharter')}
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
              {t('aboutPage.quote')}
            </p>
            <div className="mono" style={{ fontSize: 11, color: 'var(--fg-50)', letterSpacing: '0.1em' }}>
              {t('aboutPage.quoteAuthor')}
            </div>
          </div>
        </Reveal>

        {/* Team */}
        <SectionHeader
          eyebrow={t('aboutPage.teamEyebrow')}
          title={<>{t('aboutPage.teamTitle1')}<br/>{t('aboutPage.teamTitle2')} <em>{t('aboutPage.teamTitleAccent')}</em>.</>}
          lede={t('aboutPage.teamSub')}
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
                  {t('aboutPage.whatsappPrefix')} {m.name.split(' ')[0]}
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
              { label: t('aboutPage.accountability_label'), text: t('aboutPage.accountability_text') },
              { label: t('aboutPage.transparency_label'),  text: t('aboutPage.transparency_text') },
              { label: t('aboutPage.presence_label'),      text: t('aboutPage.presence_text') },
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
  const { t } = useTranslation();
  return (
    <main className="page-top">
      <div className="container" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
        <div style={{ maxWidth: 560 }}>
          <Reveal>
            <div className="mono" style={{ color: 'var(--accent)', marginBottom: 24, fontSize: 12, letterSpacing: '0.12em' }}>
              {t('notFound.code')}
            </div>
          </Reveal>
          <Reveal delay={60}>
            <h1 className="display" style={{ marginBottom: 32 }}>
              {t('notFound.title1')}<br/><em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>{t('notFound.titleAccent')}</em>.
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p style={{ fontSize: 18, lineHeight: 1.75, color: 'var(--fg-70)', marginBottom: 48 }}>
              {t('notFound.body')}
            </p>
          </Reveal>
          <Reveal delay={180}>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <button
                onClick={() => setRoute({ page: 'home' })}
                className="btn btn-primary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}
              >
                {t('notFound.btnHome')}
                <Icons.Arrow size={15}/>
              </button>
              <button
                onClick={() => setRoute({ page: 'contact' })}
                className="btn btn-outline"
              >
                {t('notFound.btnContact')}
              </button>
            </div>
          </Reveal>
        </div>
      </div>
    </main>
  );
}

export { ProcessPage, ContactPage, FleetPage, AboutPage, NotFoundPage };
