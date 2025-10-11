import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StatusBar,
    Text,
    TextInput,
    View,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import { useContext, useEffect, useState } from "react";
import CountryPicker, { Country, CountryCode } from "react-native-country-picker-modal";
import { RootStackParamList } from "../../App";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../socket/authProvider";
import { useTheme } from "../theme/themeProvider";

import * as Validation from "../util/Validation";
import { ALERT_TYPE, AlertNotificationRoot, Toast } from "react-native-alert-notification";

type SignInScreenProps = NativeStackNavigationProp<RootStackParamList, "SignInScreen">;

export default function SignInScreen() {
    const navigation = useNavigation<SignInScreenProps>();
    const auth = useContext(AuthContext);
    const { applied } = useTheme();

    const [show, setShow] = useState(false);
    const [countryCode, setCountryCode] = useState<CountryCode>("LK");
    const [country, setCountry] = useState<Country | null>(null);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Set default country code
        if (!country) {
            setCountry({
                cca2: "LK" as CountryCode,
                callingCode: ["94"],
                name: "Sri Lanka",
                flag: "🇱🇰"
            } as Country);
        }
    }, []);

    const handleSignIn = async () => {
        setIsLoading(true);

        try {
            // Simple login with hardcoded user ID 12
            Toast.show({
                type: ALERT_TYPE.SUCCESS,
                title: "Sign In Successful",
                textBody: "Welcome back!",
                autoClose: 2000,
            });

            // Login with user ID 12
            await auth?.signUp("12");

            // Navigate to main app
            navigation.replace("HomeTabs");

        } catch (error) {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: "Sign In Failed",
                textBody: "Something went wrong. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AlertNotificationRoot>
            <SafeAreaView className="flex-1 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
                <StatusBar hidden={true} />
                <KeyboardAvoidingView
                    className="flex-1"
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
                >
                    <ScrollView
                        contentContainerStyle={{ flexGrow: 1 }}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Header Section */}
                        <View className="flex-1 justify-center items-center px-8 pt-8">
                            {/* Logo Container */}
                            <View className="mb-8 items-center">
                                <View className="w-24 h-24 bg-white dark:bg-gray-800 rounded-full items-center justify-center shadow-lg mb-4">
                                    <Image
                                        source={applied === "dark" ? require("../assets/logo_dark.png") : require("../assets/logo.png")}
                                        className="w-16 h-16"
                                        resizeMode="contain"
                                    />
                                </View>
                                <Text className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                                    Welcome Back!
                                </Text>
                                <Text className="text-gray-600 dark:text-gray-400 text-center text-base">
                                    Sign in to continue your conversations
                                </Text>
                            </View>

                            {/* Sign In Form */}
                            <View className="w-full space-y-6">
                                {/* Country Picker Section */}
                                <View>
                                    <Text className="text-gray-700 dark:text-gray-300 font-semibold mb-3 text-base">
                                        Country
                                    </Text>
                                    <Pressable
                                        className="w-full h-14 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl justify-between items-center flex-row px-4 shadow-sm"
                                        onPress={() => setShow(true)}
                                    >
                                        <CountryPicker
                                            countryCode={countryCode}
                                            withFilter
                                            withFlag
                                            withCountryNameButton
                                            visible={show}
                                            onClose={() => setShow(false)}
                                            onSelect={(selectedCountry) => {
                                                setCountryCode(selectedCountry.cca2);
                                                setCountry(selectedCountry);
                                                setShow(false);
                                            }}
                                        />
                                        <AntDesign name="down" size={16} color="#64748b" />
                                    </Pressable>
                                </View>

                                {/* Phone Input Section */}
                                <View>
                                    <Text className="text-gray-700 dark:text-gray-300 font-semibold mb-3 text-base">
                                        Phone Number
                                    </Text>
                                    <View className="flex-row gap-3">
                                        {/* Country Code Display */}
                                        <View className="w-20 h-14 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl justify-center items-center shadow-sm">
                                            <Text className="text-gray-700 dark:text-gray-300 font-medium text-base">
                                                +{country?.callingCode?.[0] || "94"}
                                            </Text>
                                        </View>

                                        {/* Phone Number Input */}
                                        <View className="flex-1 h-14 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl justify-center shadow-sm">
                                            <TextInput
                                                className="text-gray-700 dark:text-gray-300 font-medium text-base px-4 w-full h-full"
                                                placeholder="Enter phone number"
                                                placeholderTextColor="#9ca3af"
                                                inputMode="tel"
                                                value={phoneNumber}
                                                onChangeText={setPhoneNumber}
                                                autoComplete="tel"
                                            />
                                        </View>
                                    </View>
                                </View>

                                {/* Sign In Button */}
                                <Pressable
                                    className={`w-full h-14 justify-center items-center rounded-xl shadow-lg ${isLoading
                                        ? "bg-gray-400"
                                        : "bg-blue-600 active:bg-blue-700"
                                        }`}
                                    onPress={handleSignIn}
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <Text className="text-white font-bold text-lg">Signing In...</Text>
                                    ) : (
                                        <Text className="text-white font-bold text-lg">Sign In</Text>
                                    )}
                                </Pressable>

                            </View>
                        </View>

                        {/* Bottom Section */}
                        <View className="px-8 pb-8 pt-6">
                            {/* Sign Up Link */}
                            <View className="items-center">
                                <Text className="text-gray-600 dark:text-gray-400 text-base">
                                    Don't have an account?{" "}
                                    <TouchableOpacity
                                        onPress={() => navigation.navigate("SignUpScreen")}
                                        className="inline"
                                    >
                                        <Text className="text-blue-600 dark:text-blue-400 font-semibold">
                                            Sign Up
                                        </Text>
                                    </TouchableOpacity>
                                </Text>
                            </View>

                            {/* Terms Text */}
                            <Text className="text-gray-400 dark:text-gray-500 text-xs text-center mt-4 px-4 leading-4">
                                By signing in, you agree to our Terms of Service and Privacy Policy
                            </Text>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </AlertNotificationRoot>
    );
}