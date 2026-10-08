import {
  Users,
  Megaphone,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useRouter } from '@/context/RouterContext';
import { AdminLayout } from './AdminLayout';
import { Badge } from '@/components/ui/Badge';

export function AdminDashboard() {
  const { creators, campaigns, applications } = useApp();
  const { navigate } = useRouter();

  const pending = applications.filter((a) => a.status === 'pending');
  const approved = applications.filter((a) => a.status === 'approved');
  const rejected = applications.filter((a) => a.status === 'rejected');
  const openCampaigns = campaigns.filter((c) => c.status === 'open');

  const stats = [
    { label: 'Creators', value: creators.length, icon: Users, color: 'bg-sage-100 text-sage-700', to: '/admin/creators' },
    { label: 'Campaigns', value: campaigns.length, icon: Megaphone, color: 'bg-cream-100 text-ink-700', to: '/admin/campaigns' },
    { label: 'Total Applications', value: applications.length, icon: FileText, color: 'bg-blue-50 text-blue-600', to: '/admin/applications' },
    { label: 'Pending Review', value: pending.length, icon: Clock, color: 'bg-amber-50 text-amber-600', to: '/admin/applications' },
  ];

  const statusBreakdown = [
    { label: 'Pending', count: pending.length, icon: Clock, color: 'text-amber-600' },
    { label: 'Approved', count: approved.length, icon: CheckCircle2, color: 'text-green-600' },
    { label: 'Rejected', count: rejected.length, icon: XCircle, color: 'text-red-500' },
  ];

  const recentApps = applications.slice(0, 5);

  return (
    <AdminLayout active="dashboard">
      <h1 className="text-2xl font-bold text-ink-900">Dashboard Overview</h1>
      <p className="mt-1 text-sm text-ink-600">Welcome back. Here's what's happening with SIOT Creator Hub.</p>

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <button
              key={s.label}
              onClick={() => navigate(s.to)}
              className="group rounded-3xl border border-sage-100 bg-white p-5 text-left shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${s.color}`}>
                <Icon size={22} />
              </div>
              <div className="mt-4 text-3xl font-bold text-ink-900">{s.value}</div>
              <div className="mt-0.5 flex items-center justify-between">
                <span className="text-sm text-ink-500">{s.label}</span>
                <ArrowRight size={16} className="text-sage-400 transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Status breakdown */}
        <div className="rounded-3xl border border-sage-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2">
            <TrendingUp size={20} className="text-sage-600" />
            <h2 className="text-lg font-semibold text-ink-900">Application Status</h2>
          </div>
          <div className="mt-4 space-y-3">
            {statusBreakdown.map((s) => {
              const Icon = s.icon;
              const pct = applications.length > 0 ? Math.round((s.count / applications.length) * 100) : 0;
              return (
                <div key={s.label}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 font-medium text-ink-700">
                      <Icon size={16} className={s.color} />
                      {s.label}
                    </span>
                    <span className="text-ink-500">{s.count} ({pct}%)</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-sage-50">
                    <div
                      className={`h-full rounded-full ${
                        s.label === 'Pending' ? 'bg-amber-400' : s.label === 'Approved' ? 'bg-green-500' : 'bg-red-400'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Open campaigns */}
        <div className="rounded-3xl border border-sage-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-ink-900">Open Campaigns</h2>
            <button onClick={() => navigate('/admin/campaigns')} className="text-sm font-medium text-sage-700 hover:text-sage-800">
              View All
            </button>
          </div>
          <div className="mt-4 space-y-3">
            {openCampaigns.map((c) => {
              const appCount = applications.filter((a) => a.campaignId === c.id).length;
              return (
                <div key={c.id} className="flex items-center justify-between rounded-xl bg-sage-50 px-4 py-3">
                  <div>
                    <div className="text-sm font-semibold text-ink-900">{c.title}</div>
                    <div className="text-xs text-ink-500">{appCount} applications</div>
                  </div>
                  <Badge variant="open">Open</Badge>
                </div>
              );
            })}
            {openCampaigns.length === 0 && (
              <p className="text-sm text-ink-500">No open campaigns.</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent applications */}
      <div className="mt-6 rounded-3xl border border-sage-100 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink-900">Recent Applications</h2>
          <button onClick={() => navigate('/admin/applications')} className="text-sm font-medium text-sage-700 hover:text-sage-800">
            View All
          </button>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-sage-100 text-left text-xs uppercase tracking-wide text-ink-500">
                <th className="pb-3 pr-4 font-medium">Creator</th>
                <th className="pb-3 pr-4 font-medium">Campaign</th>
                <th className="pb-3 pr-4 font-medium">Date</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentApps.map((app) => {
                const campaign = campaigns.find((c) => c.id === app.campaignId);
                return (
                  <tr key={app.id} className="border-b border-sage-50 last:border-0">
                    <td className="py-3 pr-4">
                      <div className="font-medium text-ink-900">{app.creatorName}</div>
                      <div className="text-xs text-ink-500">@{app.tiktokUsername}</div>
                    </td>
                    <td className="py-3 pr-4 text-ink-600">{campaign?.title ?? '—'}</td>
                    <td className="py-3 pr-4 text-ink-500">
                      {new Date(app.appliedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </td>
                    <td className="py-3">
                      <Badge variant={app.status}>
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
              {recentApps.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-ink-500">No applications yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
