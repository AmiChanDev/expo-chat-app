import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useLayoutEffect, useState, useEffect } from "react";
import { Pressable, Text, TouchableOpacity, View, Alert, ScrollView } from "react-native";
import { RootStackParamList } from "../../../App";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FloatingLabelInput } from "react-native-floating-label-input";
import CountryPicker, { Country, CountryCode } from "react-native-country-picker-modal";
import { useSendNewContact } from "../../socket/useSendNewContact";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { useTheme } from "../../theme/themeProvider";
import { StatusBar } from "expo-status-bar";
import * as Validation from "../../util/Validation";

type NewContactScreenProps = NativeStackNavigationProp<RootStackParamList, "NewChatScreen">;

export default function NewContactScreen() {
    const navigation = useNavigation<NewContactScreenProps>();
    const { applied } = useTheme();
    const isDark = applied === 'dark';

    const [displayName, setdisplayName] = useState("");
    const [phoneNo, setPhoneNo] = useState("");
    const [callingCode, setCallingCode] = useState('+94');
    const [countryCode, setCountryCode] = useState<CountryCode>('LK');
    const [country, setCountry] = useState<Country | null>(null);
    const [showCountryPicker, setShowCountryPicker] = useState(false);

    const newContact = useSendNewContact();
    const sendNewContact = newContact.sendNewContact;
    const responseText = newContact.responseText;
    const responseStatus = newContact.responseStatus;

    const sendData = () => {
        if (displayName === "") {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: "Error",
                textBody: "Please enter display name",
            });
        } else if (phoneNo === "") {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: "Error",
                textBody: "Please enter phone number",
            });
        } else {
            console.log("Saving new contact...");
            sendNewContact({
                id: 0,
                firstName: "",
                lastName: "",
                displayName: displayName,
                countryCode: callingCode,
                contactNo: phoneNo,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                status: "ACTIVE",
            });
            setdisplayName("");
            setPhoneNo("");
        }
    };

    useEffect(() => {
        if (responseStatus !== null) {
            if (responseStatus) {
                Toast.show({
                    type: ALERT_TYPE.SUCCESS,
                    title: "Success",
                    textBody: responseText || "Contact saved successfully",
                });
            } else {
                Toast.show({
                    type: ALERT_TYPE.DANGER,
                    title: "Error",
                    textBody: responseText || "Failed to save contact",
                });
            }
        }
    }, [responseStatus, responseText]);

    const onCountrySelect = (selectedCountry: Country) => {
        setCountryCode(selectedCountry.cca2);
        setCountry(selectedCountry);
        setCallingCode(selectedCountry.callingCode[0]);
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "",
            headerStyle: {
                backgroundColor: isDark ? '#1f2937' : '#f8fafc',
            },
            headerLeft: () => (
                <View className="flex-row items-center">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className={`mr-4 p-2 rounded-full ${isDark ? 'active:bg-gray-700' : 'active:bg-gray-100'}`}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="arrow-back" size={24} color={isDark ? "#f9fafb" : "#374151"} />
                    </TouchableOpacity>
                    <View>
                        <Text className={`text-lg font-bold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
                            New Contact
                        </Text>
                        <Text className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            Add a new friend
                        </Text>
                    </View>
                </View>
            ),
            headerRight: () => (
                <View className="flex-row gap-2 mr-4">
                    <TouchableOpacity
                        className={`p-2 rounded-full ${isDark ? 'active:bg-gray-700' : 'active:bg-gray-100'}`}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="person-add" size={22} color={isDark ? "#f9fafb" : "#374151"} />
                    </TouchableOpacity>
                </View>
            ),
        });
    }, [navigation, isDark]);

    return (
        <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <StatusBar style={isDark ? 'light' : 'dark'} />

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Welcome Section */}
                <View className="px-4 pt-6 pb-2">
                    <Text className={`text-2xl font-bold ${isDark ? 'text-gray-100' : 'text-gray-800'} mb-2`}>
                        Add New Contact
                    </Text>
                    <Text className={`text-base ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
                        Fill in the details below to add a new contact to your address book. Both fields are required to proceed.
                    </Text>
                </View>

                {/* Form Fields */}
                <View className="mx-4 space-y-6">
                    {/* Display Name */}
                    <View className={`${isDark ? 'bg-slate-800/90 border-slate-700/50' : 'bg-white border-slate-200/60'} 
                                    backdrop-blur-sm rounded-3xl p-6 shadow-lg shadow-black/5 border`}>
                        <View className="flex-row items-start mb-5">
                            <View className={`w-11 h-11 rounded-2xl ${isDark ? 'bg-blue-500/20' : 'bg-blue-50'} 
                                          justify-center items-center mr-4 mt-1`}>
                                <Ionicons name="person-outline" size={20} color={isDark ? "#60a5fa" : "#3b82f6"} />
                            </View>
                            <View className="flex-1">
                                <Text className={`text-xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'} mb-1`}>
                                    Display Name
                                </Text>
                                <Text className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'} leading-relaxed`}>
                                    This is how the contact will appear in your contact list
                                </Text>
                            </View>
                        </View>

                        <View className={`${isDark ? 'bg-slate-700/40' : 'bg-slate-50/80'} rounded-2xl border ${isDark ? 'border-slate-600/30' : 'border-slate-200/50'}`}>
                            <FloatingLabelInput
                                label="Enter display name (required)"
                                value={displayName}
                                onChangeText={setdisplayName}
                                containerStyles={{
                                    borderWidth: 0,
                                    paddingHorizontal: 0,
                                    backgroundColor: 'transparent',
                                    height: 64
                                }}
                                inputStyles={{
                                    fontSize: 18,
                                    fontWeight: '600',
                                    color: isDark ? '#f1f5f9' : '#1e293b',
                                    paddingVertical: 12,
                                    letterSpacing: 0.3
                                }}
                                labelStyles={{
                                    fontSize: 15,
                                    fontWeight: '500',
                                    color: isDark ? '#94a3b8' : '#64748b'
                                }}
                            />
                        </View>
                    </View>

                    {/* Phone Number */}
                    <View className={`mt-4 ${isDark ? 'bg-slate-800/90 border-slate-700/50' : 'bg-white border-slate-200/60'} 
                                    backdrop-blur-sm rounded-3xl p-6 shadow-lg shadow-black/5 border`}>
                        <View className="flex-row items-start mb-5">
                            <View className={`w-11 h-11 rounded-2xl ${isDark ? 'bg-emerald-500/20' : 'bg-emerald-50'} 
                                          justify-center items-center mr-4 mt-1`}>
                                <Ionicons name="call-outline" size={20} color={isDark ? "#34d399" : "#059669"} />
                            </View>
                            <View className="flex-1">
                                <Text className={`text-xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'} mb-1`}>
                                    Phone Number
                                </Text>
                                <Text className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'} leading-relaxed`}>
                                    Select country code and enter the phone number
                                </Text>
                            </View>
                        </View>

                        <View className="flex-row items-stretch gap-3">
                            {/* Country Code Picker */}
                            <TouchableOpacity
                                className={`${isDark ? 'bg-slate-700/60 border-slate-600/40' : 'bg-slate-100/80 border-slate-300/40'} 
                                         `}
                                onPress={() => setShowCountryPicker(true)}
                                activeOpacity={0.8}
                            >
                                <View className="flex-row items-center">
                                    <CountryPicker
                                        countryCode={countryCode}
                                        withFilter
                                        withFlag
                                        withCallingCode
                                        withCallingCodeButton
                                        onSelect={onCountrySelect}
                                        visible={showCountryPicker}
                                        onClose={() => setShowCountryPicker(false)}
                                        containerButtonStyle={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                        }}
                                    />
                                    <View className={`ml-2 w-5 h-5 rounded-full ${isDark ? 'bg-slate-600' : 'bg-slate-300'} 
                                                  justify-center items-center`}>
                                        <Ionicons name="chevron-down" size={12} color={isDark ? "#94a3b8" : "#64748b"} />
                                    </View>
                                </View>
                            </TouchableOpacity>

                            {/* Phone Number Input */}
                            <View className={`flex-1 ${isDark ? 'bg-slate-700/40' : 'bg-slate-50/80'} rounded-2xl  border ${isDark ? 'border-slate-600/30' : 'border-slate-200/50'}`}>
                                <FloatingLabelInput
                                    label="Phone number (required)"
                                    keyboardType="phone-pad"
                                    value={phoneNo}
                                    onChangeText={setPhoneNo}
                                    containerStyles={{
                                        borderWidth: 0,
                                        paddingHorizontal: 0,
                                        backgroundColor: 'transparent',
                                        height: 64
                                    }}
                                    inputStyles={{
                                        fontSize: 18,
                                        fontWeight: '600',
                                        color: isDark ? '#f1f5f9' : '#1e293b',
                                        paddingVertical: 12,
                                        letterSpacing: 0.3
                                    }}
                                    labelStyles={{
                                        fontSize: 15,
                                        fontWeight: '500',
                                        color: isDark ? '#94a3b8' : '#64748b'
                                    }}
                                />
                            </View>
                        </View>

                        <View className={`mt-4 px-2 py-3 ${isDark ? 'bg-slate-700/30' : 'bg-slate-100/50'} rounded-xl`}>
                            <Text className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'} text-center`}>
                                💡 Example: 771234567 (without country code)
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Instructions Section */}
                <View className="mx-4 mt-6">
                    <View className={`${isDark ? 'bg-indigo-900/30 border-indigo-700/40' : 'bg-indigo-50/80 border-indigo-200/60'} 
                                    backdrop-blur-sm rounded-3xl p-5 border shadow-sm`}>
                        <View className="flex-row items-start">
                            <View className={`w-10 h-10 rounded-2xl ${isDark ? 'bg-indigo-500/20' : 'bg-indigo-100'} 
                                          justify-center items-center mr-4 mt-0.5`}>
                                <Ionicons name="information-circle-outline" size={18} color={isDark ? "#a5b4fc" : "#6366f1"} />
                            </View>
                            <View className="flex-1">
                                <Text className={`text-base font-bold ${isDark ? 'text-indigo-200' : 'text-indigo-900'} mb-3`}>
                                    Quick Tips
                                </Text>
                                <View className="space-y-2">
                                    <Text className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'} leading-6`}>
                                        • Make sure the display name is easy to recognize
                                    </Text>
                                    <Text className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'} leading-6`}>
                                        • Enter the phone number without the country code
                                    </Text>
                                    <Text className={`text-sm font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'} leading-6`}>
                                        • Double-check the country code before saving
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Bottom Spacing */}
                <View className="h-24" />
            </ScrollView>
            {/* Add Contact Button - Fixed at bottom */}
            <SafeAreaView className={`${isDark ? 'bg-slate-900/95 border-slate-700/30' : 'bg-white/95 border-slate-200/50'}`}>
                <View className="mx-4 my-6">
                    <TouchableOpacity
                        activeOpacity={0.85}
                        onPress={sendData}
                        className="bg-blue-600 rounded-2xl py-4 flex-row items-center justify-center"
                    >
                        <Text className="text-white text-center text-lg font-bold">
                            Save Contact
                        </Text>
                    </TouchableOpacity>
                    <Text className={`text-center text-xs font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'} mt-4 tracking-wide`}>
                        This contact will be added to your address book
                    </Text>
                </View>
            </SafeAreaView>
        </SafeAreaView>
    );
}