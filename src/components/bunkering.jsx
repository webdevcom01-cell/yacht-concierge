import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Icons, Reveal, WhatsAppIcon } from './shared';
import { submitBunkeringRequest } from '../lib/submit';

// Fuel & Bunkering — dedicated request page, mirroring the structure of
// provisioning.jsx (hero + left selection panel + right request form).
// Fuel-specific differences from the provisioning flow:
//  - Fuel type (diesel/petrol) replaces provisioning's product categories.
//  - Charter status is a required field: duty-free eligibility depends on
//    it (see serviceDetail.fuel protocol, REQUEST step), so it must be
//    captured up front rather than clarified later by phone/email.
//  - The marina list includes Luštica Bay with an inline note, since it has
//    no fuel dock/tank of its own and is routed to Portonovi or Porto
//    Montenegro — this must stay visible to the client, not hidden.

const FUEL_TYPE_IDS = ['diesel', 'petrol'];
const MARINAS = ['Porto Montenegro', 'Portonovi', 'Bar', 'Budva', 'Kotor', 'Luštica Bay'];
const CHARTER_STATUS_IDS = ['charter', 'private'];

const WA_BUNKERING_URL = `https://wa.me/38267144555?text=${encodeURIComponent(
  "Hello, I'd like to request fuel & bunkering for my yacht."
)}`;

