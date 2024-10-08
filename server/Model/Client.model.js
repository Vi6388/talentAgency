const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
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
  contact: {
    type: String,
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
  type: {
    type: String
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

module.exports = mongoose.model("Client", clientSchema);