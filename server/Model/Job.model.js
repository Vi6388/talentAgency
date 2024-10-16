const mongoose = require("mongoose");

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
  labelColor: {
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
  estimateStatus: {
    type: Boolean,
    default: false,
  },
  isLive: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

module.exports = mongoose.model("Job", jobSchema);