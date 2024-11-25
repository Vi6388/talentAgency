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
    type: String, // podcast, radio, web series, tv
    default: "podcast"
  },
  numberOfEpisodes: {
    type: String,
    default: "0"
  },
  keyMessage: {
    type: String,
    default: ""
  },
  deleverables: {
    type: String,
    default: ""
  },
  createdAt: {
    type: Date,
    default: new Date()
  }
});

module.exports = mongoose.model("JobMedia", jobMediaSchema);