import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { SiteFooter, SiteHeader } from "../components/AppShell";
import { LocationPin } from "../components/icons/LocationPin";
import SettingsSidebar, { MobileSettingsMenu } from "../components/settings/SettingsSidebar";
import DropdownSelect from "../components/ui/DropdownSelect";
import { FallbackImage } from "../components/ui/FallbackImage";
import { ImagePlaceholder } from "../components/ui/ImagePlaceholder";
import { getBrandOptions, getCategoryById, getCategorySlugById, getModelOptions, getOrderedPostCategories } from "../lib/postAdOptions";
import { isBrandInOptions } from "../lib/brandOptions";
import { getSettingsNavItems } from "../lib/settings-nav-config";
import { ALL_NIGERIA_LOCATION, NIGERIAN_AREAS, NIGERIAN_LOCATIONS } from "../lib/searchContext";
import { api } from "../services/api";
import type { Ad, Category, AdUpdatePayload } from "../types";

type DashboardAd = {
  id: string;
  status: "ACTIVE" | "DRAFT" | "ARCHIVED" | "SOLD";
  price: string;
  priceValue: number;
  title: string;
  description: string;
  location: string;
  locationState?: string;
  locationArea?: string;
  brand?: string;
  model?: string;
  condition?: string;
  categoryId?: string;
  category?: Category;
  specifications?: Record<string, unknown>;
  negotiable: boolean;
  year: string;
  image?: string;
  images?: Array<{ url: string; position?: number }>;
  fit?: "cover" | "contain";
  isPromoted?: boolean;
  promotedAt?: string;
  promotedUntil?: string;
};

type EditFormState = {
  title: string;
  description: string;
  price: string;
  negotiable: boolean;
  categoryId: string;
  subcategoryId: string;
  condition: string;
  locationState: string;
  locationArea: string;
  brand: string;
  model: string;
  year: string;
  imageUrls: string[];
};

type FilterState = "ACTIVE" | "DRAFT" | "SOLD" | "ARCHIVED";

const stateOptions: Array<{ label: string; value: FilterState }> = [
  { label: "Active", value: "ACTIVE" },
  { label: "Reviewing", value: "DRAFT" },
  { label: "Sold", value: "SOLD" },
  { label: "Declined", value: "ARCHIVED" },
];

function toDashboardAd(ad: Ad): DashboardAd {
  const specifications = (ad.specifications ?? {}) as Record<string, unknown>;
  const negotiable = typeof specifications.negotiable === "boolean" ? specifications.negotiable : false;
  const yearValue = specifications.year;
  const year = typeof yearValue === "string" || typeof yearValue === "number" ? String(yearValue) : "";

  return {
    id: ad.id,
    status: (ad.status as DashboardAd["status"]) || "ACTIVE",
    price: `₦ ${ad.price.toLocaleString()}`,
    priceValue: ad.price,
    title: ad.title,
    description: ad.description,
    location: ad.location,
    locationState: ad.locationState,
    locationArea: ad.locationArea,
    brand: ad.brand,
    model: ad.model,
    condition: ad.condition,
    categoryId: ad.categoryId,
    category: ad.category,
    specifications,
    negotiable,
    year,
    image: ad.images?.[0]?.url,
    images: ad.images,
    fit: "cover",
    isPromoted: ad.isPromoted,
    promotedAt: ad.promotedAt,
    promotedUntil: ad.promotedUntil,
  };
}

function getStatusBadge(status: DashboardAd["status"]) {
  if (status === "ACTIVE") return { label: "Active", className: "bg-[#e9f9ef] text-[#14804a]" };
  if (status === "SOLD") return { label: "Sold", className: "bg-[#f0f2f6] text-[#4f5361]" };
  if (status === "DRAFT") return { label: "Draft", className: "bg-[#eef2ff] text-[#3f51b5]" };
  return { label: "Paused/Archived", className: "bg-[#fff3e5] text-[#d77a00]" };
}

