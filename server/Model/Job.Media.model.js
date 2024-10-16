const mongoose = require("mongoose");

const jobMediaSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true
  },
  jobTitle: {
    type: String
  },
  startDate: {
    type: Date,
    default: new Date(),
  },
  endDate: {
    type: Date,
    default: new Date(),
  },
  type: {
    type: String // podcast, radio, web series, tv
  },
  numberOfEpisodes: {
    type: String
  },
  keyMessage: {
    type: String
  },
  deleverables: {
    type: String
  },
  createdAt: {
    type: Date,
    default: new Date()
  }
});

module.exports = mongoose.model("JobMedia", jobMediaSchema);