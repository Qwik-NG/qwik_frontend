import { useEffect, useMemo, useState } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import AdminModerationModal from '../components/admin/AdminModerationModal';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import type { AdminReview } from '../types';

export default function AdminReviews() {
  const { error: showError, success } = useToast();
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalReviews, setTotalReviews] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReview, setSelectedReview] = useState<AdminReview | null>(null);
  const [moderationReason, setModerationReason] = useState('Abusive or policy-violating review content');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    void fetchReviews();
  }, [page, pageSize]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.adminReviews({ page, pageSize });
      setReviews(response.data);
      setTotalReviews(response.meta?.total ?? response.data.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const filteredReviews = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return reviews.filter((review) => {
      if (!query) return true;
      return (
        review.user.fullName.toLowerCase().includes(query)
        || (review.user.email || '').toLowerCase().includes(query)
        || review.ad.title.toLowerCase().includes(query)
        || review.ad.user.fullName.toLowerCase().includes(query)
        || review.text.toLowerCase().includes(query)
      );
    });
  }, [reviews, searchTerm]);

  const pageCount = Math.max(1, Math.ceil(totalReviews / pageSize));

  const openRemoveModal = (review: AdminReview) => {
    setSelectedReview(review);
    setModerationReason('Abusive or policy-violating review content');
  };

  const closeRemoveModal = () => {
    if (submitting) return;
    setSelectedReview(null);
    setModerationReason('Abusive or policy-violating review content');
  };

  const handleRemoveReview = async () => {
    if (!selectedReview) return;

    try {
      setSubmitting(true);
      await api.deleteAdminReview(selectedReview.id, moderationReason.trim());
      success('Review removed successfully');
      closeRemoveModal();
      await fetchReviews();
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to remove review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Moderate Reviews" description="Review and safely moderate marketplace reviews">
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="rounded-[14px] border border-[#e8e8ea] bg-white p-4">
              <div className="h-4 w-36 animate-pulse rounded bg-[#efedf2]" />
              <div className="mt-3 h-3 w-48 animate-pulse rounded bg-[#efedf2]" />
              <div className="mt-2 h-3 w-56 animate-pulse rounded bg-[#efedf2]" />
            </div>
          ))}
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Moderate Reviews" description="Review and safely moderate marketplace reviews">
        <div className="flex min-h-[280px] flex-col items-center justify-center gap-4 rounded-[14px] border border-[#f2d4d4] bg-white p-6 text-center">
          <div className="text-[16px] font-medium text-red-600">Unable to load reviews</div>
          <div className="max-w-[440px] text-[14px] text-[#7f7e88]">{error}</div>
          <button
            type="button"
            onClick={() => void fetchReviews()}
            className="rounded-lg bg-[#ff9715] px-4 py-2 text-sm font-medium text-white"
          >
            Retry
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Moderate Reviews" description={`Total reviews: ${totalReviews.toLocaleString()}`}>
      <div className="mb-4 grid grid-cols-1 gap-3 rounded-[14px] border border-[#e8e8ea] bg-white p-4 md:grid-cols-[1fr_auto] md:items-center">
        <input
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search by reviewer, ad, seller, or review text"
          className="h-[38px] rounded-[9px] border border-[#d8d5de] px-3 text-[14px] text-[#1f1f29] outline-none focus:border-[#ffb46a] focus:ring-2 focus:ring-[#ffb46a]/25"
        />
        <select
          value={String(pageSize)}
          onChange={(event) => {
            setPage(1);
            setPageSize(Number(event.target.value));
          }}
          className="h-[38px] rounded-[9px] border border-[#d8d5de] px-3 text-[13px] text-[#4f4b59] outline-none focus:border-[#ffb46a]"
        >
          <option value="10">10 / page</option>
          <option value="20">20 / page</option>
          <option value="50">50 / page</option>
          <option value="100">100 / page</option>
        </select>
      </div>

      <div className="mb-3 flex items-center justify-between gap-3 text-[13px] text-[#6f6b77]">
        <span>Showing {filteredReviews.length} review{filteredReviews.length !== 1 ? 's' : ''} on this page</span>
        <span>Page {page} of {pageCount}</span>
      </div>

      {filteredReviews.length === 0 ? (
        <div className="rounded-[16px] border border-[#e8e8ea] bg-white p-10 text-center text-[#7f7e88]">
          No reviews match the current filters.
        </div>
      ) : (
        <>
          <div className="space-y-3 lg:hidden">
            {filteredReviews.map((review) => (
              <article key={review.id} className="rounded-[14px] border border-[#e8e8ea] bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[15px] font-semibold text-[#1f1f29]">{review.ad.title}</p>
                    <p className="mt-1 text-[13px] text-[#6f6b77]">Reviewer: {review.user.fullName}</p>
                    <p className="mt-1 text-[13px] text-[#6f6b77]">Seller: {review.ad.user.fullName}</p>
                  </div>
                  <span className="rounded bg-green-100 px-2 py-1 text-[11px] font-medium text-green-800">Live</span>
                </div>

                <div className="mt-3 text-[13px] text-[#4f4b59]">
                  <span className="font-medium text-[#3f3b47]">Rating:</span> {review.rating}/5
                </div>
                <p className="mt-2 rounded-[10px] bg-[#f7f6f9] px-3 py-2 text-[12px] text-[#4f4b59]">{review.text}</p>
                <div className="mt-2 text-[12px] text-[#7f7e88]">{new Date(review.createdAt).toLocaleString()}</div>

                <div className="mt-3">
                  <button
                    type="button"
                    onClick={() => openRemoveModal(review)}
                    className="rounded-[8px] border border-red-200 px-3 py-1.5 text-[12px] font-medium text-red-700 transition hover:bg-red-50"
                  >
                    Remove Review
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="hidden overflow-x-auto rounded-[16px] border border-[#e8e8ea] bg-white shadow-sm lg:block">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Ad</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Seller</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Reviewer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Review Text</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">State</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredReviews.map((review) => (
                  <tr key={review.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{review.ad.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{review.ad.user.fullName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div>{review.user.fullName}</div>
                      <div className="text-xs text-gray-500">{review.user.email || '-'}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{review.rating}/5</td>
                    <td className="max-w-[280px] px-6 py-4 text-sm text-gray-600">{review.text}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{new Date(review.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-800">Live</span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        type="button"
                        onClick={() => openRemoveModal(review)}
                        className="font-medium text-red-600 transition-colors duration-200 hover:text-red-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb357] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[12px] border border-[#e8e8ea] bg-white px-4 py-3">
        <button
          type="button"
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={page === 1}
          className="h-[36px] rounded-[8px] border border-[#d8d5de] px-3 text-[13px] text-[#4f4b59] transition hover:bg-[#f4f3f6] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>
        <div className="text-[13px] text-[#6f6b77]">{totalReviews.toLocaleString()} total reviews</div>
        <button
          type="button"
          onClick={() => setPage((prev) => Math.min(pageCount, prev + 1))}
          disabled={page >= pageCount}
          className="h-[36px] rounded-[8px] border border-[#d8d5de] px-3 text-[13px] text-[#4f4b59] transition hover:bg-[#f4f3f6] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <AdminModerationModal
        open={Boolean(selectedReview)}
        title="Remove review"
        description={`This will permanently remove the review on ${selectedReview?.ad.title || 'this ad'} from public display.`}
        confirmLabel="Remove Review"
        onConfirm={handleRemoveReview}
        onClose={closeRemoveModal}
        loading={submitting}
        tone="danger"
        reason={moderationReason}
        reasonRequired
        reasonLabel="Moderation reason"
        reasonPlaceholder="Explain why this review is being removed"
        onReasonChange={setModerationReason}
      />
    </AdminLayout>
  );
}
