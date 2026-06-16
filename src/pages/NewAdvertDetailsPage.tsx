import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SiteFooter, SiteHeader } from "../components/AppShell";
import DropdownSelect from "../components/ui/DropdownSelect";
import { getBrandOptions, getCategorySlugById, getModelOptions, getOrderedPostCategories } from "../lib/postAdOptions";
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
  locationState?: string;
  locationArea?: string;
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
      <span className="mb-2 block text-[15px] font-medium text-[#27242d]">{label}</span>
      <input
        className="h-[54px] w-full rounded-[12px] border border-[#dddbe4] bg-white px-4 text-[16px] text-[#201d27] outline-none transition placeholder:text-[#a4a0aa] focus:border-orange focus:ring-2 focus:ring-orange/20"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function Spinner() {
  return <span className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />;
}

function formatPriceDisplay(rawDigits: string): string {
  if (!rawDigits) return "";
  return Number(rawDigits).toLocaleString("en-NG");
}

function sanitizePriceInput(input: string): string {
  // Keep digits only; strip leading zeros (but keep a single "0" while typing).
  const digits = input.replace(/\D/g, "");
  if (!digits) return "";
  const stripped = digits.replace(/^0+/, "");
  return stripped || "0";
}

export default function NewAdvertDetailsPage() {
  const navigate = useNavigate();
  const [price, setPrice] = useState("");
  const [negotiable, setNegotiable] = useState(true);
  const [categoryId, setCategoryId] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [navigating, setNavigating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categoryWarning, setCategoryWarning] = useState<string | null>(null);

  useEffect(() => {
    const draft = readDraft();
    setPrice(sanitizePriceInput(draft.price || ""));
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

  const orderedCategories = getOrderedPostCategories(categories);
  const categorySlug = getCategorySlugById(categoryId, categories);
  const brandOptions = getBrandOptions(categorySlug);
  const modelOptions = getModelOptions(brand);
  const canProceed = Number(price) > 0 && categoryId && !navigating;

  const handleNext = () => {
    if (!canProceed) return;

    setNavigating(true);
    writeDraft({
      ...readDraft(),
      price,
      negotiable,
      categoryId,
      brand: brand.trim(),
      model: model.trim(),
    });
    window.setTimeout(() => navigate("/post-details"), 120);
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

          <section className="rounded-[28px] bg-white p-4 shadow-[0_14px_36px_rgba(26,24,35,0.06)] sm:p-5">
            <label className="block">
              <span className="mb-2 block text-[15px] font-medium text-[#27242d]">Price</span>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="off"
                aria-label="Price in naira"
                className="h-[54px] w-full rounded-[12px] border border-[#dddbe4] bg-white px-4 text-[16px] text-[#201d27] outline-none transition placeholder:text-[#a4a0aa] focus:border-orange focus:ring-2 focus:ring-orange/20"
                placeholder="\u20A6 0"
                value={formatPriceDisplay(price)}
                onChange={(event) => setPrice(sanitizePriceInput(event.target.value))}
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
              <DropdownSelect
                label="Category"
                placeholder="What type of item is it?"
                value={categoryId}
                options={orderedCategories.map((category) => ({
                  value: category.id || `missing:${category.slug}`,
                  label: category.name,
                  disabled: !category.available,
                  helperText: category.available ? undefined : "Unavailable right now",
                }))}
                onChange={(value) => {
                  const selectedCategory = orderedCategories.find((category) => category.id === value);
                  if (!selectedCategory?.available) return;

                  setCategoryId(value);
                  setBrand("");
                  setModel("");
                  setCategoryWarning(null);
                }}
              />
              {categoryWarning ? <p className="text-[13px] leading-snug text-[#d14343]">{categoryWarning}</p> : null}
              <DropdownSelect
                label="Brand"
                placeholder="Who's the creator?"
                value={brand}
                options={brandOptions.map((option) => ({ value: option, label: option }))}
                onChange={(value) => {
                  setBrand(value);
                  setModel("");
                }}
                disabled={!categoryId}
                helperText={!categoryId ? "Select category first" : undefined}
              />
              <DropdownSelect
                label="Model"
                placeholder="What's the model?"
                value={model}
                options={modelOptions.map((option) => ({ value: option, label: option }))}
                onChange={setModel}
                disabled={!brand}
                helperText={!brand ? "Select brand first" : undefined}
              />
            </div>

            {error && <p className="mt-4 text-[15px] text-[#d14343]">{error}</p>}

            <button
              type="button"
              onClick={handleNext}
              className="mt-4 flex h-[54px] w-full items-center justify-center gap-2 rounded-[12px] bg-gradient-to-r from-amber to-orange text-[17px] font-semibold text-white shadow-glow transition hover:brightness-105 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-none disabled:bg-[#e1e1e6] disabled:text-[#aaa6b3] disabled:shadow-none"
              disabled={!canProceed}
            >
              {navigating ? <Spinner /> : null}
              {navigating ? "Loading..." : "Next"}
            </button>
          </section>
        </div>
      </main>

      <SiteFooter navigate={navigate} />
    </div>
  );
}
