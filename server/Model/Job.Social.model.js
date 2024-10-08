const mongoose = require("mongoose");

const jobFinanceSchema = new mongoose.Schema({
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
    type: Number
  },
  royalities: {
    type: String
  },
  commission: {
    type: Number
  },
  paymentTerms: {
    type: Number
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
  }
});

module.exports = mongoose.model("JobFinance", jobFinanceSchema);