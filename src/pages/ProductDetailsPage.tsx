import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SiteFooter, SiteHeader } from "../components/AppShell";
import { useToast } from "../context/ToastContext";
import { getToken } from "../services/auth";

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
      <img src={item.images?.[0]?.url || "https://via.placeholder.com/260"} alt={item.title} className="h-[180px] w-full rounded-[12px] object-cover" />
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

export default function ProductDetailsPage() {
  const navigate = useNavigate();
  const { error: showError, info, success } = useToast();
  const { id } = useParams<{ id: string }>();
  const [ad, setAd] = useState<any>(null);
  const [similarAds, setSimilarAds] = useState<SimilarAd[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        setLoading(true);
        if (!id) throw new Error("No product ID provided");
        
        // Fetch main ad
        const response = await fetch(`http://localhost:4000/api/ads/${id}`);
        if (!response.ok) throw new Error("Failed to fetch product");
        const result = await response.json();
        setAd(result.data);

        // Fetch similar ads
        const categoryId = result.data.categoryId;
        const similarResponse = await fetch(`http://localhost:4000/api/ads?pageSize=4&categoryId=${categoryId}`);
        if (similarResponse.ok) {
          const similarResult = await similarResponse.json();
          setSimilarAds(similarResult.data.filter((item: any) => item.id !== id).slice(0, 4));
        }

        // Fetch reviews
        const reviewsResponse = await fetch(`http://localhost:4000/api/ads/${id}/reviews`);
        if (reviewsResponse.ok) {
          const reviewsResult = await reviewsResponse.json();
          setReviews(reviewsResult.data || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAd();
  }, [id]);

  const handlePostReview = async () => {
    if (!reviewText.trim()) return;
    try {
      setLoadingReviews(true);
      const token = getToken();
      if (!token) {
        showError("Please log in to post a review");
        return;
      }
      const response = await fetch(`http://localhost:4000/api/ads/${id}/reviews`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ rating: reviewRating, text: reviewText }),
      });
      if (response.ok) {
        const result = await response.json();
        setReviews([result.data, ...reviews]);
        setReviewText("");
        setReviewRating(5);
      } else {
        showError("Failed to post review");
      }
    } catch (err) {
      console.error("Error posting review:", err);
      showError("Unable to post your review right now");
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
      const method = isSaved ? "DELETE" : "POST";
      const response = await fetch(`http://localhost:4000/api/ads/${id}/save`, { 
        method,
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (response.ok) {
        setIsSaved(!isSaved);
        success(isSaved ? "Product removed from saved items" : "Product saved");
      }
    } catch (err) {
      console.error("Error saving product:", err);
      showError("Unable to update saved products right now");
    }
  };

  const handleMarkUnavailable = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/ads/${id}/mark-unavailable`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        info("Ad marked as unavailable");
      }
    } catch (err) {
      console.error("Error marking unavailable:", err);
      showError("Unable to update this ad right now");
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
      const response = await fetch(`http://localhost:4000/api/ads/${id}/report`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ reason }),
      });
      if (response.ok) {
        success("Thank you for your report. We'll review it shortly.");
      }
    } catch (err) {
      console.error("Error reporting ad:", err);
      showError("Unable to send your report right now");
    }
  };

  if (loading) return <div className="min-h-screen bg-page text-ink flex items-center justify-center"><p>Loading...</p></div>;
  if (error || !ad) return <div className="min-h-screen bg-page text-ink flex items-center justify-center"><p>Error: {error || "Product not found"}</p></div>;

  const gallery = ad.images?.map((img: any) => img.url) || ["https://via.placeholder.com/430"];
  const selected = gallery[activeImage] || "https://via.placeholder.com/430";
  const specs = ad.specifications || {};

  // Convert specs to array for display
  const specArray = Object.entries(specs).map(([k, v]) => [
    k.replace(/([A-Z])/g, " $1").replace(/^./, (str: string) => str.toUpperCase()).trim(),
    v
  ]) as Array<[string, unknown]>;

  return (
    <div className="min-h-screen bg-page text-ink">
      <SiteHeader navigate={navigate} />

      <main className="mx-auto w-full max-w-[1728px] px-10 pb-20 pt-6">
        {/* Main Product Section */}
        <section className="rounded-[18px] bg-[#efefef] p-6">
          <div className="grid grid-cols-1 gap-8 xl:grid-cols-[430px_1fr]">
            {/* Image Gallery */}
            <div>
              <img src={selected} alt={ad.title} className="h-[430px] w-full rounded-[14px] object-cover" />
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
                  onClick={() => navigate("/make-offer")} 
                  type="button"
                >
                  Chat Seller
                </button>
                <button 
                  aria-label={isSaved ? "Remove product from saved items" : "Save product"}
                  className="flex h-[44px] w-[44px] items-center justify-center rounded-[8px] border border-[#d9d7de] bg-white transition-all duration-200 hover:border-[#b9b6c2] hover:bg-[#f8f8fa] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb357] focus-visible:ring-offset-2 focus-visible:ring-offset-white" 
                  onClick={handleSave}
                  type="button"
                >
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
              <img src="https://images.unsplash.com/photo-1542204625-de293a53e17a?w=64" alt="user" className="h-7 w-7 rounded-full object-cover" />
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
                    Post
                  </button>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {reviews.map((review, idx) => (
                <div key={idx} className="flex gap-2.5">
                  <img src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=64" alt="reviewer" className="h-7 w-7 rounded-full object-cover" />
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
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80" className="h-12 w-12 rounded-full object-cover" alt="seller" />
              <div>
                <p className="text-[14px] text-[#8f8b98]">Digi x Enterprise</p>
                <p className="text-[18px]">Registered 4 years ago</p>
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
              <button 
                className="rounded-[8px] bg-badge-bg px-3 py-2 text-[#ff9715] transition-colors duration-200 hover:bg-[#ffe2c5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb357] focus-visible:ring-offset-2 focus-visible:ring-offset-white" 
                onClick={handleMarkUnavailable}
                type="button"
              >
                Mark Unavailable
              </button>
              <button 
                className="rounded-[8px] bg-[#ffe7e7] px-3 py-2 text-[#ff4e4e] transition-colors duration-200 hover:bg-[#ffdada] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb357] focus-visible:ring-offset-2 focus-visible:ring-offset-white" 
                onClick={handleReport}
                type="button"
              >
                Report
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
