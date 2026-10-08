import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react';
import type { ReactNode } from 'react';

interface AlertProps {
  variant?: 'error' | 'success' | 'info' | 'warning';
  children: ReactNode;
}

const config = {
  error: { icon: XCircle, class: 'bg-red-50 text-red-700 border-red-200' },
  success: { icon: CheckCircle2, class: 'bg-green-50 text-green-700 border-green-200' },
  info: { icon: Info, class: 'bg-olive-50 text-olive-700 border-olive-200' },
  warning: { icon: AlertCircle, class: 'bg-amber-50 text-amber-700 border-amber-200' },
};

export function Alert({ variant = 'info', children }: AlertProps) {
  const { icon: Icon, class: cls } = config[variant];
  return (
    <div className={`flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm ${cls}`}>
      <Icon size={18} className="mt-0.5 shrink-0" />
      <div className="flex-1">{children}</div>
    </div>
  );
}
