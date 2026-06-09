import LegalPageLayout from "../components/layout/LegalPageLayout";

const privacySections = [
  {
    title: "1. Introduction",
    body: [
      "This Privacy Policy explains how QWIK.NG ONLINE MARKETPLACE NIG. LTD collects, uses, stores, shares, and protects personal information when you use QWIK.NG, including our website, marketplace tools, account services, messaging, verification, advertising, payment-related features, support channels, and related services.",
      "By using QWIK.NG, you acknowledge that your personal information will be handled as described in this Privacy Policy."
    ]
  },
  {
    title: "2. Information We Collect",
    body: [
      "We may collect information you provide directly, including your name, email address, phone number, password, location, profile details, business information, listing details, uploaded images, verification documents, reports, reviews, support requests, and messages.",
      "We may collect marketplace activity information, including adverts posted, saved ads, searches, viewed listings, offers, messages, reports, reviews, verification progress, promotion activity, and payment transaction records.",
      "We may collect technical information, including device identifiers, browser type, IP address, approximate location, pages visited, referring URLs, session data, error logs, security events, and cookie or similar tracking information.",
      "Where you use verification or payment-related features, we may collect information needed to assess eligibility, process the request, prevent fraud, maintain audit records, and comply with legal obligations."
    ]
  },
  {
    title: "3. How We Use Information",
    body: [
      "We use personal information to create and manage accounts, display listings, enable marketplace search, connect buyers and sellers, provide support, process reports, review verification applications, deliver notifications, improve user experience, and operate QWIK.NG.",
      "We use information to detect, prevent, investigate, and respond to fraud, spam, unauthorised access, prohibited listings, harmful conduct, policy violations, security incidents, and misuse of the marketplace.",
      "We may use information to personalize content, recommend listings, measure marketplace performance, improve product features, develop new services, and maintain platform reliability.",
      "We may use contact information to send service messages, security alerts, account notices, support updates, marketplace notifications, and, where permitted, promotional communications."
    ]
  },
  {
    title: "4. Legal Bases for Processing",
    body: [
      "We process personal information where it is necessary to provide marketplace services, perform a contract with you, comply with legal obligations, protect users and the platform, pursue legitimate business interests, or where you have provided consent.",
      "You may withdraw consent where processing is based on consent, but this will not affect processing that occurred before withdrawal or processing based on another lawful basis."
    ]
  },
  {
    title: "5. Cookies and Similar Technologies",
    body: [
      "QWIK.NG may use cookies, local storage, analytics tools, and similar technologies to keep you signed in, remember preferences, improve performance, understand usage, protect accounts, and support marketplace features.",
      "You can control some cookies through your browser settings. Disabling cookies may affect account access or platform functionality."
    ]
  },
  {
    title: "6. Sharing of Information",
    body: [
      "We may share information with service providers that help us operate QWIK.NG, including hosting, storage, analytics, security, support, communications, identity review, upload handling, and payment-related service providers.",
      "We may share limited profile, listing, seller, verification badge, contact, and marketplace information with other users where needed to enable marketplace activity.",
      "We may disclose information where required by law, regulation, court order, government request, law enforcement request, dispute resolution process, fraud investigation, platform safety review, or to protect rights, property, and safety.",
      "We do not sell personal information in the ordinary sense of exchanging it for money."
    ]
  },
  {
    title: "7. Public Listings and User Content",
    body: [
      "Listings, product images, seller names, profile information, locations, prices, descriptions, ratings, reviews, badges, and other marketplace content may be visible to other users and visitors depending on the feature used.",
      "You should avoid posting sensitive personal information in public listing descriptions, images, profile text, reviews, or messages."
    ]
  },
  {
    title: "8. Verification Documents and Sensitive Information",
    body: [
      "Verification documents and business information are used to review verification requests, improve trust and safety, prevent fraud, resolve disputes, and comply with legal or operational requirements.",
      "Access to verification materials is limited to authorised personnel and service providers who need the information for verification, compliance, security, support, or platform protection."
    ]
  },
  {
    title: "9. Data Retention",
    body: [
      "We retain personal information for as long as necessary to provide services, maintain accounts, comply with legal obligations, resolve disputes, prevent fraud, enforce agreements, preserve security, and support legitimate business needs.",
      "When information is no longer needed, we may delete, anonymize, or securely retain it where required by law or legitimate platform protection needs."
    ]
  },
  {
    title: "10. Data Security",
    body: [
      "We use reasonable technical and organisational measures designed to protect personal information from unauthorised access, loss, misuse, alteration, and disclosure.",
      "No online service can guarantee complete security. You are responsible for keeping your password secure and for notifying us if you suspect unauthorised access to your account."
    ]
  },
  {
    title: "11. Your Rights and Choices",
    body: [
      "Subject to applicable law, you may request access to, correction of, deletion of, or restriction of certain personal information. You may also object to certain processing or request a copy of information you provided.",
      "You may update some account information directly in your account settings.",
      "You may opt out of certain promotional communications, but we may still send service, security, legal, and transaction-related messages."
    ]
  },
  {
    title: "12. Children",
    body: [
      "QWIK.NG is not intended for children. We do not knowingly collect personal information from children below the age required to use the marketplace. If we learn that a child has provided personal information without appropriate authority, we may delete the information and restrict the account."
    ]
  },
  {
    title: "13. International Processing",
    body: [
      "Your information may be processed and stored in Nigeria or other countries where QWIK.NG, its affiliates, or service providers operate. Where information is transferred internationally, we take steps designed to protect it in accordance with applicable law."
    ]
  },
  {
    title: "14. Changes to This Privacy Policy",
    body: [
      "We may update this Privacy Policy to reflect changes in our services, legal requirements, security practices, or business operations.",
      "When changes are material, we may notify users through the platform, by email, or by updating the effective date. Continued use of QWIK.NG after an update means you acknowledge the updated Privacy Policy."
    ]
  },
  {
    title: "15. Contact",
    body: [
      "For privacy questions, data requests, or concerns about how QWIK.NG handles personal information, contact QWIK.NG support through the support channels provided on the platform."
    ]
  }
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      eyebrow="Privacy Policy"
      title="Privacy Policy"
      subtitle="QWIK.NG ONLINE MARKETPLACE NIG. LTD"
      intro="This Privacy Policy describes the information QWIK.NG collects, why we use it, when it may be shared, and the choices available to users."
      sections={privacySections}
    />
  );
}
