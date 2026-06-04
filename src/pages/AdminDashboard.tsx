import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/admin/AdminLayout';
import {
  Users,
  Package,
  AlertCircle,
  Bell,
  UserCheck,
  ClipboardList,
  Zap,
  Home,
  ArrowRight,
} from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalAds: number;
  totalReports: number;
  pendingReports: number;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('qwik_token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }

      const data = await response.json();
      setStats(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <AdminLayout title="Admin Dashboard">
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-[#7f7e88]">Loading...</div>
      </div>
    </AdminLayout>
  );
  if (error) return (
    <AdminLayout title="Admin Dashboard">
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout 
      title="Dashboard" 
      description="Platform overview and quick stats"
      headerAction={
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-6 py-2 rounded-lg bg-[#ff9715] text-white text-sm font-medium hover:bg-[#e68a0e] transition"
        >
          <Home size={18} />
          Back to Home
        </button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {/* Total Users */}
          <div className="bg-white rounded-[16px] p-6 shadow-sm border border-[#e8e8ea]">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[#7f7e88] text-sm font-medium">Total Users</div>
              <div className="w-10 h-10 rounded-full bg-[#f3f3f5] flex items-center justify-center">
                <Users size={20} className="text-[#1f1f29]" />
              </div>
            </div>
            <div className="text-4xl font-bold text-[#1f1f29]">{stats?.totalUsers || 0}</div>
            <div className="text-xs text-[#9a99a6] mt-2">Active users on platform</div>
          </div>

          {/* Total Ads */}
          <div className="bg-white rounded-[16px] p-6 shadow-sm border border-[#e8e8ea]">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[#7f7e88] text-sm font-medium">Total Ads</div>
              <div className="w-10 h-10 rounded-full bg-[#f3f3f5] flex items-center justify-center">
                <Package size={20} className="text-[#1f1f29]" />
              </div>
            </div>
            <div className="text-4xl font-bold text-[#1f1f29]">{stats?.totalAds || 0}</div>
            <div className="text-xs text-[#9a99a6] mt-2">Active listings</div>
          </div>

          {/* Total Reports */}
          <div className="bg-white rounded-[16px] p-6 shadow-sm border border-[#e8e8ea]">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[#7f7e88] text-sm font-medium">Total Reports</div>
              <div className="w-10 h-10 rounded-full bg-[#f3f3f5] flex items-center justify-center">
                <AlertCircle size={20} className="text-[#1f1f29]" />
              </div>
            </div>
            <div className="text-4xl font-bold text-[#1f1f29]">{stats?.totalReports || 0}</div>
            <div className="text-xs text-[#9a99a6] mt-2">User reports</div>
          </div>

          {/* Pending Reports */}
          <div className="bg-white rounded-[16px] p-6 shadow-sm border border-[#e8e8ea]">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[#7f7e88] text-sm font-medium">Pending Reports</div>
              <div className="w-10 h-10 rounded-full bg-[#f3f3f5] flex items-center justify-center">
                <Bell size={20} className="text-[#1f1f29]" />
              </div>
            </div>
            <div className="text-4xl font-bold text-[#1f1f29]">{stats?.pendingReports || 0}</div>
            <div className="text-xs text-[#9a99a6] mt-2">Reports awaiting action</div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Manage Users */}
          <button
            onClick={() => navigate('/admin/users')}
            className="text-left bg-white rounded-[16px] p-6 shadow-sm border border-[#e8e8ea] hover:border-[#ff9715] hover:shadow-md transition"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-[#1f1f29] mb-1">Manage Users</h3>
                <p className="text-[#7f7e88] text-xs">View, ban, or manage platform users</p>
              </div>
              <UserCheck size={24} className="text-[#1f1f29]" />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fff0e6] text-[#ff9715] text-xs font-medium">
              User Management
              <ArrowRight size={14} />
            </div>
          </button>

          {/* Moderate Ads */}
          <button
            onClick={() => navigate('/admin/ads')}
            className="text-left bg-white rounded-[16px] p-6 shadow-sm border border-[#e8e8ea] hover:border-[#ff9715] hover:shadow-md transition"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-[#1f1f29] mb-1">Moderate Ads</h3>
                <p className="text-[#7f7e88] text-xs">Review and delete inappropriate listings</p>
              </div>
              <ClipboardList size={24} className="text-[#1f1f29]" />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fff0e6] text-[#ff9715] text-xs font-medium">
              Content Moderation
              <ArrowRight size={14} />
            </div>
          </button>

          {/* Handle Reports */}
          <button
            onClick={() => navigate('/admin/reports')}
            className="text-left bg-white rounded-[16px] p-6 shadow-sm border border-[#ff9715] hover:shadow-md transition relative"
          >
            <div className="absolute top-3 right-3 px-2 py-1 bg-[#ff6b6b] text-white text-xs font-bold rounded-full">
              {stats?.pendingReports || 0} Pending
            </div>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-[#1f1f29] mb-1">Handle Reports</h3>
                <p className="text-[#7f7e88] text-xs">Review and resolve user complaints</p>
              </div>
              <Zap size={24} className="text-[#1f1f29]" />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fff0e6] text-[#ff9715] text-xs font-medium">
              Report Management
              <ArrowRight size={14} />
            </div>
          </button>
        </div>
    </AdminLayout>
  );
}
