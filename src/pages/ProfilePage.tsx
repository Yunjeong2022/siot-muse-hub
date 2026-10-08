import { useEffect, useState } from 'react';
import { CheckCircle2, User as UserIcon, AlertTriangle } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useRouter } from '@/context/RouterContext';
import { Alert } from '@/components/ui/Alert';
import { US_STATES } from '@/data/mockData';

export function ProfilePage() {
  const { currentUser, profile, saveProfile } = useApp();
  const { navigate } = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [tiktokUsername, setTiktokUsername] = useState('');
  const [tiktokProfileUrl, setTiktokProfileUrl] = useState('');
  const [country, setCountry] = useState('');
  const [instagramUsername, setInstagramUsername] = useState('');
  const [bio, setBio] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName);
      setLastName(profile.lastName);
      setTiktokUsername(profile.tiktokUsername);
      setTiktokProfileUrl(profile.tiktokProfileUrl);
      setCountry(profile.country);
      setInstagramUsername(profile.instagramUsername ?? '');
      setBio(profile.bio ?? '');
    }
  }, [profile]);

  if (!currentUser) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <Alert variant="warning">Please log in to view your profile.</Alert>
        <button onClick={() => navigate('/login')} className="btn-primary mt-4">
          Go to Login
        </button>
      </div>
    );
  }

  if (currentUser.role === 'admin') {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <Alert variant="info">Admin accounts don't have a creator profile.</Alert>
        <button onClick={() => navigate('/admin')} className="btn-primary mt-4">
          Go to Dashboard
        </button>
      </div>
    );
  }

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!firstName.trim()) e.firstName = 'First name is required.';
    if (!lastName.trim()) e.lastName = 'Last name is required.';
    if (!tiktokUsername.trim()) e.tiktokUsername = 'TikTok username is required.';
    if (!tiktokProfileUrl.trim()) {
      e.tiktokProfileUrl = 'TikTok profile URL is required.';
    } else {
      try {
        new URL(tiktokProfileUrl);
      } catch {
        e.tiktokProfileUrl = 'Please enter a valid URL (e.g., https://tiktok.com/@username).';
      }
    }
    if (!country) e.country = 'Please select your state.';
    if (instagramUsername && instagramUsername.startsWith('@')) {
      e.instagramUsername = 'Enter username without the @ symbol.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(false);
    if (!validate()) return;
    saveProfile({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      tiktokUsername: tiktokUsername.trim().replace(/^@/, ''),
      tiktokProfileUrl: tiktokProfileUrl.trim(),
      country,
      instagramUsername: instagramUsername.trim().replace(/^@/, '') || undefined,
      bio: bio.trim() || undefined,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8 animate-fade-in">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sage-100 text-sage-700">
            <UserIcon size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-ink-900">Creator Profile</h1>
            <p className="text-sm text-ink-600">Tell us about yourself so we can match you with campaigns.</p>
          </div>
        </div>
      </div>

      {saved && (
        <div className="mb-6">
          <Alert variant="success">
            <span className="flex items-center gap-2">
              <CheckCircle2 size={16} />
              Profile saved successfully!
            </span>
          </Alert>
        </div>
      )}

      {!profile && (
        <div className="mb-6">
          <Alert variant="info">
            Complete your profile to start applying to campaigns. Your profile information will be
            included with every application.
          </Alert>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-sage-100 bg-white p-6 shadow-sm sm:p-8">
        {/* Name */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label-field" htmlFor="firstName">First name *</label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="input-field"
              placeholder="Jane"
            />
            {errors.firstName && <p className="mt-1.5 text-xs text-red-500">{errors.firstName}</p>}
          </div>
          <div>
            <label className="label-field" htmlFor="lastName">Last name *</label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="input-field"
              placeholder="Doe"
            />
            {errors.lastName && <p className="mt-1.5 text-xs text-red-500">{errors.lastName}</p>}
          </div>
        </div>

        {/* Email (read-only) */}
        <div>
          <label className="label-field">Email</label>
          <input
            type="email"
            value={currentUser.email}
            disabled
            className="input-field cursor-not-allowed bg-sage-50 text-ink-500"
          />
        </div>

        {/* TikTok */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="label-field" htmlFor="tiktokUsername">TikTok username *</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400">@</span>
              <input
                id="tiktokUsername"
                type="text"
                value={tiktokUsername}
                onChange={(e) => setTiktokUsername(e.target.value)}
                className="input-field pl-8"
                placeholder="username"
              />
            </div>
            {errors.tiktokUsername && <p className="mt-1.5 text-xs text-red-500">{errors.tiktokUsername}</p>}
          </div>
          <div>
            <label className="label-field" htmlFor="tiktokProfileUrl">TikTok profile URL *</label>
            <input
              id="tiktokProfileUrl"
              type="url"
              value={tiktokProfileUrl}
              onChange={(e) => setTiktokProfileUrl(e.target.value)}
              className="input-field"
              placeholder="https://www.tiktok.com/@username"
            />
            {errors.tiktokProfileUrl && <p className="mt-1.5 text-xs text-red-500">{errors.tiktokProfileUrl}</p>}
          </div>
        </div>

        {/* Country */}
        <div>
          <label className="label-field" htmlFor="country">State (US only) *</label>
          <select
            id="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="input-field cursor-pointer"
          >
            <option value="">Select your state</option>
            {US_STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {errors.country && <p className="mt-1.5 text-xs text-red-500">{errors.country}</p>}
        </div>

        {/* Instagram (optional) */}
        <div>
          <label className="label-field" htmlFor="instagramUsername">
            Instagram username <span className="text-ink-400">(optional)</span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400">@</span>
            <input
              id="instagramUsername"
              type="text"
              value={instagramUsername}
              onChange={(e) => setInstagramUsername(e.target.value)}
              className="input-field pl-8"
              placeholder="username"
            />
          </div>
          {errors.instagramUsername && <p className="mt-1.5 text-xs text-red-500">{errors.instagramUsername}</p>}
        </div>

        {/* Bio (optional) */}
        <div>
          <label className="label-field" htmlFor="bio">
            Bio <span className="text-ink-400">(optional)</span>
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="input-field resize-none"
            placeholder="Tell us about your content style and audience..."
          />
        </div>

        <div className="flex items-center gap-3 border-t border-sage-100 pt-6">
          <button type="submit" className="btn-primary">
            <CheckCircle2 size={18} />
            {profile ? 'Save Changes' : 'Create Profile'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/campaigns')}
            className="btn-ghost"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
