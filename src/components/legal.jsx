import React from 'react';
import { Reveal } from './shared';

// ─── Shared prose shell ───────────────────────────────────────────────────────
function LegalShell({ eyebrow, title, updated, children }) {
  return (
    <main className="page-top" style={{ paddingBottom: 120 }}>
      <div className="container">
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <Reveal>
            <div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 24 }}>
              ↳ {eyebrow}
            </div>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="h1" style={{ marginBottom: 16 }}>{title}</h1>
          </Reveal>
          <Reveal delay={120}>
            <div className="mono" style={{ color: 'var(--fg-50)', marginBottom: 64 }}>
              Last updated: {updated}
            </div>
          </Reveal>
          <Reveal delay={160}>
            <div className="legal-prose">
              {children}
            </div>
          </Reveal>
        </div>
      </div>
    </main>
  );
}

// ─── Legal Notice ─────────────────────────────────────────────────────────────
function LegalNoticePage() {
  return (
    <LegalShell eyebrow="LEGAL NOTICE" title="Legal Notice." updated="April 2026">
      <h2>Company Details</h2>
      <p>
        <strong>YACHT CONCIERGE D.O.O.</strong><br />
        Pomorska ulica, Zgrada Baia<br />
        Porto Montenegro<br />
        Tivat 85320, Montenegro
      </p>
      <p>
        <strong>Email:</strong>{' '}
        <a href="mailto:info@yacht-concierge.com">info@yacht-concierge.com</a><br />
        <strong>Phone:</strong> +382 67 144 555
      </p>

      <h2>Business Activity</h2>
      <p>
        Yacht Concierge D.O.O. provides maritime concierge and logistics coordination
        services for superyachts transiting Montenegrin waters. We act as a logistics
        coordinator and agent — not as a carrier, shipping agent, or maritime operator
        within the meaning of the Law on Maritime Navigation of Montenegro.
      </p>

      <h2>Regulation and Supervision</h2>
      <p>
        Commercial activities of this company are regulated under Montenegrin commercial
        law. Matters relating to personal data protection fall under the Law on Personal
        Data Protection of Montenegro (Official Gazette No. 079/17, amended by No. 070/21),
        aligned with Regulation (EU) 2016/679 (GDPR).
      </p>

      <h2>Disclaimer</h2>
      <p>
        The information published on this website is provided for general informational
        purposes. While we make every effort to keep content accurate and current, we
        accept no liability for errors, omissions, or outcomes arising from reliance on
        this information. Service availability, pricing, and operational parameters are
        confirmed only through written service briefs issued by our operations team.
      </p>
      <p>
        This website does not use tracking cookies. Aggregated, anonymised analytics are
        collected using Plausible Analytics, a privacy-respecting platform that does not
        store personal data or set cookies.
      </p>

      <h2>Online Dispute Resolution</h2>
      <p>
        The European Commission provides an Online Dispute Resolution (ODR) platform for
        consumers in EU/EEA member states:{' '}
        <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">
          https://ec.europa.eu/consumers/odr
        </a>. Our email address for this purpose is info@yacht-concierge.com.
      </p>
      <p>
        We are not obliged to participate in a consumer dispute resolution procedure before
        a consumer arbitration board, and do not voluntarily participate in such procedures.
      </p>

      <h2>Intellectual Property</h2>
      <p>
        All content on this website — including text, graphics, logos, and design — is the
        property of Yacht Concierge D.O.O. and is protected under applicable copyright law.
        Reproduction or distribution without prior written consent is prohibited.
      </p>
    </LegalShell>
  );
}

