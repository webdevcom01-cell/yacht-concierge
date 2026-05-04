import { useEffect } from 'react';

// ── SEO data per page ─────────────────────────────────────────────────────────

const SEO_DATA = {
  home: {
    title: 'Yacht Concierge Montenegro — Superyacht Logistics, Adriatic',
    description: 'Full-service concierge for superyachts in Montenegro. Berth reservations, customs, provisioning, and crew logistics at Porto Montenegro, Herceg Novi, and Bar.',
    url: 'https://yacht-concierge.me/',
    breadcrumb: null,
  },
  services: {
    title: 'Services — Yacht Concierge Montenegro',
    description: 'Comprehensive superyacht services: berth reservations, immigration clearance, provisioning, laundry, floristry, and maintenance in the Bay of Kotor.',
    url: 'https://yacht-concierge.me/services',
    breadcrumb: [{ name: 'Services', url: 'https://yacht-concierge.me/services' }],
  },
  provisioning: {
    title: 'Provisioning Shop — Yacht Concierge Montenegro',
    description: 'Order fresh produce, premium beverages, and duty-free provisions for delivery to your superyacht at Porto Montenegro or any Montenegrin berth.',
    url: 'https://yacht-concierge.me/provisioning',
    breadcrumb: [{ name: 'Provisioning', url: 'https://yacht-concierge.me/provisioning' }],
  },
  process: {
    title: 'How It Works — Yacht Concierge Montenegro',
    description: 'A 4-phase operational protocol for seamless superyacht arrivals. From first contact to departure briefing — 24-hour response SLA guaranteed.',
    url: 'https://yacht-concierge.me/process',
    breadcrumb: [{ name: 'How It Works', url: 'https://yacht-concierge.me/process' }],
  },
  fleet: {
    title: 'Berths & Fleet Tiers — Yacht Concierge Montenegro',
    description: 'Service tiers for superyachts from 30m to 120m+ in Montenegrin marinas. Berth availability and tailored packages at Porto Montenegro, Herceg Novi, and Bar.',
    url: 'https://yacht-concierge.me/fleet',
    breadcrumb: [{ name: 'Berths', url: 'https://yacht-concierge.me/fleet' }],
  },
  contact: {
    title: 'Request a Quote — Yacht Concierge Montenegro',
    description: 'Submit your vessel details and arrival date. Our operations team responds within 24 hours with a full service proposal.',
    url: 'https://yacht-concierge.me/contact',
    breadcrumb: [{ name: 'Contact', url: 'https://yacht-concierge.me/contact' }],
  },
  about: {
    title: 'About — Yacht Concierge Montenegro',
    description: 'The operational arm of Montenegro Charter. Nine seasons serving superyachts on the Adriatic — one dedicated desk for berths, customs, provisioning, and crew logistics.',
    url: 'https://yacht-concierge.me/about',
    breadcrumb: [{ name: 'About', url: 'https://yacht-concierge.me/about' }],
  },
  legal: {
    title: 'Legal Notice — Yacht Concierge Montenegro',
    description: 'Legal notice, company registration details, and dispute resolution information for Yacht Concierge D.O.O., Tivat, Montenegro.',
    url: 'https://yacht-concierge.me/legal',
    breadcrumb: [{ name: 'Legal Notice', url: 'https://yacht-concierge.me/legal' }],
  },
  privacy: {
    title: 'Privacy Policy — Yacht Concierge Montenegro',
    description: 'How Yacht Concierge D.O.O. collects, processes, and protects personal data in accordance with GDPR and Montenegrin data protection law.',
    url: 'https://yacht-concierge.me/privacy',
    breadcrumb: [{ name: 'Privacy Policy', url: 'https://yacht-concierge.me/privacy' }],
  },
  terms: {
    title: 'Terms of Service — Yacht Concierge Montenegro',
    description: 'Terms and conditions governing superyacht concierge and logistics services provided by Yacht Concierge D.O.O. in Montenegrin waters.',
    url: 'https://yacht-concierge.me/terms',
    breadcrumb: [{ name: 'Terms of Service', url: 'https://yacht-concierge.me/terms' }],
  },
  'service-berth': {
    title: 'Berth Reservations — Yacht Concierge Montenegro',
    description: 'Priority berth reservations at Porto Montenegro, Herceg Novi, Kotor, Budva, and Bar. 24-hour confirmation with customs coordination included.',
    url: 'https://yacht-concierge.me/services/berth',
    breadcrumb: [{ name: 'Services', url: 'https://yacht-concierge.me/services' }, { name: 'Berth Reservations', url: 'https://yacht-concierge.me/services/berth' }],
  },
  'service-customs': {
    title: 'Customs & Immigration — Yacht Concierge Montenegro',
    description: 'Full Montenegrin customs and immigration clearance for superyachts. All documentation handled from your berth — no agent handoffs, no delays.',
    url: 'https://yacht-concierge.me/services/customs',
    breadcrumb: [{ name: 'Services', url: 'https://yacht-concierge.me/services' }, { name: 'Customs & Immigration', url: 'https://yacht-concierge.me/services/customs' }],
  },
  'service-provisioning': {
    title: 'Provisioning — Yacht Concierge Montenegro',
    description: 'Galley-standard provisioning for superyachts in Montenegro. Fresh produce, premium beverages, and duty-free procurement with same-day berth delivery.',
    url: 'https://yacht-concierge.me/services/provisioning',
    breadcrumb: [{ name: 'Services', url: 'https://yacht-concierge.me/services' }, { name: 'Provisioning', url: 'https://yacht-concierge.me/services/provisioning' }],
  },
  'service-laundry': {
    title: 'Laundry & Valeting — Yacht Concierge Montenegro',
    description: 'Professional laundry, dry cleaning, and uniform care for superyacht crews. Berth collection and same-day return at Porto Montenegro and partner marinas.',
    url: 'https://yacht-concierge.me/services/laundry',
    breadcrumb: [{ name: 'Services', url: 'https://yacht-concierge.me/services' }, { name: 'Laundry & Valeting', url: 'https://yacht-concierge.me/services/laundry' }],
  },
  'service-floristry': {
    title: 'Floristry — Yacht Concierge Montenegro',
    description: 'Fresh floral arrangements for superyachts at Montenegrin marinas. Daily-sourced local flowers with charter-standard presentation and berth delivery.',
    url: 'https://yacht-concierge.me/services/floristry',
    breadcrumb: [{ name: 'Services', url: 'https://yacht-concierge.me/services' }, { name: 'Floristry', url: 'https://yacht-concierge.me/services/floristry' }],
  },
  'service-maintenance': {
    title: 'Maintenance Coordination — Yacht Concierge Montenegro',
    description: 'Scheduled and emergency maintenance for superyachts in Montenegro. One point of contact, vetted local contractors, full progress reporting.',
    url: 'https://yacht-concierge.me/services/maintenance',
    breadcrumb: [{ name: 'Services', url: 'https://yacht-concierge.me/services' }, { name: 'Maintenance', url: 'https://yacht-concierge.me/services/maintenance' }],
  },
};

