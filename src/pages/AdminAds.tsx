import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/admin/AdminLayout';

interface Ad {
  id: string;
  title: string;
  price: number;
  status: string;
  user: {
    id: string;
    fullName: string;
    email: string;
  };
  category: {
    id: string;
    name: string;
  };
  createdAt: string;
  _count: {
    images: number;
    reviews: number;
    reports: number;
  };
}

export default function AdminAds() {
  const navigate = useNavigate();
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/admin/ads', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('qwik_token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch ads');
      }

      const data = await response.json();
      setAds(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading ads');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAd = async (adId: string) => {
    if (!confirm('Are you sure you want to delete this ad?')) return;

    try {
      const response = await fetch(`http://localhost:4000/api/admin/ads/${adId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('qwik_token')}`,
        },
      });

      if (response.ok) {
        alert('Ad deleted successfully');
        fetchAds();
      }
    } catch (err) {
      alert('Error deleting ad');
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
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout title="Moderate Ads" description={`Total: ${ads.length} ad${ads.length !== 1 ? 's' : ''}`}>
      <div className="bg-white rounded-[16px] shadow-sm border border-[#e8e8ea] overflow-hidden">
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
                    {new Date(ad.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => handleDeleteAd(ad.id)}
                      className="text-red-600 hover:text-red-800 font-medium"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>
    </AdminLayout>
  );
}
