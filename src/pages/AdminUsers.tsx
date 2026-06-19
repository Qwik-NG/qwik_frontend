import { useEffect, useState } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import AdminModerationModal from '../components/admin/AdminModerationModal';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import type { User } from '../types';

type AdminUser = User & {
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  _count?: {
    ads: number;
    reviews: number;
  };
};

export default function AdminUsers() {
  const { error: showError, success } = useToast();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [actionType, setActionType] = useState<'ban' | 'restore' | null>(null);
  const [banReason, setBanReason] = useState('Policy violation');
  const [submittingAction, setSubmittingAction] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.adminUsers();
      setUsers(response.data as AdminUser[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load users');
    } finally {
      setLoading(false);
    }
  };

  const openBanModal = (user: AdminUser) => {
    setSelectedUser(user);
    setActionType('ban');
    setBanReason('Policy violation');
  };

  const openRestoreModal = (user: AdminUser) => {
    setSelectedUser(user);
    setActionType('restore');
  };

  const closeModal = () => {
    setSelectedUser(null);
    setActionType(null);
    setBanReason('Policy violation');
  };

  const handleModerationAction = async () => {
    if (!selectedUser || !actionType) return;

    try {
      setSubmittingAction(true);
      if (actionType === 'ban') {
        await api.banAdminUser(selectedUser.id, banReason.trim() || 'Policy violation');
        success('User banned successfully');
      } else {
        await api.unbanAdminUser(selectedUser.id);
        success('User restored successfully');
      }
      closeModal();
      await fetchUsers();
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Error updating user status');
    } finally {
      setSubmittingAction(false);
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
      <div className="flex h-64 flex-col items-center justify-center gap-4">
        <div className="text-lg text-red-600">Error: {error}</div>
        <button
          type="button"
          onClick={fetchUsers}
          className="rounded-lg bg-[#ff9715] px-4 py-2 text-sm font-medium text-white"
        >
          Retry
        </button>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout title="Manage Users" description={`Total: ${users.length} user${users.length !== 1 ? 's' : ''}`}>
      {users.length === 0 ? (
        <div className="rounded-[16px] border border-[#e8e8ea] bg-white p-10 text-center text-[#7f7e88]">
          No users found.
        </div>
      ) : (
      <div className="bg-white rounded-[16px] shadow-sm border border-[#e8e8ea] overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
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
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      user.status === 'BANNED' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {user.status || 'ACTIVE'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user._count?.ads ?? 0}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.location || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {user.role !== 'ADMIN' && user.status === 'BANNED' ? (
                      <button
                        onClick={() => openRestoreModal(user)}
                        className="font-medium text-green-600 transition-colors duration-200 hover:text-green-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb357] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                        type="button"
                      >
                        Restore
                      </button>
                    ) : user.role !== 'ADMIN' ? (
                      <button
                        onClick={() => openBanModal(user)}
                        className="font-medium text-red-600 transition-colors duration-200 hover:text-red-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffb357] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                        type="button"
                      >
                        Ban
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>
      )}

      <AdminModerationModal
        open={Boolean(selectedUser && actionType)}
        title={actionType === 'ban' ? 'Ban user account' : 'Restore user account'}
        description={actionType === 'ban'
          ? `You are about to suspend ${selectedUser?.fullName || 'this user'} from the platform.`
          : `You are about to restore ${selectedUser?.fullName || 'this user'} to active status.`}
        confirmLabel={actionType === 'ban' ? 'Ban User' : 'Restore User'}
        onConfirm={handleModerationAction}
        onClose={closeModal}
        loading={submittingAction}
        tone={actionType === 'ban' ? 'danger' : 'success'}
        reason={actionType === 'ban' ? banReason : undefined}
        reasonRequired={actionType === 'ban'}
        reasonLabel="Moderation reason"
        reasonPlaceholder="Explain why this user is being suspended"
        onReasonChange={actionType === 'ban' ? setBanReason : undefined}
      />
    </AdminLayout>
  );
}
