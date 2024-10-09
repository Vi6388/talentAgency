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

export const jobFormValidateForm = (data) => {
  const errors = {};

  if (!data?.firstname?.trim()) {
    errors.firstname = 'Firstname is required';
  }
  if (!data?.surname?.trim()) {
    errors.surname = 'Surname is required';
  }
  if (!data?.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(data?.email)) {
    errors.email = 'Email is invalid';
  }
  if (!data?.position?.trim()) {
    errors.position = 'Position is required';
  }
  if (!data?.phoneNumber?.trim()) {
    errors.phoneNumber = 'Phone number is required';
  }
  if (!data?.companyName?.trim()) {
    errors.companyName = 'Company name is required';
  }
  if (!data?.postalAddress?.trim()) {
    errors.postalAddress = 'Postal address is required';
  }
  if (!data?.postcode?.trim()) {
    errors.postcode = 'Postcode is required';
  }
  if (!data?.jobName?.trim()) {
    errors.jobName = 'Job name is required';
  }
  if (!data?.talentName?.trim()) {
    errors.talentName = 'Talent name is required';
  }
  if (!data?.ambassadorshipName?.trim()) {
    errors.ambassadorshipName = 'Ambassadorship is required';
  }

  return errors;
};