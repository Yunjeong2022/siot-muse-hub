import { Calendar, Clock, CheckCircle2, XCircle, FileText, ArrowRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useRouter } from '@/context/RouterContext';
import { Badge } from '@/components/ui/Badge';
import { Alert } from '@/components/ui/Alert';
import type { Application } from '@/types';

export function MyApplicationsPage() {
  const { currentUser, getApplicationsForUser, getCampaign } = useApp();
  const { navigate } = useRouter();

  if (!currentUser) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center animate-fade-in">
        <Alert variant="warning">Please log in to view your applications.</Alert>
        <button onClick={() => navigate('/login')} className="btn-primary mt-4">
          Go to Login
        </button>
      </div>
    );
  }

  if (currentUser.role === 'admin') {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center animate-fade-in">
        <Alert variant="info">Admins can view all applications in the dashboard.</Alert>
        <button onClick={() => navigate('/admin/applications')} className="btn-primary mt-4">
          Go to Admin Applications
        </button>
      </div>
    );
  }

  const apps = getApplicationsForUser(currentUser.id);

  const statusConfig = {
    pending: { icon: Clock, variant: 'pending' as const, label: 'Pending' },
    approved: { icon: CheckCircle2, variant: 'approved' as const, label: 'Approved' },
    rejected: { icon: XCircle, variant: 'rejected' as const, label: 'Rejected' },
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-ink-900">My Applications</h1>
        <p className="mt-2 text-ink-600">Track the status of your campaign applications.</p>
      </div>

      {apps.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-sage-200 py-20 text-center">
          <FileText size={48} className="text-sage-300" />
          <h3 className="mt-4 text-lg font-semibold text-ink-800">No applications yet</h3>
          <p className="mt-2 text-sm text-ink-600">Browse campaigns and apply to start collaborating.</p>
          <button onClick={() => navigate('/campaigns')} className="btn-primary mt-5">
            Browse Campaigns
            <ArrowRight size={18} />
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {apps.map((app: Application) => {
            const campaign = getCampaign(app.campaignId);
            const cfg = statusConfig[app.status];
            const StatusIcon = cfg.icon;
            return (
              <div
                key={app.id}
                className="flex flex-col gap-4 rounded-3xl border border-sage-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-center"
              >
                {campaign && (
                  <div
                    className="h-20 w-full shrink-0 cursor-pointer overflow-hidden rounded-2xl sm:h-20 sm:w-20"
                    onClick={() => navigate(`/campaigns/${campaign.id}`)}
                  >
                    <img src={campaign.productImage} alt={campaign.title} className="h-full w-full object-cover" />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {campaign && (
                      <button
                        onClick={() => navigate(`/campaigns/${campaign.id}`)}
                        className="text-lg font-semibold text-ink-900 hover:text-sage-700"
                      >
                        {campaign.title}
                      </button>
                    )}
                    <Badge variant={cfg.variant}>
                      <StatusIcon size={13} />
                      {cfg.label}
                    </Badge>
                  </div>
                  {app.message && (
                    <p className="mt-1.5 text-sm text-ink-600 line-clamp-2">"{app.message}"</p>
                  )}
                  <div className="mt-2 flex items-center gap-4 text-xs text-ink-500">
                    <span className="flex items-center gap-1">
                      <Calendar size={13} />
                      Applied: {new Date(app.appliedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    {app.reviewedAt && (
                      <span className="flex items-center gap-1">
                        <Clock size={13} />
                        Reviewed: {new Date(app.reviewedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                  </div>
                </div>
                {app.status === 'approved' && (
                  <div className="rounded-xl bg-green-50 px-4 py-2.5 text-sm font-medium text-green-700">
                    Congratulations! Check your email for next steps.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
