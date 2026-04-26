import React from 'react';
import { Helmet } from 'react-helmet-async';

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
  // ── Service detail pages ──────────────────────────────────────────────────
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

// ── Schema.org — LocalBusiness (injected on every page) ───────────────────────

const LOCAL_BUSINESS_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'ProfessionalService'],
  '@id': `${SITE_URL}/#business`,
  name: 'Yacht Concierge Montenegro',
  legalName: 'Yacht Concierge D.O.O.',
  description: 'Full-service superyacht concierge and logistics operator in Montenegro. Berth reservations, customs and immigration clearance, provisioning, crew logistics, laundry, floristry, and maintenance coordination for vessels from 30 to 120 metres across five Montenegrin marinas.',
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
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 42.4330,
    longitude: 18.6881,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
      opens: '06:00',
      closes: '22:00',
    },
  ],
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
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Superyacht Concierge Services',
    itemListElement: [
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Berth Reservations', description: 'Priority berth reservations at Porto Montenegro, Herceg Novi, Kotor, and Bar.' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Customs & Immigration Clearance', description: 'Full Montenegrin customs and immigration documentation and clearance for arriving superyachts.' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Provisioning', description: 'Galley-standard provisioning with same-day delivery to berth. Tax-free procurement for yachts in transit.' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Crew Logistics', description: 'Airport transfers, accommodation, and crew rotation management in Montenegro.' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Laundry & Valeting', description: 'Professional laundry, dry cleaning, and uniform care with berth collection and return.' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Floristry', description: 'Fresh floral arrangements sourced daily from local Montenegrin suppliers.' } },
      { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Maintenance Coordination', description: 'Scheduled and emergency maintenance coordination with vetted local contractors.' } },
    ],
  },
  parentOrganization: {
    '@type': 'Organization',
    '@id': 'https://montenegrocharter.com/#organization',
    name: 'Montenegro Charter',
    url: 'https://montenegrocharter.com',
  },
  employee: [
    {
      '@type': 'Person',
      name: 'Iva Erceg',
      jobTitle: 'Operations Director',
      telephone: '+38267144555',
      email: 'info@yacht-concierge.me',
    },
  ],
  sameAs: [
    'https://montenegrocharter.com',
  ],
};

// ── Schema.org — WebSite (sitelinks searchbox signal) ────────────────────────

const WEBSITE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: SITE_NAME,
  url: SITE_URL,
  publisher: { '@id': `${SITE_URL}/#business` },
};

// ── Schema.org — BreadcrumbList (per page) ────────────────────────────────────

function buildBreadcrumb(crumbs) {
  if (!crumbs || crumbs.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
      ...crumbs.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 2,
        name: c.name,
        item: c.url,
      })),
    ],
  };
}

// ── PageSEO component ─────────────────────────────────────────────────────────

export function PageSEO({ page, id }) {
  const key        = page === 'service' ? `service-${id}` : page;
  const data       = SEO_DATA[key] || SEO_DATA.home;
  const breadcrumb = buildBreadcrumb(data.breadcrumb);

  return (
    <Helmet>
      <title>{data.title}</title>
      <meta name="description" content={data.description} />
      <link rel="canonical" href={data.url} />

      {/* hreflang — multilingual content, same URL for all languages */}
      <link rel="alternate" hreflang="en"       href={data.url} />
      <link rel="alternate" hreflang="ru"       href={data.url} />
      <link rel="alternate" hreflang="it"       href={data.url} />
      <link rel="alternate" hreflang="x-default" href={data.url} />

      {/* Open Graph */}
      <meta property="og:title"       content={data.title} />
      <meta property="og:description" content={data.description} />
      <meta property="og:url"         content={data.url} />
      <meta property="og:type"        content="website" />
      <meta property="og:site_name"   content={SITE_NAME} />
      <meta property="og:image"       content={OG_IMAGE} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:title"       content={data.title} />
      <meta name="twitter:description" content={data.description} />
      <meta name="twitter:image"       content={OG_IMAGE} />

      {/* Schema.org — LocalBusiness + WebSite (every page) */}
      <script type="application/ld+json">
        {JSON.stringify(LOCAL_BUSINESS_SCHEMA)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(WEBSITE_SCHEMA)}
      </script>

      {/* Schema.org — BreadcrumbList (all pages except home) */}
      {breadcrumb && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumb)}
        </script>
      )}
    </Helmet>
  );
}
