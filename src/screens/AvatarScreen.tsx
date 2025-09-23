import { Image, Pressable, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { KeyboardAvoidingView, Platform } from "react-native";

export default function AvatarScreen() {
    const [image, setImage] = useState<string | null>(null);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) setImage(result.assets[0].uri);
    };

    return (
        <SafeAreaView className="flex-1 bg-gradient-to-br from-slate-50 to-slate-100">
            <StatusBar hidden={true} />
            <KeyboardAvoidingView
                className="flex-1 justify-between"
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 100}
            >
                {/* Header Section */}
                <View className="flex-1 justify-center items-center px-8">
                    <Text className="text-slate-700 font-bold text-2xl text-center leading-7">
                        Set Up Your Profile
                    </Text>
                    <Text className="text-slate-500 text-sm text-center mt-2 px-4">
                        Add a profile picture
                    </Text>

                    {/* Profile Picture Picker */}
                    <Pressable onPress={pickImage} className="mt-10 mb-6">
                        {image ? (<Image source={{ uri: image }} className="w-[180] h-[180] rounded-full border-hairline" />
                        ) : (
                            <View>
                                <Image source={require("../assets/avatar.png")} className="w-[160] h-[160]" />
                                <Text className="text-center font-bold text-2xl text-black-600 border-dotted border-green-500 border rounded-full mt-5">
                                    Add Image
                                </Text>
                            </View>
                        )}
                    </Pressable>

                    <Text className="text-slate-700 font-bold text-xl text-center leading-7">
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
                        onPress={() => {
                            // Navigate to next screen or action
                        }}
                    >
                        <Text className="text-white font-bold text-lg">Next</Text>
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