function getPromotionStatus(ad: DashboardAd): { label: string; className: string } | null {
  if (!ad.isPromoted || !ad.promotedUntil) return null;
  const now = new Date();
  const expiry = new Date(ad.promotedUntil);
  if (expiry > now) {
    return { label: "Promoted", className: "bg-[#fff3e5] text-[#ff9715]" };
  }
  return { label: "Expired", className: "bg-[#f5f5f7] text-[#99989f]" };
}

function toEditFormState(ad: DashboardAd): EditFormState {
  const categoryId = ad.category?.parentId ? ad.category.parentId : ad.categoryId ?? "";
  const subcategoryId = ad.category?.parentId ? ad.categoryId ?? "" : "";

  return {
    title: ad.title,
    description: ad.description,
    price: ad.priceValue.toLocaleString("en-NG"),
    negotiable: ad.negotiable,
    categoryId,
    subcategoryId,
    condition: ad.condition ?? "",
    locationState: ad.locationState ?? "",
    locationArea: ad.locationArea ?? "",
    brand: ad.brand ?? "",
    model: ad.model ?? "",
    year: ad.year,
    imageUrls: [], // Will be populated from ad.images in openEditModal
  };
}

function formatPriceInput(value: string) {
  const digits = value.replace(/[^\d]/g, "");
  if (!digits) return "";
  return Number(digits).toLocaleString("en-NG");
}

