# Yacht Concierge — Deployment Checklist

## ✅ Što je automatski popravljeno

| # | Problem | Status |
|---|---------|--------|
| 1 | Nedostajao `public/logo.png` (referencirano u SEO Schema.org) | ✅ Kreiran |
| 2 | Nije bilo React Error Boundary — crash = bijela stranica | ✅ Dodano u `main.jsx` |
| 3 | `submit.js` slao zahtjeve na placeholder URL bez greške | ✅ Detektuje placeholder, loguje u console |
| 4 | Dupli `<link rel="stylesheet">` u `index.html` (CSS se učitavao 2x) | ✅ Uklonjen |
| 5 | `sitemap.xml` bez `<lastmod>` datuma | ✅ Dodane sve datume |
| 6 | `index.html` bez `<noscript>` fallbacka | ✅ Dodan kontakt fallback |
| 7 | `manifest.webmanifest` imao samo SVG ikonu | ✅ Dodan logo.png (512×512) |

---

## 🔧 Što TI moraš uraditi prije deplojmenta

### 1. Google Apps Script — Backend API

Forma za kontakt i provisioning shop šalju podatke na Google Apps Script.

**Koraci:**
1. Otvori [Google Sheets](https://sheets.google.com) → Kreiraj novu tabelu: `Yacht Concierge — Submissions`
2. Kreiraj dva sheeta: `Quote Requests` i `Provisioning Orders`
3. Klikni `Extensions → Apps Script`
4. Zamijeniti sav kod sa sadržajem fajla `google-apps-script.js` iz projekta
5. `Deploy → New Deployment → Web App`
   - Execute as: **Me**
   - Who has access: **Anyone**
6. Kopiraj Web App URL (izgleda kao: `https://script.google.com/macros/s/ABC123.../exec`)

### 2. Environment Variable na hosting platformi

Na Cloudflare Pages / Netlify / Vercel postavi environment variable:

```
VITE_API_URL = https://script.google.com/macros/s/TVOJ_PRAVI_URL/exec
```

> ⚠️ **Važno:** Postavi ovu varijablu PRIJE builda na platformi — Vite je peče u bundle tokom builda.

### 3. Domen

DNS zapisi za `yacht-concierge.me`:
- Na Cloudflare Pages: Dodaj custom domen u dashboard
- Certifikat (HTTPS) se automatski konfigiše

---

## 📦 Build komanda za hosting platformu

| Setting | Vrijednost |
|---------|-----------|
| Build command | `npm run build` |
| Output directory | `dist` |
| Node version | 18+ |

---

## 🚀 Preporučena hosting platforma

**Cloudflare Pages** (besplatno, najbrže za EU/ME region):
1. [pages.cloudflare.com](https://pages.cloudflare.com) → Connect to Git → Odaberi repo
2. Postavi build settings gore
3. Dodaj `VITE_API_URL` environment variable
4. Dodaj custom domen `yacht-concierge.me`

`_redirects` fajl je već konfigurisan za SPA routing (`/* /index.html 200`).

---

## ✅ Finalna verifikacija nakon deploja

- [ ] Otvori live URL — provjeri da se stranica učitava
- [ ] Testiraj contact formu — provjeri da stiže email na `info@yacht-concierge.me`
- [ ] Provjeri provisioning shop — test order
- [ ] Testiraj jezike (EN / RU / IT)
- [ ] Provjeri [Google Search Console](https://search.google.com/search-console) — submit sitemap
- [ ] Provjeri [schema.org validator](https://validator.schema.org) sa live URL-om
