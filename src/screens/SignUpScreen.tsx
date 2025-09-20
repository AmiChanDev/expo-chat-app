import { StatusBar } from "expo-status-bar";
import { View, Text, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import { AlertNotificationRoot } from "react-native-alert-notification";
import { SafeAreaView } from "react-native-safe-area-context";

import React, { useState } from "react";

export default function SignUpScreen() {
    const [isPressed, setIsPressed] = useState(false);

    return (
        <AlertNotificationRoot>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1 bg-white dark:bg-black">
                <SafeAreaView className="flex-1">
                    <StatusBar hidden={true} />
                    <ScrollView
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={{
                            flexGrow: 1,
                            justifyContent: "center",
                            paddingHorizontal: 16,
                        }}>

                        {/* Header */}
                        <View className="mb-8 items-center">
                            <Text className="text-2xl font-bold text-center text-black dark:text-white">
                                Create Your Account And Start The Conversation Today
                            </Text>
                        </View>

                        {/* Sign Up Form */}
                        <View className="w-full">
                            <View className="mb-4">
                                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</Text>
                                <TextInput
                                    placeholder="Enter your email"
                                    placeholderTextColor="#9CA3AF"
                                    className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-base text-black dark:text-white"
                                />
                            </View>

                            <View className="mb-4">
                                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</Text>
                                <TextInput
                                    placeholder="Enter your password"
                                    placeholderTextColor="#9CA3AF"
                                    secureTextEntry
                                    className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-base text-black dark:text-white"
                                />
                            </View>

                            <View className="mb-6">
                                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm Password</Text>
                                <TextInput
                                    placeholder="Enter your confirm password"
                                    placeholderTextColor="#9CA3AF"
                                    secureTextEntry
                                    className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-base text-black dark:text-white"
                                />
                            </View>

                            {/* Button */}
                            <TouchableOpacity
                                className={`w-full rounded-lg py-3 items-center ${isPressed ? "bg-blue-700" : "bg-blue-600"}`}
                                onPress={() => { Alert.alert("OK"); }}
                                activeOpacity={1}
                                onPressIn={() => setIsPressed(true)}
                                onPressOut={() => setIsPressed(false)}
                            >
                                <Text className="text-white font-semibold text-base">Sign Up</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Footer */}
                        <View className="w-full mt-6 items-center">
                            <Text className="text-sm text-gray-600 dark:text-gray-400 text-center">
                                By signing up, you agree to our Terms of Service and Privacy Policy.
                            </Text>
                        </View>

                        <View className="w-full mt-4 items-center">
                            <Text className="text-sm text-gray-600 dark:text-gray-400">
                                Already have an account?{" "}
                                <Text className="text-blue-600">Sign In</Text>
                            </Text>
                        </View>
                    </ScrollView>
                </SafeAreaView>
            </KeyboardAvoidingView>
        </AlertNotificationRoot>
    );
}
