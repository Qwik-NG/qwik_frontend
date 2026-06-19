import { useEffect, useMemo, useState } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import AdminModerationModal from '../components/admin/AdminModerationModal';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import type { AdminReport } from '../types';

type ReportAction = 'resolve' | 'dismiss' | 'resolve_and_unlist';

export default function AdminReports() {
  const { error: showError, success } = useToast();
  const [reports, setReports] = useState<AdminReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'RESOLVED' | 'DISMISSED'>('ALL');
  const [selectedReport, setSelectedReport] = useState<AdminReport | null>(null);
  const [actionType, setActionType] = useState<ReportAction | null>(null);
  const [note, setNote] = useState('');
  const [updatingReport, setUpdatingReport] = useState(false);

  useEffect(() => {
    void fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.adminReports();
      setReports(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load reports');
    } finally {
      setLoading(false);
    }
  };

  const filteredReports = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return reports.filter((report) => {
      const matchesSearch = !query
        || report.ad.title.toLowerCase().includes(query)
        || report.user.fullName.toLowerCase().includes(query)
        || (report.ad.user?.fullName || '').toLowerCase().includes(query)
        || report.reason.toLowerCase().includes(query);
      const matchesStatus = statusFilter === 'ALL' || report.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [reports, searchTerm, statusFilter]);

  const pendingReports = reports.filter((report) => report.status === 'PENDING').length;

  const openActionModal = (report: AdminReport, action: ReportAction) => {
    setSelectedReport(report);
    setActionType(action);

    if (action === 'dismiss') {
      setNote('Insufficient evidence');
      return;
    }

    if (action === 'resolve_and_unlist') {
      setNote('Report validated. Listing removed from public view.');
      return;
    }

    setNote('Report investigated and resolved.');
  };

  const closeModal = () => {
    if (updatingReport) return;
    setSelectedReport(null);
    setActionType(null);
    setNote('');
  };

  const handleModerationAction = async () => {
    if (!selectedReport || !actionType) return;

    try {
      setUpdatingReport(true);

      if (actionType === 'resolve') {
        await api.updateAdminReport(selectedReport.id, {
          status: 'RESOLVED',
          note: note.trim() || undefined,
        });
        success('Report resolved successfully');
      }

      if (actionType === 'dismiss') {
        await api.updateAdminReport(selectedReport.id, {
          status: 'DISMISSED',
          note: note.trim() || undefined,
        });
        success('Report dismissed successfully');
      }

      if (actionType === 'resolve_and_unlist') {
        await api.updateAdminReport(selectedReport.id, {
          status: 'RESOLVED',
          note: note.trim() || undefined,
          unlistAd: true,
        });
        success('Report resolved and ad unlisted');
      }

      closeModal();
      await fetchReports();
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Error updating report');
    } finally {
      setUpdatingReport(false);
    }
  };

  const modalConfig = (() => {
    if (!selectedReport || !actionType) return null;

    if (actionType === 'resolve') {
      return {
        title: 'Resolve report',
        description: `Mark the report on ${selectedReport.ad.title} as resolved without changing listing visibility.`,
        confirmLabel: 'Resolve Report',
        tone: 'success' as const,
        reasonRequired: true,
        reasonLabel: 'Resolution note',
        reasonPlaceholder: 'Describe findings and final moderation decision',
      };
    }

    if (actionType === 'dismiss') {
      return {
        title: 'Dismiss report',
        description: `Dismiss the report on ${selectedReport.ad.title} with no enforcement action.`,
        confirmLabel: 'Dismiss Report',
        tone: 'neutral' as const,
        reasonRequired: true,
        reasonLabel: 'Dismissal note',
        reasonPlaceholder: 'Explain why this report is being dismissed',
      };
    }

    return {
      title: 'Resolve report and unlist ad',
      description: `Resolve this report and immediately unlist ${selectedReport.ad.title} from public listings.`,
      confirmLabel: 'Resolve and Unlist',
      tone: 'danger' as const,
      reasonRequired: true,
      reasonLabel: 'Moderation note',
      reasonPlaceholder: 'Explain why this report warrants ad unlisting',
    };
  })();

  if (loading) {
    return (
      <AdminLayout title="Handle Reports" description="Review reports and take moderation actions">
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
      <AdminLayout title="Handle Reports" description="Review reports and take moderation actions">
        <div className="flex min-h-[280px] flex-col items-center justify-center gap-4 rounded-[14px] border border-[#f2d4d4] bg-white p-6 text-center">
          <div className="text-[16px] font-medium text-red-600">Unable to load reports</div>
          <div className="max-w-[440px] text-[14px] text-[#7f7e88]">{error}</div>
          <button
            type="button"
            onClick={() => void fetchReports()}
            className="rounded-lg bg-[#ff9715] px-4 py-2 text-sm font-medium text-white"
          >
            Retry
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Handle Reports" description={`${pendingReports} pending, ${reports.length} total`}>
      <div className="mb-4 grid grid-cols-1 gap-3 rounded-[14px] border border-[#e8e8ea] bg-white p-4 md:grid-cols-[1fr_auto] md:items-center">
        <input
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search by ad, reporter, seller, or reason"
          className="h-[38px] rounded-[9px] border border-[#d8d5de] px-3 text-[14px] text-[#1f1f29] outline-none focus:border-[#ffb46a] focus:ring-2 focus:ring-[#ffb46a]/25"
        />
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as 'ALL' | 'PENDING' | 'RESOLVED' | 'DISMISSED')}
          className="h-[38px] rounded-[9px] border border-[#d8d5de] px-3 text-[13px] text-[#4f4b59] outline-none focus:border-[#ffb46a]"
        >
          <option value="ALL">All status</option>
          <option value="PENDING">Pending</option>
          <option value="RESOLVED">Resolved</option>
          <option value="DISMISSED">Dismissed</option>
        </select>
      </div>

      {filteredReports.length === 0 ? (
        <div className="rounded-[16px] border border-[#e8e8ea] bg-white p-10 text-center text-[#7f7e88]">
          No reports match the current filters.
        </div>
      ) : (
        <>
          <div className="space-y-3 lg:hidden">
            {filteredReports.map((report) => {
              const sellerName = report.ad.user?.fullName || 'Unknown seller';
              const isPending = report.status === 'PENDING';
              return (
                <article key={report.id} className={`rounded-[14px] border bg-white p-4 shadow-sm ${isPending ? 'border-[#f3dfb6]' : 'border-[#e8e8ea]'}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[15px] font-semibold text-[#1f1f29]">{report.ad.title}</p>
                      <p className="mt-1 text-[13px] text-[#6f6b77]">Reporter: {report.user.fullName}</p>
                      <p className="mt-1 text-[13px] text-[#6f6b77]">Seller: {sellerName}</p>
                    </div>
                    <span className={`rounded px-2 py-1 text-[11px] font-medium ${
                      report.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : report.status === 'RESOLVED' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {report.status}
                    </span>
                  </div>
                  <p className="mt-3 rounded-[10px] bg-[#f7f6f9] px-3 py-2 text-[12px] text-[#4f4b59]">{report.reason}</p>
                  <div className="mt-2 text-[12px] text-[#7f7e88]">{new Date(report.createdAt).toLocaleString()}</div>

                  {isPending ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        onClick={() => openActionModal(report, 'resolve')}
                        className="rounded-[8px] border border-green-200 px-3 py-1.5 text-[12px] font-medium text-green-700 transition hover:bg-green-50"
                        type="button"
                      >
                        Resolve
                      </button>
                      <button
                        onClick={() => openActionModal(report, 'dismiss')}
                        className="rounded-[8px] border border-gray-300 px-3 py-1.5 text-[12px] font-medium text-gray-700 transition hover:bg-gray-50"
                        type="button"
                      >
                        Dismiss
                      </button>
                      <button
                        onClick={() => openActionModal(report, 'resolve_and_unlist')}
                        className="rounded-[8px] border border-red-200 px-3 py-1.5 text-[12px] font-medium text-red-700 transition hover:bg-red-50"
                        type="button"
                      >
                        Resolve + Unlist Ad
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
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Reported Ad</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Reporter</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Seller</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Reason</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredReports.map((report) => {
                  const sellerName = report.ad.user?.fullName || 'Unknown seller';
                  const isPending = report.status === 'PENDING';
                  return (
                    <tr key={report.id} className={`hover:bg-gray-50 ${isPending ? 'bg-yellow-50/40' : ''}`}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{report.ad.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{report.user.fullName}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{sellerName}</td>
                      <td className="max-w-[300px] px-6 py-4 text-sm text-gray-600">{report.reason}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`rounded px-2 py-1 text-xs font-medium ${
                          report.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : report.status === 'RESOLVED' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{new Date(report.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm">
                        {isPending ? (
                          <div className="flex flex-wrap gap-3">
                            <button
                              onClick={() => openActionModal(report, 'resolve')}
                              className="font-medium text-green-600 transition-colors duration-200 hover:text-green-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb357] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                              type="button"
                            >
                              Resolve
                            </button>
                            <button
                              onClick={() => openActionModal(report, 'dismiss')}
                              className="font-medium text-gray-600 transition-colors duration-200 hover:text-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb357] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                              type="button"
                            >
                              Dismiss
                            </button>
                            <button
                              onClick={() => openActionModal(report, 'resolve_and_unlist')}
                              className="font-medium text-red-600 transition-colors duration-200 hover:text-red-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb357] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                              type="button"
                            >
                              Resolve + Unlist Ad
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
        open={Boolean(selectedReport && actionType && modalConfig)}
        title={modalConfig?.title || 'Moderate report'}
        description={modalConfig?.description || ''}
        confirmLabel={modalConfig?.confirmLabel || 'Confirm'}
        onConfirm={handleModerationAction}
        onClose={closeModal}
        loading={updatingReport}
        tone={modalConfig?.tone || 'neutral'}
        reason={note}
        reasonRequired={modalConfig?.reasonRequired || false}
        reasonLabel={modalConfig?.reasonLabel || 'Moderation note'}
        reasonPlaceholder={modalConfig?.reasonPlaceholder || 'Enter note'}
        onReasonChange={setNote}
      />
    </AdminLayout>
  );
}
