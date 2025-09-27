import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import HomeScreen from "../HomeScreen";
import SettingScreen from "../SettingScreen";
import NewChatScreen from "../NewChatScreen";

export type ChatStackParamList = {
  HomeScreen: undefined;
  SettingScreen: undefined;
  NewChatScreen: undefined;
};

const Stack = createNativeStackNavigator();

export default function ChatsScreen() {
  return (
    <Stack.Navigator initialRouteName="HomeScreen">
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="SettingScreen" component={SettingScreen} />
      <Stack.Screen name="NewChatScreen" component={NewChatScreen} />
    </Stack.Navigator>
  );

}