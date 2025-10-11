import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ChatsScreen from "./HomeScreenTabs/ChatScreen";
import StatusScreen from "./HomeScreenTabs/StatusScreen";
import CallsScreen from "./HomeScreenTabs/CallScreen";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../theme/themeProvider";

const Tabs = createBottomTabNavigator();

export default function HomeTabs() {
  const { applied } = useTheme();

  return (
    <Tabs.Navigator
      screenOptions={({ route }) => {
        const isDark = applied === "dark";

        return {
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = "chatbubble-ellipses";
            if (route.name === "Chats") iconName = "chatbubble-ellipses";
            else if (route.name === "Status") iconName = "radio-button-on";
            else if (route.name === "Calls") iconName = "call";

            return (
              <Ionicons
                name={iconName as any}
                size={focused ? 26 : 24}
                color={color}
              />
            );
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
            marginTop: 4,
            marginBottom: 8,
          },
          tabBarActiveTintColor: "#3b82f6", // Blue-500
          tabBarInactiveTintColor: isDark ? "#6b7280" : "#9ca3af", // Gray-500 : Gray-400
          tabBarStyle: {
            height: 88,
            backgroundColor: isDark ? "#1f2937" : "#ffffff", // Gray-800 : White
            borderTopWidth: 1,
            borderTopColor: isDark ? "#374151" : "#f3f4f6", // Gray-700 : Gray-100
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
          },
          tabBarItemStyle: {
            paddingVertical: 4,
          },
          headerStyle: {
            backgroundColor: isDark ? '#1f2937' : '#f8fafc', // Gray-800 : Slate-50
            shadowColor: 'transparent',
            elevation: 0,
          },
          headerTitleStyle: {
            color: isDark ? '#f9fafb' : '#1f2937', // Gray-50 : Gray-800
            fontSize: 20,
            fontWeight: '700',
          },
        };
      }}
    >
      <Tabs.Screen
        name="Chats"
        component={ChatsScreen}
        options={{
          headerShown: false,
          tabBarBadge: undefined, // Can be used for unread count
        }}
      />
      <Tabs.Screen
        name="Status"
        component={StatusScreen}
        options={{
          headerTitle: "Updates",
        }}
      />
      <Tabs.Screen
        name="Calls"
        component={CallsScreen}
        options={{
          headerTitle: "Calls",
        }}
      />
    </Tabs.Navigator>
  );
}
