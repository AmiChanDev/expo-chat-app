import { StatusBar } from "expo-status-bar";
import { View, Text, KeyboardAvoidingView, Platform, Pressable, ScrollView, TouchableOpacity, Image } from "react-native";
import { ALERT_TYPE, AlertNotificationRoot, Toast } from "react-native-alert-notification";
import { SafeAreaView } from "react-native-safe-area-context";

import React, { useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { useUserRegistration } from "../components/UserContext";
import { FloatingLabelInput } from "react-native-floating-label-input";
import * as Validation from "../util/Validation";
import { FloatingBubblesDesign } from "../components/SplashDesigns";
import { useTheme } from "../theme/themeProvider";

type SignUpScreenProps = NativeStackNavigationProp<RootStackParamList, "SignUpScreen">;

export default function SignUpScreen() {
    const navigation = useNavigation<SignUpScreenProps>();
    const { userData, setUserData } = useUserRegistration();
    const { applied } = useTheme();

    return (
        <AlertNotificationRoot>
            <SafeAreaView className="flex-1 bg-gradient-to-br from-slate-50 to-slate-100">
                <StatusBar hidden={true} />

                {/* Floating Bubbles Background */}
                <FloatingBubblesDesign />

                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    className="flex-1">
                    <ScrollView
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={{
                            flexGrow: 1,
                            justifyContent: "center",
                            paddingHorizontal: 32,
                        }}>

                        {/* Logo Section */}
                        <View className="self-center w-36 h-36 bg-white dark:bg-black rounded-full items-center justify-center shadow-lg mb-8">
                            <Image
                                source={applied === "dark" ? require("../assets/logo_dark.png") : require("../assets/logo.png")}
                                className="w-24 h-24"
                                resizeMode="contain"
                            />
                        </View>

                        {/* Header Section */}
                        <View className="mb-10 items-center">
                            <Text className="text-slate-700 font-bold text-2xl text-center leading-8 mb-3">
                                Create Your Account
                            </Text>
                            <Text className="text-slate-500 text-base text-center px-4">
                                Start the conversation today and connect with others
                            </Text>
                        </View>

                        {/* Sign Up Form */}
                        <View className="w-full">
                            {/* First Name Input */}
                            <View className="mb-6">
                                <Text className="text-slate-600 font-semibold mb-3 text-base">
                                    First Name
                                </Text>
                                <View className="bg-white border border-slate-200 rounded-xl shadow-sm">
                                    <FloatingLabelInput
                                        label="Enter your first name"
                                        value={userData.firstName}
                                        onChangeText={(text) => setUserData((previous) => ({ ...previous, firstName: text }))}
                                        containerStyles={{
                                            backgroundColor: 'transparent',
                                            borderWidth: 0,
                                            paddingHorizontal: 16,
                                            height: 56,
                                        }}
                                        customLabelStyles={{
                                            colorFocused: '#3b82f6',
                                            colorBlurred: '#94a3b8',
                                        }}
                                        labelStyles={{
                                            fontSize: 14,
                                        }}
                                        inputStyles={{
                                            fontSize: 16,
                                            color: '#334155',
                                            fontWeight: '500',
                                        }}
                                    />
                                </View>
                            </View>

                            {/* Last Name Input */}
                            <View className="mb-8">
                                <Text className="text-slate-600 font-semibold mb-3 text-base">
                                    Last Name
                                </Text>
                                <View className="bg-white border border-slate-200 rounded-xl shadow-sm">
                                    <FloatingLabelInput
                                        label="Enter your last name"
                                        value={userData.lastName}
                                        onChangeText={(text) => setUserData((previous) => ({ ...previous, lastName: text }))}
                                        containerStyles={{
                                            backgroundColor: 'transparent',
                                            borderWidth: 0,
                                            paddingHorizontal: 16,
                                            height: 56,
                                        }}
                                        customLabelStyles={{
                                            colorFocused: '#3b82f6',
                                            colorBlurred: '#94a3b8',
                                        }}
                                        labelStyles={{
                                            fontSize: 14,
                                        }}
                                        inputStyles={{
                                            fontSize: 16,
                                            color: '#334155',
                                            fontWeight: '500',
                                        }}
                                    />
                                </View>
                            </View>

                            {/* Sign Up Button */}
                            <Pressable
                                className="w-full h-14 bg-blue-600 justify-center items-center rounded-xl shadow-lg active:bg-blue-700 mb-6"
                                onPress={() => {
                                    let validateFirstName = Validation.validateFirstName(userData.firstName);
                                    let validateLastName = Validation.validateLastName(userData.lastName)

                                    if (validateFirstName) {
                                        Toast.show({
                                            type: ALERT_TYPE.WARNING,
                                            textBody: validateFirstName,
                                            autoClose: 2000,
                                        })
                                    } else if (validateLastName) {
                                        Toast.show({
                                            type: ALERT_TYPE.WARNING,
                                            textBody: validateLastName,
                                            autoClose: 2000,
                                        })
                                    } else {
                                        navigation.replace("ContactScreen");
                                    }
                                }}
                            >
                                <Text className="text-white font-bold text-lg">Sign Up</Text>
                            </Pressable>
                        </View>

                        {/* Footer Section */}
                        <View className="w-full items-center mt-6">
                            <Text className="text-slate-400 text-xs text-center px-4 mb-4">
                                By signing up, you agree to our Terms of Service and Privacy Policy.
                            </Text>

                            <Pressable
                            // onPress={() => navigation.navigate("SignInScreen")}
                            >
                                <Text className="text-slate-500 text-sm">
                                    Already have an account?{" "}
                                    <Text className="text-blue-600 font-semibold">Sign In</Text>
                                </Text>
                            </Pressable>

                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </AlertNotificationRoot>
    );
}
