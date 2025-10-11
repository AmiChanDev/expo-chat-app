import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import HomeScreen from "../ChatScreenTabs/HomeScreen";
import SettingScreen from "../ChatScreenTabs/SettingScreen";
import NewChatScreen from "../ChatScreenTabs/NewChatScreen";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useLayoutEffect } from "react";
import { useTheme } from "../../theme/themeProvider";

export type ChatStackParamList = {
  HomeScreen: undefined;
  SettingScreen: undefined;
  NewChatScreen: undefined;
  mockLogin: undefined;
};

const Stack = createNativeStackNavigator();

export default function ChatScreen() {
  const navigation = useNavigation();
  const { applied } = useTheme();

  const getTabBarStyle = () => {
    const isDark = applied === "dark";
    return {
      display: 'flex' as const,
      height: 88,
      backgroundColor: isDark ? "#1f2937" : "#ffffff",
      borderTopWidth: 1,
      borderTopColor: isDark ? "#374151" : "#f3f4f6",
      paddingTop: 8,
      paddingBottom: 8,
      paddingHorizontal: 16,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: -2,
      },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 4,
      elevation: 8,
    };
  };

  return (
    <Stack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{
        headerShown: true
      }}
    >
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          headerShown: true
        }}
        listeners={({ navigation }) => ({
          focus: () => {
            // Ensure tab bar is shown when HomeScreen is focused
            navigation.getParent()?.setOptions({
              tabBarStyle: getTabBarStyle()
            });
          },
        })}
      />
      <Stack.Screen
        name="SettingScreen"
        component={SettingScreen}
        options={{
          title: "Settings"
        }}
        listeners={({ navigation }) => ({
          focus: () => {
            // Hide tab bar when SettingScreen is focused
            navigation.getParent()?.setOptions({
              tabBarStyle: { display: 'none' }
            });
          },
          blur: () => {
            // Show tab bar when leaving SettingScreen
            navigation.getParent()?.setOptions({
              tabBarStyle: getTabBarStyle()
            });
          },
        })}
      />
      <Stack.Screen
        name="NewChatScreen"
        component={NewChatScreen}
        options={{
          title: "New Chat"
        }}
        listeners={({ navigation }) => ({
          focus: () => {
            // Hide tab bar when NewChatScreen is focused
            navigation.getParent()?.setOptions({
              tabBarStyle: { display: 'none' }
            });
          },
          blur: () => {
            // Show tab bar when leaving NewChatScreen
            navigation.getParent()?.setOptions({
              tabBarStyle: getTabBarStyle()
            });
          },
        })}
      />
    </Stack.Navigator>
  );
}