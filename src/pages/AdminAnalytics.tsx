import { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  BarChart3,
  CreditCard,
  Flag,
  MapPin,
  MessageSquare,
  Sparkles,
  Users,
} from 'lucide-react';
import AdminLayout from '../components/admin/AdminLayout';
import { api } from '../services/api';
import type {
  AdminAnalytics,
  AdminAnalyticsCategoryDistribution,
  AdminAnalyticsCountByPurpose,
  AdminAnalyticsCountByStatus,
  AdminAnalyticsLocationDistribution,
} from '../types';

function numberValue(value: number) {
  return value.toLocaleString();
}

function titleCase(value: string) {
  return value
    .toLowerCase()
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function DistributionList({
  rows,
  label,
}: {
  rows: Array<{ key: string; value: string; count: number }>;
  label: string;
}) {
  if (!rows.length) {
    return <div className="text-[13px] text-[#9a99a6]">No {label} data available yet.</div>;
  }

  return (
    <ul className="space-y-2">
      {rows.map((row) => (
        <li key={row.key} className="flex items-center justify-between rounded-[10px] border border-[#efedf2] bg-[#faf9fc] px-3 py-2">
          <span className="truncate pr-3 text-[13px] text-[#4f4b59]">{row.value}</span>
          <span className="rounded-full bg-white px-2 py-1 text-[12px] font-semibold text-[#1f1f29]">
            {numberValue(row.count)}
          </span>
        </li>
      ))}
    </ul>
  );
}

function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="rounded-[14px] border border-[#e8e8ea] bg-white p-5 shadow-sm">
            <div className="h-4 w-28 animate-pulse rounded bg-[#efedf2]" />
            <div className="mt-3 h-8 w-20 animate-pulse rounded bg-[#efedf2]" />
            <div className="mt-3 h-3 w-40 animate-pulse rounded bg-[#efedf2]" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="rounded-[14px] border border-[#e8e8ea] bg-white p-5 shadow-sm">
            <div className="h-5 w-32 animate-pulse rounded bg-[#efedf2]" />
            <div className="mt-3 h-3 w-56 animate-pulse rounded bg-[#efedf2]" />
            <div className="mt-4 h-24 animate-pulse rounded bg-[#efedf2]" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    void fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.adminAnalytics();
      setAnalytics(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const topCategories = useMemo(() => {
    const rows = analytics?.distribution.adsByCategory ?? [];
    return rows.slice(0, 8).map((row: AdminAnalyticsCategoryDistribution) => ({
      key: row.categoryId,
      value: row.categoryName,
      count: row.count,
    }));
  }, [analytics]);

  const adStates = useMemo(() => {
    const rows = analytics?.distribution.adsByLocationState ?? [];
    return rows.slice(0, 8).map((row: AdminAnalyticsLocationDistribution) => ({
      key: `ad-${row.locationState}`,
      value: titleCase(row.locationState),
      count: row.count,
    }));
  }, [analytics]);

  const userStates = useMemo(() => {
    const rows = analytics?.distribution.usersByLocationState ?? [];
    return rows.slice(0, 8).map((row: AdminAnalyticsLocationDistribution) => ({
      key: `user-${row.locationState}`,
      value: titleCase(row.locationState),
      count: row.count,
    }));
  }, [analytics]);

  const paymentByStatus = useMemo(() => {
    const rows = analytics?.payments.byStatus ?? [];
    return rows.map((row: AdminAnalyticsCountByStatus) => ({
      key: row.status,
      value: titleCase(row.status),
      count: row.count,
    }));
  }, [analytics]);

  const paymentByPurpose = useMemo(() => {
    const rows = analytics?.payments.byPurpose ?? [];
    return rows.map((row: AdminAnalyticsCountByPurpose) => ({
      key: row.purpose,
      value: titleCase(row.purpose),
      count: row.count,
    }));
  }, [analytics]);

  if (loading) {
    return (
      <AdminLayout title="Analytics" description="Marketplace and business performance from existing data">
        <AnalyticsSkeleton />
      </AdminLayout>
    );
  }

  if (error || !analytics) {
    return (
      <AdminLayout title="Analytics" description="Marketplace and business performance from existing data">
        <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 rounded-[16px] border border-[#f2d4d4] bg-white p-6 text-center">
          <div className="rounded-full bg-[#fff0f0] p-3 text-[#c73b3b]">
            <AlertCircle size={20} />
          </div>
          <div className="text-[16px] font-medium text-[#1f1f29]">Unable to load admin analytics</div>
          <div className="max-w-[460px] text-[14px] text-[#7f7e88]">{error || 'No analytics data available.'}</div>
          <button
            type="button"
            onClick={() => void fetchAnalytics()}
            className="rounded-lg bg-[#ff9715] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#e68a0e]"
          >
            Retry
          </button>
        </div>
      </AdminLayout>
    );
  }

  const cards = [
    {
      label: 'Total Users',
      value: analytics.users.total,
      detail: `+${numberValue(analytics.users.newToday)} today`,
      icon: Users,
    },
    {
      label: 'New Users (7d)',
      value: analytics.users.newLast7Days,
      detail: 'Recent account growth',
      icon: Sparkles,
    },
    {
      label: 'Total Ads',
      value: analytics.ads.total,
      detail: `${numberValue(analytics.ads.active)} active`,
      icon: BarChart3,
    },
    {
      label: 'New Ads (7d)',
      value: analytics.ads.newLast7Days,
      detail: `${numberValue(analytics.ads.newToday)} today`,
      icon: Sparkles,
    },
    {
      label: 'Conversations',
      value: analytics.marketplace.totalConversations,
      detail: `${numberValue(analytics.marketplace.totalMessages)} total messages`,
      icon: MessageSquare,
    },
    {
      label: 'Pending Reports',
      value: analytics.moderation.pendingReports,
      detail: `${numberValue(analytics.moderation.reportsCount)} total reports`,
      icon: Flag,
    },
  ];

  return (
    <AdminLayout title="Analytics" description="Marketplace and business performance from existing data">
      <div className="space-y-6">
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <article key={card.label} className="rounded-[14px] border border-[#e8e8ea] bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="text-[13px] font-medium text-[#7f7e88]">{card.label}</div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f3f3f5]">
                    <Icon size={18} className="text-[#1f1f29]" />
                  </div>
                </div>
                <div className="mt-2 text-[32px] font-semibold leading-none text-[#1f1f29]">{numberValue(card.value)}</div>
                <div className="mt-2 text-[12px] text-[#9a99a6]">{card.detail}</div>
              </article>
            );
          })}
        </section>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <article className="rounded-[14px] border border-[#e8e8ea] bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <MessageSquare size={18} className="text-[#1f1f29]" />
              <h2 className="text-[16px] font-semibold text-[#1f1f29]">Marketplace</h2>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-[10px] border border-[#efedf2] bg-[#faf9fc] px-3 py-3">
                <div className="text-[12px] text-[#7f7e88]">Total Conversations</div>
                <div className="mt-1 text-[22px] font-semibold text-[#1f1f29]">{numberValue(analytics.marketplace.totalConversations)}</div>
              </div>
              <div className="rounded-[10px] border border-[#efedf2] bg-[#faf9fc] px-3 py-3">
                <div className="text-[12px] text-[#7f7e88]">Total Messages</div>
                <div className="mt-1 text-[22px] font-semibold text-[#1f1f29]">{numberValue(analytics.marketplace.totalMessages)}</div>
              </div>
              <div className="rounded-[10px] border border-[#efedf2] bg-[#faf9fc] px-3 py-3 sm:col-span-2">
                <div className="text-[12px] text-[#7f7e88]">Notifications</div>
                <div className="mt-1 text-[18px] font-semibold text-[#1f1f29]">
                  {numberValue(analytics.notifications.total)} total, {numberValue(analytics.notifications.unread)} unread
                </div>
              </div>
            </div>
          </article>

          <article className="rounded-[14px] border border-[#e8e8ea] bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles size={18} className="text-[#1f1f29]" />
              <h2 className="text-[16px] font-semibold text-[#1f1f29]">Promoted Ads</h2>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-[10px] border border-[#efedf2] bg-[#faf9fc] px-3 py-3">
                <div className="text-[12px] text-[#7f7e88]">Promoted Ads</div>
                <div className="mt-1 text-[22px] font-semibold text-[#1f1f29]">{numberValue(analytics.ads.promoted)}</div>
              </div>
              <div className="rounded-[10px] border border-[#efedf2] bg-[#faf9fc] px-3 py-3">
                <div className="text-[12px] text-[#7f7e88]">Active Promoted Ads</div>
                <div className="mt-1 text-[22px] font-semibold text-[#1f1f29]">{numberValue(analytics.ads.activePromoted)}</div>
              </div>
              <div className="rounded-[10px] border border-[#efedf2] bg-[#faf9fc] px-3 py-3">
                <div className="text-[12px] text-[#7f7e88]">New Ads Today</div>
                <div className="mt-1 text-[22px] font-semibold text-[#1f1f29]">{numberValue(analytics.ads.newToday)}</div>
              </div>
              <div className="rounded-[10px] border border-[#efedf2] bg-[#faf9fc] px-3 py-3">
                <div className="text-[12px] text-[#7f7e88]">New Ads (7 days)</div>
                <div className="mt-1 text-[22px] font-semibold text-[#1f1f29]">{numberValue(analytics.ads.newLast7Days)}</div>
              </div>
            </div>
          </article>

          <article className="rounded-[14px] border border-[#e8e8ea] bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <MapPin size={18} className="text-[#1f1f29]" />
              <h2 className="text-[16px] font-semibold text-[#1f1f29]">User and Location</h2>
            </div>
            <div className="space-y-3">
              <div className="rounded-[10px] border border-[#efedf2] bg-[#faf9fc] px-3 py-3">
                <div className="text-[12px] text-[#7f7e88]">Top States by Users</div>
                <div className="mt-2">
                  <DistributionList rows={userStates} label="user state" />
                </div>
              </div>
              <div className="rounded-[10px] border border-[#efedf2] bg-[#faf9fc] px-3 py-3">
                <div className="text-[12px] text-[#7f7e88]">Top States by Ads</div>
                <div className="mt-2">
                  <DistributionList rows={adStates} label="ad state" />
                </div>
              </div>
            </div>
          </article>

          <article className="rounded-[14px] border border-[#e8e8ea] bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <CreditCard size={18} className="text-[#1f1f29]" />
              <h2 className="text-[16px] font-semibold text-[#1f1f29]">Payments</h2>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-[10px] border border-[#efedf2] bg-[#faf9fc] px-3 py-3">
                <div className="mb-2 text-[12px] text-[#7f7e88]">By Status</div>
                <DistributionList rows={paymentByStatus} label="payment status" />
              </div>
              <div className="rounded-[10px] border border-[#efedf2] bg-[#faf9fc] px-3 py-3">
                <div className="mb-2 text-[12px] text-[#7f7e88]">By Purpose</div>
                <DistributionList rows={paymentByPurpose} label="payment purpose" />
              </div>
            </div>
          </article>

          <article className="rounded-[14px] border border-[#e8e8ea] bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <BarChart3 size={18} className="text-[#1f1f29]" />
              <h2 className="text-[16px] font-semibold text-[#1f1f29]">Categories</h2>
            </div>
            <DistributionList
              rows={topCategories}
              label="category"
            />
          </article>

          <article className="rounded-[14px] border border-[#e8e8ea] bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Flag size={18} className="text-[#1f1f29]" />
              <h2 className="text-[16px] font-semibold text-[#1f1f29]">Moderation</h2>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-[10px] border border-[#efedf2] bg-[#faf9fc] px-3 py-3">
                <div className="text-[12px] text-[#7f7e88]">Reports</div>
                <div className="mt-1 text-[22px] font-semibold text-[#1f1f29]">{numberValue(analytics.moderation.reportsCount)}</div>
              </div>
              <div className="rounded-[10px] border border-[#efedf2] bg-[#faf9fc] px-3 py-3">
                <div className="text-[12px] text-[#7f7e88]">Reviews</div>
                <div className="mt-1 text-[22px] font-semibold text-[#1f1f29]">{numberValue(analytics.moderation.reviewsCount)}</div>
              </div>
            </div>
          </article>
        </section>
      </div>
    </AdminLayout>
  );
}
