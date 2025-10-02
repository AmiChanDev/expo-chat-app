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

type NewChatScreenProps = NativeStackNavigationProp<RootStackParamList, "NewChatScreen">;

export default function NewChatScreen() {
    const navigation = useNavigation<NewChatScreenProps>();

    // Helper function to generate avatar URL
    const generateAvatarUrl = (firstName: string, lastName: string) => {
        const username = encodeURIComponent(`${firstName} ${lastName}`);
        return `https://avatar-placeholder.iran.liara.run/document?username=${username}`;
    };

    const [search, setSearch] = useState("");
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
                backgroundColor: '#f8fafc',
            },
            headerLeft: () => (
                <View className="flex-row items-center">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="mr-4 p-2 rounded-full active:bg-gray-100"
                        activeOpacity={0.7}
                    >
                        <Ionicons name="arrow-back" size={24} color="#374151" />
                    </TouchableOpacity>
                    <View>
                        <Text className="text-lg font-bold text-gray-800">Select Contact</Text>
                        <Text className="text-sm font-medium text-gray-500">
                            {loading ? 'Loading...' : `${filteredUsers.length} Contacts`}
                        </Text>
                    </View>
                </View>
            ),
            headerRight: () => (
                <View className="flex-row gap-2">
                    <TouchableOpacity className="p-2 rounded-full active:bg-gray-100" activeOpacity={0.7} onPress={() => { navigation.navigate("NewContactScreen"); }}>
                        <Ionicons name="person-add" size={22} color="#374151" />
                    </TouchableOpacity>
                    <TouchableOpacity className="p-2 rounded-full active:bg-gray-100" activeOpacity={0.7}>
                        <Ionicons name="ellipsis-vertical" size={22} color="#374151" />
                    </TouchableOpacity>
                </View>
            ),
        });
    }, [navigation, filteredUsers.length, loading]);


    const renderContacts = ({ item }: { item: User }) => {
        // // Debug logging

        return (
            <TouchableOpacity
                className="bg-white rounded-2xl my-1 mx-1 shadow-sm"
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
                            source={{
                                uri: (item.profileImage && item.profileImage.trim() !== '')
                                    ? item.profileImage
                                    : `https://avatar.iran.liara.run/public/${item.id}`
                            }}
                            className="w-14 h-14 rounded-full border-2 border-gray-200"
                            defaultSource={require("../../assets/avatar.png")}
                            onError={() => {
                                console.log(`Failed to load avatar for ${item.firstName} ${item.lastName}, profileImage:`, item.profileImage);
                            }}
                        />
                        {/* Online indicator - updated to handle real status values */}
                        <View className={`absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${item.status === "ONLINE" || item.status === "ACTIVE" ? 'bg-green-500' : 'bg-gray-400'
                            }`} />
                    </View>

                    {/* Contact Info */}
                    <View className="flex-1">
                        <Text className="text-base font-semibold text-gray-800 mb-1">
                            {item.firstName} {item.lastName}
                        </Text>
                        <Text className="text-sm text-gray-500" numberOfLines={1}>
                            {item.status ? item.status.toLowerCase().replace('_', ' ') : "No status"}
                        </Text>
                        <Text className="text-xs text-gray-400 mt-0.5">
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
                                profileImage: (item.profileImage && item.profileImage.trim() !== '')
                                    ? item.profileImage
                                    : `https://avatar.iran.liara.run/public/${item.id}`
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
        <SafeAreaView className="flex-1 bg-gray-50" edges={["left", "right"]}>
            <StatusBar hidden={false} translucent={true} />

            {/* Search Bar */}
            <View className="px-4 py-3 bg-slate-50">
                <View className="flex-row items-center bg-white rounded-xl px-4 py-3 shadow-sm">
                    <Ionicons name="search" size={20} color="#9ca3af" />
                    <TextInput
                        placeholder="Search contacts..."
                        placeholderTextColor="#9ca3af"
                        className="flex-1 ml-3 text-base text-gray-700"
                        value={search}
                        onChangeText={(text) => setSearch(text)}
                    />
                    {search.length > 0 && (
                        <TouchableOpacity onPress={() => setSearch("")}>
                            <Ionicons name="close-circle" size={20} color="#9ca3af" />
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
                                    <Text className="text-lg font-semibold text-gray-700 text-center mb-2 mt-4">
                                        Loading contacts...
                                    </Text>
                                    <Text className="text-sm text-gray-500 text-center">
                                        Please wait while we fetch your contacts
                                    </Text>
                                </>
                            ) : (
                                <>
                                    <View className="w-20 h-20 rounded-full bg-gray-100 justify-center items-center mb-4">
                                        <Ionicons name="people-outline" size={40} color="#9ca3af" />
                                    </View>
                                    <Text className="text-lg font-semibold text-gray-700 text-center mb-2">
                                        No contacts found
                                    </Text>
                                    <Text className="text-sm text-gray-500 text-center">
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