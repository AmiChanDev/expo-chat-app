import "./global.css"
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//screens
import SplashScreen from "./src/screens/SplashScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import ContactScreen from "./src/screens/ContactScreen";
import AvatarScreen from "./src/screens/AvatarScreen";
import SignInScreen from "./src/screens/SignInScreen";
import SignUpScreen from "./src/screens/SignUpScreen";
import HomeTabs from "./src/screens/HomeTabs";
import NewContactScreen from "./src/screens/NewContactScreen";

// Chat Screen Tabs
import HomeScreen from "./src/screens/ChatScreenTabs/HomeScreen";
import SingleChatScreen from "./src/screens/ChatScreenTabs/SingleChatScreen";
import SettingScreen from "./src/screens/ChatScreenTabs/SettingScreen";

import NewChatScreen from "./src/screens/ChatScreenTabs/NewChatScreen";

//Testing
import MockLogin from "./src/screens/Test/mockLogin";

import { NavigationContainer } from "@react-navigation/native";
import { ThemeProvider } from "./src/theme/themeProvider";
import { UserRegistrationProvider } from "./src/components/UserContext";
import { AlertNotificationRoot } from "react-native-alert-notification";
import { useContext, useState, useEffect } from "react";

import { WebSocketProvider } from "./src/socket/WebSocketProvider";
import { useWebSocketPing } from "./src/socket/useWebSocketPing";
import { AuthProvider, AuthContext } from "./src/socket/authProvider";

export type RootStackParamList = {
  SplashScreen: undefined;

  SignUpScreen: undefined;
  ContactScreen: undefined;
  AvatarScreen: undefined;
  SignInScreen: undefined;
  HomeTabs: undefined;
  HomeScreen: undefined | { userId: number, fromScreen: string };
  MockLogin: undefined; //Testing login screen
  SettingScreen: undefined;
  ProfileScreen: undefined;
  SingleChatScreen: {
    chatId: number;
    friendName: string;
    lastSeenTime: string;
    profileImage: string;
  };
  NewChatScreen: undefined;
  NewContactScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
//this page has all the screens and navigation between them
//ChatScreenTabs has 3 tabs: Home, Status, Calls
//HomeScreen has 3 tabs in one page: Home,newChat,Settings
function ChatApp() {
  useWebSocketPing();
  return null;
}

export default function App() {
  return (
    <AlertNotificationRoot>
      <AuthProvider>
        <AuthBasedWebSocketProvider>
          <ThemeProvider>
            <UserRegistrationProvider>
              <AppNavigation />
            </UserRegistrationProvider>
          </ThemeProvider>
        </AuthBasedWebSocketProvider>
      </AuthProvider>
    </AlertNotificationRoot>
  );
}

// Component that provides WebSocket based on auth context
function AuthBasedWebSocketProvider({ children }: { children: React.ReactNode }) {
  const auth = useContext(AuthContext);

  // Convert string userId to number, default to 0 if not available
  const userId = auth?.userId ? parseInt(auth.userId, 10) : 0;

  // Debug logging when auth state changes
  useEffect(() => {
    console.log("=== AuthBasedWebSocketProvider Debug ===");
    console.log("auth.userId:", auth?.userId);
    console.log("auth.isLoading:", auth?.isLoading);
    console.log("converted userId:", userId);
  }, [auth?.userId, auth?.isLoading, userId]);

  return (
    <WebSocketProvider userId={userId}>
      <ChatApp />
      {children}
    </WebSocketProvider>
  );
}

// Main App Navigation Component
function AppNavigation() {
  const auth = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ContactScreen" component={ContactScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AvatarScreen" component={AvatarScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SignInScreen" component={SignInScreen} options={{ headerShown: false }} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: true }} />
        <Stack.Screen name="HomeTabs" component={HomeTabs} options={{ headerShown: false }} />
        <Stack.Screen name="SingleChatScreen" component={SingleChatScreen} options={{ headerShown: true }} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: true }} />
        <Stack.Screen name="SettingScreen" component={SettingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="NewChatScreen" component={NewChatScreen} options={{ headerShown: true }} />
        <Stack.Screen name="NewContactScreen" component={NewContactScreen} options={{ headerShown: true }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
