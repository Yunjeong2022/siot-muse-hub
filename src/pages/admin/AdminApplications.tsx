import { useState } from 'react';
import { Search, CheckCircle2, XCircle, Clock, ExternalLink } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { AdminLayout } from './AdminLayout';
import { Badge } from '@/components/ui/Badge';
import type { ApplicationStatus } from '@/types';

type Filter = 'all' | ApplicationStatus;

export function AdminApplications() {
  const { applications, campaigns, updateApplicationStatus } = useApp();
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');

  const filtered = applications.filter((a) => {
    const matchesFilter = filter === 'all' || a.status === filter;
    const matchesSearch =
      !search ||
      a.creatorName.toLowerCase().includes(search.toLowerCase()) ||
      a.creatorEmail.toLowerCase().includes(search.toLowerCase()) ||
      a.tiktokUsername.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const counts: Record<Filter, number> = {
    all: applications.length,
    pending: applications.filter((a) => a.status === 'pending').length,
    approved: applications.filter((a) => a.status === 'approved').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
  };

  const filters: { key: Filter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'approved', label: 'Approved' },
    { key: 'rejected', label: 'Rejected' },
  ];

  return (
    <AdminLayout active="applications">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink-900">Applications</h1>
        <p className="mt-1 text-sm text-ink-600">Review and manage campaign applications from creators.</p>
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                filter === f.key
                  ? 'bg-sage-600 text-white'
                  : 'bg-sage-50 text-sage-700 hover:bg-sage-100'
              }`}
            >
              {f.label} ({counts[f.key]})
            </button>
          ))}
        </div>
        <div className="relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="input-field w-full py-2.5 pl-11 sm:w-72"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-sage-200 py-16 text-center">
          <Clock size={40} className="text-sage-300" />
          <p className="mt-4 text-ink-600">No applications found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((app) => {
            const campaign = campaigns.find((c) => c.id === app.campaignId);
            return (
              <div key={app.id} className="rounded-3xl border border-sage-100 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  {/* Creator info */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold text-ink-900">{app.creatorName}</h3>
                      <Badge variant={app.status}>
                        {app.status === 'pending' && <Clock size={13} />}
                        {app.status === 'approved' && <CheckCircle2 size={13} />}
                        {app.status === 'rejected' && <XCircle size={13} />}
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
                      <div className="text-ink-600">
                        <span className="text-ink-400">Email:</span> {app.creatorEmail}
                      </div>
                      <div className="text-ink-600">
                        <span className="text-ink-400">TikTok:</span>{' '}
                        <a
                          href={app.tiktokProfileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-sage-700 hover:underline"
                        >
                          @{app.tiktokUsername} <ExternalLink size={11} className="inline" />
                        </a>
                      </div>
                      <div className="text-ink-600">
                        <span className="text-ink-400">State:</span> {app.country}
                      </div>
                      {app.instagramUsername && (
                        <div className="text-ink-600">
                          <span className="text-ink-400">Instagram:</span> @{app.instagramUsername}
                        </div>
                      )}
                      <div className="text-ink-600">
                        <span className="text-ink-400">Campaign:</span> {campaign?.title ?? '—'}
                      </div>
                      <div className="text-ink-600">
                        <span className="text-ink-400">Applied:</span>{' '}
                        {new Date(app.appliedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                    {app.message && (
                      <div className="mt-3 rounded-xl bg-sage-50 px-4 py-3 text-sm text-ink-600">
                        "{app.message}"
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {app.status === 'pending' ? (
                    <div className="flex shrink-0 gap-2">
                      <button
                        onClick={() => updateApplicationStatus(app.id, 'approved')}
                        className="inline-flex items-center gap-2 rounded-full bg-green-500 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-green-600 active:scale-95"
                      >
                        <CheckCircle2 size={16} />
                        Approve
                      </button>
                      <button
                        onClick={() => updateApplicationStatus(app.id, 'rejected')}
                        className="inline-flex items-center gap-2 rounded-full bg-red-500 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-red-600 active:scale-95"
                      >
                        <XCircle size={16} />
                        Reject
                      </button>
                    </div>
                  ) : (
                    <div className="flex shrink-0 items-center gap-2 text-sm text-ink-500">
                      {app.reviewedAt && (
                        <span>
                          Reviewed {new Date(app.reviewedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      )}
                      <button
                        onClick={() => updateApplicationStatus(app.id, 'pending')}
                        className="rounded-full border border-sage-200 px-4 py-2 text-sm font-medium text-ink-600 hover:bg-sage-50"
                      >
                        Reset
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
}
