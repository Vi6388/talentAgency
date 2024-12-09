const mongoose = require("mongoose");

const jobEventSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true
  },
  jobTitle: {
    type: String,
    default: ""
  },
  eventDate: {
    type: String,
  },
  eventStartTime: {
    type: String,
    default: "00:00"
  },
  eventEndTime: {
    type: String,
    default: "00:00"
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

module.exports = mongoose.model("JobEvent", jobEventSchema);