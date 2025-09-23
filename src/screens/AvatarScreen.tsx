import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

export default function AvatarScreen() {
    const [image, setImage] = useState<String | null>(null);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        (!result.canceled) ? setImage(result.assets[0].uri) : null;
    }

    return (
        <SafeAreaView>
            <Text>Avatar Screen</Text>
        </SafeAreaView>
    );
}