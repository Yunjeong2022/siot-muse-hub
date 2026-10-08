import type { ReactNode } from 'react';
import { LogOut } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useRouter } from '@/context/RouterContext';
import { Logo } from '@/components/ui/Logo';
import { BottomNav } from '@/components/layout/BottomNav';

interface CreatorLayoutProps {
  children: ReactNode;
  /** Hide bottom nav on non-app pages (landing, auth) */
  showBottomNav?: boolean;
}

export function CreatorLayout({ children, showBottomNav = true }: CreatorLayoutProps) {
  const { currentUser, profile, logOut } = useApp();
  const { navigate } = useRouter();

  const handleLogoClick = () => navigate(currentUser?.role === 'admin' ? '/admin' : '/');

  return (
    <div className="flex min-h-screen flex-col bg-ivory-100">
      {/* Top header — visible on all sizes, minimal on mobile */}
      <header className="sticky top-0 z-30 border-b border-olive-100 bg-ivory-50/90 backdrop-blur-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <button onClick={handleLogoClick} className="shrink-0">
            <Logo />
          </button>

          {/* Desktop nav */}
          {currentUser && currentUser.role === 'creator' && (
            <div className="hidden items-center gap-1 lg:flex">
              <button
                onClick={() => navigate('/campaigns')}
                className="rounded-full px-4 py-2 text-sm font-medium text-ink-600 transition-colors hover:bg-olive-50 hover:text-ink-900"
              >
                Campaigns
              </button>
              <button
                onClick={() => navigate('/my-campaigns')}
                className="rounded-full px-4 py-2 text-sm font-medium text-ink-600 transition-colors hover:bg-olive-50 hover:text-ink-900"
              >
                My Campaigns
              </button>
              <button
                onClick={() => navigate('/profile')}
                className="rounded-full px-4 py-2 text-sm font-medium text-ink-600 transition-colors hover:bg-olive-50 hover:text-ink-900"
              >
                Profile
              </button>
            </div>
          )}

          {/* Desktop auth actions */}
          <div className="hidden items-center gap-3 lg:flex">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-ink-700">
                  {currentUser.role === 'admin' ? 'Admin' : profile ? `${profile.firstName}` : currentUser.email}
                </span>
                <button
                  onClick={() => { logOut(); navigate('/'); }}
                  className="inline-flex items-center gap-1.5 rounded-full border border-olive-200 px-4 py-2 text-sm font-semibold text-olive-700 transition-all hover:bg-olive-50"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/login')}
                  className="rounded-full px-4 py-2 text-sm font-semibold text-ink-700 transition-colors hover:bg-olive-50"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="btn-primary"
                >
                  Join Now
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <BottomNav hidden={!showBottomNav} />
    </div>
  );
}
