import { useState } from 'react';
import { Calendar, Gift, ArrowRight, Search, PackageOpen } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useRouter } from '@/context/RouterContext';
import { Badge } from '@/components/ui/Badge';
import type { CampaignStatus } from '@/types';

type Filter = 'all' | 'open' | 'closed';

export function CampaignsPage() {
  const { campaigns, hasApplied, currentUser } = useApp();
  const { navigate } = useRouter();
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');

  const filtered = campaigns.filter((c) => {
    const matchesFilter = filter === 'all' || c.status === filter;
    const matchesSearch =
      !search ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.subtitle.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const counts: Record<CampaignStatus | 'all', number> = {
    all: campaigns.length,
    open: campaigns.filter((c) => c.status === 'open').length,
    closed: campaigns.filter((c) => c.status === 'closed').length,
  };

  const filters: { key: Filter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'open', label: 'Open' },
    { key: 'closed', label: 'Closed' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-ink-900">Campaigns</h1>
        <p className="mt-2 text-ink-600">
          Browse all SIOT collaboration opportunities. Apply to the ones that match your style.
        </p>
      </div>

      {/* Controls */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
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
              {f.label}
              <span className="ml-1.5 text-xs opacity-70">({counts[f.key]})</span>
            </button>
          ))}
        </div>
        <div className="relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search campaigns..."
            className="input-field w-full py-2.5 pl-11 sm:w-64"
          />
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-sage-200 py-20 text-center">
          <PackageOpen size={48} className="text-sage-300" />
          <p className="mt-4 text-ink-600">No campaigns found matching your search.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => {
            const applied = currentUser ? hasApplied(c.id, currentUser.id) : false;
            return (
              <div
                key={c.id}
                className="group cursor-pointer overflow-hidden rounded-3xl border border-sage-100 bg-white shadow-sm transition-all hover:shadow-lg hover:-translate-y-0.5"
                onClick={() => navigate(`/campaigns/${c.id}`)}
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={c.productImage}
                    alt={c.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute left-3 top-3">
                    <Badge variant={c.status}>
                      {c.status === 'open' ? 'Open' : 'Closed'}
                    </Badge>
                  </div>
                  {applied && (
                    <div className="absolute right-3 top-3">
                      <Badge variant="pending">Applied</Badge>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-ink-900">{c.title}</h3>
                  <p className="mt-1 text-sm text-ink-500">{c.subtitle}</p>
                  <div className="mt-4 flex items-center gap-2 text-sm text-sage-700">
                    <Gift size={16} />
                    <span className="font-medium">{c.rewardSummary}</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-sage-50 pt-3">
                    <div className="flex items-center gap-1.5 text-sm text-ink-500">
                      <Calendar size={15} />
                      Deadline: {new Date(c.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                    <ArrowRight size={18} className="text-sage-400 transition-transform group-hover:translate-x-1 group-hover:text-sage-600" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
