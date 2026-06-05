import { useNavigate } from "react-router-dom";
import { SiteFooter, SiteHeader } from "../components/AppShell";

function ChevronDownIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 text-[#b2b0bb]"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function InputField({ label, placeholder }: { label: string; placeholder: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[16px] text-[#9c98a5]">{label}</span>
      <div className="flex h-[50px] items-center justify-between rounded-[10px] border border-[#e1e0e6] px-3 text-[16px] leading-none text-[#afacb8] sm:h-[52px] sm:text-[16px]">
        <span>{placeholder}</span>
        <ChevronDownIcon />
      </div>
    </label>
  );
}

export default function NewAdvertDetailsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-page text-ink">
      <SiteHeader navigate={navigate} />

      <main className="mx-auto w-full max-w-[1728px] px-4 pb-16 pt-8 sm:px-6 lg:px-12 lg:pb-24">
        <div className="mx-auto w-full max-w-[430px]">
          <div className="relative mb-3 grid h-[44px] place-items-center rounded-[22px] bg-white">
            <button
              onClick={() => navigate("/post")}
              className="absolute left-5 text-[16px] text-[#9c98a5]"
              type="button"
            >
              ‹ Back
            </button>
            <h1 className="text-[20px] font-normal leading-none text-ink sm:text-[24px]">New advert</h1>
          </div>

          <section className="rounded-[28px] bg-white p-4 sm:p-5">
            <label className="block">
              <span className="mb-2 block text-[16px] text-[#9c98a5]">Price</span>
              <input
                type="number"
                inputMode="numeric"
                className="h-[50px] w-full rounded-[10px] border border-[#e1e0e6] bg-transparent px-3 text-[16px] text-[#afacb8] outline-none sm:h-[52px] sm:text-[16px]"
                placeholder="₦ 0.0"
              />
            </label>

            <label className="mt-2.5 flex items-center gap-2 text-[14px] text-[#9c98a5] sm:text-[16px]">
              <input
                type="checkbox"
                className="h-5 w-5 rounded border border-[#c9c7d2]"
                defaultChecked
              />
              <span>Negotiable</span>
            </label>

            <div className="mt-4 space-y-4">
              <InputField label="Category" placeholder="What time of item is it?" />
              <InputField label="Brand" placeholder="Who's the creator?" />
              <InputField label="Model" placeholder="What's the model?" />
            </div>

            <button
              type="button"
              className="mt-4 h-[48px] w-full rounded-[10px] bg-[#e1e1e6] text-[16px] text-[#c3c1cb]"
              disabled
            >
              Next
            </button>
          </section>
        </div>
      </main>

      <SiteFooter navigate={navigate} />
    </div>
  );
}
