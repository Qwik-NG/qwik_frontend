import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SiteFooter, SiteHeader } from "../components/AppShell";
import { ImagePlaceholder } from "../components/ui/ImagePlaceholder";
import { UserAvatar } from "../components/ui/UserAvatar";
import { useToast } from "../context/ToastContext";
import { formatMemberSince } from "../lib/currentUser";
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

type SimilarAd = {
  id: string;
  title: string;
  price: number;
  location: string;
  description: string;
  images: Array<{ url: string }>;
};

function ProductCard({ item, onClick }: { item: SimilarAd; onClick: () => void }) {
  return (
    <article className="cursor-pointer rounded-[18px] bg-white p-3" onClick={onClick}>
      <div className="h-[180px] w-full overflow-hidden rounded-[12px] bg-white">
        {item.images?.[0]?.url ? (
          <img src={item.images[0].url} alt={item.title} className="h-full w-full object-cover" />
        ) : (
          <ImagePlaceholder className="rounded-[12px]" />
        )}
      </div>
      <div className="pt-3">
        <div className="mb-2 flex items-center justify-between">
          <h4 className="text-[20px] font-semibold">₦ {item.price.toLocaleString()}</h4>
          <span className="rounded-[8px] bg-badge-bg px-2.5 py-1 text-[14px] text-[#ff9715]">New</span>
        </div>
        <h5 className="mb-2 text-[16px] font-medium leading-tight">{item.title}</h5>
        <p className="mb-2 text-[14px] leading-[1.35] text-[#6d6a74]">{item.description}</p>
        <small className="flex items-center gap-1 text-[14px] text-[#4b4a54]">
          <LocationPin className="h-4 w-4" />
          <span>{item.location}</span>
        </small>
      </div>
    </article>
  );
}

function Spinner({ className = "h-4 w-4" }: { className?: string }) {
  return <span className={`${className} inline-block animate-spin rounded-full border-2 border-current border-t-transparent`} aria-hidden="true" />;
}

