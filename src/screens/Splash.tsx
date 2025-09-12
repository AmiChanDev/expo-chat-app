import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View, Image } from "react-native";
import Animated, {
    FadeIn,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
    useAnimatedStyle,
} from "react-native-reanimated";
import CircleShape from "../components/CircleShape";
import { useEffect } from "react";

export default function SplashScreen() {
    // shared value for scaling
    const scale = useSharedValue(1);

    useEffect(() => {
        scale.value = withRepeat(
            withSequence(
                withTiming(1.1, { duration: 1200 }),
                withTiming(1, { duration: 1200 })
            ),
            -1,
            true
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    return (
        <SafeAreaView className="flex-1 justify-center items-center bg-white">
            <StatusBar hidden={true} />

            {/* Animated Logo */}
            <Animated.View style={animatedStyle}>
                <Image
                    source={require("../assets/logo.png")}
                    className="w-[220px] h-[220px]"
                />
            </Animated.View>

            {/* Static Circles */}
            <CircleShape width={300} height={300} borderRadius={150} fillColor="#E0E7FF" top={-150} left={-110} />
            <CircleShape width={200} height={200} borderRadius={100} fillColor="#C7D2FE" bottom={-100} right={-110} />
            <CircleShape width={150} height={150} borderRadius={75} fillColor="#A5B4FC" top={50} right={-90} />
            <CircleShape width={100} height={100} borderRadius={100} fillColor="#818CF8" bottom={50} left={-50} />

            {/* Footer */}
            <View className="absolute bottom-5 items-center justify-center">
                <Text className="text-base font-semibold text-black mb-1">
                    Powered By: {process.env.EXPO_PUBLIC_APP_OWNER}
                </Text>
                <Text className="text-sm font-medium text-gray-500">
                    Version: {process.env.EXPO_PUBLIC_APP_VERSION}
                </Text>
            </View>
        </SafeAreaView>
    );
}
