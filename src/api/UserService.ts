import { useContext } from "react";
import { UserRegistrationData } from "../components/UserContext";
import { AuthContext } from "../socket/authProvider";

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

export const uploadProfileImage = async (imageUri: string) => {
  const auth = useContext(AuthContext);

  if (!auth || !auth.userId) {
    console.warn("No authenticated user found");
    return {
      status: false,
      message: "User not authenticated",
    };
  }

  const formData = new FormData();
  formData.append("userId", auth.userId);
  formData.append("profileImage", {
    uri: imageUri,
    name: "profile.jpg",
    type: "image/jpeg",
  } as any);

  try {
    const response = await fetch(API + "/ProfileController", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const json = await response.json();
      console.log("Profile image upload successful:", json);
      return json;
    } else {
      const errorText = await response.text();
      console.log("Profile image upload failed:", response.status, errorText);
      return {
        status: false,
        message: `Upload failed: ${response.status}. ${errorText || "Please try again."}`,
      };
    }
  } catch (error) {
    console.error("Network error during profile image upload:", error);
    return {
      status: false,
      message:
        "Network error. Please check your internet connection and try again.",
    };
  }
};