const OG_IMAGE  = 'https://yacht-concierge.me/og-image.jpg';
const SITE_NAME = 'Yacht Concierge Montenegro';
const SITE_URL  = 'https://yacht-concierge.me';

// ── Schema.org — LocalBusiness ────────────────────────────────────────────────

const LOCAL_BUSINESS_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'ProfessionalService'],
  '@id': `${SITE_URL}/#business`,
  name: 'Yacht Concierge Montenegro',
  legalName: 'Yacht Concierge D.O.O.',
  description: 'Full-service superyacht concierge and logistics operator in Montenegro.',
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  image: OG_IMAGE,
  telephone: '+38267144555',
  email: 'info@yacht-concierge.me',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Pomorska ulica, Zgrada Baia',
    addressLocality: 'Tivat',
    postalCode: '85320',
    addressCountry: 'ME',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 42.4330, longitude: 18.6881 },
  openingHoursSpecification: [{
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
    opens: '06:00', closes: '22:00',
  }],
  priceRange: '€€€€',
  currenciesAccepted: 'EUR',
  areaServed: [
    { '@type': 'City', name: 'Tivat' },
    { '@type': 'City', name: 'Porto Montenegro' },
    { '@type': 'City', name: 'Herceg Novi' },
    { '@type': 'City', name: 'Kotor' },
    { '@type': 'City', name: 'Bar' },
    { '@type': 'Country', name: 'Montenegro' },
  ],
  sameAs: ['https://montenegrocharter.com'],
};

