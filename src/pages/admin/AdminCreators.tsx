import { useState } from 'react';
import { Search, User as UserIcon, Mail, MapPin, FileText } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { AdminLayout } from './AdminLayout';
import { Badge } from '@/components/ui/Badge';

export function AdminCreators() {
  const { creators, getCreatorProfile, getApplicationsForUser } = useApp();
  const [search, setSearch] = useState('');

  const filtered = creators.filter((c) => {
    if (!search) return true;
    const profile = getCreatorProfile(c.id);
    const name = profile ? `${profile.firstName} ${profile.lastName}` : '';
    return (
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      name.toLowerCase().includes(search.toLowerCase()) ||
      (profile?.tiktokUsername ?? '').toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <AdminLayout active="creators">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Creators</h1>
          <p className="mt-1 text-sm text-ink-600">{creators.length} registered creators</p>
        </div>
        <div className="relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search creators..."
            className="input-field w-full py-2.5 pl-11 sm:w-72"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-sage-200 py-16 text-center">
          <UserIcon size={40} className="text-sage-300" />
          <p className="mt-4 text-ink-600">No creators found.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((creator) => {
            const profile = getCreatorProfile(creator.id);
            const appCount = getApplicationsForUser(creator.id).length;
            return (
              <div key={creator.id} className="rounded-3xl border border-sage-100 bg-white p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sage-100 text-sage-700">
                    <UserIcon size={24} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-ink-900">
                      {profile ? `${profile.firstName} ${profile.lastName}` : 'Incomplete profile'}
                    </div>
                    <div className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-500">
                      <Mail size={13} />
                      <span className="truncate">{creator.email}</span>
                    </div>
                  </div>
                </div>
                {profile ? (
                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-ink-600">
                      <span className="text-ink-400">TikTok:</span>
                      <span className="font-medium">@{profile.tiktokUsername}</span>
                    </div>
                    <div className="flex items-center gap-2 text-ink-600">
                      <MapPin size={14} className="text-ink-400" />
                      {profile.country}
                    </div>
                    {profile.instagramUsername && (
                      <div className="flex items-center gap-2 text-ink-600">
                        <span className="text-ink-400">Instagram:</span>
                        <span className="font-medium">@{profile.instagramUsername}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-ink-400">Profile not yet completed.</p>
                )}
                <div className="mt-4 flex items-center justify-between border-t border-sage-50 pt-3">
                  <div className="flex items-center gap-1.5 text-sm text-ink-500">
                    <FileText size={15} />
                    {appCount} application{appCount !== 1 ? 's' : ''}
                  </div>
                  {profile ? (
                    <Badge variant="default">Profile complete</Badge>
                  ) : (
                    <Badge variant="closed">Incomplete</Badge>
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