function ProductDetailsSkeleton({ navigate }: { navigate: (to: string) => void }) {
  return (
    <div className="min-h-screen bg-page text-ink">
      <SiteHeader navigate={navigate} />
      <main className="mx-auto w-full max-w-[1728px] px-10 pb-20 pt-6">
        <section className="rounded-[18px] bg-[#efefef] p-6">
          <div className="grid grid-cols-1 gap-8 xl:grid-cols-[430px_1fr]">
            <div>
              <div className="h-[430px] w-full animate-pulse rounded-[14px] bg-white" />
              <div className="mt-3 grid grid-cols-5 gap-1.5 sm:grid-cols-10">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="h-[54px] animate-pulse rounded-[4px] bg-white" />
                ))}
              </div>
            </div>
            <div className="space-y-5 pt-10">
              <div className="h-5 w-36 animate-pulse rounded bg-white" />
              <div className="h-12 w-4/5 animate-pulse rounded bg-white" />
              <div className="h-5 w-52 animate-pulse rounded bg-white" />
              <div className="h-14 w-64 animate-pulse rounded bg-white" />
              <div className="flex gap-3">
                <div className="h-[44px] w-28 animate-pulse rounded-[8px] bg-white" />
                <div className="h-[44px] w-[44px] animate-pulse rounded-[8px] bg-white" />
              </div>
            </div>
          </div>
        </section>
        <section className="mt-8 grid grid-cols-1 gap-5 xl:grid-cols-2">
          <div className="rounded-[18px] bg-[#efefef] p-6">
            <div className="mb-4 h-6 w-40 animate-pulse rounded bg-white" />
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 animate-pulse rounded-full bg-white" />
              <div className="space-y-2">
                <div className="h-4 w-32 animate-pulse rounded bg-white" />
                <div className="h-5 w-44 animate-pulse rounded bg-white" />
              </div>
            </div>
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
  const [similarAds, setSimilarAds] = useState<SimilarAd[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [markingUnavailable, setMarkingUnavailable] = useState(false);

  const fetchAd = useCallback(async () => {
      try {
        setLoading(true);
        setError(null);
        if (!id) throw new Error("No product ID provided");
        
        const result = await api.adById(id);
        setAd(result.data);

        const token = getToken();
        if (token) {
          try {
            const [savedResponse, meResponse] = await Promise.all([api.isSaved(id), api.me()]);
            setIsSaved(savedResponse.data.saved);
            setCurrentUser(meResponse.data);
          } catch {
            setIsSaved(false);
            setCurrentUser(null);
          }
        } else {
          setIsSaved(false);
          setCurrentUser(null);
        }

        // Fetch similar ads
        const categoryId = result.data.categoryId;
        const similarResult = await api.ads(`?pageSize=4&categoryId=${categoryId}&imagesLimit=1`);
        setSimilarAds(similarResult.data.filter((item: any) => item.id !== id).slice(0, 4));

        // Fetch reviews
        const reviewsResult = await api.getReviews(id);
        setReviews(reviewsResult.data || []);
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

  const handlePostReview = async () => {
    if (!reviewText.trim()) return;
    try {
      setLoadingReviews(true);
      const token = getToken();
      if (!token) {
        showError("Please log in to post a review");
        return;
      }
      if (!id) return;
      const result = await api.postReview(id, { rating: reviewRating, text: reviewText });
      setReviews([result.data, ...reviews]);
      setReviewText("");
      setReviewRating(5);
      success("Review posted");
    } catch (err) {
      console.error("Error posting review:", err);
      showError(err instanceof Error ? err.message : "Unable to post your review right now");
    } finally {
      setLoadingReviews(false);
    }
  };

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

  const handleReport = async () => {
    const reason = prompt("Please provide a reason for reporting this ad:");
    if (!reason) return;
    try {
      const token = getToken();
      if (!token) {
        showError("Please log in to report ads");
        return;
      }
      if (!id) return;
      setReporting(true);
      await api.reportAd(id, { reason });
      success("Thank you for your report. We'll review it shortly.");
    } catch (err) {
      console.error("Error reporting ad:", err);
      showError(err instanceof Error ? err.message : "Unable to send your report right now");
    } finally {
      setReporting(false);
    }
  };

  const handleChatSeller = () => {
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

    navigate(`/messages?${params.toString()}`);
  };

  if (loading) return <ProductDetailsSkeleton navigate={navigate} />;
  if (error || !ad) return (
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

  const gallery = ad.images?.map((img: any) => img.url).filter(Boolean) || [];
  const selected = gallery[activeImage];
  const specs = ad.specifications || {};

  // Convert specs to array for display
  const specArray = Object.entries(specs).map(([k, v]) => [
    k.replace(/([A-Z])/g, " $1").replace(/^./, (str: string) => str.toUpperCase()).trim(),
    v
  ]) as Array<[string, unknown]>;
  const sellerName = ad.user?.fullName || "Seller";
  const sellerAvatarUrl = ad.user?.profile?.avatarUrl || "";
  const sellerMeta = formatMemberSince(ad.user?.createdAt);
  const isOwner = Boolean(currentUser?.id && ad.user?.id === currentUser.id);

  return (
    <div className="min-h-screen bg-page text-ink">
      <SiteHeader navigate={navigate} />

      <main className="mx-auto w-full max-w-[1728px] px-10 pb-20 pt-6">
        {/* Main Product Section */}
        <section className="rounded-[18px] bg-[#efefef] p-6">
          <div className="grid grid-cols-1 gap-8 xl:grid-cols-[430px_1fr]">
            {/* Image Gallery */}
            <div>
              <div className="h-[430px] w-full overflow-hidden rounded-[14px] bg-white">
                {selected ? (
                  <img src={selected} alt={ad.title} className="h-full w-full object-cover" />
                ) : (
                  <ImagePlaceholder className="rounded-[14px]" />
                )}
              </div>
              {gallery.length > 0 ? (
                <div className="mt-3 grid grid-cols-10 gap-1.5">
                  {gallery.map((src: string, idx: number) => (
                    <button
                      key={src}
                      className={`overflow-hidden rounded-[4px] border ${idx === activeImage ? "border-orange" : "border-transparent"}`}
                      onClick={() => setActiveImage(idx)}
                      type="button"
                    >
                      <img src={src} alt={`thumb-${idx + 1}`} className="h-[54px] w-full object-cover" />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            
            {/* Product Info */}
            <div className="pt-10">
              <p className="mb-2 text-[18px] text-[#57b77a]">Verified Seller</p>
              <h1 className="text-[42px] leading-tight">{ad.title}</h1>
              <p className="mb-6 mt-1 flex items-center gap-1 text-[18px] text-[#6d6a74]">
                <LocationPin />
                <span>{ad.location}</span>
              </p>
              <div className="mb-2 flex items-center gap-3">
                <h2 className="text-[54px] font-semibold">₦ {ad.price.toLocaleString()}</h2>
                <span className="rounded-[8px] bg-badge-bg px-2.5 py-1 text-[16px] text-[#ff9715]">New</span>
              </div>
              <p className="mb-6 text-[18px] text-[#57b77a]">Check market price</p>
              <div className="flex items-center gap-3">
                <button 
                  className="h-[44px] rounded-[8px] bg-gradient-to-r from-amber to-orange px-4 text-[16px] text-white shadow-glow transition-all duration-200 hover:opacity-95 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb357] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                  onClick={handleChatSeller} 
                  type="button"
                >
                  Chat Seller
                </button>
                <button 
                  aria-label={isSaved ? "Remove product from saved items" : "Save product"}
                  className="flex h-[44px] w-[44px] items-center justify-center rounded-[8px] border border-[#d9d7de] bg-white transition-all duration-200 hover:border-[#b9b6c2] hover:bg-[#f8f8fa] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb357] focus-visible:ring-offset-2 focus-visible:ring-offset-white" 
                  onClick={handleSave}
                  disabled={saving}
                  type="button"
                >
                  {saving ? <Spinner className="h-5 w-5" /> : <svg
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
                  </svg>}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Product Details & Reviews */}
        <section className="mt-10 grid grid-cols-1 gap-10 xl:grid-cols-2">
          {/* Product Details */}
          <div>
            <h3 className="mb-5 text-[40px] font-medium">Product Details</h3>
            <p className="mb-8 max-w-[540px] text-[18px] leading-[1.35] text-[#5f5c68]">
              {ad.description}
            </p>
            {specArray.length > 0 && (
              <div className="grid grid-cols-2 gap-x-10 gap-y-5 text-[16px]">
                {specArray.map(([k, v]: [string, unknown]) => (
                  <div key={k}>
                    <p className="text-[#8f8b98]">{k}</p>
                    <p className="font-medium">{String(v)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Reviews */}
          <div>
            <h3 className="mb-5 text-[40px] font-medium">Reviews</h3>
            <div className="mb-4 flex gap-2">
              <UserAvatar name="You" className="h-7 w-7 rounded-full object-cover text-[10px]" />
              <div className="flex-1 rounded-panel border border-[#d9d7df] bg-white p-3">
                <input 
                  className="w-full border-none bg-transparent text-[14px] outline-none"
                  placeholder="I noticed that..." 
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                />
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="rounded-full px-1 text-[18px] transition-transform duration-150 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb357] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                        type="button"
                      >
                        {star <= reviewRating ? "★" : "☆"}
                      </button>
                    ))}
                  </div>
                  <button 
                    className="h-7 w-7 rounded-full bg-[#ff9a00] text-white transition-all duration-200 hover:bg-[#eb8e00] active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb357] focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:opacity-50"
                    onClick={handlePostReview}
                    disabled={loadingReviews || !reviewText.trim()}
                    type="button"
                  >
                    {loadingReviews ? <Spinner className="mx-auto h-3.5 w-3.5" /> : "Post"}
                  </button>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {reviews.map((review, idx) => (
                <div key={idx} className="flex gap-2.5">
                  <UserAvatar
                    name={review.user?.fullName || "User"}
                    imageUrl={review.user?.profile?.avatarUrl}
                    alt={review.user?.fullName || "User"}
                    className="h-7 w-7 rounded-full object-cover text-[10px]"
                  />
                  <div>
                    <p className="text-[14px]">
                      {review.user?.fullName || "Anonymous"} <span className="text-[#8f8b98]">{new Date(review.createdAt).toLocaleDateString()}</span> <span className="text-[#ff9a00]">{"★".repeat(review.rating)}</span>
                    </p>
                    <p className="max-w-[500px] text-[14px] text-[#3f3c47]">{review.text}</p>
                  </div>
                </div>
              ))}
              {reviews.length === 0 && <p className="text-[14px] text-[#8f8b98]">No reviews yet. Be the first to review!</p>}
            </div>
          </div>
        </section>

        {/* Seller Info & Safety Tips */}
        <section className="mt-8 grid grid-cols-1 gap-5 xl:grid-cols-2">
          {/* Seller Card */}
          <div className="rounded-[18px] bg-[#efefef] p-6">
            <div className="flex items-center gap-3">
              <UserAvatar name={sellerName} imageUrl={sellerAvatarUrl} alt={sellerName} className="h-12 w-12 rounded-full object-cover text-[12px]" />
              <div>
                <p className="text-[14px] text-[#8f8b98]">{sellerName}</p>
                <p className="text-[18px]">{sellerMeta}</p>
                <button className="text-[14px] text-[#ff9715]" type="button">See all ads</button>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="h-10 rounded-[8px] bg-gradient-to-r from-amber to-orange px-4 text-white shadow-glow transition-all duration-200 hover:opacity-95 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb357] focus-visible:ring-offset-2 focus-visible:ring-offset-white" onClick={() => navigate("/make-offer")} type="button">Make an offer</button>
              <button className="h-10 rounded-[8px] bg-badge-bg px-4 text-[#ff9715] transition-colors duration-200 hover:bg-[#ffe2c5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb357] focus-visible:ring-offset-2 focus-visible:ring-offset-white" type="button">Call</button>
            </div>
          </div>

          {/* Safety Tips */}
          <div className="rounded-[18px] bg-[#efefef] p-6">
            <h4 className="mb-2 text-[20px] font-medium">Safety tips</h4>
            <ul className="list-disc pl-4 text-[14px] text-[#8f8b98]">
              <li>Remember, don't send any pre-payments</li>
              <li>Meet the seller at a safe public place</li>
              <li>Inspect the goods to make sure they meet your needs</li>
              <li>Check all documentation and only pay if you're satisfied</li>
            </ul>
            <div className="mt-4 flex gap-2">
              {isOwner ? (
                <button 
                  className="rounded-[8px] bg-badge-bg px-3 py-2 text-[#ff9715] transition-colors duration-200 hover:bg-[#ffe2c5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb357] focus-visible:ring-offset-2 focus-visible:ring-offset-white" 
                  onClick={handleMarkUnavailable}
                  disabled={markingUnavailable}
                  type="button"
                >
                  {markingUnavailable ? "Marking..." : "Mark Unavailable"}
                </button>
              ) : null}
              <button 
                className="rounded-[8px] bg-[#ffe7e7] px-3 py-2 text-[#ff4e4e] transition-colors duration-200 hover:bg-[#ffdada] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb357] focus-visible:ring-offset-2 focus-visible:ring-offset-white" 
                onClick={handleReport}
                disabled={reporting}
                type="button"
              >
                {reporting ? "Reporting..." : "Report"}
              </button>
            </div>
          </div>
        </section>

        {/* Similar Ads */}
        {similarAds.length > 0 && (
          <section className="mt-10">
            <h3 className="mb-4 text-[40px] font-medium">Similar Ads</h3>
            <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
              {similarAds.map((item) => (
                <ProductCard key={item.id} item={item} onClick={() => navigate(`/product-details/${item.id}`)} />
              ))}
            </div>
          </section>
        )}
      </main>

      <SiteFooter navigate={navigate} />
    </div>
  );
}
