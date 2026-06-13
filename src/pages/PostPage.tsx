import { useEffect, useRef, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { SiteFooter, SiteHeader } from "../components/AppShell";
import { PlusIcon } from "../components/icons/CoreIcons";
import { useToast } from "../context/ToastContext";
import { normalizeImageUrls } from "../lib/imageUrls";
import { api } from "../services/api";

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

const MIN_IMAGE_COUNT = 4;
const MAX_IMAGE_COUNT = 10;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

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

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="m16.5 16.5 4 4" />
    </svg>
  );
}

function BookmarkIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
      <path d="M6.5 4.8c0-1 .8-1.8 1.8-1.8h7.4c1 0 1.8.8 1.8 1.8v16.1L12 17.5l-5.5 3.4V4.8Z" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[21px] w-[21px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
      <path d="M18 9.5a6 6 0 0 0-12 0c0 7-2.6 7.5-2.6 7.5h17.2S18 16.5 18 9.5" />
      <path d="M14.2 20a2.4 2.4 0 0 1-4.4 0" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[21px] w-[21px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
      <rect x="4" y="6" width="16" height="12" rx="3" />
      <path d="m7.5 9.5 4.5 3.3 4.5-3.3" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[15px] w-[15px]" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
      <path d="M19 10c0 5.3-7 10-7 10s-7-4.7-7-10a7 7 0 1 1 14 0Z" />
      <circle cx="12" cy="10" r="2.4" />
    </svg>
  );
}


function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
      <path d="M16.5 12.8c0-2 1.7-3 1.8-3.1-1-.1-2-.6-2.6-1.3-1.1-1.1-2.7-1-3.4-.7-.7.3-1.3.7-2 .7-.8 0-1.5-.4-2.3-.7-1-.4-2.3-.1-3.2.8-1.7 1.8-1.4 5.2.3 7.9.8 1.3 1.8 2.7 3.1 2.7 1.2 0 1.7-.8 3.2-.8s1.9.8 3.2.8 2.2-1.2 3-2.5c.5-.7.8-1.5 1-2.1-.1-.1-2.1-.8-2.1-3.7ZM14.9 6.5c.7-.8 1.1-1.8 1-2.8-1 .1-2 .6-2.7 1.4-.6.7-1.1 1.8-1 2.8 1.1.1 2.1-.5 2.7-1.4Z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
      <path d="M5.5 3.6v16.8L14 12 5.5 3.6Zm1.4-.9 9.8 5.6-2 2L6.9 2.7Zm0 18.6 7.8-7.6 2 2-9.8 5.6Zm10.8-12.4 2.4 1.4c1.2.7 1.2 2.1 0 2.8l-2.4 1.4-2.2-2.8 2.2-2.8Z" />
    </svg>
  );
}

