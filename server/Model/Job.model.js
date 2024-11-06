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
    email: {
      type: String
    },
    manager: {
      type: String
    }
  },
  labelColor: {
    type: String,
    default: "#000"
  },
  startDate: {
    type: String,
  },
  endDate: {
    type: String,
  },
  uploadedFiles: {
    contractFile: {
      type: String
    },
    briefFile: {
      type: String
    },
    supportingFile: {
      type: String
    },
  },
  supplierRequired: {
    type: Boolean,
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
  jobStatus: {
    type: Number, // 0: new, 1:inProduction, 2:withClientForApproval, 3: changesRequired, 4:approvedToGoLive, 5:toInvoice, 6:invoiced, 7:paid, 8: completed
    default: 0
  }
});

module.exports = mongoose.model("Job", jobSchema);