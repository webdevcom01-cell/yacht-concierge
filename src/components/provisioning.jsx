import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Icons, Reveal } from './shared';
import { submitCatalogueRequest } from '../lib/submit';

// Provisioning — catalogue request page.
// The former in-page product catalogue and online ordering were retired in
// favour of a simple request flow: the client selects the categories of
// interest and we send the current price catalogues directly.

const CATEGORY_IDS = ['meat', 'seafood', 'dairy', 'bakery', 'pantry', 'specialty', 'frozen'];

const WA_CATALOGUE_URL = `https://wa.me/38267144555?text=${encodeURIComponent(
  "Hello, I'd like to request provisioning price catalogues."
)}`;

function ProvisioningPage() {
  const { t } = useTranslation();

  const [refNum] = useState(() => {
    const now = new Date();
    const date = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
    const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
    return `PC-${date}-${rand}`;
  });

  const [data, setData] = useState({
    name: '', yacht: '', email: '', phone: '', marina: '', notes: '', categories: [],
  });
  const [status, setStatus] = useState('idle'); // idle | sending | done | error

  const update = (k, v) => setData(d => ({ ...d, [k]: v }));
  const toggleCategory = (id) =>
    setData(d => ({
      ...d,
      categories: d.categories.includes(id)
        ? d.categories.filter(c => c !== id)
        : [...d.categories, id],
    }));

  const canSubmit =
    data.name.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) &&
    data.categories.length > 0;

  const submit = async () => {
    if (!canSubmit || status === 'sending') return;
    setStatus('sending');
    try {
      await submitCatalogueRequest(
        { ...data, categories: data.categories.map(id => t(`provisioningPage.cat_${id}`)) },
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
                {t('provisioningPage.eyebrow')}
              </div>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="display">
                {t('provisioningPage.title1')}<br />
                {t('provisioningPage.title2')}{' '}
                <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>
                  {t('provisioningPage.titleAccent')}
                </em>.
              </h1>
            </Reveal>
          </div>
          <Reveal delay={160}>
            <p className="lede">{t('provisioningPage.lede')}</p>
          </Reveal>
        </div>

        {status === 'done' ? (
          /* Success state */
          <div style={{ padding: '64px 0 96px', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 72, height: 72, border: '1px solid var(--accent)', color: 'var(--accent)', marginBottom: 40, borderRadius: '50%' }}>
              <Icons.Check size={28} stroke={1.2} />
            </div>
            <h2 className="serif" style={{ fontSize: 48, letterSpacing: '-0.02em', marginBottom: 20 }}>
              {t('provisioningPage.successTitle')}
            </h2>
            <p className="lede" style={{ margin: '0 auto', maxWidth: 480 }}>
              {t('provisioningPage.successLede', { ref: refNum })}
            </p>
          </div>
        ) : (
          <div className="grid-contact" style={{ gap: 96, alignItems: 'start', marginBottom: 96 }}>

            {/* Left — categories */}
            <div>
              <Reveal>
                <div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 12 }}>
                  {t('provisioningPage.categoriesLabel').toUpperCase()}
                </div>
                <p style={{ fontSize: 14, color: 'var(--fg-70)', marginBottom: 28, maxWidth: '44ch' }}>
                  {t('provisioningPage.categoriesSub')}
                </p>
              </Reveal>
              <Reveal delay={80}>
                <div style={{ border: '1px solid var(--fg-15)' }}>
                  {CATEGORY_IDS.map((id, i) => {
                    const on = data.categories.includes(id);
                    return (
                      <div
                        key={id}
                        role="checkbox"
                        aria-checked={on}
                        tabIndex={0}
                        onClick={() => toggleCategory(id)}
                        onKeyDown={(e) => {
                          if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggleCategory(id); }
                        }}
                        style={{
                          padding: '18px 24px',
                          cursor: 'pointer',
                          borderBottom: i < CATEGORY_IDS.length - 1 ? '1px solid var(--fg-15)' : 'none',
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
                          {t(`provisioningPage.cat_${id}`)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Reveal>
            </div>

            {/* Right — request form */}
            <Reveal delay={120}>
              <div style={{ border: '1px solid var(--fg-15)', padding: 'clamp(24px, 6vw, 56px)', background: 'var(--bg-raised)' }}>
                <div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 32 }}>
                  {t('provisioningPage.formLabel')}
                </div>

                <div className="grid-2" style={{ gap: 32, marginBottom: 32 }}>
                  <div className="field">
                    <label className="field-label" htmlFor="pc-name">{t('provisioningPage.nameLabel')}</label>
                    <input id="pc-name" className="field-input" autoComplete="name" value={data.name} onChange={e => update('name', e.target.value)} placeholder="Eleanor Vance" />
                  </div>
                  <div className="field">
                    <label className="field-label" htmlFor="pc-yacht">{t('provisioningPage.yachtLabel')}</label>
                    <input id="pc-yacht" className="field-input" value={data.yacht} onChange={e => update('yacht', e.target.value)} placeholder="M/Y Atlas" />
                  </div>
                </div>

                <div className="grid-2" style={{ gap: 32, marginBottom: 32 }}>
                  <div className="field">
                    <label className="field-label" htmlFor="pc-email">{t('provisioningPage.emailLabel')}</label>
                    <input id="pc-email" className="field-input" type="email" autoComplete="email" value={data.email} onChange={e => update('email', e.target.value)} placeholder="chef@atlas.example" />
                  </div>
                  <div className="field">
                    <label className="field-label" htmlFor="pc-phone">{t('provisioningPage.phoneLabel')}</label>
                    <input id="pc-phone" className="field-input" type="tel" autoComplete="tel" value={data.phone} onChange={e => update('phone', e.target.value)} placeholder="+44 7700 900 000" />
                  </div>
                </div>

                <div className="field" style={{ marginBottom: 32 }}>
                  <label className="field-label" htmlFor="pc-marina">{t('provisioningPage.marinaLabel')}</label>
                  <select id="pc-marina" className="field-select" value={data.marina} onChange={e => update('marina', e.target.value)}>
                    <option value="">{t('provisioningPage.marinaNone')}</option>
                    {['Porto Montenegro', 'Herceg Novi', 'Kotor', 'Budva', 'Bar'].map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div className="field" style={{ marginBottom: 40 }}>
                  <label className="field-label" htmlFor="pc-notes">{t('provisioningPage.notesLabel')}</label>
                  <textarea id="pc-notes" className="field-textarea" value={data.notes} onChange={e => update('notes', e.target.value)} placeholder={t('provisioningPage.notesPlaceholder')} />
                </div>

                <button
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', opacity: canSubmit && status !== 'sending' ? 1 : 0.4 }}
                  disabled={!canSubmit || status === 'sending'}
                  onClick={submit}
                >
                  {status === 'sending' ? t('provisioningPage.sending') : t('provisioningPage.submitBtn')} <Icons.Arrow size={14} />
                </button>

                {status === 'error' && (
                  <div role="alert" aria-live="assertive" style={{ marginTop: 20, padding: '16px 20px', border: '1px solid rgba(192,57,43,0.4)', background: 'rgba(192,57,43,0.06)' }}>
                    <div className="mono" style={{ color: '#c0392b', fontSize: 11, letterSpacing: '0.08em', marginBottom: 10 }}>
                      ↳ {t('provisioningPage.errorMsg')}
                    </div>
                    <div style={{ fontSize: 13.5, display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
                      <a href={WA_CATALOGUE_URL} target="_blank" rel="noopener noreferrer" style={{ color: '#25D366', textDecoration: 'none', fontWeight: 500 }}>
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
                    {t('provisioningPage.orLabel').toUpperCase()}
                  </span>
                  <a
                    href={WA_CATALOGUE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#25D366', fontSize: 13.5, fontWeight: 500, textDecoration: 'none' }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="#25D366" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    {t('provisioningPage.whatsappBtn')}
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

export { ProvisioningPage };
