import React, { useState, useEffect, useContext, useLayoutEffect } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Alert,
    ScrollView,
    StatusBar,
    ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useUserRegistration } from "../../components/UserContext";
import { useTheme } from "../../theme/themeProvider";
import { uploadProfileImage, getUserDetails } from "../../api/UserService";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { AuthContext } from "../../socket/authProvider";

export default function ProfileScreen() {
    const navigation = useNavigation();
    const { userData, setUserData } = useUserRegistration();
    const { applied } = useTheme();
    const auth = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const isDark = applied === "dark";

    // Helper function to get proper profile image URL
    const getProfileImageUrl = (user: any) => {
        const API_BASE = process.env.EXPO_PUBLIC_APP_URL;

        console.log(`[ProfileScreen] Processing profile image for user ID: ${user.id || auth?.userId}`);
        console.log(`[ProfileScreen] API_BASE: ${API_BASE}`);
        console.log(`[ProfileScreen] Raw profileImage: "${user.profileImage}"`);

        if (user.profileImage && user.profileImage.trim() !== '') {
            // If it's already a full URL but uses localhost, replace with the correct base URL
            if (user.profileImage.startsWith('http://') || user.profileImage.startsWith('https://')) {
                // Replace localhost URLs with the correct API base
                if (user.profileImage.includes('localhost') || user.profileImage.includes('127.0.0.1')) {
                    // Extract the path after the port (e.g., /ChatApp/profile-images/12/profile1.png)
                    const pathMatch = user.profileImage.match(/:\d+(.*)$/);
                    if (pathMatch) {
                        const path = pathMatch[1];
                        const correctedUrl = `${API_BASE}${path}`;
                        console.log(`[ProfileScreen] Replaced localhost URL: ${correctedUrl}`);
                        return correctedUrl;
                    }
                }
                console.log(`[ProfileScreen] Using full URL as-is: ${user.profileImage}`);
                return user.profileImage;
            }
            // If it's a relative path from the backend, prepend the API base URL
            if (user.profileImage.startsWith('/') || user.profileImage.includes('uploads/')) {
                const imagePath = user.profileImage.startsWith('/') ? user.profileImage : `/${user.profileImage}`;
                const finalUrl = `${API_BASE}${imagePath}`;
                console.log(`[ProfileScreen] Constructed relative path URL: ${finalUrl}`);
                return finalUrl;
            }
            // If it's just a filename, construct the full path
            const finalUrl = `${API_BASE}/ChatApp/uploads/${user.profileImage}`;
            console.log(`[ProfileScreen] Constructed filename URL: ${finalUrl}`);
            return finalUrl;
        }

        // Try to check if user-specific profile image exists by generating the expected URL
        const userId = user.id || auth?.userId;
        if (userId) {
            const userSpecificUrl = `${API_BASE}/ChatApp/profile-images/${userId}/profile1.png`;
            console.log(`[ProfileScreen] Trying user-specific URL: ${userSpecificUrl}`);
            return userSpecificUrl;
        }

        console.log(`[ProfileScreen] No profile image available`);
        return null;
    };

    // Configure header
    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Profile",
            headerTitleStyle: {
                fontWeight: "bold",
                fontSize: 20,
                color: applied === "dark" ? "#f8fafc" : "#1f2937"
            },
            headerStyle: {
                backgroundColor: applied === "dark" ? "#1f2937" : "#f8fafc",
            },
            headerLeft: () => (
                <View className="flex-row items-center">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className={`mr-4 p-2 rounded-full ${isDark ? 'active:bg-gray-700' : 'active:bg-gray-100'}`}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="arrow-back" size={24} color={isDark ? "#f9fafb" : "#374151"} />
                    </TouchableOpacity>

                </View>
            ),
            headerRight: () => (
                <View className="flex-row gap-2 mr-4">
                    <TouchableOpacity
                        className={`p-2 rounded-full ${isDark ? 'active:bg-gray-700' : 'active:bg-gray-100'}`}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="settings-outline" size={22} color={isDark ? "#f9fafb" : "#374151"} />
                    </TouchableOpacity>
                </View>
            ),
        });
    }, [navigation, isDark]);

    // Fetch user details when component mounts or when userId changes
    useEffect(() => {
        const fetchUserDetails = async () => {
            if (auth?.userId) {
                setIsLoading(true);
                console.log("Fetching user details for ID:", auth.userId);

                try {
                    const response = await getUserDetails(auth.userId);

                    if (response.status && response.data) {
                        console.log("User details fetched:", response.data);
                        setUserData(response.data);

                        // Toast.show({
                        //     type: ALERT_TYPE.SUCCESS,
                        //     title: "Profile Loaded",
                        //     textBody: "Your profile has been loaded successfully!",
                        //     autoClose: 2000,
                        // });
                    } else {
                        console.warn("Failed to fetch user details:", response.message);
                        Toast.show({
                            type: ALERT_TYPE.WARNING,
                            title: "Warning",
                            textBody: response.message || "Failed to load profile data",
                            autoClose: 3000,
                        });
                    }
                } catch (error) {
                    console.error("Error fetching user details:", error);
                    Toast.show({
                        type: ALERT_TYPE.DANGER,
                        title: "Error",
                        textBody: "An error occurred while loading your profile",
                        autoClose: 3000,
                    });
                } finally {
                    setIsLoading(false);
                }
            } else {
                console.log("No user ID available");
            }
        };

        fetchUserDetails();
    }, [auth?.userId, setUserData]);



    const pickImage = async () => {
        // Request permission
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            Alert.alert("Permission Required", "Permission to access camera roll is required!");
            return;
        }

        // Show action sheet for image source selection
        Alert.alert(
            "Select Image",
            "Choose from where you want to select an image",
            [
                {
                    text: "Camera",
                    onPress: openCamera,
                },
                {
                    text: "Gallery",
                    onPress: openGallery,
                },
                {
                    text: "Cancel",
                    style: "cancel",
                },
            ]
        );
    };

    const openCamera = async () => {
        const cameraPermissionResult = await ImagePicker.requestCameraPermissionsAsync();

        if (cameraPermissionResult.granted === false) {
            Alert.alert("Permission Required", "Permission to access camera is required!");
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            const imageUri = result.assets[0].uri;
            setUserData(prev => ({
                ...prev,
                profileImage: imageUri,
            }));

            // Upload the image to server
            await handleImageUpload(imageUri);
        }
    };

    const openGallery = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            const imageUri = result.assets[0].uri;
            setUserData(prev => ({
                ...prev,
                profileImage: imageUri,
            }));

            // Upload the image to server
            await handleImageUpload(imageUri);
        }
    };

    const handleImageUpload = async (imageUri: string) => {
        if (!auth?.userId) {
            Toast.show({
                type: ALERT_TYPE.WARNING,
                title: "Authentication Required",
                textBody: "Please log in to upload profile image",
                autoClose: 3000,
            });
            return;
        }

        try {
            Toast.show({
                type: ALERT_TYPE.INFO,
                title: "Uploading",
                textBody: "Uploading profile image...",
                autoClose: 2000,
            });

            const response = await uploadProfileImage(imageUri, auth.userId);

            if (response && response.status) {
                console.log("Profile image uploaded successfully, refreshing user data...");

                // Refresh user details to get the updated profile image URL
                const userResponse = await getUserDetails(auth.userId);
                if (userResponse.status && userResponse.data) {
                    console.log("Updated user details fetched:", userResponse.data);
                    setUserData(userResponse.data);

                    Toast.show({
                        type: ALERT_TYPE.SUCCESS,
                        title: "Success",
                        textBody: "Profile image updated successfully!",
                        autoClose: 3000,
                    });
                } else {
                    console.warn("Failed to fetch updated user details after upload");
                    // Keep the local image URI as fallback
                    setUserData(prev => ({
                        ...prev,
                        profileImage: imageUri,
                    }));
                }
            } else {
                Toast.show({
                    type: ALERT_TYPE.WARNING,
                    title: "Upload Failed",
                    textBody: response?.message || "Failed to upload image",
                    autoClose: 3000,
                });

                // Reset the local image since upload failed
                setUserData(prev => ({
                    ...prev,
                    profileImage: prev.profileImage === imageUri ? null : prev.profileImage,
                }));
            }
        } catch (error) {
            console.error("Error uploading profile image:", error);
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: "Error",
                textBody: "An error occurred while uploading the image",
                autoClose: 3000,
            });

            // Reset the local image since upload failed
            setUserData(prev => ({
                ...prev,
                profileImage: prev.profileImage === imageUri ? null : prev.profileImage,
            }));
        }
    };

    return (
        <SafeAreaView
            className={`flex-1 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
            edges={["left", "right"]}
        >
            <StatusBar
                hidden={false}
                translucent={false}
            />

            <ScrollView className="flex-1 px-4 py-6 mt-2">
                {/* Loading indicator */}
                {isLoading && (
                    <View className="flex-1 justify-center items-center py-20">
                        <ActivityIndicator size="large" color={isDark ? "#60a5fa" : "#3b82f6"} />
                        <Text className={`mt-4 text-center ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                            Loading your profile...
                        </Text>
                    </View>
                )}

                {/* No user state */}
                {!isLoading && !auth?.userId && (
                    <View className="flex-1 justify-center items-center py-20">
                        <Ionicons name="person-circle-outline" size={80} color={isDark ? "#6b7280" : "#9ca3af"} />
                        <Text className={`mt-4 text-xl font-semibold text-center ${isDark ? "text-white" : "text-gray-800"}`}>
                            Not Signed In
                        </Text>
                        <Text className={`mt-2 text-center ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                            Please sign in to view your profile
                        </Text>
                    </View>
                )}

                {/* Profile content - only show when not loading and user is signed in */}
                {!isLoading && auth?.userId && (
                    <>
                        {/* Beautiful Header Section - Inspired by SettingsScreen */}
                        <View className="mb-4">
                            {/* Profile Image Container */}
                            <TouchableOpacity
                                onPress={pickImage}
                                className="relative self-center mb-4"
                                activeOpacity={0.8}
                            >
                                <View className={`w-36 h-36 rounded-full ${isDark ? "bg-blue-600" : "bg-blue-500"} justify-center items-center shadow-lg overflow-hidden border-4 border-white`}>
                                    {(() => {
                                        const profileImageUrl = getProfileImageUrl(userData);
                                        console.log(`[ProfileScreen] Displaying image URL: ${profileImageUrl}`);

                                        return profileImageUrl ? (
                                            <Image
                                                source={{
                                                    uri: `${profileImageUrl}?t=${Date.now()}` // Add cache busting
                                                }}
                                                className="w-full h-full"
                                                resizeMode="cover"
                                                onError={(error) => {
                                                    console.log(`[ProfileScreen] Failed to load profile image`);
                                                    console.log('Original profileImage:', userData.profileImage);
                                                    console.log('Attempted URL:', profileImageUrl);
                                                    console.log('Error:', error.nativeEvent.error);
                                                }}
                                                onLoad={() => {
                                                    console.log(`[ProfileScreen] Successfully loaded profile image from:`, profileImageUrl);
                                                }}
                                            />
                                        ) : (
                                            <Ionicons
                                                name="person"
                                                size={40}
                                                color="white"
                                            />
                                        );
                                    })()}
                                </View>

                                {/* Camera Icon Overlay */}
                                <View className={`absolute bottom-0 right-0 w-8 h-8 rounded-full ${isDark ? "bg-gray-800" : "bg-white"} justify-center items-center shadow-md border-2 ${isDark ? "border-gray-700" : "border-gray-200"}`}>
                                    <Ionicons name="camera" size={16} color={isDark ? "#60a5fa" : "#3b82f6"} />
                                </View>
                            </TouchableOpacity>

                            {/* User Name */}
                            <Text className={`text-2xl font-bold text-center mb-2 ${isDark ? "text-white" : "text-gray-800"}`}>
                                {userData.firstName && userData.lastName
                                    ? `${userData.firstName} ${userData.lastName}`
                                    : "Your Name"
                                }
                            </Text>

                            {/* Contact Info */}
                            <Text className={`text-sm text-center ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                                {userData.countryCode && userData.contactNo
                                    ? `${userData.countryCode} ${userData.contactNo}`
                                    : "Add your contact information"
                                }
                            </Text>
                        </View>

                        {/* Profile Information */}
                        <View className="px-6 mt-6">
                            {/* First Name */}
                            <View className="mb-6">
                                <Text className={`text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                                    First Name
                                </Text>
                                <View className={`px-4 py-3 rounded-lg ${isDark ? "bg-gray-800" : "bg-white"} border ${isDark ? "border-gray-600" : "border-gray-300"}`}>
                                    <Text className={`${isDark ? "text-white" : "text-gray-900"}`}>
                                        {userData.firstName || "Not set"}
                                    </Text>
                                </View>
                            </View>

                            {/* Last Name */}
                            <View className="mb-6">
                                <Text className={`text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                                    Last Name
                                </Text>
                                <View className={`px-4 py-3 rounded-lg ${isDark ? "bg-gray-800" : "bg-white"} border ${isDark ? "border-gray-600" : "border-gray-300"}`}>
                                    <Text className={`${isDark ? "text-white" : "text-gray-900"}`}>
                                        {userData.lastName || "Not set"}
                                    </Text>
                                </View>
                            </View>

                            {/* Contact Number */}
                            <View className="mb-6">
                                <Text className={`text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                                    Contact Number
                                </Text>
                                <View className={`px-4 py-3 rounded-lg ${isDark ? "bg-gray-800" : "bg-white"} border ${isDark ? "border-gray-600" : "border-gray-300"}`}>
                                    <Text className={`${isDark ? "text-white" : "text-gray-900"}`}>
                                        {userData.countryCode} {userData.contactNo || "Not set"}
                                    </Text>
                                </View>
                            </View>

                            {/* User ID (for debugging) */}
                            <View className="mb-6">
                                <Text className={`text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                                    User ID
                                </Text>
                                <View className={`px-4 py-3 rounded-lg ${isDark ? "bg-gray-800" : "bg-white"} border ${isDark ? "border-gray-600" : "border-gray-300"}`}>
                                    <Text className={`${isDark ? "text-white" : "text-gray-900"} font-mono text-xs`}>
                                        {auth?.userId || "Not available"}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Additional Options */}
                        <View className="px-6 mt-8 mb-8">
                            <Text className={`text-lg font-semibold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
                                Settings
                            </Text>

                            <TouchableOpacity className={`flex-row items-center justify-between py-4 px-4 rounded-lg ${isDark ? "bg-gray-800" : "bg-white"
                                } border ${isDark ? "border-gray-600" : "border-gray-300"} mb-3`}>
                                <View className="flex-row items-center">
                                    <Ionicons
                                        name="notifications-outline"
                                        size={24}
                                        color={isDark ? "#9CA3AF" : "#6B7280"}
                                    />
                                    <Text className={`ml-3 ${isDark ? "text-white" : "text-gray-900"}`}>
                                        Notifications
                                    </Text>
                                </View>
                                <Ionicons
                                    name="chevron-forward"
                                    size={20}
                                    color={isDark ? "#9CA3AF" : "#6B7280"}
                                />
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}