import React from 'react';
import {
  Clock,
  Eye,
  Calendar,
  CheckCircle2,
  XCircle,
  MinusCircle,
} from 'lucide-react';

const statusConfig = {
  Submitted: {
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    border: 'border-amber-200',
    icon: Clock,
  },
  'Under Review': {
    bg: 'bg-blue-50',
    text: 'text-blue-800',
    border: 'border-blue-200',
    icon: Eye,
  },
  Interviewing: {
    bg: 'bg-purple-50',
    text: 'text-purple-800',
    border: 'border-purple-200',
    icon: Calendar,
  },
  Offered: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
    border: 'border-emerald-200',
    icon: CheckCircle2,
  },
  Rejected: {
    bg: 'bg-rose-50',
    text: 'text-rose-800',
    border: 'border-rose-200',
    icon: XCircle,
  },
  Withdrawn: {
    bg: 'bg-zinc-100',
    text: 'text-zinc-700',
    border: 'border-zinc-300',
    icon: MinusCircle,
  },
};

const StatusBadge = ({ status = 'Submitted', size = 'md', className = '' }) => {
  const config = statusConfig[status] || statusConfig.Submitted;
  const Icon = config.icon;

  const sizeClasses =
    size === 'sm'
      ? 'text-xs px-2 py-0.5 gap-1'
      : 'text-xs md:text-sm px-2.5 py-1 gap-1.5';

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClasses} ${className}`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span>{status}</span>
    </span>
  );
};

export default StatusBadge;
