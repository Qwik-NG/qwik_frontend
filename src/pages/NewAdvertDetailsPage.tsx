import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SiteFooter, SiteHeader } from "../components/AppShell";
import { api } from "../services/api";
import type { Category } from "../types";

const POST_DRAFT_KEY = "qwik_post_draft";

type PostDraft = {
  title?: string;
  description?: string;
  imageUrls?: string[];
  price?: string;
  negotiable?: boolean;
  categoryId?: string;
  brand?: string;
  model?: string;
  condition?: string;
  color?: string;
  location?: string;
  exchangeAvailable?: boolean;
};

function readDraft(): PostDraft {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.sessionStorage.getItem(POST_DRAFT_KEY);
    return raw ? (JSON.parse(raw) as PostDraft) : {};
  } catch {
    return {};
  }
}

function writeDraft(draft: PostDraft) {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(POST_DRAFT_KEY, JSON.stringify(draft));
}

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

function InputField({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[16px] text-[#9c98a5]">{label}</span>
      <div className="flex h-[50px] items-center justify-between rounded-[10px] border border-[#e1e0e6] px-3 text-[16px] leading-none text-[#afacb8] sm:h-[52px] sm:text-[16px]">
        <input
          className="w-full bg-transparent text-[#1f1d27] outline-none placeholder:text-[#afacb8]"
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        <ChevronDownIcon />
      </div>
    </label>
  );
}

export default function NewAdvertDetailsPage() {
  const navigate = useNavigate();
  const [price, setPrice] = useState("");
  const [negotiable, setNegotiable] = useState(true);
  const [categoryId, setCategoryId] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const draft = readDraft();
    setPrice(draft.price || "");
    setNegotiable(draft.negotiable ?? true);
    setCategoryId(draft.categoryId || "");
    setBrand(draft.brand || "");
    setModel(draft.model || "");

    const loadCategories = async () => {
      try {
        const response = await api.categories();
        setCategories(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load categories");
      }
    };

    void loadCategories();
  }, []);

  const canProceed = Number(price) > 0 && categoryId;

  const handleNext = () => {
    writeDraft({
      ...readDraft(),
      price,
      negotiable,
      categoryId,
      brand: brand.trim(),
      model: model.trim(),
    });
    navigate("/post-details");
  };

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
                value={price}
                onChange={(event) => setPrice(event.target.value.replace(/[^\d.]/g, ""))}
              />
            </label>

            <label className="mt-2.5 flex items-center gap-2 text-[14px] text-[#9c98a5] sm:text-[16px]">
              <input
                type="checkbox"
                className="h-5 w-5 rounded border border-[#c9c7d2]"
                checked={negotiable}
                onChange={(event) => setNegotiable(event.target.checked)}
              />
              <span>Negotiable</span>
            </label>

            <div className="mt-4 space-y-4">
              <label className="block">
                <span className="mb-2 block text-[16px] text-[#9c98a5]">Category</span>
                <div className="flex h-[50px] items-center justify-between rounded-[10px] border border-[#e1e0e6] px-3 text-[16px] leading-none text-[#afacb8] sm:h-[52px] sm:text-[16px]">
                  <select
                    className="w-full bg-transparent text-[#1f1d27] outline-none"
                    value={categoryId}
                    onChange={(event) => setCategoryId(event.target.value)}
                  >
                    <option value="">What type of item is it?</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                  <ChevronDownIcon />
                </div>
              </label>
              <InputField label="Brand" placeholder="Who's the creator?" value={brand} onChange={setBrand} />
              <InputField label="Model" placeholder="What's the model?" value={model} onChange={setModel} />
            </div>

            {error && <p className="mt-4 text-[15px] text-[#d14343]">{error}</p>}

            <button
              type="button"
              onClick={handleNext}
              className="mt-4 h-[48px] w-full rounded-[10px] bg-[#e1e1e6] text-[16px] text-[#c3c1cb]"
              disabled={!canProceed}
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
