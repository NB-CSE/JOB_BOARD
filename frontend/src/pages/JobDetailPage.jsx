import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  MapPin,
  Briefcase,
  IndianRupee,
  Clock,
  Bookmark,
  Share2,
  Building2,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
  ArrowLeft,
  Sparkles,
  Check,
} from 'lucide-react';
import DemoBadge from '../components/DemoBadge';
import ApplicationModal from '../components/ApplicationModal';
import { jobService, userService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const JobDetailPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isCandidate } = useAuth();

  const [job, setJob] = useState(null);
  const [similarJobs, setSimilarJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Save state
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  // Application Modal state
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const fetchJobDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await jobService.getJobById(id);
        if (res.data.success) {
          setJob(res.data.job);
          setSimilarJobs(res.data.similarJobs || []);
        }
      } catch (err) {
        console.error('Failed to load job details:', err);
        setError('Job posting not found or has been removed by the employer.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetail();

    // Auto-open application modal if ?apply=true
    if (searchParams.get('apply') === 'true') {
      setIsApplyModalOpen(true);
    }
  }, [id, searchParams]);

  // Check saved state for candidate
  useEffect(() => {
    const checkSaved = async () => {
      if (user && isCandidate && id) {
        try {
          const res = await userService.getSavedJobs();
          if (res.data.success) {
            const savedList = res.data.savedJobs || [];
            const found = savedList.some((s) => (s._id || s) === id);
            setIsSaved(found);
          }
        } catch {
          // ignore
        }
      }
    };
    checkSaved();
  }, [user, isCandidate, id]);

  const handleToggleSave = async () => {
    if (!user) {
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }
    if (!isCandidate) {
      alert('Only candidate accounts can bookmark jobs.');
      return;
    }

    setSaving(true);
    try {
      if (isSaved) {
        await userService.unsaveJob(id);
        setIsSaved(false);
      } else {
        await userService.saveJob(id);
        setIsSaved(true);
      }
    } catch (err) {
      console.error('Save job toggle error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F7F2] py-16">
        <div className="max-w-5xl mx-auto px-4 animate-pulse space-y-6">
          <div className="h-6 w-32 bg-zinc-200 rounded"></div>
          <div className="h-44 bg-white rounded-3xl border border-zinc-200"></div>
          <div className="h-96 bg-white rounded-3xl border border-zinc-200"></div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-[#F7F7F2] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl border border-zinc-200 p-8 max-w-md text-center space-y-4 shadow-xl">
          <h2 className="text-xl font-bold text-[#242424]">Job Not Found</h2>
          <p className="text-sm text-zinc-500">{error || 'This job does not exist.'}</p>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#242424] text-[#C5F36A] font-bold text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Job Listings</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F2] py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          to="/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-600 hover:text-black mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to all jobs</span>
        </Link>

        {/* Top Header Card */}
        <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 sm:p-8 shadow-xs mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
            <div className="flex items-start gap-5">
              {/* Company Logo / Placeholder */}
              <div className="w-16 h-16 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center overflow-hidden shrink-0 font-extrabold text-2xl text-zinc-800">
                {job.companyLogo ? (
                  <img
                    src={job.companyLogo}
                    alt={job.company}
                    className="w-full h-full object-cover"
                    onError={(e) => (e.target.style.display = 'none')}
                  />
                ) : (
                  job.company?.charAt(0) || 'C'
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="text-base font-bold text-zinc-700">{job.company}</span>
                  {job.isVerified && (
                    <span className="inline-flex items-center text-xs text-emerald-600 font-semibold gap-1">
                      <CheckCircle className="w-4 h-4 fill-emerald-100" />
                      Verified
                    </span>
                  )}
                  {job.isDemo && <DemoBadge size="sm" />}
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#242424] tracking-tight">
                  {job.title}
                </h1>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-sm text-zinc-500 mt-3 font-medium">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-zinc-400" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-zinc-400" />
                    <span>{job.experienceLevel}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-zinc-400" />
                    <span>Posted {new Date(job.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Right Actions */}
            <div className="flex items-center gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-zinc-100">
              <button
                onClick={handleShare}
                className="p-3 rounded-2xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-600 transition-colors"
                title="Share job link"
              >
                {copiedLink ? <Check className="w-5 h-5 text-emerald-600" /> : <Share2 className="w-5 h-5" />}
              </button>

              <button
                onClick={handleToggleSave}
                disabled={saving}
                className={`p-3 rounded-2xl border transition-all ${
                  isSaved
                    ? 'bg-amber-50 border-amber-300 text-amber-600'
                    : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                }`}
                title={isSaved ? 'Saved' : 'Save job'}
              >
                <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-amber-500' : ''}`} />
              </button>

              <button
                onClick={() => setIsApplyModalOpen(true)}
                className="bg-[#242424] hover:bg-black text-[#C5F36A] font-extrabold text-sm px-6 py-3 rounded-2xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                Apply for this Role
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-6 pt-6 border-t border-zinc-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-[#F7F7F2] p-3.5 rounded-2xl">
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                Salary (Annual)
              </span>
              <p className="text-base font-extrabold text-[#242424] mt-0.5">
                ₹{job.salary?.min} - ₹{job.salary?.max} {job.salary?.period || 'LPA'}
              </p>
            </div>

            <div className="bg-[#F7F7F2] p-3.5 rounded-2xl">
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                Workplace Mode
              </span>
              <p className="text-base font-extrabold text-[#242424] mt-0.5">
                {job.workplaceMode}
              </p>
            </div>

            <div className="bg-[#F7F7F2] p-3.5 rounded-2xl">
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                Employment Type
              </span>
              <p className="text-base font-extrabold text-[#242424] mt-0.5">
                {job.jobType}
              </p>
            </div>

            <div className="bg-[#F7F7F2] p-3.5 rounded-2xl">
              <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                Category
              </span>
              <p className="text-base font-extrabold text-[#242424] mt-0.5 truncate">
                {job.category}
              </p>
            </div>
          </div>
        </div>

        {/* Content Layout: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Job Description & Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description Card */}
            <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 sm:p-8 shadow-xs">
              <h2 className="text-lg font-bold text-[#242424] mb-4">About the Role</h2>
              <div className="prose prose-zinc max-w-none text-sm text-zinc-700 leading-relaxed whitespace-pre-line">
                {job.description}
              </div>

              {/* Responsibilities */}
              {job.responsibilities && job.responsibilities.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-base font-bold text-[#242424] mb-3">Key Responsibilities</h3>
                  <ul className="space-y-2.5">
                    {job.responsibilities.map((resp, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-700 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#242424] mt-2 shrink-0"></span>
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Qualifications */}
              {job.qualifications && job.qualifications.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-base font-bold text-[#242424] mb-3">
                    Required Skills & Qualifications
                  </h3>
                  <ul className="space-y-2.5">
                    {job.qualifications.map((qual, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-700 leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C5F36A] border border-zinc-400 mt-2 shrink-0"></span>
                        <span>{qual}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tech Stack & Skills Tags */}
              {job.skills && job.skills.length > 0 && (
                <div className="mt-8 pt-6 border-t border-zinc-100">
                  <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">
                    Technologies & Desired Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-zinc-100 text-zinc-800 border border-zinc-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Apply CTA Card */}
            <div className="bg-[#242424] rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
              <div>
                <h3 className="text-xl font-bold">Ready to apply for {job.title}?</h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Applications are reviewed directly by the {job.company} hiring team.
                </p>
              </div>
              <button
                onClick={() => setIsApplyModalOpen(true)}
                className="w-full sm:w-auto bg-[#C5F36A] hover:bg-[#b4e850] text-[#242424] font-extrabold text-sm px-7 py-3 rounded-2xl transition-all shadow-md shrink-0"
              >
                Apply Now
              </button>
            </div>
          </div>

          {/* Right Column: Company Snapshot & Similar Jobs */}
          <div className="space-y-6">
            {/* Market Intelligence Benchmark Card */}
            <div className="bg-[#242424] text-white rounded-3xl p-6 shadow-md space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#C5F36A] flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#C5F36A]" />
                  Market Intelligence
                </span>
                <span className="text-[10px] text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded-full font-medium">
                  {job.location} Hub
                </span>
              </div>

              <h4 className="text-base font-extrabold text-white">
                ₹{job.salary?.min} - ₹{job.salary?.max} LPA Benchmark
              </h4>

              <p className="text-xs text-zinc-300 leading-relaxed">
                This position offers {job.salary?.max >= 30 ? 'a top-tier compensation package exceeding the 80th percentile' : 'competitive compensation well-aligned with median industry standards'} for {job.experienceLevel} roles in {job.location}.
              </p>

              <div className="pt-2 border-t border-zinc-800 flex items-center justify-between">
                <span className="text-[11px] text-zinc-400">Want to explore all ladders?</span>
                <Link
                  to="/salary-guide"
                  className="text-xs font-bold text-[#C5F36A] hover:underline flex items-center gap-1"
                >
                  <span>Salary Index</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Company Overview Card */}
            <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-[#242424] pb-2 border-b border-zinc-100">
                Company Profile
              </h3>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center font-bold text-lg text-zinc-700">
                  {job.company?.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#242424]">{job.company}</h4>
                  <p className="text-xs text-zinc-500">
                    {job.employerId?.profile?.industry || 'Technology & Software'}
                  </p>
                </div>
              </div>

              <p className="text-xs text-zinc-600 leading-relaxed">
                {job.employerId?.profile?.companyDescription ||
                  'Pioneering modern tech solutions and hiring top talent across Indian technology hubs.'}
              </p>

              <div className="space-y-2 text-xs text-zinc-600 pt-2 border-t border-zinc-100">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Headquarters</span>
                  <span className="font-semibold">{job.employerId?.profile?.headquarters || job.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Company Size</span>
                  <span className="font-semibold">{job.employerId?.profile?.companySize || '50-500'}</span>
                </div>
              </div>

              {job.companyWebsite && (
                <a
                  href={job.companyWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-semibold py-2 px-3 rounded-xl border border-zinc-200 text-zinc-700 hover:bg-zinc-50 transition-colors mt-2"
                >
                  <span>Visit Company Website</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            {/* Similar Jobs Recommendations */}
            {similarJobs.length > 0 && (
              <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-xs">
                <h3 className="text-base font-bold text-[#242424] mb-4">Similar Opportunities</h3>
                <div className="space-y-3">
                  {similarJobs.map((sim) => (
                    <Link
                      key={sim._id}
                      to={`/jobs/${sim._id}`}
                      className="block p-3 rounded-2xl hover:bg-zinc-50 border border-zinc-100 transition-colors group"
                    >
                      <h4 className="text-xs font-bold text-[#242424] group-hover:text-black line-clamp-1">
                        {sim.title}
                      </h4>
                      <p className="text-[11px] text-zinc-500 mt-0.5">{sim.company}</p>
                      <div className="flex items-center justify-between text-[11px] text-zinc-500 mt-2 font-medium">
                        <span>{sim.location}</span>
                        <span className="font-bold text-[#242424]">₹{sim.salary?.min} - ₹{sim.salary?.max} LPA</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Application Modal */}
      <ApplicationModal
        job={job}
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onSuccess={() => {}}
      />
    </div>
  );
};

export default JobDetailPage;
