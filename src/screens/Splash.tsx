import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image, Text, View } from "react-native";
import { StyleSheet } from "react-native";


export default function SplashScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar hidden={true} />
            <Image source={require("../assets/logo.png")} style={{ width: 220, height: 220 }} />

            <View style={styles.bottomContainer}>
                <Text style={styles.companyName}>Powered By: {process.env.EXPO_PUBLIC_APP_OWNER}</Text>
                <Text style={styles.appVersion}>Version: {process.env.EXPO_PUBLIC_APP_VERSION}</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 20,
        display: 'flex',
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    companyName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    appVersion: {
        fontSize: 14,
        fontWeight: '500',
        color: '#888',
        marginBottom: 8,
    }
});