import {
  SAVE_JOB_DETAILS_FORM,
  SAVE_JOB_INVOICE_LIST,
  SAVE_JOB_JOB_SUMMARY_LIST,
  CLEAN_JOB,
  SAVE_JOB,

  SAVE_JOB_ESTIMATE_DETAILS_FORM,
  SAVE_JOB_ESTIMATE_JOB_SUMMARY_LIST,
  SAVE_JOB_ESTIMATE_INVOICE_LIST,
  SAVE_JOB_ESTIMATE,
  CLEAN_JOB_ESTIMATE,
  CHANGE_IS_LOADING,
  SAVE_CLIENT,
} from "../actionTypes";

const initialState = {
  isLoading: false,
  job: {
    details: {
      firstname: "",
      surname: "",
      email: "",
      position: "",
      phoneNumber: "",
      companyName: "",
      abn: "",
      postalAddress: "",
      suburb: "",
      state: "",
      postcode: "",
      jobName: "",
      talentName: "",
      talentEmail: "",
      talentPhoneNumber: "",
      manager: "",
      startDate: "",
      endDate: "",
      supplierRequired: false,
    },
    invoiceList: [],
    jobSummaryList: [],
  },

  jobEstimate: {
    details: {
      firstname: "",
      surname: "",
      email: "",
      position: "",
      phoneNumber: "",
      companyName: "",
      abn: "",
      postalAddress: "",
      suburb: "",
      state: "",
      postcode: "",
      jobName: "",
      talentName: "",
      talentEmail: "",
      talentPhoneNumber: "",
      manager: "",
      startDate: "",
      endDate: "",
    },
    invoiceList: [],
    jobSummaryList: [],
  },

  client: {
    details: {
      id: "",
      notes: ""
    },
    company: {
      companyName: "",
      abn: "",
      postalAddress: "",
      postalSuburb: "",
      postalState: "",
      postalPostcode: "",
      billingAddress: "",
      billingSuburb: "",
      billingState: "",
      billingPostcode: "",
      website: "",
      phoneNumber: "",
      companyType: "",
    }
  }
};

export const jobReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_IS_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
    case SAVE_JOB_DETAILS_FORM:
      return {
        ...state,
        job: {
          ...state.job,
          details: action.payload
        }
      };
    case SAVE_JOB_INVOICE_LIST:
      return {
        ...state,
        job: {
          ...state.job,
          invoiceList: action.payload
        }
      };
    case SAVE_JOB_JOB_SUMMARY_LIST:
      return {
        ...state,
        job: {
          ...state.job,
          jobSummaryList: action.payload
        }
      };
    case SAVE_JOB:
      return {
        ...state,
        job: action.payload
      };
    case CLEAN_JOB:
      return {
        ...state,
        job: {
          details: {
            firstname: "",
            surname: "",
            email: "",
            position: "",
            phoneNumber: "",
            companyName: "",
            abn: "",
            postalAddress: "",
            suburb: "",
            state: "",
            postcode: "",
            jobName: "",
            talentName: "",
            talentEmail: "",
            manager: "",
            startDate: "",
            endDate: "",
            supplierRequired: false
          },
          invoiceList: [],
          jobSummaryList: [],
        }
      };


    case SAVE_JOB_ESTIMATE:
      return {
        ...state,
        jobEstimate: action.payload
      };
    case SAVE_JOB_ESTIMATE_DETAILS_FORM:
      return {
        ...state,
        jobEstimate: {
          ...state.jobEstimate,
          details: action.payload
        }
      };
    case SAVE_JOB_ESTIMATE_INVOICE_LIST:
      return {
        ...state,
        jobEstimate: {
          ...state.jobEstimate,
          invoiceList: action.payload
        }
      };
    case SAVE_JOB_ESTIMATE_JOB_SUMMARY_LIST:
      return {
        ...state,
        jobEstimate: {
          ...state.jobEstimate,
          jobSummaryList: action.payload
        }
      };
    case CLEAN_JOB_ESTIMATE:
      return {
        ...state,
        jobEstimate: {
          details: {
            firstname: "",
            surname: "",
            email: "",
            position: "",
            phoneNumber: "",
            companyName: "",
            abn: "",
            postalAddress: "",
            suburb: "",
            state: "",
            postcode: "",
            jobName: "",
            talentName: "",
            talentEmail: "",
            manager: "",
            startDate: "",
            endDate: "",
          },
          invoiceList: [],
          jobSummaryList: [],
        }
      };

    case SAVE_CLIENT:
      return {
        ...state,
        client: action.payload
      }
    default:
      return state;
  }
}