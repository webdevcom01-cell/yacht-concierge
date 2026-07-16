import React from 'react';
import { useTranslation } from 'react-i18next';
import { useApp, Icons, Reveal, SectionHeader } from './shared';
import { SERVICES } from '../data/services';

// Home page — Services preview + Stats block

// ---------- Services preview grid ----------
function ServicesPreview() {
  const { setRoute, serviceDensity } = useApp();
  const { t } = useTranslation();
  const colCount = serviceDensity === 'dense' ? 4 : serviceDensity === 'loose' ? 2 : 3;
  return (
    <section style={{ position: 'relative', overflow: 'hidden', padding: '100px 0' }}>
      {/* Content */}
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div className="grid-2 services-preview-header" style={{ alignItems: 'end', marginBottom: 64 }}>
          <div>
            <Reveal>
              <div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 24, letterSpacing: '0.18em' }}>
                {t('services.eyebrow')}
              </div>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="h2" style={{ color: 'var(--fg)' }}>
                {t('services.title1')}<br/>
                <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>{t('services.title2')}</em>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={160}>
            <p className="lede lede-right" style={{ color: 'var(--fg-50)' }}>{t('services.lede')}</p>
          </Reveal>
        </div>

        <div className={`services-grid services-grid--${serviceDensity === 'dense' ? 'dense' : serviceDensity === 'loose' ? 'loose' : 'standard'}`} style={{ gap: 0, border: '1px solid var(--border, var(--fg-08))' }}>
          {SERVICES.map((s, i) => {
            const IconC = Icons[s.icon];
            const isRight = (i + 1) % colCount === 0;
            const isBottom = i >= SERVICES.length - colCount;
            return (
              <Reveal key={s.id} delay={i * 60}>
                <div
                  className="service-card"
                  style={{
                    border: 'none',
                    borderRight: isRight ? 'none' : '1px solid var(--border, var(--fg-08))',
                    borderBottom: isBottom ? 'none' : '1px solid var(--border, var(--fg-08))',
                    borderRadius: 0,
                    background: 'transparent',
                    transition: 'background 0.3s ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(212,183,143,0.08)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  onClick={() => setRoute({ page: 'service', id: s.id })}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <span className="service-card-num" style={{ color: 'rgba(212,183,143,0.75)' }}>{s.num}</span>
                    <IconC size={28} stroke={1} color="var(--accent)" />
                  </div>
                  <h3 className="service-card-title" style={{ color: 'var(--fg)' }}>{t(`services.${s.id}_title`)}</h3>
                  <p className="service-card-body" style={{ color: 'var(--fg-50)' }}>{t(`services.${s.id}_desc`)}</p>
                  <div className="service-card-arrow" style={{ color: 'var(--accent)' }}>
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

export { ServicesPreview, StatsBlock };
