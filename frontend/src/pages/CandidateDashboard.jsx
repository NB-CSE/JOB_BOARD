import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  FileText,
  Bookmark,
  User,
  Upload,
  CheckCircle,
  AlertCircle,
  Clock,
  Briefcase,
  MapPin,
  ExternalLink,
  Trash2,
  XCircle,
  Plus,
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import DemoBadge from '../components/DemoBadge';
import { applicationService, userService, authService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CandidateDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'applications';

  const { user, updateUser } = useAuth();

  // Tab 1: Applications
  const [applications, setApplications] = useState([]);
  const [loadingApps, setLoadingApps] = useState(false);
  const [withdrawingId, setWithdrawingId] = useState(null);

  // Tab 2: Saved Jobs
  const [savedJobs, setSavedJobs] = useState([]);
  const [loadingSaved, setLoadingSaved] = useState(false);

  // Tab 3: Profile Form
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    title: user?.profile?.title || '',
    bio: user?.profile?.bio || '',
    phone: user?.profile?.phone || '',
    location: user?.profile?.location || 'Bengaluru, Karnataka',
    skills: user?.profile?.skills ? user?.profile?.skills.join(', ') : '',
    linkedinUrl: user?.profile?.linkedinUrl || '',
    githubUrl: user?.profile?.githubUrl || '',
    portfolioUrl: user?.profile?.portfolioUrl || '',
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileFeedback, setProfileFeedback] = useState(null);

  // Resume upload state
  const [resumeUploading, setResumeUploading] = useState(false);
  const [resumeFeedback, setResumeFeedback] = useState(null);

  const handleTabChange = (tabName) => {
    setSearchParams({ tab: tabName });
    setProfileFeedback(null);
  };

  // Fetch Applications
  const loadApplications = async () => {
    setLoadingApps(true);
    try {
      const res = await applicationService.getMyApplications();
      if (res.data.success) {
        setApplications(res.data.applications || []);
      }
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setLoadingApps(false);
    }
  };

  // Fetch Saved Jobs
  const loadSavedJobs = async () => {
    setLoadingSaved(true);
    try {
      const res = await userService.getSavedJobs();
      if (res.data.success) {
        setSavedJobs(res.data.savedJobs || []);
      }
    } catch (err) {
      console.error('Error fetching saved jobs:', err);
    } finally {
      setLoadingSaved(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'applications') loadApplications();
    if (activeTab === 'saved') loadSavedJobs();
  }, [activeTab]);

  // Handle Withdraw Application
  const handleWithdraw = async (appId) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) {
      return;
    }
    setWithdrawingId(appId);
    try {
      const res = await applicationService.withdrawApplication(appId);
      if (res.data.success) {
        setApplications((prev) =>
          prev.map((app) => (app._id === appId ? res.data.application : app))
        );
      }
    } catch (err) {
      alert('Failed to withdraw application: ' + (err.response?.data?.message || err.message));
    } finally {
      setWithdrawingId(null);
    }
  };

  // Handle Unsave Job
  const handleUnsave = async (jobId) => {
    try {
      await userService.unsaveJob(jobId);
      setSavedJobs((prev) => prev.filter((j) => j._id !== jobId));
    } catch (err) {
      console.error('Failed to unsave job:', err);
    }
  };

  // Handle Resume Upload
  const handleResumeFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setResumeFeedback({ type: 'error', message: 'File exceeds 5MB limit.' });
      return;
    }

    setResumeUploading(true);
    setResumeFeedback(null);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await authService.uploadResume(formData);
      if (res.data.success) {
        updateUser(res.data.user);
        setResumeFeedback({
          type: 'success',
          message: `Resume "${file.name}" uploaded and set as default!`,
        });
      }
    } catch (err) {
      setResumeFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Resume upload failed.',
      });
    } finally {
      setResumeUploading(false);
    }
  };

  // Handle Profile Update
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileFeedback(null);

    const payload = {
      name: profileData.name,
      profile: {
        title: profileData.title,
        bio: profileData.bio,
        phone: profileData.phone,
        location: profileData.location,
        linkedinUrl: profileData.linkedinUrl,
        githubUrl: profileData.githubUrl,
        portfolioUrl: profileData.portfolioUrl,
        skills: profileData.skills
          ? profileData.skills.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
      },
    };

    try {
      const res = await authService.updateProfile(payload);
      if (res.data.success) {
        updateUser(res.data.user);
        setProfileFeedback({ type: 'success', message: 'Candidate profile updated successfully!' });
      }
    } catch (err) {
      setProfileFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Failed to update profile.',
      });
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F2] py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 sm:p-8 shadow-xs mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#242424] text-[#C5F36A] flex items-center justify-center font-extrabold text-2xl uppercase">
              {user?.name?.charAt(0) || 'C'}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#242424] tracking-tight">
                {user?.name}
              </h1>
              <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
                {user?.profile?.title || 'Job Seeker'} • {user?.profile?.location || 'India'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/jobs"
              className="bg-[#242424] text-[#C5F36A] font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-xl hover:bg-black transition-colors"
            >
              Browse Open Jobs
            </Link>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-zinc-200">
          <button
            onClick={() => handleTabChange('applications')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'applications'
                ? 'bg-[#242424] text-[#C5F36A] shadow-xs'
                : 'bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-50'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>My Applications ({applications.length})</span>
          </button>

          <button
            onClick={() => handleTabChange('saved')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'saved'
                ? 'bg-[#242424] text-[#C5F36A] shadow-xs'
                : 'bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-50'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Saved Jobs ({savedJobs.length})</span>
          </button>

          <button
            onClick={() => handleTabChange('profile')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'profile'
                ? 'bg-[#242424] text-[#C5F36A] shadow-xs'
                : 'bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-50'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile & Resume</span>
          </button>
        </div>

        {/* TAB 1: APPLICATIONS */}
        {activeTab === 'applications' && (
          <div className="space-y-4">
            {loadingApps ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-zinc-200">
                <p className="text-zinc-500 text-sm">Loading applications...</p>
              </div>
            ) : applications.length === 0 ? (
              <div className="bg-white rounded-3xl border border-zinc-200 p-12 text-center max-w-lg mx-auto space-y-4">
                <FileText className="w-12 h-12 text-zinc-300 mx-auto" />
                <h3 className="text-lg font-bold text-[#242424]">No applications submitted yet</h3>
                <p className="text-xs text-zinc-500">
                  You haven’t applied for any positions yet. Find your dream role from our curated listings!
                </p>
                <Link
                  to="/jobs"
                  className="inline-block px-5 py-2.5 rounded-xl bg-[#242424] text-[#C5F36A] font-bold text-xs"
                >
                  Discover Jobs
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((app) => (
                  <div
                    key={app._id}
                    className="bg-white rounded-2xl border border-zinc-200/90 p-6 shadow-xs space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <Link
                            to={`/jobs/${app.jobId?._id}`}
                            className="font-extrabold text-base text-[#242424] hover:underline"
                          >
                            {app.jobId?.title || 'Position'}
                          </Link>
                          {app.jobId?.isDemo && <DemoBadge size="sm" />}
                        </div>

                        <p className="text-xs text-zinc-600 font-semibold">
                          {app.jobId?.company} • {app.jobId?.location}
                        </p>
                        <p className="text-xs text-zinc-400 mt-1">
                          Applied on{' '}
                          {new Date(app.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <StatusBadge status={app.status} />

                        {app.status !== 'Withdrawn' && app.status !== 'Rejected' && (
                          <button
                            onClick={() => handleWithdraw(app._id)}
                            disabled={withdrawingId === app._id}
                            className="text-xs text-zinc-500 hover:text-rose-600 font-semibold px-2 py-1 rounded hover:bg-rose-50 transition-colors"
                          >
                            {withdrawingId === app._id ? 'Withdrawing...' : 'Withdraw'}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Status timeline / Notes if any */}
                    {app.statusHistory && app.statusHistory.length > 0 && (
                      <div className="pt-3 border-t border-zinc-100">
                        <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block mb-2">
                          Application Journey
                        </span>
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          {app.statusHistory.map((hist, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-200/80 px-2.5 py-1 rounded-lg text-zinc-700"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              <span className="font-semibold">{hist.status}</span>
                              <span className="text-zinc-400 text-[10px]">
                                ({new Date(hist.changedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })})
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SAVED JOBS */}
        {activeTab === 'saved' && (
          <div className="space-y-4">
            {loadingSaved ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-zinc-200">
                <p className="text-zinc-500 text-sm">Loading saved jobs...</p>
              </div>
            ) : savedJobs.length === 0 ? (
              <div className="bg-white rounded-3xl border border-zinc-200 p-12 text-center max-w-lg mx-auto space-y-3">
                <Bookmark className="w-12 h-12 text-zinc-300 mx-auto" />
                <h3 className="text-lg font-bold text-[#242424]">No saved jobs</h3>
                <p className="text-xs text-zinc-500">
                  Bookmark jobs you're interested in while browsing to quickly revisit and apply.
                </p>
                <Link
                  to="/jobs"
                  className="inline-block px-5 py-2.5 rounded-xl bg-[#242424] text-[#C5F36A] font-bold text-xs"
                >
                  Explore Jobs
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {savedJobs.map((job) => (
                  <div
                    key={job._id}
                    className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <span className="text-xs font-semibold text-zinc-500">{job.company}</span>
                          <Link
                            to={`/jobs/${job._id}`}
                            className="font-bold text-base text-[#242424] hover:underline block line-clamp-1"
                          >
                            {job.title}
                          </Link>
                        </div>
                        <button
                          onClick={() => handleUnsave(job._id)}
                          className="text-zinc-400 hover:text-rose-600 p-1"
                          title="Remove from saved"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-zinc-500 mb-4">
                        <span>{job.location}</span>
                        <span>•</span>
                        <span>₹{job.salary?.min} - ₹{job.salary?.max} LPA</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-zinc-100 flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        {job.workplaceMode}
                      </span>
                      <Link
                        to={`/jobs/${job._id}?apply=true`}
                        className="text-xs font-bold px-3 py-1.5 rounded-xl bg-[#242424] text-[#C5F36A] hover:bg-black transition-colors"
                      >
                        Apply Now
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PROFILE & RESUME */}
        {activeTab === 'profile' && (
          <div className="space-y-6 max-w-3xl mx-auto">
            {/* Resume Upload Card */}
            <div className="bg-white rounded-3xl border border-zinc-200/90 p-6 sm:p-8 shadow-xs">
              <h2 className="text-lg font-bold text-[#242424] mb-1">Default Resume</h2>
              <p className="text-xs text-zinc-500 mb-4">
                Upload your latest resume (PDF, DOC, DOCX up to 5MB). You can automatically attach this when applying to any job.
              </p>

              {resumeFeedback && (
                <div
                  className={`p-3.5 rounded-2xl mb-4 text-xs flex items-start gap-2.5 ${
                    resumeFeedback.type === 'success'
                      ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                      : 'bg-rose-50 text-rose-900 border border-rose-200'
                  }`}
                >
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{resumeFeedback.message}</span>
                </div>
              )}

              {user?.profile?.defaultResumePath ? (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-emerald-600 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-[#242424]">
                        {user.profile.defaultResumeName || 'Default_Resume.pdf'}
                      </p>
                      <p className="text-xs text-zinc-400">Attached to your candidate profile</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <a
                      href={applicationService.getResumeUrl(user.profile.defaultResumePath)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-zinc-700 bg-white border border-zinc-200 hover:bg-zinc-100 px-3 py-1.5 rounded-xl flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>View File</span>
                    </a>

                    <label className="text-xs font-bold bg-[#242424] text-[#C5F36A] px-3.5 py-1.5 rounded-xl cursor-pointer hover:bg-black transition-colors">
                      <span>{resumeUploading ? 'Uploading...' : 'Replace Resume'}</span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleResumeFileSelect}
                        disabled={resumeUploading}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-zinc-300 rounded-2xl p-6 text-center hover:bg-zinc-50 transition-colors">
                  <input
                    type="file"
                    id="profile-resume"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeFileSelect}
                    disabled={resumeUploading}
                    className="hidden"
                  />
                  <label htmlFor="profile-resume" className="cursor-pointer block space-y-2">
                    <Upload className="w-8 h-8 text-zinc-400 mx-auto" />
                    <p className="text-sm font-bold text-[#242424]">
                      {resumeUploading ? 'Uploading resume...' : 'Upload Default Resume'}
                    </p>
                    <p className="text-xs text-zinc-400">Supports PDF, DOC, DOCX up to 5MB</p>
                  </label>
                </div>
              )}
            </div>

            {/* Candidate Details Form Card */}
            <div className="bg-white rounded-3xl border border-zinc-200/90 p-6 sm:p-8 shadow-xs">
              <h2 className="text-lg font-bold text-[#242424] mb-1">Candidate Profile Information</h2>
              <p className="text-xs text-zinc-500 mb-6">
                Keep your details updated so recruiters can evaluate your background.
              </p>

              {profileFeedback && (
                <div
                  className={`p-3.5 rounded-2xl mb-6 text-xs flex items-start gap-2.5 ${
                    profileFeedback.type === 'success'
                      ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                      : 'bg-rose-50 text-rose-900 border border-rose-200'
                  }`}
                >
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{profileFeedback.message}</span>
                </div>
              )}

              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-[#242424] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                      Headline / Professional Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Senior Full Stack Developer"
                      value={profileData.title}
                      onChange={(e) => setProfileData({ ...profileData, title: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-[#242424] focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-[#242424] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                      Location (City, India)
                    </label>
                    <input
                      type="text"
                      value={profileData.location}
                      onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-[#242424] focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Skills (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="React, Node.js, TypeScript, PostgreSQL, AWS"
                    value={profileData.skills}
                    onChange={(e) => setProfileData({ ...profileData, skills: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-[#242424] focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                      LinkedIn URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://linkedin.com/in/..."
                      value={profileData.linkedinUrl}
                      onChange={(e) =>
                        setProfileData({ ...profileData, linkedinUrl: e.target.value })
                      }
                      className="w-full px-3.5 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-[#242424] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://github.com/..."
                      value={profileData.githubUrl}
                      onChange={(e) =>
                        setProfileData({ ...profileData, githubUrl: e.target.value })
                      }
                      className="w-full px-3.5 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-[#242424] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                      Portfolio Website
                    </label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={profileData.portfolioUrl}
                      onChange={(e) =>
                        setProfileData({ ...profileData, portfolioUrl: e.target.value })
                      }
                      className="w-full px-3.5 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-[#242424] focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Bio / Professional Summary
                  </label>
                  <textarea
                    rows="3"
                    placeholder="Briefly describe your career achievements, core specializations, and goals..."
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-[#242424] focus:bg-white"
                  ></textarea>
                </div>

                <div className="pt-4 border-t border-zinc-100 flex justify-end">
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="px-6 py-2.5 rounded-xl bg-[#242424] hover:bg-black text-[#C5F36A] font-extrabold text-xs shadow-md disabled:opacity-50"
                  >
                    {savingProfile ? 'Saving...' : 'Save Profile Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateDashboard;
