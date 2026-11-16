import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Briefcase,
  Users,
  PlusCircle,
  Building2,
  Trash2,
  Edit,
  Eye,
  FileText,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  MapPin,
  IndianRupee,
  Clock,
  Sparkles,
} from 'lucide-react';
import StatusBadge from '../components/StatusBadge';
import DemoBadge from '../components/DemoBadge';
import { jobService, applicationService, authService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const EmployerDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'jobs';

  const { user, updateUser } = useAuth();

  // Tab 1: My Jobs
  const [myJobs, setMyJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);

  // Tab 2: Post / Edit Job Form
  const [editingJobId, setEditingJobId] = useState(null);
  const [jobFormData, setJobFormData] = useState({
    title: '',
    company: user?.profile?.companyName || user?.name || '',
    companyWebsite: user?.profile?.companyWebsite || '',
    category: 'Software Development',
    location: 'Bengaluru, Karnataka',
    workplaceMode: 'Hybrid',
    jobType: 'Full-time',
    experienceLevel: 'Mid-level',
    minSalary: 12,
    maxSalary: 24,
    description: '',
    responsibilities: '',
    qualifications: '',
    skills: '',
    isFeatured: false,
    isDemo: false,
  });
  const [submittingJob, setSubmittingJob] = useState(false);
  const [jobFormFeedback, setJobFormFeedback] = useState(null);

  // Tab 3: Applicants
  const [applicants, setApplicants] = useState([]);
  const [selectedJobFilter, setSelectedJobFilter] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All');
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);

  // Tab 4: Company Profile Form
  const [companyProfileData, setCompanyProfileData] = useState({
    companyName: user?.profile?.companyName || '',
    companyWebsite: user?.profile?.companyWebsite || '',
    companyDescription: user?.profile?.companyDescription || '',
    headquarters: user?.profile?.headquarters || 'Bengaluru, Karnataka',
    companySize: user?.profile?.companySize || '50-200',
    industry: user?.profile?.industry || 'Technology',
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileFeedback, setProfileFeedback] = useState(null);

  // Set tab helper
  const handleTabChange = (tabName) => {
    setSearchParams({ tab: tabName });
    setJobFormFeedback(null);
  };

  // Load Employer Jobs
  const loadMyJobs = async () => {
    setLoadingJobs(true);
    try {
      const res = await jobService.getEmployerJobs();
      if (res.data.success) {
        setMyJobs(res.data.jobs || []);
      }
    } catch (err) {
      console.error('Failed to load employer jobs:', err);
    } finally {
      setLoadingJobs(false);
    }
  };

  // Load Applicants
  const loadApplicants = async () => {
    setLoadingApplicants(true);
    try {
      const params = {};
      if (selectedJobFilter) params.jobId = selectedJobFilter;
      if (selectedStatusFilter && selectedStatusFilter !== 'All') {
        params.status = selectedStatusFilter;
      }
      const res = await applicationService.getEmployerApplicants(params);
      if (res.data.success) {
        setApplicants(res.data.applications || []);
      }
    } catch (err) {
      console.error('Failed to load applicants:', err);
    } finally {
      setLoadingApplicants(false);
    }
  };

  useEffect(() => {
    loadMyJobs();
  }, []);

  useEffect(() => {
    if (activeTab === 'applicants') {
      loadApplicants();
    }
  }, [activeTab, selectedJobFilter, selectedStatusFilter]);

  // Handle Delete Job
  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job and all associated applications?')) {
      return;
    }
    try {
      const res = await jobService.deleteJob(jobId);
      if (res.data.success) {
        setMyJobs((prev) => prev.filter((j) => j._id !== jobId));
      }
    } catch (err) {
      alert('Failed to delete job: ' + (err.response?.data?.message || err.message));
    }
  };

  // Start Editing Job
  const handleEditJobClick = (job) => {
    setEditingJobId(job._id);
    setJobFormData({
      title: job.title || '',
      company: job.company || '',
      companyWebsite: job.companyWebsite || '',
      category: job.category || 'Software Development',
      location: job.location || 'Bengaluru, Karnataka',
      workplaceMode: job.workplaceMode || 'Hybrid',
      jobType: job.jobType || 'Full-time',
      experienceLevel: job.experienceLevel || 'Mid-level',
      minSalary: job.salary?.min || 12,
      maxSalary: job.salary?.max || 24,
      description: job.description || '',
      responsibilities: Array.isArray(job.responsibilities) ? job.responsibilities.join('\n') : '',
      qualifications: Array.isArray(job.qualifications) ? job.qualifications.join('\n') : '',
      skills: Array.isArray(job.skills) ? job.skills.join(', ') : '',
      isFeatured: !!job.isFeatured,
      isDemo: !!job.isDemo,
    });
    handleTabChange('post');
  };

  // Handle Job Form Submit (Create or Update)
  const handleJobSubmit = async (e) => {
    e.preventDefault();
    setSubmittingJob(true);
    setJobFormFeedback(null);

    const payload = {
      title: jobFormData.title,
      company: jobFormData.company,
      companyWebsite: jobFormData.companyWebsite,
      category: jobFormData.category,
      location: jobFormData.location,
      workplaceMode: jobFormData.workplaceMode,
      jobType: jobFormData.jobType,
      experienceLevel: jobFormData.experienceLevel,
      salary: {
        min: Number(jobFormData.minSalary),
        max: Number(jobFormData.maxSalary),
        currency: 'INR',
        period: 'LPA',
      },
      description: jobFormData.description,
      responsibilities: jobFormData.responsibilities.split('\n').filter(Boolean),
      qualifications: jobFormData.qualifications.split('\n').filter(Boolean),
      skills: jobFormData.skills.split(',').map((s) => s.trim()).filter(Boolean),
      isFeatured: jobFormData.isFeatured,
      isDemo: jobFormData.isDemo,
    };

    try {
      if (editingJobId) {
        const res = await jobService.updateJob(editingJobId, payload);
        if (res.data.success) {
          setJobFormFeedback({ type: 'success', message: 'Job listing updated successfully!' });
          loadMyJobs();
        }
      } else {
        const res = await jobService.createJob(payload);
        if (res.data.success) {
          setJobFormFeedback({ type: 'success', message: 'Job listing published live successfully!' });
          // Reset form
          setJobFormData({
            title: '',
            company: user?.profile?.companyName || user?.name || '',
            companyWebsite: user?.profile?.companyWebsite || '',
            category: 'Software Development',
            location: 'Bengaluru, Karnataka',
            workplaceMode: 'Hybrid',
            jobType: 'Full-time',
            experienceLevel: 'Mid-level',
            minSalary: 12,
            maxSalary: 24,
            description: '',
            responsibilities: '',
            qualifications: '',
            skills: '',
            isFeatured: false,
            isDemo: false,
          });
          loadMyJobs();
        }
      }
    } catch (err) {
      setJobFormFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Failed to save job listing. Please check required fields.',
      });
    } finally {
      setSubmittingJob(false);
    }
  };

  // Handle Application Status Update
  const handleUpdateStatus = async (appId, newStatus) => {
    setStatusUpdatingId(appId);
    try {
      const res = await applicationService.updateApplicationStatus(appId, {
        status: newStatus,
        notes: `Status updated by hiring manager to ${newStatus}`,
      });
      if (res.data.success) {
        setApplicants((prev) =>
          prev.map((app) => (app._id === appId ? res.data.application : app))
        );
      }
    } catch (err) {
      alert('Failed to update status: ' + (err.response?.data?.message || err.message));
    } finally {
      setStatusUpdatingId(null);
    }
  };

  // Handle Company Profile Save
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileFeedback(null);

    try {
      const res = await authService.updateProfile({ profile: companyProfileData });
      if (res.data.success) {
        updateUser(res.data.user);
        setProfileFeedback({ type: 'success', message: 'Company profile details saved!' });
      }
    } catch (err) {
      setProfileFeedback({
        type: 'error',
        message: err.response?.data?.message || 'Failed to update company profile.',
      });
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F2] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 sm:p-8 shadow-xs mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 mb-2">
              <Building2 className="w-3.5 h-3.5" />
              <span>Employer Hiring Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#242424] tracking-tight">
              {user?.profile?.companyName || user?.name} Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1">
              Manage your company postings, review applicants, and deliver status updates.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setEditingJobId(null);
                handleTabChange('post');
              }}
              className="inline-flex items-center gap-1.5 bg-[#C5F36A] hover:bg-[#b5e754] text-[#242424] font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-all shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post New Role</span>
            </button>
          </div>
        </div>

        {/* Dashboard Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 border-b border-zinc-200">
          <button
            onClick={() => handleTabChange('jobs')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'jobs'
                ? 'bg-[#242424] text-[#C5F36A] shadow-xs'
                : 'bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-50'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>My Job Postings ({myJobs.length})</span>
          </button>

          <button
            onClick={() => handleTabChange('applicants')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'applicants'
                ? 'bg-[#242424] text-[#C5F36A] shadow-xs'
                : 'bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-50'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Applicant Review</span>
          </button>

          <button
            onClick={() => handleTabChange('post')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'post'
                ? 'bg-[#242424] text-[#C5F36A] shadow-xs'
                : 'bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-50'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>{editingJobId ? 'Edit Job Posting' : 'Post New Job'}</span>
          </button>

          <button
            onClick={() => handleTabChange('profile')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'profile'
                ? 'bg-[#242424] text-[#C5F36A] shadow-xs'
                : 'bg-white text-zinc-700 border border-zinc-200 hover:bg-zinc-50'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Company Profile</span>
          </button>
        </div>

        {/* TAB 1: MY JOBS LIST */}
        {activeTab === 'jobs' && (
          <div className="space-y-4">
            {loadingJobs ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-zinc-200">
                <p className="text-zinc-500 text-sm">Loading your postings...</p>
              </div>
            ) : myJobs.length === 0 ? (
              <div className="bg-white rounded-3xl border border-zinc-200 p-12 text-center max-w-lg mx-auto space-y-4">
                <Briefcase className="w-12 h-12 text-zinc-300 mx-auto" />
                <h3 className="text-lg font-bold text-[#242424]">No job listings published yet</h3>
                <p className="text-xs text-zinc-500">
                  Publish your first open position to start attracting talent across India.
                </p>
                <button
                  onClick={() => handleTabChange('post')}
                  className="px-5 py-2.5 rounded-xl bg-[#242424] text-[#C5F36A] font-bold text-xs"
                >
                  Create First Job
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {myJobs.map((job) => (
                  <div
                    key={job._id}
                    className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-bold text-base text-[#242424]">{job.title}</span>
                        {job.isDemo && <DemoBadge size="sm" />}
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {job.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-zinc-500 flex-wrap">
                        <span>{job.location}</span>
                        <span>•</span>
                        <span>{job.workplaceMode}</span>
                        <span>•</span>
                        <span>₹{job.salary?.min} - ₹{job.salary?.max} LPA</span>
                        <span>•</span>
                        <span className="font-bold text-[#242424] bg-zinc-100 px-2 py-0.5 rounded-md">
                          {job.applicantCount || 0} Applicants
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setSelectedJobFilter(job._id);
                          handleTabChange('applicants');
                        }}
                        className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 transition-colors flex items-center gap-1"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>View Applicants ({job.applicantCount || 0})</span>
                      </button>

                      <Link
                        to={`/jobs/${job._id}`}
                        target="_blank"
                        className="p-2 rounded-xl border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                        title="View Public Page"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>

                      <button
                        onClick={() => handleEditJobClick(job)}
                        className="p-2 rounded-xl border border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                        title="Edit Job"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteJob(job._id)}
                        className="p-2 rounded-xl border border-zinc-200 text-rose-600 hover:bg-rose-50"
                        title="Delete Job"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: POST / EDIT JOB FORM */}
        {activeTab === 'post' && (
          <div className="bg-white rounded-3xl border border-zinc-200/90 p-6 sm:p-8 shadow-xs max-w-3xl mx-auto">
            <h2 className="text-xl font-bold text-[#242424] mb-2">
              {editingJobId ? 'Edit Job Posting' : 'Publish a New Job Opening'}
            </h2>
            <p className="text-xs text-zinc-500 mb-6">
              Fill out all role specifications. Indian tech candidates value clear salary ranges in LPA and workplace modes.
            </p>

            {jobFormFeedback && (
              <div
                className={`p-4 rounded-2xl mb-6 text-xs flex items-start gap-2.5 ${
                  jobFormFeedback.type === 'success'
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                    : 'bg-rose-50 text-rose-900 border border-rose-200'
                }`}
              >
                {jobFormFeedback.type === 'success' ? (
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>{jobFormFeedback.message}</span>
              </div>
            )}

            <form onSubmit={handleJobSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Backend Engineer (Node.js)"
                    value={jobFormData.title}
                    onChange={(e) => setJobFormData({ ...jobFormData, title: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-[#242424] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={jobFormData.company}
                    onChange={(e) => setJobFormData({ ...jobFormData, company: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-[#242424] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <select
                    value={jobFormData.category}
                    onChange={(e) => setJobFormData({ ...jobFormData, category: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-[#242424] focus:bg-white"
                  >
                    <option value="Software Development">Software Development</option>
                    <option value="Data & AI">Data & AI</option>
                    <option value="Design">Design</option>
                    <option value="DevOps & Cloud">DevOps & Cloud</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Business">Business</option>
                    <option value="Product & Management">Product & Management</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Workplace Mode *
                  </label>
                  <select
                    value={jobFormData.workplaceMode}
                    onChange={(e) => setJobFormData({ ...jobFormData, workplaceMode: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-[#242424] focus:bg-white"
                  >
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="On-site">On-site</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Experience Level *
                  </label>
                  <select
                    value={jobFormData.experienceLevel}
                    onChange={(e) => setJobFormData({ ...jobFormData, experienceLevel: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-[#242424] focus:bg-white"
                  >
                    <option value="Entry-level">Entry-level</option>
                    <option value="Mid-level">Mid-level</option>
                    <option value="Senior-level">Senior-level</option>
                    <option value="Lead / Principal">Lead / Principal</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Location (India) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bengaluru, Karnataka"
                    value={jobFormData.location}
                    onChange={(e) => setJobFormData({ ...jobFormData, location: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-[#242424] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Min Salary (LPA ₹)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="150"
                    value={jobFormData.minSalary}
                    onChange={(e) => setJobFormData({ ...jobFormData, minSalary: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-[#242424] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Max Salary (LPA ₹)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="150"
                    value={jobFormData.maxSalary}
                    onChange={(e) => setJobFormData({ ...jobFormData, maxSalary: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-[#242424] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  Required Skills (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="React, Node.js, TypeScript, AWS, Docker"
                  value={jobFormData.skills}
                  onChange={(e) => setJobFormData({ ...jobFormData, skills: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-[#242424] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  Role Overview & Description *
                </label>
                <textarea
                  rows="4"
                  required
                  placeholder="Provide an overview of the role, team, and company mission..."
                  value={jobFormData.description}
                  onChange={(e) => setJobFormData({ ...jobFormData, description: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-[#242424] focus:bg-white"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  Key Responsibilities (one per line)
                </label>
                <textarea
                  rows="3"
                  placeholder="Lead architectural design of microservices&#10;Optimize database queries and API response times&#10;Mentor engineers..."
                  value={jobFormData.responsibilities}
                  onChange={(e) =>
                    setJobFormData({ ...jobFormData, responsibilities: e.target.value })
                  }
                  className="w-full px-3.5 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-[#242424] focus:bg-white"
                ></textarea>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  Qualifications & Requirements (one per line)
                </label>
                <textarea
                  rows="3"
                  placeholder="3-6 years of experience in production web systems&#10;Proficiency in Node.js and TypeScript..."
                  value={jobFormData.qualifications}
                  onChange={(e) =>
                    setJobFormData({ ...jobFormData, qualifications: e.target.value })
                  }
                  className="w-full px-3.5 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-[#242424] focus:bg-white"
                ></textarea>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-zinc-700">
                  <input
                    type="checkbox"
                    checked={jobFormData.isFeatured}
                    onChange={(e) =>
                      setJobFormData({ ...jobFormData, isFeatured: e.target.checked })
                    }
                    className="rounded border-zinc-300 text-zinc-900 focus:ring-0"
                  />
                  <span>Mark as Featured Job</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-zinc-700">
                  <input
                    type="checkbox"
                    checked={jobFormData.isDemo}
                    onChange={(e) =>
                      setJobFormData({ ...jobFormData, isDemo: e.target.checked })
                    }
                    className="rounded border-zinc-300 text-zinc-900 focus:ring-0"
                  />
                  <span>Label as Demo Listing</span>
                </label>
              </div>

              <div className="pt-4 border-t border-zinc-100 flex items-center justify-end gap-3">
                {editingJobId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingJobId(null);
                      handleTabChange('jobs');
                    }}
                    className="px-4 py-2 text-xs font-bold text-zinc-600 hover:text-black rounded-xl hover:bg-zinc-100"
                  >
                    Cancel Edit
                  </button>
                )}
                <button
                  type="submit"
                  disabled={submittingJob}
                  className="px-6 py-2.5 rounded-xl bg-[#242424] hover:bg-black text-[#C5F36A] font-extrabold text-xs shadow-md disabled:opacity-50"
                >
                  {submittingJob ? 'Saving Job...' : editingJobId ? 'Save Changes' : 'Publish Job Listing'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: APPLICANT REVIEW */}
        {activeTab === 'applicants' && (
          <div className="space-y-6">
            {/* Filters bar */}
            <div className="bg-white rounded-2xl border border-zinc-200 p-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3 flex-wrap">
                <div>
                  <span className="text-xs font-bold text-zinc-500 mr-2">Filter by Job:</span>
                  <select
                    value={selectedJobFilter}
                    onChange={(e) => setSelectedJobFilter(e.target.value)}
                    className="text-xs font-semibold bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1.5 focus:outline-none"
                  >
                    <option value="">All Posted Jobs</option>
                    {myJobs.map((j) => (
                      <option key={j._id} value={j._id}>
                        {j.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <span className="text-xs font-bold text-zinc-500 mr-2">Status:</span>
                  <select
                    value={selectedStatusFilter}
                    onChange={(e) => setSelectedStatusFilter(e.target.value)}
                    className="text-xs font-semibold bg-zinc-50 border border-zinc-200 rounded-lg px-2.5 py-1.5 focus:outline-none"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Submitted">Submitted</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Interviewing">Interviewing</option>
                    <option value="Offered">Offered</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <span className="text-xs text-zinc-500">
                Found <strong>{applicants.length}</strong> applicants
              </span>
            </div>

            {loadingApplicants ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-zinc-200">
                <p className="text-zinc-500 text-sm">Loading applicants...</p>
              </div>
            ) : applicants.length === 0 ? (
              <div className="bg-white rounded-3xl border border-zinc-200 p-12 text-center max-w-lg mx-auto space-y-3">
                <Users className="w-12 h-12 text-zinc-300 mx-auto" />
                <h3 className="text-lg font-bold text-[#242424]">No applications received yet</h3>
                <p className="text-xs text-zinc-500">
                  Applications submitted for your job postings will appear here in real-time.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {applicants.map((app) => (
                  <div
                    key={app._id}
                    className="bg-white rounded-2xl border border-zinc-200/90 p-6 shadow-xs space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-extrabold text-base text-[#242424]">
                            {app.candidateName}
                          </h3>
                          <StatusBadge status={app.status} size="sm" />
                        </div>

                        <p className="text-xs text-zinc-600">
                          Applied for: <strong className="text-black">{app.jobId?.title || 'Open Position'}</strong>
                        </p>
                        <p className="text-xs text-zinc-500 mt-0.5">
                          {app.candidateEmail} {app.candidatePhone ? `• ${app.candidatePhone}` : ''}
                        </p>
                      </div>

                      {/* Status changer dropdown */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-zinc-500">Change Status:</span>
                        <select
                          disabled={statusUpdatingId === app._id}
                          value={app.status}
                          onChange={(e) => handleUpdateStatus(app._id, e.target.value)}
                          className="text-xs font-bold bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-1.5 focus:outline-none focus:border-[#242424] cursor-pointer"
                        >
                          <option value="Submitted">Submitted</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Interviewing">Interviewing</option>
                          <option value="Offered">Offered</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>
                    </div>

                    {/* Cover Letter preview */}
                    {app.coverLetter && (
                      <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-700">
                        <strong className="text-zinc-900 block mb-1">Candidate Note / Cover Letter:</strong>
                        <p className="whitespace-pre-line leading-relaxed">{app.coverLetter}</p>
                      </div>
                    )}

                    {/* Resume Action & Links */}
                    <div className="pt-2 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-zinc-400" />
                        <span className="font-medium text-zinc-700">
                          {app.resumeOriginalName || 'Resume.pdf'}
                        </span>
                        {app.resumePath && (
                          <a
                            href={applicationService.getResumeUrl(app.resumePath)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 flex items-center gap-1"
                          >
                            <span>Download Resume</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>

                      <div className="text-[11px] text-zinc-400">
                        Submitted on {new Date(app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: COMPANY PROFILE */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl border border-zinc-200/90 p-6 sm:p-8 shadow-xs max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-[#242424] mb-2">Company Information</h2>
            <p className="text-xs text-zinc-500 mb-6">
              Details displayed to candidates on your job postings and company directory.
            </p>

            {profileFeedback && (
              <div
                className={`p-4 rounded-2xl mb-6 text-xs flex items-start gap-2.5 ${
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
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  required
                  value={companyProfileData.companyName}
                  onChange={(e) =>
                    setCompanyProfileData({ ...companyProfileData, companyName: e.target.value })
                  }
                  className="w-full px-3.5 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-[#242424] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  Website URL
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={companyProfileData.companyWebsite}
                  onChange={(e) =>
                    setCompanyProfileData({ ...companyProfileData, companyWebsite: e.target.value })
                  }
                  className="w-full px-3.5 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-[#242424] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Headquarters (City)
                  </label>
                  <input
                    type="text"
                    value={companyProfileData.headquarters}
                    onChange={(e) =>
                      setCompanyProfileData({ ...companyProfileData, headquarters: e.target.value })
                    }
                    className="w-full px-3.5 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-[#242424] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Company Size
                  </label>
                  <select
                    value={companyProfileData.companySize}
                    onChange={(e) =>
                      setCompanyProfileData({ ...companyProfileData, companySize: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-[#242424] focus:bg-white"
                  >
                    <option value="1-10">1-10 employees</option>
                    <option value="10-50">10-50 employees</option>
                    <option value="50-200">50-200 employees</option>
                    <option value="200-1000">200-1,000 employees</option>
                    <option value="1000+">1,000+ employees</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  About the Company
                </label>
                <textarea
                  rows="4"
                  placeholder="Describe your company culture, mission, and products..."
                  value={companyProfileData.companyDescription}
                  onChange={(e) =>
                    setCompanyProfileData({
                      ...companyProfileData,
                      companyDescription: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-[#242424] focus:bg-white"
                ></textarea>
              </div>

              <div className="pt-4 border-t border-zinc-100 flex justify-end">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="px-6 py-2.5 rounded-xl bg-[#242424] hover:bg-black text-[#C5F36A] font-extrabold text-xs shadow-md disabled:opacity-50"
                >
                  {savingProfile ? 'Saving...' : 'Update Company Profile'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerDashboard;
