const mongoose = require("mongoose");

const jobFinanceSchema = new mongoose.Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  jobTitle: {
    type: String
  },
  conceptDueDate: {
    type: Date,
    default: new Date(),
  },
  contentDueDate: {
    type: Date,
    default: new Date(),
  },
  liveDate: {
    type: Date,
    default: new Date(),
  },
  keyMessage: {
    type: String
  },
  deleverables: {
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
  },
  partOfAmbassadorship: {
    type: Boolean
  }
});

module.exports = mongoose.model("JobFinance", jobFinanceSchema);