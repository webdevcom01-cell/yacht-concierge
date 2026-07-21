import { useEffect } from 'react';
import { routeToPath } from './routes.js';

// ── SEO data per page, per language ────────────────────────────────────────────
// Translations confirmed by the client's translator without changes
// (yacht-concierge-seo-prevodi-na-proveru.md). Brand name "Yacht Concierge
// Montenegro" intentionally stays untranslated in ru/it, matching the existing
// site-wide convention (see locales/{en,ru,it}.json footer copyright line).
// Schema.org JSON-LD (LOCAL_BUSINESS_SCHEMA / WEBSITE_SCHEMA below) is
// intentionally NOT translated — that content was not part of the translated
// set and stays English-only on every language version, per an explicit
// scope decision confirmed with the client.

const SEO_KEY_TO_ROUTE = {
  home:                  { page: 'home' },
  services:              { page: 'services' },
  provisioning:          { page: 'provisioning' },
  bunkering:             { page: 'bunkering' },
  process:               { page: 'process' },
  fleet:                 { page: 'fleet' },
  contact:               { page: 'contact' },
  about:                 { page: 'about' },
  legal:                 { page: 'legal' },
  privacy:               { page: 'privacy' },
  terms:                 { page: 'terms' },
  'service-berth':         { page: 'service', id: 'berth' },
  'service-customs':       { page: 'service', id: 'customs' },
  'service-fuel':          { page: 'service', id: 'fuel' },
  'service-provisioning':  { page: 'service', id: 'provisioning' },
  'service-laundry':       { page: 'service', id: 'laundry' },
  'service-floristry':     { page: 'service', id: 'floristry' },
  'service-maintenance':   { page: 'service', id: 'maintenance' },
};

const OG_IMAGE  = 'https://yacht-concierge.me/og-image.jpg';
const SITE_NAME = 'Yacht Concierge Montenegro';
const SITE_URL  = 'https://yacht-concierge.me';

// Single source of truth for every URL used in this file — computed from the
// same routes.js module the router uses, so hreflang/canonical/breadcrumb
// URLs can never drift from the actual app routes (same principle as the
// routes.js extraction that already protects main.jsx).
function pageUrl(key, lang) {
  const route = SEO_KEY_TO_ROUTE[key];
  if (!route) return SITE_URL;
  return SITE_URL + routeToPath({ ...route, lang: lang === 'en' ? null : lang });
}

const HOME_NAME = { en: 'Home', ru: 'Главная', it: 'Home' }; // matches nav.ariaHome convention

