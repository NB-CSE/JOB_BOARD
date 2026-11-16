const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
      index: true,
    },
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    candidateName: {
      type: String,
      required: [true, 'Candidate name is required'],
      trim: true,
    },
    candidateEmail: {
      type: String,
      required: [true, 'Candidate email is required'],
      trim: true,
      lowercase: true,
    },
    candidatePhone: {
      type: String,
      default: '',
    },
    resumePath: {
      type: String,
      required: [true, 'Resume file is required'],
    },
    resumeOriginalName: {
      type: String,
      required: [true, 'Resume filename is required'],
    },
    coverLetter: {
      type: String,
      default: '',
    },
    portfolioUrl: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Submitted', 'Under Review', 'Interviewing', 'Offered', 'Rejected', 'Withdrawn'],
      default: 'Submitted',
      index: true,
    },
    employerNotes: {
      type: String,
      default: '',
    },
    statusHistory: [
      {
        status: { type: String, required: true },
        changedAt: { type: Date, default: Date.now },
        notes: { type: String, default: '' },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate applications by same candidate to same job
applicationSchema.index({ jobId: 1, candidateId: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
