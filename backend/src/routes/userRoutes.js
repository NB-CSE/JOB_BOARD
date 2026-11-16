const express = require('express');
const router = express.Router();
const {
  saveJob,
  unsaveJob,
  getSavedJobs,
  getCompanies,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

// Public company list
router.get('/companies', getCompanies);

// Candidate saved jobs
router.post('/saved-jobs/:jobId', protect, authorize('candidate'), saveJob);
router.delete('/saved-jobs/:jobId', protect, authorize('candidate'), unsaveJob);
router.get('/saved-jobs', protect, authorize('candidate'), getSavedJobs);

module.exports = router;
