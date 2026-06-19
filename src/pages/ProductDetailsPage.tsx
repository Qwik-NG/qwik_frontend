import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Lightbox from "yet-another-react-lightbox";
import Counter from "yet-another-react-lightbox/plugins/counter";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/counter.css";
import { SiteFooter, SiteHeader } from "../components/AppShell";
import { FallbackImage } from "../components/ui/FallbackImage";
import { ImagePlaceholder } from "../components/ui/ImagePlaceholder";
import { UserAvatar } from "../components/ui/UserAvatar";
import { useToast } from "../context/ToastContext";
import { formatMemberSince } from "../lib/currentUser";
import { ensureFreshVerifiedEmail } from "../lib/emailVerification";
import { isSellerVerified } from "../lib/sellerVerification";
import { getToken } from "../services/auth";
import { api } from "../services/api";
import type { Ad, User } from "../types";

function LocationPin({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function Spinner({ className = "h-4 w-4" }: { className?: string }) {
  return <span className={`${className} inline-block animate-spin rounded-full border-2 border-current border-t-transparent`} aria-hidden="true" />;
}

function formatPhoneForDisplay(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("0")) {
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  }
  if (digits.length === 13 && digits.startsWith("234")) {
    return `+${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)} ${digits.slice(9)}`;
  }
  return phone;
}

function ProductDetailsSkeleton({ navigate }: { navigate: (to: string) => void }) {
  return (
    <div className="min-h-screen bg-page text-ink">
      <SiteHeader navigate={navigate} />
      <main className="mx-auto w-full max-w-[1360px] px-4 pb-12 pt-4 sm:px-6 sm:pb-16 sm:pt-6 lg:px-10">
        <section className="rounded-[18px] bg-[#efefef] p-4 sm:p-6">
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[420px_1fr_320px]">
            <div>
              <div className="h-[320px] w-full animate-pulse rounded-[14px] bg-white sm:h-[420px]" />
              <div className="mt-3 grid grid-cols-5 gap-1.5 sm:grid-cols-8 xl:grid-cols-10">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="h-[48px] animate-pulse rounded-[4px] bg-white sm:h-[54px]" />
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-5 w-36 animate-pulse rounded bg-white" />
              <div className="h-10 w-4/5 animate-pulse rounded bg-white" />
              <div className="h-4 w-52 animate-pulse rounded bg-white" />
              <div className="h-12 w-56 animate-pulse rounded bg-white" />
              <div className="h-10 w-64 animate-pulse rounded bg-white" />
            </div>
            <div className="h-[220px] animate-pulse rounded-[14px] bg-white" />
          </div>
        </section>
      </main>
    </div>
  );
}

export default function ProductDetailsPage() {
  const navigate = useNavigate();
  const { error: showError, info, success } = useToast();
  const { id } = useParams<{ id: string }>();
  const [ad, setAd] = useState<Ad | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [markingUnavailable, setMarkingUnavailable] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [sharePending, setSharePending] = useState(false);
  const [isPhoneRevealed, setIsPhoneRevealed] = useState(false);
  const [isFollowingSeller, setIsFollowingSeller] = useState(false);
  const [followersCount, setFollowersCount] = useState<number | null>(null);
  const [followLoading, setFollowLoading] = useState(false);

  const fetchAd = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      if (!id) throw new Error("No product ID provided");

      const result = await api.adById(id);
      setAd(result.data);

      const token = getToken();
      const authRequest = token
        ? Promise.all([
            api.isSaved(id),
            api.me(),
            result.data.user?.id ? api.getFollowStatus(result.data.user.id).catch(() => null) : Promise.resolve(null),
          ])
            .then(([savedResponse, meResponse, followStatus]) => {
              setIsSaved(savedResponse.data.saved);
              setCurrentUser(meResponse.data);
              if (followStatus?.data) {
                setIsFollowingSeller(followStatus.data.isFollowing);
                setFollowersCount(followStatus.data.followersCount);
              }
            })
            .catch(() => {
              setIsSaved(false);
              setCurrentUser(null);
              setIsFollowingSeller(false);
              setFollowersCount(null);
            })
        : Promise.resolve();

      await authRequest;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load product");
      console.error("Error fetching product:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAd();
  }, [fetchAd]);

  useEffect(() => {
    setIsPhoneRevealed(false);
    setIsFollowingSeller(false);
    setFollowersCount(null);
    setFollowLoading(false);
  }, [id]);

  const handleSave = async () => {
    try {
      const token = getToken();
      if (!token) {
        showError("Please log in to save products");
        return;
      }
      if (!id) return;
      setSaving(true);
      if (isSaved) await api.unsaveAd(id);
      else await api.saveAd(id);
      setIsSaved(!isSaved);
      success(isSaved ? "Product removed from saved items" : "Product saved");
    } catch (err) {
      console.error("Error saving product:", err);
      showError(err instanceof Error ? err.message : "Unable to update saved products right now");
    } finally {
      setSaving(false);
    }
  };

  const handleMarkUnavailable = async () => {
    try {
      if (!id) return;
      setMarkingUnavailable(true);
      const response = await api.markAdUnavailable(id);
      setAd(response.data);
      info("Ad marked as unavailable");
    } catch (err) {
      console.error("Error marking unavailable:", err);
      showError(err instanceof Error ? err.message : "Unable to update this ad right now");
    } finally {
      setMarkingUnavailable(false);
    }
  };

  const handleChatSeller = async () => {
    const token = getToken();
    if (!token) {
      alert("Please log in to chat with the seller");
      return;
    }

    if (!ad?.user?.id) {
      alert("Seller information is unavailable for this ad");
      return;
    }

    const params = new URLSearchParams({
      recipient: ad.user.id,
      ad: ad.id,
      seller: ad.user.fullName || "Seller",
      title: ad.title,
    });

    const nextPath = `/messages?${params.toString()}`;
    const canContinue = await ensureFreshVerifiedEmail({
      navigate,
      nextPath,
      fallbackUser: currentUser,
      onUnverified: () => showError("Please verify your email to continue."),
    });
    if (!canContinue) return;

    navigate(nextPath);
  };

  const handleStartOffer = async () => {
    const token = getToken();
    if (!token) {
      showError("Please log in to send an offer.");
      navigate("/login");
      return;
    }

    if (!ad) return;

    const nextPath = `/make-offer?adId=${encodeURIComponent(ad.id)}`;
    const canContinue = await ensureFreshVerifiedEmail({
      navigate,
      nextPath,
      fallbackUser: currentUser,
      onUnverified: () => showError("Please verify your email to continue."),
    });
    if (!canContinue) return;

    navigate(nextPath);
  };

  const handleToggleFollowSeller = async () => {
    const token = getToken();
    if (!token) {
      showError("Please log in to follow sellers");
      return;
    }

    if (!ad?.user?.id) {
      showError("Seller information is unavailable");
      return;
    }

    if (currentUser?.id && currentUser.id === ad.user.id) {
      showError("You cannot follow yourself");
      return;
    }

    const previousFollowing = isFollowingSeller;
    const previousCount = followersCount;
    setFollowLoading(true);

    if (previousFollowing) {
      setIsFollowingSeller(false);
      setFollowersCount((current) => (typeof current === "number" ? Math.max(0, current - 1) : current));
    } else {
      setIsFollowingSeller(true);
      setFollowersCount((current) => (typeof current === "number" ? current + 1 : 1));
    }

    try {
      if (previousFollowing) {
        await api.unfollowUser(ad.user.id);
      } else {
        await api.followUser(ad.user.id);
      }

      const statusResponse = await api.getFollowStatus(ad.user.id);
      setIsFollowingSeller(statusResponse.data.isFollowing);
      setFollowersCount(statusResponse.data.followersCount);
    } catch (err) {
      setIsFollowingSeller(previousFollowing);
      setFollowersCount(previousCount);
      showError(err instanceof Error ? err.message : "Unable to update follow status right now");
    } finally {
      setFollowLoading(false);
    }
  };

  const sellerPhoneRaw = ad?.user?.phone?.trim() ?? "";
  const sellerPhoneDigits = sellerPhoneRaw.replace(/\D/g, "");
  const sellerPhoneDisplay = sellerPhoneRaw ? formatPhoneForDisplay(sellerPhoneRaw) : "Phone not available";
  const sellerPhoneDial = sellerPhoneDigits
    ? sellerPhoneDigits.startsWith("0")
      ? `+234${sellerPhoneDigits.slice(1)}`
      : sellerPhoneDigits.startsWith("234")
        ? `+${sellerPhoneDigits}`
        : `+${sellerPhoneDigits}`
    : "";

  const handleCallSeller = () => {
    if (!sellerPhoneRaw) {
      showError("Seller phone number is unavailable");
      return;
    }

    if (!isPhoneRevealed) {
      setIsPhoneRevealed(true);
      return;
    }

    if (!sellerPhoneDial) {
      showError("Seller phone number is invalid");
      return;
    }

    window.location.href = `tel:${sellerPhoneDial}`;
  };

  const handleShareAd = async () => {
    if (!ad) return;
    const shareUrl = window.location.href;
    const sharePayload = {
      title: ad.title,
      text: `Check out this listing on Qwik: ${ad.title}`,
      url: shareUrl,
    };

    try {
      setSharePending(true);
      if (navigator.share) {
        await navigator.share(sharePayload);
        return;
      }
      await navigator.clipboard.writeText(shareUrl);
      success("Listing link copied");
    } catch {
      showError("Unable to share this listing right now");
    } finally {
      setSharePending(false);
    }
  };

  if (loading) return <ProductDetailsSkeleton navigate={navigate} />;
  if (error || !ad) {
    return (
      <div className="min-h-screen bg-page text-ink">
        <SiteHeader navigate={navigate} />
        <main className="mx-auto grid min-h-[60vh] w-full max-w-[1728px] place-items-center px-6 py-16">
          <div className="max-w-md rounded-[18px] border border-[#f0d1d1] bg-white px-6 py-8 text-center">
            <h1 className="text-[24px] font-medium">Failed to load product</h1>
            <p className="mt-3 text-[15px] text-[#6d6a74]">{error || "Product not found"}</p>
            <button
              type="button"
              onClick={fetchAd}
              className="mt-5 rounded-[8px] bg-gradient-to-r from-amber to-orange px-4 py-2 text-[15px] text-white"
            >
              Retry
            </button>
          </div>
        </main>
      </div>
    );
  }

  const gallery = ad.images?.map((img: any) => img.url).filter(Boolean) || [];
  const lightboxSlides = gallery.map((src: string) => ({ src }));
  const selected = gallery[activeImage] ?? gallery[0];
  const specs = ad.specifications || {};
  const specArray = Object.entries(specs).map(([k, v]) => [
    k.replace(/([A-Z])/g, " $1").replace(/^./, (str: string) => str.toUpperCase()).trim(),
    v,
  ]) as Array<[string, unknown]>;
  const sellerName = ad.user?.fullName || "Seller";
  const sellerAvatarUrl = ad.user?.profile?.avatarUrl || "";
  const sellerMeta = formatMemberSince(ad.user?.createdAt);
  const isOwner = Boolean(currentUser?.id && ad.user?.id === currentUser.id);
  const sellerVerified = isSellerVerified(ad.user);
  const sellerAllAdsPath = ad.user?.id ? `/users/${encodeURIComponent(ad.user.id)}` : "/search";

  const showPreviousImage = () => {
    if (gallery.length <= 1) return;
    setActiveImage((current) => (current - 1 + gallery.length) % gallery.length);
  };

  const showNextImage = () => {
    if (gallery.length <= 1) return;
    setActiveImage((current) => (current + 1) % gallery.length);
  };

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    setTouchStartX(event.changedTouches[0]?.clientX ?? null);
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX === null || gallery.length <= 1) return;
    const endX = event.changedTouches[0]?.clientX;
    if (typeof endX !== "number") {
      setTouchStartX(null);
      return;
    }
    const deltaX = endX - touchStartX;
    const SWIPE_THRESHOLD = 40;
    if (deltaX <= -SWIPE_THRESHOLD) {
      showNextImage();
    } else if (deltaX >= SWIPE_THRESHOLD) {
      showPreviousImage();
    }
    setTouchStartX(null);
  };

  const detailRows = specArray.length > 0
    ? specArray
    : [["Condition", ad.condition ?? "Not specified"], ["Availability", ad.status ?? "Available"]] as Array<[string, unknown]>;

  return (
    <div className="min-h-screen bg-page text-ink">
      <SiteHeader navigate={navigate} />

      <main className="mx-auto w-full max-w-[1360px] px-4 pb-12 pt-4 sm:px-6 sm:pb-16 sm:pt-6 lg:px-10">
        <section className="rounded-[20px] bg-[#ececef] p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[440px_minmax(0,1fr)] xl:gap-12">
            <div className="min-w-0">
              <div
                className="relative h-[300px] w-full overflow-hidden rounded-[14px] bg-white sm:h-[420px]"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                {selected ? (
                  <button
                    type="button"
                    onClick={() => setIsLightboxOpen(true)}
                    aria-label="Open product image viewer"
                    className="h-full w-full cursor-zoom-in"
                  >
                    <FallbackImage
                      src={selected}
                      alt={ad.title}
                      className="h-full w-full"
                      fallbackClassName="rounded-[14px]"
                      loading="eager"
                    />
                  </button>
                ) : (
                  <ImagePlaceholder className="rounded-[14px]" />
                )}
                {gallery.length > 1 ? (
                  <>
                    <button
                      type="button"
                      aria-label="Show previous image"
                      onClick={showPreviousImage}
                      className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/55 px-2.5 py-2 text-white transition hover:bg-black/70"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      aria-label="Show next image"
                      onClick={showNextImage}
                      className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/55 px-2.5 py-2 text-white transition hover:bg-black/70"
                    >
                      ›
                    </button>
                  </>
                ) : null}
              </div>
              {gallery.length > 0 ? (
                <div className="mt-3 grid grid-cols-5 gap-1.5 overflow-x-auto pb-1 sm:grid-cols-8 xl:grid-cols-10">
                  {gallery.map((src: string, idx: number) => (
                    <button
                      key={`${src}-${idx}`}
                      className={`overflow-hidden rounded-[4px] border ${idx === activeImage ? "border-orange" : "border-transparent"}`}
                      onClick={() => setActiveImage(idx)}
                      type="button"
                    >
                      <FallbackImage
                        src={src}
                        alt={`thumb-${idx + 1}`}
                        className="h-[48px] w-full sm:h-[54px]"
                        fallbackClassName="h-[48px] sm:h-[54px]"
                      />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="space-y-4">
              <div className="rounded-[14px] bg-transparent p-0.5">
                {sellerVerified ? <p className="mb-2 text-[14px] font-medium text-[#57b77a]">Verified Seller</p> : null}
                <h1 className="text-[30px] font-medium leading-tight text-[#2c2a31]">{ad.title}</h1>
                <p className="mt-1.5 flex items-center gap-1 text-[14px] text-[#6d6a74] sm:text-[15px]">
                  <LocationPin className="h-4 w-4" />
                  <span>{ad.location}</span>
                </p>
                <div className="mt-3 flex items-center gap-2.5">
                  <h2 className="text-[44px] font-semibold leading-none text-[#161420]">₦ {ad.price.toLocaleString()}</h2>
                  <span className="rounded-[8px] bg-badge-bg px-2 py-1 text-[12px] font-medium text-[#ff9715]">New</span>
                </div>
                <p className="mt-1.5 text-[13px] text-[#57b77a]">Check market price</p>
                <div className="mt-5 grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2.5 sm:w-fit">
                  <button
                    className="h-[44px] w-full rounded-[8px] bg-gradient-to-r from-amber to-orange px-5 text-[14px] font-medium text-white shadow-glow transition-all duration-200 hover:opacity-95 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb357] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                    onClick={() => void handleChatSeller()}
                    type="button"
                  >
                    Chat Seller
                  </button>
                  <button
                    aria-label={isSaved ? "Remove product from saved items" : "Save product"}
                    className="flex h-[42px] w-[42px] items-center justify-center rounded-[8px] border border-[#d9d7de] bg-white transition-all duration-200 hover:border-[#b9b6c2] hover:bg-[#f8f8fa] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb357] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                    onClick={handleSave}
                    disabled={saving}
                    type="button"
                  >
                    {saving ? (
                      <Spinner className="h-5 w-5" />
                    ) : (
                      <svg
                        viewBox="0 0 24 24"
                        className="h-5 w-5"
                        fill={isSaved ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        aria-hidden="true"
                      >
                        <path d="M6.5 4.8c0-1 .8-1.8 1.8-1.8h7.4c1 0 1.8.8 1.8 1.8v16.1L12 17.5l-5.5 3.4V4.8Z" />
                      </svg>
                    )}
                  </button>
                    <button
                      aria-label="Share listing"
                      className="flex h-[42px] w-[42px] items-center justify-center rounded-[8px] border border-[#d9d7de] bg-white text-[#7e7b86] transition-all duration-200 hover:border-[#b9b6c2] hover:bg-[#f8f8fa] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb357] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                      onClick={() => void handleShareAd()}
                      disabled={sharePending}
                      type="button"
                    >
                      {sharePending ? (
                        <Spinner className="h-5 w-5" />
                      ) : (
                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <circle cx="18" cy="5" r="2.5" />
                          <circle cx="6" cy="12" r="2.5" />
                          <circle cx="18" cy="19" r="2.5" />
                          <path d="m8.4 10.8 7.2-4.2" />
                          <path d="m8.4 13.2 7.2 4.2" />
                        </svg>
                      )}
                    </button>
                </div>
              </div>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                  <aside className="rounded-[14px] border border-[#e1dfe6] bg-white p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-3">
                        <UserAvatar name={sellerName} imageUrl={sellerAvatarUrl} alt={sellerName} className="h-11 w-11 rounded-full object-cover text-[12px]" />
                        <div>
                          <p className="text-[15px] font-medium text-[#2f2d38]">{sellerName}</p>
                          <p className="text-[12px] text-[#8f8b98]">{sellerMeta}</p>
                          {typeof followersCount === "number" ? (
                            <p className="text-[12px] text-[#8f8b98]">{followersCount} follower{followersCount === 1 ? "" : "s"}</p>
                          ) : null}
                        </div>
                      </div>
                      {!isOwner ? (
                        <button
                          className={`h-8 rounded-[7px] px-2.5 text-[12px] font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb357] focus-visible:ring-offset-2 focus-visible:ring-offset-white ${isFollowingSeller ? "bg-[#e9f4ec] text-[#2f8f53]" : "bg-badge-bg text-[#ff9715] hover:bg-[#ffe2c5]"}`}
                          onClick={handleToggleFollowSeller}
                          disabled={followLoading}
                          type="button"
                        >
                          {followLoading ? "..." : isFollowingSeller ? "Following" : "Follow"}
                        </button>
                      ) : null}
                    </div>

                    <button
                      className="mt-2 text-[13px] font-medium text-[#ff9715]"
                      type="button"
                      onClick={() => navigate(sellerAllAdsPath)}
                    >
                      See all ads
                    </button>

                    <div className="mt-4 space-y-2">
                      <button
                        className="h-10 w-full rounded-[8px] border border-[#ffb46a] bg-[#fff7ef] px-4 text-[14px] font-medium text-[#d97706] transition-colors duration-200 hover:bg-[#ffefdc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb357] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                        onClick={() => void handleStartOffer()}
                        type="button"
                      >
                        Make Offer
                      </button>
                      <button
                        className="h-10 w-full rounded-[8px] bg-badge-bg px-4 text-[14px] font-medium text-[#ff9715] transition-colors duration-200 hover:bg-[#ffe2c5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb357] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                        onClick={handleCallSeller}
                        type="button"
                      >
                        {isPhoneRevealed ? sellerPhoneDisplay : "View Number"}
                      </button>
                    </div>
                  </aside>

                  <div className="rounded-[14px] border border-[#e5e3e9] bg-white p-4 sm:p-5">
                    <h4 className="mb-2 text-[18px] font-semibold">Safety tips</h4>
                    <ul className="space-y-1.5 text-[13px] text-[#6f6b77]">
                      <li className="flex items-start gap-2"><span className="mt-0.5 text-[#57b77a]">•</span><span>Inspect the item before payment</span></li>
                      <li className="flex items-start gap-2"><span className="mt-0.5 text-[#57b77a]">•</span><span>Meet seller in a safe public place</span></li>
                      <li className="flex items-start gap-2"><span className="mt-0.5 text-[#57b77a]">•</span><span>Do not send advance payment</span></li>
                      <li className="flex items-start gap-2"><span className="mt-0.5 text-[#57b77a]">•</span><span>Verify item condition and documents</span></li>
                      <li className="flex items-start gap-2"><span className="mt-0.5 text-[#57b77a]">•</span><span>Report suspicious listings</span></li>
                    </ul>
                    <div className="mt-3 flex items-center gap-2">
                      {isOwner ? (
                        <button
                          className="rounded-[8px] bg-badge-bg px-3 py-2 text-[13px] text-[#ff9715] transition-colors duration-200 hover:bg-[#ffe2c5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb357] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                          onClick={handleMarkUnavailable}
                          disabled={markingUnavailable}
                          type="button"
                        >
                          {markingUnavailable ? "Marking..." : "Mark Unavailable"}
                        </button>
                      ) : null}
                      <span className="text-[12px] text-[#9f9ba8]">Reporting tools coming soon</span>
                    </div>
                  </div>
                </div>
              </div>
          </div>
        </section>

          <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[1.08fr_0.92fr] lg:gap-6">
            <div className="rounded-[14px] border border-[#e5e3e9] bg-white p-4 sm:p-5">
              <h3 className="mb-3 text-[36px] font-normal leading-none">Product Details</h3>
              <p className="mb-5 max-w-[680px] text-[15px] leading-[1.45] text-[#5f5c68]">{ad.description}</p>
              <div className="grid grid-cols-1 gap-x-8 gap-y-4 text-[14px] sm:grid-cols-2">
                {detailRows.map(([k, v]: [string, unknown]) => (
                  <div key={k}>
                    <p className="text-[#8f8b98]">{k}</p>
                    <p className="font-medium text-[#2d2b33]">{String(v)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[14px] border border-[#e5e3e9] bg-white p-4 sm:p-5">
              <h4 className="text-[36px] font-normal leading-none">Reviews</h4>
              <p className="mt-5 text-[14px] text-[#8f8b98]">Reviews coming soon</p>
            </div>
          </section>

          <section className="mt-6 rounded-[14px] border border-dashed border-[#ddd9e4] bg-[#fbfafc] p-4 sm:p-5">
            <h4 className="text-[28px] font-normal">Similar Ads</h4>
            <p className="mt-2 text-[14px] text-[#7f7b87]">Similar ads coming soon</p>
        </section>
      </main>

      <SiteFooter navigate={navigate} />

      <Lightbox
        open={isLightboxOpen}
        close={() => setIsLightboxOpen(false)}
        index={activeImage}
        slides={lightboxSlides}
        plugins={[Counter, Zoom]}
        zoom={{ maxZoomPixelRatio: 4, zoomInMultiplier: 2, doubleTapDelay: 300, scrollToZoom: true }}
        controller={{ closeOnBackdropClick: true }}
        carousel={{ finite: gallery.length <= 1 }}
        on={{ view: ({ index }) => setActiveImage(index) }}
      />
    </div>
  );
}
