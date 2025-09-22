import { StatusBar } from "expo-status-bar";
import { Image, KeyboardAvoidingView, Platform, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from '@expo/vector-icons/AntDesign';

export default function ContactScreen() {
    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-black">
            <StatusBar hidden={true} />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
                className="flex-1">

                <View className="p-5 flex-1 justify-center items-center">

                    {/* Image */}
                    <Image source={require("../assets/contact.png")} className="w-36 h-40 mb-5" />

                    {/* Description */}
                    <Text className="text-slate-500 dark:text-slate-400 text-center px-5">
                        We use your contacts to help you find friends who are already on the app. Your contacts stay private.
                    </Text>

                    {/* Button */}
                    <Pressable className="bg-blue-500 rounded-lg px-5 py-3 mt-5 flex-row items-center">
                        <Text className="text-white mr-2">Select Country</Text>
                        <AntDesign name="caret-down" size={18} color="white" />
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
