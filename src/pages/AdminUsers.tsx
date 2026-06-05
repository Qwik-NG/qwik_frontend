import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/admin/AdminLayout';
import { useToast } from '../context/ToastContext';

interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  location?: string;
  role: string;
  createdAt: string;
  _count: {
    ads: number;
    reviews: number;
  };
}

export default function AdminUsers() {
  const navigate = useNavigate();
  const { error: showError, success } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('qwik_token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading users');
    } finally {
      setLoading(false);
    }
  };

  const handleBanUser = async (userId: string) => {
    if (!confirm('Are you sure you want to ban this user?')) return;

    try {
      const response = await fetch(`http://localhost:4000/api/admin/users/${userId}/ban`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('qwik_token')}`,
        },
      });

      if (response.ok) {
        success('User banned successfully');
        fetchUsers();
      }
    } catch (err) {
      showError('Error banning user');
    }
  };

  if (loading) return (
    <AdminLayout title="Manage Users">
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-[#7f7e88]">Loading...</div>
      </div>
    </AdminLayout>
  );
  if (error) return (
    <AdminLayout title="Manage Users">
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout title="Manage Users" description={`Total: ${users.length} user${users.length !== 1 ? 's' : ''}`}>
      <div className="bg-white rounded-[16px] shadow-sm border border-[#e8e8ea] overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ads</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{user.fullName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      user.role === 'ADMIN' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user._count.ads}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.location || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {user.role !== 'ADMIN' && (
                      <button
                        onClick={() => handleBanUser(user.id)}
                        className="font-medium text-red-600 transition-colors duration-200 hover:text-red-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb357] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                        type="button"
                      >
                        Ban
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>
    </AdminLayout>
  );
}
