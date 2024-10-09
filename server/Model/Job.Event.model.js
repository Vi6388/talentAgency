const mongoose = require("mongoose");

const jobEventSchema = new mongoose.Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId,
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
    type: Date,
    default: new Date(),
  },
  eventEndTime: {
    type: Date,
    default: new Date(),
  },
  keyMessage: {
    type: String
  },
  deleverables: {
    type: String
  },
  partOfAmbassadorship: {
    type: Boolean
  }
});

module.exports = mongoose.model("JobEvent", jobEventSchema);