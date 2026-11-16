import React, { useState } from 'react';
import {
  X,
  Upload,
  FileCheck,
  Send,
  AlertCircle,
  CheckCircle2,
  Lock,
  Building,
  Briefcase,
} from 'lucide-react';
import { applicationService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ApplicationModal = ({ job, isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    candidateName: user?.name || '',
    candidateEmail: user?.email || '',
    candidatePhone: user?.profile?.phone || '',
    coverLetter: '',
    portfolioUrl: user?.profile?.portfolioUrl || '',
    useSavedResume: !!user?.profile?.defaultResumePath,
  });

  const [resumeFile, setResumeFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen || !job) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Resume file size exceeds the 5MB limit. Please upload a smaller file.');
        return;
      }
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const ext = file.name.split('.').pop().toLowerCase();
      if (!allowedTypes.includes(file.type) && !['pdf', 'doc', 'docx'].includes(ext)) {
        setError('Invalid file type. Please upload a PDF, DOC, or DOCX resume.');
        return;
      }
      setError('');
      setResumeFile(file);
      setFormData((prev) => ({ ...prev, useSavedResume: false }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.candidateName.trim() || !formData.candidateEmail.trim()) {
      setError('Please provide your name and email address.');
      return;
    }

    if (!formData.useSavedResume && !resumeFile) {
      setError('Please attach your resume file (PDF, DOC, DOCX) to apply.');
      return;
    }

    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('candidateName', formData.candidateName);
      data.append('candidateEmail', formData.candidateEmail);
      data.append('candidatePhone', formData.candidatePhone);
      data.append('coverLetter', formData.coverLetter);
      data.append('portfolioUrl', formData.portfolioUrl);
      data.append('useSavedResume', formData.useSavedResume);

      if (resumeFile) {
        data.append('resume', resumeFile);
      }

      const res = await applicationService.applyForJob(job._id, data);
      if (res.data.success) {
        setSuccess(true);
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      console.error('Application submission error:', err);
      setError(
        err.response?.data?.message || 'Failed to submit application. Please check fields and try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-5 bg-[#242424] text-white flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-[#C5F36A]">
              Job Application
            </span>
            <h3 className="text-lg font-bold text-white line-clamp-1">{job.title}</h3>
            <p className="text-xs text-zinc-300">
              {job.company} • {job.location}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {success ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h4 className="text-2xl font-bold text-[#242424]">Application Submitted!</h4>
              <p className="text-sm text-zinc-600 max-w-md mx-auto">
                Your application for <strong>{job.title}</strong> at <strong>{job.company}</strong> has been received. A confirmation email has been dispatched to <strong>{formData.candidateEmail}</strong>.
              </p>
              <div className="pt-4">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-[#242424] text-[#C5F36A] font-bold text-sm hover:bg-black transition-colors"
                >
                  Close & View Dashboard
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                  <span>{error}</span>
                </div>
              )}

              {/* Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.candidateName}
                    onChange={(e) =>
                      setFormData({ ...formData, candidateName: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-[#242424] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.candidateEmail}
                    onChange={(e) =>
                      setFormData({ ...formData, candidateEmail: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-[#242424] focus:bg-white"
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
                    value={formData.candidatePhone}
                    onChange={(e) =>
                      setFormData({ ...formData, candidatePhone: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-[#242424] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Portfolio / LinkedIn URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formData.portfolioUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, portfolioUrl: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-[#242424] focus:bg-white"
                  />
                </div>
              </div>

              {/* Resume Selection */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  Resume (PDF, DOC, DOCX up to 5MB) *
                </label>

                {user?.profile?.defaultResumePath && (
                  <div className="mb-2 p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl flex items-center justify-between text-xs">
                    <label className="flex items-center gap-2 cursor-pointer font-medium text-zinc-700">
                      <input
                        type="checkbox"
                        checked={formData.useSavedResume}
                        onChange={(e) =>
                          setFormData({ ...formData, useSavedResume: e.target.checked })
                        }
                        className="rounded border-zinc-300 text-zinc-900 focus:ring-0"
                      />
                      <span>Use saved resume: <strong>{user.profile.defaultResumeName || 'Profile Resume'}</strong></span>
                    </label>
                  </div>
                )}

                {(!formData.useSavedResume || !user?.profile?.defaultResumePath) && (
                  <div className="border-2 border-dashed border-zinc-300 hover:border-zinc-400 rounded-2xl p-4 text-center bg-zinc-50/50 hover:bg-zinc-50 transition-colors">
                    <input
                      type="file"
                      id="resume-upload"
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label htmlFor="resume-upload" className="cursor-pointer block">
                      {resumeFile ? (
                        <div className="flex items-center justify-center gap-2 text-emerald-700 font-semibold text-xs">
                          <FileCheck className="w-5 h-5 text-emerald-600" />
                          <span>{resumeFile.name} ({(resumeFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <Upload className="w-6 h-6 text-zinc-400 mx-auto" />
                          <p className="text-xs font-semibold text-[#242424]">
                            Click to upload resume document
                          </p>
                          <p className="text-[11px] text-zinc-400">PDF, DOC, or DOCX (max 5MB)</p>
                        </div>
                      )}
                    </label>
                  </div>
                )}
              </div>

              {/* Cover Letter */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                  Cover Letter / Note to Recruiter (Optional)
                </label>
                <textarea
                  rows="3"
                  placeholder="Introduce yourself and explain why you're a great fit for this role..."
                  value={formData.coverLetter}
                  onChange={(e) =>
                    setFormData({ ...formData, coverLetter: e.target.value })
                  }
                  className="w-full px-3 py-2 text-sm bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:border-[#242424] focus:bg-white"
                ></textarea>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:text-zinc-900 rounded-xl hover:bg-zinc-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 bg-[#242424] hover:bg-black text-[#C5F36A] font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-xs disabled:opacity-50"
                >
                  {submitting ? (
                    <span>Submitting Application...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Application</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationModal;
