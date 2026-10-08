import { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Gift,
  ListChecks,
  Package,
  Send,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useRouter } from '@/context/RouterContext';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import { Modal } from '@/components/ui/Modal';

export function CampaignDetailPage({ campaignId }: { campaignId: string }) {
  const {
    getCampaign,
    currentUser,
    profile,
    isProfileComplete,
    hasApplied,
    applyToCampaign,
  } = useApp();
  const { navigate } = useRouter();

  const [showApplyModal, setShowApplyModal] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const campaign = getCampaign(campaignId);

  if (!campaign) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center animate-fade-in">
        <Alert variant="warning">Campaign not found.</Alert>
        <button onClick={() => navigate('/campaigns')} className="btn-primary mt-4">
          Back to Campaigns
        </button>
      </div>
    );
  }

  const alreadyApplied = currentUser ? hasApplied(campaign.id, currentUser.id) : false;
  const isClosed = campaign.status === 'closed';

  const canApply =
    currentUser &&
    currentUser.role === 'creator' &&
    isProfileComplete &&
    !alreadyApplied &&
    !isClosed;

  const handleApply = () => {
    setError('');

    if (!currentUser) {
      navigate('/login');
      return;
    }
    if (currentUser.role === 'admin') {
      setError('Admins cannot apply to campaigns.');
      return;
    }
    if (!isProfileComplete) {
      navigate('/profile');
      return;
    }
    if (alreadyApplied) {
      setError('You have already applied to this campaign.');
      return;
    }

    const result = applyToCampaign(campaign.id, message.trim());
    if (!result.success) {
      setError(result.error ?? 'Failed to apply.');
      return;
    }
    setSuccess(true);
    setShowApplyModal(false);
  };

  const openApplyModal = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    if (!isProfileComplete) {
      navigate('/profile');
      return;
    }
    setError('');
    setShowApplyModal(true);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 animate-fade-in">
      <button
        onClick={() => navigate('/campaigns')}
        className="mb-6 flex items-center gap-2 text-sm font-medium text-ink-600 hover:text-sage-700"
      >
        <ArrowLeft size={18} />
        Back to Campaigns
      </button>

      {success && (
        <div className="mb-6">
          <Alert variant="success">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={16} />
                Application submitted! You'll be notified when the brand reviews it.
              </span>
              <button
                onClick={() => navigate('/my-applications')}
                className="font-semibold underline"
              >
                View My Applications
              </button>
            </div>
          </Alert>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Image */}
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-3xl shadow-md">
            <img
              src={campaign.productImage}
              alt={campaign.title}
              className="h-full w-full object-cover"
            />
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="flex items-center gap-2">
            <Badge variant={campaign.status}>
              {campaign.status === 'open' ? 'Open' : 'Closed'}
            </Badge>
            {alreadyApplied && <Badge variant="pending">Applied</Badge>}
          </div>
          <h1 className="mt-3 text-3xl font-bold text-ink-900">{campaign.title}</h1>
          <p className="mt-2 text-lg text-ink-600">{campaign.subtitle}</p>

          <div className="mt-6 flex flex-wrap gap-4">
            <div className="flex items-center gap-2 rounded-xl bg-sage-50 px-4 py-2.5">
              <Gift size={18} className="text-sage-600" />
              <div>
                <div className="text-xs text-ink-500">Reward</div>
                <div className="text-sm font-semibold text-sage-700">{campaign.rewardSummary}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-cream-100 px-4 py-2.5">
              <Calendar size={18} className="text-ink-600" />
              <div>
                <div className="text-xs text-ink-500">Deadline</div>
                <div className="text-sm font-semibold text-ink-800">
                  {new Date(campaign.deadline).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Action button */}
          <div className="mt-8">
            {isClosed && !alreadyApplied ? (
              <div className="rounded-2xl bg-gray-50 px-6 py-4 text-center text-ink-500">
                This campaign is closed and no longer accepting applications.
              </div>
            ) : alreadyApplied ? (
              <div className="rounded-2xl bg-sage-50 px-6 py-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={24} className="text-sage-600" />
                  <div>
                    <div className="font-semibold text-sage-800">You've applied to this campaign</div>
                    <div className="text-sm text-sage-600">Check your application status in My Applications.</div>
                  </div>
                </div>
                <button onClick={() => navigate('/my-applications')} className="btn-secondary mt-3">
                  View My Applications
                </button>
              </div>
            ) : !currentUser ? (
              <div>
                <Alert variant="info">
                  <span className="flex items-center gap-2">
                    <AlertTriangle size={16} />
                    Please log in and complete your profile to apply.
                  </span>
                </Alert>
                <div className="mt-3 flex gap-3">
                  <button onClick={() => navigate('/login')} className="btn-primary">
                    Login to Apply
                  </button>
                  <button onClick={() => navigate('/signup')} className="btn-secondary">
                    Sign Up
                  </button>
                </div>
              </div>
            ) : !isProfileComplete ? (
              <div>
                <Alert variant="warning">
                  <span className="flex items-center gap-2">
                    <AlertTriangle size={16} />
                    Please complete your profile before applying.
                  </span>
                </Alert>
                <button onClick={() => navigate('/profile')} className="btn-primary mt-3">
                  Complete Profile
                </button>
              </div>
            ) : (
              <button onClick={openApplyModal} className="btn-primary text-base px-8 py-3.5">
                <Send size={18} />
                Apply Now
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Details sections */}
      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div className="rounded-3xl border border-sage-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2.5">
            <Package size={20} className="text-sage-600" />
            <h2 className="text-lg font-semibold text-ink-900">Product Description</h2>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-ink-600">{campaign.description}</p>
          <p className="mt-3 text-sm leading-relaxed text-ink-600">{campaign.productDetails}</p>
        </div>

        <div className="rounded-3xl border border-sage-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2.5">
            <ListChecks size={20} className="text-sage-600" />
            <h2 className="text-lg font-semibold text-ink-900">Collaboration Requirements</h2>
          </div>
          <ul className="mt-3 space-y-2.5">
            {campaign.requirements.map((r, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-ink-600">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-sage-500" />
                {r}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-sage-100 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center gap-2.5">
            <Gift size={20} className="text-sage-600" />
            <h2 className="text-lg font-semibold text-ink-900">Creator Rewards</h2>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {campaign.rewards.map((r, i) => (
              <div key={i} className="flex items-start gap-2.5 rounded-xl bg-sage-50 px-4 py-3 text-sm text-ink-700">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sage-200 text-xs font-bold text-sage-700">
                  {i + 1}
                </span>
                {r}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <Modal open={showApplyModal} onClose={() => setShowApplyModal(false)} title="Apply to Campaign" maxWidth="max-w-xl">
        {error && (
          <div className="mb-4">
            <Alert variant="error">{error}</Alert>
          </div>
        )}
        <div className="mb-4 rounded-xl bg-sage-50 p-4">
          <p className="text-sm text-ink-700">
            You're applying to <span className="font-semibold">{campaign.title}</span> with the following profile:
          </p>
          <div className="mt-2 space-y-1 text-sm text-ink-600">
            <p><span className="font-medium">Name:</span> {profile?.firstName} {profile?.lastName}</p>
            <p><span className="font-medium">TikTok:</span> @{profile?.tiktokUsername}</p>
            <p><span className="font-medium">State:</span> {profile?.country}</p>
          </div>
        </div>
        <div>
          <label className="label-field" htmlFor="message">
            Application message <span className="text-ink-400">(optional)</span>
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="input-field resize-none"
            placeholder="Tell the brand why you'd be a great fit for this campaign..."
          />
        </div>
        <div className="mt-6 flex items-center justify-end gap-3">
          <button onClick={() => setShowApplyModal(false)} className="btn-ghost">
            Cancel
          </button>
          <button onClick={handleApply} className="btn-primary">
            <Send size={18} />
            Submit Application
          </button>
        </div>
      </Modal>
    </div>
  );
}
