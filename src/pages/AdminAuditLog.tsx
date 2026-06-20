import { useEffect, useState } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import { api } from '../services/api';
import type { AdminAuditLogEntry } from '../types';

// All known action strings emitted by the backend across phases 1-8.
const KNOWN_ACTIONS = [
  'AD_DELETED',
  'AD_STATUS_UPDATED',
  'REPORT_STATUS_UPDATED',
  'REVIEW_DELETED',
  'USER_BANNED',
  'USER_UNBANNED',
  'VERIFICATION_REVIEWED',
];

const KNOWN_TARGET_TYPES = ['Ad', 'Report', 'Review', 'User', 'VerificationApplication'];

function actionLabel(action: string) {
  const map: Record<string, string> = {
    AD_DELETED: 'Ad Deleted',
    AD_STATUS_UPDATED: 'Ad Status Updated',
    REPORT_STATUS_UPDATED: 'Report Updated',
    REVIEW_DELETED: 'Review Removed',
    USER_BANNED: 'User Banned',
    USER_UNBANNED: 'User Unbanned',
    VERIFICATION_REVIEWED: 'Verification Reviewed',
  };
  return map[action] ?? action;
}

function actionBadgeClass(action: string) {
  if (action === 'USER_BANNED' || action === 'AD_DELETED' || action === 'REVIEW_DELETED') {
    return 'bg-red-100 text-red-800';
  }
  if (action === 'USER_UNBANNED' || action === 'AD_STATUS_UPDATED') {
    return 'bg-green-100 text-green-800';
  }
  if (action === 'REPORT_STATUS_UPDATED') {
    return 'bg-yellow-100 text-yellow-800';
  }
  if (action === 'VERIFICATION_REVIEWED') {
    return 'bg-blue-100 text-blue-800';
  }
  return 'bg-gray-100 text-gray-700';
}

