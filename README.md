# Expo Chat App

A modern, real-time chat application built with React Native and Expo, featuring WebSocket-based messaging, user authentication, and a beautiful UI with Tailwind CSS.

## 📱 Features

### Core Features

- **Real-time messaging** with WebSocket integration
- **User authentication** (Sign up, Sign in)
- **Contact management** (Add contacts by phone number)
- **Profile customization** with avatars and custom images
- **Group chat support**
- **Online status tracking**
- **Message timestamps and formatting**
- **Cross-platform** (iOS, Android, Web)

### UI/UX Features

- **Modern design** with Tailwind CSS
- **Dark/Light theme support**
- **Responsive layout**
- **Smooth animations** with React Native Reanimated
- **Country code selection** for phone numbers
- **Image picker** for profile pictures
- **Toast notifications**

## 🛠️ Tech Stack

### Frontend

- **React Native** 0.81.4
- **Expo** ~54.0.10
- **TypeScript** for type safety
- **Tailwind CSS** with NativeWind for styling
- **React Navigation** for routing

### Key Dependencies

- `@react-navigation/native` - Navigation system
- `@react-navigation/bottom-tabs` - Tab navigation
- `@react-navigation/native-stack` - Stack navigation
- `nativewind` - Tailwind CSS for React Native
- `react-native-reanimated` - Animations
- `expo-image-picker` - Image selection
- `react-native-country-picker-modal` - Country selection
- `react-native-alert-notification` - Toast notifications
- `@react-native-async-storage/async-storage` - Local storage

### Backend Communication

- **WebSocket** for real-time messaging
- **REST API** for user management
- **FormData** for file uploads

## 📂 Project Structure

```
expo-chat-app/
├── App.tsx                 # Main app component with navigation
├── package.json           # Dependencies and scripts
├── app.json              # Expo configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── global.css           # Global styles
├── assets/              # Static assets
└── src/
    ├── api/             # API services
    │   └── UserService.ts
    ├── components/      # Reusable components
    │   ├── UserContext.tsx
    │   ├── FontTheme.tsx
    │   └── CircleShape.tsx
    ├── screens/         # App screens
    │   ├── SplashScreen.tsx
    │   ├── SignInScreen.tsx
    │   ├── SignUpScreen.tsx
    │   ├── ProfileScreen.tsx
    │   ├── ContactScreen.tsx
    │   ├── AvatarScreen.tsx
    │   ├── HomeTabs.tsx
    │   ├── NewContactScreen.tsx
    │   ├── ChatScreenTabs/
    │   ├── HomeScreenTabs/
    │   └── Test/
    ├── socket/          # WebSocket management
    │   ├── WebSocketProvider.tsx
    │   ├── authProvider.tsx
    │   ├── chat.ts
    │   ├── useChatList.ts
    │   ├── useSendChat.ts
    │   ├── useSingleChat.ts
    │   └── useUserProfile.ts
    ├── theme/           # Theme management
    │   └── themeProvider.tsx
    └── util/            # Utility functions
        ├── dateFormatter.ts
        └── Validation.ts
```

## 🚀 Getting Started

### Prerequisites

- Node.js (>= 16)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd expo-chat-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:

   ```env
   EXPO_PUBLIC_APP_URL=http://your-backend-url:8080
   EXPO_PUBLIC_WS_URL=your-websocket-url:8080
   ```

4. **Start the development server**

   ```bash
   npm start
   # or
   expo start
   ```

5. **Run on platforms**

   ```bash
   # iOS
   npm run ios

   # Android
   npm run android

   # Web
   npm run web
   ```

## 📱 App Flow

### Authentication Flow

1. **Splash Screen** - Initial loading screen
2. **Sign Up** - User registration with phone number
3. **Contact Information** - Enter personal details
4. **Avatar Selection** - Choose profile picture
5. **Sign In** - Login for existing users

### Main App Flow

