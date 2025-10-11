# Project Overview

## Project Information

- **Project Name**: Expo Chat App
- **Version**: 1.0.0
- **Platform**: React Native with Expo
- **Repository**: expo-chat-app
- **Owner**: AmiChanDev
- **License**: Private

## Quick Start

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd expo-chat-app

# Install dependencies
npm install

# Start development server
npm start

# Run on platforms
npm run ios        # iOS simulator
npm run android    # Android emulator
npm run web        # Web browser
```

### Environment Setup

Create `.env` file:

```env
EXPO_PUBLIC_APP_URL=http://localhost:8080
EXPO_PUBLIC_WS_URL=localhost:8080
```

## Project Structure

```
expo-chat-app/
├── 📄 App.tsx                 # Main app entry point
├── 📄 package.json           # Dependencies & scripts
├── 📄 README.md              # Project documentation
├── 📄 CONTRIBUTING.md        # Contribution guidelines
├── 📄 CHANGELOG.md           # Version history
├── 📁 docs/                  # Additional documentation
│   ├── 📄 API.md             # API documentation
│   ├── 📄 COMPONENTS.md      # Component documentation
│   └── 📄 DEVELOPMENT.md     # Development guide
├── 📁 assets/                # Static assets
└── 📁 src/                   # Source code
    ├── 📁 api/               # API services
    ├── 📁 components/        # Reusable components
    ├── 📁 screens/           # App screens
    ├── 📁 socket/            # WebSocket management
    ├── 📁 theme/             # Theme management
    └── 📁 util/              # Utility functions
```

## Architecture Overview

### Technology Stack

- **Frontend**: React Native 0.81.4
- **Platform**: Expo SDK 54.0.10
- **Language**: TypeScript
- **Styling**: Tailwind CSS + NativeWind
- **Navigation**: React Navigation v7
- **State Management**: React Context
- **Real-time**: WebSocket
- **Storage**: AsyncStorage

### Core Features

1. **Authentication System**
   - User registration with phone verification
   - Profile setup with avatar selection
   - Secure login/logout

2. **Real-time Chat**
   - WebSocket-based messaging
   - Online status tracking
   - Message history

3. **Contact Management**
   - Add contacts by phone number
   - Contact validation
   - User profiles

4. **Modern UI/UX**
   - Dark/Light theme support
   - Responsive design
   - Smooth animations

## Key Components

### Navigation Structure

```
App
├── SplashScreen          # Initial loading
├── Authentication Flow
│   ├── SignUpScreen     # Registration
│   ├── ContactScreen   # Personal info
│   ├── AvatarScreen    # Profile picture
│   └── SignInScreen    # Login
└── Main App Flow
    ├── HomeTabs         # Tab navigation
    ├── Chat Screens     # Messaging
    ├── Profile Screens  # User management
    └── Settings Screens # App preferences
```

### Context Providers

```jsx
<AlertNotificationRoot>
  <AuthProvider>
    <WebSocketProvider>
      <ThemeProvider>
        <UserRegistrationProvider>
          <App />
        </UserRegistrationProvider>
      </ThemeProvider>
    </WebSocketProvider>
  </AuthProvider>
</AlertNotificationRoot>
```

## API Integration

### REST Endpoints

- `POST /ChatApp/UserController` - User registration
- `POST /ChatApp/ProfileController` - Profile image upload

### WebSocket Connection

- URL: `ws://[host]/ChatApp/chat?userId=[id]`
- Real-time messaging
- Connection health monitoring

## Development Workflow

### Getting Started

1. **Setup Environment**

   ```bash
   npm install -g @expo/cli
   npm install
   ```

2. **Run Development Server**

   ```bash
   npm start
   ```

3. **Platform Testing**
   ```bash
   npm run ios      # iOS Simulator
   npm run android  # Android Emulator
   npm run web      # Web Browser
   ```

### Code Quality

- **TypeScript**: Strict type checking
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Testing**: Unit and integration tests

### Build Process

```bash
# Development build
expo start

# Production build
expo build

# Platform-specific builds
expo build:ios
expo build:android
```

## Configuration Files

### Core Configuration

- `app.json` - Expo app configuration
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript settings
- `tailwind.config.js` - Styling configuration

### Development Tools

