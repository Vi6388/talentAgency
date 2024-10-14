const mongoose = require("mongoose");

const jobEventSchema = new mongoose.Schema({
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
  eventStartTime: {
    type: String,
  },
  eventEndTime: {
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

module.exports = mongoose.model("JobEvent", jobEventSchema);