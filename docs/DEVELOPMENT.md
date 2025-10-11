# Development Guide

## Setup and Development Environment

### Prerequisites

Ensure you have the following installed:

- **Node.js** (version 16 or higher)
- **npm** or **yarn**
- **Expo CLI**: `npm install -g @expo/cli`
- **Git**

### Platform-Specific Requirements

#### iOS Development

- **macOS** (required for iOS development)
- **Xcode** (latest version)
- **iOS Simulator**
- **CocoaPods**: `sudo gem install cocoapods`

#### Android Development

- **Android Studio**
- **Android SDK** (API level 30+)
- **Java Development Kit (JDK)** 8 or higher
- **Android Emulator** or physical device

#### Web Development

- Modern web browser (Chrome, Firefox, Safari)

## Project Setup

### Initial Setup

```bash
# Clone the repository
git clone <repository-url>
cd expo-chat-app

# Install dependencies
npm install

# Start the development server
npm start
```

### Environment Configuration

Create a `.env` file in the root directory:

```env
# Backend API URL
EXPO_PUBLIC_APP_URL=http://localhost:8080

# WebSocket URL
EXPO_PUBLIC_WS_URL=localhost:8080

# Development environment
NODE_ENV=development
```

### Platform-Specific Scripts

```bash
# Start development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web browser
npm run web

# Clear cache and restart
expo r -c
```

## Development Workflow

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "Add new feature"

# Push to remote
git push origin feature/new-feature

# Create pull request
# Merge after review
```

### Branch Naming Convention

- `feature/description` - New features
- `bugfix/description` - Bug fixes
- `hotfix/description` - Critical fixes
- `refactor/description` - Code refactoring

### Commit Message Format

```
type(scope): description

Examples:
feat(auth): add user registration
fix(chat): resolve message ordering issue
refactor(api): simplify user service
docs(readme): update installation guide
```

## Code Standards

### TypeScript Configuration

The project uses strict TypeScript settings:

```json
// tsconfig.json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "noImplicitReturns": true,
    "noImplicitAny": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### ESLint and Prettier

Code formatting and linting rules:

```json
// .eslintrc.js
module.exports = {
  extends: ["expo", "@react-native-community"],
  rules: {
    "prettier/prettier": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
};
```

### Code Style Guidelines

#### File and Directory Naming

- **Components**: PascalCase (`UserProfile.tsx`)
- **Utilities**: camelCase (`dateFormatter.ts`)
- **Directories**: camelCase (`chatScreenTabs/`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)

#### Import Organization

```typescript
// External libraries
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { NavigationProp } from "@react-navigation/native";

// Internal utilities
import { formatDate } from "../util/dateFormatter";
import { validateInput } from "../util/Validation";

// Internal components
import CircleShape from "../components/CircleShape";
import FontTheme from "../components/FontTheme";

// Types
import { RootStackParamList } from "../types/navigation";
```

#### Component Structure

```typescript
// Interface/Types
interface ComponentProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}

// Component
const MyComponent: React.FC<ComponentProps> = ({
  title,
  onPress,
  disabled = false
}) => {
  // Hooks
  const [isLoading, setIsLoading] = useState(false);

  // Effects
  useEffect(() => {
    // Effect logic
  }, []);

  // Handlers
  const handlePress = () => {
    setIsLoading(true);
    onPress();
    setIsLoading(false);
  };

  // Render
  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || isLoading}
      className="bg-blue-500 p-4 rounded-lg"
    >
      <Text className="text-white text-center">{title}</Text>
    </TouchableOpacity>
  );
};

export default MyComponent;
```

## State Management

### Context Pattern

For global state management, use React Context:

```typescript
// Create context
const MyContext = createContext<MyContextType | null>(null);

// Provider component
export const MyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState(initialState);

  return (
    <MyContext.Provider value={{ state, setState }}>
      {children}
    </MyContext.Provider>
  );
};

// Custom hook
export const useMyContext = () => {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error('useMyContext must be used within MyProvider');
  }
  return context;
};
```

