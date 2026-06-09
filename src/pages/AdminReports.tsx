import { useEffect, useState } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import type { AdminReport } from '../types';

export default function AdminReports() {
  const { error: showError, success } = useToast();
  const [reports, setReports] = useState<AdminReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReports();
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

  const handleUpdateStatus = async (reportId: string, newStatus: AdminReport['status']) => {
    if (!confirm(`Mark this report as ${newStatus.toLowerCase()}?`)) return;

    try {
      await api.updateAdminReport(reportId, newStatus);
      success('Report status updated');
      fetchReports();
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Error updating report');
    }
  };

  if (loading) return (
    <AdminLayout title="Handle Reports">
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-[#7f7e88]">Loading...</div>
      </div>
    </AdminLayout>
  );
  if (error) return (
    <AdminLayout title="Handle Reports">
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <div className="text-lg text-red-600">Error: {error}</div>
        <button
          type="button"
          onClick={fetchReports}
          className="rounded-lg bg-[#ff9715] px-4 py-2 text-sm font-medium text-white"
        >
          Retry
        </button>
      </div>
    </AdminLayout>
  );

  const pendingReports = reports.filter(r => r.status === 'PENDING');

  return (
    <AdminLayout title="Handle Reports" description={`${pendingReports.length} pending, ${reports.length} total`}>
      {reports.length === 0 ? (
        <div className="rounded-[16px] border border-[#e8e8ea] bg-white p-10 text-center text-[#7f7e88]">
          No reports have been submitted yet.
        </div>
      ) : (
      <div className="bg-white rounded-[16px] shadow-sm border border-[#e8e8ea] overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ad Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reporter</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reports.map((report) => (
                <tr key={report.id} className={`hover:bg-gray-50 ${report.status === 'PENDING' ? 'bg-yellow-50' : ''}`}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{report.ad.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{report.user.fullName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{report.reason}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      report.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      report.status === 'RESOLVED' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    {report.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(report.id, 'RESOLVED')}
                          className="font-medium text-green-600 transition-colors duration-200 hover:text-green-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb357] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                          type="button"
                        >
                          Resolve
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(report.id, 'DISMISSED')}
                          className="font-medium text-gray-600 transition-colors duration-200 hover:text-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb357] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                          type="button"
                        >
                          Dismiss
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>
      )}
    </AdminLayout>
  );
}
