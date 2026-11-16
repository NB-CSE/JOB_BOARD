const SavedJob = require('../models/SavedJob');
const User = require('../models/User');
const Job = require('../models/Job');
const store = require('../config/inMemoryStore');
const { getDbStatus } = require('../config/db');

// @desc    Save a job
// @route   POST /api/users/saved-jobs/:jobId
// @access  Private (Candidate)
const saveJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    if (getDbStatus()) {
      const job = await Job.findById(jobId);
      if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

      const existing = await SavedJob.findOne({ candidateId: req.user._id, jobId });
      if (existing) {
        return res.status(400).json({ success: false, message: 'Job already saved' });
      }

      const saved = await SavedJob.create({ candidateId: req.user._id, jobId });
      return res.status(201).json({ success: true, message: 'Job saved', saved });
    } else {
      const job = store.findJobById(jobId);
      if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

      const saved = store.saveJob(req.user._id, jobId);
      if (!saved) {
        return res.status(400).json({ success: false, message: 'Job already saved' });
      }
      return res.status(201).json({ success: true, message: 'Job saved', saved });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Unsave a job
// @route   DELETE /api/users/saved-jobs/:jobId
// @access  Private (Candidate)
const unsaveJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    if (getDbStatus()) {
      await SavedJob.findOneAndDelete({ candidateId: req.user._id, jobId });
      return res.status(200).json({ success: true, message: 'Job removed from saved' });
    } else {
      store.unsaveJob(req.user._id, jobId);
      return res.status(200).json({ success: true, message: 'Job removed from saved' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get candidate's saved jobs
// @route   GET /api/users/saved-jobs
// @access  Private (Candidate)
const getSavedJobs = async (req, res, next) => {
  try {
    if (getDbStatus()) {
      const saved = await SavedJob.find({ candidateId: req.user._id })
        .populate({
          path: 'jobId',
          select: 'title company location salary workplaceMode jobType status isVerified isDemo createdAt',
        })
        .sort({ createdAt: -1 });

      const jobs = saved.map((s) => s.jobId).filter(Boolean);
      return res.status(200).json({ success: true, count: jobs.length, savedJobs: jobs });
    } else {
      const jobs = store.getSavedJobsForCandidate(req.user._id);
      return res.status(200).json({ success: true, count: jobs.length, savedJobs: jobs });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get list of companies with active jobs
// @route   GET /api/users/companies
// @access  Public
const getCompanies = async (req, res, next) => {
  try {
    if (getDbStatus()) {
      const employers = await User.find({ role: 'employer' }).select('name profile createdAt').lean();

      const companies = await Promise.all(
        employers.map(async (emp) => {
          const jobCount = await Job.countDocuments({ employerId: emp._id, status: 'active' });
          return {
            id: emp._id,
            name: emp.profile?.companyName || emp.name,
            logo: emp.profile?.companyLogo || '',
            website: emp.profile?.companyWebsite || '',
            description: emp.profile?.companyDescription || 'Innovating technology and hiring top talent across India.',
            location: emp.profile?.headquarters || emp.profile?.location || 'Bengaluru, India',
            size: emp.profile?.companySize || '50-500 employees',
            industry: emp.profile?.industry || 'Technology',
            openRolesCount: jobCount,
          };
        })
      );
      return res.status(200).json({ success: true, count: companies.length, companies });
    } else {
      const employers = store.users.filter((u) => u.role === 'employer');
      const companies = employers.map((emp) => {
        const jobCount = store.jobs.filter(
          (j) => j.employerId.toString() === emp._id.toString() && j.status === 'active'
        ).length;
        return {
          id: emp._id,
          name: emp.profile?.companyName || emp.name,
          logo: emp.profile?.companyLogo || '',
          website: emp.profile?.companyWebsite || '',
          description: emp.profile?.companyDescription || 'Innovating technology and hiring top talent across India.',
          location: emp.profile?.headquarters || emp.profile?.location || 'Bengaluru, India',
          size: emp.profile?.companySize || '50-500 employees',
          industry: emp.profile?.industry || 'Technology',
          openRolesCount: jobCount,
        };
      });
      return res.status(200).json({ success: true, count: companies.length, companies });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  saveJob,
  unsaveJob,
  getSavedJobs,
  getCompanies,
};