### Local State Guidelines

- Use `useState` for simple component state
- Use `useReducer` for complex state logic
- Use `useRef` for mutable values that don't trigger re-renders

## API Integration

### Service Layer Pattern

Organize API calls in service files:

```typescript
// src/api/ChatService.ts
export const chatService = {
  async sendMessage(messageData: MessageData): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageData),
      });

      return await response.json();
    } catch (error) {
      throw new Error(`Failed to send message: ${error.message}`);
    }
  },

  async getChatHistory(chatId: number): Promise<Message[]> {
    // Implementation
  },
};
```

### Error Handling

Implement consistent error handling:

```typescript
const handleApiCall = async () => {
  try {
    setLoading(true);
    const result = await apiService.someCall();

    if (result.status) {
      // Success handling
      setData(result.data);
    } else {
      // API error handling
      showError(result.message);
    }
  } catch (error) {
    // Network error handling
    showError("Network error. Please try again.");
  } finally {
    setLoading(false);
  }
};
```

## WebSocket Development

### Connection Management

```typescript
const useWebSocketConnection = (userId: number) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (userId) {
      const ws = new WebSocket(`ws://localhost:8080/chat?userId=${userId}`);

      ws.onopen = () => {
        setIsConnected(true);
        setSocket(ws);
      };

      ws.onclose = () => {
        setIsConnected(false);
        setSocket(null);
        // Implement reconnection logic
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      return () => {
        ws.close();
      };
    }
  }, [userId]);

  return { socket, isConnected };
};
```

### Message Handling

```typescript
const useMessageHandler = (socket: WebSocket | null) => {
  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          handleIncomingMessage(message);
        } catch (error) {
          console.error("Failed to parse message:", error);
        }
      };
    }
  }, [socket]);
};
```

## Testing Strategy

### Unit Testing

```typescript
// __tests__/components/UserProfile.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import UserProfile from '../src/components/UserProfile';

describe('UserProfile', () => {
  test('renders user information correctly', () => {
    const user = { name: 'John Doe', email: 'john@example.com' };
    const { getByText } = render(<UserProfile user={user} />);

    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('john@example.com')).toBeTruthy();
  });

  test('calls onEdit when edit button is pressed', () => {
    const mockOnEdit = jest.fn();
    const { getByText } = render(
      <UserProfile user={user} onEdit={mockOnEdit} />
    );

    fireEvent.press(getByText('Edit'));
    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });
});
```

### Integration Testing

```typescript
// __tests__/integration/UserRegistration.test.tsx
import { renderWithProviders } from '../utils/test-utils';
import UserRegistrationFlow from '../src/flows/UserRegistrationFlow';

describe('User Registration Flow', () => {
  test('completes registration successfully', async () => {
    const { getByText, getByPlaceholderText } = renderWithProviders(
      <UserRegistrationFlow />
    );

    // Test registration steps
    fireEvent.changeText(getByPlaceholderText('First Name'), 'John');
    fireEvent.changeText(getByPlaceholderText('Last Name'), 'Doe');
    fireEvent.press(getByText('Continue'));

    // Assert navigation or success state
  });
});
```

### E2E Testing with Detox

```javascript
// e2e/userRegistration.e2e.js
describe("User Registration", () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it("should register a new user successfully", async () => {
    await element(by.id("signUpButton")).tap();
    await element(by.id("firstNameInput")).typeText("John");
    await element(by.id("lastNameInput")).typeText("Doe");
    await element(by.id("continueButton")).tap();

    await expect(element(by.text("Registration Successful"))).toBeVisible();
  });
});
```

## Performance Optimization

### React Native Performance

```typescript
// Use React.memo for expensive components
const ExpensiveComponent = React.memo(({ data }) => {
  // Expensive rendering logic
  return <View>{/* Complex UI */}</View>;
});

