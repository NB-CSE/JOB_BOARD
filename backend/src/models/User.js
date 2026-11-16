const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true,
      maxlength: [80, 'Name cannot exceed 80 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide your email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    role: {
      type: String,
      enum: ['candidate', 'employer', 'admin'],
      default: 'candidate',
    },
    profile: {
      title: { type: String, default: '' },
      bio: { type: String, default: '' },
      phone: { type: String, default: '' },
      location: { type: String, default: 'Bengaluru, India' },
      // Candidate specific
      skills: [{ type: String }],
      experienceYears: { type: Number, default: 0 },
      education: [
        {
          degree: { type: String },
          institution: { type: String },
          year: { type: String },
        },
      ],
      experience: [
        {
          title: { type: String },
          company: { type: String },
          duration: { type: String },
          description: { type: String },
        },
      ],
      defaultResumePath: { type: String, default: '' },
      defaultResumeName: { type: String, default: '' },
      portfolioUrl: { type: String, default: '' },
      linkedinUrl: { type: String, default: '' },
      githubUrl: { type: String, default: '' },
      // Employer specific
      companyName: { type: String, default: '' },
      companyWebsite: { type: String, default: '' },
      companyDescription: { type: String, default: '' },
      companyLogo: { type: String, default: '' },
      industry: { type: String, default: 'Technology' },
      companySize: { type: String, default: '50-200' },
      headquarters: { type: String, default: 'Bengaluru, Karnataka' },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