/** Safely render the metadata JSON as a condensed summary of key→value pairs. */
function MetadataDisplay({ metadata }: { metadata: Record<string, unknown> | null }) {
  if (!metadata || typeof metadata !== 'object') {
    return <span className="text-[12px] text-[#9b97a5]">—</span>;
  }

  const entries = Object.entries(metadata).filter(
    ([, value]) => value !== null && value !== undefined && value !== '',
  );

  if (entries.length === 0) {
    return <span className="text-[12px] text-[#9b97a5]">—</span>;
  }

  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-0.5 text-[12px]">
      {entries.map(([key, value]) => (
        <div key={key} className="contents">
          <dt className="font-medium text-[#4f4b59]">{key}:</dt>
          <dd className="text-[#6f6b77] break-all">
            {typeof value === 'boolean'
              ? value ? 'yes' : 'no'
              : typeof value === 'object'
                ? JSON.stringify(value)
                : String(value)}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export default function AdminAuditLog() {
  const [logs, setLogs] = useState<AdminAuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(25);
  const [totalLogs, setTotalLogs] = useState(0);
  const [actionFilter, setActionFilter] = useState('');
  const [targetTypeFilter, setTargetTypeFilter] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    void fetchLogs();
  }, [page, actionFilter, targetTypeFilter, fromDate, toDate, searchTerm]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.adminAuditLog({
        page,
        pageSize,
        search: searchTerm.trim() || undefined,
        action: actionFilter || undefined,
        targetType: targetTypeFilter || undefined,
        from: fromDate || undefined,
        to: toDate || undefined,
      });
      setLogs(response.data);
      setTotalLogs(response.meta?.total ?? response.data.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load audit log');
    } finally {
      setLoading(false);
    }
  };

  const pageCount = Math.max(1, Math.ceil(totalLogs / pageSize));

  const handleFilterChange = () => {
    setPage(1);
  };

  if (loading) {
    return (
      <AdminLayout title="Audit Log" description="Traceable history of all admin actions">
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-[14px] border border-[#e8e8ea] bg-white p-4">
              <div className="h-3 w-40 animate-pulse rounded bg-[#efedf2]" />
              <div className="mt-2 h-3 w-64 animate-pulse rounded bg-[#efedf2]" />
              <div className="mt-2 h-3 w-48 animate-pulse rounded bg-[#efedf2]" />
            </div>
          ))}
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Audit Log" description="Traceable history of all admin actions">
        <div className="flex min-h-[280px] flex-col items-center justify-center gap-4 rounded-[14px] border border-[#f2d4d4] bg-white p-6 text-center">
          <div className="text-[16px] font-medium text-red-600">Unable to load audit log</div>
          <div className="max-w-[440px] text-[14px] text-[#7f7e88]">{error}</div>
          <button
            type="button"
            onClick={() => void fetchLogs()}
            className="rounded-lg bg-[#ff9715] px-4 py-2 text-sm font-medium text-white"
          >
            Retry
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Audit Log" description={`${totalLogs.toLocaleString()} total entries`}>
      {/* Filters */}
      <div className="mb-4 grid grid-cols-1 gap-3 rounded-[14px] border border-[#e8e8ea] bg-white p-4 sm:grid-cols-2 xl:grid-cols-5">
        <input
          type="search"
          value={searchTerm}
          onChange={(event) => {
            setSearchTerm(event.target.value);
            setPage(1);
          }}
          placeholder="Search admin, action, or target ID"
          className="h-[38px] rounded-[9px] border border-[#d8d5de] px-3 text-[14px] text-[#1f1f29] outline-none focus:border-[#ffb46a] focus:ring-2 focus:ring-[#ffb46a]/25 xl:col-span-2"
        />
        <select
          value={actionFilter}
          onChange={(event) => {
            setActionFilter(event.target.value);
            handleFilterChange();
          }}
          className="h-[38px] rounded-[9px] border border-[#d8d5de] px-3 text-[13px] text-[#4f4b59] outline-none focus:border-[#ffb46a]"
        >
          <option value="">All actions</option>
          {KNOWN_ACTIONS.map((a) => (
            <option key={a} value={a}>{actionLabel(a)}</option>
          ))}
        </select>
        <select
          value={targetTypeFilter}
          onChange={(event) => {
            setTargetTypeFilter(event.target.value);
            handleFilterChange();
          }}
          className="h-[38px] rounded-[9px] border border-[#d8d5de] px-3 text-[13px] text-[#4f4b59] outline-none focus:border-[#ffb46a]"
        >
          <option value="">All target types</option>
          {KNOWN_TARGET_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="date"
            value={fromDate}
            onChange={(event) => {
              setFromDate(event.target.value);
              handleFilterChange();
            }}
            className="h-[38px] rounded-[9px] border border-[#d8d5de] px-2 text-[12px] text-[#4f4b59] outline-none focus:border-[#ffb46a]"
          />
          <input
            type="date"
            value={toDate}
            onChange={(event) => {
              setToDate(event.target.value);
              handleFilterChange();
            }}
            className="h-[38px] rounded-[9px] border border-[#d8d5de] px-2 text-[12px] text-[#4f4b59] outline-none focus:border-[#ffb46a]"
          />
        </div>
      </div>

      <div className="mb-3 flex items-center justify-between text-[13px] text-[#6f6b77]">
        <span>Showing {logs.length} entr{logs.length !== 1 ? 'ies' : 'y'} on this page</span>
        <span>Page {page} of {pageCount}</span>
      </div>

      {logs.length === 0 ? (
        <div className="rounded-[16px] border border-[#e8e8ea] bg-white p-10 text-center text-[#7f7e88]">
          No audit log entries match the current filters.
        </div>
      ) : (
        <>
          {/* Mobile cards (< lg) */}
          <div className="space-y-3 lg:hidden">
            {logs.map((entry) => (
              <article key={entry.id} className="rounded-[14px] border border-[#e8e8ea] bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className={`rounded px-2 py-1 text-[11px] font-medium ${actionBadgeClass(entry.action)}`}>
                    {actionLabel(entry.action)}
                  </span>
                  <span className="text-[12px] text-[#8a8794]">
                    {new Date(entry.createdAt).toLocaleString()}
                  </span>
                </div>

                <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-[12px]">
                  <div>
                    <span className="font-medium text-[#3f3b47]">Admin:</span>{' '}
                    <span className="text-[#6f6b77]">{entry.admin.fullName}</span>
                  </div>
                  <div>
                    <span className="font-medium text-[#3f3b47]">Target:</span>{' '}
                    <span className="text-[#6f6b77]">{entry.targetType}</span>
                  </div>
                  {entry.targetId ? (
                    <div className="col-span-2">
                      <span className="font-medium text-[#3f3b47]">Target ID:</span>{' '}
                      <span className="break-all font-mono text-[11px] text-[#6f6b77]">{entry.targetId}</span>
                    </div>
                  ) : null}
                </div>

                {entry.metadata ? (
                  <div className="mt-3 rounded-[10px] bg-[#f7f6f9] px-3 py-2">
                    <MetadataDisplay metadata={entry.metadata} />
                  </div>
                ) : null}
              </article>
            ))}
          </div>

          {/* Desktop table (>= lg) */}
          <div className="hidden overflow-x-auto rounded-[16px] border border-[#e8e8ea] bg-white shadow-sm lg:block">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase text-gray-500">Timestamp</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase text-gray-500">Admin</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase text-gray-500">Action</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase text-gray-500">Target Type</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase text-gray-500">Target ID</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase text-gray-500">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {logs.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600">
                      {new Date(entry.createdAt).toLocaleString()}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-900">
                      <div className="font-medium">{entry.admin.fullName}</div>
                      {entry.admin.email ? (
                        <div className="text-xs text-gray-500">{entry.admin.email}</div>
                      ) : null}
                    </td>
                    <td className="px-5 py-4 text-sm">
                      <span className={`rounded px-2 py-1 text-xs font-medium ${actionBadgeClass(entry.action)}`}>
                        {actionLabel(entry.action)}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-600">{entry.targetType}</td>
                    <td className="px-5 py-4 text-sm">
                      <span className="break-all font-mono text-[11px] text-gray-500">
                        {entry.targetId ?? '—'}
                      </span>
                    </td>
                    <td className="max-w-[320px] px-5 py-4">
                      <MetadataDisplay metadata={entry.metadata} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Pagination */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[12px] border border-[#e8e8ea] bg-white px-4 py-3">
        <button
          type="button"
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          disabled={page === 1}
          className="h-[36px] rounded-[8px] border border-[#d8d5de] px-3 text-[13px] text-[#4f4b59] transition hover:bg-[#f4f3f6] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>
        <div className="text-[13px] text-[#6f6b77]">{totalLogs.toLocaleString()} total entries</div>
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
