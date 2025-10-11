import { UserRegistrationData } from "../components/UserContext";

const API_BASE = process.env.EXPO_PUBLIC_APP_URL || "http://localhost:8080";
const API = API_BASE + "/ChatApp";

export const createNewAccount = async (
  UserRegistrationData: UserRegistrationData
) => {
  console.log("API URL:", API_BASE + "/ChatApp");
  console.log("User Data:", UserRegistrationData);

  // Check if API URL is configured
  if (!API_BASE) {
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

  // Handle profile image - treat all images (custom or avatar) as file uploads
  if (UserRegistrationData.profileImage) {
    if (
      UserRegistrationData.profileImage.startsWith("file://") ||
      UserRegistrationData.profileImage.startsWith("http") ||
      UserRegistrationData.profileImage.startsWith("content://") ||
      UserRegistrationData.profileImage.startsWith("asset://")
    ) {
      // Image file (custom upload or resolved avatar)
      formData.append("profileImage", {
        uri: UserRegistrationData.profileImage,
        name: "profile.jpg",
        type: "image/jpeg",
      } as any);
    } else {
      // Fallback: if it's still an avatar ID, send it as avatarId
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

      // Normalize the response format to ensure it has the expected structure
      const normalizedResponse = {
        status: json.status !== undefined ? json.status : true,
        success: json.success !== undefined ? json.success : true,
        message: json.message || "Account created successfully",
        data: json.data || json,
        userId: json.userId || json.data?.userId || json.id,
      };

      console.log("Normalized response:", normalizedResponse);
      return normalizedResponse;
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

export const uploadProfileImage = async (imageUri: string, userId: string) => {
  if (!userId) {
    console.warn("No user ID provided");
    return {
      status: false,
      message: "User not authenticated",
    };
  }

  const formData = new FormData();
  formData.append("userId", userId);
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
