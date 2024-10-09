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
  jobFinance: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobFinance',
    required: true
  }],
  jobSocial: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobSocial',
    required: true
  }],
  jobEvent: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobEvent',
    required: true
  }],
  jobMedia: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobMedia',
    required: true
  }],
  jobPublish: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobPublish',
    required: true
  }],
  jobTravel: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'JobTravel',
    required: true
  }],
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

module.exports = mongoose.model("Job", jobSchema);