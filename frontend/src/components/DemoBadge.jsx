import React from 'react';
import { AlertCircle } from 'lucide-react';

const DemoBadge = ({ size = 'sm', className = '' }) => {
  return (
    <span
      title="Demo listing for preview and evaluation only. Not a live recruitment vacancy."
      className={`inline-flex items-center gap-1 font-medium bg-amber-50 text-amber-800 border border-amber-200/80 rounded-full px-2.5 py-0.5 ${
        size === 'sm' ? 'text-xs' : 'text-sm'
      } ${className}`}
    >
      <AlertCircle className="w-3 h-3 text-amber-600 shrink-0" />
      <span>Demo Data</span>
    </span>
  );
};

export default DemoBadge;
