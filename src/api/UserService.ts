import {
  useUserRegistration,
  UserRegistrationData,
} from "../components/UserContext";

const API = process.env.EXPO_PUBLIC_APP_URL + "/ChatApp";

export const createNewAccount = async (
  UserRegistrationData: UserRegistrationData
) => {
  console.log("API URL:", process.env.EXPO_PUBLIC_APP_URL + "/ChatApp");
  console.log("User Data:", UserRegistrationData);

  // Check if API URL is configured
  if (!API) {
    console.error("EXPO_PUBLIC_APP_URL is not configured");
    return {
      status: false,
      message:
        "API configuration error. Please check your environment variables.",
    };
  }

  const formData = new FormData();
  formData.append("firstName", UserRegistrationData.firstName);
  formData.append("lastName", UserRegistrationData.lastName);
  formData.append("countryCode", UserRegistrationData.countryCode);
  formData.append("contactNo", UserRegistrationData.contactNo);

  // Handle profile image - check if it's a custom image (URI) or avatar (ID)
  if (UserRegistrationData.profileImage) {
    if (
      UserRegistrationData.profileImage.startsWith("file://") ||
      UserRegistrationData.profileImage.startsWith("http") ||
      UserRegistrationData.profileImage.startsWith("content://")
    ) {
      // Custom image selected
      formData.append("profileImage", {
        uri: UserRegistrationData.profileImage,
        name: "profile.jpg",
        type: "image/jpeg",
      } as any);
    } else {
      // Avatar selected (avatar_1, avatar_2, etc.)
      formData.append("avatarId", UserRegistrationData.profileImage);
    }
  }

  try {
    const response = await fetch(API + "/UserController", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const json = await response.json();
      console.log("Success response:", json);
      return json;
    } else {
      const errorText = await response.text();
      console.log("API Error:", response.status, errorText);
      return {
        status: false,
        message: `Server error: ${response.status}. ${errorText || "Please try again later."}`,
      };
    }
  } catch (error) {
    console.error("Network error:", error);
    return {
      status: false,
      message:
        "Network error. Please check your internet connection and try again.",
    };
  }
};
