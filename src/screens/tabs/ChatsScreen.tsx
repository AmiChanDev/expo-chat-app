import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import HomeScreen from "../chatTabs/HomeScreen";
import SettingScreen from "../chatTabs/SettingScreen";
import NewChatScreen from "../chatTabs/NewChatScreen";

export type ChatStackParamList = {
  HomeScreen: undefined;
  SettingScreen: undefined;
  NewChatScreen: undefined;
};

const Stack = createNativeStackNavigator();

export default function ChatsScreen() {
  return (
    <Stack.Navigator initialRouteName="HomeScreen">
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="SettingScreen"
        component={SettingScreen}
        options={{
          title: "Settings"
        }}
      />
      <Stack.Screen
        name="NewChatScreen"
        component={NewChatScreen}
        options={{
          title: "New Chat"
        }}
      />
    </Stack.Navigator>
  );

}