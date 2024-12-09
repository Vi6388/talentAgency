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
    type: String,
  },
  endDate: {
    type: String,
  },
  type: {
    type: String, // podcast, radio, web series, tv
  },
  numberOfEpisodes: {
    type: String,
    default: "0"
  },
  keyMessages: {
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