// ─── Privacy Policy ───────────────────────────────────────────────────────────
function PrivacyPage() {
  return (
    <LegalShell eyebrow="PRIVACY POLICY" title="Privacy Policy." updated="April 2026">
      <h2>1. Data Controller</h2>
      <p>
        <strong>YACHT CONCIERGE D.O.O.</strong><br />
        Pomorska ulica, Zgrada Baia, Porto Montenegro, Tivat 85320, Montenegro<br />
        Email: <a href="mailto:info@yacht-concierge.com">info@yacht-concierge.com</a>
      </p>
      <p>
        This Privacy Policy governs all personal data processed through our website,
        service request forms, and provisioning platform. It applies to captains, crew
        members, owners, and vessel managers who engage with our services.
      </p>

      <h2>2. Data We Collect</h2>
      <p>We collect the following categories of personal data:</p>
      <ul>
        <li>
          <strong>Contact data:</strong> name, email address, phone number, role
          (captain / manager / owner).
        </li>
        <li>
          <strong>Vessel data:</strong> yacht name, flag state, length overall (LOA),
          gross tonnage, MMSI, IMO number.
        </li>
        <li>
          <strong>Operational data:</strong> arrival and departure dates, ports of call,
          crew and guest count, berthing preferences.
        </li>
        <li>
          <strong>Service request data:</strong> provisioning orders, laundry requests,
          maintenance briefs, floristry specifications.
        </li>
        <li>
          <strong>Technical data:</strong> IP address and browser type retained in server
          logs for security purposes for up to 30 days. No cookies are set. Analytics
          are collected in aggregated, anonymised form using Plausible Analytics.
        </li>
      </ul>

      <h2>3. Legal Basis for Processing</h2>
      <p>We process your data on the following legal bases:</p>
      <ul>
        <li>
          <strong>Contract performance</strong> (Art. 6(1)(b) GDPR / Art. 12 LPDP):
          processing necessary to execute the services you request.
        </li>
        <li>
          <strong>Legitimate interests</strong> (Art. 6(1)(f) GDPR): maintaining client
          vessel files, operational record-keeping, and service quality improvement.
        </li>
        <li>
          <strong>Legal obligation</strong> (Art. 6(1)(c) GDPR): retaining financial
          records as required by Montenegrin accounting law.
        </li>
      </ul>

      <h2>4. Retention Periods</h2>
      <p>
        Active client files are retained for the duration of the service relationship.
        Following the last service engagement, data is retained for five (5) years in
        accordance with Montenegrin financial record-keeping requirements. Technical server
        logs are deleted after 30 days. Provisioning and order records are retained for
        five (5) years for accounting purposes.
      </p>

      <h2>5. Data Processors and International Transfers</h2>
      <p>
        We engage the following sub-processors who may process your data on our behalf:
      </p>
      <ul>
        <li>
          <strong>Google LLC</strong> (United States): Service request and quote data
          submitted through website forms is relayed to Google Sheets via Google Apps
          Script. Google participates in the EU–US Data Privacy Framework. Data is
          processed under Google's standard contractual clauses.
        </li>
        <li>
          <strong>Cloudflare, Inc.</strong> (United States): Website hosting and content
          delivery. Cloudflare participates in the EU–US Data Privacy Framework.
        </li>
        <li>
          <strong>Plausible Analytics</strong> (EU — servers in Germany): Cookieless,
          privacy-respecting web analytics. No personal data is collected or stored by
          Plausible.
        </li>
      </ul>

      <h2>6. Your Rights</h2>
      <p>
        Under the Law on Personal Data Protection of Montenegro (LPDP) and GDPR, you have
        the following rights:
      </p>
      <ul>
        <li><strong>Right of access</strong> — request a copy of your data.</li>
        <li><strong>Right to rectification</strong> — correct inaccurate or incomplete data.</li>
        <li><strong>Right to erasure</strong> — request deletion where data is no longer necessary.</li>
        <li><strong>Right to restriction</strong> — limit how we process your data.</li>
        <li><strong>Right to portability</strong> — receive your data in a structured, machine-readable format.</li>
        <li><strong>Right to object</strong> — object to processing based on legitimate interests.</li>
      </ul>
      <p>
        To exercise any of these rights, contact us at{' '}
        <a href="mailto:info@yacht-concierge.com">info@yacht-concierge.com</a>.
        We will respond within 30 days of receiving your request.
      </p>

      <h2>7. Supervisory Authority</h2>
      <p>
        If you believe your data has been processed unlawfully, you have the right to lodge
        a complaint with the Montenegrin data protection authority:
      </p>
      <p>
        <strong>Agencija za zaštitu ličnih podataka i slobodan pristup informacijama (AZLP)</strong><br />
        Karadžićeva 2, 81000 Podgorica, Montenegro<br />
        <a href="https://www.azlp.me" target="_blank" rel="noopener noreferrer">www.azlp.me</a>
      </p>

      <h2>8. Updates to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. The date at the top of this
        page indicates when it was last revised. Continued use of our website or services
        following any update constitutes acceptance of the revised policy.
      </p>
    </LegalShell>
  );
}

