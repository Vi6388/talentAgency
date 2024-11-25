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
  const day = new Date(date).toISOString().split('T')[0];
  const timeStr = new Date(date).toISOString().split('T')[1];
  const time = timeStr.split('.')[0];
  return day + " " + time;
}

export const dateFormat = (date) => {
  if (date !== "Invalid Date" && new Date(date) !== "Invalid Date") {
    const day = new Date(date).toISOString().split('T')[0];
    return day;
  }
}

export const dueDateFormat = (date) => {
  if (date !== "Invalid Date" && new Date(date) !== "Invalid Date" && date !== "") {
    const day = new Date(date).getDate();
    const month = new Date(date).getMonth() + 1;
    const year = new Date(date).getFullYear();
    return day + "/" + month + "/" + year;
  }
}

export const convertDueDate = (date) => {
  if (date) {
    const dateStrs = date?.split("/");
    const newDateStr = dateStrs[2] + "/" + dateStrs[1] + "/" + dateStrs[0];
    return new Date(newDateStr)?.toISOString();
  }
}