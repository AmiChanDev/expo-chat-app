import React, { useState } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    Alert,
    ScrollView,
    TextInput,
    StatusBar,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useUserRegistration } from "../components/UserContext";
import { useTheme } from "../theme/themeProvider";

export default function ProfileScreen() {
    const { userData, setUserData } = useUserRegistration();
    const { applied } = useTheme();
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState({
        firstName: userData.firstName,
        lastName: userData.lastName,
        contactNo: userData.contactNo,
    });

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
            setUserData(prev => ({
                ...prev,
                profileImage: result.assets[0].uri,
            }));
        }
    };

    const openGallery = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            setUserData(prev => ({
                ...prev,
                profileImage: result.assets[0].uri,
            }));
        }
    };

    const handleSave = () => {
        setUserData(prev => ({
            ...prev,
            ...editedData,
        }));
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedData({
            firstName: userData.firstName,
            lastName: userData.lastName,
            contactNo: userData.contactNo,
        });
        setIsEditing(false);
    };

    const isDark = applied === "dark";

    return (
        <View className={`flex-1 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
            <StatusBar
                barStyle={isDark ? "light-content" : "dark-content"}
                backgroundColor={isDark ? "#111827" : "#f9fafb"}
            />

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className={`px-6 pt-12 pb-8 ${isDark ? "bg-gray-800" : "bg-white"} shadow-sm`}>
                    <View className="flex-row justify-between items-center mb-6">
                        <Text className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                            Profile
                        </Text>
                        <TouchableOpacity
                            onPress={() => (isEditing ? handleCancel() : setIsEditing(true))}
                            className={`px-4 py-2 rounded-lg ${isEditing
                                ? isDark ? "bg-gray-700" : "bg-gray-200"
                                : isDark ? "bg-blue-600" : "bg-blue-500"
                                }`}
                        >
                            <Text className={`font-medium ${isEditing
                                ? isDark ? "text-gray-300" : "text-gray-700"
                                : "text-white"
                                }`}>
                                {isEditing ? "Cancel" : "Edit"}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Profile Image Section */}
                    <View className="items-center">
                        <TouchableOpacity
                            onPress={pickImage}
                            className="relative"
                            activeOpacity={0.8}
                        >
                            <View className={`w-32 h-32 rounded-full overflow-hidden ${isDark ? "bg-gray-700" : "bg-gray-200"
                                } border-4 ${isDark ? "border-gray-600" : "border-white"} shadow-lg`}>
                                {userData.profileImage ? (
                                    <Image
                                        source={{ uri: userData.profileImage }}
                                        className="w-full h-full"
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <View className="w-full h-full justify-center items-center">
                                        <Ionicons
                                            name="person"
                                            size={48}
                                            color={isDark ? "#9CA3AF" : "#6B7280"}
                                        />
                                    </View>
                                )}
                            </View>

                            {/* Camera Icon Overlay */}
                            <View className={`absolute bottom-2 right-2 w-10 h-10 rounded-full ${isDark ? "bg-blue-600" : "bg-blue-500"
                                } justify-center items-center shadow-lg`}>
                                <Ionicons name="camera" size={20} color="white" />
                            </View>
                        </TouchableOpacity>

                        <Text className={`mt-4 text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                            Tap to change profile picture
                        </Text>
                    </View>
                </View>

                {/* Profile Information */}
                <View className="px-6 mt-6">
                    {/* First Name */}
                    <View className="mb-6">
                        <Text className={`text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                            First Name
                        </Text>
                        {isEditing ? (
                            <TextInput
                                value={editedData.firstName}
                                onChangeText={(text) => setEditedData(prev => ({ ...prev, firstName: text }))}
                                className={`px-4 py-3 rounded-lg border ${isDark
                                    ? "bg-gray-800 border-gray-600 text-white"
                                    : "bg-white border-gray-300 text-gray-900"
                                    }`}
                                placeholder="Enter first name"
                                placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
                            />
                        ) : (
                            <View className={`px-4 py-3 rounded-lg ${isDark ? "bg-gray-800" : "bg-white"} border ${isDark ? "border-gray-600" : "border-gray-300"
                                }`}>
                                <Text className={`${isDark ? "text-white" : "text-gray-900"}`}>
                                    {userData.firstName || "Not set"}
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Last Name */}
                    <View className="mb-6">
                        <Text className={`text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                            Last Name
                        </Text>
                        {isEditing ? (
                            <TextInput
                                value={editedData.lastName}
                                onChangeText={(text) => setEditedData(prev => ({ ...prev, lastName: text }))}
                                className={`px-4 py-3 rounded-lg border ${isDark
                                    ? "bg-gray-800 border-gray-600 text-white"
                                    : "bg-white border-gray-300 text-gray-900"
                                    }`}
                                placeholder="Enter last name"
                                placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
                            />
                        ) : (
                            <View className={`px-4 py-3 rounded-lg ${isDark ? "bg-gray-800" : "bg-white"} border ${isDark ? "border-gray-600" : "border-gray-300"
                                }`}>
                                <Text className={`${isDark ? "text-white" : "text-gray-900"}`}>
                                    {userData.lastName || "Not set"}
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Contact Number */}
                    <View className="mb-6">
                        <Text className={`text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                            Contact Number
                        </Text>
                        {isEditing ? (
                            <TextInput
                                value={editedData.contactNo}
                                onChangeText={(text) => setEditedData(prev => ({ ...prev, contactNo: text }))}
                                className={`px-4 py-3 rounded-lg border ${isDark
                                    ? "bg-gray-800 border-gray-600 text-white"
                                    : "bg-white border-gray-300 text-gray-900"
                                    }`}
                                placeholder="Enter contact number"
                                placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
                                keyboardType="phone-pad"
                            />
                        ) : (
                            <View className={`px-4 py-3 rounded-lg ${isDark ? "bg-gray-800" : "bg-white"} border ${isDark ? "border-gray-600" : "border-gray-300"
                                }`}>
                                <Text className={`${isDark ? "text-white" : "text-gray-900"}`}>
                                    {userData.countryCode} {userData.contactNo || "Not set"}
                                </Text>
                            </View>
                        )}
                    </View>

                    {/* Save Button */}
                    {isEditing && (
                        <TouchableOpacity
                            onPress={handleSave}
                            className={`py-4 rounded-lg ${isDark ? "bg-blue-600" : "bg-blue-500"} shadow-sm`}
                        >
                            <Text className="text-white text-center font-semibold text-lg">
                                Save Changes
                            </Text>
                        </TouchableOpacity>
                    )}
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

                    <TouchableOpacity className={`flex-row items-center justify-between py-4 px-4 rounded-lg ${isDark ? "bg-gray-800" : "bg-white"
                        } border ${isDark ? "border-gray-600" : "border-gray-300"} mb-3`}>
                        <View className="flex-row items-center">
                            <Ionicons
                                name="lock-closed-outline"
                                size={24}
                                color={isDark ? "#9CA3AF" : "#6B7280"}
                            />
                            <Text className={`ml-3 ${isDark ? "text-white" : "text-gray-900"}`}>
                                Privacy
                            </Text>
                        </View>
                        <Ionicons
                            name="chevron-forward"
                            size={20}
                            color={isDark ? "#9CA3AF" : "#6B7280"}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity className={`flex-row items-center justify-between py-4 px-4 rounded-lg ${isDark ? "bg-gray-800" : "bg-white"
                        } border ${isDark ? "border-gray-600" : "border-gray-300"}`}>
                        <View className="flex-row items-center">
                            <Ionicons
                                name="help-circle-outline"
                                size={24}
                                color={isDark ? "#9CA3AF" : "#6B7280"}
                            />
                            <Text className={`ml-3 ${isDark ? "text-white" : "text-gray-900"}`}>
                                Help & Support
                            </Text>
                        </View>
                        <Ionicons
                            name="chevron-forward"
                            size={20}
                            color={isDark ? "#9CA3AF" : "#6B7280"}
                        />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}