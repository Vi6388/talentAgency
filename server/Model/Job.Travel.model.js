const mongoose = require("mongoose");

const jobTravelSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true
  },
  jobTitle: {
    type: String
  },
  departureDate: {
    type: Date,
    default: new Date(),
  },
  departureTime: {
    type: String
  },
  arrivalDate: {
    type: Date,
    default: new Date(),
  },
  arrivalTime: {
    type: String
  },
  preferredCarrier: {
    type: String
  },
  requentFlyerNumber: {
    type: String
  },
  clientPaying: {
    type: Boolean
  },
  carHireRequired: {
    type: String
  },
  travelDetails: {
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

module.exports = mongoose.model("JobTravel", jobTravelSchema);