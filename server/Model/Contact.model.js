const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true
  },
  firstname: {
    type: String,
  },
  surname: {
    type: String
  },
  email: {
    type: String
  },
  phoneNumber: {
    type: String
  },
  position: {
    type: String
  },
  primary: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

module.exports = mongoose.model("Contact", contactSchema);