const mongoose = require("mongoose");

const jobFinanceSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true
  },
  jobTitle: {
    type: String
  },
  conceptDueDate: {
    type: Date,
    default: new Date(),
  },
  contentDueDate: {
    type: Date,
    default: new Date(),
  },
  liveDate: {
    type: Date,
    default: new Date(),
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

module.exports = mongoose.model("JobSocial", jobFinanceSchema);