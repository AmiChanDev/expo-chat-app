# Component Documentation

## Overview

This document provides detailed information about the reusable components in the Expo Chat App.

## Component Architecture

### Context Providers

#### UserRegistrationProvider

Manages user registration data throughout the app.

**Location**: `src/components/UserContext.tsx`

**Interface**:

```typescript
interface UserRegistrationData {
  firstName: string;
  lastName: string;
  contactNo: string;
  countryCode: string;
  profileImage: string | null;
}

interface UserRegistrationContextType {
  userData: UserRegistrationData;
  setUserData: React.Dispatch<React.SetStateAction<UserRegistrationData>>;
}
```

**Usage**:

```jsx
import { useUserRegistration } from '../components/UserContext';

const MyComponent = () => {
  const { userData, setUserData } = useUserRegistration();

  const updateUserData = (newData) => {
    setUserData(prev => ({ ...prev, ...newData }));
  };

  return (
    // Component JSX
  );
};
```

#### WebSocketProvider

Manages WebSocket connection and real-time communication.

**Location**: `src/socket/WebSocketProvider.tsx`

**Interface**:

```typescript
interface WebSocketContextValue {
  socket: WebSocket | null;
  isConnected: boolean;
  userId: number;
  sendMessage: (data: any) => void;
}
```

**Features**:

- Automatic connection management
- User-specific connections
- Connection state tracking
- Message sending utility

**Usage**:

```jsx
import { useWebSocket } from "../socket/WebSocketProvider";

const ChatComponent = () => {
  const { isConnected, sendMessage } = useWebSocket();

  const handleSend = (message) => {
    if (isConnected) {
      sendMessage({
        type: "chat",
        content: message,
        timestamp: Date.now(),
      });
    }
  };

  return (
    <View>
      <Text>Status: {isConnected ? "Connected" : "Disconnected"}</Text>
      {/* Chat UI */}
    </View>
  );
};
```

#### AuthProvider

Manages user authentication state.

**Location**: `src/socket/authProvider.tsx`

**Features**:

- User session management
- Authentication status tracking
- User ID storage

#### ThemeProvider

Manages app theming and dark/light mode.

**Location**: `src/theme/themeProvider.tsx`

**Features**:

- Theme switching
- Color scheme management
- Consistent styling

### UI Components

#### CircleShape

Creates circular UI elements with customizable properties.

**Location**: `src/components/CircleShape.tsx`

**Usage**:

```jsx
import CircleShape from "../components/CircleShape";

<CircleShape
  size={50}
  backgroundColor="#007AFF"
  borderColor="#ffffff"
  borderWidth={2}
/>;
```

#### FontTheme

Provides consistent typography throughout the app.

**Location**: `src/components/FontTheme.tsx`

**Features**:

- Predefined font sizes
- Font weight variations
- Cross-platform compatibility

## Screen Components

### Authentication Screens

#### SplashScreen

Initial loading screen with app branding.

**Location**: `src/screens/SplashScreen.tsx`

**Features**:

- App logo display
- Loading animations
- Navigation to main flow

#### SignUpScreen

User registration interface.

**Location**: `src/screens/SignUpScreen.tsx`

**Features**:

- Phone number input with country code
- Form validation
- Navigation to contact screen

**Form Fields**:

- Country code selection
- Phone number input
- Form validation

#### SignInScreen

User login interface.

**Location**: `src/screens/SignInScreen.tsx`

**Features**:

- User authentication
- Stored credential management
- Error handling

#### ContactScreen

Personal information collection.

**Location**: `src/screens/ContactScreen.tsx`

**Features**:

- First and last name input
- Form validation
- Progress indication

#### AvatarScreen

Profile picture selection.

**Location**: `src/screens/AvatarScreen.tsx`

**Features**:

- Predefined avatar selection
- Custom image upload
- Image cropping/preview

### Main App Screens

#### HomeTabs

Main tab navigation container.

**Location**: `src/screens/HomeTabs.tsx`

**Features**:

- Bottom tab navigation
- Screen management
- Tab icons and labels

#### ProfileScreen

User profile management.

**Location**: `src/screens/ProfileScreen.tsx`

**Features**:

- Profile information display
- Edit capabilities
- Settings access

#### NewContactScreen

Add new contacts functionality.

**Location**: `src/screens/NewContactScreen.tsx`

**Features**:

- Contact search
- Phone number validation
- Contact addition

### Chat Screens

#### HomeScreen

