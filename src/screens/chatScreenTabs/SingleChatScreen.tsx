import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import {
    FlatList,
    Image,
    KeyboardAvoidingView,
    Keyboard,
    Platform,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList } from "../../../App";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useLayoutEffect, useRef, useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useSingleChat } from "../../socket/useSingleChat";
import { Chat } from "../../socket/chat";
import { formatChatTime } from "../../util/dateFormatter";
import { useSendChat } from "../../socket/useSendChat";

type SingleChatScreenProps = NativeStackScreenProps<
    RootStackParamList,
    "SingleChatScreen"
>;

export default function SingleChatScreen() {
    const navigation = useNavigation<
        NativeStackNavigationProp<RootStackParamList, "SingleChatScreen">
    >();
    const route = useRoute<SingleChatScreenProps["route"]>();
    const { chatId, profileImage, lastSeenTime } = route.params;

    const singleChat = useSingleChat(chatId);
    const messages = singleChat?.messages ?? [];
    const friend = singleChat?.friend;

    const [input, setInput] = useState("");
    const sendMessage = useSendChat();

    const flatListRef = useRef<FlatList<Chat>>(null);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () => {
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
        });

        const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => { });

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    useLayoutEffect(() => {
        if (flatListRef.current && messages.length > 0) {
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }
    }, [messages]);

    useLayoutEffect(() => {
        if (flatListRef.current && messages.length > 0) {
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: false });
            }, 50);
        }
    }, []);

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
                    <View className="relative mr-3">
                        <Image
                            source={{
                                uri: profileImage || `https://avatar.iran.liara.run/public/${chatId}`
                            }}
                            className="w-10 h-10 rounded-full border-2 border-gray-200"
                            defaultSource={require("../../assets/avatar.png")}
                        />
                        <View className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-white" />
                    </View>
                    <View className="flex-1">
                        <Text className="font-semibold text-lg text-gray-800" numberOfLines={1}>
                            {friend?.firstName} {friend?.lastName}
                        </Text>
                        <Text className="text-xs text-green-600 font-medium">
                            {friend?.status || "Online"}
                        </Text>
                    </View>
                </View>
            ),
            headerRight: () => (
                <View className="flex-row gap-2">
                    <TouchableOpacity className="p-2 rounded-full active:bg-gray-100" activeOpacity={0.7}>
                        <Ionicons name="videocam" size={22} color="#374151" />
                    </TouchableOpacity>
                    <TouchableOpacity className="p-2 rounded-full active:bg-gray-100" activeOpacity={0.7}>
                        <Ionicons name="call" size={22} color="#374151" />
                    </TouchableOpacity>
                    <TouchableOpacity className="p-2 rounded-full active:bg-gray-100" activeOpacity={0.7}>
                        <Ionicons name="ellipsis-vertical" size={22} color="#374151" />
                    </TouchableOpacity>
                </View>
            ),
        });
    }, [navigation, friend, lastSeenTime, profileImage, chatId]);

    const handleSendChat = () => {
        if (!input.trim()) return;
        if (!sendMessage || !chatId) {
            console.warn("Cannot send message: missing sendMessage function or chatId");
            return;
        }

        try {
            sendMessage(chatId, input.trim());
            setInput("");

            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const renderItem = ({ item }: { item: Chat }) => {
        const isMe = item.from.id !== chatId;

        return (
            <View className={`mb-3 flex-row ${isMe ? "justify-end" : "justify-start"}`}>
                {!isMe && (
                    <View className="mr-2 mt-auto">
                    </View>
                )}
                <View
                    className={`px-4 py-3 max-w-[75%] shadow-sm ${isMe
                        ? "bg-blue-500 rounded-2xl rounded-br-md"
                        : "bg-white border border-gray-200 rounded-2xl rounded-bl-md"
                        }`}
                >
                    <Text className={`text-base leading-5 ${isMe ? "text-white" : "text-gray-800"}`}>
                        {item.message}
                    </Text>
                    <View className="flex-row justify-end items-center mt-2">
                        <Text className={`text-xs ${isMe ? "text-blue-100" : "text-gray-500"}`}>
                            {formatChatTime(item.createdAt)}
                        </Text>
                        {isMe && (
                            <Ionicons
                                name={
                                    item.status === "READ" || item.status === "DELIVERED"
                                        ? "checkmark-done-sharp"
                                        : "checkmark"
                                }
                                size={14}
                                color={item.status === "READ" ? "#dbeafe" : "#93c5fd"}
                                style={{ marginLeft: 4 }}
                            />
                        )}
                    </View>
                </View>
                {isMe && <View className="w-2" />}
            </View>
        );
    };

    return (
        <View className="flex-1 bg-gray-50">
            <SafeAreaView className="flex-1" edges={["right", "left"]}>
                <StatusBar hidden={false} />
                <View className="flex-1">
                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => `${item.createdAt}-${index}`}
                        className="flex-1 px-4"
                        contentContainerStyle={{
                            flexGrow: 1,
                            justifyContent: messages.length > 0 ? "flex-end" : "center",
                            paddingTop: 16,
                            paddingBottom: 8,
                        }}
                        showsVerticalScrollIndicator={false}
                        onContentSizeChange={() =>
                            flatListRef.current?.scrollToEnd({ animated: true })
                        }
                        ListEmptyComponent={() => (
                            <View className="flex-1 justify-center items-center px-8">
                                <View className="w-20 h-20 rounded-full bg-blue-100 justify-center items-center mb-4">
                                    <Ionicons name="chatbubbles-outline" size={40} color="#3b82f6" />
                                </View>
                                <Text className="text-lg font-semibold text-gray-700 text-center mb-2">
                                    Start a conversation
                                </Text>
                                <Text className="text-sm text-gray-500 text-center">
                                    Send a message to get the conversation started
                                </Text>
                            </View>
                        )}
                    />
                </View>

                {/* Input Area */}
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
                >
                    <SafeAreaView className="bg-white border-t border-gray-100" edges={["left", "right"]}>
                        <View className="px-4 py-3">
                            <View className="flex-row items-end gap-3">
                                <TouchableOpacity className="w-10 h-10 justify-center items-center rounded-full bg-gray-100" activeOpacity={0.7}>
                                    <Ionicons name="add" size={24} color="#6b7280" />
                                </TouchableOpacity>
                                <View className="flex-1 max-h-32 bg-gray-100 rounded-3xl px-4 py-2">
                                    <TextInput
                                        value={input}
                                        onChangeText={setInput}
                                        multiline
                                        placeholder="Type a message..."
                                        placeholderTextColor="#9ca3af"
                                        returnKeyType="send"
                                        onSubmitEditing={handleSendChat}
                                        className="text-base text-gray-800 min-h-[40px]"
                                        style={{ textAlignVertical: "center" }}
                                    />
                                </View>
                                {input.trim() ? (
                                    <TouchableOpacity
                                        className="w-10 h-10 items-center justify-center rounded-full bg-blue-500 shadow-lg"
                                        onPress={handleSendChat}
                                        activeOpacity={0.8}
                                    >
                                        <Ionicons name="send" size={20} color="white" />
                                    </TouchableOpacity>
                                ) : (
                                    <View className="flex-row gap-2">
                                        <TouchableOpacity className="w-10 h-10 justify-center items-center rounded-full bg-gray-100" activeOpacity={0.7}>
                                            <Ionicons name="camera" size={22} color="#6b7280" />
                                        </TouchableOpacity>
                                        <TouchableOpacity className="w-10 h-10 justify-center items-center rounded-full bg-gray-100" activeOpacity={0.7}>
                                            <Ionicons name="mic" size={22} color="#6b7280" />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                        </View>
                    </SafeAreaView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}

