import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const GA_ID = 'G-SK94J53BXJ';
const CONSENT_KEY = 'yc-cookie-consent'; // 'accepted' | 'declined'

// ── Load GA4 dynamically ──────────────────────────────────────────────────────

function loadGA4() {
  if (window.__ga4Loaded) return;
  window.__ga4Loaded = true;

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_ID);

  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
}

// ── CookieConsent component ───────────────────────────────────────────────────

export function CookieConsent() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(CONSENT_KEY);
    if (saved === 'accepted') {
      loadGA4();
    } else if (!saved) {
      // No decision yet — show banner after short delay
      const t = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(t);
    }
    // 'declined' → do nothing, GA4 stays off
  }, []);

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    loadGA4();
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(CONSENT_KEY, 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 9000,
      background: 'var(--navy, #001730)',
      borderTop: '1px solid rgba(255,255,255,0.12)',
      padding: '20px 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 24,
      flexWrap: 'wrap',
    }}>
      {/* Text */}
      <p style={{
        margin: 0,
        fontSize: 13,
        lineHeight: 1.6,
        color: 'rgba(255,255,255,0.72)',
        maxWidth: 680,
        fontFamily: "'Inter', sans-serif",
      }}>
        {t('cookie.body')}{' '}
        <a
          href="/privacy"
          onClick={(e) => { e.preventDefault(); window.location.hash = ''; }}
          style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'underline', textUnderlineOffset: 3 }}
        >
          Privacy Policy
        </a>
      </p>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: 12, flexShrink: 0 }}>
        <button
          onClick={decline}
          style={{
            padding: '9px 20px',
            fontSize: 11,
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: '0.08em',
            fontWeight: 500,
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.25)',
            color: 'rgba(255,255,255,0.55)',
            borderRadius: 3,
            cursor: 'pointer',
          }}
        >
          {t('cookie.decline').toUpperCase()}
        </button>
        <button
          onClick={accept}
          style={{
            padding: '9px 20px',
            fontSize: 11,
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: '0.08em',
            fontWeight: 500,
            background: 'var(--accent, #B8963E)',
            border: '1px solid transparent',
            color: '#fff',
            borderRadius: 3,
            cursor: 'pointer',
          }}
        >
          {t('cookie.accept').toUpperCase()}
        </button>
      </div>
    </div>
  );
}
