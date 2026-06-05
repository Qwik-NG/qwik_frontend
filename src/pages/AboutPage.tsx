import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "../components/layout/PageLayout";
import { ROUTES } from "../constants/routes";

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3 5 6v6c0 5 3.4 8.8 7 10 3.6-1.2 7-5 7-10V6l-7-3Z" />
      <path d="m9.6 12.1 1.7 1.8 3.7-4" />
    </svg>
  );
}

function CheckBadgeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3 5 6v6c0 5 3.4 8.8 7 10 3.6-1.2 7-5 7-10V6l-7-3Z" />
      <path d="m9.6 12.1 1.7 1.8 3.7-4" />
    </svg>
  );
}

function FlashIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
      <path d="M13.2 2 6.8 12h4.4L10.8 22 17.2 12h-4.4L13.2 2Z" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s7-5.4 7-12a7 7 0 1 0-14 0c0 6.6 7 12 7 12Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="18" cy="20" r="1.5" />
      <path d="M3 4h2l2.4 10.2a1 1 0 0 0 1 .8h8.9a1 1 0 0 0 1-.8L20 8H7" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8h12l-1 11H7L6 8Z" />
      <path d="M9 8V7a3 3 0 0 1 6 0v1" />
    </svg>
  );
}

function ButtonArrow() {
  return <span className="text-[18px]">→</span>;
}

function TrustCard({
  title,
  description,
  tone,
  icon,
}: {
  title: string;
  description: string;
  tone: string;
  icon: ReactNode;
}) {
  return (
    <article className="rounded-[20px] border border-[#e9e7ee] bg-white px-5 py-6 text-center shadow-[0_10px_30px_rgba(17,12,46,0.04)]">
      <div className={`mx-auto mb-4 flex h-[58px] w-[58px] items-center justify-center rounded-full ${tone}`}>
        {icon}
      </div>
      <h3 className="text-[18px] font-medium text-[#1f1d27]">{title}</h3>
      <p className="mt-3 text-[14px] leading-[1.5] text-[#7f7b88]">{description}</p>
    </article>
  );
}

function StepList({
  items,
}: {
  items: Array<{ title: string; description: string }>;
}) {
  return (
    <div className="space-y-3.5 text-left">
      {items.map((item, index) => (
        <div key={item.title}>
          <p className="text-[14px] font-semibold text-[#ff7f1f]">
            {index + 1}. {item.title}
          </p>
          <p className="mt-1 text-[14px] leading-[1.55] text-[#4e4a57]">{item.description}</p>
        </div>
      ))}
    </div>
  );
}

