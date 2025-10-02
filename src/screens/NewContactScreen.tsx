import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useLayoutEffect, useState } from "react";
import { Pressable, Text, TouchableOpacity, View, Alert, ScrollView } from "react-native";
import { RootStackParamList } from "../../App";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FloatingLabelInput } from "react-native-floating-label-input";
import CountryPicker, { Country, CountryCode } from "react-native-country-picker-modal";
import { useSendNewContact } from "../socket/useSendNewContact";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import * as Validation from "../util/Validation";

type NewContactScreenProps = NativeStackNavigationProp<RootStackParamList, "NewChatScreen">;

export default function NewContactScreen() {
    const navigation = useNavigation<NewContactScreenProps>();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNo, setPhoneNo] = useState("");
    const [countryCode, setCountryCode] = useState<CountryCode>('LK');
    const [country, setCountry] = useState<Country | null>(null);
    const [callingCode, setCallingCode] = useState('+94');
    const [showCountryPicker, setShowCountryPicker] = useState(false);

    const newContact = useSendNewContact();
    const sendNewContact = newContact.sendNewContact;
    const responseText = newContact.responseText;

    const sendData = () => {
        if (firstName === "") {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: "Error",
                textBody: "Please enter first name",
            });
        } else if (lastName === "") {
            Toast.show({
                type: ALERT_TYPE.DANGER,
                title: "Error",
                textBody: "Please enter last name",
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
                firstName: firstName,
                lastName: lastName,
                countryCode: callingCode,
                contactNo: phoneNo,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                status: "ACTIVE",
            });
            setFirstName("");
            setLastName("");
            setCallingCode("")
            setPhoneNo("");
        }

    };

    const onCountrySelect = (selectedCountry: Country) => {
        setCountryCode(selectedCountry.cca2);
        setCountry(selectedCountry);
        setCallingCode(selectedCountry.callingCode[0]);
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            title: "",
            headerStyle: {
                backgroundColor: '#f8fafc',
            },
            headerLeft: () => (
                <View className="flex-row items-center">
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="mr-4 p-2 rounded-full active:bg-gray-100"
                        activeOpacity={0.7}
                    >
                        <Ionicons name="arrow-back" size={24} color="#374151" />
                    </TouchableOpacity>
                    <View>
                        <Text className="text-lg font-semibold text-gray-900">New Contact</Text>
                    </View>
                </View>
            ),
            headerRight: () => (
                <View className="flex-row gap-2">
                    <TouchableOpacity className="p-2 rounded-full active:bg-gray-100" activeOpacity={0.7}>
                        <Ionicons name="ellipsis-vertical" size={22} color="#374151" />
                    </TouchableOpacity>
                </View>
            ),
        });
    }, [navigation]);

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Profile Picture Section */}
                <View className="items-center py-8 bg-white mx-4 mt-4 rounded-2xl shadow-sm border border-gray-100">
                    <View className="relative">
                        <View className="w-24 h-24 rounded-full bg-gray-200 justify-center items-center border-4 border-white shadow-lg">
                            <Ionicons name="person" size={40} color="#9ca3af" />
                        </View>
                        <TouchableOpacity
                            className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-blue-500 justify-center items-center shadow-lg border-2 border-white"
                            activeOpacity={0.8}
                        >
                            <Ionicons name="camera" size={16} color="white" />
                        </TouchableOpacity>
                    </View>
                    <Text className="text-sm text-gray-500 mt-3">Add Photo</Text>
                </View>

                {/* Form Fields */}
                <View className="px-4 py-6 space-y-4">
                    {/* First Name */}
                    <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                        <FloatingLabelInput
                            label="First Name"
                            value={firstName}
                            onChangeText={setFirstName}
                            containerStyles={{
                                borderWidth: 0,
                                paddingHorizontal: 0,
                                backgroundColor: 'transparent'
                            }}
                            inputStyles={{
                                fontSize: 16,
                                color: '#374151'

                            }}
                            labelStyles={{
                                fontSize: 14,
                                color: '#6b7280'
                            }}
                        />
                    </View>

                    {/* Last Name */}
                    <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                        <FloatingLabelInput
                            label="Last Name"
                            value={lastName}
                            onChangeText={setLastName}
                            containerStyles={{
                                borderWidth: 0,
                                paddingHorizontal: 0,
                                backgroundColor: 'transparent'
                            }}
                            inputStyles={{
                                fontSize: 16,
                                color: '#374151'
                            }}
                            labelStyles={{
                                fontSize: 14,
                                color: '#6b7280'
                            }}
                        />
                    </View>

                    {/* Phone Number */}
                    <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                        <View className="flex-row items-center">
                            <Ionicons name="call-outline" size={20} color="#9ca3af" style={{ marginRight: 12 }} />
                            <View className="flex-1">
                                <Text className="text-sm text-gray-500 mb-2">Phone Number</Text>
                                <View className="flex-row items-center">
                                    {/* Country Code Picker */}
                                    <TouchableOpacity
                                        className="flex-row items-center bg-gray-50 px-2 py-2 rounded-lg mr-2 border border-gray-200"
                                        onPress={() => setShowCountryPicker(true)}
                                        activeOpacity={0.7}
                                    >
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
                                        <Ionicons name="chevron-down" size={14} color="#9ca3af" style={{ marginLeft: 4 }} />
                                    </TouchableOpacity>

                                    {/* Phone Number Input */}
                                    <View className="flex-1">
                                        <FloatingLabelInput
                                            label="Enter phone number"
                                            keyboardType="phone-pad"
                                            value={phoneNo}
                                            onChangeText={setPhoneNo}
                                            containerStyles={{
                                                borderWidth: 0,
                                                paddingHorizontal: 0,
                                                backgroundColor: 'transparent'
                                            }}
                                            inputStyles={{
                                                fontSize: 16,
                                                color: '#374151'
                                            }}
                                            labelStyles={{
                                                fontSize: 14,
                                                color: '#6b7280'
                                            }}
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Additional Options */}
                {/* <View className="px-4 py-2">
                    <View className="bg-white rounded-2xl shadow-sm border border-gray-100">
                        <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-gray-100" activeOpacity={0.7}>
                            <View className="flex-row items-center">
                                <Ionicons name="star-outline" size={20} color="#9ca3af" style={{ marginRight: 12 }} />
                                <Text className="text-base text-gray-700">Add to Favorites</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
                        </TouchableOpacity>

                        <TouchableOpacity className="flex-row items-center justify-between p-4" activeOpacity={0.7}>
                            <View className="flex-row items-center">
                                <Ionicons name="notifications-outline" size={20} color="#9ca3af" style={{ marginRight: 12 }} />
                                <Text className="text-base text-gray-700">Notification Settings</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
                        </TouchableOpacity>
                    </View>
                </View> */}
            </ScrollView>

            {/* Add Contact Button */}
            <SafeAreaView className="bg-white border-t border-gray-100" edges={["bottom"]}>
                <View className="px-4 py-4">
                    <TouchableOpacity
                        className="bg-blue-500 py-4 rounded-2xl shadow-lg"
                        activeOpacity={0.8}
                        onPress={sendData}
                    >
                        <Text className="text-white text-center text-lg font-semibold">
                            Add to Contacts
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </SafeAreaView>
    );

}