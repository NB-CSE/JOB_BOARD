const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const store = require('../config/inMemoryStore');
const { getDbStatus } = require('../config/db');

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'elevate_careers_jwt_secret_token_2026_super_secure_key',
    {
      expiresIn: process.env.JWT_EXPIRE || '30d',
    }
  );
};

const register = async (req, res, next) => {
  try {
    const { name, email, password, role, companyName, location, title } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, email, and password',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const userRole = role === 'employer' ? 'employer' : 'candidate';

    if (getDbStatus()) {
      const existingUser = await User.findOne({ email: cleanEmail });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email address already exists',
        });
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const user = await User.create({
        name: name.trim(),
        email: cleanEmail,
        passwordHash,
        role: userRole,
        profile: {
          title: title || (userRole === 'candidate' ? 'Job Seeker' : 'Hiring Manager'),
          companyName: userRole === 'employer' ? companyName || `${name.trim()}'s Team` : '',
          location: location || 'Bengaluru, India',
        },
      });

      const token = generateToken(user._id);

      return res.status(201).json({
        success: true,
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profile: user.profile,
        },
      });
    } else {
      // In-Memory Mode
      const existing = store.findUserByEmail(cleanEmail);
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email address already exists',
        });
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const user = store.createUser({
        name: name.trim(),
        email: cleanEmail,
        passwordHash,
        role: userRole,
        profile: {
          title: title || (userRole === 'candidate' ? 'Job Seeker' : 'Hiring Manager'),
          companyName: userRole === 'employer' ? companyName || `${name.trim()}'s Team` : '',
          location: location || 'Bengaluru, India',
          skills: [],
        },
      });

      const token = generateToken(user._id);

      return res.status(201).json({
        success: true,
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profile: user.profile,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    let user;
    if (getDbStatus()) {
      user = await User.findOne({ email: cleanEmail });
    } else {
      user = store.findUserByEmail(cleanEmail);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    if (getDbStatus()) {
      const user = await User.findById(req.user._id).select('-passwordHash');
      return res.status(200).json({ success: true, user });
    } else {
      const user = store.findUserById(req.user._id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });
      const { passwordHash, ...safeUser } = user;
      return res.status(200).json({ success: true, user: safeUser });
    }
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, profile } = req.body;

    if (getDbStatus()) {
      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      if (name) user.name = name.trim();
      if (profile) {
        user.profile = { ...user.profile.toObject(), ...profile };
      }
      await user.save();

      return res.status(200).json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profile: user.profile,
        },
      });
    } else {
      const existing = store.findUserById(req.user._id);
      if (!existing) return res.status(404).json({ success: false, message: 'User not found' });

      const updated = store.updateUser(req.user._id, {
        name: name ? name.trim() : existing.name,
        profile: { ...existing.profile, ...profile },
      });

      const { passwordHash, ...safeUser } = updated;
      return res.status(200).json({ success: true, user: safeUser });
    }
  } catch (error) {
    next(error);
  }
};

const uploadDefaultResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please select a resume file to upload (PDF, DOC, DOCX)',
      });
    }

    if (getDbStatus()) {
      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      user.profile.defaultResumePath = req.file.filename;
      user.profile.defaultResumeName = req.file.originalname;
      await user.save();

      return res.status(200).json({
        success: true,
        message: 'Default resume uploaded successfully',
        defaultResumePath: req.file.filename,
        defaultResumeName: req.file.originalname,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profile: user.profile,
        },
      });
    } else {
      const existing = store.findUserById(req.user._id);
      if (!existing) return res.status(404).json({ success: false, message: 'User not found' });

      const updated = store.updateUser(req.user._id, {
        profile: {
          ...existing.profile,
          defaultResumePath: req.file.filename,
          defaultResumeName: req.file.originalname,
        },
      });

      const { passwordHash, ...safeUser } = updated;
      return res.status(200).json({
        success: true,
        message: 'Default resume uploaded successfully',
        defaultResumePath: req.file.filename,
        defaultResumeName: req.file.originalname,
        user: safeUser,
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  uploadDefaultResume,
};