// Use useCallback for event handlers
const MyComponent = () => {
  const handlePress = useCallback(() => {
    // Handler logic
  }, [dependency]);

  return <TouchableOpacity onPress={handlePress} />;
};

// Use FlatList for large datasets
<FlatList
  data={messages}
  keyExtractor={(item) => item.id.toString()}
  renderItem={({ item }) => <MessageItem message={item} />}
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
/>
```

### Image Optimization

```typescript
// Use optimized image formats
<Image
  source={{ uri: imageUrl }}
  style={{ width: 100, height: 100 }}
  resizeMode="cover"
  // Cache images
  cachePolicy="memory-disk"
/>
```

## Debugging

### React Native Debugger

```bash
# Install React Native Debugger
npm install -g react-native-debugger

# Enable debugging in development
// In your app
if (__DEV__) {
  import('./ReactotronConfig').then(() => console.log('Reactotron Configured'));
}
```

### Flipper Integration

```bash
# Install Flipper
# Add Flipper plugins for network, logs, and state management

# Use Flipper in development
yarn add --dev react-native-flipper
```

### Console Debugging

```typescript
// Structured logging
const logger = {
  debug: (message: string, data?: any) => {
    if (__DEV__) {
      console.log(`[DEBUG] ${message}`, data);
    }
  },
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${message}`, error);
  },
  info: (message: string, data?: any) => {
    console.info(`[INFO] ${message}`, data);
  },
};
```

## Deployment

### Environment Configuration

```bash
# Development
EXPO_PUBLIC_APP_URL=http://localhost:8080
NODE_ENV=development

# Staging
EXPO_PUBLIC_APP_URL=https://staging-api.example.com
NODE_ENV=staging

# Production
EXPO_PUBLIC_APP_URL=https://api.example.com
NODE_ENV=production
```

### Build Process

```bash
# Build for production
expo build

# Build for specific platform
expo build:android
expo build:ios

# Build locally
expo run:android --variant release
expo run:ios --configuration Release
```

### App Store Deployment

```bash
# Submit to App Store
expo submit --platform ios

# Submit to Google Play
expo submit --platform android

# Generate standalone apps
expo build:android --type apk
expo build:ios --type archive
```

## Troubleshooting

### Common Issues

#### Metro Bundle Error

```bash
# Clear Metro cache
npx expo start -c

# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### WebSocket Connection Issues

```typescript
// Check WebSocket URL
console.log("WebSocket URL:", process.env.EXPO_PUBLIC_WS_URL);

// Test connection manually
const testSocket = new WebSocket("ws://localhost:8080/test");
testSocket.onopen = () => console.log("Test connection successful");
testSocket.onerror = (error) => console.log("Test connection failed:", error);
```

#### Platform-Specific Issues

```bash
# iOS: Clean build folder
cd ios && xcodebuild clean

# Android: Clean gradle
cd android && ./gradlew clean

# Reset iOS simulator
xcrun simctl erase all
```

### Performance Issues

```typescript
// Use React DevTools Profiler
import { unstable_trace as trace } from "scheduler/tracing";

// Profile expensive operations
trace("expensive-operation", performance.now(), () => {
  // Expensive code
});

// Memory leak detection
useEffect(() => {
  const interval = setInterval(() => {
    // Check memory usage
  }, 1000);

  return () => clearInterval(interval);
}, []);
```

## Best Practices Summary

1. **Code Quality**
   - Use TypeScript strictly
   - Follow ESLint rules
   - Write meaningful tests
   - Document complex logic

2. **Performance**
   - Optimize list rendering
   - Use proper image caching
   - Implement lazy loading
   - Monitor memory usage

3. **User Experience**
   - Handle loading states
   - Provide error feedback
   - Implement offline support
   - Ensure accessibility

4. **Security**
   - Validate all inputs
   - Secure API endpoints
   - Handle sensitive data properly
   - Implement proper authentication

5. **Maintainability**
   - Keep components small
   - Use consistent patterns
   - Document decisions
   - Regular refactoring
