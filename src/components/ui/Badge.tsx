import type { ReactNode } from 'react';

interface BadgeProps {
  variant?:
    | 'open'
    | 'closed'
    | 'pending'
    | 'approved'
    | 'rejected'
    | 'default'
    | 'shipped'
    | 'delivered'
    | 'returned'
    | 'revision'
    | 'gold'
    | 'vip'
    | 'standard';
  children: ReactNode;
}

const styles: Record<NonNullable<BadgeProps['variant']>, string> = {
  open: 'bg-olive-100 text-olive-700',
  closed: 'bg-gray-100 text-gray-500',
  pending: 'bg-amber-100 text-amber-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-600',
  default: 'bg-ivory-200 text-olive-600',
  shipped: 'bg-blue-100 text-blue-700',
  delivered: 'bg-green-100 text-green-700',
  returned: 'bg-red-100 text-red-600',
  revision: 'bg-amber-100 text-amber-700',
  gold: 'bg-amber-100 text-amber-700',
  vip: 'bg-purple-100 text-purple-700',
  standard: 'bg-olive-100 text-olive-700',
};

export function Badge({ variant = 'default', children }: BadgeProps) {
  return <span className={`badge ${styles[variant]}`}>{children}</span>;
}