const WEBSITE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: SITE_URL,
  publisher: { '@id': `${SITE_URL}/#business` },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const HELMET_ATTR = 'data-yc-helmet';

function setOrCreate(selector, attrs, content) {
  let el = document.head.querySelector(`${selector}[${HELMET_ATTR}]`);
  if (!el) {
    // Try to find existing non-helmet tag of same type first
    el = document.head.querySelector(selector);
    if (el && !el.getAttribute(HELMET_ATTR)) {
      // Tag exists but not managed by us — create a new managed one
      el = null;
    }
  }
  if (!el) {
    const tag = selector.split('[')[0];
    el = document.createElement(tag);
    el.setAttribute(HELMET_ATTR, 'true');
    document.head.appendChild(el);
  }
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  if (content !== undefined) el.textContent = content;
  return el;
}

function removeHelmetTags() {
  document.head.querySelectorAll(`[${HELMET_ATTR}]`).forEach(el => el.remove());
}

function buildBreadcrumb(crumbs) {
  if (!crumbs || crumbs.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      ...crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 2, name: c.name, item: c.url })),
    ],
  };
}

// ── PageSEO component ─────────────────────────────────────────────────────────

export function PageSEO({ page, id }) {
  const key  = page === 'service' ? `service-${id}` : page;
  const data = SEO_DATA[key] || SEO_DATA.home;
  const breadcrumb = buildBreadcrumb(data.breadcrumb);

  useEffect(() => {
    // Title
    document.title = data.title;

    // Remove all previously managed tags
    removeHelmetTags();

    // Meta description
    setOrCreate('meta[name="description"]', { name: 'description', content: data.description });

    // Canonical
    setOrCreate('link[rel="canonical"]', { rel: 'canonical', href: data.url });

    // hreflang
    [['en', data.url], ['ru', data.url], ['it', data.url], ['x-default', data.url]].forEach(([lang, url]) => {
      const el = document.createElement('link');
      el.setAttribute('rel', 'alternate');
      el.setAttribute('hreflang', lang);
      el.setAttribute('href', url);
      el.setAttribute(HELMET_ATTR, 'true');
      document.head.appendChild(el);
    });

    // Open Graph
    [
      ['og:title',        data.title],
      ['og:description',  data.description],
      ['og:url',          data.url],
      ['og:type',         'website'],
      ['og:site_name',    SITE_NAME],
      ['og:image',        OG_IMAGE],
      ['og:image:width',  '1200'],
      ['og:image:height', '630'],
    ].forEach(([prop, content]) => {
      const el = document.createElement('meta');
      el.setAttribute('property', prop);
      el.setAttribute('content', content);
      el.setAttribute(HELMET_ATTR, 'true');
      document.head.appendChild(el);
    });

    // Twitter Card
    [
      ['twitter:card',        'summary_large_image'],
      ['twitter:title',       data.title],
      ['twitter:description', data.description],
      ['twitter:image',       OG_IMAGE],
    ].forEach(([name, content]) => {
      setOrCreate(`meta[name="${name}"]`, { name, content });
    });

    // Schema.org — LocalBusiness + WebSite (every page)
    [LOCAL_BUSINESS_SCHEMA, WEBSITE_SCHEMA, ...(breadcrumb ? [breadcrumb] : [])].forEach(schema => {
      const el = document.createElement('script');
      el.setAttribute('type', 'application/ld+json');
      el.setAttribute(HELMET_ATTR, 'true');
      el.textContent = JSON.stringify(schema);
      document.head.appendChild(el);
    });

    return () => {
      // Cleanup on unmount
      removeHelmetTags();
    };
  }, [page, id]);

  return null;
}
