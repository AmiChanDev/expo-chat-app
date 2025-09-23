import { StatusBar } from "expo-status-bar";
import { Image, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from '@expo/vector-icons/AntDesign';
import { useState } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { useNavigation } from "@react-navigation/native";

type ContactScreenProps = NativeStackNavigationProp<RootStackParamList, 'ContactScreen'>;


export default function ContactScreen() {
    const [showCountryPicker, setShowCountryPicker] = useState(false);
    const [countryCode, setCountryCode] = useState("+94");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [isNextEnabled, setIsNextEnabled] = useState(false);

    const navigation = useNavigation<ContactScreenProps>();

    const handlePhoneChange = (text: string) => {
        setPhoneNumber(text);
        setIsNextEnabled(text.length >= 9 && /^\d+$/.test(text));
    };

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
            <StatusBar hidden={true} />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'android' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'android' ? 100 : 100}
            >
                <View className="flex-1 justify-between px-6 py-4">
                    {/* Top Section */}
                    <View>
                        {/* Header */}
                        <View className="flex-row items-center justify-between mb-8">
                            <Text className="text-xl font-semibold text-gray-800 dark:text-white">Phone Number</Text>
                            <View className="w-6" />
                        </View>

                        {/* Illustration */}
                        <View className="items-center mb-8">
                            <Image
                                source={require("../assets/contact.png")}
                                className="w-48 h-48 mt-3"
                            />
                        </View>

                        {/* Title & Description */}
                        <View className="mb-8">
                            <Text className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-4">
                                Add your phone number
                            </Text>
                            <Text className="text-gray-600 dark:text-gray-300 text-center text-base leading-relaxed">
                                We'll send you a verification code to confirm your number.
                                Your phone number will be private.
                            </Text>
                        </View>

                        {/* Phone Input */}
                        <View className="mb-8 mt-4">
                            {/* Country Code Selector */}
                            <Pressable
                                className="flex-row items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-2 border border-gray-200 dark:border-gray-700"
                                onPress={() => setShowCountryPicker(true)}
                            >
                                <View className="flex-row items-center">
                                    <AntDesign name="global" size={20} color="#6B7280" style={{ marginRight: 8 }} />
                                    <Text className="text-gray-700 dark:text-gray-300 font-medium">{countryCode}</Text>
                                </View>
                                <AntDesign name="caret-down" size={18} color="#6B7280" />
                            </Pressable>

                            {/* Phone Number Input */}
                            <View className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                                <TextInput
                                    placeholder="Enter phone number"
                                    placeholderTextColor="#9CA3AF"
                                    keyboardType="phone-pad"
                                    className="text-lg text-gray-900 dark:text-white"
                                    value={phoneNumber}
                                    onChangeText={handlePhoneChange}
                                    maxLength={10}
                                    style={{ color: '#111827', backgroundColor: 'transparent', paddingVertical: 0 }}
                                    returnKeyType="done"
                                />
                                {phoneNumber.length > 0 && (
                                    <Text className={`text-sm mt-2 ${phoneNumber.length >= 9 && /^\d+$/.test(phoneNumber)
                                        ? 'text-green-600 dark:text-green-400'
                                        : 'text-red-600 dark:text-red-400'
                                        }`}
                                    >
                                        {phoneNumber.length >= 9 && /^\d+$/.test(phoneNumber)
                                            ? '✓ Valid number'
                                            : `Enter ${Math.max(0, 10 - phoneNumber.length)} more digits`
                                        }
                                    </Text>
                                )}
                            </View>
                        </View>

                        {/* Privacy Info */}
                        <View className="px-4 py-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl mb-6">
                            <View className="flex-row items-start">
                                <AntDesign name="shake" size={16} color="#3B82F6" style={{ marginRight: 8, marginTop: 2 }} />
                                <Text className="text-sm text-gray-700 dark:text-gray-300 flex-1">
                                    Your phone number is private and only used for verification.
                                    We never share it with other users.
                                </Text>
                            </View>
                        </View>
                        <Text className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4 mb-6">
                            By continuing, you agree to our{' '}
                            <Text className="text-blue-600">Terms of Service</Text>
                        </Text>
                    </View>

                    {/* Bottom Action */}
                    <View className="pb-4">
                        <Pressable
                            className={`rounded-xl py-4 px-6 ${isNextEnabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                            disabled={!isNextEnabled}
                            onPress={() => { navigation.replace('AvatarScreen') }}
                        >
                            <Text className={`text-center text-white font-semibold text-lg ${isNextEnabled ? 'opacity-100' : 'opacity-50'}`}>
                                Continue
                            </Text>
                        </Pressable>
                    </View>

                    {/* Country Picker Modal */}
                    {showCountryPicker && (
                        <View className="absolute bg-black/50 justify-end inset-0">
                            <View className="bg-white dark:bg-gray-900 rounded-t-2xl p-4 max-h-[50%]">
                                <View className="flex-row justify-between items-center mb-4">
                                    <Text className="text-lg font-semibold text-gray-900 dark:text-white">Select Country</Text>
                                    <Pressable onPress={() => setShowCountryPicker(false)}>
                                        <AntDesign name="close" size={24} color="#6B7280" />
                                    </Pressable>
                                </View>
                                <Text className="text-gray-500 text-center">Country selection would go here</Text>
                            </View>
                        </View>
                    )}
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>

    );
}
