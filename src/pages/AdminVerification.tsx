import { useCallback, useEffect, useRef, useState } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import AdminModerationModal from '../components/admin/AdminModerationModal';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import type { VerificationApplication, VerificationStatus } from '../types';

function formatBytes(bytes?: number | null) {
  if (!bytes) return null;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ---------- Document preview (image / PDF / fallback) ----------

function DocumentPreview({ url, name, type }: { url: string; name?: string | null; type?: string | null }) {
  const [imgError, setImgError] = useState(false);
  const [pdfError, setPdfError] = useState(false);

  const isImage = /\.(jpg|jpeg|png|gif|webp|svg)(\?|$)/i.test(url) || Boolean(type?.startsWith('image/'));
  const isPdf = /\.pdf(\?|$)/i.test(url) || type === 'application/pdf';

  if (isImage && !imgError) {
    return (
      <div className="mt-3 overflow-hidden rounded-[10px] border border-[#e8e8ea] bg-[#f9f9fb]">
        <img
          src={url}
          alt={name ?? 'Document preview'}
          className="max-h-[280px] w-full object-contain"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  if (isPdf && !pdfError) {
    return (
      <div className="mt-3 h-[280px] overflow-hidden rounded-[10px] border border-[#e8e8ea]">
        <iframe
          src={url}
          title={name ?? 'PDF preview'}
          className="h-full w-full"
          onError={() => setPdfError(true)}
        />
      </div>
    );
  }

  return (
    <div className="mt-3 flex items-center gap-2 rounded-[10px] border border-dashed border-[#d8d5de] bg-[#f9f9fb] px-4 py-3 text-[13px] text-[#9f9ba8]">
      <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>
      <span>Preview unavailable for this file type.</span>
    </div>
  );
}

// ---------- Helpers ----------

function humanizeKey(key: string): string {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase()).trim();
}

// ---------- Rich details / documents modal ----------

function VerificationDetailsModal({
  item,
  onClose,
  onApprove,
  onReject,
}: {
  item: VerificationApplication | null;
  onClose: () => void;
  onApprove: (item: VerificationApplication) => void;
  onReject: (item: VerificationApplication) => void;
}) {
  useEffect(() => {
    if (!item) return;
    const handler = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [item, onClose]);

  if (!item) return null;

  const pending = item.status === 'SUBMITTED' || item.status === 'IN_REVIEW';
  const docs = item.documents ?? [];
  const businessInfo = (item.businessInfo ?? {}) as Record<string, string>;
  const businessKeys = Object.keys(businessInfo).filter((k) => businessInfo[k]);

  return (
    <div
      className="fixed inset-0 z-[150] flex items-end justify-center bg-black/50 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-label="Verification details"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="flex max-h-[92vh] w-full max-w-[720px] flex-col overflow-hidden rounded-[20px] bg-white shadow-xl">

        {/* Sticky header */}
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[#e8e8ea] px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-[20px] font-semibold text-[#1f1f29]">{item.user?.fullName || 'Applicant'}</h2>
              <span className={`rounded px-2 py-1 text-[11px] font-medium ${statusClass(item.status)}`}>{item.status}</span>
            </div>
            {item.user?.email ? <p className="mt-0.5 truncate text-[13px] text-[#6f6b77]">{item.user.email}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-[8px] px-3 py-1.5 text-[13px] text-[#7a7684] transition hover:bg-[#f4f3f6]"
          >
            Close
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">

          {/* Application details */}
          <section className="mb-6">
            <h3 className="mb-3 text-[12px] font-semibold uppercase tracking-widest text-[#9f9ba8]">Application Details</h3>
            <dl className="grid grid-cols-1 gap-x-6 gap-y-3 rounded-[12px] border border-[#e8e8ea] p-4 text-[13px] sm:grid-cols-2">
              <div>
                <dt className="font-medium text-[#3f3b47]">Type</dt>
                <dd className="mt-0.5 text-[#4f4b59]">{item.type}</dd>
              </div>
              <div>
                <dt className="font-medium text-[#3f3b47]">Store name</dt>
                <dd className="mt-0.5 text-[#4f4b59]">{businessInfo.storeName || '-'}</dd>
              </div>
              <div>
                <dt className="font-medium text-[#3f3b47]">Submitted</dt>
                <dd className="mt-0.5 text-[#4f4b59]">{formatDateTime(item.submittedAt) || '-'}</dd>
              </div>
              <div>
                <dt className="font-medium text-[#3f3b47]">Reviewed at</dt>
                <dd className="mt-0.5 text-[#4f4b59]">{formatDateTime(item.reviewedAt) || '-'}</dd>
              </div>
              <div>
                <dt className="font-medium text-[#3f3b47]">Reviewer</dt>
                <dd className="mt-0.5 text-[#4f4b59]">
                  {item.reviewer?.fullName || '-'}
                  {item.reviewer?.email ? <span className="ml-1 text-[#9f9ba8]">({item.reviewer.email})</span> : null}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-[#3f3b47]">Payment status</dt>
                <dd className="mt-0.5 text-[#4f4b59]">{item.paymentStatus || '-'}</dd>
              </div>
              {item.rejectionReason ? (
                <div className="col-span-full">
                  <dt className="font-medium text-red-700">Rejection reason</dt>
                  <dd className="mt-0.5 text-red-600">{item.rejectionReason}</dd>
                </div>
              ) : null}
            </dl>
          </section>

          {/* Business information */}
          {businessKeys.length > 0 ? (
            <section className="mb-6">
              <h3 className="mb-3 text-[12px] font-semibold uppercase tracking-widest text-[#9f9ba8]">Business Information</h3>
              <dl className="grid grid-cols-1 gap-x-6 gap-y-3 rounded-[12px] border border-[#e8e8ea] p-4 text-[13px] sm:grid-cols-2">
                {businessKeys.map((key) => (
                  <div key={key}>
                    <dt className="font-medium text-[#3f3b47]">{humanizeKey(key)}</dt>
                    <dd className="mt-0.5 break-words text-[#4f4b59]">{businessInfo[key]}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}

          {/* Submitted documents */}
          <section>
            <h3 className="mb-3 text-[12px] font-semibold uppercase tracking-widest text-[#9f9ba8]">
              Submitted Documents ({docs.length})
            </h3>
            {docs.length === 0 ? (
              <p className="rounded-[12px] border border-[#e8e8ea] px-4 py-6 text-center text-[14px] text-[#9f9ba8]">
                No documents submitted yet.
              </p>
            ) : (
              <ul className="space-y-4">
                {docs.map((doc, index) => {
                  const meta = [
                    doc.type,
                    doc.purpose !== 'verification_document' ? doc.purpose : null,
                    formatBytes(doc.size),
                    doc.createdAt ? formatDateTime(doc.createdAt) : null,
                  ].filter(Boolean).join(' · ');
                  return (
                    <li key={doc.id ?? index} className="rounded-[14px] border border-[#e8e8ea] p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-[14px] font-medium text-[#1f1f29]">
                            {doc.name || `Document ${index + 1}`}
                          </p>
                          {meta ? <p className="mt-0.5 text-[12px] text-[#7f7e88]">{meta}</p> : null}
                        </div>
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 rounded-[8px] border border-[#d8d5de] px-3 py-1.5 text-[12px] font-medium text-[#4f4b59] transition hover:bg-[#f4f3f6]"
                        >
                          Open ↗
                        </a>
                      </div>
                      <DocumentPreview url={doc.url} name={doc.name} type={doc.type} />
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>

        {/* Sticky footer: approve / reject */}
        {pending ? (
          <div className="flex shrink-0 flex-wrap items-center justify-end gap-3 border-t border-[#e8e8ea] px-5 py-4 sm:px-6">
            <button
              type="button"
              onClick={() => { onReject(item); onClose(); }}
              className="rounded-[8px] border border-red-200 px-4 py-2 text-[13px] font-medium text-red-700 transition hover:bg-red-50"
            >
              Reject
            </button>
            <button
              type="button"
              onClick={() => { onApprove(item); onClose(); }}
              className="rounded-[8px] border border-green-200 bg-green-50 px-4 py-2 text-[13px] font-medium text-green-700 transition hover:bg-green-100"
            >
              Approve
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

// ---------- Desktop 3-dot actions menu ----------

function ThreeDotsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <circle cx="12" cy="5" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="12" cy="19" r="1.5" />
    </svg>
  );
}

function RowActionsMenu({
  item,
  onViewDetails,
  onApprove,
  onReject,
}: {
  item: VerificationApplication;
  onViewDetails: (item: VerificationApplication) => void;
  onApprove: (item: VerificationApplication) => void;
  onReject: (item: VerificationApplication) => void;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const pending = item.status === 'SUBMITTED' || item.status === 'IN_REVIEW';

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const close = useCallback(() => setOpen(false), []);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="grid h-8 w-8 place-items-center rounded-[8px] text-[#9f9ba8] transition hover:bg-[#f4f3f6] hover:text-[#4f4b59]"
        aria-label="Row actions"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <ThreeDotsIcon />
      </button>

      {open ? (
        <div
          className="absolute right-0 top-full z-20 mt-1 w-[180px] overflow-hidden rounded-[12px] border border-[#e8e8ea] bg-white py-1 shadow-[0_8px_24px_rgba(31,29,39,0.12)]"
          role="menu"
        >
          <button
            type="button"
            role="menuitem"
            onClick={() => { onViewDetails(item); close(); }}
            className="flex w-full items-center px-4 py-2 text-left text-[13px] text-[#1f1f29] transition hover:bg-[#f4f3f6]"
          >
            View Details
          </button>
          {pending ? (
            <>
              <div className="mx-3 my-1 border-t border-[#e8e8ea]" role="separator" />
              <button
                type="button"
                role="menuitem"
                onClick={() => { onApprove(item); close(); }}
                className="flex w-full items-center px-4 py-2 text-left text-[13px] text-green-700 transition hover:bg-green-50"
              >
                Approve
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => { onReject(item); close(); }}
                className="flex w-full items-center px-4 py-2 text-left text-[13px] text-red-700 transition hover:bg-red-50"
              >
                Reject
              </button>
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function statusClass(status: VerificationStatus) {
  if (status === 'APPROVED') return 'bg-green-100 text-green-800';
  if (status === 'REJECTED') return 'bg-red-100 text-red-800';
  if (status === 'SUBMITTED' || status === 'IN_REVIEW') return 'bg-yellow-100 text-yellow-800';
  return 'bg-gray-100 text-gray-800';
}

function formatDateTime(value?: string | null) {
  if (!value) return '-';
  return new Date(value).toLocaleString();
}

function formatDateInput(value?: string | null) {
  if (!value) return '';
  return new Date(value).toISOString().slice(0, 10);
}

function businessValue(item: VerificationApplication, key: string) {
  return item.businessInfo?.[key] || '-';
}

export default function AdminVerification() {
  const { error: showError, success } = useToast();
  const [verifications, setVerifications] = useState<VerificationApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalVerifications, setTotalVerifications] = useState(0);
  const [statusFilter, setStatusFilter] = useState<'ALL' | VerificationStatus>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedVerification, setSelectedVerification] = useState<VerificationApplication | null>(null);
  const [nextStatus, setNextStatus] = useState<'APPROVED' | 'REJECTED' | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [decisionNote, setDecisionNote] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [docViewItem, setDocViewItem] = useState<VerificationApplication | null>(null);

  useEffect(() => {
    void fetchVerifications();
  }, [statusFilter, page, pageSize, searchTerm, fromDate, toDate]);

  const fetchVerifications = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.adminVerifications({
        status: statusFilter === 'ALL' ? undefined : statusFilter,
        page,
        pageSize,
        search: searchTerm.trim() || undefined,
        from: fromDate || undefined,
        to: toDate || undefined,
      });
      setVerifications(response.data);
      setTotalVerifications(response.meta?.total ?? response.data.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading verifications');
    } finally {
      setLoading(false);
    }
  };

  const openVerificationAction = (item: VerificationApplication, status: 'APPROVED' | 'REJECTED') => {
    setSelectedVerification(item);
    setNextStatus(status);
    setDecisionNote('');
    setRejectionReason(status === 'REJECTED' ? 'Verification requirements not met' : '');
  };

  const closeVerificationModal = () => {
    if (updatingId) return;
    setSelectedVerification(null);
    setNextStatus(null);
    setRejectionReason('');
    setDecisionNote('');
  };

  const updateVerification = async () => {
    if (!selectedVerification || !nextStatus) return;
    if (nextStatus === 'REJECTED' && !rejectionReason.trim()) {
      showError('Rejection reason is required');
      return;
    }

    try {
      setUpdatingId(selectedVerification.id);
      await api.updateAdminVerification(selectedVerification.id, {
        status: nextStatus,
        rejectionReason: nextStatus === 'REJECTED' ? rejectionReason.trim() : undefined,
        decisionNote: decisionNote.trim() || undefined,
      });
      success(nextStatus === 'APPROVED' ? 'Verification approved successfully' : 'Verification rejected successfully');
      closeVerificationModal();
      await fetchVerifications();
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Unable to update verification');
    } finally {
      setUpdatingId(null);
    }
  };

  const pendingCount = verifications.filter((item) => item.status === 'SUBMITTED' || item.status === 'IN_REVIEW').length;
  const pageCount = Math.max(1, Math.ceil(totalVerifications / pageSize));

  if (loading) {
    return (
      <AdminLayout title="Verification Review" description="Review seller verification applications">
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="rounded-[14px] border border-[#e8e8ea] bg-white p-4">
              <div className="h-4 w-32 animate-pulse rounded bg-[#efedf2]" />
              <div className="mt-3 h-3 w-48 animate-pulse rounded bg-[#efedf2]" />
              <div className="mt-2 h-3 w-60 animate-pulse rounded bg-[#efedf2]" />
            </div>
          ))}
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Verification Review" description="Review seller verification applications">
        <div className="flex min-h-[280px] flex-col items-center justify-center gap-4 rounded-[14px] border border-[#f2d4d4] bg-white p-6 text-center">
          <div className="text-[16px] font-medium text-red-600">Unable to load verification applications</div>
          <div className="max-w-[440px] text-[14px] text-[#7f7e88]">{error}</div>
          <button
            type="button"
            onClick={() => void fetchVerifications()}
            className="rounded-lg bg-[#ff9715] px-4 py-2 text-sm font-medium text-white"
          >
            Retry
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Verification Review" description={`${pendingCount} pending, ${totalVerifications.toLocaleString()} total`}>
      <div className="mb-4 grid grid-cols-1 gap-3 rounded-[14px] border border-[#e8e8ea] bg-white p-4 md:grid-cols-2 xl:grid-cols-4">
        <input
          type="search"
          value={searchTerm}
          onChange={(event) => {
            setSearchTerm(event.target.value);
            setPage(1);
          }}
          placeholder="Search applicant/reviewer name or email"
          className="h-[38px] rounded-[9px] border border-[#d8d5de] px-3 text-[14px] text-[#1f1f29] outline-none focus:border-[#ffb46a] focus:ring-2 focus:ring-[#ffb46a]/25"
        />
        <select
          value={statusFilter}
          onChange={(event) => {
            setStatusFilter(event.target.value as 'ALL' | VerificationStatus);
            setPage(1);
          }}
          className="h-[38px] rounded-[9px] border border-[#d8d5de] px-3 text-[13px] text-[#4f4b59] outline-none focus:border-[#ffb46a]"
        >
          <option value="ALL">All status</option>
          <option value="DRAFT">Draft</option>
          <option value="SUBMITTED">Submitted</option>
          <option value="IN_REVIEW">In review</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
        <input
          type="date"
          value={fromDate}
          onChange={(event) => {
            setFromDate(event.target.value);
            setPage(1);
          }}
          className="h-[38px] rounded-[9px] border border-[#d8d5de] px-3 text-[13px] text-[#4f4b59] outline-none focus:border-[#ffb46a]"
        />
        <input
          type="date"
          value={toDate}
          onChange={(event) => {
            setToDate(event.target.value);
            setPage(1);
          }}
          className="h-[38px] rounded-[9px] border border-[#d8d5de] px-3 text-[13px] text-[#4f4b59] outline-none focus:border-[#ffb46a]"
        />
      </div>

      <div className="mb-3 flex items-center justify-between gap-3 text-[13px] text-[#6f6b77]">
        <span>Showing {verifications.length} application{verifications.length !== 1 ? 's' : ''} on this page</span>
        <div className="flex items-center gap-3">
          <span>Page {page} of {pageCount}</span>
          <select
            value={String(pageSize)}
            onChange={(event) => {
              setPage(1);
              setPageSize(Number(event.target.value));
            }}
            className="h-[32px] rounded-[8px] border border-[#d8d5de] px-2 text-[12px] text-[#4f4b59] outline-none focus:border-[#ffb46a]"
          >
            <option value="10">10 / page</option>
            <option value="20">20 / page</option>
            <option value="50">50 / page</option>
            <option value="100">100 / page</option>
          </select>
        </div>
      </div>

      {verifications.length === 0 ? (
        <div className="rounded-[16px] border border-[#e8e8ea] bg-white p-10 text-center text-[#7f7e88]">
          No verification applications match the current filters.
        </div>
      ) : (
        <>
          <div className="space-y-3 lg:hidden">
            {verifications.map((item) => {
              const submittedDate = item.submittedAt || item.createdAt;
              const decisionNoteText = item.rejectionReason || item.decisionNote || '-';
              const reviewer = item.reviewer?.fullName || '-';
              const pending = item.status === 'SUBMITTED' || item.status === 'IN_REVIEW';

              return (
                <article key={item.id} className="rounded-[14px] border border-[#e8e8ea] bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[15px] font-semibold text-[#1f1f29]">{item.user?.fullName || 'Applicant'}</p>
                      <p className="mt-1 text-[13px] text-[#6f6b77]">{item.user?.email || '-'}</p>
                    </div>
                    <span className={`rounded px-2 py-1 text-[11px] font-medium ${statusClass(item.status)}`}>
                      {item.status}
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-[12px] text-[#6f6b77]">
                    <div><span className="font-medium text-[#3f3b47]">Type:</span> {item.type}</div>
                    <div><span className="font-medium text-[#3f3b47]">Submitted:</span> {formatDateTime(submittedDate)}</div>
                    <div><span className="font-medium text-[#3f3b47]">Store:</span> {businessValue(item, 'storeName')}</div>
                    <div><span className="font-medium text-[#3f3b47]">Reviewer:</span> {reviewer}</div>
                    <div className="col-span-2"><span className="font-medium text-[#3f3b47]">Decision notes:</span> {decisionNoteText}</div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setDocViewItem(item)}
                      className="rounded-[8px] border border-[#d8d5de] px-3 py-1.5 text-[12px] font-medium text-[#4f4b59] transition hover:bg-[#f4f3f6]"
                    >
                      View Details{item.documents?.length ? ` (${item.documents.length} docs)` : ''}
                    </button>
                    {pending ? (
                      <>
                        <button
                          type="button"
                          onClick={() => openVerificationAction(item, 'APPROVED')}
                          className="rounded-[8px] border border-green-200 px-3 py-1.5 text-[12px] font-medium text-green-700 transition hover:bg-green-50"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => openVerificationAction(item, 'REJECTED')}
                          className="rounded-[8px] border border-red-200 px-3 py-1.5 text-[12px] font-medium text-red-700 transition hover:bg-red-50"
                        >
                          Reject
                        </button>
                      </>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>

          <div className="hidden overflow-x-auto rounded-[16px] border border-[#e8e8ea] bg-white shadow-sm lg:block">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Applicant</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Submitted</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Reviewer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Reviewed At</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Decision Notes</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {verifications.map((item) => {
                  const pending = item.status === 'SUBMITTED' || item.status === 'IN_REVIEW';
                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="font-medium">{item.user?.fullName || 'Applicant'}</div>
                        <div className="text-xs text-gray-500">{item.user?.email || '-'}</div>
                        <div className="text-xs text-gray-500">Store: {businessValue(item, 'storeName')}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{item.type}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{formatDateInput(item.submittedAt || item.createdAt)}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`rounded px-2 py-1 text-xs font-medium ${statusClass(item.status)}`}>{item.status}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {item.reviewer?.fullName || '-'}
                        {item.reviewer?.email ? <div className="text-xs text-gray-500">{item.reviewer.email}</div> : null}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{formatDateTime(item.reviewedAt)}</td>
                      <td className="max-w-[260px] px-6 py-4 text-sm text-gray-600">{item.rejectionReason || item.decisionNote || '-'}</td>
                      <td className="px-6 py-4 text-sm">
                        <RowActionsMenu
                          item={item}
                          onViewDetails={(v) => setDocViewItem(v)}
                          onApprove={(v) => openVerificationAction(v, 'APPROVED')}
                          onReject={(v) => openVerificationAction(v, 'REJECTED')}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      <VerificationDetailsModal
        item={docViewItem}
        onClose={() => setDocViewItem(null)}
        onApprove={(v) => openVerificationAction(v, 'APPROVED')}
        onReject={(v) => openVerificationAction(v, 'REJECTED')}
      />

      <AdminModerationModal
        open={Boolean(selectedVerification && nextStatus)}
        title={nextStatus === 'APPROVED' ? 'Approve verification' : 'Reject verification'}
        description={nextStatus === 'APPROVED'
          ? `Approve verification for ${selectedVerification?.user?.fullName || 'this applicant'}.`
          : `Reject verification for ${selectedVerification?.user?.fullName || 'this applicant'}.`}
        confirmLabel={nextStatus === 'APPROVED' ? 'Approve Verification' : 'Reject Verification'}
        onConfirm={updateVerification}
        onClose={closeVerificationModal}
        loading={Boolean(updatingId)}
        tone={nextStatus === 'APPROVED' ? 'success' : 'danger'}
        reason={nextStatus === 'REJECTED' ? rejectionReason : decisionNote}
        reasonRequired={nextStatus === 'REJECTED'}
        reasonLabel={nextStatus === 'REJECTED' ? 'Rejection reason' : 'Decision note (optional)'}
        reasonPlaceholder={nextStatus === 'REJECTED' ? 'Explain why this application was rejected' : 'Optional decision note for audit context'}
        onReasonChange={nextStatus === 'REJECTED' ? setRejectionReason : setDecisionNote}
      />

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[12px] border border-[#e8e8ea] bg-white px-4 py-3">
        <button
          type="button"
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={page === 1}
          className="h-[36px] rounded-[8px] border border-[#d8d5de] px-3 text-[13px] text-[#4f4b59] transition hover:bg-[#f4f3f6] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>
        <div className="text-[13px] text-[#6f6b77]">{totalVerifications.toLocaleString()} total applications</div>
        <button
          type="button"
          onClick={() => setPage((prev) => Math.min(pageCount, prev + 1))}
          disabled={page >= pageCount}
          className="h-[36px] rounded-[8px] border border-[#d8d5de] px-3 text-[13px] text-[#4f4b59] transition hover:bg-[#f4f3f6] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </AdminLayout>
  );
}