function Footer() {
  return (
    <footer className="w-full overflow-hidden bg-deep px-[24px] py-[48px] text-[#5f5d6c] sm:px-[48px] lg:px-[70px] lg:pb-[116px] lg:pt-[112px]">
      <div className="mx-auto grid w-full max-w-[1320px] grid-cols-1 gap-[34px] xl:grid-cols-[minmax(80px,0.7fr)_minmax(390px,3.2fr)_minmax(140px,1fr)_minmax(300px,1.8fr)] xl:gap-[32px] 2xl:gap-[76px]">
        <div className="min-w-0 text-[38px] font-normal leading-none text-orange xl:pt-[4px]">qwik</div>

        <div className="grid min-w-0 grid-cols-3 gap-x-[14px] gap-y-7">
          <div className="min-w-0">
            <h5 className="mb-[16px] text-[14px] font-semibold text-white sm:text-[15px] xl:mb-[28px] xl:text-[17px]">About</h5>
            <a className="mb-[13px] block text-[13px] leading-snug text-[#5f5d6c] sm:text-[14px] xl:mb-[27px] xl:text-[17px]">About Qwik</a>
            <a className="mb-[13px] block text-[13px] leading-snug text-[#5f5d6c] sm:text-[14px] xl:mb-[27px] xl:text-[17px]">Career</a>
            <a className="block text-[13px] leading-snug text-[#5f5d6c] sm:text-[14px] xl:text-[17px]">Terms</a>
          </div>

          <div className="min-w-0">
            <h5 className="mb-[16px] text-[14px] font-semibold text-white sm:text-[15px] xl:mb-[28px] xl:text-[17px]">Resources</h5>
            <a className="mb-[13px] block text-[13px] leading-snug text-[#5f5d6c] sm:text-[14px] xl:mb-[27px] xl:text-[17px]">Blog</a>
            <a className="mb-[13px] block text-[13px] leading-snug text-[#5f5d6c] sm:text-[14px] xl:mb-[27px] xl:text-[17px]">Instagram</a>
            <a className="mb-[13px] block text-[13px] leading-snug text-[#5f5d6c] sm:text-[14px] xl:mb-[27px] xl:text-[17px]">Youtube</a>
            <a className="block text-[13px] leading-snug text-[#5f5d6c] sm:text-[14px] xl:text-[17px]">Twitter</a>
          </div>

          <div className="min-w-0">
            <h5 className="mb-[16px] text-[14px] font-semibold text-white sm:text-[15px] xl:mb-[28px] xl:text-[17px]">Support</h5>
            <a className="mb-[13px] block break-words text-[13px] leading-snug text-[#5f5d6c] sm:text-[14px] xl:mb-[27px] xl:text-[17px]">help@qwik.ng</a>
            <a className="block text-[13px] leading-snug text-[#5f5d6c] sm:text-[14px] xl:text-[17px]">FAQs</a>
          </div>
        </div>

        <div className="min-w-0">
          <h5 className="mb-[16px] text-[15px] font-semibold text-white xl:mb-[24px] xl:text-[17px]">Download</h5>
          <div className="flex w-full min-w-0 flex-row gap-[10px] xl:flex-col xl:gap-0">
            <button className="flex h-[52px] min-w-0 flex-1 items-center justify-center gap-2 rounded-[8px] bg-card/10 text-[14px] text-[#5f5d6c] sm:text-[15px] xl:mb-[24px] xl:h-[58px] xl:w-[142px] xl:flex-none xl:text-[17px]">
              <AppleIcon />
              App Store
            </button>
            <button className="flex h-[52px] min-w-0 flex-1 items-center justify-center gap-2 rounded-[8px] bg-card/10 text-[14px] text-[#5f5d6c] sm:text-[15px] xl:h-[58px] xl:w-[142px] xl:flex-none xl:text-[17px]">
              <PlayIcon />
              Play Store
            </button>
          </div>
        </div>

        <div className="min-w-0 max-w-full">
          <h5 className="mb-[10px] text-[15px] font-semibold text-white xl:mb-[11px] xl:text-[17px]">Stay up to date</h5>
          <p className="mb-[16px] text-[14px] leading-[1.45] text-[#5f5d6c] sm:text-[15px] xl:mb-[18px] xl:text-[17px] xl:leading-[1.35]">Get news, offers, promotions & the best deals sent to your inbox.</p>
          <div className="flex w-full min-w-0 flex-col gap-[10px] xl:flex-row xl:flex-nowrap xl:gap-[8px]">
            <input className="h-[54px] min-w-0 flex-1 rounded-[8px] border border-orange bg-transparent px-[14px] text-[16px] text-muted outline-none xl:h-[48px] xl:px-[12px]" placeholder="@email" />
            <button className="h-[52px] w-full shrink-0 rounded-[8px] bg-gradient-to-r from-amber to-orange px-[18px] text-[16px] text-white shadow-glow xl:h-[48px] xl:w-auto">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

function TextField({
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
      <span className="mb-[10px] block text-[16px] font-medium leading-none text-[#27242d]">{label}</span>
      <input
        type="text"
        className="h-[54px] w-full rounded-[12px] border border-[#dddbe4] bg-white px-[16px] text-[16px] text-[#201d27] outline-none transition placeholder:text-[#a4a0aa] focus:border-orange focus:ring-2 focus:ring-orange/20"
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

function RemoveIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.2">
      <path d="m5 5 10 10M15 5 5 15" />
    </svg>
  );
}

export default function PostPage() {
  const navigate = useNavigate();
  const { success } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [navigating, setNavigating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  useEffect(() => {
    const draft = readDraft();
    setTitle(draft.title || "");
    setDescription(draft.description || "");
    setImageUrls(draft.imageUrls || []);
  }, []);

  const handleFilesSelected = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    try {
      const selectedFiles = Array.from(files);
      const remainingSlots = MAX_IMAGE_COUNT - imageUrls.length;
      if (remainingSlots <= 0) {
        throw new Error("You can upload up to 10 images");
      }

      if (selectedFiles.length > remainingSlots) {
        throw new Error(`You can add ${remainingSlots} more image${remainingSlots === 1 ? "" : "s"}`);
      }

      const invalidType = selectedFiles.find((file) => !ALLOWED_IMAGE_TYPES.has(file.type));
      if (invalidType) {
        throw new Error(`${invalidType.name} must be jpeg, png, webp, or gif`);
      }

      const oversized = selectedFiles.find((file) => file.size > MAX_IMAGE_SIZE);
      if (oversized) {
        throw new Error(`${oversized.name} must be 5MB or smaller`);
      }

      setUploading(true);
      setError(null);
      setUploadMessage(null);

      const payload = await api.uploadImages(selectedFiles);
      const uploadedUrls = normalizeImageUrls(payload.data.urls);
      const nextImageUrls = [...imageUrls, ...uploadedUrls].slice(0, MAX_IMAGE_COUNT);
      setImageUrls(nextImageUrls);
      writeDraft({ ...readDraft(), title, description, imageUrls: nextImageUrls });
      setError(nextImageUrls.length < MIN_IMAGE_COUNT ? "Please upload at least 4 product photos." : null);
      setUploadMessage(`${uploadedUrls.length} image${uploadedUrls.length === 1 ? "" : "s"} uploaded`);
      success("Images uploaded");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload images");
      setUploadMessage(null);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    if (uploading || navigating) return;
    const nextImageUrls = imageUrls.filter((_, imageIndex) => imageIndex !== index);
    setImageUrls(nextImageUrls);
    writeDraft({ ...readDraft(), title: title.trim(), description: description.trim(), imageUrls: nextImageUrls });
    setUploadMessage(null);
    setError(nextImageUrls.length < MIN_IMAGE_COUNT ? "Please upload at least 4 product photos." : null);
  };

  const handleNext = () => {
    if (imageUrls.length < MIN_IMAGE_COUNT) {
      setError("Please upload at least 4 product photos.");
      return;
    }

    if (!canProceed || navigating) return;

    setNavigating(true);
    setError(null);
    const nextDraft = { ...readDraft(), title: title.trim(), description: description.trim(), imageUrls };
    writeDraft(nextDraft);
    window.setTimeout(() => navigate("/new-advert-details"), 120);
  };

  const canProceed = title.trim().length >= 3 && description.trim().length > 0 && imageUrls.length >= MIN_IMAGE_COUNT && !uploading && !navigating;

  return (
    <div className="min-h-screen bg-page font-outfit text-ink">
      <SiteHeader navigate={navigate} />

      <main className="mx-auto flex w-full max-w-[1512px] flex-col items-center px-[20px] pb-[80px] pt-[36px] sm:px-[40px] lg:pb-[100px]">
        <div className="mb-[18px] grid h-[54px] w-full max-w-[420px] place-items-center rounded-[28px] bg-white px-6">
          <h1 className="text-center text-[24px] font-normal leading-none text-ink sm:text-[26px]">New advert</h1>
        </div>

        <section className="w-full max-w-[420px] rounded-[28px] bg-white px-[20px] pb-[24px] pt-[24px] shadow-[0_14px_36px_rgba(26,24,35,0.06)] sm:px-[24px]">
          <h2 className="text-[22px] font-semibold leading-none text-[#201d27]">Add pictures</h2>
          <p className="mt-[12px] max-w-[360px] text-[15px] leading-[1.45] text-[#7c7785]">
            Add a minimum of 4 pictures - your first picture will be used as the cover
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            className="hidden"
            onChange={(event) => void handleFilesSelected(event.target.files)}
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-[18px] flex min-h-[132px] w-full items-center justify-center rounded-[18px] border-2 border-dashed border-[#f1c999] bg-[#fff9f1] text-[#ff7f1f] transition hover:border-orange hover:bg-[#fff3e3] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            disabled={uploading || imageUrls.length >= MAX_IMAGE_COUNT}
          >
            <span className="flex flex-col items-center gap-2 text-center">
              {uploading ? <Spinner /> : <PlusIcon />}
              <span className="text-[15px] font-semibold text-[#201d27]">{uploading ? "Uploading images..." : "Tap to add pictures"}</span>
              <span className="text-[13px] text-[#827c8b]">{imageUrls.length}/{MAX_IMAGE_COUNT} images - jpg, gif, png & webp, 5MB max</span>
            </span>
          </button>

          {imageUrls.length > 0 && (
            <div className="mt-[16px] flex flex-wrap gap-2">
              {imageUrls.map((url, index) => (
                <div key={`${url}-${index}`} className="relative h-[64px] w-[64px] overflow-hidden rounded-[12px]">
                  <img src={url} alt={index === 0 ? "Uploaded ad cover" : "Uploaded ad"} className="h-full w-full object-cover" />
                  {index === 0 ? <span className="absolute bottom-1 left-1 rounded bg-black/65 px-1.5 py-0.5 text-[10px] font-medium text-white">Cover</span> : null}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    disabled={uploading || navigating}
                    aria-label={`Remove image ${index + 1}`}
                    className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/70 text-white shadow-sm transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <RemoveIcon />
                  </button>
                </div>
              ))}
            </div>
          )}

          <p className="mt-[16px] text-[14px] leading-snug text-[#6f6a78]">
            {uploading ? "Please wait while your images upload." : "Upload 4 to 10 images. Accepted formats: jpg, jpeg, gif, png, webp."}
          </p>
          {uploadMessage && <p className="mt-[12px] text-[15px] text-[#57b77a]">{uploadMessage}</p>}
          {error && <p className="mt-[12px] text-[15px] text-[#d14343]">{error}</p>}

          <div className="mt-[30px] space-y-[24px]">
            <TextField label="Title" placeholder="What are you selling?" value={title} onChange={setTitle} />
            <label className="block">
              <span className="mb-[10px] block text-[16px] font-medium leading-none text-[#27242d]">Description</span>
              <textarea
                className="h-[112px] w-full resize-none rounded-[12px] border border-[#dddbe4] bg-white px-[16px] py-[14px] text-[16px] leading-[1.45] text-[#201d27] outline-none transition placeholder:text-[#a4a0aa] focus:border-orange focus:ring-2 focus:ring-orange/20"
                placeholder="A brief description of what it is that you're selling..."
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </label>
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="mt-[26px] flex h-[56px] w-full items-center justify-center gap-2 rounded-[12px] bg-gradient-to-r from-amber to-orange text-[18px] font-semibold text-white shadow-glow transition hover:brightness-105 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-none disabled:bg-[#e1e1e6] disabled:text-[#aaa6b3] disabled:shadow-none"
            disabled={!canProceed}
          >
            {navigating ? <Spinner /> : null}
            {navigating ? "Loading..." : "Next"}
          </button>
        </section>
      </main>

      <SiteFooter navigate={navigate} />
    </div>
  );
}
