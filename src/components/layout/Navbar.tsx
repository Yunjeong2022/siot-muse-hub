import { useState } from 'react';
import { LogOut, Menu, Shield, User as UserIcon, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useRouter } from '@/context/RouterContext';
import { Logo } from '@/components/ui/Logo';

export function Navbar() {
  const { currentUser, profile, logOut } = useApp();
  const { path, navigate } = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = currentUser?.role === 'admin';

  const close = () => setMobileOpen(false);

  const handleNavigate = (to: string) => {
    navigate(to);
    close();
  };

  const handleLogout = () => {
    logOut();
    navigate('/');
    close();
  };

  const creatorLinks = [
    { label: 'Campaigns', to: '/campaigns' },
    { label: 'My Applications', to: '/my-applications' },
    { label: 'My Profile', to: '/profile' },
  ];

  const adminLinks = [
    { label: 'Dashboard', to: '/admin' },
    { label: 'Creators', to: '/admin/creators' },
    { label: 'Applications', to: '/admin/applications' },
    { label: 'Campaigns', to: '/admin/campaigns' },
  ];

  const links = isAdmin ? adminLinks : currentUser ? creatorLinks : [];

  return (
    <header className="sticky top-0 z-40 border-b border-sage-100 bg-white/85 backdrop-blur-lg">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <button onClick={() => handleNavigate(isAdmin ? '/admin' : '/')} className="shrink-0">
          <Logo />
        </button>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <button
              key={link.to}
              onClick={() => handleNavigate(link.to)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                path === link.to
                  ? 'bg-sage-100 text-sage-700'
                  : 'text-ink-600 hover:bg-sage-50 hover:text-ink-900'
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="hidden items-center gap-3 md:flex">
          {currentUser ? (
            <>
              <div className="flex items-center gap-2 rounded-full bg-sage-50 py-1.5 pl-1.5 pr-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sage-200 text-sage-700">
                  {isAdmin ? <Shield size={16} /> : <UserIcon size={16} />}
                </div>
                <span className="text-sm font-medium text-ink-800">
                  {isAdmin ? 'Admin' : profile ? `${profile.firstName}` : currentUser.email}
                </span>
              </div>
              <button onClick={handleLogout} className="btn-ghost px-4 py-2">
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <button onClick={() => handleNavigate('/login')} className="btn-ghost px-4 py-2">
                Login
              </button>
              <button onClick={() => handleNavigate('/signup')} className="btn-primary px-5 py-2.5">
                Join Now
              </button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="rounded-lg p-2 text-ink-700 md:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-sage-100 bg-white px-4 py-4 md:hidden animate-slide-in">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <button
                key={link.to}
                onClick={() => handleNavigate(link.to)}
                className={`rounded-xl px-4 py-2.5 text-left text-sm font-medium transition-colors ${
                  path === link.to
                    ? 'bg-sage-100 text-sage-700'
                    : 'text-ink-600 hover:bg-sage-50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>
          <div className="mt-4 border-t border-sage-100 pt-4">
            {currentUser ? (
              <button onClick={handleLogout} className="btn-secondary w-full">
                <LogOut size={16} />
                Logout
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                <button onClick={() => handleNavigate('/login')} className="btn-secondary w-full">
                  Login
                </button>
                <button onClick={() => handleNavigate('/signup')} className="btn-primary w-full">
                  Join Now
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
