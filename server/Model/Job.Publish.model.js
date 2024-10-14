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
  firstDraftDueDate: {
    type: Date,
    default: new Date(),
  },
  secondDraftDueDate: {
    type: Date,
    default: new Date(),
  },
  finalDueDate: {
    type: Date,
    default: new Date(),
  },
  publisher: {
    type: String
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
  partOfAmbassadorship: {
    type: Boolean
  },
  createdAt: {
    type: Date,
    default: new Date()
  }
});

module.exports = mongoose.model("JobPublish", jobPublishSchema);