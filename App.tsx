import "./global.css"
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//screens
import SplashScreen from "./src/screens/SplashScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import ContactScreen from "./src/screens/ContactScreen";
import AvatarScreen from "./src/screens/AvatarScreen";
import SignInScreen from "./src/screens/SignInScreen";
import SignUpScreen from "./src/screens/SignUpScreen";
import SettingScreen from "./src/screens/SettingScreen";

import HomeTabs from "./src/screens/HomeTabs";

import { NavigationContainer } from "@react-navigation/native";
import { ThemeProvider } from "./src/theme/themeProvider";
import { UserRegistrationProvider } from "./src/components/UserContext";
import { AlertNotificationRoot } from "react-native-alert-notification";
import SingleChatScreen from "./src/screens/SingleChatScreen";

export type RootStackParamList = {
  SplashScreen: undefined;

  SignUpScreen: undefined;
  ContactScreen: undefined;
  AvatarScreen: undefined;
  SignInScreen: undefined;
  HomeTabs: undefined;

  SettingScreen: undefined;
  ProfileScreen: undefined;
  SingleChatScreen: {
    chatId: number;
    chatName: string;
    lastSeenTime: string;
    profileImage: string;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <AlertNotificationRoot>
      <ThemeProvider>
        <UserRegistrationProvider>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="HomeTabs" screenOptions={{ headerShown: false }}>
              <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
              <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false }} />
              <Stack.Screen name="ContactScreen" component={ContactScreen} options={{ headerShown: false }} />
              <Stack.Screen name="AvatarScreen" component={AvatarScreen} options={{ headerShown: false }} />
              <Stack.Screen name="SignInScreen" component={SignInScreen} options={{ headerShown: false }} />
              <Stack.Screen name="SignUpScreen" component={SignUpScreen} options={{ headerShown: false }} />
              <Stack.Screen name="SettingScreen" component={SettingScreen} options={{ headerShown: false }} />
              <Stack.Screen name="HomeTabs" component={HomeTabs} options={{ headerShown: false }} />
              <Stack.Screen name="SingleChatScreen" component={SingleChatScreen} options={{ headerShown: true }} />
            </Stack.Navigator>
          </NavigationContainer>
        </UserRegistrationProvider>
      </ThemeProvider>
    </AlertNotificationRoot>
  );
}