function BunkeringPage() {
  const { t } = useTranslation();

  const [refNum] = useState(() => {
    const now = new Date();
    const date = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
    const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
    return `FB-${date}-${rand}`;
  });

  const [data, setData] = useState({
    name: '', yacht: '', email: '', phone: '', marina: '', quantity: '', charterStatus: '', notes: '', fuelTypes: [],
  });
  const [status, setStatus] = useState('idle'); // idle | sending | done | error

  const update = (k, v) => setData(d => ({ ...d, [k]: v }));
  const toggleFuelType = (id) =>
    setData(d => ({
      ...d,
      fuelTypes: d.fuelTypes.includes(id)
        ? d.fuelTypes.filter(f => f !== id)
        : [...d.fuelTypes, id],
    }));

  const canSubmit =
    data.name.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) &&
    data.fuelTypes.length > 0 &&
    data.charterStatus;

  const submit = async () => {
    if (!canSubmit || status === 'sending') return;
    setStatus('sending');
    try {
      await submitBunkeringRequest(
        {
          ...data,
          fuelTypes: data.fuelTypes.map(id => t(`bunkeringPage.fuel_${id}`)),
          charterStatus: t(`bunkeringPage.charter_${data.charterStatus}`),
        },
        refNum
      );
      setStatus('done');
    } catch {
      setStatus('error');
    }
  };

  return (
    <main className="page-top">
      <div className="container">

        {/* Hero */}
        <div className="grid-2" style={{ gap: 72, alignItems: 'end', marginBottom: 96 }}>
          <div>
            <Reveal>
              <div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 24 }}>
                {t('bunkeringPage.eyebrow')}
              </div>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="display">
                {t('bunkeringPage.title1')}<br />
                {t('bunkeringPage.title2')}{' '}
                <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>
                  {t('bunkeringPage.titleAccent')}
                </em>.
              </h1>
            </Reveal>
          </div>
          <Reveal delay={160}>
            <p className="lede">{t('bunkeringPage.lede')}</p>
          </Reveal>
        </div>

        {status === 'done' ? (
          /* Success state */
          <div style={{ padding: '64px 0 96px', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 72, height: 72, border: '1px solid var(--accent)', color: 'var(--accent)', marginBottom: 40, borderRadius: '50%' }}>
              <Icons.Check size={28} stroke={1.2} />
            </div>
            <h2 className="serif" style={{ fontSize: 48, letterSpacing: '-0.02em', marginBottom: 20 }}>
              {t('bunkeringPage.successTitle')}
            </h2>
            <p className="lede" style={{ margin: '0 auto', maxWidth: 480 }}>
              {t('bunkeringPage.successLede', { ref: refNum })}
            </p>
          </div>
        ) : (
          <div className="grid-contact" style={{ gap: 96, alignItems: 'start', marginBottom: 96 }}>

            {/* Left — fuel type */}
            <div>
              <Reveal>
                <div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 12 }}>
                  {t('bunkeringPage.fuelTypeLabel').toUpperCase()}
                </div>
                <p style={{ fontSize: 14, color: 'var(--fg-70)', marginBottom: 28, maxWidth: '44ch' }}>
                  {t('bunkeringPage.fuelTypeSub')}
                </p>
              </Reveal>
              <Reveal delay={80}>
                <div style={{ border: '1px solid var(--fg-15)' }}>
                  {FUEL_TYPE_IDS.map((id, i) => {
                    const on = data.fuelTypes.includes(id);
                    return (
                      <div
                        key={id}
                        role="checkbox"
                        aria-checked={on}
                        tabIndex={0}
                        onClick={() => toggleFuelType(id)}
                        onKeyDown={(e) => {
                          if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggleFuelType(id); }
                        }}
                        style={{
                          padding: '18px 24px',
                          cursor: 'pointer',
                          borderBottom: i < FUEL_TYPE_IDS.length - 1 ? '1px solid var(--fg-15)' : 'none',
                          background: on ? 'var(--accent-soft)' : 'transparent',
                          display: 'flex',
                          gap: 16,
                          alignItems: 'center',
                          transition: 'background 0.3s var(--ease)',
                        }}
                      >
                        <div style={{ width: 16, height: 16, flexShrink: 0, border: `1px solid ${on ? 'var(--accent)' : 'var(--fg-30)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {on && <Icons.Check size={10} stroke={2} />}
                        </div>
                        <div className="serif" style={{ fontSize: 19 }}>
                          {t(`bunkeringPage.fuel_${id}`)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Reveal>

              {/* Charter status — required, since duty-free eligibility depends on it */}
              <Reveal delay={140}>
                <div className="field" style={{ marginTop: 32 }}>
                  <label className="field-label" htmlFor="fb-charter">{t('bunkeringPage.charterStatusLabel')}</label>
                  <select id="fb-charter" className="field-select" value={data.charterStatus} onChange={e => update('charterStatus', e.target.value)}>
                    <option value="">{t('bunkeringPage.charterStatusNone')}</option>
                    {CHARTER_STATUS_IDS.map(id => (
                      <option key={id} value={id}>{t(`bunkeringPage.charter_${id}`)}</option>
                    ))}
                  </select>
                </div>
              </Reveal>

              <Reveal delay={180}>
                <div className="field" style={{ marginTop: 32 }}>
                  <label className="field-label" htmlFor="fb-quantity">{t('bunkeringPage.quantityLabel')}</label>
                  <input id="fb-quantity" className="field-input" value={data.quantity} onChange={e => update('quantity', e.target.value)} placeholder={t('bunkeringPage.quantityPlaceholder')} />
                </div>
              </Reveal>
            </div>

            {/* Right — request form */}
            <Reveal delay={120}>
              <div style={{ border: '1px solid var(--fg-15)', padding: 'clamp(24px, 6vw, 56px)', background: 'var(--bg-raised)' }}>
                <div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 32 }}>
                  {t('bunkeringPage.formLabel')}
                </div>

                <div className="grid-2" style={{ gap: 32, marginBottom: 32 }}>
                  <div className="field">
                    <label className="field-label" htmlFor="fb-name">{t('bunkeringPage.nameLabel')}</label>
                    <input id="fb-name" className="field-input" autoComplete="name" value={data.name} onChange={e => update('name', e.target.value)} placeholder="Eleanor Vance" />
                  </div>
                  <div className="field">
                    <label className="field-label" htmlFor="fb-yacht">{t('bunkeringPage.yachtLabel')}</label>
                    <input id="fb-yacht" className="field-input" value={data.yacht} onChange={e => update('yacht', e.target.value)} placeholder="M/Y Atlas" />
                  </div>
                </div>

                <div className="grid-2" style={{ gap: 32, marginBottom: 32 }}>
                  <div className="field">
                    <label className="field-label" htmlFor="fb-email">{t('bunkeringPage.emailLabel')}</label>
                    <input id="fb-email" className="field-input" type="email" autoComplete="email" value={data.email} onChange={e => update('email', e.target.value)} placeholder="captain@atlas.example" />
                  </div>
                  <div className="field">
                    <label className="field-label" htmlFor="fb-phone">{t('bunkeringPage.phoneLabel')}</label>
                    <input id="fb-phone" className="field-input" type="tel" autoComplete="tel" value={data.phone} onChange={e => update('phone', e.target.value)} placeholder="+44 7700 900 000" />
                  </div>
                </div>

                <div className="field" style={{ marginBottom: data.marina === 'Luštica Bay' ? 12 : 32 }}>
                  <label className="field-label" htmlFor="fb-marina">{t('bunkeringPage.marinaLabel')}</label>
                  <select id="fb-marina" className="field-select" value={data.marina} onChange={e => update('marina', e.target.value)}>
                    <option value="">{t('bunkeringPage.marinaNone')}</option>
                    {MARINAS.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                {/* Luštica Bay has no fuel infrastructure of its own — surface the
                    routing to the client right here, not just in the service copy. */}
                {data.marina === 'Luštica Bay' && (
                  <div style={{ marginBottom: 32, padding: '12px 16px', border: '1px solid var(--fg-15)', background: 'var(--accent-soft)', fontSize: 13, color: 'var(--fg-70)', lineHeight: 1.5 }}>
                    {t('bunkeringPage.marinaLusticaNote')}
                  </div>
                )}

                <div className="field" style={{ marginBottom: 40 }}>
                  <label className="field-label" htmlFor="fb-notes">{t('bunkeringPage.notesLabel')}</label>
                  <textarea id="fb-notes" className="field-textarea" value={data.notes} onChange={e => update('notes', e.target.value)} placeholder={t('bunkeringPage.notesPlaceholder')} />
                </div>

                <button
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', opacity: canSubmit && status !== 'sending' ? 1 : 0.4 }}
                  disabled={!canSubmit || status === 'sending'}
                  onClick={submit}
                >
                  {status === 'sending' ? t('bunkeringPage.sending') : t('bunkeringPage.submitBtn')} <Icons.Arrow size={14} />
                </button>

                {status === 'error' && (
                  <div role="alert" aria-live="assertive" style={{ marginTop: 20, padding: '16px 20px', border: '1px solid rgba(192,57,43,0.4)', background: 'rgba(192,57,43,0.06)' }}>
                    <div className="mono" style={{ color: '#c0392b', fontSize: 11, letterSpacing: '0.08em', marginBottom: 10 }}>
                      ↳ {t('bunkeringPage.errorMsg')}
                    </div>
                    <div style={{ fontSize: 13.5, display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
                      <a href={WA_BUNKERING_URL} target="_blank" rel="noopener noreferrer" style={{ color: '#25D366', textDecoration: 'none', fontWeight: 500 }}>
                        WhatsApp +382 67 144 555
                      </a>
                      <span style={{ color: 'var(--fg-50)' }}>·</span>
                      <a href="mailto:info@yacht-concierge.me" style={{ color: 'var(--fg-70)' }}>
                        info@yacht-concierge.me
                      </a>
                    </div>
                  </div>
                )}

                <div style={{ marginTop: 28, display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span className="mono" style={{ color: 'var(--fg-50)', fontSize: 10, letterSpacing: '0.12em' }}>
                    {t('bunkeringPage.orLabel').toUpperCase()}
                  </span>
                  <a
                    href={WA_BUNKERING_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#25D366', fontSize: 13.5, fontWeight: 500, textDecoration: 'none' }}
                  >
                    <WhatsAppIcon size={15} fill="#25D366"/>
                    {t('bunkeringPage.whatsappBtn')}
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        )}
      </div>
    </main>
  );
}

export { BunkeringPage };
