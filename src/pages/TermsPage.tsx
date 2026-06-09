import LegalPageLayout from "../components/layout/LegalPageLayout";

const termsSections = [
  {
    title: "1. Acceptance of These Terms",
    body: [
      "These Terms and Conditions of Use govern your access to and use of QWIK.NG, including our website, mobile experiences, marketplace tools, communication features, advertising services, verification services, and related support channels.",
      "By creating an account, browsing listings, posting an advert, contacting a seller, making an offer, using paid promotional tools, or otherwise using QWIK.NG, you confirm that you have read, understood, and agreed to these Terms of Use and our Privacy Policy.",
      "If you do not agree to these Terms, you must not access or use QWIK.NG."
    ]
  },
  {
    title: "2. About QWIK.NG",
    body: [
      "QWIK.NG ONLINE MARKETPLACE NIG. LTD operates an online marketplace that allows users to discover, post, promote, and respond to classified advertisements for products, services, jobs, properties, vehicles, electronics, phones, furniture, fashion, beauty, and other permitted marketplace categories.",
      "QWIK.NG is a marketplace platform. Unless expressly stated otherwise, QWIK.NG is not the seller, buyer, employer, landlord, agent, payment processor, delivery provider, guarantor, or party to transactions arranged between users."
    ]
  },
  {
    title: "3. Eligibility and Account Registration",
    body: [
      "You must be at least 18 years old, or the age of legal majority in your jurisdiction, to create an account or use QWIK.NG for transactions.",
      "You agree to provide accurate, current, and complete information during registration and to keep your account information updated.",
      "You are responsible for maintaining the confidentiality of your login credentials and for all activity that occurs under your account.",
      "QWIK.NG may suspend, restrict, or terminate accounts that contain false information, impersonate another person or business, violate these Terms, or present a risk to users or the platform."
    ]
  },
  {
    title: "4. Marketplace Listings and User Content",
    body: [
      "You are responsible for the adverts, images, descriptions, prices, business information, verification documents, messages, reviews, reports, and other content you submit to QWIK.NG.",
      "You must ensure that each listing is accurate, lawful, not misleading, and placed in the correct category.",
      "You must not post counterfeit goods, stolen items, illegal products or services, misleading job opportunities, fraudulent property listings, prohibited financial schemes, offensive content, or any content that violates applicable law.",
      "By submitting content, you grant QWIK.NG a non-exclusive, worldwide, royalty-free licence to host, store, display, reproduce, resize, modify for formatting, distribute, and promote that content for the purpose of operating, improving, marketing, and protecting the marketplace.",
      "QWIK.NG may remove, demote, edit for formatting, restrict, or reject any listing or content that violates these Terms, appears suspicious, creates legal exposure, or may harm users."
    ]
  },
  {
    title: "5. Buyer and Seller Responsibilities",
    body: [
      "Users are responsible for verifying product details, seller identity, item condition, ownership, delivery arrangements, pricing, and payment terms before completing any transaction.",
      "Sellers must have the legal right to sell or advertise the goods or services they list.",
      "Buyers must make reasonable checks before paying, sharing sensitive information, or meeting another user.",
      "Users should use caution when communicating, meeting in person, arranging deliveries, or making payments outside QWIK.NG.",
      "QWIK.NG does not guarantee the existence, quality, safety, legality, availability, delivery, suitability, or accuracy of items, adverts, users, sellers, buyers, employers, employees, landlords, agents, or service providers."
    ]
  },
  {
    title: "6. Verification, Badges, and Trust Signals",
    body: [
      "QWIK.NG may offer account, business, document, seller, or listing verification features. Verification may require information, uploaded documents, payment records, manual review, and other checks.",
      "A verification badge or status means only that QWIK.NG has completed certain checks based on information available at the time of review. It is not a warranty, endorsement, guarantee, insurance, or promise that a user or listing is risk-free.",
      "QWIK.NG may approve, reject, revoke, suspend, or require additional information for verification at any time."
    ]
  },
  {
    title: "7. Payments, Promotions, and Paid Services",
    body: [
      "QWIK.NG may offer paid services such as promoted adverts, verification fees, premium placements, subscriptions, or other marketplace tools.",
      "Prices, features, availability, billing terms, and refund rules for paid services may be shown at checkout or in the relevant product page.",
      "Paid promotional services may increase visibility but do not guarantee sales, leads, ranking, traffic, impressions, messages, or transaction success.",
      "You must not use stolen cards, unauthorised payment methods, fraudulent chargebacks, or payment activity intended to avoid fees."
    ]
  },
  {
    title: "8. Prohibited Conduct",
    body: [
      "You must not use QWIK.NG to commit fraud, impersonate others, post misleading adverts, scrape or harvest data, distribute malware, spam users, evade moderation, manipulate reviews, abuse reports, or interfere with platform security.",
      "You must not bypass account restrictions, create multiple accounts for deceptive purposes, use automated tools without permission, or attempt to access systems, data, or features that you are not authorised to use.",
      "You must not threaten, harass, discriminate against, exploit, or harm other users."
    ]
  },
  {
    title: "9. Reviews, Reports, Messages, and Communications",
    body: [
      "Reviews and reports must be honest, relevant, and based on genuine interactions.",
      "QWIK.NG may review messages, reports, and other content where necessary to investigate abuse, enforce these Terms, comply with law, or protect users.",
      "You agree that platform notifications, service emails, security alerts, account messages, support responses, and transaction-related communications may be sent to the contact details connected to your account."
    ]
  },
  {
    title: "10. Intellectual Property",
    body: [
      "QWIK.NG, the QWIK.NG name, logos, interface designs, software, content structure, and marketplace features are owned by or licensed to QWIK.NG ONLINE MARKETPLACE NIG. LTD and are protected by applicable intellectual property laws.",
      "You may not copy, reproduce, sell, license, reverse engineer, or misuse any part of QWIK.NG except as permitted by these Terms or with our written permission."
    ]
  },
  {
    title: "11. Suspension and Termination",
    body: [
      "QWIK.NG may suspend, restrict, delete, or terminate your account, listings, messages, verification status, or access to services if we believe you have violated these Terms, created risk for users, failed verification, or engaged in suspicious or unlawful activity.",
      "You may stop using QWIK.NG at any time. Some information may be retained where required for legal, safety, fraud prevention, dispute resolution, accounting, or legitimate business purposes."
    ]
  },
  {
    title: "12. Disclaimers and Limitation of Liability",
    body: [
      "QWIK.NG is provided on an as-is and as-available basis. We do not promise that the platform will always be uninterrupted, error-free, secure, current, or available in every location.",
      "To the maximum extent permitted by law, QWIK.NG ONLINE MARKETPLACE NIG. LTD is not liable for indirect, incidental, special, consequential, exemplary, or punitive damages, or for loss of profit, data, goodwill, business opportunity, or transaction value arising from your use of the marketplace.",
      "Nothing in these Terms limits liability that cannot be limited under applicable law."
    ]
  },
  {
    title: "13. Indemnity",
    body: [
      "You agree to indemnify and hold QWIK.NG ONLINE MARKETPLACE NIG. LTD, its directors, officers, employees, agents, partners, and service providers harmless from claims, losses, liabilities, damages, costs, and expenses arising from your use of QWIK.NG, your content, your transactions, your breach of these Terms, or your violation of law or third-party rights."
    ]
  },
  {
    title: "14. Changes to These Terms",
    body: [
      "We may update these Terms to reflect changes in our services, legal requirements, marketplace rules, or business operations.",
      "When we make material changes, we may notify users through the platform, by email, or by updating the effective date. Continued use of QWIK.NG after changes become effective means you accept the updated Terms."
    ]
  },
  {
    title: "15. Governing Law and Disputes",
    body: [
      "These Terms are governed by the laws of the Federal Republic of Nigeria, without regard to conflict of law rules.",
      "Users agree to first contact QWIK.NG support in good faith to resolve complaints or disputes connected with the platform."
    ]
  },
  {
    title: "16. Contact",
    body: [
      "For questions about these Terms, account issues, safety concerns, or legal notices, contact QWIK.NG support through the support channels provided on the platform."
    ]
  }
];

export default function TermsPage() {
  return (
    <LegalPageLayout
      eyebrow="Terms of Use"
      title="Terms and Conditions of Use"
      subtitle="QWIK.NG ONLINE MARKETPLACE NIG. LTD"
      intro="Please read these Terms carefully before using QWIK.NG. They explain the rules that apply to your account, listings, marketplace activity, verification, paid services, and user content."
      sections={termsSections}
    />
  );
}
