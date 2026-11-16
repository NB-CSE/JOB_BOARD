import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Briefcase,
  IndianRupee,
  Clock,
  Bookmark,
  Sparkles,
  Building,
  CheckCircle,
} from 'lucide-react';
import DemoBadge from './DemoBadge';
import { userService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const JobCard = ({ job, isSavedInitial = false, onSaveChange, onApplyClick }) => {
  const { user, isCandidate } = useAuth();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(isSavedInitial);
  const [saving, setSaving] = useState(false);

  const handleToggleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    if (!isCandidate) {
      alert('Only candidate accounts can save jobs.');
      return;
    }

    setSaving(true);
    try {
      if (isSaved) {
        await userService.unsaveJob(job._id);
        setIsSaved(false);
        if (onSaveChange) onSaveChange(job._id, false);
      } else {
        await userService.saveJob(job._id);
        setIsSaved(true);
        if (onSaveChange) onSaveChange(job._id, true);
      }
    } catch (err) {
      console.error('Failed to toggle save job:', err);
    } finally {
      setSaving(false);
    }
  };

  // Format posted date
  const formatTimeAgo = (dateStr) => {
    if (!dateStr) return 'Recently';
    const now = new Date();
    const posted = new Date(dateStr);
    const diffHours = Math.floor((now - posted) / (1000 * 60 * 60));
    if (diffHours < 24) {
      return diffHours <= 1 ? 'Just now' : `${diffHours}h ago`;
    }
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 30) return `${diffDays}d ago`;
    return `${Math.floor(diffDays / 30)}mo ago`;
  };

  const modeBadgeColors = {
    Remote: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Hybrid: 'bg-sky-50 text-sky-700 border-sky-200',
    'On-site': 'bg-zinc-100 text-zinc-700 border-zinc-200',
  };

  return (
    <div className="group bg-white rounded-2xl p-6 border border-zinc-200/80 hover:border-zinc-300 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 relative flex flex-col justify-between">
      {/* Top row */}
      <div>
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-start gap-3.5">
            {/* Company Logo or Initials */}
            <div className="w-12 h-12 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center overflow-hidden shrink-0 font-bold text-zinc-700 text-lg group-hover:scale-105 transition-transform">
              {job.companyLogo ? (
                <img
                  src={job.companyLogo}
                  alt={job.company}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                job.company?.charAt(0) || 'C'
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold text-zinc-600 hover:text-zinc-900 transition-colors">
                  {job.company}
                </span>
                {job.isVerified && (
                  <span className="inline-flex items-center text-xs text-emerald-600 font-medium" title="Verified Employer">
                    <CheckCircle className="w-3.5 h-3.5 fill-emerald-100" />
                  </span>
                )}
                {job.isDemo && <DemoBadge size="sm" />}
              </div>

              <Link
                to={`/jobs/${job._id}`}
                className="text-lg font-bold text-[#242424] hover:text-black line-clamp-1 mt-0.5 group-hover:underline decoration-zinc-400 underline-offset-4"
              >
                {job.title}
              </Link>
            </div>
          </div>

          {/* Save / Bookmark Button */}
          <button
            onClick={handleToggleSave}
            disabled={saving}
            className={`p-2 rounded-xl border transition-all ${
              isSaved
                ? 'bg-amber-50 border-amber-300 text-amber-600'
                : 'bg-zinc-50 border-zinc-200 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100'
            }`}
            title={isSaved ? 'Remove from saved' : 'Save job'}
            aria-label="Save job"
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-500' : ''}`} />
          </button>
        </div>

        {/* Highlights Row */}
        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs sm:text-sm text-zinc-600 mb-4">
          <div className="flex items-center gap-1 font-medium">
            <MapPin className="w-4 h-4 text-zinc-400" />
            <span>{job.location}</span>
          </div>

          <div className="flex items-center gap-1 font-bold text-[#242424]">
            <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
            <span>
              ₹{job.salary?.min} - ₹{job.salary?.max} {job.salary?.period || 'LPA'}
            </span>
          </div>

          <div className="flex items-center gap-1 font-medium">
            <Briefcase className="w-4 h-4 text-zinc-400" />
            <span>{job.experienceLevel || 'Mid-level'}</span>
          </div>
        </div>

        {/* Badges / Tags */}
        <div className="flex flex-wrap items-center gap-1.5 mb-4">
          <span
            className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
              modeBadgeColors[job.workplaceMode] || modeBadgeColors.Hybrid
            }`}
          >
            {job.workplaceMode}
          </span>

          <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-zinc-100 text-zinc-700 border border-zinc-200">
            {job.jobType}
          </span>

          {job.category && (
            <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-[#F7F7F2] text-zinc-700 border border-zinc-200/80">
              {job.category}
            </span>
          )}

          {job.isFeatured && (
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-[#C5F36A] text-[#242424] border border-[#b4e850] flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#242424]" />
              Featured
            </span>
          )}

          {job.salary?.max >= 30 ? (
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1" title="Compensation exceeds top industry percentiles for this level">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Top Tier Pay
            </span>
          ) : (
            <span className="text-[11px] font-semibold text-zinc-600 bg-zinc-100/80 border border-zinc-200 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
              Market Benchmark Verified
            </span>
          )}
        </div>

        {/* Skills preview */}
        {job.skills && job.skills.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-5">
            {job.skills.slice(0, 4).map((skill, index) => (
              <span
                key={index}
                className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-zinc-50 text-zinc-600 border border-zinc-200/60"
              >
                {skill}
              </span>
            ))}
            {job.skills.length > 4 && (
              <span className="text-[11px] font-medium text-zinc-400 px-1">
                +{job.skills.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Card Footer: Post time & Action buttons */}
      <div className="pt-4 border-t border-zinc-100 flex items-center justify-between gap-3 mt-auto">
        <div className="flex items-center gap-1 text-xs text-zinc-400">
          <Clock className="w-3.5 h-3.5" />
          <span>{formatTimeAgo(job.createdAt)}</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to={`/jobs/${job._id}`}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-[#242424] transition-colors"
          >
            Details
          </Link>
          <button
            onClick={() => onApplyClick ? onApplyClick(job) : navigate(`/jobs/${job._id}?apply=true`)}
            className="text-xs font-bold px-3.5 py-1.5 rounded-xl bg-[#242424] hover:bg-black text-[#C5F36A] transition-colors shadow-xs"
          >
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
