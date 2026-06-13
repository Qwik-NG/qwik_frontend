import LegalPageLayout from "../components/layout/LegalPageLayout";

export const privacySections = [
  {
    title: "1. Information We Collect",
    body: [
      "We may collect the following categories of information:",
      "Personal Information",
      "Full Name",
      "Email Address",
      "Phone Number",
      "Residential or Delivery Address",
      "Business Information (for Vendors)",
      "Identification Documents where required",
      "Account Information",
      "Username",
      "Password (encrypted)",
      "Profile Information",
      "Transaction Information",
      "Purchase History",
      "Order Details",
      "Payment Status",
      "Vendor Transactions",
      "Technical Information",
      "IP Address",
      "Browser Type",
      "Device Information",
      "Operating System",
      "Access Times",
      "Pages Visited",
      "Communication Information",
      "Customer Support Requests",
      "Emails and Messages sent through the Platform",
    ],
  },
  {
    title: "2. How We Collect Information",
    body: [
      "We collect information:",
      "Directly from you when you register or use our services.",
      "When you make purchases or create listings.",
      "Through cookies and similar technologies.",
      "From third-party service providers such as payment processors and logistics partners.",
    ],
  },
  {
    title: "3. How We Use Your Information",
    body: [
      "We use your information to:",
      "Create and manage user accounts.",
      "Process orders and transactions.",
      "Facilitate communication between Buyers and Vendors.",
      "Improve our services and user experience.",
      "Verify identities and prevent fraud.",
      "Respond to inquiries and customer support requests.",
      "Send service notifications and updates.",
      "Comply with legal and regulatory obligations.",
    ],
  },
  {
    title: "4. Payment Information",
    body: [
      "Payments on Qwik.ng may be processed through third-party payment providers.",
      "We do not store complete debit card, credit card, or banking credentials on our servers.",
      "Payment processing is subject to the privacy policies and security standards of the relevant payment providers.",
    ],
  },
  {
    title: "5. Sharing of Information",
    body: [
      "We may share information with:",
      "Vendors",
      "Information necessary to fulfill orders, including:",
      "Name",
      "Phone Number",
      "Delivery Address",
      "Service Providers",
      "We may share information with:",
      "Payment Processors",
      "Hosting Providers",
      "Logistics and Delivery Partners",
      "Analytics Providers",
      "Customer Support Providers",
      "Legal Requirements",
      "We may disclose information when required by:",
      "Nigerian laws and regulations",
      "Court orders",
      "Law enforcement agencies",
      "Government authorities",
    ],
  },
  {
    title: "6. Data Security",
    body: [
      "We implement reasonable administrative, technical, and organizational measures to protect personal information against:",
      "Unauthorized access",
      "Disclosure",
      "Alteration",
      "Loss",
      "Destruction",
      "However, no online platform can guarantee absolute security.",
    ],
  },
  {
    title: "7. Data Retention",
    body: [
      "We retain personal information only for as long as necessary to:",
      "Provide our services",
      "Fulfill contractual obligations",
      "Resolve disputes",
      "Comply with legal requirements",
      "Upon expiration of retention periods, data may be deleted or anonymized.",
    ],
  },
  {
    title: "8. Cookies and Tracking Technologies",
    body: [
      "Qwik.ng may use cookies and similar technologies to:",
      "Remember user preferences",
      "Improve website functionality",
      "Analyze traffic and usage",
      "Enhance security",
      "Users may disable cookies through browser settings, although some features may not function properly.",
    ],
  },
  {
    title: "9. User Rights",
    body: [
      "Subject to applicable laws, users may request:",
      "Access to personal information",
      "Correction of inaccurate information",
      "Deletion of personal information",
      "Restriction of processing",
      "Withdrawal of consent where applicable",
      "Requests may be submitted through the contact information provided below.",
    ],
  },
  {
    title: "10. Children's Privacy",
    body: [
      "Qwik.ng is not intended for children under the age of 18.",
      "We do not knowingly collect personal information from minors without appropriate consent.",
    ],
  },
  {
    title: "11. Third-Party Links",
    body: [
      "The Platform may contain links to third-party websites or services.",
      "We are not responsible for the privacy practices or content of third-party websites.",
      "Users are encouraged to review the privacy policies of those websites.",
    ],
  },
  {
    title: "12. International Data Transfers",
    body: [
      "Where necessary, personal information may be processed or stored on servers located outside Nigeria.",
      "We will take reasonable measures to ensure such transfers comply with applicable data protection laws.",
    ],
  },
  {
    title: "13. Changes to This Privacy Policy",
    body: [
      "We may update this Privacy Policy periodically.",
      "Updated versions will be posted on the Platform with a revised effective date.",
      "Continued use of the Platform after changes become effective constitutes acceptance of the updated Privacy Policy.",
    ],
  },
  {
    title: "14. Contact Us",
    body: [
      "For questions, requests, complaints, or concerns regarding this Privacy Policy, please contact:",
      "Qwik.ng Online Marketplace Nig. Ltd.",
    ],
  },
  {
    title: "15. Consent",
    body: [
      "By accessing, registering on, or using Qwik.ng, you acknowledge that you have read, understood, and agreed to this Privacy Policy and the collection, use, and disclosure of your information as described herein",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      eyebrow="Privacy Policy"
      title="Privacy Policy"
      subtitle="QWIK.NG ONLINE MARKETPLACE NIG. LTD"
      intro={"Effective Date: [Insert Date]\n\nQwik.ng Online Marketplace Nig. Ltd. (\"Qwik.ng\", \"Company\", \"we\", \"our\", or \"us\") is committed to protecting the privacy and personal information of users of our platform. This Privacy Policy explains how we collect, use, disclose, store, and protect your personal information when you access or use Qwik.ng and its related services. By using our Platform, you consent to the practices described in this Privacy Policy."}
      sections={privacySections}
    />
  );
}
