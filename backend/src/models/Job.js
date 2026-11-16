const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
  {
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    companyLogo: {
      type: String,
      default: '',
    },
    companyWebsite: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    responsibilities: [{ type: String }],
    qualifications: [{ type: String }],
    skills: [{ type: String, trim: true }],
    category: {
      type: String,
      required: [true, 'Job category is required'],
      enum: [
        'Software Development',
        'Data & AI',
        'Design',
        'Marketing',
        'Business',
        'Product & Management',
        'DevOps & Cloud',
        'Customer Success',
      ],
      default: 'Software Development',
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    workplaceMode: {
      type: String,
      enum: ['Remote', 'Hybrid', 'On-site'],
      default: 'Hybrid',
      required: true,
    },
    jobType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
      default: 'Full-time',
      required: true,
    },
    experienceLevel: {
      type: String,
      enum: ['Entry-level', 'Mid-level', 'Senior-level', 'Lead / Principal'],
      default: 'Mid-level',
      required: true,
    },
    salary: {
      min: {
        type: Number, // in Lakhs Per Annum (LPA)
        default: 6,
      },
      max: {
        type: Number, // in Lakhs Per Annum (LPA)
        default: 18,
      },
      currency: {
        type: String,
        default: 'INR',
      },
      period: {
        type: String,
        default: 'LPA',
      },
      negotiable: {
        type: Boolean,
        default: false,
      },
    },
    status: {
      type: String,
      enum: ['active', 'closed', 'draft'],
      default: 'active',
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isDemo: {
      type: Boolean,
      default: false,
    },
    applicantCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound text search index for high-performance searching
jobSchema.index({
  title: 'text',
  company: 'text',
  description: 'text',
  skills: 'text',
});

module.exports = mongoose.model('Job', jobSchema);
