const express = require('express');
const router = express.Router();
const {
  applyForJob,
  getMyApplications,
  withdrawApplication,
  getEmployerApplicants,
  updateApplicationStatus,
  getResumeFile,
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Candidate routes
router.post(
  '/:jobId',
  protect,
  authorize('candidate'),
  upload.single('resume'),
  applyForJob
);
router.get('/my-applications', protect, authorize('candidate'), getMyApplications);
router.put('/:id/withdraw', protect, authorize('candidate'), withdrawApplication);

// Employer routes
router.get(
  '/employer/applicants',
  protect,
  authorize('employer', 'admin'),
  getEmployerApplicants
);
router.put(
  '/:id/status',
  protect,
  authorize('employer', 'admin'),
  updateApplicationStatus
);

// Secure resume access
router.get('/resume/:filename', protect, getResumeFile);

module.exports = router;
