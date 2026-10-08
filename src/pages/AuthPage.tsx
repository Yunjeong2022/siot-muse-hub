import { useState } from 'react';
import { ArrowRight, Mail, Lock, Shield, Eye, EyeOff } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useRouter } from '@/context/RouterContext';
import { Alert } from '@/components/ui/Alert';
import { Logo } from '@/components/ui/Logo';

interface AuthPageProps {
  mode: 'login' | 'signup';
}

export function AuthPage({ mode }: AuthPageProps) {
  const { signUp, logIn, loginAsAdmin } = useApp();
  const { navigate } = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isSignup = mode === 'signup';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = isSignup ? signUp(email, password) : logIn(email, password);

    if (!result.success) {
      setError(result.error ?? 'Something went wrong.');
      setLoading(false);
      return;
    }

    navigate(isSignup ? '/profile' : '/campaigns');
  };

  const handleAdminLogin = () => {
    setError('');
    loginAsAdmin();
    navigate('/admin');
  };

  return (
    <div className="flex min-h-[calc(100vh-65px)] items-center justify-center bg-sage-50 px-4 py-12">
      <div className="w-full max-w-md animate-slide-up">
        <div className="mb-8 text-center">
          <div className="mb-6 flex justify-center">
            <Logo size={48} />
          </div>
          <h1 className="text-2xl font-bold text-ink-900">
            {isSignup ? 'Join the Creator Hub' : 'Welcome back'}
          </h1>
          <p className="mt-2 text-sm text-ink-600">
            {isSignup
              ? 'Create your account to start collaborating with SIOT.'
              : 'Login to access your campaigns and applications.'}
          </p>
        </div>

        <div className="rounded-3xl border border-sage-100 bg-white p-8 shadow-sm">
          {error && (
            <div className="mb-4">
              <Alert variant="error">{error}</Alert>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label-field" htmlFor="email">
                Email address
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-field pl-11"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="label-field" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isSignup ? 'At least 6 characters' : 'Your password'}
                  className="input-field px-11"
                  required
                  autoComplete={isSignup ? 'new-password' : 'current-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
              {isSignup ? 'Create Account' : 'Login'}
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-ink-600">
            {isSignup ? (
              <>
                Already have an account?{' '}
                <button onClick={() => navigate('/login')} className="font-semibold text-sage-700 hover:text-sage-800">
                  Login
                </button>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <button onClick={() => navigate('/signup')} className="font-semibold text-sage-700 hover:text-sage-800">
                  Sign up
                </button>
              </>
            )}
          </div>
        </div>

        {/* Demo admin access */}
        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/50 p-4">
          <div className="flex items-start gap-3">
            <Shield size={20} className="mt-0.5 shrink-0 text-amber-600" />
            <div>
              <p className="text-sm font-medium text-amber-800">Demo Admin Access</p>
              <p className="mt-0.5 text-xs text-amber-700">
                Not for production use. Click below to explore the admin dashboard.
              </p>
              <button
                onClick={handleAdminLogin}
                className="mt-2 text-sm font-semibold text-amber-800 underline hover:text-amber-900"
              >
                Enter Admin Demo →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
