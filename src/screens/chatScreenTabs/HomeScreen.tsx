import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { View, Text, TouchableOpacity, TextInput, FlatList, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useLayoutEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { ChatStackParamList } from "../HomeScreenTabs/ChatScreen";
import { RootStackParamList } from "../../../App";
import { useChatList } from "../../socket/useChatList";
import { useWebSocket } from "../../socket/WebSocketProvider";
import { Chat } from "../../socket/chat";
import { useRef } from "react";
import { Modal, Pressable } from "react-native";

type HomeScreenProps = NativeStackNavigationProp<ChatStackParamList, "HomeScreen">
type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>

export default function HomeScreen() {
    const navigation = useNavigation<HomeScreenProps>();
    const rootNavigation = useNavigation<RootNavigationProp>();
    const [search, setSearch] = useState("");
    const [menuVisible, setMenuVisible] = useState(false);
    const chatList = useChatList();
    const { isConnected, userId } = useWebSocket();

    // Helper function to format time
    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));

        if (hours < 1) {
            const minutes = Math.floor(diff / (1000 * 60));
            return minutes < 1 ? 'now' : `${minutes}m`;
        } else if (hours < 24) {
            return `${hours}h`;
        } else {
            const days = Math.floor(hours / 24);
            return days === 1 ? '1d' : `${days}d`;
        }
    };

    useEffect(() => {
        console.log('HomeScreen - Chat list updated:', chatList.length, 'chats');
        console.log('HomeScreen - Chat list data:', chatList);
        console.log('HomeScreen - WebSocket connected:', isConnected, 'userId:', userId);
    }, [chatList, isConnected, userId]);


    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Chats",
            headerTitleStyle: {
                fontWeight: "bold",
                fontSize: 24,
                color: '#1f2937'
            },
            headerStyle: {
                backgroundColor: '#f8fafc',
            },
            headerRight: () => (
                <View className="flex-row gap-4">
                    <TouchableOpacity
                        className="p-2 rounded-lg bg-white/80"
                        activeOpacity={0.7}
                    >
                        <Ionicons name="camera-outline" size={22} color="#374151" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        className="p-2 rounded-lg bg-white/80"
                        activeOpacity={0.7}
                        onPress={() => setMenuVisible(true)}
                    >
                        <Ionicons name="ellipsis-vertical" size={22} color="#374151" />
                    </TouchableOpacity>
                </View>
            ),
        });
    }, [navigation]);

    const filteredChats = chatList.filter((chat) => {
        // console.log(chat.friendId);
        // console.log(chat.profileImage);
        return (
            chat.friendName.toLowerCase().includes(search.toLowerCase()) ||
            chat.lastMessage.toLowerCase().includes(search.toLowerCase())
        );
    })
        .sort((a, b) => new Date(b.lastTimeStamp).getTime() - new Date(a.lastTimeStamp).getTime());

    const renderItem = ({ item }: { item: Chat }) => (

        <TouchableOpacity
            className="bg-white rounded-2xl my-1 mx-1 shadow-sm border border-gray-100"
            activeOpacity={0.7}
            onPress={() => rootNavigation.navigate("SingleChatScreen", {
                chatId: item.friendId,
                friendName: item.friendName,
                lastSeenTime: item.lastTimeStamp,
                profileImage: item.profileImage as string
            })}
        >
            <View className="flex-row items-center p-4">
                {/* Avatar with online indicator */}
                <View className="relative mr-4">
                    <Image
                        source={{
                            uri: item.profileImage as string || `https://avatar.iran.liara.run/public/${item.friendId}`
                        }}
                        className="w-14 h-14 rounded-full border-2 border-gray-200"
                        defaultSource={require("../../assets/avatar.png")}
                    />
                    {/* Online indicator */}
                    {/* <View
                        className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${item.status === "READ" ? "bg-green-500" : "bg-red-500"}`}
                    /> */}
                    {/* <Text>{`${item.status}`}</Text> */}
                </View>

                {/* Chat Content */}
                <View className="flex-1">
                    <View className="flex-row justify-between items-center mb-1">
                        <Text className="text-base font-semibold text-gray-800 flex-1 mr-2" numberOfLines={1}>
                            {item.friendName}
                        </Text>
                        <Text className="text-xs text-gray-400 font-medium">
                            {formatTime(item.lastTimeStamp)}
                        </Text>
                    </View>

                    <View className="flex-row justify-between items-center">
                        <Text
                            className="text-sm text-gray-600 flex-1 mr-2"
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {item.lastMessage}
                        </Text>

                        {/* Unread count badge */}
                        {item.unreadCount > 0 && (
                            <View className="bg-blue-500 rounded-xl min-w-5 h-5 justify-center items-center px-1.5">
                                <Text className="text-white text-xs font-semibold">
                                    {item.unreadCount > 99 ? '99+' : item.unreadCount}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            {/* Search Bar */}
            <View className="px-4 bg-slate-50/80">
                <View className="px-2 flex-row items-center bg-white rounded-2xl py-2 shadow-sm border border-gray-100">
                    <Ionicons name="search" size={20} color="#9ca3af" />
                    <TextInput
                        className="px-1 flex-1 text-base text-gray-700"
                        placeholder="Search conversations..."
                        placeholderTextColor="#9ca3af"
                        value={search}
                        onChangeText={setSearch}
                    />
                    {search.length > 0 && (
                        <TouchableOpacity
                            onPress={() => setSearch("")}
                            className="p-1 rounded-full active:bg-gray-100"
                            activeOpacity={0.7}
                        >
                            <Ionicons name="close-circle" size={20} color="#9ca3af" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Chat List */}
            <FlatList
                className="flex-1 px-3"
                data={filteredChats}
                renderItem={renderItem}
                keyExtractor={item => item.friendId.toString()}
                contentContainerStyle={{ paddingTop: 8, paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={() => (
                    <View className="flex-1 justify-center items-center py-20 px-8">
                        <View className="w-24 h-24 rounded-full bg-blue-100 justify-center items-center mb-6">
                            <Ionicons name="chatbubbles-outline" size={48} color="#3b82f6" />
                        </View>
                        <Text className="text-xl font-bold text-gray-800 text-center mb-2">
                            {chatList.length === 0 ? 'Welcome to Chats!' : 'No chats found'}
                        </Text>
                        <Text className="text-sm text-gray-500 text-center leading-6 mb-6">
                            {chatList.length === 0
                                ? 'Start meaningful conversations with your friends and family'
                                : 'Try adjusting your search terms'}
                        </Text>

                        {chatList.length === 0 && (
                            <TouchableOpacity
                                className="bg-blue-500 px-6 py-3 rounded-full shadow-lg mb-6"
                                activeOpacity={0.8}
                                onPress={() => navigation.navigate("NewChatScreen")}
                            >
                                <Text className="text-white font-semibold">Start New Chat</Text>
                            </TouchableOpacity>
                        )}

                        <View className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                            <View className="flex-row items-center justify-center mb-2">
                                <View className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                                <Text className={`text-sm font-medium ${isConnected ? 'text-green-700' : 'text-red-700'}`}>
                                    {isConnected ? 'Connected' : 'Disconnected'}
                                </Text>
                            </View>
                            <Text className="text-xs text-gray-600 text-center">
                                User: {userId} • Chats: {chatList.length}
                            </Text>
                        </View>
                    </View>
                )}
            />

            {/* Floating Action Button */}
            <View className="absolute bottom-6 right-6">
                <TouchableOpacity
                    className="w-16 h-16 rounded-full bg-blue-500 justify-center items-center shadow-xl shadow-blue-500/30 border-2 border-white"
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate("NewChatScreen")}
                >
                    <Ionicons name="add" size={32} color="white" />
                </TouchableOpacity>
            </View>

            {/* Dropdown Menu Modal */}
            <Modal
                transparent
                visible={menuVisible}
                animationType="fade"
                onRequestClose={() => setMenuVisible(false)}
            >
                <Pressable
                    style={{ flex: 1 }}
                    onPress={() => setMenuVisible(false)}
                >
                    <View
                        style={{
                            position: "absolute",
                            top: 100,
                            right: 20,
                            backgroundColor: "white",
                            borderRadius: 12,
                            elevation: 5,
                            shadowColor: "#000",
                            shadowOpacity: 0.1,
                            shadowRadius: 8,
                            paddingVertical: 8,
                            minWidth: 160,
                        }}
                    >
                        <TouchableOpacity
                            style={{ padding: 12 }}
                            onPress={() => {
                                setMenuVisible(false);
                                navigation.navigate("SettingScreen");
                            }}
                        >
                            <Text style={{ fontSize: 16 }}>Settings</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ padding: 12 }}
                            onPress={() => {
                                setMenuVisible(false);
                                rootNavigation.navigate("ProfileScreen");
                            }}
                        >
                            <Text style={{ fontSize: 16 }}>My Profile</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Modal>
        </SafeAreaView>
    );
}