import { toast } from "react-toastify";

export const baseUrl = "http://82.112.255.74:3000/";
export const uploadUrl = "http://82.112.255.74:3000/uploads/";
export const SERVER_URL = process.env.REACT_APP_API_BACKEND_URL;

export const statusList = [
  { statusIndex: 1, name: "New Job" },
  { statusIndex: 2, name: "In Production" },
  { statusIndex: 3, name: "With Client for approval" },
  { statusIndex: 4, name: "Changes Required" },
  { statusIndex: 5, name: "Approved to go live" },
  { statusIndex: 6, name: "To Invoice" },
  { statusIndex: 7, name: "Invoiced" },
  { statusIndex: 8, name: "Paid" },
  { statusIndex: 9, name: "Completed" },
];

export const estimageStatusList = [
  { statusIndex: 1, name: "Estimate with Client" },
  { statusIndex: 2, name: "Estimate to be reviewed" },
  { statusIndex: 3, name: "Declined Estimate" },
  { statusIndex: 4, name: "Successful Estimate" },
];

export const companyTypeList = [
  { id: '1', name: 'Advertising Agency' },
  { id: '2', name: 'PR Agency' },
  { id: '3', name: 'Brand' },
  { id: '4', name: 'Speakers Bureau' },
  { id: '5', name: 'Talent Agency' },
  { id: '6', name: 'Publisher' },
  { id: '7', name: 'Media Agency' },
  { id: '8', name: 'Production Company' },
  { id: '9', name: 'Television Station' },
  { id: '10', name: 'Radio Station' },
  { id: '11', name: 'Social Media Company' },
  { id: '12', name: 'Event Company' },
  { id: '13', name: 'Government Agency' },
  { id: '14', name: 'Tourist Board' }
];

export const numberFormat = (numStr) => {
  let result = numStr;
  if (isNaN(parseFloat(result)) || parseFloat(result) === 0) {
    result = 0
  } else {
    const str = numStr.replaceAll(",", "");
    result = parseFloat(str).toLocaleString();
    if (numStr[numStr.length - 1] === ".") {
      result += ".";
    }
  }

  return result;
}

const handleError = (err) =>
  toast.error(err, {
    position: "top-left",
  });

export const isFormValid = (form, requiredFields) => {
  for (const field of requiredFields) {
    if (!form[field]) {
      handleError(`Please input required values for ${field}.`);

      return false;
    }
  }

  return true;
};

export const dateTimeFormat = (date) => {
  if (date !== "Invalid Date" && new Date(date) !== "Invalid Date" && date !== "" && date !== undefined) {
    const day = new Date(date).toISOString().split('T')[0];
    const timeStr = new Date(date).toISOString().split('T')[1];
    const time = timeStr.split('.')[0];
    return day + " " + time;
  }
}

export const dateFormat = (date) => {
  if (date !== "Invalid Date" && new Date(date) !== "Invalid Date" && date !== "" && date !== undefined) {
    const day = new Date(date).toISOString().split('T')[0];
    return day;
  }
}

export const dueDateFormat = (date) => {
  if (date !== "Invalid Date" && new Date(date) !== "Invalid Date" && date !== "" && date !== undefined) {
    const day = new Date(date).getDate();
    const month = new Date(date).getMonth() + 1;
    const year = new Date(date).getFullYear();
    return day + "/" + month + "/" + year;
  }
}

export const convertDueDate = (date) => {
  if (date !== "Invalid Date" && new Date(date) !== "Invalid Date" && date !== "" && date !== undefined) {
    const dateStrs = date?.split("/");
    const newDateStr = dateStrs[2] + "/" + dateStrs[1] + "/" + dateStrs[0];
    return new Date(newDateStr)?.toISOString();
  }
}

export const combineDateAndTime = (date, time) => {
  if (date !== "Invalid Date" && new Date(date) !== "Invalid Date" && date !== "" && date !== undefined) {
    const [hours, minutes] = time.split(':').map(Number); // Split and convert to numbers
    const newDate = new Date(date); // Create a new Date object based on the original date
    newDate.setUTCHours(hours, minutes, 0, 0); // Set the hours and minutes (UTC)
    return newDate;
  }
};