const SEO_DATA = {
  home: {
    en: { title: 'Yacht Concierge Montenegro — Superyacht Logistics, Adriatic', description: 'Full-service concierge for superyachts in Montenegro. Berth reservations, customs, provisioning, and crew logistics at Porto Montenegro, Herceg Novi, Kotor, Budva, and Bar.' },
    ru: { title: 'Yacht Concierge Montenegro — логистика суперъяхт на Адриатике', description: 'Полный спектр консьерж-услуг для суперъяхт в Черногории. Резервирование причалов, таможенное оформление, снабжение и логистика для экипажа в Порто Монтенегро, Херцег-Нови, Которе, Будве и Баре.' },
    it: { title: 'Yacht Concierge Montenegro — Logistica per superyacht, Adriatico', description: "Concierge completo per superyacht in Montenegro. Prenotazione ormeggi, dogana, approvvigionamento e logistica dell'equipaggio a Porto Montenegro, Herceg Novi, Kotor, Budva e Bar." },
    breadcrumb: null,
  },
  services: {
    en: { title: 'Services — Yacht Concierge Montenegro', description: 'Comprehensive superyacht services: berth reservations, immigration clearance, fuel & bunkering, provisioning, laundry, floristry, and maintenance along the Montenegrin coast.' },
    ru: { title: 'Услуги — Yacht Concierge Montenegro', description: 'Полный спектр услуг для суперъяхт: резервирование причалов, иммиграционное оформление, топливо и бункеровка, снабжение, прачечная, флористика и техническое обслуживание вдоль побережья Черногории.' },
    it: { title: 'Servizi — Yacht Concierge Montenegro', description: 'Servizi completi per superyacht: prenotazione ormeggi, sdoganamento immigrazione, carburante e bunkeraggio, approvvigionamento, lavanderia, floristica e manutenzione lungo la costa montenegrina.' },
    breadcrumb: [{ key: 'services', name: { en: 'Services', ru: 'Услуги', it: 'Servizi' } }],
  },
  provisioning: {
    en: { title: 'Provisioning Catalogues — Yacht Concierge Montenegro', description: 'Request current price catalogues for superyacht provisioning in Montenegro — meat, seafood, dairy, bakery, pantry, specialty, and frozen lines, delivered to your berth.' },
    ru: { title: 'Каталоги снабжения — Yacht Concierge Montenegro', description: 'Запросите актуальные прайс-каталоги снабжения для суперъяхт в Черногории — мясо, морепродукты, молочная продукция, выпечка, бакалея, деликатесы и заморозка с доставкой к причалу.' },
    it: { title: 'Cataloghi di approvvigionamento — Yacht Concierge Montenegro', description: "Richiedete i cataloghi prezzi aggiornati per l'approvvigionamento di superyacht in Montenegro — carne, pesce, latticini, panetteria, dispensa, specialità e surgelati, consegnati al vostro ormeggio." },
    breadcrumb: [{ key: 'provisioning', name: { en: 'Provisioning', ru: 'Снабжение', it: 'Approvvigionamento' } }],
  },
  bunkering: {
    en: { title: 'Fuel & Bunkering Request — Yacht Concierge Montenegro', description: 'Request duty-free diesel bunkering or standard-rate fuel for your superyacht in Montenegro — Porto Montenegro, Portonovi, Bar, Budva, and Kotor, with Luštica Bay routed to the nearest duty-free dock.' },
    ru: { title: 'Заявка на топливо и бункеровку — Yacht Concierge Montenegro', description: 'Запросите беспошлинную дизельную бункеровку или топливо по стандартному тарифу для вашей суперъяхты в Черногории — Порто Монтенегро, Портоново, Бар, Будва и Котор, с маршрутизацией из Луштица Бэй на ближайший беспошлинный терминал.' },
    it: { title: 'Richiesta carburante e bunkeraggio — Yacht Concierge Montenegro', description: 'Richiedete il bunkeraggio diesel duty-free o carburante a tariffa standard per il vostro superyacht in Montenegro — Porto Montenegro, Portonovi, Bar, Budva e Kotor, con instradamento da Luštica Bay al più vicino molo duty-free.' },
    breadcrumb: [{ key: 'bunkering', name: { en: 'Fuel & Bunkering', ru: 'Топливо и бункеровка', it: 'Carburante e Bunkeraggio' } }],
  },
  process: {
    en: { title: 'How It Works — Yacht Concierge Montenegro', description: 'A 4-phase operational protocol for seamless superyacht arrivals. From first contact to departure briefing — one named coordinator per vessel.' },
    ru: { title: 'Как это работает — Yacht Concierge Montenegro', description: 'Операционный протокол из 4 этапов для безупречного прибытия суперъяхты. От первого контакта до брифинга перед отходом — один именной координатор на каждое судно.' },
    it: { title: 'Come funziona — Yacht Concierge Montenegro', description: 'Un protocollo operativo in 4 fasi per arrivi impeccabili dei superyacht. Dal primo contatto al briefing di partenza — un coordinatore dedicato per ogni imbarcazione.' },
    breadcrumb: [{ key: 'process', name: { en: 'How It Works', ru: 'Как это работает', it: 'Come funziona' } }],
  },
  fleet: {
    en: { title: 'Berths & Fleet Tiers — Yacht Concierge Montenegro', description: 'Service tiers for superyachts from 24m to 120m+ in Montenegrin marinas. Berth availability and tailored packages at Porto Montenegro, Herceg Novi, Kotor, Budva, and Bar.' },
    ru: { title: 'Причалы и уровни флота — Yacht Concierge Montenegro', description: 'Уровни обслуживания для суперъяхт от 24 до 120+ метров в маринах Черногории. Наличие причалов и индивидуальные пакеты в Порто Монтенегро, Херцег-Нови, Которе, Будве и Баре.' },
    it: { title: 'Ormeggi e categorie flotta — Yacht Concierge Montenegro', description: 'Livelli di servizio per superyacht da 24m a 120m+ nelle marine montenegrine. Disponibilità di ormeggi e pacchetti su misura a Porto Montenegro, Herceg Novi, Kotor, Budva e Bar.' },
    breadcrumb: [{ key: 'fleet', name: { en: 'Berths', ru: 'Причалы', it: 'Ormeggi' } }],
  },
  contact: {
    en: { title: 'Request a Quote — Yacht Concierge Montenegro', description: 'Submit your vessel details and arrival date. Our operations team responds promptly with a full service proposal.' },
    ru: { title: 'Запросить предложение — Yacht Concierge Montenegro', description: 'Отправьте данные судна и дату прибытия. Наша операционная команда оперативно ответит с полным предложением по услугам.' },
    it: { title: 'Richiedi un preventivo — Yacht Concierge Montenegro', description: "Inviate i dettagli dell'imbarcazione e la data di arrivo. Il nostro team operativo risponderà tempestivamente con una proposta di servizio completa." },
    breadcrumb: [{ key: 'contact', name: { en: 'Contact', ru: 'Контакты', it: 'Contatti' } }],
  },
  about: {
    en: { title: 'About — Yacht Concierge Montenegro', description: 'A dedicated shore-side desk for superyachts on the Adriatic, built on years of hands-on experience in Montenegrin waters — one team for berths, customs, provisioning, and crew logistics.' },
    ru: { title: 'О нас — Yacht Concierge Montenegro', description: 'Выделенный береговой офис для суперъяхт на Адриатике, построенный на многолетнем практическом опыте работы в водах Черногории — одна команда для причалов, таможни, снабжения и логистики экипажа.' },
    it: { title: 'Chi siamo — Yacht Concierge Montenegro', description: "Un desk dedicato a terra per superyacht sull'Adriatico, costruito su anni di esperienza diretta nelle acque montenegrine — un unico team per ormeggi, dogana, approvvigionamento e logistica dell'equipaggio." },
    breadcrumb: [{ key: 'about', name: { en: 'About', ru: 'О нас', it: 'Chi siamo' } }],
  },
  legal: {
    en: { title: 'Legal Notice — Yacht Concierge Montenegro', description: 'Legal notice, company details, and dispute resolution information for Yacht Concierge Montenegro, Tivat.' },
    ru: { title: 'Юридическая информация — Yacht Concierge Montenegro', description: 'Юридическая информация, реквизиты компании и порядок разрешения споров для Yacht Concierge Montenegro, Тиват.' },
    it: { title: 'Note legali — Yacht Concierge Montenegro', description: 'Note legali, dati societari e informazioni sulla risoluzione delle controversie per Yacht Concierge Montenegro, Tivat.' },
    breadcrumb: [{ key: 'legal', name: { en: 'Legal Notice', ru: 'Юридическая информация', it: 'Note legali' } }],
  },
  privacy: {
    en: { title: 'Privacy Policy — Yacht Concierge Montenegro', description: 'How Yacht Concierge Montenegro collects, processes, and protects personal data in accordance with GDPR and Montenegrin data protection law.' },
    ru: { title: 'Политика конфиденциальности — Yacht Concierge Montenegro', description: 'Как Yacht Concierge Montenegro собирает, обрабатывает и защищает персональные данные в соответствии с GDPR и законодательством Черногории о защите данных.' },
    it: { title: 'Informativa sulla privacy — Yacht Concierge Montenegro', description: 'Come Yacht Concierge Montenegro raccoglie, elabora e protegge i dati personali in conformità al GDPR e alla legge montenegrina sulla protezione dei dati.' },
    breadcrumb: [{ key: 'privacy', name: { en: 'Privacy Policy', ru: 'Политика конфиденциальности', it: 'Informativa sulla privacy' } }],
  },
  terms: {
    en: { title: 'Terms of Service — Yacht Concierge Montenegro', description: 'Terms and conditions governing superyacht concierge and logistics services provided by Yacht Concierge Montenegro.' },
    ru: { title: 'Условия использования — Yacht Concierge Montenegro', description: 'Условия и положения, регулирующие консьерж- и логистические услуги для суперъяхт, предоставляемые Yacht Concierge Montenegro.' },
    it: { title: 'Termini di servizio — Yacht Concierge Montenegro', description: 'Termini e condizioni che disciplinano i servizi di concierge e logistica per superyacht forniti da Yacht Concierge Montenegro.' },
    breadcrumb: [{ key: 'terms', name: { en: 'Terms of Service', ru: 'Условия использования', it: 'Termini di servizio' } }],
  },
  'service-berth': {
    en: { title: 'Berth Reservations — Yacht Concierge Montenegro', description: 'Priority berth reservations at Porto Montenegro, Herceg Novi, Kotor, Budva, and Bar. Confirmation typically same day, with customs coordination included.' },
    ru: { title: 'Резервирование причалов — Yacht Concierge Montenegro', description: 'Приоритетное резервирование причалов в Порто Монтенегро, Херцег-Нови, Которе, Будве и Баре. Подтверждение обычно в тот же день, включая координацию с таможней.' },
    it: { title: 'Prenotazione ormeggi — Yacht Concierge Montenegro', description: 'Prenotazione prioritaria degli ormeggi a Porto Montenegro, Herceg Novi, Kotor, Budva e Bar. Conferma tipicamente in giornata, con coordinamento doganale incluso.' },
    breadcrumb: [
      { key: 'services', name: { en: 'Services', ru: 'Услуги', it: 'Servizi' } },
      { key: 'service-berth', name: { en: 'Berth Reservations', ru: 'Резервирование причалов', it: 'Prenotazione ormeggi' } },
    ],
  },
  'service-customs': {
    en: { title: 'Customs & Immigration — Yacht Concierge Montenegro', description: 'Full Montenegrin customs and immigration clearance for superyachts. All documentation handled from your berth — no agent handoffs, no delays.' },
    ru: { title: 'Таможня и иммиграция — Yacht Concierge Montenegro', description: 'Полное таможенное и иммиграционное оформление для суперъяхт в Черногории. Вся документация оформляется прямо у причала — без передачи между агентами и без задержек.' },
    it: { title: 'Dogana e immigrazione — Yacht Concierge Montenegro', description: 'Sdoganamento doganale e immigratorio completo in Montenegro per superyacht. Tutta la documentazione gestita direttamente dal vostro ormeggio — nessun passaggio tra agenti, nessun ritardo.' },
    breadcrumb: [
      { key: 'services', name: { en: 'Services', ru: 'Услуги', it: 'Servizi' } },
      { key: 'service-customs', name: { en: 'Customs & Immigration', ru: 'Таможня и иммиграция', it: 'Dogana e immigrazione' } },
    ],
  },
  'service-fuel': {
    en: { title: 'Fuel & Bunkering — Yacht Concierge Montenegro', description: 'Duty-free diesel bunkering for superyachts in Montenegro at Porto Montenegro, Portonovi, and Bar. Petrol and standard-rate fuel coordinated at Budva and Kotor, with Luštica Bay routed to the nearest duty-free dock.' },
    ru: { title: 'Топливо и бункеровка — Yacht Concierge Montenegro', description: 'Беспошлинная дизельная бункеровка для суперъяхт в Черногории в Порто Монтенегро, Портоново и Баре. Бензин и топливо по стандартному тарифу координируются в Будве и Которе, с маршрутизацией из Луштица Бэй на ближайший беспошлинный терминал.' },
    it: { title: 'Carburante e Bunkeraggio — Yacht Concierge Montenegro', description: 'Bunkeraggio diesel duty-free per superyacht in Montenegro a Porto Montenegro, Portonovi e Bar. Benzina e carburante a tariffa standard coordinati a Budva e Kotor, con instradamento da Luštica Bay al più vicino molo duty-free.' },
    breadcrumb: [
      { key: 'services', name: { en: 'Services', ru: 'Услуги', it: 'Servizi' } },
      { key: 'service-fuel', name: { en: 'Fuel & Bunkering', ru: 'Топливо и бункеровка', it: 'Carburante e Bunkeraggio' } },
    ],
  },
  'service-provisioning': {
    en: { title: 'Provisioning — Yacht Concierge Montenegro', description: 'Galley-standard provisioning for superyachts in Montenegro. Fresh produce, premium beverages, and duty-free procurement — same-day berth delivery for locally sourced items.' },
    ru: { title: 'Снабжение — Yacht Concierge Montenegro', description: 'Снабжение камбуза высшего стандарта для суперъяхт в Черногории. Свежие продукты, премиальные напитки и беспошлинные закупки — доставка к причалу в день заказа для товаров местного происхождения.' },
    it: { title: 'Approvvigionamento — Yacht Concierge Montenegro', description: "Approvvigionamento di livello galley per superyacht in Montenegro. Prodotti freschi, bevande premium e acquisti duty-free — consegna in giornata all'ormeggio per gli articoli di provenienza locale." },
    breadcrumb: [
      { key: 'services', name: { en: 'Services', ru: 'Услуги', it: 'Servizi' } },
      { key: 'service-provisioning', name: { en: 'Provisioning', ru: 'Снабжение', it: 'Approvvigionamento' } },
    ],
  },
  'service-laundry': {
    en: { title: 'Laundry & Linen — Yacht Concierge Montenegro', description: 'Professional laundry, dry cleaning, and uniform care for superyacht crews. Berth collection and next-day return at Porto Montenegro and partner marinas.' },
    ru: { title: 'Прачечная и бельё — Yacht Concierge Montenegro', description: 'Профессиональная стирка, химчистка и уход за формой экипажа суперъяхт. Забор у причала и возврат на следующий день в Порто Монтенегро и партнёрских маринах.' },
    it: { title: 'Lavanderia e biancheria — Yacht Concierge Montenegro', description: "Lavanderia professionale, lavaggio a secco e cura delle divise per gli equipaggi di superyacht. Ritiro all'ormeggio e riconsegna il giorno successivo a Porto Montenegro e nelle marine partner." },
    breadcrumb: [
      { key: 'services', name: { en: 'Services', ru: 'Услуги', it: 'Servizi' } },
      { key: 'service-laundry', name: { en: 'Laundry & Linen', ru: 'Прачечная и бельё', it: 'Lavanderia e biancheria' } },
    ],
  },
  'service-floristry': {
    en: { title: 'Floristry — Yacht Concierge Montenegro', description: 'Fresh floral arrangements for superyachts at Montenegrin marinas. Daily-sourced local flowers with charter-standard presentation and berth delivery.' },
    ru: { title: 'Флористика — Yacht Concierge Montenegro', description: 'Свежие цветочные композиции для суперъяхт в маринах Черногории. Ежедневно закупаемые местные цветы с презентацией чартерного уровня и доставкой к причалу.' },
    it: { title: 'Floristica — Yacht Concierge Montenegro', description: "Composizioni floreali fresche per superyacht nelle marine montenegrine. Fiori locali riforniti quotidianamente con presentazione da charter e consegna all'ormeggio." },
    breadcrumb: [
      { key: 'services', name: { en: 'Services', ru: 'Услуги', it: 'Servizi' } },
      { key: 'service-floristry', name: { en: 'Floristry', ru: 'Флористика', it: 'Floristica' } },
    ],
  },
  'service-maintenance': {
    en: { title: 'Maintenance Coordination — Yacht Concierge Montenegro', description: 'Scheduled and emergency maintenance for superyachts in Montenegro. One point of contact, vetted local contractors, full progress reporting.' },
    ru: { title: 'Координация технического обслуживания — Yacht Concierge Montenegro', description: 'Плановое и экстренное техническое обслуживание для суперъяхт в Черногории. Единая точка контакта, проверенные местные подрядчики, полная отчётность о ходе работ.' },
    it: { title: 'Coordinamento manutenzione — Yacht Concierge Montenegro', description: "Manutenzione programmata e d'emergenza per superyacht in Montenegro. Un unico punto di contatto, appaltatori locali verificati, reportistica completa sull'avanzamento." },
    // Breadcrumb name uses the shorter form, matching the existing EN breadcrumb
    // convention ("Maintenance", not the full page title) — confirmed by the translator.
    breadcrumb: [
      { key: 'services', name: { en: 'Services', ru: 'Услуги', it: 'Servizi' } },
      { key: 'service-maintenance', name: { en: 'Maintenance', ru: 'Обслуживание', it: 'Manutenzione' } },
    ],
  },
};