// ─── Terms of Service ─────────────────────────────────────────────────────────
function TermsPage() {
  return (
    <LegalShell eyebrow="TERMS OF SERVICE" title="Terms of Service." updated="April 2026">
      <h2>1. Scope of Services</h2>
      <p>
        Yacht Concierge D.O.O. ("we", "us", "the Company") provides maritime logistics
        coordination and concierge services for superyachts in Montenegrin waters. We act
        exclusively as a coordinator and agent. We are not a carrier, customs agent, ship
        chandler, or maritime operator within the meaning of Montenegrin maritime law.
        Responsibility for the vessel and its crew remains with the master at all times.
      </p>

      <h2>2. Service Engagement</h2>
      <p>
        Services commence upon the client's written acceptance of a Service Brief issued
        by our operations team. Verbal or email confirmations do not constitute a binding
        agreement. A Service Brief is valid for <strong>48 hours</strong> from the date of
        issue. After that period, pricing and availability must be reconfirmed.
      </p>
      <p>
        We endeavour to respond to all initial enquiries within <strong>24 hours</strong>{' '}
        during the primary season (April – November). Response times outside the primary
        season are best-effort and subject to staffing.
      </p>

      <h2>3. Payment</h2>
      <p>
        All services are priced and invoiced in <strong>Euros (€)</strong>. Payment is
        accepted by bank transfer to the Company's account. A proforma invoice is issued
        prior to service commencement; services begin upon receipt of the agreed deposit
        or full payment, as specified in the Service Brief.
      </p>
      <p>
        Cash payment is accepted on-site for ad hoc services only. All amounts are
        inclusive of Montenegrin VAT (PDV) where applicable.
      </p>

      <h2>4. Cancellation and Modification</h2>
      <p>
        Cancellations or material modifications must be communicated in writing to{' '}
        <a href="mailto:info@yacht-concierge.com">info@yacht-concierge.com</a>:
      </p>
      <ul>
        <li>More than 48 hours before service commencement: no charge.</li>
        <li>24 – 48 hours before commencement: 25% of the agreed fee for pre-coordinated services.</li>
        <li>Less than 24 hours before commencement: 50% of the agreed fee.</li>
        <li>Day of service (or after commencement): 100% of the agreed fee.</li>
      </ul>
      <p>
        Third-party costs already incurred (berth reservations, provisioning orders,
        customs fees, contractor deposits) are non-refundable regardless of the cancellation
        time frame.
      </p>

      <h2>5. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by applicable law, the Company shall not be liable
        for any indirect, incidental, consequential, or punitive damages — including loss
        of revenue, loss of use, or reputational damage — arising from or in connection
        with services provided under these Terms.
      </p>
      <p>
        Our aggregate liability for any claim arising from a single service engagement
        shall not exceed the fees paid by the client for that specific engagement.
      </p>
      <p>
        We are not responsible for delays, failures, or substandard performance caused by
        third-party service providers (marinas, customs authorities, suppliers, contractors)
        acting independently of our coordination.
      </p>

      <h2>6. Force Majeure</h2>
      <p>
        Neither party shall be liable for failure to perform obligations that is caused by
        circumstances beyond reasonable control, including but not limited to: severe weather,
        acts of government or port authority, customs delays, strikes, civil unrest, or other
        events of force majeure. The affected party must notify the other in writing as soon
        as practicable.
      </p>

      <h2>7. Confidentiality</h2>
      <p>
        We treat all client, vessel, and itinerary information as strictly confidential.
        Information is not shared with third parties except as necessary to deliver the
        requested services (marina operators, customs agents, approved suppliers). Each
        coordinator handles a limited number of vessel files and does not circulate client
        information internally beyond operational necessity.
      </p>

      <h2>8. Governing Law and Jurisdiction</h2>
      <p>
        These Terms are governed by and construed in accordance with the laws of Montenegro.
        Any dispute arising from or in connection with these Terms that cannot be resolved
        amicably shall be submitted to the exclusive jurisdiction of the competent court in
        Kotor, Montenegro.
      </p>

      <h2>9. Amendments</h2>
      <p>
        We reserve the right to amend these Terms at any time. The current version is
        published on this website with the date of last revision. Amendments do not affect
        Service Briefs already accepted prior to the date of amendment.
      </p>

      <h2>10. Contact</h2>
      <p>
        For any questions regarding these Terms, contact us at{' '}
        <a href="mailto:info@yacht-concierge.com">info@yacht-concierge.com</a> or
        +382 67 144 555.
      </p>
    </LegalShell>
  );
}

// ─── Exports ──────────────────────────────────────────────────────────────────
export { LegalNoticePage, PrivacyPage, TermsPage };
