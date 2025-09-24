import { createNativeStackNavigator } from '@react-navigation/native-stack';

//screens
import SplashScreen from "./src/screens/SplashScreen";
import HomeScreen from "./src/screens/HomeScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import ContactScreen from "./src/screens/ContactScreen";
import AvatarScreen from "./src/screens/AvatarScreen";
import SignInScreen from "./src/screens/SignInScreen";
import SignUpScreen from "./src/screens/SignUpScreen";
import SettingScreen from "./src/screens/SettingScreen";

import { NavigationContainer } from "@react-navigation/native";
import { ThemeProvider } from "./src/theme/themeProvider";
import { UserRegistrationProvider } from "./src/components/UserContext";

export type RootStackParamList = {
  SplashScreen: undefined;
  HomeScreen: undefined;
  ProfileScreen: undefined;
  ContactScreen: undefined;
  AvatarScreen: undefined;
  SignInScreen: undefined;
  SignUpScreen: undefined;
  SettingScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <ThemeProvider>
      <UserRegistrationProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="SignUpScreen" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
            <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ContactScreen" component={ContactScreen} options={{ headerShown: false }} />
            <Stack.Screen name="AvatarScreen" component={AvatarScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SignInScreen" component={SignInScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SignUpScreen" component={SignUpScreen} options={{ headerShown: false }} />
            <Stack.Screen name="SettingScreen" component={SettingScreen} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </UserRegistrationProvider>
    </ThemeProvider>
  );
}
