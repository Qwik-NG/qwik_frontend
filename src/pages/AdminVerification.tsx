import { useEffect, useMemo, useState } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import AdminModerationModal from '../components/admin/AdminModerationModal';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import type { VerificationApplication, VerificationStatus } from '../types';

type VerificationAction = 'approve' | 'reject';

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
  const [statusFilter, setStatusFilter] = useState<'ALL' | VerificationStatus>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedVerification, setSelectedVerification] = useState<VerificationApplication | null>(null);
  const [nextStatus, setNextStatus] = useState<'APPROVED' | 'REJECTED' | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [decisionNote, setDecisionNote] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    void fetchVerifications();
  }, [statusFilter]);

  const fetchVerifications = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.adminVerifications({ status: statusFilter === 'ALL' ? undefined : statusFilter, pageSize: 100 });
      setVerifications(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading verifications');
    } finally {
      setLoading(false);
    }
  };

  const filteredVerifications = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    const from = fromDate ? new Date(`${fromDate}T00:00:00`).getTime() : null;
    const to = toDate ? new Date(`${toDate}T23:59:59`).getTime() : null;

    return verifications.filter((item) => {
      const submittedAt = new Date(item.submittedAt || item.createdAt).getTime();
      const inFromRange = from === null || submittedAt >= from;
      const inToRange = to === null || submittedAt <= to;

      const applicantName = item.user?.fullName?.toLowerCase() || '';
      const applicantEmail = item.user?.email?.toLowerCase() || '';
      const reviewerName = item.reviewer?.fullName?.toLowerCase() || '';
      const reviewerEmail = item.reviewer?.email?.toLowerCase() || '';
      const storeName = String(item.businessInfo?.storeName || '').toLowerCase();
      const businessName = String(item.businessInfo?.businessName || '').toLowerCase();
      const matchesSearch = !query
        || applicantName.includes(query)
        || applicantEmail.includes(query)
        || reviewerName.includes(query)
        || reviewerEmail.includes(query)
        || storeName.includes(query)
        || businessName.includes(query);

      return inFromRange && inToRange && matchesSearch;
    });
  }, [verifications, searchTerm, fromDate, toDate]);

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
    <AdminLayout title="Verification Review" description={`${pendingCount} pending, ${verifications.length} total`}>
      <div className="mb-4 grid grid-cols-1 gap-3 rounded-[14px] border border-[#e8e8ea] bg-white p-4 md:grid-cols-2 xl:grid-cols-4">
        <input
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search applicant/reviewer name or email"
          className="h-[38px] rounded-[9px] border border-[#d8d5de] px-3 text-[14px] text-[#1f1f29] outline-none focus:border-[#ffb46a] focus:ring-2 focus:ring-[#ffb46a]/25"
        />
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as 'ALL' | VerificationStatus)}
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
          onChange={(event) => setFromDate(event.target.value)}
          className="h-[38px] rounded-[9px] border border-[#d8d5de] px-3 text-[13px] text-[#4f4b59] outline-none focus:border-[#ffb46a]"
        />
        <input
          type="date"
          value={toDate}
          onChange={(event) => setToDate(event.target.value)}
          className="h-[38px] rounded-[9px] border border-[#d8d5de] px-3 text-[13px] text-[#4f4b59] outline-none focus:border-[#ffb46a]"
        />
      </div>

      {filteredVerifications.length === 0 ? (
        <div className="rounded-[16px] border border-[#e8e8ea] bg-white p-10 text-center text-[#7f7e88]">
          No verification applications match the current filters.
        </div>
      ) : (
        <>
          <div className="space-y-3 lg:hidden">
            {filteredVerifications.map((item) => {
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

                  {pending ? (
                    <div className="mt-3 flex flex-wrap gap-2">
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
                    </div>
                  ) : null}
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
                {filteredVerifications.map((item) => {
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
                        {pending ? (
                          <div className="flex flex-wrap gap-3">
                            <button
                              type="button"
                              onClick={() => openVerificationAction(item, 'APPROVED')}
                              className="font-medium text-green-600 transition-colors duration-200 hover:text-green-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb357] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => openVerificationAction(item, 'REJECTED')}
                              className="font-medium text-red-600 transition-colors duration-200 hover:text-red-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb357] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-[#8a8794]">No pending actions</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

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
    </AdminLayout>
  );
}
