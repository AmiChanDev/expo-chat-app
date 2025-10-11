import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View, Image } from "react-native";
import Animated, {
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
    useAnimatedStyle,
} from "react-native-reanimated";
import { FloatingBubblesDesign } from "../components/SplashDesigns";
import { useContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../App";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthContext } from "../socket/authProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";

type NavigationProp = NativeStackNavigationProp<
    RootStackParamList,
    "SplashScreen"
>;

export default function SplashScreen() {
    const navigation = useNavigation<NavigationProp>();
    const auth = useContext(AuthContext);

    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);

    useEffect(() => {
        //logo boom
        scale.value = withRepeat(
            withSequence(
                withTiming(1.1, { duration: 1200 }),
                withTiming(1, { duration: 1200 })
            ),
            -1,
            true
        );

        //fadeout and navigation logic
        const timer = setTimeout(() => {
            opacity.value = withTiming(0, { duration: 500 });
            setTimeout(() => {
                handleNavigation();
            }, 500);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    // Separate effect to handle navigation when auth state changes
    useEffect(() => {
        if (auth && !auth.isLoading) {
            // Only navigate after minimum splash time (2.5 seconds)
            const minSplashTime = 2500;
            const elapsedTime = Date.now() - (startTime || Date.now());
            const remainingTime = Math.max(0, minSplashTime - elapsedTime);

            setTimeout(() => {
                handleNavigation();
            }, remainingTime);
        }
    }, [auth?.isLoading, auth?.userId]);

    const [startTime] = useState(Date.now());

    // Debug function to clear AsyncStorage (uncomment to test fresh registration)
    // useEffect(() => {
    //     const clearStorage = async () => {
    //         await AsyncStorage.clear();
    //         console.log("AsyncStorage cleared for testing");
    //     };
    //     clearStorage();
    // }, []);

    const handleNavigation = () => {
        if (auth && !auth.isLoading) {
            if (auth.userId) {
                // User is logged in, go to HomeTabs
                console.log("User is authenticated, navigating to HomeTabs. User ID:", auth.userId);
                navigation.replace("HomeTabs");
            } else {
                // User is not logged in, go to SignUpScreen
                console.log("User is not authenticated, navigating to SignUpScreen");
                navigation.replace("SignUpScreen");
            }
        }
    };

    const fadeOutStyle = useAnimatedStyle(() => ({
        opacity: opacity.value,
    }));


    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-black">
            <StatusBar hidden={true} />

            <Animated.View
                className="flex-1 items-center justify-center w-full h-full"
                style={fadeOutStyle}
            >

                <Animated.View style={animatedStyle}>
                    <Image
                        source={require("../assets/logo.png")}
                        className="w-[220px] h-[220px]"
                        resizeMode="contain"
                    />
                </Animated.View>

                <FloatingBubblesDesign />

                <View className="absolute bottom-5 w-full items-center">
                    <Text className="text-base font-semibold text-black mb-1">
                        Powered By: {process.env.EXPO_PUBLIC_APP_OWNER || "Expo Chat App"}
                    </Text>
                    <Text className="text-sm font-medium text-gray-500">
                        Version: {process.env.EXPO_PUBLIC_APP_VERSION || "1.0.0"}
                    </Text>
                </View>
            </Animated.View>
        </SafeAreaView>


    );
}
