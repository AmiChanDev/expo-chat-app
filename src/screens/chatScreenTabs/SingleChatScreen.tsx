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
            headerLeft: () => (
                <View className="flex-row items-center gap-2">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="mr-3"
                    >
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                    <Image
                        source={{ uri: profileImage }}
                        className="h-14 w-14 rounded-full border-2 border-gray-400 p-1"
                    />
                    <View className="space-y-2">
                        <Text className="font-bold text-2xl">
                            {friend?.firstName + " " + friend?.lastName}
                        </Text>
                        <Text className="italic text-xs font-bold text-gray-500">
                            {friend?.status}
                        </Text>
                    </View>
                </View>
            ),
            headerRight: () => (
                <TouchableOpacity>
                    <Ionicons name="ellipsis-vertical" size={24} color="black" />
                </TouchableOpacity>
            ),
        });
    }, [navigation, friend, lastSeenTime, profileImage]);

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
            <View
                className={`my-1 px-3 py-3 max-w-[75%] ${isMe
                    ? "self-end bg-green-900 rounded-tl-xl rounded-bl-xl rounded-br-xl"
                    : "self-start bg-gray-700 rounded-tr-xl rounded-bl-xl rounded-br-xl"
                    }`}
            >
                <Text className="text-white text-base">{item.message}</Text>
                <View className="flex-row justify-end items-center mt-1">
                    <Text className="text-white italic text-xs me-2">
                        {formatChatTime(item.createdAt)}
                    </Text>
                    {isMe && (
                        <Ionicons
                            name={
                                item.status === "READ" || item.status === "DELIVERED"
                                    ? "checkmark-done-sharp"
                                    : "checkmark"
                            }
                            size={16}
                            color={item.status === "READ" ? "#0284c7" : "#9ca3af"}
                        />
                    )}
                </View>
            </View>
        );
    };

    return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
            <SafeAreaView style={{ flex: 1 }} edges={["right", "left"]}>
                <StatusBar hidden={false} />
                <View style={{ flex: 1 }}>
                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => `${item.createdAt}-${index}`}
                        style={{ flex: 1, paddingHorizontal: 12 }}
                        contentContainerStyle={{
                            flexGrow: 1,
                            justifyContent: messages.length > 0 ? "flex-end" : "center",
                        }}
                        showsVerticalScrollIndicator={false}
                        onContentSizeChange={() =>
                            flatListRef.current?.scrollToEnd({ animated: true })
                        }
                    />
                </View>

                {/* Input Area */}
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
                >
                    <SafeAreaView className="bg-white" edges={["left", "right"]}>
                        <View className="border-t border-gray-100 bg-white pt-2 pb-3 px-3">
                            <View className="flex-row items-end mb-4">
                                <TextInput
                                    value={input}
                                    onChangeText={setInput}
                                    multiline
                                    placeholder="Type a message"
                                    returnKeyType="send"
                                    onSubmitEditing={handleSendChat}
                                    className="flex-1 min-h-12 max-h-32 px-4 py-3 bg-gray-100 rounded-full text-base mr-2 text-black"
                                    style={{ textAlignVertical: "top" }}
                                />
                                <TouchableOpacity
                                    className={`w-12 h-12 items-center justify-center rounded-full ${input.trim() ? "bg-green-700" : "bg-gray-400"
                                        }`}
                                    onPress={handleSendChat}
                                    disabled={!input.trim()}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons name="send" size={20} color="white" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </SafeAreaView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}

