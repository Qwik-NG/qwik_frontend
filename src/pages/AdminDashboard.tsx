import { useEffect, useState } from 'react';
import type { ComponentType } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/admin/AdminLayout';
import { api } from '../services/api';
import type { AdminStats } from '../types';
import {
  CheckCircle,
  Users,
  UserX,
  Package,
  AlertCircle,
  Bell,
  UserCheck,
  ClipboardList,
  Zap,
  ShieldCheck,
  Home,
  ArrowRight,
} from 'lucide-react';

type StatCard = {
  label: string;
  value: number;
  description: string;
  icon: ComponentType<{ size?: string | number; className?: string }>;
};

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="rounded-[14px] border border-[#e8e8ea] bg-white p-5 shadow-sm">
            <div className="h-4 w-28 animate-pulse rounded bg-[#efedf2]" />
            <div className="mt-3 h-9 w-20 animate-pulse rounded bg-[#efedf2]" />
            <div className="mt-3 h-3 w-36 animate-pulse rounded bg-[#efedf2]" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-[14px] border border-[#e8e8ea] bg-white p-5 shadow-sm">
            <div className="h-5 w-36 animate-pulse rounded bg-[#efedf2]" />
            <div className="mt-2 h-3 w-52 animate-pulse rounded bg-[#efedf2]" />
            <div className="mt-4 h-7 w-32 animate-pulse rounded-full bg-[#efedf2]" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.adminStats();
      setStats(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load admin stats');
    } finally {
      setLoading(false);
    }
  };

  const metricCards: StatCard[] = [
    {
      label: 'Total Users',
      value: stats?.totalUsers ?? 0,
      description: 'Registered accounts',
      icon: Users,
    },
    {
      label: 'Banned Users',
      value: stats?.bannedUsers ?? 0,
      description: 'Currently suspended accounts',
      icon: UserX,
    },
    {
      label: 'Total Ads',
      value: stats?.totalAds ?? 0,
      description: 'Listings across categories',
      icon: Package,
    },
    {
      label: 'Total Reports',
      value: stats?.totalReports ?? 0,
      description: 'Submitted moderation reports',
      icon: AlertCircle,
    },
    {
      label: 'Pending Reports',
      value: stats?.pendingReports ?? 0,
      description: 'Awaiting moderation action',
      icon: Bell,
    },
    {
      label: 'Pending Verification',
      value: stats?.pendingVerifications ?? 0,
      description: 'Applications in review queue',
      icon: CheckCircle,
    },
  ];

  const quickActions = [
    {
      title: 'Manage Users',
      description: 'Review accounts, status, and account risk signals.',
      path: '/admin/users',
      icon: UserCheck,
      badge: 'User Management',
      badgeTone: 'neutral',
    },
    {
      title: 'Moderate Ads',
      description: 'Inspect flagged listings and remove policy violations.',
      path: '/admin/ads',
      icon: ClipboardList,
      badge: 'Listing Moderation',
      badgeTone: 'neutral',
    },
    {
      title: 'Handle Reports',
      description: 'Triage pending reports and complete moderation actions.',
      path: '/admin/reports',
      icon: Zap,
      badge: `${stats?.pendingReports ?? 0} Pending`,
      badgeTone: 'critical',
    },
    {
      title: 'Review Verification',
      description: 'Process seller verification applications and decisions.',
      path: '/admin/verification',
      icon: ShieldCheck,
      badge: `${stats?.pendingVerifications ?? 0} Pending`,
      badgeTone: 'critical',
    },
  ] as const;

  if (loading) {
    return (
      <AdminLayout title="Dashboard" description="Platform overview and operational status">
        <DashboardSkeleton />
      </AdminLayout>
    );
  }

  if (error) return (
    <AdminLayout title="Dashboard" description="Platform overview and operational status">
      <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 rounded-[16px] border border-[#f2d4d4] bg-white p-6 text-center">
        <div className="rounded-full bg-[#fff0f0] p-3 text-[#c73b3b]">
          <AlertCircle size={20} />
        </div>
        <div className="text-[16px] font-medium text-[#1f1f29]">Unable to load dashboard metrics</div>
        <div className="max-w-[460px] text-[14px] text-[#7f7e88]">{error}</div>
        <button
          type="button"
          onClick={fetchStats}
          className="rounded-lg bg-[#ff9715] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#e68a0e]"
        >
          Retry
        </button>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout
      title="Dashboard"
      description="Platform overview and operational status"
      headerAction={
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 rounded-lg bg-[#ff9715] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#e68a0e]"
        >
          <Home size={18} />
          Back to Home
        </button>
      }
    >
      <div className="space-y-6">
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {metricCards.map((card) => {
            const Icon = card.icon;
            return (
              <article key={card.label} className="rounded-[14px] border border-[#e8e8ea] bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="text-[13px] font-medium text-[#7f7e88]">{card.label}</div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f3f3f5]">
                    <Icon size={18} className="text-[#1f1f29]" />
                  </div>
                </div>
                <div className="mt-2 text-[32px] font-semibold leading-none text-[#1f1f29]">{card.value.toLocaleString()}</div>
                <div className="mt-2 text-[12px] text-[#9a99a6]">{card.description}</div>
              </article>
            );
          })}
        </section>

        <section>
          <h2 className="mb-3 text-[15px] font-semibold text-[#34313d]">Quick actions</h2>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              const criticalBadge = action.badgeTone === 'critical';
              return (
                <button
                  key={action.title}
                  onClick={() => navigate(action.path)}
                  className="relative rounded-[14px] border border-[#e8e8ea] bg-white p-5 text-left shadow-sm transition hover:border-[#ff9715] hover:shadow-md"
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-[17px] font-semibold text-[#1f1f29]">{action.title}</h3>
                      <p className="mt-1 text-[13px] leading-[1.45] text-[#7f7e88]">{action.description}</p>
                    </div>
                    <Icon size={22} className="text-[#1f1f29]" />
                  </div>
                  <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[12px] font-medium ${
                    criticalBadge
                      ? 'bg-[#ffe9e9] text-[#ca4848]'
                      : 'bg-[#fff0e6] text-[#ff9715]'
                  }`}>
                    {action.badge}
                    <ArrowRight size={13} />
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}
