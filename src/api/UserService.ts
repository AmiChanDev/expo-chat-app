import {
  useUserRegistration,
  UserRegistrationData,
} from "../components/UserContext";

const API = process.env.EXPO_PUBLIC_APP_URL;

export const createNewAccount = async (
  userRegistrationData: UserRegistrationData
) => {
  if (!API) {
    throw new Error("API URL is not defined in EXPO_PUBLIC_APP_URL");
  }

  console.log("API:", API);
  console.log("Payload:", userRegistrationData);

  const formData = new FormData();
  formData.append("firstName", userRegistrationData.firstName);
  formData.append("lastName", userRegistrationData.lastName);
  formData.append("countryCode", userRegistrationData.countryCode);
  formData.append("contactNo", userRegistrationData.contactNo);
  formData.append("profileImage", {
    uri: userRegistrationData.profileImage,
    name: "profile.jpg",
    type: "image/jpeg",
  } as any);

  const response = await fetch(`${API}/UserController`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    return "Account creation failed!";
  }

  return await response.json();
};
