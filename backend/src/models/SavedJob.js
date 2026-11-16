const mongoose = require('mongoose');

const savedJobSchema = new mongoose.Schema(
  {
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate saved jobs
savedJobSchema.index({ candidateId: 1, jobId: 1 }, { unique: true });

module.exports = mongoose.model('SavedJob', savedJobSchema);
