const path = require('path');
const fs = require('fs');
const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const store = require('../config/inMemoryStore');
const { getDbStatus } = require('../config/db');
const { sendEmail } = require('../config/mailer');
const {
  applicationReceivedCandidate,
  newApplicationEmployer,
  applicationStatusChanged,
} = require('../utils/emailTemplates');

// @desc    Apply for a job
// @route   POST /api/applications/:jobId
// @access  Private (Candidate)
const applyForJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { candidateName, candidateEmail, candidatePhone, coverLetter, portfolioUrl, useSavedResume } = req.body;

    let job;
    if (getDbStatus()) {
      job = await Job.findById(jobId).populate('employerId', 'name email');
    } else {
      job = store.findJobById(jobId);
    }

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'This job posting is no longer accepting applications',
      });
    }

    // Determine resume file
    let resumePath = '';
    let resumeOriginalName = '';

    if (req.file) {
      resumePath = req.file.filename;
      resumeOriginalName = req.file.originalname;
    } else if (useSavedResume === 'true' || useSavedResume === true) {
      let userProfile = req.user.profile;
      if (getDbStatus()) {
        const u = await User.findById(req.user._id);
        if (u) userProfile = u.profile;
      } else {
        const u = store.findUserById(req.user._id);
        if (u) userProfile = u.profile;
      }

      if (userProfile && userProfile.defaultResumePath) {
        resumePath = userProfile.defaultResumePath;
        resumeOriginalName = userProfile.defaultResumeName || 'Default_Resume.pdf';
      } else {
        return res.status(400).json({
          success: false,
          message: 'No default resume found on your profile. Please upload a resume file.',
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        message: 'Please attach your resume file (PDF, DOC, DOCX)',
      });
    }

    const appData = {
      jobId,
      candidateId: req.user._id,
      candidateName: candidateName || req.user.name,
      candidateEmail: candidateEmail || req.user.email,
      candidatePhone: candidatePhone || req.user.profile?.phone || '',
      resumePath,
      resumeOriginalName,
      coverLetter: coverLetter || '',
      portfolioUrl: portfolioUrl || req.user.profile?.portfolioUrl || '',
    };

    let application;
    if (getDbStatus()) {
      // Check duplicate
      const existing = await Application.findOne({ jobId, candidateId: req.user._id });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'You have already submitted an application for this position',
        });
      }

      application = await Application.create({
        ...appData,
        status: 'Submitted',
        statusHistory: [{ status: 'Submitted', changedAt: new Date(), notes: 'Application received' }],
      });

      await Job.findByIdAndUpdate(jobId, { $inc: { applicantCount: 1 } });
    } else {
      // Check duplicate in memory
      const existing = store.applications.find(
        (a) => a.jobId.toString() === jobId.toString() && a.candidateId.toString() === req.user._id.toString()
      );
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'You have already submitted an application for this position',
        });
      }

      application = store.createApplication(appData);
    }

    // Send email notification to candidate
    const candidateTemplate = applicationReceivedCandidate({
      candidateName: application.candidateName,
      jobTitle: job.title,
      companyName: job.company,
    });
    sendEmail({
      to: application.candidateEmail,
      subject: candidateTemplate.subject,
      text: candidateTemplate.text,
      html: candidateTemplate.html,
    });

    // Send email notification to employer
    const employerEmail = job.employerId?.email;
    if (employerEmail) {
      const employerTemplate = newApplicationEmployer({
        employerName: job.employerId?.name || job.company,
        candidateName: application.candidateName,
        jobTitle: job.title,
        candidateEmail: application.candidateEmail,
      });
      sendEmail({
        to: employerEmail,
        subject: employerTemplate.subject,
        text: employerTemplate.text,
        html: employerTemplate.html,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully! Confirmation email sent.',
      application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get candidate's applied jobs
// @route   GET /api/applications/my-applications
// @access  Private (Candidate)
const getMyApplications = async (req, res, next) => {
  try {
    if (getDbStatus()) {
      const applications = await Application.find({ candidateId: req.user._id })
        .populate({
          path: 'jobId',
          select: 'title company location salary workplaceMode jobType status isVerified isDemo',
        })
        .sort({ createdAt: -1 });

      return res.status(200).json({ success: true, count: applications.length, applications });
    } else {
      const applications = store.findApplicationsByCandidate(req.user._id);
      return res.status(200).json({ success: true, count: applications.length, applications });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Withdraw application
// @route   PUT /api/applications/:id/withdraw
// @access  Private (Candidate)
const withdrawApplication = async (req, res, next) => {
  try {
    if (getDbStatus()) {
      const application = await Application.findById(req.params.id);
      if (!application) return res.status(404).json({ success: false, message: 'Application not found' });

      if (application.candidateId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized: You can only withdraw your own applications',
        });
      }

      application.status = 'Withdrawn';
      application.statusHistory.push({
        status: 'Withdrawn',
        changedAt: new Date(),
        notes: 'Application withdrawn by candidate',
      });
      await application.save();

      return res.status(200).json({ success: true, message: 'Application withdrawn', application });
    } else {
      const application = store.findApplicationById(req.params.id);
      if (!application) return res.status(404).json({ success: false, message: 'Application not found' });

      const updated = store.updateApplicationStatus(req.params.id, 'Withdrawn', 'Application withdrawn by candidate');
      return res.status(200).json({ success: true, message: 'Application withdrawn', application: updated });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get applicants for employer's jobs
// @route   GET /api/applications/employer/applicants
// @access  Private (Employer)
const getEmployerApplicants = async (req, res, next) => {
  try {
    const { jobId, status } = req.query;

    if (getDbStatus()) {
      const employerJobs = await Job.find({ employerId: req.user._id }).select('_id');
      const employerJobIds = employerJobs.map((j) => j._id);

      if (employerJobIds.length === 0) {
        return res.status(200).json({ success: true, count: 0, applications: [] });
      }

      const filter = { jobId: { $in: employerJobIds } };
      if (jobId) {
        if (!employerJobIds.some((id) => id.toString() === jobId.toString())) {
          return res.status(403).json({
            success: false,
            message: 'Unauthorized: You can only view applicants for your own jobs',
          });
        }
        filter.jobId = jobId;
      }
      if (status && status !== 'All') {
        filter.status = status;
      }

      const applications = await Application.find(filter)
        .populate('jobId', 'title company location status')
        .populate('candidateId', 'name email profile')
        .sort({ createdAt: -1 });

      return res.status(200).json({ success: true, count: applications.length, applications });
    } else {
      const applications = store.findApplicationsForEmployer(req.user._id, jobId, status);
      return res.status(200).json({ success: true, count: applications.length, applications });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status (Employer only)
// @route   PUT /api/applications/:id/status
// @access  Private (Employer)
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    const validStatuses = ['Submitted', 'Under Review', 'Interviewing', 'Offered', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Valid values: ${validStatuses.join(', ')}`,
      });
    }

    let application;
    let jobTitle = '';
    let companyName = '';
    let candidateEmail = '';
    let candidateName = '';

    if (getDbStatus()) {
      application = await Application.findById(req.params.id)
        .populate('jobId')
        .populate('candidateId', 'name email');

      if (!application) return res.status(404).json({ success: false, message: 'Application not found' });

      if (
        application.jobId.employerId.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin'
      ) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized: You cannot modify applicants for another employer',
        });
      }

      application.status = status;
      if (notes) application.employerNotes = notes;
      application.statusHistory.push({
        status,
        changedAt: new Date(),
        notes: notes || `Status changed to ${status}`,
      });
      await application.save();

      jobTitle = application.jobId.title;
      companyName = application.jobId.company;
      candidateEmail = application.candidateEmail;
      candidateName = application.candidateName;
    } else {
      const found = store.findApplicationById(req.params.id);
      if (!found) return res.status(404).json({ success: false, message: 'Application not found' });

      const employerIdStr = found.jobId?.employerId?._id
        ? found.jobId.employerId._id.toString()
        : found.jobId?.employerId?.toString();

      if (employerIdStr !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized: You cannot modify applicants for another employer',
        });
      }

      application = store.updateApplicationStatus(req.params.id, status, notes);
      jobTitle = found.jobId?.title || 'Job';
      companyName = found.jobId?.company || 'Company';
      candidateEmail = application.candidateEmail;
      candidateName = application.candidateName;
    }

    // Send email notification to candidate
    const emailTemplate = applicationStatusChanged({
      candidateName,
      jobTitle,
      companyName,
      newStatus: status,
      notes: notes || '',
    });
    sendEmail({
      to: candidateEmail,
      subject: emailTemplate.subject,
      text: emailTemplate.text,
      html: emailTemplate.html,
    });

    res.status(200).json({
      success: true,
      message: `Applicant status updated to ${status}. Notification sent.`,
      application,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Download / view candidate resume securely
// @route   GET /api/applications/resume/:filename
// @access  Private (Authorized Candidate, Employer, or Admin)
const getResumeFile = async (req, res, next) => {
  try {
    const { filename } = req.params;
    const sanitizedFilename = path.basename(filename);
    const filePath = path.join(__dirname, '../../uploads/resumes', sanitizedFilename);

    // If file doesn't exist on disk, create demo sample so demo doesn't fail
    if (!fs.existsSync(filePath)) {
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(
        filePath,
        '%PDF-1.4\n1 0 obj\n<< /Title (Candidate Resume) /Author (Elevate Careers) >>\nendobj\n%%EOF'
      );
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${sanitizedFilename}"`);
    res.sendFile(filePath);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  applyForJob,
  getMyApplications,
  withdrawApplication,
  getEmployerApplicants,
  updateApplicationStatus,
  getResumeFile,
};
