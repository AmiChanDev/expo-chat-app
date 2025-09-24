export const validateFirstName = (name: string): string | null => {
  if (!name && name.trim().length === 0) {
    return "First name is requierd";
  }

  return null;
};
export const validateLastName = (name: string): string | null => {
  if (!name && name.trim().length === 0) {
    return "Last name is required";
  }

  return null;
};

export const validateCountryCode = (countryCode: string): string | null => {
  const regex = /^\+[1-9]\d{0,3}$/;
  if (!countryCode) {
    return "Country code is empty";
  }
  if (!regex.test(countryCode)) {
    return "Invalid Country code";
  }
  return null;
};

export const validatePhoneNo = (phoneNo: string): string | null => {
  const regex = /^[1-9][0-9]{6,14}$/;

  if (!phoneNo) {
    return "Contact Number is requierd";
  }
  if (!regex.test(phoneNo)) {
    return "Invalid Contact Number";
  }
  return null;
};

export const validateProfileImage = (image: {
  uri: string;
  type?: string;
  fileSize?: number;
}): string | null => {
  if (!image) {
    return "Profile Image is required";
  }
  if (!image.uri) {
    return "Profile Image URI is required";
  }
  if (
    !image.type &&
    !["image/jpeg", "image/png", "image/jpg"].includes(image.type || "")
  ) {
    return "Profile Image type is required";
  }
  if (!image.fileSize && image.fileSize! > 5 * 1024 * 1024) {
    //5mb
    return "Profile Image file size is required";
  }
  return null;
};
