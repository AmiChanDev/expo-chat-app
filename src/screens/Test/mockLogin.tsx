import { Button, Text, TextInput, View } from "react-native";
import { RootStackParamList } from "../../../App";
import { useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

type mockLoginNavigationProps = NativeStackNavigationProp<RootStackParamList, "MockLogin">;

type mockLoginProps = {
    setUserId: React.Dispatch<React.SetStateAction<number | null>>;
}

export default function MockLogin({ setUserId }: mockLoginProps) {
    const navigation = useNavigation<mockLoginNavigationProps>();
    const [text, setText] = useState<string>("");

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <View style={{ width: "100%", flex: 1, justifyContent: "center", alignItems: "center", padding: 16 }}>
                <View style={{ width: "100%", maxWidth: 400, alignItems: "center" }}>
                    <Text style={{ fontSize: 32, fontWeight: "bold", marginBottom: 32 }}>Mock Login Screen</Text>
                    <TextInput
                        placeholder="user ID"
                        style={{
                            borderWidth: 2,
                            borderColor: "#888",
                            borderRadius: 8,
                            marginBottom: 24,
                            padding: 16,
                            fontSize: 24,
                            width: "100%",
                            maxWidth: 300,
                            textAlign: "center"
                        }}
                        onChangeText={setText}
                        keyboardType="numeric"
                    />
                    <Button
                        title="Login & Go to App"
                        onPress={() => {
                            console.log('Entered userId:', text);
                            const uid = parseInt(text);

                            if (isNaN(uid) || uid <= 0) {
                                console.log('Invalid userId entered');
                                return;
                            }

                            console.log('Setting userId to:', uid);
                            setUserId(uid);
                            navigation.navigate("HomeTabs");
                        }}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}