import { toast } from "react-toastify";

export const baseUrl = "localhost:3000/";
export const uploadUrl = "localhost:3000/uploads/";

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

const handleSuccess = (msg) =>
  toast.success(msg, {
    position: "top-left",
  });

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