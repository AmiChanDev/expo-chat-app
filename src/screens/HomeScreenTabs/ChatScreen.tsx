import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import HomeScreen from "../ChatScreenTabs/HomeScreen";
import SettingScreen from "../ChatScreenTabs/SettingScreen";
import NewChatScreen from "../ChatScreenTabs/NewChatScreen";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useLayoutEffect } from "react";

export type ChatStackParamList = {
  HomeScreen: undefined;
  SettingScreen: undefined;
  NewChatScreen: undefined;
  mockLogin: undefined;
};

const Stack = createNativeStackNavigator();

export default function ChatScreen() {
  const navigation = useNavigation();

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
              tabBarStyle: {
                display: 'flex',
                height: 88,
                backgroundColor: "#ffffff",
                borderTopWidth: 1,
                borderTopColor: "#f3f4f6",
                paddingTop: 8,
                paddingBottom: 8,
                paddingHorizontal: 16,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: -2,
                },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 8,
              }
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
              tabBarStyle: {
                display: 'flex',
                height: 88,
                backgroundColor: "#ffffff",
                borderTopWidth: 1,
                borderTopColor: "#f3f4f6",
                paddingTop: 8,
                paddingBottom: 8,
                paddingHorizontal: 16,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: -2,
                },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 8,
              }
            });
          },
        })}
      />
    </Stack.Navigator>
  );
}