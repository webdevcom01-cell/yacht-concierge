import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO_DATA = {
  home: {
    title: 'Yacht Concierge Montenegro — Superyacht Logistics, Adriatic',
    description: 'Full-service concierge for superyachts in Montenegro. Berth reservations, customs, provisioning, and crew logistics at Porto Montenegro, Herceg Novi, and Bar.',
    url: 'https://yacht-concierge.me/',
  },
  services: {
    title: 'Services — Yacht Concierge Montenegro',
    description: 'Comprehensive superyacht services: berth reservations, immigration clearance, provisioning, laundry, floristry, and maintenance in the Bay of Kotor.',
    url: 'https://yacht-concierge.me/services',
  },
  provisioning: {
    title: 'Provisioning Shop — Yacht Concierge Montenegro',
    description: 'Order fresh produce, premium beverages, and duty-free provisions for delivery to your superyacht at Porto Montenegro or any Montenegrin berth.',
    url: 'https://yacht-concierge.me/provisioning',
  },
  process: {
    title: 'How It Works — Yacht Concierge Montenegro',
    description: 'A 6-step operational protocol for seamless superyacht arrivals. From first contact to departure briefing — 24-hour response SLA guaranteed.',
    url: 'https://yacht-concierge.me/process',
  },
  fleet: {
    title: 'Berths & Fleet Tiers — Yacht Concierge Montenegro',
    description: 'Berth availability and service tiers for superyachts from 30m to 120m+ in Montenegrin marinas. Real-time availability calendar.',
    url: 'https://yacht-concierge.me/fleet',
  },
  contact: {
    title: 'Request a Quote — Yacht Concierge Montenegro',
    description: 'Submit your vessel details and arrival date. Our operations team responds within 24 hours with a full service proposal.',
    url: 'https://yacht-concierge.me/contact',
  },
  legal: {
    title: 'Legal Notice — Yacht Concierge Montenegro',
    description: 'Legal notice, company registration details, and dispute resolution information for Yacht Concierge D.O.O., Tivat, Montenegro.',
    url: 'https://yacht-concierge.me/legal',
  },
  privacy: {
    title: 'Privacy Policy — Yacht Concierge Montenegro',
    description: 'How Yacht Concierge D.O.O. collects, processes, and protects personal data in accordance with GDPR and Montenegrin data protection law.',
    url: 'https://yacht-concierge.me/privacy',
  },
  terms: {
    title: 'Terms of Service — Yacht Concierge Montenegro',
    description: 'Terms and conditions governing superyacht concierge and logistics services provided by Yacht Concierge D.O.O. in Montenegrin waters.',
    url: 'https://yacht-concierge.me/terms',
  },
};

const OG_IMAGE = 'https://yacht-concierge.me/og-image.jpg';
const SITE_NAME = 'Yacht Concierge Montenegro';

export function PageSEO({ page }) {
  const data = SEO_DATA[page] || SEO_DATA.home;
  return (
    <Helmet>
      <title>{data.title}</title>
      <meta name="description" content={data.description} />
      <link rel="canonical" href={data.url} />
      <meta property="og:title" content={data.title} />
      <meta property="og:description" content={data.description} />
      <meta property="og:url" content={data.url} />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:image" content={OG_IMAGE} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={data.title} />
      <meta name="twitter:description" content={data.description} />
      <meta name="twitter:image" content={OG_IMAGE} />
    </Helmet>
  );
}
