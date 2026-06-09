import { useEffect, useState } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import type { VerificationApplication, VerificationStatus } from '../types';

function statusClass(status: VerificationStatus) {
  if (status === 'APPROVED') return 'bg-green-100 text-green-800';
  if (status === 'REJECTED') return 'bg-red-100 text-red-800';
  if (status === 'SUBMITTED' || status === 'IN_REVIEW') return 'bg-yellow-100 text-yellow-800';
  return 'bg-gray-100 text-gray-800';
}

function formatDate(value?: string | null) {
  if (!value) return '-';
  return new Date(value).toLocaleDateString();
}

function businessValue(item: VerificationApplication, key: string) {
  return item.businessInfo?.[key] || '-';
}

export default function AdminVerification() {
  const { error: showError, success } = useToast();
  const [verifications, setVerifications] = useState<VerificationApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchVerifications();
  }, []);

  const fetchVerifications = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.adminVerifications();
      setVerifications(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading verifications');
    } finally {
      setLoading(false);
    }
  };

  const updateVerification = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    if (status === 'APPROVED' && !window.confirm('Approve this verification application?')) return;

    const rejectionReason = status === 'REJECTED'
      ? window.prompt('Reason for rejection:')
      : undefined;

    if (status === 'REJECTED' && !rejectionReason?.trim()) {
      showError('Rejection reason is required');
      return;
    }

    try {
      setUpdatingId(id);
      await api.updateAdminVerification(id, {
        status,
        ...(rejectionReason ? { rejectionReason } : {}),
      });
      success(status === 'APPROVED' ? 'Verification approved' : 'Verification rejected');
      await fetchVerifications();
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Unable to update verification');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return (
    <AdminLayout title="Verification Review">
      <div className="flex h-64 items-center justify-center">
        <div className="text-lg text-[#7f7e88]">Loading...</div>
      </div>
    </AdminLayout>
  );

  if (error) return (
    <AdminLayout title="Verification Review">
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <div className="text-lg text-red-600">Error: {error}</div>
        <button
          type="button"
          onClick={fetchVerifications}
          className="rounded-lg bg-[#ff9715] px-4 py-2 text-sm font-medium text-white"
        >
          Retry
        </button>
      </div>
    </AdminLayout>
  );

  const pendingCount = verifications.filter((item) => item.status === 'SUBMITTED' || item.status === 'IN_REVIEW').length;

  return (
    <AdminLayout title="Verification Review" description={`${pendingCount} pending, ${verifications.length} total`}>
      {verifications.length === 0 ? (
        <div className="rounded-[16px] border border-[#e8e8ea] bg-white p-10 text-center text-[#7f7e88]">
          No verification applications yet.
        </div>
      ) : (
        <div className="space-y-4">
          {verifications.map((item) => (
            <article key={item.id} className="rounded-[16px] border border-[#e8e8ea] bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-lg font-semibold text-[#1f1f29]">{item.user?.fullName || 'Applicant'}</h2>
                    <span className={`rounded px-2 py-1 text-xs font-medium ${statusClass(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-[#7f7e88]">{item.user?.email || '-'}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => updateVerification(item.id, 'APPROVED')}
                    disabled={updatingId === item.id || item.status === 'APPROVED'}
                    className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {updatingId === item.id ? 'Updating...' : 'Approve'}
                  </button>
                  <button
                    type="button"
                    onClick={() => updateVerification(item.id, 'REJECTED')}
                    disabled={updatingId === item.id || item.status === 'REJECTED'}
                    className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Reject
                  </button>
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div>
                  <p className="text-xs font-medium uppercase text-[#9a99a6]">Business</p>
                  <p className="mt-1 text-sm text-[#1f1f29]">{businessValue(item, 'businessName')}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-[#9a99a6]">Store</p>
                  <p className="mt-1 text-sm text-[#1f1f29]">{businessValue(item, 'storeName')}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-[#9a99a6]">Submitted</p>
                  <p className="mt-1 text-sm text-[#1f1f29]">{formatDate(item.submittedAt || item.createdAt)}</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase text-[#9a99a6]">Payment</p>
                  <p className="mt-1 text-sm text-[#1f1f29]">{item.paymentStatus}</p>
                </div>
              </div>

              <div className="mt-5">
                <p className="text-xs font-medium uppercase text-[#9a99a6]">Documents</p>
                {item.documents.length === 0 ? (
                  <p className="mt-2 text-sm text-[#7f7e88]">No documents attached.</p>
                ) : (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {item.documents.map((document) => (
                      <a
                        key={document.id || document.url}
                        href={document.url}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg border border-[#e8e8ea] px-3 py-2 text-sm font-medium text-[#ff9715] hover:border-[#ff9715]"
                      >
                        {document.purpose.replace(/_/g, ' ')}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {item.rejectionReason ? (
                <div className="mt-5 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                  <span className="font-medium">Reject reason:</span> {item.rejectionReason}
                </div>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
