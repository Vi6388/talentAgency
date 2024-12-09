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
  },
  contentDueDate: {
    type: Date,
  },
  liveDate: {
    type: Date,
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

module.exports = mongoose.model("JobSocial", jobFinanceSchema);