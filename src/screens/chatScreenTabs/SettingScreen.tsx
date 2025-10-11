import { StatusBar } from "expo-status-bar";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useContext, useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { ThemeOption, useTheme } from "../../theme/themeProvider";
import { AuthContext } from "../../socket/authProvider";
import { CommonActions } from "@react-navigation/native";

const options: ThemeOption[] = ["light", "dark", "system"];

export default function SettingScreen() {
    const { preference, applied, setPreference } = useTheme();
    const navigation = useNavigation();
    const auth = useContext(AuthContext);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "Settings",
            headerTitleStyle: {
                fontWeight: "bold",
                fontSize: 20,
                color: applied === "dark" ? "#f8fafc" : "#1f2937"
            },
            headerStyle: {
                backgroundColor: applied === "dark" ? "#1f2937" : "#f8fafc",
            },
            headerLeft: () => (
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="mr-4 p-2 rounded-full active:bg-gray-100"
                    activeOpacity={0.7}
                >
                    <Ionicons
                        name="arrow-back"
                        size={24}
                        color={applied === "dark" ? "#f8fafc" : "#374151"}
                    />
                </TouchableOpacity>
            ),
        });
    }, [navigation, applied]);

    const handleThemeChange = async (themeOption: ThemeOption) => {
        await setPreference(themeOption);
    };

    const handleLogout = () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Logout",
                    style: "destructive",
                    onPress: async () => {
                        if (auth) {
                            await auth.signOut();
                            // Reset navigation to SplashScreen
                            navigation.dispatch(
                                CommonActions.reset({
                                    index: 0,
                                    routes: [{ name: 'SplashScreen' }],
                                })
                            );
                        }
                    }
                }
            ]
        );
    };

    const getThemeIcon = (option: ThemeOption) => {
        switch (option) {
            case "light":
                return "sunny-outline";
            case "dark":
                return "moon-outline";
            case "system":
                return "phone-portrait-outline";
            default:
                return "settings-outline";
        }
    };

    const getThemeDescription = (option: ThemeOption) => {
        switch (option) {
            case "light":
                return "Use light theme";
            case "dark":
                return "Use dark theme";
            case "system":
                return "Follow system setting";
            default:
                return "";
        }
    };

    return (
        <SafeAreaView
            className={`flex-1 ${applied === "dark" ? "bg-gray-900" : "bg-gray-50"}`}
            edges={["left", "right"]}
        >
            <StatusBar
                hidden={false}
                style={applied === "dark" ? "light" : "dark"}
                translucent={false}
            />

            <ScrollView className="flex-1 px-4 py-6">
                {/* Header Section */}
                <View className="mb-8">
                    <View className={`w-20 h-20 rounded-full ${applied === "dark" ? "bg-blue-600" : "bg-blue-500"} justify-center items-center mb-4 self-center shadow-lg`}>
                        <Ionicons
                            name="settings"
                            size={40}
                            color="white"
                        />
                    </View>
                    <Text className={`text-2xl font-bold text-center mb-2 ${applied === "dark" ? "text-white" : "text-gray-800"}`}>
                        App Settings
                    </Text>
                    <Text className={`text-sm text-center ${applied === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                        Customize your app experience
                    </Text>
                </View>

                {/* Theme Section */}
                <View className={`${applied === "dark" ? "bg-gray-800" : "bg-white"} rounded-2xl p-6 mb-6 shadow-sm border ${applied === "dark" ? "border-gray-700" : "border-gray-100"}`}>
                    <View className="flex-row items-center mb-4">
                        <View className={`w-10 h-10 rounded-full ${applied === "dark" ? "bg-gray-700" : "bg-gray-100"} justify-center items-center mr-3`}>
                            <Ionicons
                                name="color-palette"
                                size={20}
                                color={applied === "dark" ? "#9ca3af" : "#6b7280"}
                            />
                        </View>
                        <View className="flex-1">
                            <Text className={`text-lg font-semibold ${applied === "dark" ? "text-white" : "text-gray-800"}`}>
                                App Theme
                            </Text>
                            <Text className={`text-sm ${applied === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                                Choose your preferred theme
                            </Text>
                        </View>
                    </View>

                    {options.map((option, index) => (
                        <TouchableOpacity
                            key={option}
                            className={`flex-row items-center p-4 rounded-xl mb-2 border-2 transition-all duration-200 ${preference === option
                                ? applied === "dark"
                                    ? "bg-blue-600/20 border-blue-500"
                                    : "bg-blue-50 border-blue-500"
                                : applied === "dark"
                                    ? "bg-gray-700/50 border-gray-600"
                                    : "bg-gray-50 border-gray-200"
                                }`}
                            activeOpacity={0.7}
                            onPress={() => handleThemeChange(option)}
                        >
                            <View className={`w-12 h-12 rounded-full justify-center items-center mr-4 ${preference === option
                                ? applied === "dark"
                                    ? "bg-blue-600"
                                    : "bg-blue-500"
                                : applied === "dark"
                                    ? "bg-gray-600"
                                    : "bg-gray-200"
                                }`}>
                                <Ionicons
                                    name={getThemeIcon(option)}
                                    size={24}
                                    color={preference === option ? "white" : applied === "dark" ? "#9ca3af" : "#6b7280"}
                                />
                            </View>

                            <View className="flex-1">
                                <Text className={`text-base font-semibold mb-1 ${preference === option
                                    ? applied === "dark" ? "text-blue-400" : "text-blue-600"
                                    : applied === "dark" ? "text-white" : "text-gray-800"
                                    }`}>
                                    {option.charAt(0).toUpperCase() + option.slice(1)} Theme
                                </Text>
                                <Text className={`text-sm ${preference === option
                                    ? applied === "dark" ? "text-blue-300" : "text-blue-500"
                                    : applied === "dark" ? "text-gray-400" : "text-gray-600"
                                    }`}>
                                    {getThemeDescription(option)}
                                </Text>
                            </View>

                            {preference === option && (
                                <View className={`w-6 h-6 rounded-full justify-center items-center ${applied === "dark" ? "bg-blue-600" : "bg-blue-500"}`}>
                                    <Ionicons name="checkmark" size={16} color="white" />
                                </View>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Additional Settings Section */}
                <View className={`${applied === "dark" ? "bg-gray-800" : "bg-white"} rounded-2xl p-6 shadow-sm border ${applied === "dark" ? "border-gray-700" : "border-gray-100"} mb-6`}>
                    <View className="flex-row items-center mb-4">
                        <View className={`w-10 h-10 rounded-full ${applied === "dark" ? "bg-gray-700" : "bg-gray-100"} justify-center items-center mr-3`}>
                            <Ionicons
                                name="options"
                                size={20}
                                color={applied === "dark" ? "#9ca3af" : "#6b7280"}
                            />
                        </View>
                        <View className="flex-1">
                            <Text className={`text-lg font-semibold ${applied === "dark" ? "text-white" : "text-gray-800"}`}>
                                Account Settings
                            </Text>
                            <Text className={`text-sm ${applied === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                                Manage your account
                            </Text>
                        </View>
                    </View>

                    {/* Logout Button */}
                    <TouchableOpacity
                        className={`flex-row items-center p-4 rounded-xl border-2 ${applied === "dark"
                            ? "bg-red-600/20 border-red-500"
                            : "bg-red-50 border-red-300"
                            }`}
                        activeOpacity={0.7}
                        onPress={handleLogout}
                    >
                        <View className={`w-12 h-12 rounded-full justify-center items-center mr-4 ${applied === "dark" ? "bg-red-600" : "bg-red-500"}`}>
                            <Ionicons
                                name="log-out-outline"
                                size={24}
                                color="white"
                            />
                        </View>

                        <View className="flex-1">
                            <Text className={`text-base font-semibold mb-1 ${applied === "dark" ? "text-red-400" : "text-red-600"}`}>
                                Logout
                            </Text>
                            <Text className={`text-sm ${applied === "dark" ? "text-red-300" : "text-red-500"}`}>
                                Sign out of your account
                            </Text>
                        </View>

                        <Ionicons
                            name="chevron-forward"
                            size={20}
                            color={applied === "dark" ? "#ef4444" : "#dc2626"}
                        />
                    </TouchableOpacity>
                </View>

                {/* Current Theme Info */}
                <View className={`mt-6 p-4 rounded-xl ${applied === "dark" ? "bg-gray-800/50" : "bg-blue-50"} border ${applied === "dark" ? "border-gray-700" : "border-blue-100"}`}>
                    <View className="flex-row items-center justify-center">
                        <View className={`w-2 h-2 rounded-full mr-2 ${applied === "dark" ? "bg-blue-500" : "bg-blue-600"}`} />
                        <Text className={`text-sm font-medium ${applied === "dark" ? "text-blue-400" : "text-blue-700"}`}>
                            Current theme: {applied.charAt(0).toUpperCase() + applied.slice(1)}
                        </Text>
                    </View>
                    <Text className={`text-xs text-center mt-1 ${applied === "dark" ? "text-gray-500" : "text-gray-600"}`}>
                        Preference: {preference.charAt(0).toUpperCase() + preference.slice(1)}
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}