import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp, Icons, Reveal, SectionHeader } from './shared';
import { SERVICES } from '../data/services';
import { ClosingCTA } from './home-bottom';

// Services index page & Service detail page

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
  const { t } = useTranslation();

  const tier =
    loa < 40 ? { name: t('servicesPage.tier1_name'), range: t('servicesPage.tier1_range'), price: t('servicesPage.tier1_price'), desc: t('servicesPage.tier1_desc') } :
    loa < 70 ? { name: t('servicesPage.tier2_name'), range: t('servicesPage.tier2_range'), price: t('servicesPage.tier2_price'), desc: t('servicesPage.tier2_desc') } :
               { name: t('servicesPage.tier3_name'), range: t('servicesPage.tier3_range'), price: t('servicesPage.tier3_price'), desc: t('servicesPage.tier3_desc') };

  return (
    <div style={{ padding: 48, border: '1px solid var(--fg-15)', background: 'var(--bg-raised)' }}>
      <div className="grid-fleet-calc" style={{ gap: 72, alignItems: 'center' }}>
        <div>
          <div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 20 }}>{t('servicesPage.fleetCalc')}</div>
          <h3 className="serif" style={{ fontSize: 44, lineHeight: 1.05, letterSpacing: '-0.01em' }}>
            {t('servicesPage.fleetTitle')} <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>{t('servicesPage.fleetTitleAccent')}</em>.
          </h3>
          <p style={{ fontSize: 13.5, color: 'var(--fg-70)', marginTop: 20, maxWidth: '36ch' }}>
            {t('servicesPage.fleetSub')}
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
              <div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 8 }}>{t('servicesPage.recommended')}</div>
              <div className="serif" style={{ fontSize: 24 }}>{tier.name}</div>
              <div style={{ fontSize: 13, color: 'var(--fg-70)', marginTop: 4 }}>{tier.range}</div>
              <div style={{ fontSize: 13, color: 'var(--fg-70)', marginTop: 16, maxWidth: '40ch' }}>{tier.desc}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 8 }}>{t('servicesPage.pricing')}</div>
              <div className="serif" style={{ fontSize: 40, letterSpacing: '-0.02em' }}>{tier.price}</div>
            </div>
          </div>
        </div>
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
  };

  return (
    <main className="page-top">
      <div className="container">
        <Reveal>
          <a className="mono" onClick={() => setRoute({ page: 'services' })} style={{ display: 'inline-flex', gap: 10, color: 'var(--fg-70)', cursor: 'pointer', marginBottom: 64 }}>
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

        {/* Provisioning catalogue CTA — only shown on the provisioning service detail */}
        {s.id === 'provisioning' && (
          <Reveal>
            <div
              onClick={() => setRoute({ page: 'provisioning' })}
              style={{
                marginBottom: 96,
                padding: 'clamp(32px, 4vw, 56px) clamp(28px, 5vw, 72px)',
                background: 'var(--navy, #001730)',
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
                <div className="mono" style={{ color: 'rgba(255,255,255,0.45)', marginBottom: 16, fontSize: 11, letterSpacing: '0.1em' }}>
                  {t('servicesPage.provShopLabel')}
                </div>
                <h3 className="serif" style={{ fontSize: 'clamp(28px, 3vw, 44px)', color: '#fff', margin: '0 0 14px', lineHeight: 1.1 }}>
                  {t('servicesPage.provShopTitle')}
                </h3>
                <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--sans)', lineHeight: 1.6, maxWidth: 440, margin: 0 }}>
                  {t('servicesPage.provShopBody')}
                </p>
              </div>
              <div className="mono" style={{ color: 'var(--accent, #B8963E)', fontSize: 11, letterSpacing: '0.12em', whiteSpace: 'nowrap', display: 'flex', gap: 12, alignItems: 'center', flexShrink: 0 }}>
                {t('servicesPage.provShopBtn')} <Icons.Arrow size={13}/>
              </div>
            </div>
          </Reveal>
        )}

        {/* Cross-sell */}
        <div style={{ marginBottom: 96 }}>
          <Reveal>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 48 }}>
              <h3 className="serif" style={{ fontSize: 32 }}>{t('servicesPage.adjacentTitle')}</h3>
              <span className="mono" style={{ color: 'var(--fg-50)' }}>05 / {t('servicesPage.adjacentLabel')}</span>
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
                  <div className="serif" style={{ fontSize: 20 }}>{t(`services.${o.id}_title`)}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <ClosingCTA serviceId={s.id}/>
    </main>
  );
}

export { ServicesPage, ServiceDetailPage, FleetTierSelector };
