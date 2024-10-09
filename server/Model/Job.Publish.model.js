const mongoose = require("mongoose");

const jobPublishSchema = new mongoose.Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId,
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
  }
});

module.exports = mongoose.model("JobPublish", jobPublishSchema);