const express = require('express');
const router = express.Router();
const {
  getJobs,
  getFeaturedJobs,
  getCategories,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getEmployerJobs,
} = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getJobs);
router.get('/featured', getFeaturedJobs);
router.get('/categories', getCategories);
router.get('/employer/my-jobs', protect, authorize('employer', 'admin'), getEmployerJobs);
router.get('/:id', getJobById);

// Protected routes (Employer only)
router.post('/', protect, authorize('employer', 'admin'), createJob);
router.put('/:id', protect, authorize('employer', 'admin'), updateJob);
router.delete('/:id', protect, authorize('employer', 'admin'), deleteJob);

module.exports = router;
