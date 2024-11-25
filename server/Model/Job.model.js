const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  contactDetails: {
    firstname: {
      type: String,
      default: "",
    },
    surname: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    position: {
      type: String,
      default: "",
    },
    phoneNumber: {
      type: String,
      default: "",
    },
  },
  companyDetails: {
    companyName: {
      type: String,
      default: "",
    },
    abn: {
      type: String,
      default: "",
    },
    postalAddress: {
      type: String,
      default: "",
    },
    suburb: {
      type: String,
      default: "",
    },
    state: {
      type: String,
      default: "",
    },
    postcode: {
      type: String,
      default: "",
    }
  },
  jobName: {
    type: String,
    require: true
  },
  talent: {
    talentName: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    manager: {
      type: String,
      default: "",
    }
  },
  labelColor: {
    type: String,
    default: "#000"
  },
  startDate: {
    type: String,
    default: new Date(),
  },
  endDate: {
    type: String,
    default: new Date()
  },
  uploadedFiles: {
    contractFile: {
      type: String,
      default: "",
    },
    briefFile: {
      type: String,
      default: "",
    },
    supportingFile: {
      type: String,
      default: "",
    },
  },
  supplierRequired: {
    type: Boolean,
    default: false
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