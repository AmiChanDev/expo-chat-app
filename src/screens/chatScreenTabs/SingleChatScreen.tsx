import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import {
    FlatList,
    Image,
    KeyboardAvoidingView,
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
import { useLayoutEffect, useRef, useState } from "react";
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
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, "SingleChatScreen">>();
    const route = useRoute<SingleChatScreenProps["route"]>();
    const { chatId, friendName, profileImage, lastSeenTime } = route.params;

    const messages = useSingleChat(chatId) || []; // chatId == friendId, ensure array
    const [input, setInput] = useState("");
    const sendMessage = useSendChat();

    // Scroll to bottom whenever messages change
    const flatListRef = useRef<FlatList<Chat>>(null);

    useLayoutEffect(() => {
        if (flatListRef.current && messages.length > 0) {
            // Use scrollToEnd for better performance with inverted list
            flatListRef.current.scrollToEnd({ animated: true });
        }
    }, [messages]);

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
                        <Text className="font-bold text-2xl">{friendName}</Text>
                        <Text className="italic text-xs font-bold text-gray-500">
                            Pending
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
    }, [navigation, profileImage, friendName, lastSeenTime]);

    const handleSendChat = () => {
        if (!input.trim()) return;
        if (!sendMessage || !chatId) {
            console.warn("Cannot send message: missing sendMessage function or chatId");
            return;
        }

        try {
            sendMessage(chatId, input.trim());
            setInput("");
        } catch (error) {
            console.error("Error sending message:", error);
        }
    }

    const renderItem = ({ item }: { item: Chat }) => {
        // check if current user is the sender
        // chatId is the friend's ID, so if message is FROM chatId, it's from the friend (not me)
        // if message is TO chatId, it's from me to the friend
        const isMe = item.from.id !== chatId;

        return (
            <View
                className={`my-1 px-3 py-3 max-w-[75%] 
                    ${isMe
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
                                item.status === "READ"
                                    ? "checkmark-done-sharp"
                                    : item.status === "DELIVERED"
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
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 88 : 0}
        >
            <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }} edges={["right", "bottom", "left"]}>
                <StatusBar hidden={false} />

                {/* Messages List Container */}
                <View style={{ flex: 1 }}>
                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => `${item.createdAt}-${index}`}
                        style={{ flex: 1, paddingHorizontal: 12 }}
                        contentContainerStyle={{
                            paddingTop: 10,
                            paddingBottom: 10,
                            flexGrow: 1
                        }}
                        showsVerticalScrollIndicator={false}
                        automaticallyAdjustContentInsets={false}
                        contentInsetAdjustmentBehavior="never"
                        inverted={false}
                        maintainVisibleContentPosition={{
                            minIndexForVisible: 0,
                        }}
                    />
                </View>

                {/* Fixed Input Area at Bottom */}
                <View style={{
                    borderTopWidth: 1,
                    borderTopColor: '#f3f4f6',
                    backgroundColor: 'white',
                    paddingTop: 8,
                    paddingBottom: 12,
                    paddingHorizontal: 12
                }}>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                        <TextInput
                            value={input}
                            onChangeText={setInput}
                            multiline
                            placeholder="Type a message"
                            returnKeyType="send"
                            onSubmitEditing={handleSendChat}
                            blurOnSubmit={false}
                            style={{
                                flex: 1,
                                minHeight: 48,
                                maxHeight: 120,
                                paddingHorizontal: 16,
                                paddingVertical: 12,
                                backgroundColor: '#f3f4f6',
                                borderRadius: 24,
                                fontSize: 16,
                                marginRight: 8,
                                textAlignVertical: 'center'
                            }}
                        />
                        <TouchableOpacity
                            style={{
                                backgroundColor: input.trim() ? '#16a34a' : '#9ca3af',
                                width: 48,
                                height: 48,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 24,
                                marginBottom: 4
                            }}
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
    );
}