import { Ionicons } from "@expo/vector-icons";
import { FlatList, Image, Text, TextInput, TouchableOpacity, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../../App";
import { useLayoutEffect, useState, useMemo } from "react";
import { StatusBar } from "expo-status-bar";
import { User } from "../../socket/chat";

type NewChatScreenProps = NativeStackNavigationProp<RootStackParamList, "NewChatScreen">;

export default function NewChatScreen() {
    const navigation = useNavigation<NewChatScreenProps>();

    // Helper function to generate avatar URL
    const generateAvatarUrl = (firstName: string, lastName: string) => {
        const username = encodeURIComponent(`${firstName} ${lastName}`);
        return `https://avatar-placeholder.iran.liara.run/document?username=${username}`;
    };

    const [search, setSearch] = useState("");
    const [users, setUsers] = useState<User[]>([
        {
            id: 1,
            firstName: "Alice",
            lastName: "Johnson",
            countryCode: "+1",
            contactNo: "1234567890",
            createdAt: "2023-10-01 10:00:00",
            updatedAt: "2023-10-01 10:00:00",
            status: "Hey there! I am using WhatsApp.",
            profileImage: "https://avatar.iran.liara.run/public/1",
        },
        {
            id: 2,
            firstName: "Bob",
            lastName: "Smith",
            countryCode: "+1",
            contactNo: "0987654321",
            createdAt: "2023-10-01 10:00:00",
            updatedAt: "2023-10-01 10:00:00",
            status: "Busy",
            profileImage: "https://avatar.iran.liara.run/public/2",
        },
        {
            id: 3,
            firstName: "Carol",
            lastName: "Davis",
            countryCode: "+1",
            contactNo: "1122334455",
            createdAt: "2023-10-01 10:00:00",
            updatedAt: "2023-10-01 10:00:00",
            status: "Available",
            profileImage: "https://avatar.iran.liara.run/public/3",
        },
        {
            id: 4,
            firstName: "David",
            lastName: "Wilson",
            countryCode: "+1",
            contactNo: "5566778899",
            createdAt: "2023-10-01 10:00:00",
            updatedAt: "2023-10-01 10:00:00",
            status: "At work",
            profileImage: "https://avatar.iran.liara.run/public/4",
        },
        {
            id: 5,
            firstName: "Emma",
            lastName: "Brown",
            countryCode: "+1",
            contactNo: "9988776655",
            createdAt: "2023-10-01 10:00:00",
            updatedAt: "2023-10-01 10:00:00",
            status: "Online",
            profileImage: "https://avatar.iran.liara.run/public/5",
        },
        {
            id: 6,
            firstName: "Frank",
            lastName: "Miller",
            countryCode: "+1",
            contactNo: "4455667788",
            createdAt: "2023-10-01 10:00:00",
            updatedAt: "2023-10-01 10:00:00",
            status: "In a meeting",
            profileImage: "https://avatar.iran.liara.run/public/6",
        },
        {
            id: 7,
            firstName: "Grace",
            lastName: "Taylor",
            countryCode: "+1",
            contactNo: "7788990011",
            createdAt: "2023-10-01 10:00:00",
            updatedAt: "2023-10-01 10:00:00",
            status: "Sleeping",
            profileImage: "https://avatar.iran.liara.run/public/7",
        },
        {
            id: 8,
            firstName: "Henry",
            lastName: "Anderson",
            countryCode: "+1",
            contactNo: "2233445566",
            createdAt: "2023-10-01 10:00:00",
            updatedAt: "2023-10-01 10:00:00",
            status: "Driving",
            profileImage: "https://avatar.iran.liara.run/public/8",
        }
    ]);

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
            headerLeft: () => (
                <View className="flex-row items-center gap-2">
                    <View className="flex-row items-center gap-2">
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            className="mr-3"
                        >
                            <Ionicons name="arrow-back" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                    <View>
                        <Text className="text-lg font-bold">Select Contact</Text>
                        <Text className="text-sm font-bold">{filteredUsers.length} Contacts</Text>
                    </View>
                </View>

            ),
            headerRight: () => (
                <TouchableOpacity>
                    <Ionicons name="ellipsis-vertical" size={24} color="black" />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);


    const renderContacts = ({ item }: { item: User }) => (
        <TouchableOpacity
            className="flex-row items-center p-4 bg-white rounded-xl mx-2 mb-2"
            style={styles.contactContainer}
            onPress={() => {
                // Navigate to chat screen with this user
                // navigation.navigate('SingleChatScreen', { userId: item.id, userName: `${item.firstName} ${item.lastName}` });
            }}
        >
            {/* Avatar */}
            <View className="flex-shrink-0">
                <Image
                    source={{ uri: typeof item.profileImage === 'string' ? item.profileImage : generateAvatarUrl(item.firstName, item.lastName) }}
                    style={styles.avatar}
                    defaultSource={require("../../assets/avatar.png")}
                    onError={() => {
                        // Fallback to local avatar if URL fails
                        console.log(`Failed to load avatar for ${item.firstName} ${item.lastName}`);
                    }}
                />
            </View>
            <View className="ml-3 flex-1">
                <Text className="font-semibold text-base">{item.firstName} {item.lastName}</Text>
                <Text className="text-gray-500 text-sm" numberOfLines={1}>{item.status || "No status"}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView
            className="flex-1"
            edges={["left", "right"]}>
            <StatusBar hidden={false} translucent={true} />
            <View className="h-16 border border-black flex-row items-center px-4 gap-3 mt-6 mx-4 rounded-full">
                <Ionicons name="search" size={20} color="gray" />
                <TextInput
                    placeholder="Search"
                    className="flex-1 ml-2"
                    value={search}
                    onChangeText={(text) => setSearch(text)}
                />
            </View>
            <View className="flex-1 mt-4">
                <FlatList
                    className="px-2 mt-6"
                    data={filteredUsers}
                    renderItem={renderContacts}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{ paddingBottom: 100, paddingTop: 8 }}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={() => (
                        <View className="items-center justify-center py-8">
                            <Text className="text-gray-500 text-base">No contacts found</Text>
                        </View>
                    )}
                />
            </View>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
    },
    contactContainer: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
});