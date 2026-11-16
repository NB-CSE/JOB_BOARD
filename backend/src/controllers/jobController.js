const Job = require('../models/Job');
const Application = require('../models/Application');
const store = require('../config/inMemoryStore');
const { getDbStatus } = require('../config/db');

// @desc    Get all jobs with search, filtering, sorting, pagination
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res, next) => {
  try {
    const {
      keyword,
      location,
      category,
      experienceLevel,
      workplaceMode,
      jobType,
      minSalary,
      maxSalary,
      sort = 'newest',
      page = 1,
      limit = 10,
      featured,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));

    if (getDbStatus()) {
      const query = { status: 'active' };

      if (keyword && keyword.trim()) {
        const searchRegex = new RegExp(keyword.trim(), 'i');
        query.$or = [
          { title: searchRegex },
          { company: searchRegex },
          { skills: { $in: [searchRegex] } },
          { description: searchRegex },
        ];
      }

      if (location && location.trim() && location !== 'All Locations') {
        query.location = new RegExp(location.trim(), 'i');
      }

      if (category && category.trim() && category !== 'All Categories') {
        query.category = category.trim();
      }

      if (experienceLevel && experienceLevel !== 'All Levels') {
        query.experienceLevel = experienceLevel;
      }

      if (workplaceMode && workplaceMode !== 'All Modes') {
        query.workplaceMode = workplaceMode;
      }

      if (jobType && jobType !== 'All Types') {
        query.jobType = jobType;
      }

      if (minSalary) {
        query['salary.max'] = { $gte: Number(minSalary) };
      }
      if (maxSalary) {
        query['salary.min'] = { $lte: Number(maxSalary) };
      }

      if (featured === 'true') {
        query.isFeatured = true;
      }

      let sortOptions = { createdAt: -1 };
      if (sort === 'oldest') {
        sortOptions = { createdAt: 1 };
      } else if (sort === 'salary-high') {
        sortOptions = { 'salary.max': -1 };
      } else if (sort === 'salary-low') {
        sortOptions = { 'salary.min': 1 };
      }

      const skip = (pageNum - 1) * limitNum;
      const total = await Job.countDocuments(query);
      const jobs = await Job.find(query)
        .populate('employerId', 'name email profile.companyName profile.companyLogo profile.companyWebsite')
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum);

      const totalPages = Math.ceil(total / limitNum) || 1;

      return res.status(200).json({
        success: true,
        count: jobs.length,
        total,
        page: pageNum,
        totalPages,
        hasMore: pageNum < totalPages,
        jobs,
      });
    } else {
      // In-Memory Mode
      const allFiltered = store.findJobs({
        keyword,
        location,
        category,
        workplaceMode,
        experienceLevel,
        minSalary,
        maxSalary,
        sort,
        featured,
      });

      const total = allFiltered.length;
      const totalPages = Math.ceil(total / limitNum) || 1;
      const skip = (pageNum - 1) * limitNum;
      const paginatedJobs = allFiltered.slice(skip, skip + limitNum);

      return res.status(200).json({
        success: true,
        count: paginatedJobs.length,
        total,
        page: pageNum,
        totalPages,
        hasMore: pageNum < totalPages,
        jobs: paginatedJobs,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured jobs for homepage
// @route   GET /api/jobs/featured
// @access  Public
const getFeaturedJobs = async (req, res, next) => {
  try {
    if (getDbStatus()) {
      const jobs = await Job.find({ status: 'active', isFeatured: true })
        .populate('employerId', 'name profile.companyName profile.companyLogo')
        .sort({ createdAt: -1 })
        .limit(6);

      return res.status(200).json({ success: true, jobs });
    } else {
      const jobs = store.findJobs({ featured: true }).slice(0, 6);
      return res.status(200).json({ success: true, jobs });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get job categories with counts
// @route   GET /api/jobs/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    if (getDbStatus()) {
      const categories = await Job.aggregate([
        { $match: { status: 'active' } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]);
      return res.status(200).json({ success: true, categories });
    } else {
      const counts = {};
      store.jobs
        .filter((j) => j.status === 'active')
        .forEach((j) => {
          counts[j.category] = (counts[j.category] || 0) + 1;
        });
      const categories = Object.entries(counts).map(([_id, count]) => ({ _id, count }));
      return res.status(200).json({ success: true, categories });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res, next) => {
  try {
    if (getDbStatus()) {
      const job = await Job.findById(req.params.id).populate(
        'employerId',
        'name email profile.companyName profile.companyWebsite profile.companyDescription profile.companyLogo profile.headquarters profile.companySize profile.industry'
      );

      if (!job) {
        return res.status(404).json({ success: false, message: 'Job not found' });
      }

      const similarJobs = await Job.find({
        _id: { $ne: job._id },
        status: 'active',
        $or: [{ category: job.category }, { skills: { $in: job.skills || [] } }],
      })
        .limit(4)
        .select('title company location salary workplaceMode jobType isVerified isDemo createdAt');

      return res.status(200).json({ success: true, job, similarJobs });
    } else {
      const job = store.findJobById(req.params.id);
      if (!job) {
        return res.status(404).json({ success: false, message: 'Job not found' });
      }

      const similarJobs = store.jobs
        .filter((j) => j._id.toString() !== job._id.toString() && j.category === job.category)
        .slice(0, 4);

      return res.status(200).json({ success: true, job, similarJobs });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new job (Employer only)
// @route   POST /api/jobs
// @access  Private (Employer)
const createJob = async (req, res, next) => {
  try {
    const {
      title,
      company,
      companyWebsite,
      companyLogo,
      description,
      responsibilities,
      qualifications,
      skills,
      category,
      location,
      workplaceMode,
      jobType,
      experienceLevel,
      salary,
      isFeatured,
      isDemo,
    } = req.body;

    const parsedResponsibilities = Array.isArray(responsibilities)
      ? responsibilities
      : typeof responsibilities === 'string'
        ? responsibilities.split('\n').filter(Boolean)
        : [];

    const parsedQualifications = Array.isArray(qualifications)
      ? qualifications
      : typeof qualifications === 'string'
        ? qualifications.split('\n').filter(Boolean)
        : [];

    const parsedSkills = Array.isArray(skills)
      ? skills
      : typeof skills === 'string'
        ? skills.split(',').map((s) => s.trim()).filter(Boolean)
        : [];

    const jobData = {
      employerId: req.user._id,
      title,
      company: company || req.user.profile?.companyName || req.user.name,
      companyWebsite: companyWebsite || req.user.profile?.companyWebsite,
      companyLogo: companyLogo || req.user.profile?.companyLogo,
      description,
      responsibilities: parsedResponsibilities,
      qualifications: parsedQualifications,
      skills: parsedSkills,
      category: category || 'Software Development',
      location: location || 'Bengaluru, Karnataka',
      workplaceMode: workplaceMode || 'Hybrid',
      jobType: jobType || 'Full-time',
      experienceLevel: experienceLevel || 'Mid-level',
      salary: salary || { min: 6, max: 18, currency: 'INR', period: 'LPA' },
      isFeatured: !!isFeatured,
      isVerified: true,
      isDemo: !!isDemo,
    };

    if (getDbStatus()) {
      const job = await Job.create(jobData);
      return res.status(201).json({
        success: true,
        message: 'Job listing published successfully!',
        job,
      });
    } else {
      const job = store.createJob(jobData);
      return res.status(201).json({
        success: true,
        message: 'Job listing published successfully!',
        job,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update a job (Employer only - own job)
// @route   PUT /api/jobs/:id
// @access  Private (Employer)
const updateJob = async (req, res, next) => {
  try {
    if (getDbStatus()) {
      let job = await Job.findById(req.params.id);
      if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

      if (job.employerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized: You can only edit jobs posted by your account',
        });
      }

      Object.assign(job, req.body);
      await job.save();

      return res.status(200).json({ success: true, message: 'Job updated', job });
    } else {
      const job = store.findJobById(req.params.id);
      if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

      const employerIdStr = job.employerId?._id ? job.employerId._id.toString() : job.employerId.toString();
      if (employerIdStr !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized: You can only edit jobs posted by your account',
        });
      }

      const updated = store.updateJob(req.params.id, req.body);
      return res.status(200).json({ success: true, message: 'Job updated', job: updated });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a job (Employer only - own job)
// @route   DELETE /api/jobs/:id
// @access  Private (Employer)
const deleteJob = async (req, res, next) => {
  try {
    if (getDbStatus()) {
      const job = await Job.findById(req.params.id);
      if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

      if (job.employerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized: You can only delete jobs posted by your account',
        });
      }

      await Application.deleteMany({ jobId: job._id });
      await job.deleteOne();

      return res.status(200).json({
        success: true,
        message: 'Job listing and related applications removed successfully',
      });
    } else {
      const job = store.findJobById(req.params.id);
      if (!job) return res.status(404).json({ success: false, message: 'Job not found' });

      const employerIdStr = job.employerId?._id ? job.employerId._id.toString() : job.employerId.toString();
      if (employerIdStr !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized: You can only delete jobs posted by your account',
        });
      }

      store.deleteJob(req.params.id);
      return res.status(200).json({
        success: true,
        message: 'Job listing and related applications removed successfully',
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get jobs posted by the logged-in employer
// @route   GET /api/jobs/employer/my-jobs
// @access  Private (Employer)
const getEmployerJobs = async (req, res, next) => {
  try {
    if (getDbStatus()) {
      const jobs = await Job.find({ employerId: req.user._id }).sort({ createdAt: -1 });

      const jobsWithCounts = await Promise.all(
        jobs.map(async (job) => {
          const count = await Application.countDocuments({ jobId: job._id });
          const jobObj = job.toObject();
          jobObj.applicantCount = count;
          return jobObj;
        })
      );

      return res.status(200).json({
        success: true,
        count: jobsWithCounts.length,
        jobs: jobsWithCounts,
      });
    } else {
      const jobs = store.findJobs({ employerId: req.user._id });
      return res.status(200).json({
        success: true,
        count: jobs.length,
        jobs,
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getJobs,
  getFeaturedJobs,
  getCategories,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getEmployerJobs,
};
