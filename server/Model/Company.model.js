const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  companyName: {
    type: String
  },
  abn: {
    type: String
  },
  companyType: {
    type: String
  },
  postalAddress: {
    type: String
  },
  postalSuburb: {
    type: String
  },
  postalState: {
    type: String
  },
  postalPostcode: {
    type: String
  },
  billingAddress: {
    type: String
  },
  billingSuburb: {
    type: String
  },
  billingState: {
    type: String
  },
  billingPostcode: {
    type: String
  },
  website: {
    type: String
  },
  phoneNumber: {
    type: String
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

module.exports = mongoose.model("Company", companySchema);