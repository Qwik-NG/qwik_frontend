import { useNavigate } from "react-router-dom";
import { SiteFooter, SiteHeader } from "../components/AppShell";

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#ff7f1f]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="m8 12 2.5 2.5L16 9" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 text-[#22c55e]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3 5 6v6c0 5 3.4 8.8 7 10 3.6-1.2 7-5 7-10V6l-7-3Z" />
      <path d="m9.2 12.3 1.8 1.8 3.8-4" />
    </svg>
  );
}

export default function PlanPaymentPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-page text-ink">
      <SiteHeader navigate={navigate} />

      <main className="mx-auto w-full max-w-[1728px] px-4 pb-14 pt-6 sm:px-6 lg:px-12">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.3fr]">
          <section>
            <button className="mb-5 text-[16px] text-[#9e9aa7]" onClick={() => navigate("/promote-ad")}>
              ‹ Back to Plans
            </button>

            <h1 className="text-[28px] font-semibold leading-tight sm:text-[32px]">Top Plan</h1>
            <p className="mt-2 text-[16px] text-[#8d8996] sm:text-[18px]">Everything you need to grow and scale your business</p>
            <p className="mt-4 text-[32px] font-semibold leading-none sm:text-[34px]">₦1,500 <span className="text-[16px] font-medium text-[#1f1d27]">/ 7 Days</span></p>

            <div className="mt-5 rounded-card border border-[#d9d7de] bg-white p-5 sm:p-6">
              <ul className="space-y-4 text-[16px] sm:text-[16px]">
                {[
                  "Unlimited product listings",
                  "Advanced analytics & insights",
                  "Priority customer support",
                  "Featured vendor badge",
                  "Access to exclusive promotions",
                  "Early access to new features",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckIcon />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-5 rounded-card border border-[#d9d7de] bg-white p-5 sm:p-6">
              <div className="space-y-4 text-[16px] sm:text-[16px]">
                <div className="flex items-center justify-between"><span>Plan</span><span>₦1,500</span></div>
                <div className="flex items-center justify-between"><span>VAT</span><span>₦112.50</span></div>
                <hr className="border-[#d9d7de]" />
                <div className="flex items-center justify-between font-semibold"><span>Total</span><span className="text-[#ff6c1c]">₦1,612.50</span></div>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-3 rounded-[14px] bg-[#f3f3f6] p-4 text-[14px] text-[#8f8b98] sm:text-[14px]">
              <ShieldIcon />
              <p>Your payment is secure and encrypted. We do not store your card details.</p>
            </div>
          </section>

          <section className="rounded-[22px] border border-[#d9d7de] bg-white p-5 sm:p-6">
            <h2 className="text-[24px] font-semibold leading-tight sm:text-[26px]">Choose a payment method</h2>
            <p className="mt-2 text-[16px] text-[#8f8b98] sm:text-[18px]">Complete your subscription securely</p>

            <div className="mt-5 rounded-[18px] border border-[#ff8e3b] p-4 sm:p-5">
              <div className="flex items-start gap-4">
                <span className="mt-1 h-4 w-4 rounded-full bg-[#ff6b1b]" />
                <div>
                  <p className="text-[18px] font-semibold sm:text-[20px]">Pay with Paystack</p>
                  <p className="text-[14px] text-[#8f8b98] sm:text-[16px]">Cards, Bank Transfer, USSD and more</p>
                </div>
              </div>

              <div className="mt-4 rounded-[14px] bg-[#f2f2f5] p-4">
                <div className="flex flex-wrap gap-3">
                  {["VISA", "GPay", " Pay", "Mastercard"].map((b) => (
                    <div key={b} className="rounded-[10px] bg-white px-4 py-2 text-[14px] font-semibold text-[#4b4b55] sm:text-[14px]">{b}</div>
                  ))}
                </div>
                <p className="mt-4 text-[14px] text-[#9b98a3] sm:text-[14px]">You will be redirected to Paystack to complete your payment securely.</p>
              </div>
            </div>

            <div className="mt-4 rounded-[18px] border border-[#d9d7de] p-4 sm:p-5">
              <label className="flex items-center gap-4">
                <input type="radio" name="payment" className="h-5 w-5" />
                <div>
                  <p className="text-[18px] font-semibold sm:text-[20px]">Pay with Bank Transfer</p>
                  <p className="text-[14px] text-[#8f8b98] sm:text-[16px]">Manually transfer to our bank account.</p>
                </div>
              </label>
            </div>

            <button
              onClick={() => navigate("/post")}
              className="mt-5 flex h-[52px] w-full items-center justify-between rounded-[12px] bg-gradient-to-r from-amber to-orange px-5 text-[18px] font-semibold text-white sm:h-[50px] sm:text-[18px]"
            >
              <span>Pay Now</span>
              <span>₦1,612.50 →</span>
            </button>

            <p className="mt-3 text-[14px] text-[#8f8b98] sm:text-[14px]">
              By proceeding you agree to our <span className="text-[#ff6b1b]">Terms of Service</span> and <span className="text-[#ff6b1b]">Privacy policy</span>.
            </p>

            <div className="mt-5 flex items-center gap-3 rounded-[14px] bg-[#f3f3f6] p-4 text-[14px] sm:text-[14px]">
              <ShieldIcon />
              <p>
                <span className="font-semibold text-ink">Secure payment powered by Paystack.</span>
                <br />
                <span className="text-[#8f8b98]">Your transaction is protected with industry-standard security.</span>
              </p>
            </div>
          </section>
        </div>
      </main>

      <SiteFooter navigate={navigate} />
    </div>
  );
}
