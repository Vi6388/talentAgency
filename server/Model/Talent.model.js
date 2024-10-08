const mongoose = require("mongoose");

const talentSchema = new mongoose.Schema({
  avatar: {
    type: String
  },
  firstname: {
    type: String
  },
  surname: {
    type: String
  },
  email: {
    type: String,
    unique: true,
  },
  phoneNumber: {
    type: String
  },
  address: {
    type: String
  },
  suburb: {
    type: String
  },
  state: {
    type: String
  },
  postcode: {
    type: String
  },
  preferredAirline: {
    type: String
  },
  frequentFlyerNumber: {
    type: String
  },
  abn: {
    type: String
  },
  publicLiabilityInsurance: {
    type: String
  },
  highlightColor: {
    type: String
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

module.exports = mongoose.model("Talent", talentSchema);