const NOT_FOUND_DATA = {
  en: { title: 'Page Not Found — Yacht Concierge Montenegro', description: 'The page you are looking for does not exist. Return to the homepage for superyacht concierge services in Montenegro.' },
  ru: { title: 'Страница не найдена — Yacht Concierge Montenegro', description: 'Запрашиваемая страница не существует. Вернитесь на главную страницу консьерж-услуг для суперъяхт в Черногории.' },
  it: { title: 'Pagina non trovata — Yacht Concierge Montenegro', description: 'La pagina richiesta non esiste. Tornate alla home page dei servizi di concierge per superyacht in Montenegro.' },
};

// ── Schema.org — LocalBusiness (English only — see note at top of file) ────────

const LOCAL_BUSINESS_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'ProfessionalService'],
  '@id': `${SITE_URL}/#business`,
  name: 'Yacht Concierge Montenegro',
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
    opens: '00:00', closes: '23:59',
  }],
  priceRange: '€€€€',
  currenciesAccepted: 'EUR',
  areaServed: [
    { '@type': 'City', name: 'Tivat' },
    { '@type': 'City', name: 'Herceg Novi' },
    { '@type': 'City', name: 'Kotor' },
    { '@type': 'City', name: 'Budva' },
    { '@type': 'City', name: 'Bar' },
    { '@type': 'Country', name: 'Montenegro' },
  ],
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
const HREFLANG_VALUES = ['en', 'ru', 'it']; // + x-default, handled separately below

