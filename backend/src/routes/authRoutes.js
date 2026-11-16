const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateProfile,
  uploadDefaultResume,
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post(
  '/upload-resume',
  protect,
  authorize('candidate'),
  upload.single('resume'),
  uploadDefaultResume
);

module.exports = router;
