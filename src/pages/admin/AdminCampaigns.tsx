import { useState } from 'react';
import {
  Plus,
  Pencil,
  Lock,
  Unlock,
  Calendar,
  Gift,
  X,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useRouter } from '@/context/RouterContext';
import { AdminLayout } from './AdminLayout';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Alert } from '@/components/ui/Alert';
import type { Campaign, CampaignStatus } from '@/types';

interface FormState {
  title: string;
  subtitle: string;
  description: string;
  productImage: string;
  productDetails: string;
  requirements: string;
  rewards: string;
  rewardSummary: string;
  deadline: string;
  status: CampaignStatus;
}

const EMPTY_FORM: FormState = {
  title: '',
  subtitle: '',
  description: '',
  productImage: '',
  productDetails: '',
  requirements: '',
  rewards: '',
  rewardSummary: '',
  deadline: '',
  status: 'open',
};

export function AdminCampaigns() {
  const { campaigns, applications, createCampaign, updateCampaign, toggleCampaignStatus } = useApp();
  const { navigate } = useRouter();

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setErrors({});
    setShowModal(true);
  };

  const openEdit = (c: Campaign) => {
    setForm({
      title: c.title,
      subtitle: c.subtitle,
      description: c.description,
      productImage: c.productImage,
      productDetails: c.productDetails,
      requirements: c.requirements.join('\n'),
      rewards: c.rewards.join('\n'),
      rewardSummary: c.rewardSummary,
      deadline: c.deadline,
      status: c.status,
    });
    setEditingId(c.id);
    setErrors({});
    setShowModal(true);
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = 'Title is required.';
    if (!form.subtitle.trim()) e.subtitle = 'Subtitle is required.';
    if (!form.description.trim()) e.description = 'Description is required.';
    if (!form.productImage.trim()) e.productImage = 'Product image URL is required.';
    if (!form.rewardSummary.trim()) e.rewardSummary = 'Reward summary is required.';
    if (!form.deadline) e.deadline = 'Deadline is required.';
    if (!form.requirements.trim()) e.requirements = 'At least one requirement is needed.';
    if (!form.rewards.trim()) e.rewards = 'At least one reward is needed.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const data = {
      title: form.title.trim(),
      subtitle: form.subtitle.trim(),
      description: form.description.trim(),
      productImage: form.productImage.trim(),
      productDetails: form.productDetails.trim(),
      requirements: form.requirements.split('\n').map((s) => s.trim()).filter(Boolean),
      rewards: form.rewards.split('\n').map((s) => s.trim()).filter(Boolean),
      rewardSummary: form.rewardSummary.trim(),
      deadline: form.deadline,
      status: form.status,
    };
    if (editingId) {
      updateCampaign(editingId, data);
    } else {
      createCampaign(data);
    }
    setShowModal(false);
  };

  return (
    <AdminLayout active="campaigns">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Campaigns</h1>
          <p className="mt-1 text-sm text-ink-600">Create, edit, and manage collaboration campaigns.</p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <Plus size={18} />
          New Campaign
        </button>
      </div>

      <div className="space-y-4">
        {campaigns.map((c) => {
          const appCount = applications.filter((a) => a.campaignId === c.id).length;
          return (
            <div key={c.id} className="flex flex-col gap-4 rounded-3xl border border-sage-100 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
              <div className="h-24 w-full shrink-0 overflow-hidden rounded-2xl sm:h-24 sm:w-24">
                <img src={c.productImage} alt={c.title} className="h-full w-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3
                    className="cursor-pointer text-lg font-semibold text-ink-900 hover:text-sage-700"
                    onClick={() => navigate(`/campaigns/${c.id}`)}
                  >
                    {c.title}
                  </h3>
                  <Badge variant={c.status}>
                    {c.status === 'open' ? 'Open' : 'Closed'}
                  </Badge>
                </div>
                <p className="mt-0.5 text-sm text-ink-500">{c.subtitle}</p>
                <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-ink-500">
                  <span className="flex items-center gap-1">
                    <Gift size={13} />
                    {c.rewardSummary}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={13} />
                    {new Date(c.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span>{appCount} application{appCount !== 1 ? 's' : ''}</span>
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <button onClick={() => openEdit(c)} className="btn-secondary px-4 py-2">
                  <Pencil size={16} />
                  Edit
                </button>
                <button
                  onClick={() => toggleCampaignStatus(c.id)}
                  className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all active:scale-95 ${
                    c.status === 'open'
                      ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      : 'bg-sage-100 text-sage-700 hover:bg-sage-200'
                  }`}
                  title={c.status === 'open' ? 'Close campaign' : 'Open campaign'}
                >
                  {c.status === 'open' ? <Lock size={16} /> : <Unlock size={16} />}
                  {c.status === 'open' ? 'Close' : 'Open'}
                </button>
              </div>
            </div>
          );
        })}
        {campaigns.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-sage-200 py-16 text-center">
            <AlertCircle size={40} className="text-sage-300" />
            <p className="mt-4 text-ink-600">No campaigns yet. Create one to get started.</p>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editingId ? 'Edit Campaign' : 'Create Campaign'}
        maxWidth="max-w-2xl"
      >
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label-field">Title *</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="input-field"
                placeholder="SIOT Rice Jam Mask"
              />
              {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
            </div>
            <div>
              <label className="label-field">Subtitle *</label>
              <input
                type="text"
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                className="input-field"
                placeholder="Overnight hydration & glass-skin glow"
              />
              {errors.subtitle && <p className="mt-1 text-xs text-red-500">{errors.subtitle}</p>}
            </div>
          </div>

          <div>
            <label className="label-field">Description *</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="input-field resize-none"
              placeholder="Describe the campaign and what you're looking for..."
            />
            {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
          </div>

          <div>
            <label className="label-field">Product Image URL *</label>
            <input
              type="url"
              value={form.productImage}
              onChange={(e) => setForm({ ...form, productImage: e.target.value })}
              className="input-field"
              placeholder="https://images.pexels.com/..."
            />
            {errors.productImage && <p className="mt-1 text-xs text-red-500">{errors.productImage}</p>}
          </div>

          <div>
            <label className="label-field">Product Details</label>
            <textarea
              value={form.productDetails}
              onChange={(e) => setForm({ ...form, productDetails: e.target.value })}
              rows={2}
              className="input-field resize-none"
              placeholder="Size, ingredients, key features..."
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label-field">Reward Summary *</label>
              <input
                type="text"
                value={form.rewardSummary}
                onChange={(e) => setForm({ ...form, rewardSummary: e.target.value })}
                className="input-field"
                placeholder="Free product + 20% affiliate code"
              />
              {errors.rewardSummary && <p className="mt-1 text-xs text-red-500">{errors.rewardSummary}</p>}
            </div>
            <div>
              <label className="label-field">Deadline *</label>
              <input
                type="date"
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                className="input-field"
              />
              {errors.deadline && <p className="mt-1 text-xs text-red-500">{errors.deadline}</p>}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label-field">
                Requirements * <span className="text-ink-400">(one per line)</span>
              </label>
              <textarea
                value={form.requirements}
                onChange={(e) => setForm({ ...form, requirements: e.target.value })}
                rows={4}
                className="input-field resize-none"
                placeholder="Must be US-based with an active TikTok account&#10;Minimum 5,000 TikTok followers&#10;..."
              />
              {errors.requirements && <p className="mt-1 text-xs text-red-500">{errors.requirements}</p>}
            </div>
            <div>
              <label className="label-field">
                Rewards * <span className="text-ink-400">(one per line)</span>
              </label>
              <textarea
                value={form.rewards}
                onChange={(e) => setForm({ ...form, rewards: e.target.value })}
                rows={4}
                className="input-field resize-none"
                placeholder="Free full-size product (value $38)&#10;Exclusive 20% affiliate code&#10;..."
              />
              {errors.rewards && <p className="mt-1 text-xs text-red-500">{errors.rewards}</p>}
            </div>
          </div>

          <div>
            <label className="label-field">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as CampaignStatus })}
              className="input-field cursor-pointer"
            >
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-sage-100 pt-4">
            <button onClick={() => setShowModal(false)} className="btn-ghost">
              <X size={16} />
              Cancel
            </button>
            <button onClick={handleSave} className="btn-primary">
              {editingId ? 'Save Changes' : 'Create Campaign'}
            </button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
}