1. **Home Tabs** - Main navigation (Chats, Status, Calls)
2. **Chat List** - View all conversations
3. **Single Chat** - Individual chat interface
4. **New Chat** - Start new conversations
5. **Settings** - App preferences and profile

## 🔧 Configuration

### Expo Configuration (`app.json`)

- **App name and slug**: `expo-chat-app`
- **Orientation**: Portrait only
- **New Architecture**: Enabled
- **Edge-to-edge**: Android support
- **Platform support**: iOS, Android, Web

### Tailwind Configuration

- **Content paths**: App.tsx and src/\*\*
- **Dark mode**: Class-based
- **Preset**: NativeWind preset

## 🌐 API Integration

### User Service (`src/api/UserService.ts`)

- **Create Account**: POST `/ChatApp/UserController`
- **Upload Profile Image**: POST `/ChatApp/ProfileController`

### WebSocket Integration

- **Connection**: `ws://[host]/ChatApp/chat?userId=[id]`
- **Real-time messaging**
- **Online status updates**
- **Connection management**

## 🎨 Styling

### Tailwind CSS with NativeWind

- Utility-first CSS framework
- Responsive design support
- Dark mode compatibility
- Custom theme extensions

### Theme System

- Light/Dark mode toggle
- Consistent color palette
- Typography system
- Component theming

## 📱 Screen Components

### Core Screens

- **SplashScreen**: App initialization
- **SignUpScreen**: User registration
- **SignInScreen**: User login
- **HomeTabs**: Main tab navigation
- **ProfileScreen**: User profile management

### Chat Screens

- **HomeScreen**: Chat list and navigation
- **SingleChatScreen**: Individual chat interface
- **NewChatScreen**: Start new conversations
- **SettingScreen**: App settings

### Support Screens

- **ContactScreen**: Contact information input
- **AvatarScreen**: Profile picture selection
- **NewContactScreen**: Add new contacts

## 🔌 WebSocket Hooks

### Custom Hooks

- **useWebSocket**: WebSocket connection management
- **useChatList**: Chat list data
- **useSendChat**: Send messages
- **useSingleChat**: Individual chat data
- **useUserProfile**: User profile data
- **useWebSocketPing**: Connection health monitoring

## 📝 Type Definitions

### Key Interfaces

```typescript
// User Registration Data
interface UserRegistrationData {
  firstName: string;
  lastName: string;
  contactNo: string;
  countryCode: string;
  profileImage: string | null;
}

// Navigation Types
type RootStackParamList = {
  SplashScreen: undefined;
  SignUpScreen: undefined;
  ContactScreen: undefined;
  // ... other screens
};

// WebSocket Context
interface WebSocketContextValue {
  socket: WebSocket | null;
  isConnected: boolean;
  userId: number;
  sendMessage: (data: any) => void;
}
```

## 🧪 Testing

### Test Files

- `src/screens/Test/mockLogin.tsx` - Mock login functionality

### Testing Commands

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

## 🚀 Deployment

### Building for Production

```bash
# Build for all platforms
expo build

# Build for specific platform
expo build:ios
expo build:android
```

### Environment Setup

Ensure environment variables are properly configured for production:

- `EXPO_PUBLIC_APP_URL`
- `EXPO_PUBLIC_WS_URL`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

1. **WebSocket connection failed**: Check `EXPO_PUBLIC_WS_URL` configuration
2. **API calls failing**: Verify `EXPO_PUBLIC_APP_URL` is correct
3. **Image picker not working**: Ensure proper permissions are set
4. **Navigation issues**: Check React Navigation setup

### Debug Commands

```bash
# Clear Expo cache
expo r -c

# Clear npm cache
npm cache clean --force

# Reset Metro bundler
npx expo start -c
```

## 📞 Support

For support and questions:

- Create an issue on GitHub
- Check the [Expo Documentation](https://docs.expo.dev/)
- Review [React Native Documentation](https://reactnative.dev/docs/getting-started)

---

_Built with ❤️ using React Native and Expo_
