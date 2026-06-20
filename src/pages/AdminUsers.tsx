import { useEffect, useState } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import AdminModerationModal from '../components/admin/AdminModerationModal';
import AdminRowActionsMenu, { type AdminRowActionItem } from '../components/admin/AdminRowActionsMenu';
import { useToast } from '../context/ToastContext';
import { useCurrentUser } from '../hooks/useCurrentUser';
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
  const { user: currentUser } = useCurrentUser();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'USER' | 'ADMIN'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'BANNED'>('ALL');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [actionType, setActionType] = useState<'ban' | 'restore' | 'delete' | null>(null);
  const [moderationReason, setModerationReason] = useState('Policy violation');
  const [submittingAction, setSubmittingAction] = useState(false);

  useEffect(() => {
    void fetchUsers();
  }, [page, pageSize, searchTerm, roleFilter, statusFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.adminUsers({
        page,
        pageSize,
        search: searchTerm.trim() || undefined,
        role: roleFilter === 'ALL' ? undefined : roleFilter,
        status: statusFilter === 'ALL' ? undefined : statusFilter,
      });
      setUsers(response.data as AdminUser[]);
      setTotalUsers(response.meta?.total ?? response.data.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load users');
    } finally {
      setLoading(false);
    }
  };

  const pageCount = Math.max(1, Math.ceil(totalUsers / pageSize));

  const openBanModal = (user: AdminUser) => {
    setSelectedUser(user);
    setActionType('ban');
    setModerationReason('Policy violation');
  };

  const openRestoreModal = (user: AdminUser) => {
    setSelectedUser(user);
    setActionType('restore');
    setModerationReason('');
  };

  const openDeleteModal = (user: AdminUser) => {
    setSelectedUser(user);
    setActionType('delete');
    setModerationReason('Severe policy violation');
  };

  const closeModal = () => {
    setSelectedUser(null);
    setActionType(null);
    setModerationReason('Policy violation');
  };

  const handleModerationAction = async () => {
    if (!selectedUser || !actionType) return;

    try {
      setSubmittingAction(true);
      if (actionType === 'ban') {
        await api.banAdminUser(selectedUser.id, moderationReason.trim() || 'Policy violation');
        success('User banned successfully');
      } else if (actionType === 'restore') {
        await api.unbanAdminUser(selectedUser.id);
        success('User restored successfully');
      } else {
        await api.deleteAdminUser(selectedUser.id, moderationReason.trim() || 'Severe policy violation');
        success('User deleted successfully');
      }
      closeModal();
      await fetchUsers();
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Error updating user status');
    } finally {
      setSubmittingAction(false);
    }
  };

  const getUserProfileUrl = (userId: string) => `/profile/${userId}`;

  const openUserProfile = (userId: string) => {
    window.open(getUserProfileUrl(userId), '_blank', 'noopener,noreferrer');
  };

  const canDeleteUser = (user: AdminUser) => !(currentUser?.id === user.id && currentUser.role === 'ADMIN');

  const getDesktopUserActions = (user: AdminUser) => {
    if (user.role === 'ADMIN') return null;

    const status = user.status || 'ACTIVE';
    const isBanned = status === 'BANNED';

    const actions: AdminRowActionItem[] = [
      {
        label: 'View user profile',
        onClick: () => openUserProfile(user.id),
        icon: (
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
            <circle cx="12" cy="12" r="2.5" />
          </svg>
        ),
      },
      {
        label: isBanned ? 'Unban user' : 'Ban user',
        onClick: () => (isBanned ? openRestoreModal(user) : openBanModal(user)),
        icon: isBanned ? (
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M6 10V8a6 6 0 1 1 12 0v2" />
            <rect x="5" y="10" width="14" height="10" rx="2" />
            <path d="m9 15 2 2 4-4" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M6 10V8a6 6 0 1 1 12 0v2" />
            <rect x="5" y="10" width="14" height="10" rx="2" />
            <path d="m9.5 15.5 5-5M14.5 15.5l-5-5" />
          </svg>
        ),
      },
      {
        label: 'Delete user',
        onClick: () => openDeleteModal(user),
        danger: true,
        disabled: !canDeleteUser(user),
        icon: (
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M4 7h16" />
            <path d="M9 7V5h6v2" />
            <path d="M6 7l1 13h10l1-13" />
            <path d="M10 11v5M14 11v5" />
          </svg>
        ),
      },
    ];

    return actions;
  };

  if (loading) return (
    <AdminLayout title="Manage Users" description="Search, filter, and moderate user accounts">
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-[14px] border border-[#e8e8ea] bg-white p-4">
            <div className="h-4 w-28 animate-pulse rounded bg-[#efedf2]" />
            <div className="mt-3 h-3 w-40 animate-pulse rounded bg-[#efedf2]" />
            <div className="mt-2 h-3 w-52 animate-pulse rounded bg-[#efedf2]" />
          </div>
        ))}
      </div>
    </AdminLayout>
  );

  if (error) return (
    <AdminLayout title="Manage Users" description="Search, filter, and moderate user accounts">
      <div className="flex min-h-[280px] flex-col items-center justify-center gap-4 rounded-[14px] border border-[#f2d4d4] bg-white p-6 text-center">
        <div className="text-[16px] font-medium text-red-600">Unable to load users</div>
        <div className="max-w-[440px] text-[14px] text-[#7f7e88]">{error}</div>
        <button
          type="button"
          onClick={() => void fetchUsers()}
          className="rounded-lg bg-[#ff9715] px-4 py-2 text-sm font-medium text-white"
        >
          Retry
        </button>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout title="Manage Users" description={`Total users: ${totalUsers.toLocaleString()}`}>
      <div className="mb-4 grid grid-cols-1 gap-3 rounded-[14px] border border-[#e8e8ea] bg-white p-4 md:grid-cols-[1fr_auto_auto_auto] md:items-center">
        <input
          type="search"
          value={searchTerm}
          onChange={(event) => {
            setSearchTerm(event.target.value);
            setPage(1);
          }}
          placeholder="Search by name, email, or location"
          className="h-[38px] rounded-[9px] border border-[#d8d5de] px-3 text-[14px] text-[#1f1f29] outline-none focus:border-[#ffb46a] focus:ring-2 focus:ring-[#ffb46a]/25"
        />
        <select
          value={roleFilter}
          onChange={(event) => {
            setRoleFilter(event.target.value as 'ALL' | 'USER' | 'ADMIN');
            setPage(1);
          }}
          className="h-[38px] rounded-[9px] border border-[#d8d5de] px-3 text-[13px] text-[#4f4b59] outline-none focus:border-[#ffb46a]"
        >
          <option value="ALL">All roles</option>
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
        </select>
        <select
          value={statusFilter}
          onChange={(event) => {
            setStatusFilter(event.target.value as 'ALL' | 'ACTIVE' | 'BANNED');
            setPage(1);
          }}
          className="h-[38px] rounded-[9px] border border-[#d8d5de] px-3 text-[13px] text-[#4f4b59] outline-none focus:border-[#ffb46a]"
        >
          <option value="ALL">All status</option>
          <option value="ACTIVE">Active</option>
          <option value="BANNED">Banned</option>
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
        <span>Showing {users.length} user{users.length !== 1 ? 's' : ''} on this page</span>
        <span>Page {page} of {pageCount}</span>
      </div>

      {users.length === 0 ? (
        <div className="rounded-[16px] border border-[#e8e8ea] bg-white p-10 text-center text-[#7f7e88]">
          No users match the current filters.
        </div>
      ) : (
        <>
          <div className="space-y-3 lg:hidden">
            {users.map((user) => {
              const status = user.status || 'ACTIVE';
              return (
                <article key={user.id} className="rounded-[14px] border border-[#e8e8ea] bg-white p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[15px] font-semibold text-[#1f1f29]">{user.fullName}</p>
                      <p className="mt-1 text-[13px] text-[#6f6b77]">{user.email}</p>
                    </div>
                    <span className={`rounded px-2 py-1 text-[11px] font-medium ${
                      user.role === 'ADMIN' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-[12px] text-[#6f6b77]">
                    <div>
                      <span className="font-medium text-[#3f3b47]">Status:</span>{' '}
                      <span className={status === 'BANNED' ? 'text-red-700' : 'text-green-700'}>{status}</span>
                    </div>
                    <div><span className="font-medium text-[#3f3b47]">Ads:</span> {user._count?.ads ?? 0}</div>
                    <div><span className="font-medium text-[#3f3b47]">Location:</span> {user.location || '-'}</div>
                    <div><span className="font-medium text-[#3f3b47]">Joined:</span> {new Date(user.createdAt).toLocaleDateString()}</div>
                  </div>
                  <div className="mt-3">
                    {user.role !== 'ADMIN' && status === 'BANNED' ? (
                      <button
                        onClick={() => openRestoreModal(user)}
                        className="rounded-[8px] border border-green-200 px-3 py-1.5 text-[12px] font-medium text-green-700 transition hover:bg-green-50"
                        type="button"
                      >
                        Restore
                      </button>
                    ) : user.role !== 'ADMIN' ? (
                      <button
                        onClick={() => openBanModal(user)}
                        className="rounded-[8px] border border-red-200 px-3 py-1.5 text-[12px] font-medium text-red-700 transition hover:bg-red-50"
                        type="button"
                      >
                        Ban
                      </button>
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
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Ads</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Joined</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => {
                  const status = user.status || 'ACTIVE';
                  return (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{user.fullName}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`rounded px-2 py-1 text-xs font-medium ${
                          user.role === 'ADMIN' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`rounded px-2 py-1 text-xs font-medium ${
                          status === 'BANNED' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{user._count?.ads ?? 0}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{user.location || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center justify-end">
                          {getDesktopUserActions(user) ? (
                            <AdminRowActionsMenu ariaLabel={`Open actions for ${user.fullName}`} items={getDesktopUserActions(user)!} />
                          ) : (
                            <span className="text-[12px] text-[#9b97a5]">Protected</span>
                          )}
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
        <div className="text-[13px] text-[#6f6b77]">{totalUsers.toLocaleString()} total users</div>
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
        open={Boolean(selectedUser && actionType)}
        title={actionType === 'ban' ? 'Ban user account' : actionType === 'delete' ? 'Delete user account' : 'Restore user account'}
        description={actionType === 'ban'
          ? `You are about to suspend ${selectedUser?.fullName || 'this user'} from the platform.`
          : actionType === 'delete'
            ? `This is permanent. ${selectedUser?.fullName || 'this user'} and all related account data will be removed.`
            : `You are about to restore ${selectedUser?.fullName || 'this user'} to active status.`}
        confirmLabel={actionType === 'ban' ? 'Ban User' : actionType === 'delete' ? 'Delete User' : 'Restore User'}
        onConfirm={handleModerationAction}
        onClose={closeModal}
        loading={submittingAction}
        tone={actionType === 'ban' || actionType === 'delete' ? 'danger' : 'success'}
        reason={actionType === 'ban' || actionType === 'delete' ? moderationReason : undefined}
        reasonRequired={actionType === 'ban' || actionType === 'delete'}
        reasonLabel="Moderation reason"
        reasonPlaceholder={actionType === 'delete' ? 'Explain why this user is being deleted' : 'Explain why this user is being suspended'}
        onReasonChange={actionType === 'ban' || actionType === 'delete' ? setModerationReason : undefined}
      />
    </AdminLayout>
  );
}
