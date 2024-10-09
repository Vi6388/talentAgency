const mongoose = require("mongoose");

const jobTravelSchema = new mongoose.Schema({
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
  departureTime: {
    type: Date,
    default: new Date(),
  },
  endDate: {
    type: Date,
    default: new Date(),
  },
  arrivalTime: {
    type: Date,
    default: new Date(),
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
    type: Boolean
  },
  travelDetails: {
    type: String
  },
  partOfAmbassadorship: {
    type: Boolean
  }
});

module.exports = mongoose.model("JobTravel", jobTravelSchema);