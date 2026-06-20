import { useEffect, useState } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import AdminModerationModal from '../components/admin/AdminModerationModal';
import AdminPreviewModal from '../components/admin/AdminPreviewModal';
import AdminRowActionsMenu, { type AdminRowActionItem } from '../components/admin/AdminRowActionsMenu';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import type { Ad, AdminAd } from '../types';

type ModerationAction = 'unlist' | 'reinstate' | 'delete';

export default function AdminAds() {
  const { error: showError, success } = useToast();
  const [ads, setAds] = useState<AdminAd[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalAds, setTotalAds] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'ARCHIVED' | 'SOLD' | 'DRAFT'>('ALL');
  const [selectedAd, setSelectedAd] = useState<AdminAd | null>(null);
  const [actionType, setActionType] = useState<ModerationAction | null>(null);
  const [reason, setReason] = useState('');
  const [submittingAction, setSubmittingAction] = useState(false);
  const [previewAd, setPreviewAd] = useState<AdminAd | null>(null);
  const [previewDetails, setPreviewDetails] = useState<Ad | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  useEffect(() => {
    void fetchAds();
  }, [page, pageSize, searchTerm, statusFilter]);

  const fetchAds = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.adminAds({
        page,
        pageSize,
        search: searchTerm.trim() || undefined,
        status: statusFilter === 'ALL' ? undefined : statusFilter,
      });
      setAds(response.data);
      setTotalAds(response.meta?.total ?? response.data.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load ads');
    } finally {
      setLoading(false);
    }
  };

  const pageCount = Math.max(1, Math.ceil(totalAds / pageSize));

  const openAdPreview = async (ad: AdminAd) => {
    setPreviewAd(ad);
    setPreviewDetails(null);
    setPreviewLoading(true);
    try {
      const response = await api.adById(ad.id);
      setPreviewDetails(response.data);
    } catch {
      setPreviewDetails(null);
    } finally {
      setPreviewLoading(false);
    }
  };

  const closeAdPreview = () => {
    setPreviewAd(null);
    setPreviewDetails(null);
    setPreviewLoading(false);
  };

  const openActionModal = (ad: AdminAd, action: ModerationAction) => {
    setSelectedAd(ad);
    setActionType(action);
    if (action === 'unlist') {
      setReason('Policy violation');
      return;
    }
    if (action === 'delete') {
      setReason('Severe policy violation');
      return;
    }
    setReason('');
  };

  const closeModal = () => {
    if (submittingAction) return;
    setSelectedAd(null);
    setActionType(null);
    setReason('');
  };

  const handleModerationAction = async () => {
    if (!selectedAd || !actionType) return;

    try {
      setSubmittingAction(true);

      if (actionType === 'unlist') {
        await api.moderateAdminAdStatus(selectedAd.id, {
          status: 'ARCHIVED',
          reason: reason.trim() || undefined,
        });
        success('Ad unlisted successfully');
      }

      if (actionType === 'reinstate') {
        await api.moderateAdminAdStatus(selectedAd.id, {
          status: 'ACTIVE',
          reason: reason.trim() || undefined,
        });
        success('Ad reinstated successfully');
      }

      if (actionType === 'delete') {
        await api.deleteAdminAd(selectedAd.id, reason.trim() || undefined);
        success('Ad deleted permanently');
      }

      closeModal();
      await fetchAds();
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Error updating ad moderation state');
    } finally {
      setSubmittingAction(false);
    }
  };

  const modalConfig = (() => {
    if (!selectedAd || !actionType) return null;

    if (actionType === 'unlist') {
      return {
        title: 'Unlist ad',
        description: `This will hide ${selectedAd.title} from all public listings until it is reinstated.`,
        confirmLabel: 'Unlist Ad',
        tone: 'neutral' as const,
        reasonRequired: true,
        reasonLabel: 'Unlist reason',
        reasonPlaceholder: 'Describe why this listing is being unlisted',
      };
    }

    if (actionType === 'reinstate') {
      return {
        title: 'Reinstate ad',
        description: `This will make ${selectedAd.title} visible in public listings again.`,
        confirmLabel: 'Reinstate Ad',
        tone: 'success' as const,
        reasonRequired: false,
        reasonLabel: 'Reinstate note (optional)',
        reasonPlaceholder: 'Optional note for audit context',
      };
    }

    return {
      title: 'Permanently delete ad',
      description: `This is irreversible. ${selectedAd.title} and its related listing data will be permanently removed.`,
      confirmLabel: 'Delete Permanently',
      tone: 'danger' as const,
      reasonRequired: true,
      reasonLabel: 'Delete reason',
      reasonPlaceholder: 'Provide the policy reason for permanent deletion',
    };
  })();

  const getDesktopAdActions = (ad: AdminAd) => {
    const status = ad.status || 'ACTIVE';

    const actions: AdminRowActionItem[] = [
      {
        label: 'View ad',
        onClick: () => void openAdPreview(ad),
        icon: (
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
            <circle cx="12" cy="12" r="2.5" />
          </svg>
        ),
      },
    ];

    if (status === 'ACTIVE' || status === 'ARCHIVED') {
      actions.push({
        label: status === 'ARCHIVED' ? 'Reinstate' : 'Unlist',
        onClick: () => openActionModal(ad, status === 'ARCHIVED' ? 'reinstate' : 'unlist'),
        icon: status === 'ARCHIVED' ? (
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M6 10V8a6 6 0 1 1 12 0v2" />
            <rect x="5" y="10" width="14" height="10" rx="2" />
            <path d="m9 15 2 2 4-4" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M6 10V8a6 6 0 1 1 12 0v2" />
            <rect x="5" y="10" width="14" height="10" rx="2" />
            <path d="M8 15h8" />
          </svg>
        ),
      });
    }

    actions.push({
      label: 'Delete permanently',
      onClick: () => openActionModal(ad, 'delete'),
      danger: true,
      icon: (
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M4 7h16" />
          <path d="M9 7V5h6v2" />
          <path d="M6 7l1 13h10l1-13" />
          <path d="M10 11v5M14 11v5" />
        </svg>
      ),
    });

    return actions;
  };

  const previewStatus = previewAd?.status || 'ACTIVE';
  const previewImage = previewDetails?.images?.[0]?.url;
  const previewDescription = previewDetails?.description || previewAd?.description || 'No description available.';

  if (loading) {
    return (
      <AdminLayout title="Moderate Ads" description="Unlist, reinstate, or permanently remove listings">
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="rounded-[14px] border border-[#e8e8ea] bg-white p-4">
              <div className="h-4 w-36 animate-pulse rounded bg-[#efedf2]" />
              <div className="mt-3 h-3 w-44 animate-pulse rounded bg-[#efedf2]" />
              <div className="mt-2 h-3 w-56 animate-pulse rounded bg-[#efedf2]" />
            </div>
          ))}
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Moderate Ads" description="Unlist, reinstate, or permanently remove listings">
        <div className="flex min-h-[280px] flex-col items-center justify-center gap-4 rounded-[14px] border border-[#f2d4d4] bg-white p-6 text-center">
          <div className="text-[16px] font-medium text-red-600">Unable to load ads</div>
          <div className="max-w-[440px] text-[14px] text-[#7f7e88]">{error}</div>
          <button
            type="button"
            onClick={() => void fetchAds()}
            className="rounded-lg bg-[#ff9715] px-4 py-2 text-sm font-medium text-white"
          >
            Retry
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Moderate Ads" description={`Total ads: ${totalAds.toLocaleString()}`}>
      <div className="mb-4 grid grid-cols-1 gap-3 rounded-[14px] border border-[#e8e8ea] bg-white p-4 md:grid-cols-[1fr_auto_auto] md:items-center">
        <input
          type="search"
          value={searchTerm}
          onChange={(event) => {
            setSearchTerm(event.target.value);
            setPage(1);
          }}
          placeholder="Search by title, seller, or category"
          className="h-[38px] rounded-[9px] border border-[#d8d5de] px-3 text-[14px] text-[#1f1f29] outline-none focus:border-[#ffb46a] focus:ring-2 focus:ring-[#ffb46a]/25"
        />
        <select
          value={statusFilter}
          onChange={(event) => {
            setStatusFilter(event.target.value as 'ALL' | 'ACTIVE' | 'ARCHIVED' | 'SOLD' | 'DRAFT');
            setPage(1);
          }}
          className="h-[38px] rounded-[9px] border border-[#d8d5de] px-3 text-[13px] text-[#4f4b59] outline-none focus:border-[#ffb46a]"
        >
          <option value="ALL">All status</option>
          <option value="ACTIVE">Active</option>
          <option value="ARCHIVED">Archived</option>
          <option value="SOLD">Sold</option>
          <option value="DRAFT">Draft</option>
        </select>
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
        <span>Showing {ads.length} listing{ads.length !== 1 ? 's' : ''} on this page</span>
        <span>Page {page} of {pageCount}</span>
      </div>

      {ads.length === 0 ? (
        <div className="rounded-[16px] border border-[#e8e8ea] bg-white p-10 text-center text-[#7f7e88]">
          No ads match the current filters.
        </div>
      ) : (
        <>
          <div className="space-y-3 lg:hidden">
            {ads.map((ad) => {
              const status = ad.status || 'ACTIVE';
              return (
                <article key={ad.id} className={`rounded-[14px] border bg-white p-4 shadow-sm ${ad._count.reports > 0 ? 'border-[#f2d4d4]' : 'border-[#e8e8ea]'}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[15px] font-semibold text-[#1f1f29]">{ad.title}</p>
                      <p className="mt-1 text-[13px] text-[#6f6b77]">{ad.user.fullName}</p>
                    </div>
                    <span className={`rounded px-2 py-1 text-[11px] font-medium ${
                      status === 'ACTIVE' ? 'bg-green-100 text-green-800' : status === 'ARCHIVED' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {status}
                    </span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-[12px] text-[#6f6b77]">
                    <div><span className="font-medium text-[#3f3b47]">Category:</span> {ad.category.name}</div>
                    <div><span className="font-medium text-[#3f3b47]">Price:</span> ₦{ad.price.toLocaleString()}</div>
                    <div><span className="font-medium text-[#3f3b47]">Reports:</span> {ad._count.reports}</div>
                    <div><span className="font-medium text-[#3f3b47]">Posted:</span> {ad.createdAt ? new Date(ad.createdAt).toLocaleDateString() : '-'}</div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {status === 'ACTIVE' ? (
                      <button
                        onClick={() => openActionModal(ad, 'unlist')}
                        className="rounded-[8px] border border-yellow-200 px-3 py-1.5 text-[12px] font-medium text-yellow-700 transition hover:bg-yellow-50"
                        type="button"
                      >
                        Unlist
                      </button>
                    ) : null}
                    {status === 'ARCHIVED' ? (
                      <button
                        onClick={() => openActionModal(ad, 'reinstate')}
                        className="rounded-[8px] border border-green-200 px-3 py-1.5 text-[12px] font-medium text-green-700 transition hover:bg-green-50"
                        type="button"
                      >
                        Reinstate
                      </button>
                    ) : null}
                    <button
                      onClick={() => openActionModal(ad, 'delete')}
                      className="rounded-[8px] border border-red-200 px-3 py-1.5 text-[12px] font-medium text-red-700 transition hover:bg-red-50"
                      type="button"
                    >
                      Delete Permanently
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="hidden overflow-x-auto rounded-[16px] border border-[#e8e8ea] bg-white shadow-sm lg:block">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Seller</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Reports</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Posted</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {ads.map((ad) => {
                  const status = ad.status || 'ACTIVE';
                  return (
                    <tr key={ad.id} className={`hover:bg-gray-50 ${ad._count.reports > 0 ? 'bg-red-50/40' : ''}`}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{ad.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{ad.user.fullName}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{ad.category.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">₦{ad.price.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`rounded px-2 py-1 text-xs font-medium ${
                          status === 'ACTIVE' ? 'bg-green-100 text-green-800' : status === 'ARCHIVED' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {ad._count.reports > 0 ? (
                          <span className="rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-800">{ad._count.reports}</span>
                        ) : '0'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {ad.createdAt ? new Date(ad.createdAt).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center justify-end">
                          <AdminRowActionsMenu ariaLabel={`Open actions for ${ad.title}`} items={getDesktopAdActions(ad)} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
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
        <div className="text-[13px] text-[#6f6b77]">{totalAds.toLocaleString()} total ads</div>
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
        open={Boolean(selectedAd && actionType && modalConfig)}
        title={modalConfig?.title || 'Moderate listing'}
        description={modalConfig?.description || ''}
        confirmLabel={modalConfig?.confirmLabel || 'Confirm'}
        onConfirm={handleModerationAction}
        onClose={closeModal}
        loading={submittingAction}
        tone={modalConfig?.tone || 'danger'}
        reason={reason}
        reasonRequired={modalConfig?.reasonRequired || false}
        reasonLabel={modalConfig?.reasonLabel || 'Reason'}
        reasonPlaceholder={modalConfig?.reasonPlaceholder || 'Enter reason'}
        onReasonChange={setReason}
      />

      <AdminPreviewModal
        open={Boolean(previewAd)}
        title={previewAd ? `Ad Preview: ${previewAd.title}` : 'Ad Preview'}
        onClose={closeAdPreview}
        footer={
          previewAd ? (
            <div className="flex flex-wrap items-center justify-end gap-2">
              <button
                type="button"
                onClick={closeAdPreview}
                className="h-[38px] rounded-[9px] border border-[#d8d5de] px-4 text-[13px] font-medium text-[#4f4b59] transition hover:bg-[#f4f3f6]"
              >
                Close
              </button>
              {previewStatus === 'ARCHIVED' ? (
                <button
                  type="button"
                  onClick={() => {
                    closeAdPreview();
                    openActionModal(previewAd, 'reinstate');
                  }}
                  className="h-[38px] rounded-[9px] border border-green-200 bg-white px-4 text-[13px] font-semibold text-green-700 transition hover:bg-green-50"
                >
                  Reinstate
                </button>
              ) : previewStatus === 'ACTIVE' ? (
                <button
                  type="button"
                  onClick={() => {
                    closeAdPreview();
                    openActionModal(previewAd, 'unlist');
                  }}
                  className="h-[38px] rounded-[9px] border border-yellow-200 bg-white px-4 text-[13px] font-semibold text-yellow-700 transition hover:bg-yellow-50"
                >
                  Unlist
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => {
                  closeAdPreview();
                  openActionModal(previewAd, 'delete');
                }}
                className="h-[38px] rounded-[9px] border border-[#f0c7c7] bg-[#fff5f5] px-4 text-[13px] font-semibold text-[#c73b3b] transition hover:bg-[#ffecec]"
              >
                Delete Permanently
              </button>
            </div>
          ) : null
        }
      >
        {previewAd ? (
          <div className="space-y-4">
            <div className="overflow-hidden rounded-[12px] border border-[#ece9f1] bg-[#f6f5f8]">
              {previewImage ? (
                <img src={previewImage} alt={previewAd.title} className="h-[200px] w-full object-cover sm:h-[260px]" />
              ) : (
                <div className="grid h-[200px] w-full place-items-center text-[14px] text-[#7d7888] sm:h-[260px]">
                  Main image unavailable
                </div>
              )}
            </div>

            <div className="rounded-[12px] border border-[#ece9f1] bg-white p-3 sm:p-4">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-[18px] font-semibold text-[#1f1f29] sm:text-[20px]">{previewAd.title}</h4>
                <span className={`rounded px-2 py-1 text-[11px] font-medium ${previewStatus === 'ACTIVE' ? 'bg-green-100 text-green-800' : previewStatus === 'ARCHIVED' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                  {previewStatus}
                </span>
              </div>
              <p className="mt-2 text-[22px] font-semibold text-[#1f1f29]">₦{previewAd.price.toLocaleString()}</p>
              <p className="mt-3 whitespace-pre-wrap text-[14px] leading-[1.55] text-[#4d4957]">{previewDescription}</p>
            </div>

            {previewLoading ? (
              <div className="rounded-[12px] border border-[#ece9f1] bg-white p-4 text-[14px] text-[#6f6b77]">Loading listing details...</div>
            ) : null}

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-[12px] border border-[#ece9f1] bg-white p-3">
                <p className="text-[12px] font-medium uppercase tracking-[0.04em] text-[#8d8898]">Category</p>
                <p className="mt-1 text-[14px] text-[#1f1f29]">{previewAd.category.name}</p>
              </div>
              <div className="rounded-[12px] border border-[#ece9f1] bg-white p-3">
                <p className="text-[12px] font-medium uppercase tracking-[0.04em] text-[#8d8898]">Location</p>
                <p className="mt-1 text-[14px] text-[#1f1f29]">{previewDetails?.location || previewAd.location || 'Not available'}</p>
              </div>
              <div className="rounded-[12px] border border-[#ece9f1] bg-white p-3">
                <p className="text-[12px] font-medium uppercase tracking-[0.04em] text-[#8d8898]">Seller</p>
                <p className="mt-1 text-[14px] text-[#1f1f29]">{previewAd.user.fullName}</p>
                <p className="text-[13px] text-[#6f6b77]">{previewAd.user.email || 'Email unavailable'}</p>
              </div>
              <div className="rounded-[12px] border border-[#ece9f1] bg-white p-3">
                <p className="text-[12px] font-medium uppercase tracking-[0.04em] text-[#8d8898]">Engagement</p>
                <p className="mt-1 text-[14px] text-[#1f1f29]">Reports: {previewAd._count.reports} • Reviews: {previewAd._count.reviews}</p>
              </div>
              <div className="rounded-[12px] border border-[#ece9f1] bg-white p-3 sm:col-span-2">
                <p className="text-[12px] font-medium uppercase tracking-[0.04em] text-[#8d8898]">Created</p>
                <p className="mt-1 text-[14px] text-[#1f1f29]">{previewAd.createdAt ? new Date(previewAd.createdAt).toLocaleString() : 'Not available'}</p>
              </div>
            </div>
          </div>
        ) : null}
      </AdminPreviewModal>
    </AdminLayout>
  );
}
