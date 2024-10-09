const mongoose = require("mongoose");

const jobMediaSchema = new mongoose.Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId,
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
  mediaType: {
    type: String // podcast, radio, web series, tv
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
  }
});

module.exports = mongoose.model("JobMedia", jobMediaSchema);