function MiniPhoneMock() {
  return (
    <div className="relative h-[250px] w-[138px] rounded-[28px] border-[7px] border-[#20212a] bg-white p-3 shadow-[0_20px_45px_rgba(31,29,39,0.14)]">
      <div className="mx-auto mb-3 h-[10px] w-[62px] rounded-full bg-[#1f1d27]" />
      <div className="space-y-2.5">
        <div className="rounded-[12px] bg-[#fff3e5] p-2">
          <div className="mb-2 h-2.5 w-16 rounded-full bg-[#ffb56b]" />
          <div className="grid grid-cols-4 gap-1.5">
            {Array.from({ length: 8 }).map((_, index) => (
              <span key={index} className="h-5 rounded-[6px] bg-white" />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-[12px] bg-[#f4f4f7] p-2">
            <div className="mb-2 h-10 rounded-[10px] bg-[#d8d6dd]" />
            <div className="h-2 w-10 rounded-full bg-[#b8b5bf]" />
          </div>
          <div className="rounded-[12px] bg-[#f4f4f7] p-2">
            <div className="mb-2 h-10 rounded-[10px] bg-[#ffd6ab]" />
            <div className="h-2 w-10 rounded-full bg-[#b8b5bf]" />
          </div>
        </div>
        <div className="rounded-[12px] bg-[#fff3e5] px-3 py-2.5 text-center text-[10px] font-semibold text-[#ff7f1f]">
          Continue Shopping
        </div>
      </div>
    </div>
  );
}

function MarketplaceScene({ reverse = false }: { reverse?: boolean }) {
  return (
    <div className={`relative overflow-hidden rounded-[28px] bg-[linear-gradient(180deg,#fff8ee_0%,#ffffff_100%)] p-6 ${reverse ? "" : ""}`}>
      <div className="absolute inset-x-8 top-6 h-[110px] rounded-full bg-[#fff1db] blur-2xl" />
      <div className={`relative flex flex-col items-center justify-center gap-6 lg:flex-row ${reverse ? "lg:flex-row-reverse" : ""}`}>
        <div className="relative flex items-end gap-3">
          <div className="absolute -left-4 bottom-8 h-10 w-10 rounded-full bg-[#ffefe0]" />
          <div className="absolute right-4 top-3 rounded-full bg-white px-3 py-1 text-[11px] font-medium text-[#ff7f1f] shadow-sm">
            Qwik.NG
          </div>
          <img
            src="/images/welcome-illustration.png"
            alt="Marketplace illustration"
            className="relative z-10 h-[150px] w-[150px] object-contain"
          />
          <div className="hidden gap-2 sm:flex sm:flex-col">
            <div className="h-[62px] w-[62px] rounded-[16px] bg-[#e7f7ec]" />
            <div className="h-[46px] w-[46px] rounded-[12px] bg-[#ffe0bc]" />
          </div>
        </div>
        <div className="relative z-10">
          <MiniPhoneMock />
        </div>
      </div>
    </div>
  );
}

function SafetyCard() {
  return (
    <section className="rounded-[28px] bg-[#fff1db] px-6 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
      <h2 className="text-center text-[28px] font-medium text-[#1f1d27] sm:text-[34px]">
        Your <span className="text-[#ff7f1f]">Safety</span> Comes First
      </h2>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          "Meet in safe public locations whenever possible.",
          "Use verified sellers and inspect items before payment.",
          "Report suspicious activity and avoid off-platform pressure.",
        ].map((text) => (
          <div key={text} className="rounded-[20px] bg-white/70 px-5 py-5 text-[14px] leading-[1.55] text-[#5b5663] backdrop-blur-sm">
            {text}
          </div>
        ))}
      </div>
    </section>
  );
}

function VerifiedSellerVisual() {
  return (
    <div className="relative mx-auto flex w-full max-w-[520px] items-center justify-center">
      <div className="absolute inset-x-10 bottom-2 h-10 rounded-full bg-[#dfe7e3] blur-xl" />
      <div className="absolute left-0 top-[18%] flex w-[110px] flex-col items-center gap-2 rounded-[18px] bg-white px-3 py-3 text-center shadow-[0_12px_30px_rgba(17,12,46,0.08)]">
        <span className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[#fff1db] text-[#ff7f1f]"><ShieldIcon /></span>
        <span className="text-[13px] font-medium text-[#1f1d27]">Verified Seller Badge</span>
      </div>
      <img src="/image copy.png" alt="Verified seller shield" className="relative z-10 h-[260px] w-[260px] object-contain sm:h-[320px] sm:w-[320px]" />
      <div className="absolute right-0 top-[15%] flex w-[120px] flex-col items-center gap-2 rounded-[18px] bg-white px-3 py-3 text-center shadow-[0_12px_30px_rgba(17,12,46,0.08)]">
        <span className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[#fff1db] text-[#ff7f1f]"><BagIcon /></span>
        <span className="text-[13px] font-medium text-[#1f1d27]">Increased Customer Trust</span>
      </div>
      <div className="absolute bottom-[12%] left-[8%] flex w-[104px] flex-col items-center gap-2 rounded-[18px] bg-white px-3 py-3 text-center shadow-[0_12px_30px_rgba(17,12,46,0.08)]">
        <span className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[#fff1db] text-[#ff7f1f]"><CheckBadgeIcon /></span>
        <span className="text-[13px] font-medium text-[#1f1d27]">Priority Support</span>
      </div>
      <div className="absolute bottom-[10%] right-[6%] flex w-[108px] flex-col items-center gap-2 rounded-[18px] bg-white px-3 py-3 text-center shadow-[0_12px_30px_rgba(17,12,46,0.08)]">
        <span className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[#fff1db] text-[#ff7f1f]"><FlashIcon /></span>
        <span className="text-[13px] font-medium text-[#1f1d27]">Higher Search Visibility</span>
      </div>
    </div>
  );
}

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <PageLayout contentClassName="mx-auto w-full max-w-[1728px] px-4 pb-16 pt-8 sm:px-6 lg:px-12 lg:pb-24 lg:pt-10">
        <section className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,520px)] lg:gap-12">
          <div className="min-w-0">
            <p className="text-[18px] font-medium text-[#ff7f1f]">ABOUT QWIK.NG</p>
            <h1 className="mt-4 max-w-[640px] text-[34px] font-semibold leading-[1.08] text-[#1f1d27] sm:text-[44px] lg:text-[52px]">
              A Marketplace Built For Nigerians, By Nigerians.
            </h1>
            <p className="mt-5 max-w-[640px] text-[17px] leading-[1.65] text-[#4f4a57]">
              <span className="font-semibold text-[#ff7f1f]">Qwik.NG</span> provides a trusted platform where Nigerians can buy and sell with confidence, connect with verified sellers, and reach customers nationwide.
            </p>
            <p className="mt-4 max-w-[650px] text-[15px] leading-[1.7] text-[#7f7b88]">
              It is the biggest online platform that provides a seamless way to list items, discover products, and transact faster. We are on a mission to empower everyday Nigerians to buy and sell with ease, whether it is a car, fashion item, home appliance, or camera.
            </p>
            <button
              className="mt-8 flex h-[50px] items-center gap-3 rounded-[14px] bg-gradient-to-r from-amber to-orange px-6 text-[15px] font-medium text-white shadow-glow"
              type="button"
              onClick={() => navigate(ROUTES.HOME)}
            >
              <span>Explore Marketplace</span>
              <ButtonArrow />
            </button>
          </div>

          <MarketplaceScene />
        </section>

        <section className="mt-20">
          <h2 className="text-center text-[30px] font-medium text-[#1f1d27] sm:text-[38px]">
            Why Millions Trust <span className="text-[#ff7f1f]">Qwik.NG</span>
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <TrustCard
              title="Secure Trading"
              description="We prioritize your safety with secure messaging, smart moderation, and clear platform guidance."
              tone="bg-[#fff1db] text-[#ff7f1f]"
              icon={<ShieldIcon />}
            />
            <TrustCard
              title="Verified Sellers"
              description="Buyers can transact with more confidence when sellers complete identity and business verification."
              tone="bg-[#e8f9eb] text-[#20b15a]"
              icon={<CheckBadgeIcon />}
            />
            <TrustCard
              title="Fast Listing"
              description="Create and publish adverts quickly so your products reach buyers without unnecessary delay."
              tone="bg-[#f1e7ff] text-[#a855f7]"
              icon={<FlashIcon />}
            />
            <TrustCard
              title="Nationwide Reach"
              description="Connect with customers across Nigeria and grow your visibility beyond your immediate area."
              tone="bg-[#ffe8e8] text-[#ef4444]"
              icon={<PinIcon />}
            />
          </div>
        </section>

        <section className="mt-20 grid items-center gap-10 lg:grid-cols-[minmax(320px,520px)_minmax(0,1fr)]">
          <MarketplaceScene />
          <div>
            <h2 className="text-[32px] font-medium text-[#1f1d27] sm:text-[40px]">
              Want to Sell on <span className="text-[#ff7f1f]">Qwik.NG</span>
            </h2>
            <div className="mt-6 max-w-[620px]">
              <StepList
                items={[
                  {
                    title: "Register",
                    description: "Create your account using your email and phone number, or continue with your preferred sign-in option.",
                  },
                  {
                    title: "Take photos of your items",
                    description: "Upload clear item photos and provide accurate details so buyers can quickly understand what you are selling.",
                  },
                  {
                    title: "Click on Post an Ad",
                    description: "Fill in the advert details, submit your listing, and wait for a quick review before it goes live.",
                  },
                  {
                    title: "Respond to clients through chats",
                    description: "Manage buyer conversations, answer questions, and close deals faster inside the platform.",
                  },
                ]}
              />
            </div>
            <button
              className="mt-8 flex h-[48px] items-center gap-3 rounded-[14px] bg-gradient-to-r from-amber to-orange px-6 text-[15px] font-medium text-white shadow-glow"
              type="button"
              onClick={() => navigate(ROUTES.PROMOTE_AD)}
            >
              <span>Sell</span>
              <ButtonArrow />
            </button>
          </div>
        </section>

        <section className="mt-20 grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(320px,520px)]">
          <div>
            <h2 className="text-[32px] font-medium text-[#1f1d27] sm:text-[40px]">
              Want to Buy on <span className="text-[#ff7f1f]">Qwik.NG</span>
            </h2>
            <div className="mt-6 max-w-[620px]">
              <StepList
                items={[
                  {
                    title: "Search for item",
                    description: "Browse across categories from vehicles to phones and use filters to find exactly what you want to purchase.",
                  },
                  {
                    title: "Contact the seller",
                    description: "Reach out using the in-app chat, ask questions, and confirm important item details.",
                  },
                  {
                    title: "Pay",
                    description: "After agreeing with the seller, complete your payment and arrange item delivery or pickup.",
                  },
                  {
                    title: "Leave a review",
                    description: "Share your experience after the purchase so other buyers can make informed decisions.",
                  },
                ]}
              />
            </div>
            <button
              className="mt-8 flex h-[48px] items-center gap-3 rounded-[14px] bg-gradient-to-r from-amber to-orange px-6 text-[15px] font-medium text-white shadow-glow"
              type="button"
              onClick={() => navigate(ROUTES.SEARCH_RESULTS)}
            >
              <span>Go Shopping</span>
              <ButtonArrow />
            </button>
          </div>
          <MarketplaceScene reverse />
        </section>

        <section className="mt-20">
          <SafetyCard />
        </section>

        <section className="mt-20 grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(320px,540px)]">
          <div>
            <h2 className="text-[32px] font-medium text-[#1f1d27] sm:text-[40px]">Want to be a Verified Seller?</h2>
            <div className="mt-6 max-w-[620px]">
              <StepList
                items={[
                  {
                    title: "Click on Get Verified",
                    description: "Open the verification flow to start your trusted seller journey on Qwik.NG.",
                  },
                  {
                    title: "Submit your documents",
                    description: "Provide your business details, CAC certificate, NIN, and other requested information.",
                  },
                  {
                    title: "Proceed to payment",
                    description: "Complete the one-time verification payment so our team can review your submission.",
                  },
                  {
                    title: "Why get verified?",
                    description: "Verified sellers get the badge, priority support, payment-linked verification, and stronger customer trust.",
                  },
                ]}
              />
            </div>
            <button
              className="mt-8 flex h-[48px] items-center gap-3 rounded-[14px] bg-gradient-to-r from-amber to-orange px-6 text-[15px] font-medium text-white shadow-glow"
              type="button"
              onClick={() => navigate(ROUTES.GET_VERIFIED)}
            >
              <span>Get Verified</span>
              <ButtonArrow />
            </button>
          </div>
          <VerifiedSellerVisual />
        </section>

        <section className="mt-20 rounded-[28px] bg-[#fff1db] px-6 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <div className="mx-auto max-w-[720px] text-center">
            <div className="mx-auto flex h-[58px] w-[58px] items-center justify-center rounded-full bg-white text-[#ff7f1f] shadow-sm">
              <CartIcon />
            </div>
            <h2 className="mt-5 text-[28px] font-medium text-[#1f1d27] sm:text-[34px]">
              Built to make buying and selling feel faster, safer, and more local.
            </h2>
            <p className="mt-4 text-[15px] leading-[1.65] text-[#6b6671]">
              Qwik.NG helps Nigerians discover products, connect with real people, and grow businesses with trusted marketplace tools.
            </p>
          </div>
        </section>
    </PageLayout>
  );
}
