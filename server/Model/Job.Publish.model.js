const mongoose = require("mongoose");

const jobPublishSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true
  },
  jobTitle: {
    type: String
  },
  firstDraftDate: {
    type: String,
  },
  secondDraftDate: {
    type: String,
  },
  finalDate: {
    type: String,
  },
  publisher: {
    type: String,
    default: "",
  },
  numberOfEpisodes: {
    type: String,
    default: "",
  },
  keyMessages: {
    type: String,
    default: "",
  },
  deleverables: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: new Date()
  }
});

module.exports = mongoose.model("JobPublish", jobPublishSchema);