function setOrCreate(selector, attrs, content) {
  // Prefer a tag we manage; otherwise ADOPT the existing static tag in place
  // (index.html ships a static <meta description> for crawlers that don't run
  // JS — updating it avoids shipping two description tags per page).
  let el = document.head.querySelector(`${selector}[${HELMET_ATTR}]`) ||
           document.head.querySelector(selector);
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

function buildBreadcrumb(crumbs, lang) {
  if (!crumbs || crumbs.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: HOME_NAME[lang] || HOME_NAME.en, item: pageUrl('home', lang) },
      ...crumbs.map((c, i) => ({
        '@type': 'ListItem',
        position: i + 2,
        name: c.name[lang] || c.name.en,
        item: pageUrl(c.key, lang),
      })),
    ],
  };
}

// hreflang alternates tell crawlers every language version of the current
// page exists and how they relate — a prerequisite for the ru/it URLs (Phase
// 1) to be picked up as intentional translations rather than duplicate
// content. x-default points at the unprefixed English URL (site default).
function setHreflangLinks(key) {
  HREFLANG_VALUES.forEach(l => {
    setOrCreate(`link[rel="alternate"][hreflang="${l}"]`, { rel: 'alternate', hreflang: l, href: pageUrl(key, l) });
  });
  setOrCreate('link[rel="alternate"][hreflang="x-default"]', { rel: 'alternate', hreflang: 'x-default', href: pageUrl(key, 'en') });
}

