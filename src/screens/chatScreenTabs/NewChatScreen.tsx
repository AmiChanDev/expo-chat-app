import { Ionicons } from "@expo/vector-icons";
import { FlatList, Image, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../../App";
import { useLayoutEffect, useState, useMemo, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { User } from "../../socket/chat";
import { getAllUsers } from "../../socket/getAllUsers";
import { useTheme } from "../../theme/themeProvider";

type NewChatScreenProps = NativeStackNavigationProp<RootStackParamList, "NewChatScreen">;

export default function NewChatScreen() {
    const navigation = useNavigation<NewChatScreenProps>();
    const { applied } = useTheme();
    const isDark = applied === 'dark';

    // Helper function to generate avatar URL
    const generateAvatarUrl = (firstName: string, lastName: string) => {
        const username = encodeURIComponent(`${firstName} ${lastName}`);
        return `https://avatar-placeholder.iran.liara.run/document?username=${username}`;
    };

    // Helper function to get proper profile image URL
    const getProfileImageUrl = (user: User) => {
        const API_BASE = process.env.EXPO_PUBLIC_APP_URL;

        console.log(`[getProfileImageUrl] Processing user: ${user.firstName} ${user.lastName} (ID: ${user.id})`);
        console.log(`[getProfileImageUrl] API_BASE: ${API_BASE}`);
        console.log(`[getProfileImageUrl] Raw profileImage: "${user.profileImage}"`);

        if (user.profileImage && user.profileImage.trim() !== '') {
            // If it's already a full URL but uses localhost, replace with the correct base URL
            if (user.profileImage.startsWith('http://') || user.profileImage.startsWith('https://')) {
                // Replace localhost URLs with the correct API base
                if (user.profileImage.includes('localhost') || user.profileImage.includes('127.0.0.1')) {
                    // Check if this is the wrong user's image (user ID mismatch)
                    const urlUserIdMatch = user.profileImage.match(/profile-images\/(\d+)\//);
                    if (urlUserIdMatch) {
                        const urlUserId = urlUserIdMatch[1];
                        if (urlUserId !== user.id.toString()) {
                            console.log(`[getProfileImageUrl] URL user ID (${urlUserId}) doesn't match user ID (${user.id}), generating correct URL`);
                            // Generate the correct URL for this specific user
                            const correctUrl = `${API_BASE}/ChatApp/profile-images/${user.id}/profile1.png`;
                            console.log(`[getProfileImageUrl] Generated correct user-specific URL: ${correctUrl}`);
                            return correctUrl;
                        }
                    }

                    // Extract the path after the port (e.g., /ChatApp/profile-images/12/profile1.png)
                    const pathMatch = user.profileImage.match(/:\d+(.*)$/);
                    if (pathMatch) {
                        const path = pathMatch[1];
                        const correctedUrl = `${API_BASE}${path}`;
                        console.log(`[getProfileImageUrl] Replaced localhost URL: ${correctedUrl}`);
                        return correctedUrl;
                    }
                }
                console.log(`[getProfileImageUrl] Using full URL as-is: ${user.profileImage}`);
                return user.profileImage;
            }
            // If it's a relative path from the backend, prepend the API base URL
            if (user.profileImage.startsWith('/') || user.profileImage.includes('uploads/')) {
                const imagePath = user.profileImage.startsWith('/') ? user.profileImage : `/${user.profileImage}`;
                const finalUrl = `${API_BASE}${imagePath}`;
                console.log(`[getProfileImageUrl] Constructed relative path URL: ${finalUrl}`);
                return finalUrl;
            }
            // If it's just a filename, construct the full path
            const finalUrl = `${API_BASE}/ChatApp/uploads/${user.profileImage}`;
            console.log(`[getProfileImageUrl] Constructed filename URL: ${finalUrl}`);
            return finalUrl;
        }

        // Try to check if user-specific profile image exists by generating the expected URL
        const userSpecificUrl = `${API_BASE}/ChatApp/profile-images/${user.id}/profile1.png`;
        console.log(`[getProfileImageUrl] Trying user-specific URL: ${userSpecificUrl}`);

        // For now, return fallback but we could add a check here
        const fallbackUrl = `https://avatar.iran.liara.run/public/${user.id}`;
        console.log(`[getProfileImageUrl] Using fallback URL: ${fallbackUrl}`);
        return fallbackUrl;
    }; const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    // Get real users data from API/WebSocket
    const allUsers = getAllUsers();
    const [users, setUsers] = useState<User[]>([]);

    // Update users when allUsers changes
    useEffect(() => {
        console.log("NewChatScreen - Received users:", allUsers);
        console.log("NewChatScreen - First user profileImage:", allUsers[0]?.profileImage);
        if (allUsers.length > 0) {
            setUsers(allUsers);
            setLoading(false);
        }
    }, [allUsers]);

    // Filter users based on search query

    const filteredUsers = useMemo(() => {
        if (!search.trim()) return users;
        return users.filter(user =>
            `${user.firstName} ${user.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
            user.contactNo.includes(search)
        );
    }, [users, search]);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "",
            headerStyle: {
                backgroundColor: isDark ? '#1f2937' : '#f8fafc',
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
                    <View>
                        <Text className={`text-lg font-bold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>Select Contact</Text>
                        <Text className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            {loading ? 'Loading...' : `${filteredUsers.length} Contacts`}
                        </Text>
                    </View>
                </View>
            ),
            headerRight: () => (
                <View className="flex-row gap-2">
                    <TouchableOpacity
                        className={`p-2 rounded-full ${isDark ? 'active:bg-gray-700' : 'active:bg-gray-100'}`}
                        activeOpacity={0.7}
                        onPress={() => { navigation.navigate("NewContactScreen"); }}
                    >
                        <Ionicons name="person-add" size={22} color={isDark ? "#f9fafb" : "#374151"} />
                    </TouchableOpacity>
                    <TouchableOpacity className={`p-2 rounded-full ${isDark ? 'active:bg-gray-700' : 'active:bg-gray-100'}`} activeOpacity={0.7}>
                        <Ionicons name="ellipsis-vertical" size={22} color={isDark ? "#f9fafb" : "#374151"} />
                    </TouchableOpacity>
                </View>
            ),
        });
    }, [navigation, filteredUsers.length, loading, isDark]);


    const renderContacts = ({ item }: { item: User }) => {
        const profileImageUrl = getProfileImageUrl(item);

        return (
            <TouchableOpacity
                className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl my-1 mx-1 shadow-sm`}
                activeOpacity={0.7}
                onPress={() => {
                    // Navigate to chat screen with this user
                    // navigation.navigate('SingleChatScreen', { userId: item.id, userName: `${item.firstName} ${item.lastName}` });
                }}
            >
                <View className="flex-row items-center p-4">
                    {/* Avatar with online indicator */}
                    <View className="relative mr-4">
                        <Image
                            source={{ uri: profileImageUrl }}
                            className={`w-14 h-14 rounded-full border-2 ${isDark ? 'border-gray-600' : 'border-gray-200'}`}
                            defaultSource={require("../../assets/avatar.png")}
                            onError={(error) => {
                                console.log(`Failed to load avatar for ${item.firstName} ${item.lastName}`);
                                console.log('Original profileImage:', item.profileImage);
                                console.log('Attempted URL:', profileImageUrl);
                                console.log('Error:', error.nativeEvent.error);
                            }}
                            onLoad={() => {
                                console.log(`Successfully loaded avatar for ${item.firstName} ${item.lastName} from:`, profileImageUrl);
                            }}
                        />
                        {/* Online indicator - updated to handle real status values */}
                        <View className={`absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full border-2 ${isDark ? 'border-gray-800' : 'border-white'} ${item.status === "ONLINE" || item.status === "ACTIVE" ? 'bg-green-500' : 'bg-gray-400'
                            }`} />
                    </View>

                    {/* Contact Info */}
                    <View className="flex-1">
                        <Text className={`text-base font-semibold ${isDark ? 'text-gray-100' : 'text-gray-800'} mb-1`}>
                            {item.firstName} {item.lastName}
                        </Text>
                        <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`} numberOfLines={1}>
                            {item.status ? item.status.toLowerCase().replace('_', ' ') : "No status"}
                        </Text>
                        <Text className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'} mt-0.5`}>
                            {item.countryCode} {item.contactNo}
                        </Text>
                    </View>

                    {/* Action button */}
                    <TouchableOpacity
                        className="w-10 h-10 rounded-full bg-blue-500 justify-center items-center"
                        activeOpacity={0.8}
                        onPress={() => {
                            navigation.navigate("SingleChatScreen", {
                                chatId: item.id,
                                friendName: `${item.firstName} ${item.lastName}`,
                                lastSeenTime: "Online",
                                profileImage: profileImageUrl
                            });
                        }}
                    >
                        <Ionicons name="chatbubble" size={18} color="white" />
                    </TouchableOpacity>
                </View >
            </TouchableOpacity >
        );
    };

    return (
        <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`} edges={["left", "right"]}>
            <StatusBar style={isDark ? 'light' : 'dark'} />

            {/* Search Bar */}
            <View className={`px-4 py-3 ${isDark ? 'bg-gray-900' : 'bg-slate-50'}`}>
                <View className={`flex-row items-center ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl px-4 py-3 shadow-sm`}>
                    <Ionicons name="search" size={20} color={isDark ? "#9ca3af" : "#9ca3af"} />
                    <TextInput
                        placeholder="Search contacts..."
                        placeholderTextColor={isDark ? "#6b7280" : "#9ca3af"}
                        className={`flex-1 ml-3 text-base ${isDark ? 'text-gray-100' : 'text-gray-700'}`}
                        value={search}
                        onChangeText={(text) => setSearch(text)}
                    />
                    {search.length > 0 && (
                        <TouchableOpacity onPress={() => setSearch("")}>
                            <Ionicons name="close-circle" size={20} color={isDark ? "#6b7280" : "#9ca3af"} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Contacts List */}
            <View className="flex-1">
                <FlatList
                    className="flex-1 px-3"
                    data={filteredUsers}
                    renderItem={renderContacts}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{ paddingTop: 8, paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={() => (
                        <View className="flex-1 justify-center items-center py-16 px-8">
                            {loading ? (
                                <>
                                    <ActivityIndicator size="large" color="#3b82f6" />
                                    <Text className={`text-lg font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'} text-center mb-2 mt-4`}>
                                        Loading contacts...
                                    </Text>
                                    <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} text-center`}>
                                        Please wait while we fetch your contacts
                                    </Text>
                                </>
                            ) : (
                                <>
                                    <View className={`w-20 h-20 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-100'} justify-center items-center mb-4`}>
                                        <Ionicons name="people-outline" size={40} color={isDark ? "#6b7280" : "#9ca3af"} />
                                    </View>
                                    <Text className={`text-lg font-semibold ${isDark ? 'text-gray-200' : 'text-gray-700'} text-center mb-2`}>
                                        No contacts found
                                    </Text>
                                    <Text className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} text-center`}>
                                        {search ? 'Try searching with different keywords' : 'No contacts available'}
                                    </Text>
                                </>
                            )}
                        </View>
                    )}
                />
            </View>
        </SafeAreaView>
    );
}