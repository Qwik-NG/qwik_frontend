import { useEffect, useState } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import type { AdminAd } from '../types';

export default function AdminAds() {
  const { error: showError, success } = useToast();
  const [ads, setAds] = useState<AdminAd[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.adminAds();
      setAds(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load ads');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAd = async (adId: string) => {
    if (!confirm('Are you sure you want to delete this ad?')) return;

    try {
      await api.deleteAdminAd(adId);
      success('Ad deleted successfully');
      fetchAds();
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Error deleting ad');
    }
  };

  if (loading) return (
    <AdminLayout title="Moderate Ads">
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-[#7f7e88]">Loading...</div>
      </div>
    </AdminLayout>
  );
  if (error) return (
    <AdminLayout title="Moderate Ads">
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <div className="text-lg text-red-600">Error: {error}</div>
        <button
          type="button"
          onClick={fetchAds}
          className="rounded-lg bg-[#ff9715] px-4 py-2 text-sm font-medium text-white"
        >
          Retry
        </button>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout title="Moderate Ads" description={`Total: ${ads.length} ad${ads.length !== 1 ? 's' : ''}`}>
      {ads.length === 0 ? (
        <div className="rounded-[16px] border border-[#e8e8ea] bg-white p-10 text-center text-[#7f7e88]">
          No ads found.
        </div>
      ) : (
      <div className="bg-white rounded-[16px] shadow-sm border border-[#e8e8ea] overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Seller</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reports</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Posted</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {ads.map((ad) => (
                <tr key={ad.id} className={`hover:bg-gray-50 ${ad._count.reports > 0 ? 'bg-red-50' : ''}`}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{ad.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{ad.user.fullName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{ad.category.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">₦{(ad.price).toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      ad.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {ad.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {ad._count.reports > 0 && (
                      <span className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800">
                        {ad._count.reports}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {ad.createdAt ? new Date(ad.createdAt).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => handleDeleteAd(ad.id)}
                      className="font-medium text-red-600 transition-colors duration-200 hover:text-red-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb357] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                      type="button"
                    >
                      Delete
                    </button>
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
