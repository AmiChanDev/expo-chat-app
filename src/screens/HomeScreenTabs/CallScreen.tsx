import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../theme/themeProvider";
import { Ionicons } from "@expo/vector-icons";

export default function CallsScreen() {
    const { applied } = useTheme();
    const isDark = applied === "dark";

    return (
        <SafeAreaView className={`flex-1 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
            <View className="flex-1 justify-center items-center px-8">
                <View className={`w-24 h-24 rounded-full ${isDark ? "bg-blue-900" : "bg-blue-100"} justify-center items-center mb-6`}>
                    <Ionicons name="call" size={48} color="#3b82f6" />
                </View>
                <Text className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-800"} text-center mb-2`}>
                    Call History
                </Text>
                <Text className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"} text-center leading-6`}>
                    Your recent calls will appear here. Start making calls to see your call history
                </Text>
            </View>
        </SafeAreaView>
    );
}