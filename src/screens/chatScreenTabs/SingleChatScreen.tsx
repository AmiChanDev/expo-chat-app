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
import { useLayoutEffect, useState } from "react";
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

    const messages = useSingleChat(chatId); // chatId == friendId
    const [input, setInput] = useState("");
    const sendMessage = useSendChat();

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
                            Last seen {lastSeenTime}
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
        if (!sendMessage || !chatId) return;
        sendMessage(chatId, input);
        setInput("");
    }

    const renderItem = ({ item }: { item: Chat }) => {
        // check if current user is the sender
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
        <SafeAreaView className="flex-1 bg-white" edges={["right", "bottom", "left"]}>
            <StatusBar hidden={false} />

            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
                enabled
            >
                <FlatList
                    data={messages}
                    renderItem={renderItem}
                    keyExtractor={(_, index) => index.toString()}
                    className="flex-1 px-3"
                    contentContainerStyle={{
                        paddingTop: 10,
                        paddingBottom: 20,
                        flexGrow: 1
                    }}
                    showsVerticalScrollIndicator={false}
                />

                <View className="flex-row items-end p-3 bg-white border-t border-gray-100">
                    <TextInput
                        value={input}
                        onChangeText={setInput}
                        multiline
                        placeholder="Type a message"
                        className="flex-1 min-h-12 max-h-32 px-4 py-3 bg-gray-100 rounded-2xl text-base mr-2"
                        style={{
                            textAlignVertical: 'top',
                            maxHeight: 120
                        }}
                    />
                    <TouchableOpacity
                        className="bg-green-600 w-12 h-12 items-center justify-center rounded-full"
                        onPress={handleSendChat}
                    >
                        <Ionicons name="send" size={20} color="white" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
