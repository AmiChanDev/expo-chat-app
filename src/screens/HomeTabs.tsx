import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ChatsScreen from "./HomeScreenTabs/ChatScreen";
import StatusScreen from "./HomeScreenTabs/StatusScreen";
import CallsScreen from "./HomeScreenTabs/CallScreen";
import { Ionicons } from "@expo/vector-icons";

const Tabs = createBottomTabNavigator();

export default function HomeTabs() {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
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
        tabBarInactiveTintColor: "#9ca3af", // Gray-400
        tabBarStyle: {
          height: 88,
          backgroundColor: "#ffffff",
          borderTopWidth: 1,
          borderTopColor: "#f3f4f6", // Gray-100
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
        },
        tabBarItemStyle: {
          paddingVertical: 4,
        },
        headerStyle: {
          backgroundColor: '#f8fafc', // Slate-50
          shadowColor: 'transparent',
          elevation: 0,
        },
        headerTitleStyle: {
          color: '#1f2937', // Gray-800
          fontSize: 20,
          fontWeight: '700',
        },
      })}
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
          headerTitleStyle: {
            color: '#1f2937',
            fontSize: 20,
            fontWeight: '700',
          },
        }}
      />
      <Tabs.Screen
        name="Calls"
        component={CallsScreen}
        options={{
          headerTitle: "Calls",
          headerTitleStyle: {
            color: '#1f2937',
            fontSize: 20,
            fontWeight: '700',
          },
        }}
      />
    </Tabs.Navigator>
  );
}