function parsePriceInput(value: string) {
  const parsed = Number(value.replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : NaN;
}

function StateChip({ label, active = false, onClick }: { label: string; active?: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex h-[40px] items-center gap-2 rounded-[10px] px-4 text-[15px] ${
        active ? "bg-badge-bg text-[#ff9715]" : "bg-[#e9e9ee] text-[#b0adb8]"
      }`}
      type="button"
    >
      <span className="text-[16px]">{active ? "✶" : "◷"}</span>
      <span>{label}</span>
    </button>
  );
}

function AdCard({
  ad,
  actionLoading,
  onClick,
  onEdit,
  onPause,
  onResume,
  onMarkSold,
  onDelete,
}: {
  ad: DashboardAd;
  actionLoading: boolean;
  onClick: () => void;
  onEdit: () => void;
  onPause: () => void;
  onResume: () => void;
  onMarkSold: () => void;
  onDelete: () => void;
}) {
  const badge = getStatusBadge(ad.status);
  const promotionBadge = getPromotionStatus(ad);

  return (
    <article className="cursor-pointer rounded-card bg-white p-3.5 transition hover:scale-[1.01]" onClick={onClick}>
      <div className="h-[300px] w-full overflow-hidden rounded-[16px] bg-white">
        {ad.image ? (
          <FallbackImage
            src={ad.image}
            alt={ad.title}
            fit={ad.fit === "contain" ? "contain" : "cover"}
            className={`h-full w-full ${ad.fit === "contain" ? "p-4" : ""}`}
            fallbackClassName="rounded-[16px]"
          />
        ) : (
          <ImagePlaceholder className="rounded-[16px]" />
        )}
      </div>
      <div className="pt-3.5">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <h3 className="min-w-0 text-[22px] font-semibold leading-none">{ad.price}</h3>
          <span className={`shrink-0 rounded-[10px] px-2.5 py-1 text-[13px] ${badge.className}`}>{badge.label}</span>
          {promotionBadge ? (
            <span className={`shrink-0 rounded-[10px] px-2.5 py-1 text-[13px] ${promotionBadge.className}`}>{promotionBadge.label}</span>
          ) : null}
        </div>
        <h4 className="mb-2 text-[17px] font-medium leading-tight">{ad.title}</h4>
        <p className="mb-2 text-[14px] leading-[1.35] text-[#6d6a74]">{ad.description}</p>
        <div className="space-y-1">
          <small className="flex items-center gap-1 text-[15px] text-[#4b4a54]">
            <LocationPin />
            {ad.location}
          </small>
          {ad.promotedUntil && (
            <small className="block text-[13px] text-[#ff9715]">
              ⭐ Promoted until {new Date(ad.promotedUntil).toLocaleDateString("en-NG", { month: "short", day: "numeric", year: "numeric" })}
            </small>
          )}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2" onClick={(event) => event.stopPropagation()}>
          <button
            type="button"
            onClick={onEdit}
            disabled={actionLoading}
            className="rounded-[10px] border border-[#e2ded7] px-3 py-2 text-[13px] font-medium text-[#1f1d27] hover:bg-[#f7f5f1] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Edit
          </button>

          {ad.status === "ARCHIVED" ? (
            <button
              type="button"
              onClick={onResume}
              disabled={actionLoading}
              className="rounded-[10px] bg-[#1f1d27] px-3 py-2 text-[13px] font-medium text-white hover:bg-[#33313c] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Resume
            </button>
          ) : ad.status === "ACTIVE" ? (
            <button
              type="button"
              onClick={onPause}
              disabled={actionLoading}
              className="rounded-[10px] bg-[#fff3e5] px-3 py-2 text-[13px] font-medium text-[#d77a00] hover:bg-[#ffe7cc] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Pause
            </button>
          ) : (
            <button
              type="button"
              disabled
              className="rounded-[10px] bg-[#f2f2f4] px-3 py-2 text-[13px] font-medium text-[#9a97a5]"
            >
              Pause
            </button>
          )}

          <button
            type="button"
            onClick={onMarkSold}
            disabled={actionLoading || ad.status === "SOLD"}
            className="rounded-[10px] border border-[#d9d4cc] px-3 py-2 text-[13px] font-medium text-[#1f1d27] hover:bg-[#f7f5f1] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Mark Sold
          </button>

          <button
            type="button"
            onClick={onDelete}
            disabled={actionLoading}
            className="rounded-[10px] bg-[#fdeeee] px-3 py-2 text-[13px] font-medium text-[#c0392b] hover:bg-[#fbdede] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}

function DashboardAdSkeleton() {
  return (
    <article className="rounded-card bg-white p-3.5">
      <div className="h-[300px] w-full animate-pulse rounded-[16px] bg-[#f2f2f4]" />
      <div className="space-y-3 pt-3.5">
        <div className="flex items-center justify-between">
          <div className="h-6 w-28 animate-pulse rounded bg-[#f2f2f4]" />
          <div className="h-7 w-12 animate-pulse rounded-[10px] bg-[#f2f2f4]" />
        </div>
        <div className="h-4 w-4/5 animate-pulse rounded bg-[#f2f2f4]" />
        <div className="h-4 w-full animate-pulse rounded bg-[#f2f2f4]" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-[#f2f2f4]" />
      </div>
    </article>
  );
}

export default function AdsDashboardPage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<FilterState>("ACTIVE");
  const [ads, setAds] = useState<DashboardAd[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [editingAd, setEditingAd] = useState<DashboardAd | null>(null);
  const [editForm, setEditForm] = useState<EditFormState | null>(null);
  const [editImageUploading, setEditImageUploading] = useState(false);
  const [editImageError, setEditImageError] = useState<string | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);

  const loadUserAds = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getUserAds(activeFilter);
      setAds(response.data.map(toDashboardAd));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load ads");
    } finally {
      setLoading(false);
    }
  }, [activeFilter]);

  useEffect(() => {
    void loadUserAds();
  }, [loadUserAds]);

  useEffect(() => {
    let active = true;

    const loadCategories = async () => {
      try {
        setCategoriesLoading(true);
        setCategoriesError(null);
        const response = await api.categories();
        if (active) {
          setCategories(response.data);
        }
      } catch (err) {
        if (active) {
          setCategoriesError(err instanceof Error ? err.message : "Failed to load categories");
        }
      } finally {
        if (active) {
          setCategoriesLoading(false);
        }
      }
    };

    void loadCategories();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!editingAd) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [editingAd]);

  const emptyMessage = useMemo(() => {
    if (activeFilter === "ACTIVE") return "No active ads yet.";
    if (activeFilter === "DRAFT") return "No ads are under review.";
    if (activeFilter === "SOLD") return "No sold ads yet.";
    return "No declined ads found.";
  }, [activeFilter]);

  const handleAction = useCallback(async (id: string, action: () => Promise<void>) => {
    try {
      setActionLoadingId(id);
      setNotice(null);
      await action();
      await loadUserAds();
    } catch (err) {
      setNotice({ type: "error", message: err instanceof Error ? err.message : "Action failed" });
    } finally {
      setActionLoadingId(null);
    }
  }, [loadUserAds]);

  const openEditModal = useCallback((ad: DashboardAd) => {
    setNotice(null);
    setEditImageError(null);
    const form = toEditFormState(ad);
    // Populate imageUrls from ad.images
    if (ad.images && ad.images.length > 0) {
      form.imageUrls = ad.images
        .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
        .map((img) => img.url);
    }
    setEditingAd(ad);
    setEditForm(form);
  }, []);

  const closeEditModal = useCallback(() => {
    if (savingEdit) return;
    setEditingAd(null);
    setEditForm(null);
  }, [savingEdit]);

  const updateEditForm = useCallback((patch: Partial<EditFormState>) => {
    setEditForm((current) => (current ? { ...current, ...patch } : current));
  }, []);

  const orderedCategories = useMemo(() => getOrderedPostCategories(categories), [categories]);

  const selectedCategory = useMemo(() => {
    if (!editForm) return null;
    return getCategoryById(editForm.categoryId, categories);
  }, [categories, editForm]);

  const selectedSubcategory = useMemo(() => {
    if (!selectedCategory || !editForm) return null;
    return selectedCategory.children?.find((sub) => sub.id === editForm.subcategoryId) ?? null;
  }, [editForm, selectedCategory]);

  const categorySlug = useMemo(() => {
    if (!editForm) return "";
    return getCategorySlugById(editForm.categoryId, categories);
  }, [categories, editForm]);

  const subcategoryOptions = selectedCategory?.children ?? [];
  const brandOptions = useMemo(() => getBrandOptions(categorySlug, selectedSubcategory?.name), [categorySlug, selectedSubcategory?.name]);
  const modelOptions = useMemo(() => getModelOptions(editForm?.brand ?? ""), [editForm?.brand]);
  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: currentYear - 1980 + 1 }, (_, index) => String(currentYear - index));
  }, []);
  const isVehicleCategory = categorySlug === "vehicles";
  const isKnownBrand = useMemo(() => isBrandInOptions(editForm?.brand ?? "", brandOptions), [brandOptions, editForm?.brand]);
  const brandInputValue = isKnownBrand || !editForm ? "" : editForm.brand;
  const areasForState = editForm?.locationState ? NIGERIAN_AREAS[editForm.locationState] ?? null : null;
  const locationStateOptions = useMemo(() => NIGERIAN_LOCATIONS.filter((location) => location !== ALL_NIGERIA_LOCATION), []);

  const handleEditImageUpload = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (!editForm) return;

    setEditImageError(null);
    const totalImages = editForm.imageUrls.length + files.length;
    if (totalImages > 10) {
      setEditImageError(`Cannot add ${files.length} image(s). Ad cannot have more than 10 images. Current: ${editForm.imageUrls.length}`);
      return;
    }

    try {
      setEditImageUploading(true);
      const response = await api.uploadImages(Array.from(files));
      const newUrls = response.data.urls;
      updateEditForm({ imageUrls: [...editForm.imageUrls, ...newUrls] });
    } catch (err) {
      setEditImageError(err instanceof Error ? err.message : "Failed to upload images");
    } finally {
      setEditImageUploading(false);
    }
  }, [editForm]);

  const handleRemoveEditImage = useCallback((index: number) => {
    if (!editForm) return;
    updateEditForm({ imageUrls: editForm.imageUrls.filter((_, i) => i !== index) });
  }, [editForm]);

  const handleMakeEditCover = useCallback((index: number) => {
    if (!editForm || index <= 0 || index >= editForm.imageUrls.length) return;
    updateEditForm({
      imageUrls: [editForm.imageUrls[index], ...editForm.imageUrls.filter((_, imageIndex) => imageIndex !== index)],
    });
  }, [editForm, updateEditForm]);

  const submitEdit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingAd || !editForm) return;

    const parsedPrice = parsePriceInput(editForm.price);
    if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
      setNotice({ type: "error", message: "Price must be a valid non-negative number." });
      return;
    }

    if (editForm.imageUrls.length < 4 || editForm.imageUrls.length > 10) {
      setNotice({ type: "error", message: "Ad must have between 4 and 10 images." });
      return;
    }

    const nextLocationState = editForm.locationState.trim();
    const nextLocationArea = editForm.locationArea.trim();
    const composedLocation = nextLocationState
      ? (nextLocationArea ? `${nextLocationArea}, ${nextLocationState}` : nextLocationState)
      : editingAd.location;

    const nextSpecifications: Record<string, unknown> = { ...(editingAd.specifications ?? {}) };
    nextSpecifications.negotiable = editForm.negotiable;
    if (editForm.year.trim()) {
      nextSpecifications.year = editForm.year.trim();
    } else {
      delete nextSpecifications.year;
    }

    const payload: AdUpdatePayload = {
      title: editForm.title.trim(),
      description: editForm.description.trim(),
      price: parsedPrice,
      location: composedLocation,
      locationState: nextLocationState || undefined,
      locationArea: nextLocationArea || undefined,
      categoryId: editForm.categoryId,
      subcategoryId: editForm.subcategoryId || undefined,
      brand: editForm.brand.trim() || undefined,
      model: editForm.model.trim() || undefined,
      condition: editForm.condition.trim() || undefined,
      specifications: nextSpecifications,
      imageUrls: editForm.imageUrls,
    };

    try {
      setSavingEdit(true);
      setNotice(null);
      await api.updateAd(editingAd.id, payload);
      await loadUserAds();
      setNotice({ type: "success", message: "Ad updated successfully." });
      closeEditModal();
    } catch (err) {
      setNotice({ type: "error", message: err instanceof Error ? err.message : "Failed to update ad" });
    } finally {
      setSavingEdit(false);
    }
  }, [closeEditModal, editForm, editingAd, loadUserAds]);

  return (
    <div className="min-h-screen bg-page text-ink">
      <SiteHeader navigate={navigate} />

      <main className="mx-auto w-full max-w-[1728px] px-12 pb-20 pt-8">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[310px_1fr]">
          <SettingsSidebar
            className="hidden md:block"
            items={getSettingsNavItems(navigate, "ads")}
          />

          <section>
            <div className="mb-4">
              <MobileSettingsMenu items={getSettingsNavItems(navigate, "ads")} label="Settings" />
            </div>

            {notice ? (
              <div
                className={`mb-4 rounded-[14px] border px-4 py-3 text-[14px] ${
                  notice.type === "success"
                    ? "border-[#d6f2e2] bg-[#edf9f2] text-[#14804a]"
                    : "border-[#f0d1d1] bg-[#fff4f4] text-[#c0392b]"
                }`}
              >
                {notice.message}
              </div>
            ) : null}

            <div className="mb-6 flex flex-wrap gap-3">
              {stateOptions.map((option) => (
                <StateChip
                  key={option.value}
                  label={option.label}
                  active={activeFilter === option.value}
                  onClick={() => setActiveFilter(option.value)}
                />
              ))}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:max-w-[620px]">
                {Array.from({ length: 2 }).map((_, index) => (
                  <div key={index} className="max-w-[300px]">
                    <DashboardAdSkeleton />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="rounded-[18px] border border-[#f0d1d1] bg-white px-6 py-8">
                <p className="text-[15px] text-[#d14343]">{error}</p>
                <button
                  type="button"
                  onClick={loadUserAds}
                  className="mt-4 rounded-[8px] bg-gradient-to-r from-amber to-orange px-4 py-2 text-[15px] text-white"
                >
                  Retry
                </button>
              </div>
            ) : ads.length === 0 ? (
              <p className="text-[15px] text-[#6d6a74]">{emptyMessage}</p>
            ) : (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:max-w-[620px]">
                {ads.map((ad) => (
                  <div key={ad.id} className="max-w-[300px]">
                    <AdCard
                      ad={ad}
                      actionLoading={actionLoadingId === ad.id}
                      onClick={() => navigate(`/product-details/${ad.id}`)}
                      onEdit={() => openEditModal(ad)}
                      onPause={() => {
                        if (!window.confirm("Pause this ad? It will move to Paused/Archived and stop showing in active listings.")) {
                          return;
                        }
                        void handleAction(ad.id, async () => {
                          await api.pauseAd(ad.id);
                          setNotice({ type: "success", message: "Ad paused successfully." });
                        });
                      }}
                      onResume={() => {
                        void handleAction(ad.id, async () => {
                          await api.resumeAd(ad.id);
                          setNotice({ type: "success", message: "Ad resumed and is now active." });
                        });
                      }}
                      onMarkSold={() => {
                        if (!window.confirm("Mark this ad as sold?")) {
                          return;
                        }
                        void handleAction(ad.id, async () => {
                          await api.markAdSold(ad.id);
                          setNotice({ type: "success", message: "Ad marked as sold." });
                        });
                      }}
                      onDelete={() => {
                        if (!window.confirm("Delete this ad permanently? This cannot be undone.")) {
                          return;
                        }
                        void handleAction(ad.id, async () => {
                          await api.deleteAd(ad.id);
                          setNotice({ type: "success", message: "Ad deleted successfully." });
                        });
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {editingAd && editForm ? (
        <div className="fixed inset-0 z-[120] bg-[#1f1d27]/45 px-4 py-6" onClick={closeEditModal}>
          <div
            className="mx-auto flex max-h-[calc(100dvh-3rem)] w-full max-w-[720px] flex-col overflow-hidden rounded-[18px] bg-white p-5 shadow-[0_22px_60px_rgba(31,29,39,0.25)] sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-[24px] font-medium text-[#1f1d27]">Edit Ad</h2>
                <p className="mt-1 text-[14px] text-[#6d6a74]">Update listing details and manage images below.</p>
              </div>
              <button
                type="button"
                className="rounded-[10px] border border-[#e2ded7] px-3 py-1.5 text-[13px] text-[#1f1d27]"
                onClick={closeEditModal}
                disabled={savingEdit}
              >
                Close
              </button>
            </div>

            <form className="grid flex-1 grid-cols-1 gap-4 overflow-y-auto pr-1 sm:grid-cols-2" onSubmit={submitEdit}>
              <label className="flex flex-col gap-1.5 sm:col-span-2">
                <span className="text-[13px] font-medium text-[#4b4a54]">Title</span>
                <input
                  value={editForm.title}
                  onChange={(event) => updateEditForm({ title: event.target.value })}
                  className="h-11 rounded-[10px] border border-[#e2ded7] px-3 text-[14px]"
                  required
                />
              </label>

              <label className="flex flex-col gap-1.5 sm:col-span-2">
                <span className="text-[13px] font-medium text-[#4b4a54]">Description</span>
                <textarea
                  value={editForm.description}
                  onChange={(event) => updateEditForm({ description: event.target.value })}
                  className="min-h-[120px] rounded-[10px] border border-[#e2ded7] px-3 py-2 text-[14px]"
                  required
                />
              </label>

              <DropdownSelect
                label="Category"
                placeholder={categoriesLoading ? "Loading categories..." : "What type of item is it?"}
                value={editForm.categoryId}
                options={orderedCategories.map((category) => ({
                  value: category.id || `missing:${category.slug}`,
                  label: category.name,
                  disabled: !category.available,
                  helperText: category.available ? undefined : "Unavailable right now",
                }))}
                onChange={(value) => {
                  const selectedCategoryOption = orderedCategories.find((category) => category.id === value);
                  if (!selectedCategoryOption?.available) return;
                  updateEditForm({ categoryId: value, subcategoryId: "", brand: "", model: "", year: "" });
                }}
                disabled={categoriesLoading || orderedCategories.length === 0}
                helperText={categoriesError ?? (categoriesLoading ? "Loading categories from the server." : undefined)}
              />

              {subcategoryOptions.length > 0 ? (
                <DropdownSelect
                  label="Subcategory"
                  placeholder="Pick a subcategory"
                  value={editForm.subcategoryId}
                  options={subcategoryOptions.map((sub) => ({ value: sub.id, label: sub.name }))}
                  onChange={(value) => updateEditForm({ subcategoryId: value, brand: "", model: "", year: "" })}
                />
              ) : null}

              <DropdownSelect
                label="Condition"
                placeholder="Select condition"
                value={editForm.condition}
                options={["New", "Foreign Used", "Local Used"].map((option) => ({ value: option, label: option }))}
                onChange={(value) => updateEditForm({ condition: value })}
              />

              <DropdownSelect
                label="State"
                placeholder="Select your state"
                value={editForm.locationState}
                options={locationStateOptions.map((option) => ({ value: option, label: option }))}
                onChange={(value) => updateEditForm({ locationState: value, locationArea: "" })}
              />

              {editForm.locationState && areasForState ? (
                <DropdownSelect
                  label="Area"
                  placeholder="Select your area"
                  value={editForm.locationArea}
                  options={areasForState.map((option) => ({ value: option, label: option }))}
                  onChange={(value) => updateEditForm({ locationArea: value })}
                />
              ) : editForm.locationState ? (
                <label className="flex flex-col gap-1.5">
                  <span className="text-[13px] font-medium text-[#4b4a54]">Area / LGA / Neighbourhood</span>
                  <input
                    value={editForm.locationArea}
                    onChange={(event) => updateEditForm({ locationArea: event.target.value })}
                    className="h-11 rounded-[10px] border border-[#e2ded7] px-3 text-[14px]"
                    placeholder="e.g. Ikeja"
                  />
                </label>
              ) : null}

              <label className="flex flex-col gap-1.5">
                <span className="text-[13px] font-medium text-[#4b4a54]">Price</span>
                <input
                  inputMode="numeric"
                  value={editForm.price}
                  onChange={(event) => updateEditForm({ price: formatPriceInput(event.target.value) })}
                  className="h-11 rounded-[10px] border border-[#e2ded7] px-3 text-[14px]"
                  placeholder="e.g. 250,000"
                  required
                />
              </label>

              <DropdownSelect
                label="Brand"
                placeholder={editForm.categoryId ? "Select brand" : "Select category first"}
                value={editForm.brand}
                options={brandOptions.map((option) => ({ value: option, label: option }))}
                onChange={(value) => updateEditForm({ brand: value, model: "", year: "" })}
                disabled={!editForm.categoryId}
                helperText={!editForm.categoryId ? "Select a category first" : undefined}
              />

              <label className="flex flex-col gap-1.5">
                <span className="text-[13px] font-medium text-[#4b4a54]">Brand (if not listed)</span>
                <input
                  value={brandInputValue}
                  onChange={(event) => updateEditForm({ brand: event.target.value, model: "", year: "" })}
                  className="h-11 rounded-[10px] border border-[#e2ded7] px-3 text-[14px]"
                  placeholder="Type custom brand"
                />
              </label>

              <DropdownSelect
                label="Model"
                placeholder="What's the model?"
                value={editForm.model}
                options={modelOptions.map((option) => ({ value: option, label: option }))}
                onChange={(value) => updateEditForm({ model: value, year: "" })}
                disabled={!editForm.brand.trim()}
                helperText={!editForm.brand.trim() ? "Select or enter a brand first" : undefined}
              />

              {isVehicleCategory && editForm.brand.trim() && editForm.model ? (
                <DropdownSelect
                  label="Year"
                  placeholder="Select vehicle year"
                  value={editForm.year}
                  options={yearOptions.map((option) => ({ value: option, label: option }))}
                  onChange={(value) => updateEditForm({ year: value })}
                />
              ) : null}

              <div className="sm:col-span-2 border-t border-[#e2ded7] pt-4">
                <div className="mb-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-[13px] font-medium text-[#4b4a54]">
                      Product Images ({editForm.imageUrls.length}/10)
                    </span>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="file"
                        multiple
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        onChange={(e) => handleEditImageUpload(e.target.files)}
                        disabled={editImageUploading || editForm.imageUrls.length >= 10}
                        className="hidden"
                      />
                      <button
                        type="button"
                        disabled={editImageUploading || editForm.imageUrls.length >= 10}
                        className="rounded-[8px] border border-[#e2ded7] px-3 py-1.5 text-[12px] font-medium text-[#1f1d27] hover:bg-[#f8f7f3] disabled:cursor-not-allowed disabled:opacity-60"
                        onClick={(e) => {
                          e.preventDefault();
                          (e.currentTarget.previousElementSibling as HTMLInputElement)?.click();
                        }}
                      >
                        {editImageUploading ? "Uploading..." : "Add Images"}
                      </button>
                    </label>
                  </div>

                  {editImageError ? (
                    <div className="mb-3 rounded-[8px] border border-[#f0d1d1] bg-[#fff4f4] px-3 py-2 text-[12px] text-[#c0392b]">
                      {editImageError}
                    </div>
                  ) : null}

                  {editForm.imageUrls.length === 0 ? (
                    <div className="flex h-32 items-center justify-center rounded-[10px] border-2 border-dashed border-[#e2ded7] text-[13px] text-[#999]">
                      No images yet. Add at least 4 images.
                    </div>
                  ) : (
                    <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
                      {editForm.imageUrls.map((url, index) => (
                        <div key={`${url}-${index}`} className="relative aspect-square rounded-[8px] overflow-hidden bg-[#f1efe7] border border-[#e2ded7]">
                          <img
                            src={url}
                            alt={`Product ${index + 1}`}
                            className="h-full w-full object-cover"
                          />
                          {index === 0 ? (
                            <div className="absolute bottom-1 left-1 rounded bg-black/65 px-2 py-1 text-[10px] font-medium text-white">
                              Cover
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleMakeEditCover(index)}
                              disabled={savingEdit}
                              className="absolute bottom-1 left-1 rounded bg-white/90 px-2 py-1 text-[10px] font-medium text-[#1f1d27] shadow-sm transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              Make cover
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveEditImage(index)}
                            className="absolute top-1 right-1 rounded-full bg-[#ff4444] text-white p-1 shadow-md hover:bg-[#ff2222] disabled:opacity-60"
                            disabled={savingEdit}
                            title="Remove image"
                          >
                            <span className="text-[12px] font-bold">✕</span>
                          </button>
                          <div className="absolute bottom-1 left-1 bg-[rgba(0,0,0,0.6)] text-white text-[10px] px-2 py-1 rounded">
                            {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <label className="flex items-center gap-2 self-end pb-2 sm:col-span-2">
                <input
                  type="checkbox"
                  checked={editForm.negotiable}
                  onChange={(event) => updateEditForm({ negotiable: event.target.checked })}
                />
                <span className="text-[13px] font-medium text-[#4b4a54]">Negotiable</span>
              </label>

              <div className="sm:col-span-2 flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeEditModal}
                  disabled={savingEdit}
                  className="rounded-[10px] border border-[#e2ded7] px-4 py-2 text-[14px] font-medium text-[#1f1d27] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="rounded-[10px] bg-gradient-to-r from-amber to-orange px-4 py-2 text-[14px] font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {savingEdit ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      <SiteFooter navigate={navigate} />
    </div>
  );
}
