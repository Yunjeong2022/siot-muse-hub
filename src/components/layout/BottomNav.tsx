import { Megaphone, LayoutGrid, User as UserIcon } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useRouter } from '@/context/RouterContext';

interface BottomNavProps {
  /** Hide the bar on pages like landing/auth where it's not needed */
  hidden?: boolean;
}

export function BottomNav({ hidden = false }: BottomNavProps) {
  const { currentUser, profile, getApplicationsForUser } = useApp();
  const { path, navigate } = useRouter();

  if (hidden || !currentUser || currentUser.role !== 'creator') return null;

  const apps = getApplicationsForUser(currentUser.id);
  const activeCount = apps.filter((a) => a.status === 'approved' || a.status === 'pending').length;

  const items = [
    {
      label: 'Campaigns',
      icon: Megaphone,
      to: '/campaigns',
      active: path === '/campaigns' || path.startsWith('/campaigns/'),
    },
    {
      label: 'My Campaigns',
      icon: LayoutGrid,
      to: '/my-campaigns',
      active: path === '/my-campaigns',
      badge: activeCount > 0 ? activeCount : undefined,
    },
    {
      label: 'Profile',
      icon: UserIcon,
      to: '/profile',
      active: path === '/profile',
      incomplete: !profile,
    },
  ];

  return (
    <>
      {/* Spacer to prevent content from being hidden behind the nav */}
      <div className="h-20" aria-hidden />
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-olive-100 bg-white/95 backdrop-blur-lg lg:hidden">
        <div className="mx-auto flex max-w-md items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)] pt-2">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.to}
                onClick={() => navigate(item.to)}
                className={`relative flex flex-1 flex-col items-center gap-1 rounded-xl px-2 py-2 transition-colors ${
                  item.active ? 'text-olive-700' : 'text-ink-500'
                }`}
              >
                <div className="relative">
                  <Icon size={22} strokeWidth={item.active ? 2.4 : 1.8} />
                  {item.badge !== undefined && (
                    <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-olive-600 px-1 text-[10px] font-bold text-white">
                      {item.badge}
                    </span>
                  )}
                  {item.incomplete && (
                    <span className="absolute -right-1 -top-0.5 h-2.5 w-2.5 rounded-full bg-amber-400 ring-2 ring-white" />
                  )}
                </div>
                <span className={`text-[11px] font-medium ${item.active ? 'font-semibold' : ''}`}>
                  {item.label}
                </span>
                {item.active && (
                  <span className="absolute -top-px h-0.5 w-8 rounded-full bg-olive-600" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
