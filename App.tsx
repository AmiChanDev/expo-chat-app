import "./global.css";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from "./src/screens/Splash";
import { NavigationContainer } from "@react-navigation/native";

type rootStackParamList = {
  Splash: undefined;
};

const Stack = createNativeStackNavigator<rootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
