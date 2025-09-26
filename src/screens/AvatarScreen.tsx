import { FlatList, Image, Pressable, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { RootStackParamList } from "../../App";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { useUserRegistration } from "../components/UserContext";
import * as Validation from "../util/Validation";
import { ALERT_TYPE, AlertNotificationRoot, Toast } from "react-native-alert-notification";

type AvatarScreenProps = NativeStackNavigationProp<RootStackParamList, "ContactScreen">;

export default function AvatarScreen() {
    const navigation = useNavigation<AvatarScreenProps>();

    const avatar = [
        { id: '1', src: require('../assets/avatars/avatar_1.png') },
        { id: '2', src: require('../assets/avatars/avatar_2.png') },
        { id: '3', src: require('../assets/avatars/avatar_3.png') },
        { id: '4', src: require('../assets/avatars/avatar_4.png') },
        { id: '5', src: require('../assets/avatars/avatar_5.png') },
        { id: '6', src: require('../assets/avatars/avatar_6.png') },
    ];

    const { userData, setUserData } = useUserRegistration();

    const [image, setImage] = useState<string | number | null>(userData.profileImage);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            const selectedImage = result.assets[0].uri; //idk why starts wtih 16
            setImage(selectedImage);
            setUserData((previous) => ({
                ...previous,
                profileImage: selectedImage
            }));
        }
    };

    const handleAvatarSelect = (avatarSrc: number) => {
        setImage(avatarSrc);
        setUserData((previous) => ({
            ...previous,
            profileImage: avatarSrc.toString()
        }));
    };

    const handleClearSelection = () => {
        setImage(null);
        setUserData((previous) => ({
            ...previous,
            profileImage: null
        }));
    };

    const handleCreateAccount = () => {
        if (!image) {
            Toast.show({
                type: ALERT_TYPE.WARNING,
                title: "Warning",
                textBody: "Select a profile image or an avatar"
            });
            return;
        }

        let validProfile;
        if (image) {
            if (typeof image === "string") {
                validProfile = Validation.validateProfileImage({
                    uri: image,
                    type: "",
                    fileSize: 0,
                });
            } else {
                validProfile = true;
            }
        }

        if (!validProfile) {
            Toast.show({
                type: ALERT_TYPE.WARNING,
                title: "Warning",
                textBody: "Please select a valid profile image"
            });
            return;
        }

        console.log("Profile setup completed");
        console.log("User Data:", userData);

        // Navigate to next screen
        // navigation.navigate("NextScreen");
    };

    return (
        <AlertNotificationRoot>
            <SafeAreaView className="flex-1 bg-gradient-to-br from-slate-50 to-slate-100">
                <StatusBar hidden />
                <KeyboardAvoidingView
                    className="flex-1 justify-between"
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    keyboardVerticalOffset={100}
                >
                    <View className="flex-1 justify-center items-center px-8">
                        <Text className="text-slate-700 font-bold text-2xl text-center leading-7">
                            Set Up Your Profile
                        </Text>
                        <Text className="text-slate-500 text-sm text-center mt-2 px-4">
                            Add a profile picture
                        </Text>

                        {/* Main profile picture */}
                        <Pressable onPress={pickImage} className="mt-8 mb-6 items-center">
                            <Image
                                source={
                                    image ?
                                        (typeof image === "string" ? { uri: image } : image)
                                        : require("../assets/avatar.png")
                                }
                                className={`rounded-full border-2 ${image ? "w-44 h-44 border-gray-300" : "w-40 h-40 border-gray-300"}`}
                            />
                        </Pressable>

                        {/* Clear selection button */}
                        {image && (
                            <Pressable
                                onPress={handleClearSelection}
                                className="mb-4 px-4 py-2 bg-slate-200 rounded-lg"
                            >
                                <Text className="text-slate-600 font-medium">Clear Selection</Text>
                            </Pressable>
                        )}

                        {/* Avatar selection list - ALWAYS VISIBLE */}
                        <FlatList
                            data={avatar}
                            renderItem={({ item }) => (
                                <Pressable
                                    onPress={() => handleAvatarSelect(item.src)}
                                    className={`mx-2 p-1 rounded-full ${image === item.src ? 'bg-blue-200 border-2 border-blue-400' : ''
                                        }`}
                                >
                                    <Image
                                        source={item.src}
                                        className="w-20 h-20 rounded-full border-2 border-gray-300"
                                    />
                                </Pressable>
                            )}
                            keyExtractor={(item) => item.id}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: 4 }}
                        />

                        <Text className="text-slate-700 font-bold text-xl text-center leading-7 mt-6">
                            Choose Your Profile Picture
                        </Text>
                        <Text className="text-slate-500 text-sm text-center mt-2 px-4">
                            You can always change it later
                        </Text>
                    </View>

                    {/* Bottom Button */}
                    <View className="px-8 pb-8">
                        <Pressable
                            className="w-full h-14 bg-blue-600 justify-center items-center rounded-xl shadow-lg active:bg-blue-700"
                            onPress={handleCreateAccount}
                        >
                            <Text className="text-white font-bold text-lg">Create Account</Text>
                        </Pressable>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </AlertNotificationRoot>
    );
}