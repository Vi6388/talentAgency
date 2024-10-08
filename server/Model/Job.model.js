const mongoose = require("mongoose");
const JobFinanceModel = require("./Job.Finance.model");

const jobSchema = new mongoose.Schema({
  contactDetails: {
    firstname: {
      type: String
    },
    surname: {
      type: String
    },
    email: {
      type: String
    },
    position: {
      type: String
    },
    phoneNumber: {
      type: String
    },
  },
  companyDetails: {
    companyName: {
      type: String
    },
    abn: {
      type: String
    },
    postalAddress: {
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
    }
  },
  jobName: {
    type: String,
    require: true
  },
  talent: {
    talentName: {
      type: String
    },
    manager: {
      type: String
    }
  },
  ambassadorship: {
    type: String
  },
  startDate: {
    type: Date,
    default: new Date(),
  },
  endDate: {
    type: Date,
    default: new Date(),
  },
  uploadedFiles: {
    contactFile: {
      type: String
    },
    briefFile: {
      type: String
    },
    supportingFile: {
      type: String
    },
  },
  finance: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobFinance',
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

module.exports = mongoose.model("Job", jobSchema);