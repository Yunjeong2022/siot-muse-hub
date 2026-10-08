import { Mail } from 'lucide-react';
import { Logo } from '@/components/ui/Logo';
import { useRouter } from '@/context/RouterContext';

export function Footer() {
  const { navigate } = useRouter();

  return (
    <footer className="border-t border-sage-100 bg-sage-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-sm text-ink-600">
              SIOT Creator Hub connects US-based TikTok creators with premium K-beauty
              products. Join our program to collaborate, create, and earn.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-ink-900">Explore</h4>
            <ul className="mt-3 space-y-2 text-sm text-ink-600">
              <li>
                <button onClick={() => navigate('/campaigns')} className="hover:text-sage-700">
                  Campaigns
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/signup')} className="hover:text-sage-700">
                  Join Program
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/login')} className="hover:text-sage-700">
                  Login
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-ink-900">Contact</h4>
            <ul className="mt-3 space-y-2 text-sm text-ink-600">
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-sage-600" />
                creators@siot.skincare
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-sage-200 pt-6 text-center text-xs text-ink-500">
          <p>
            © 2026 SIOT Skincare. Demo prototype — not a live store. No real personal data is collected.
          </p>
        </div>
      </div>
    </footer>
  );
}
