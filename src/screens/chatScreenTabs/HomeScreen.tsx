import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { View, Text, TouchableOpacity, TextInput, FlatList, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLayoutEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { ChatStackParamList } from "../HomeScreenTabs/ChatsScreen";
import { RootStackParamList } from "../../../App";
import { useChatList } from "../../socket/useChatList";
import { Chat } from "../../socket/chat";

type HomeScreenProps = NativeStackNavigationProp<ChatStackParamList, "HomeScreen">
type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>

export default function HomeScreen() {
    const navigation = useNavigation<HomeScreenProps>();
    const rootNavigation = useNavigation<RootNavigationProp>();
    const [search, setSearch] = useState("");
    const chatList = useChatList();

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Expo Chat App",
            headerTitleStyle: { fontWeight: "bold" },
            headerRight: () => (
                <View style={{ flexDirection: "row", gap: 12 }}>
                    <TouchableOpacity style={{ marginRight: 8 }}>
                        <Ionicons name="camera-outline" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Ionicons name="ellipsis-vertical" size={24} color="black" />
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
    });

    const renderItem = ({ item }: { item: Chat }) => (
        <TouchableOpacity
            onPress={() => rootNavigation.navigate("SingleChatScreen", {
                chatId: item.friendId,
                friendName: item.friendName,
                lastSeenTime: item.lastTimeStamp,
                profileImage: item.profileImage as string
            })}
        >
            <View className="flex-row items-center p-4 border-b border-gray-200 bg-white">
                {/* Avatar */}
                <Image
                    source={{ uri: item.profileImage as string }}
                    className="h-14 w-14 rounded-full border border-gray-300"
                />

                {/* Name + Message */}
                <View className="ml-4 flex-1">
                    <View className="flex-row justify-between items-center">
                        <Text className="font-semibold text-base text-gray-800">{item.friendName}</Text>
                        <Text className="text-xs text-gray-500">{item.lastTimeStamp}</Text>
                    </View>
                    <Text
                        className="text-gray-500 mt-1"
                        numberOfLines={1}
                        ellipsizeMode="tail"
                    >
                        {item.lastMessage}
                    </Text>
                </View>
            </View>

        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1">
            <View className="items-center flex-row mx-2 bg-gray-300 rounded-full px-6 h-14">
                <Ionicons name="search" size={20} color="black" />
                <TextInput
                    className="flex-1 text-black-500 ml-2"
                    placeholder="Search"
                    placeholderTextColor={'black'}
                    value={search}
                    onChangeText={setSearch}
                />
            </View>

            <FlatList
                className="mt-4"
                data={filteredChats}
                renderItem={renderItem}
                keyExtractor={item => item.friendId.toString()}
            />

            {/* chat button */}
            <View className="absolute bottom-10 right-6 h-16 w-16 bg-white rounded-full justify-center items-center shadow-lg">
                <TouchableOpacity
                    className="h-16 w-16 rounded-full justify-center items-center"
                    activeOpacity={1}
                    onPress={() => navigation.navigate("NewChatScreen")}
                >
                    <Ionicons name="chatbox-ellipses" size={32} color="black" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}