- `babel.config.js` - JavaScript compilation
- `metro.config.js` - React Native bundler
- `.eslintrc.js` - Code linting rules
- `jest.config.js` - Testing configuration

## Folder Structure Details

### `/src/api/`

API service layer for backend communication

- User registration and authentication
- Profile management
- File upload handling

### `/src/components/`

Reusable UI components

- Context providers (UserContext)
- Common UI elements (CircleShape, FontTheme)
- Shared functionality

### `/src/screens/`

Screen components organized by functionality

- Authentication screens
- Chat-related screens
- Settings and profile screens
- Navigation containers

### `/src/socket/`

WebSocket management and real-time features

- Connection management (WebSocketProvider)
- Authentication provider
- Custom hooks for chat functionality
- Connection health monitoring

### `/src/theme/`

Theme and styling management

- Theme provider for dark/light mode
- Consistent color schemes
- Typography systems

### `/src/util/`

Utility functions and helpers

- Date formatting
- Form validation
- Common helper functions

## Dependencies Overview

### Production Dependencies

```json
{
  "expo": "~54.0.10",
  "react": "19.1.0",
  "react-native": "0.81.4",
  "@react-navigation/native": "^7.1.17",
  "nativewind": "^4.1.23",
  "tailwindcss": "^3.4.17"
}
```

### Key Features by Dependency

- **Expo**: Development platform and tools
- **React Navigation**: Screen navigation
- **NativeWind**: Tailwind CSS for React Native
- **AsyncStorage**: Local data persistence
- **Image Picker**: Profile photo selection
- **Country Picker**: Phone number formatting

## Environment Variables

### Required Variables

```env
# API Configuration
EXPO_PUBLIC_APP_URL=http://your-backend-url:8080

# WebSocket Configuration
EXPO_PUBLIC_WS_URL=your-websocket-url:8080
```

### Development vs Production

- Development: Local server URLs
- Production: Live server URLs
- Staging: Test environment URLs

## Security Considerations

### Data Protection

- Input validation on all forms
- Secure API communication
- Protected WebSocket connections
- Safe image handling

### Authentication

- Phone number verification
- Session management
- User data protection
- Secure token handling

## Performance Optimizations

### React Native Best Practices

- FlatList for large datasets
- Image optimization and caching
- Lazy loading of screens
- Memory management

### Bundle Optimization

- Tree shaking unused code
- Asset optimization
- Platform-specific code splitting
- Metro bundler configuration

## Testing Strategy

### Test Types

- **Unit Tests**: Individual components
- **Integration Tests**: Feature workflows
- **E2E Tests**: Complete user journeys
- **Performance Tests**: Load and stress testing

### Testing Tools

- Jest for unit testing
- React Native Testing Library
- Detox for E2E testing
- Performance monitoring tools

## Deployment

### Platform Builds

```bash
# iOS App Store
expo build:ios --type archive

# Google Play Store
expo build:android --type app-bundle

# Web deployment
expo build:web
```

### CI/CD Pipeline

1. Code quality checks
2. Automated testing
3. Build generation
4. Deployment to app stores

## Troubleshooting

### Common Issues

- **Metro bundle errors**: Clear cache with `expo r -c`
- **WebSocket connection**: Check environment variables
- **Platform builds**: Verify certificates and credentials
- **Dependencies**: Clear node_modules and reinstall

### Debug Tools

- React Native Debugger
- Flipper integration
- Expo DevTools
- Chrome DevTools for web

## Future Roadmap

### Planned Features

- Push notifications
- File sharing
- Group chats
- Voice messages
- Video calling
- Message encryption

### Technical Improvements

- Offline support
- Performance optimizations
- Better error handling
- Enhanced testing coverage

## Resources

### Documentation

- [Main README](README.md) - Project overview
- [API Documentation](docs/API.md) - Backend integration
- [Component Guide](docs/COMPONENTS.md) - UI components
- [Development Guide](docs/DEVELOPMENT.md) - Developer setup
- [Contributing Guide](CONTRIBUTING.md) - Contribution guidelines

### External Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [React Navigation](https://reactnavigation.org/)
- [Tailwind CSS](https://tailwindcss.com/)

### Community

- GitHub Issues for bug reports
- GitHub Discussions for questions
- Project Wiki for additional docs

---

_This overview provides a comprehensive guide to understanding and working with the Expo Chat App project. For specific implementation details, refer to the individual documentation files._
