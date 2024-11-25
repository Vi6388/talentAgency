const mongoose = require("mongoose");

const jobFinanceSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true
  },
  poNumber: {
    type: String,
    default: ""
  },
  fee: {
    type: String,
    default: ""
  },
  gst: {
    type: Boolean,
    default: false
  },
  usage: {
    type: String,
    default: "0"
  },
  asf: {
    type: String,
    default: "0"
  },
  royalities: {
    type: String,
    default: "0"
  },
  commission: {
    type: String,
    default: "0"
  },
  paymentTerms: {
    type: String,
    default: "0"
  },
  expenses: {
    type: String,
    default: "0"
  },
  expensesDesc: {
    type: String,
    default: ""
  },
  miscellaneous: {
    type: String,
    default: "0"
  },
  miscellaneousDesc: {
    type: String,
    default: ""
  },
  createdAt: {
    type: Date,
    default: new Date()
  }
});

module.exports = mongoose.model("JobFinance", jobFinanceSchema);