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
    type: String,
    default: "00:00",
  },
  arrivalDate: {
    type: Date,
    default: new Date(),
  },
  arrivalTime: {
    type: String,
    default: "00:00",
  },
  preferredCarrier: {
    type: String,
    default: "",
  },
  requentFlyerNumber: {
    type: String,
    default: "",
  },
  clientPaying: {
    type: Boolean,
    default: false
  },
  carHireRequired: {
    type: String,
    default: "",
  },
  travelDetails: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: new Date()
  }
});

module.exports = mongoose.model("JobTravel", jobTravelSchema);