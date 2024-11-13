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
  eventDate: {
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
  createdAt: {
    type: Date,
    default: new Date()
  }
});

module.exports = mongoose.model("JobEvent", jobEventSchema);