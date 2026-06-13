import LegalPageLayout from "../components/layout/LegalPageLayout";

export const termsSections = [
  {
    title: "1. Definitions",
    body: [
      "\"Platform\" means Qwik.ng website, mobile applications, and related services.",
      "\"User\" means any individual or entity accessing or using the Platform.",
      "\"Vendor\" means any individual or business offering products or services through the Platform.",
      "\"Buyer\" means any User purchasing products or services through the Platform.",
      "\"Company\" means Qwik.ng Online Marketplace Nig. Ltd.",
    ],
  },
  {
    title: "2. Eligibility",
    body: [
      "To use the Platform, you must:",
      "Be at least 18 years old or have the consent of a parent or legal guardian.",
      "Provide accurate and complete registration information.",
      "Comply with all applicable laws and regulations.",
      "The Company reserves the right to refuse registration or suspend accounts at its discretion.",
    ],
  },
  {
    title: "3. User Accounts",
    body: [
      "Users are responsible for:",
      "Maintaining the confidentiality of login credentials.",
      "All activities conducted through their accounts.",
      "Providing accurate and updated information.",
      "Users must immediately notify the Company of any unauthorized access or security breach.",
    ],
  },
  {
    title: "4. Vendor Obligations",
    body: [
      "Vendors agree to:",
      "Provide accurate product descriptions and pricing.",
      "Deliver products and services as advertised.",
      "Comply with all applicable laws, regulations, and industry standards.",
      "Possess all licenses, permits, and approvals required for their business operations.",
      "Vendors shall not list prohibited, counterfeit, illegal, stolen, or fraudulent products.",
      "The Company reserves the right to remove listings or suspend Vendor accounts that violate these Terms.",
    ],
  },
  {
    title: "5. Prohibited Items and Activities",
    body: [
      "The following are prohibited on the Platform:",
      "Illegal goods or services.",
      "Counterfeit products.",
      "Stolen property.",
      "Fraudulent schemes.",
      "Offensive, harmful, or unlawful content.",
      "Products prohibited under Nigerian law.",
      "Activities that interfere with the operation of the Platform.",
      "Any violation may result in account suspension, termination, and reporting to relevant authorities.",
    ],
  },
  {
    title: "6. Orders and Payments",
    body: [
      "All payments made through the Platform must be completed using approved payment methods.",
      "The Company may utilize third-party payment providers to facilitate transactions.",
      "The Company reserves the right to cancel, suspend, or refuse transactions suspected to be fraudulent or unlawful.",
    ],
  },
  {
    title: "7. Delivery and Fulfillment",
    body: [
      "Vendors are solely responsible for:",
      "Product availability.",
      "Packaging.",
      "Shipping and delivery.",
      "Product quality and authenticity.",
      "Delivery timelines will be both agreed between vendors and buyers during the transaction.",
    ],
  },
  {
    title: "8. Refunds and Disputes",
    body: [
      "Buyers may report to the company upport if any veriied sellers didnt comply with delivery arrangement with buyers epecially after payment is initiated for a product.",
      "Refund requests shall be assessed based on:",
      "Non-delivery of goods.",
      "Material misrepresentation of products.",
      "Damaged or defective products.",
      "Other valid grounds as determined by the Company.",
      "The Company may mediate disputes between Buyers and Vendors but is not obligated to resolve every dispute.",
    ],
  },
  {
    title: "9. Intellectual Property",
    body: [
      "All trademarks, logos, software, content, graphics, and branding associated with Qwik.ng are the property of the Company or its licensors.",
      "Users may not reproduce, distribute, modify, or exploit any content from the Platform without prior written consent.",
    ],
  },
  {
    title: "10. Privacy",
    body: [
      "Use of the Platform is also governed by the Company's Privacy Policy.",
      "By using the Platform, Users consent to the collection, storage, and processing of information in accordance with the Privacy Policy.",
    ],
  },
  {
    title: "11. Limitation of Liability",
    body: [
      "Qwik.ng operates as an online marketplace connecting Buyers and Vendors.",
      "The Company does not manufacture, own, inspect, guarantee, or endorse products listed by Vendors.",
      "To the maximum extent permitted by law, the Company shall not be liable for:",
      "Loss of profits.",
      "Business interruption.",
      "Data loss.",
      "Indirect or consequential damages.",
      "Vendor misconduct.",
      "Product defects or inaccuracies.",
      "Users transact at their own risk.",
    ],
  },
  {
    title: "12. Indemnification",
    body: [
      "Users agree to indemnify and hold harmless Qwik.ng Online Marketplace Nig. Ltd., its directors, officers, employees, and agents from any claims, liabilities, damages, losses, or expenses arising from:",
      "Violation of these Terms.",
      "Breach of applicable laws.",
      "Misuse of the Platform.",
    ],
  },
  {
    title: "13. Account Suspension and Termination",
    body: [
      "The Company may suspend or terminate accounts without prior notice where:",
      "False information is provided.",
      "Fraudulent activities are suspected.",
      "These Terms are violated.",
      "Legal or regulatory requirements necessitate such action.",
    ],
  },
  {
    title: "14. Modifications to the Platform",
    body: [
      "The Company reserves the right to modify, suspend, or discontinue any part of the Platform at any time without liability.",
    ],
  },
  {
    title: "15. Force Majeure",
    body: [
      "The Company shall not be liable for delays or failures resulting from events beyond its reasonable control, including natural disasters, strikes, government actions, internet outages, or technical failures.",
    ],
  },
  {
    title: "16. Governing Law",
    body: [
      "These Terms shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria.",
      "Any disputes arising from these Terms shall first be resolved through amicable negotiations. Where resolution cannot be achieved, disputes shall be subject to the jurisdiction of competent courts in Nigeria.",
    ],
  },
  {
    title: "17. Contact Information",
    body: [
      "Qwik.ng Online Marketplace Nig. Ltd.",
      "Email: [qwik.ngonlinemarketplace@gmail.com]",
      "Website: www.qwik.ng",
      "Address: [Metro Command Estate, Phase 2 Plot A&B Life Camp]",
    ],
  },
  {
    title: "18. Acceptance of Terms",
    body: [
      "By accessing or using Qwik.ng, you acknowledge that you have read, understood, and agreed to be bound by these Terms and Conditions.",
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalPageLayout
      eyebrow="Terms of Use"
      title="Terms and Conditions of Use"
      subtitle="QWIK.NG ONLINE MARKETPLACE NIG. LTD"
      intro={"Welcome to Qwik.ng (\"Platform\"), owned and operated by Qwik.ng Online Marketplace Nig. Ltd. These Terms and Conditions (\"Terms\") govern your access to and use of the Platform, including all services, features, content, and transactions available through the Platform. By accessing, registering on, or using Qwik.ng, you agree to be bound by these Terms. If you do not agree with these Terms, you should not use the Platform."}
      sections={termsSections}
    />
  );
}
