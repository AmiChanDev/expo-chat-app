# Contributing Guidelines

## Welcome Contributors! 🎉

Thank you for your interest in contributing to the Expo Chat App! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Process](#development-process)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Coding Standards](#coding-standards)
- [Testing Requirements](#testing-requirements)
- [Documentation](#documentation)

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive experience for everyone, regardless of:

- Age, body size, disability, ethnicity, gender identity and expression
- Level of experience, education, socio-economic status
- Nationality, personal appearance, race, religion
- Sexual identity and orientation

### Our Standards

**Positive behavior includes:**

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behavior includes:**

- Trolling, insulting/derogatory comments, and personal or political attacks
- Public or private harassment
- Publishing others' private information without explicit permission
- Other conduct which could reasonably be considered inappropriate

## Getting Started

### Prerequisites

Before contributing, ensure you have:

- Node.js (16 or higher)
- npm or yarn
- Expo CLI
- Git knowledge
- Basic React Native/TypeScript experience

### Development Setup

```bash
# Fork the repository on GitHub
# Clone your fork
git clone https://github.com/YOUR_USERNAME/expo-chat-app.git
cd expo-chat-app

# Add upstream remote
git remote add upstream https://github.com/AmiChanDev/expo-chat-app.git

# Install dependencies
npm install

# Start development server
npm start
```

### First Time Setup

1. Read through the README.md
2. Explore the codebase structure
3. Run the app on your preferred platform
4. Check existing issues for beginner-friendly tasks

## How to Contribute

### Types of Contributions

We welcome various types of contributions:

#### 🐛 Bug Reports

- Use the bug report template
- Include steps to reproduce
- Provide device/platform information
- Include screenshots if applicable

#### 💡 Feature Requests

- Use the feature request template
- Explain the problem you're solving
- Describe the proposed solution
- Consider alternative solutions

#### 📝 Documentation

- Fix typos or unclear explanations
- Add missing documentation
- Improve code examples
- Update outdated information

#### 🔧 Code Contributions

- Bug fixes
- New features
- Performance improvements
- Refactoring
- Testing improvements

### Good First Issues

Look for issues labeled:

- `good-first-issue` - Perfect for newcomers
- `help-wanted` - We'd love your help
- `documentation` - Documentation improvements
- `bug` - Bug fixes needed

## Development Process

### Branch Strategy

```bash
# Create feature branch from main
git checkout main
git pull upstream main
git checkout -b feature/your-feature-name

# Make your changes
# Commit regularly with clear messages

# Push to your fork
git push origin feature/your-feature-name

# Create Pull Request
```

### Branch Naming Convention

- `feature/description` - New features
- `bugfix/issue-number-description` - Bug fixes
- `hotfix/critical-issue` - Critical fixes
- `docs/description` - Documentation changes
- `refactor/description` - Code refactoring

### Commit Message Format

We follow the [Conventional Commits](https://conventionalcommits.org/) specification:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, etc.)
- `refactor` - Code refactoring
- `test` - Adding or updating tests
- `chore` - Maintenance tasks

**Examples:**

```
feat(auth): add user registration with phone verification

fix(chat): resolve message ordering in group chats

docs(api): update WebSocket connection examples

test(components): add unit tests for UserProfile component
```

## Pull Request Process

### Before Submitting

1. **Test your changes thoroughly**

   ```bash
   # Run tests
   npm test

   # Run linting
   npm run lint

   # Test on multiple platforms
   npm run ios
   npm run android
   ```

2. **Update documentation**
   - Update README if needed
   - Add/update component documentation
   - Update API documentation

3. **Check for breaking changes**
   - Ensure backward compatibility
   - Update version numbers if needed
   - Add migration notes

### Pull Request Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

- [ ] Tested on iOS
- [ ] Tested on Android
- [ ] Tested on Web
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated

## Screenshots

(If applicable)

## Checklist

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No breaking changes or deprecated features documented
```

### Review Process

1. **Automated checks** must pass:
   - Linting (ESLint)
   - Type checking (TypeScript)
   - Tests (Jest)
   - Build verification

2. **Manual review** by maintainers:
   - Code quality assessment
   - Architecture review
   - Performance considerations
   - Security implications

3. **Required approvals**: At least one maintainer approval

### After Approval

```bash
# Keep your branch updated
git checkout main
git pull upstream main
git checkout feature/your-feature
git rebase main

# If approved, maintainers will merge
# Delete your branch after merge
git branch -d feature/your-feature
git push origin --delete feature/your-feature
```

## Issue Guidelines

### Bug Reports

Use this template for bug reports:

```markdown
**Bug Description**
Clear description of the bug

**Steps to Reproduce**

1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior**
What you expected to happen

**Actual Behavior**
What actually happened

**Screenshots**
If applicable, add screenshots

**Environment**

- Device: [e.g. iPhone 12, Samsung Galaxy S21]
- OS: [e.g. iOS 15.0, Android 11]
- App Version: [e.g. 1.0.0]
- Expo SDK Version: [e.g. 54.0.0]

**Additional Context**
Any other relevant information
```

### Feature Requests

Use this template for feature requests:

```markdown
**Problem Statement**
Describe the problem you're trying to solve

**Proposed Solution**
Describe your proposed solution

**Alternative Solutions**
Other solutions you've considered

**Additional Context**
Screenshots, mockups, or other context

**Acceptance Criteria**

- [ ] Criteria 1
- [ ] Criteria 2
- [ ] Criteria 3
```

## Coding Standards

### TypeScript Guidelines

```typescript
// Use interfaces for object shapes
interface UserData {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

// Use specific types instead of 'any'
const handleUserUpdate = (userData: UserData): Promise<ApiResponse> => {
  // Implementation
};

// Use proper error handling
try {
  const result = await apiCall();
  return result;
} catch (error: unknown) {
  if (error instanceof Error) {
    console.error("API Error:", error.message);
  }
  throw error;
}
```

### React Component Guidelines

```typescript
// Use functional components with hooks
const UserProfile: React.FC<UserProfileProps> = ({ user, onEdit }) => {
  // Group hooks together
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(user);

  // Effects after state
  useEffect(() => {
    setUserData(user);
  }, [user]);

  // Event handlers
  const handleEdit = useCallback(() => {
    setIsEditing(true);
    onEdit?.(userData);
  }, [userData, onEdit]);

  // Early returns for conditional rendering
  if (!user) {
    return <LoadingSpinner />;
  }

  return (
    <View>
      {/* Component JSX */}
    </View>
  );
};

// Export with default
export default UserProfile;
```

### Styling Guidelines

```typescript
// Use Tailwind classes consistently
<View className="flex-1 bg-white dark:bg-gray-900">
  <Text className="text-lg font-bold text-gray-900 dark:text-white">
    {title}
  </Text>
</View>

// Create reusable style constants for complex styles
const styles = {
  container: "flex-1 p-4 bg-white dark:bg-gray-900",
  title: "text-2xl font-bold text-center mb-4",
  button: "bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg"
};
```

### File Organization

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Generic components
│   ├── forms/          # Form-specific components
│   └── navigation/     # Navigation components
├── screens/            # Screen components
├── hooks/              # Custom hooks
├── services/           # API and business logic
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
├── constants/          # App constants
└── __tests__/          # Test files
```

## Testing Requirements

### Unit Tests

All new components and utilities must include unit tests:

```typescript
// UserProfile.test.tsx
import { render, fireEvent } from '@testing-library/react-native';
import UserProfile from '../UserProfile';

describe('UserProfile', () => {
  const mockUser = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com'
  };

  test('renders user information', () => {
    const { getByText } = render(<UserProfile user={mockUser} />);
    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('john@example.com')).toBeTruthy();
  });

  test('handles edit action', () => {
    const mockOnEdit = jest.fn();
    const { getByText } = render(
      <UserProfile user={mockUser} onEdit={mockOnEdit} />
    );

    fireEvent.press(getByText('Edit'));
    expect(mockOnEdit).toHaveBeenCalledWith(mockUser);
  });
});
```

### Integration Tests

For complex features, include integration tests:

```typescript
// ChatFlow.test.tsx
import { renderWithProviders } from '../../utils/test-utils';
import ChatFlow from '../ChatFlow';

describe('Chat Flow Integration', () => {
  test('sends message successfully', async () => {
    const { getByText, getByPlaceholderText } = renderWithProviders(
      <ChatFlow chatId={1} />
    );

    const input = getByPlaceholderText('Type a message...');
    const sendButton = getByText('Send');

    fireEvent.changeText(input, 'Hello, world!');
    fireEvent.press(sendButton);

    await waitFor(() => {
      expect(getByText('Hello, world!')).toBeTruthy();
    });
  });
});
```

### Test Coverage

- Maintain minimum 80% test coverage
- Focus on critical paths and edge cases
- Include happy path and error scenarios

## Documentation

### Code Documentation

````typescript
/**
 * Sends a chat message to the specified recipient
 *
 * @param message - The message content to send
 * @param recipientId - The ID of the message recipient
 * @param chatType - Type of chat (individual, group)
 * @returns Promise that resolves to the sent message data
 *
 * @example
 * ```typescript
 * const result = await sendMessage('Hello!', 123, 'individual');
 * console.log('Message sent:', result.messageId);
 * ```
 */
const sendMessage = async (
  message: string,
  recipientId: number,
  chatType: ChatType = "individual"
): Promise<MessageResponse> => {
  // Implementation
};
````

### Component Documentation

````typescript
/**
 * UserProfile component displays user information and provides edit functionality
 *
 * @component
 * @example
 * ```tsx
 * <UserProfile
 *   user={userData}
 *   onEdit={handleEdit}
 *   showActions={true}
 * />
 * ```
 */
interface UserProfileProps {
  /** User data to display */
  user: UserData;
  /** Callback function called when edit is triggered */
  onEdit?: (user: UserData) => void;
  /** Whether to show action buttons */
  showActions?: boolean;
}
````

### README Updates

When adding new features, update relevant documentation:

- Feature description in main README
- API changes in API.md
- Component changes in COMPONENTS.md
- Setup changes in DEVELOPMENT.md

## Community

### Getting Help

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and community chat
- **Discord**: [Link to Discord server if available]

### Recognition

We appreciate all contributors! Contributors will be:

- Listed in the CONTRIBUTORS.md file
- Mentioned in release notes for significant contributions
- Invited to join the maintainers team for consistent, high-quality contributions

## Release Process

### Versioning

We follow [Semantic Versioning](https://semver.org/):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Cycle

- **Patch releases**: Weekly (bug fixes)
- **Minor releases**: Monthly (new features)
- **Major releases**: As needed (breaking changes)

## Questions?

If you have questions about contributing:

1. Check existing documentation
2. Search closed issues and discussions
3. Create a new discussion
4. Reach out to maintainers

Thank you for contributing to make this project better! 🚀