// ── PageSEO component ─────────────────────────────────────────────────────────

export function PageSEO({ page, id, lang = 'en' }) {
  const key      = page === 'service' ? `service-${id}` : page;
  const entry    = SEO_DATA[key];
  const notFound = !entry;
  const data     = notFound ? (NOT_FOUND_DATA[lang] || NOT_FOUND_DATA.en) : (entry[lang] || entry.en);
  const url      = notFound ? SITE_URL : pageUrl(key, lang);
  const breadcrumb = notFound ? null : buildBreadcrumb(entry.breadcrumb, lang);

  useEffect(() => {
    // Title
    document.title = data.title;

    // Remove all previously managed tags
    removeHelmetTags();

    // Meta description
    setOrCreate('meta[name="description"]', { name: 'description', content: data.description });

    if (notFound) {
      // Unknown route: the SPA host returns 200, so tell crawlers explicitly
      // not to index this soft-404 — and skip canonical/hreflang/OG/schema entirely.
      setOrCreate('meta[name="robots"]', { name: 'robots', content: 'noindex' });
      return () => removeHelmetTags();
    }

    // Canonical — points at the CURRENT language's own URL (not always
    // English), since each language version is now a distinct, indexable URL.
    setOrCreate('link[rel="canonical"]', { rel: 'canonical', href: url });

    // hreflang alternates — one per supported language plus x-default
    setHreflangLinks(key);

    // Open Graph — adopts the static tags shipped in index.html (updated in
    // place per route; scrapers that don't run JS see the static site-wide set)
    [
      ['og:title',        data.title],
      ['og:description',  data.description],
      ['og:url',          url],
      ['og:type',         'website'],
      ['og:site_name',    SITE_NAME],
      ['og:image',        OG_IMAGE],
      ['og:image:width',  '1200'],
      ['og:image:height', '630'],
    ].forEach(([prop, content]) => {
      setOrCreate(`meta[property="${prop}"]`, { property: prop, content });
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

    // Schema.org — LocalBusiness + WebSite (every page, English only — see
    // note at top of file) + BreadcrumbList (localized, when present)
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
  }, [page, id, lang]);

  return null;
}
