const mongoose = require("mongoose");

const jobFinanceSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true
  },
  poNumber: {
    type: String
  },
  fee: {
    type: String
  },
  gst: {
    type: Boolean
  },
  usage: {
    type: String
  },
  asf: {
    type: String
  },
  royalities: {
    type: String
  },
  commission: {
    type: String
  },
  paymentTerms: {
    type: String
  },
  expenses: {
    type: String
  },
  expensesDesc: {
    type: String
  },
  miscellaneous: {
    type: String
  },
  miscellaneousDesc: {
    type: String
  },
  createdAt: {
    type: Date,
    default: new Date()
  }
});

module.exports = mongoose.model("JobFinance", jobFinanceSchema);