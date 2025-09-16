import "./global.css";
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//screens
import SplashScreen from "./src/screens/SplashScreen";
import HomeScreen from "./src/screens/HomeScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import SignInScreen from "./src/screens/SignInScreen";
import SignUpScreen from "./src/screens/SignUpScreen";
import SettingScreen from "./src/screens/SettingScreen";

import { NavigationContainer } from "@react-navigation/native";

type rootStackParamList = {
  SplashScreen: undefined;
  HomeScreen: undefined;
  ProfileScreen: undefined;
  SignInScreen: undefined;
  SignUpScreen: undefined;
  SettingScreen: undefined;
};

const Stack = createNativeStackNavigator<rootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="SignInScreen" component={SignInScreen} />
        <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
        <Stack.Screen name="SettingScreen" component={SettingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