Main chat list and navigation hub.

**Location**: `src/screens/ChatScreenTabs/HomeScreen.tsx`

**Features**:

- Chat list display
- Search functionality
- New chat initiation
- Settings access

#### SingleChatScreen

Individual chat interface.

**Location**: `src/screens/ChatScreenTabs/SingleChatScreen.tsx`

**Features**:

- Message display
- Message input
- Real-time updates
- Message timestamps
- User status display

**Props**:

```typescript
{
  chatId: number;
  friendName: string;
  lastSeenTime: string;
  profileImage: string;
}
```

#### NewChatScreen

Start new conversations.

**Location**: `src/screens/ChatScreenTabs/NewChatScreen.tsx`

**Features**:

- Contact list display
- Chat initiation
- User search

#### SettingScreen

App settings and preferences.

**Location**: `src/screens/ChatScreenTabs/SettingScreen.tsx`

**Features**:

- App preferences
- Theme settings
- Account management

### Home Tab Screens

#### ChatScreen

Chat list within home tabs.

**Location**: `src/screens/HomeScreenTabs/ChatScreen.tsx`

#### StatusScreen

User status management.

**Location**: `src/screens/HomeScreenTabs/StatusScreen.tsx`

#### CallScreen

Voice/video call interface.

**Location**: `src/screens/HomeScreenTabs/CallScreen.tsx`

## Navigation Structure

### Stack Navigation

```typescript
type RootStackParamList = {
  SplashScreen: undefined;
  SignUpScreen: undefined;
  ContactScreen: undefined;
  AvatarScreen: undefined;
  SignInScreen: undefined;
  HomeTabs: undefined;
  HomeScreen: undefined | { userId: number; fromScreen: string };
  MockLogin: undefined;
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
```

### Navigation Usage

```jsx
// Navigate with parameters
navigation.navigate("SingleChatScreen", {
  chatId: 123,
  friendName: "John Doe",
  lastSeenTime: "2 minutes ago",
  profileImage: "avatar_1",
});

// Navigate without parameters
navigation.navigate("NewChatScreen");

// Go back
navigation.goBack();
```

## Styling Guidelines

### Tailwind CSS Classes

Common utility classes used throughout components:

```jsx
// Layout
className = "flex-1 justify-center items-center";

// Colors
className = "bg-blue-500 text-white";

// Spacing
className = "p-4 m-2 px-6 py-3";

// Typography
className = "text-lg font-bold text-center";

// Borders
className = "rounded-lg border border-gray-300";
```

### Dark Mode Support

Components support automatic dark mode switching:

```jsx
className = "bg-white dark:bg-gray-800 text-black dark:text-white";
```

## Best Practices

### Component Design

1. **Single Responsibility**: Each component has one clear purpose
2. **Reusability**: Components are designed for reuse
3. **Type Safety**: Full TypeScript support
4. **Performance**: Optimized rendering and state management

### State Management

1. **Context for Global State**: Use React Context for app-wide state
2. **Local State**: Use useState for component-specific state
3. **Prop Drilling**: Avoid deep prop drilling with context

### Error Handling

1. **Try-Catch Blocks**: Wrap async operations
2. **Error Boundaries**: Implement for crash prevention
3. **User Feedback**: Show meaningful error messages

### Testing

1. **Unit Tests**: Test individual components
2. **Integration Tests**: Test component interactions
3. **E2E Tests**: Test complete user flows

## Accessibility

### Screen Reader Support

- Proper accessibility labels
- Semantic HTML elements
- Focus management

### Keyboard Navigation

- Tab order management
- Keyboard shortcuts
- Focus indicators

### Color Contrast

- WCAG compliant color combinations
- High contrast mode support
- Color blind friendly design

## Performance Considerations

### React Native Optimizations

- Use FlatList for large lists
- Implement lazy loading
- Optimize image sizes
- Use React.memo for expensive components

### WebSocket Optimizations

- Connection pooling
- Message batching
- Automatic reconnection
- Memory management

## Debugging

### Component Debugging

```jsx
// Add debugging info
console.log("Component state:", state);
console.log("Props received:", props);

// React DevTools
// Install React DevTools browser extension
```

### WebSocket Debugging

```jsx
// Log WebSocket events
socket.onmessage = (event) => {
  console.log("Received:", JSON.parse(event.data));
};

socket.send = (data) => {
  console.log("Sending:", data);
  originalSend.call(socket, data);
};
```
