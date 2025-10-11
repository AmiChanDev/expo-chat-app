# API Documentation

## Overview

This document describes the API endpoints used by the Expo Chat App for backend communication.

## Base Configuration

### Environment Variables

```env
EXPO_PUBLIC_APP_URL=http://your-backend-url:8080
EXPO_PUBLIC_WS_URL=your-websocket-url:8080
```

### Base URLs

- **REST API**: `${EXPO_PUBLIC_APP_URL}/ChatApp`
- **WebSocket**: `ws://${EXPO_PUBLIC_WS_URL}/ChatApp/chat`

## REST API Endpoints

### User Management

#### Create New Account

Creates a new user account with personal information and profile image.

**Endpoint**: `POST /ChatApp/UserController`

**Content-Type**: `multipart/form-data`

**Parameters**:

```javascript
{
  firstName: string,      // User's first name
  lastName: string,       // User's last name
  countryCode: string,    // Country code (e.g., "+1")
  contactNo: string,      // Phone number
  profileImage?: File,    // Custom profile image file
  avatarId?: string      // Avatar ID (e.g., "avatar_1")
}
```

**Response**:

```javascript
{
  status: boolean,        // Success/failure status
  message: string,        // Response message
  userId?: number,        // User ID if successful
  data?: object          // Additional user data
}
```

**Example Request**:

```javascript
const formData = new FormData();
formData.append("firstName", "John");
formData.append("lastName", "Doe");
formData.append("countryCode", "+1");
formData.append("contactNo", "1234567890");
formData.append("avatarId", "avatar_1");

const response = await fetch(`${API}/UserController`, {
  method: "POST",
  body: formData,
});
```

#### Upload Profile Image

Updates user's profile image.

**Endpoint**: `POST /ChatApp/ProfileController`

**Content-Type**: `multipart/form-data`

**Parameters**:

```javascript
{
  userId: string,         // User ID
  profileImage: File      // Image file
}
```

**Response**:

```javascript
{
  status: boolean,        // Success/failure status
  message: string,        // Response message
  imageUrl?: string       // New image URL if successful
}
```

## WebSocket Communication

### Connection

**URL**: `ws://${EXPO_PUBLIC_WS_URL}/ChatApp/chat?userId=${userId}`

### Connection Events

#### onopen

Triggered when WebSocket connection is established.

```javascript
socket.onopen = () => {
  console.log(`WebSocket Connected for userId: ${userId}`);
  setConnected(true);
};
```

#### onclose

Triggered when WebSocket connection is closed.

```javascript
socket.onclose = (event) => {
  console.log("WebSocket Disconnected", event.code, event.reason);
  setConnected(false);
};
```

#### onerror

Triggered when WebSocket encounters an error.

```javascript
socket.onerror = (error) => {
  console.log("WebSocket Error:", error);
  setConnected(false);
};
```

### Message Format

#### Sending Messages

All messages sent through WebSocket should include the userId:

```javascript
const sendMessage = (data) => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ ...data, userId }));
  }
};
```

#### Message Types

The app supports various message types through WebSocket:

1. **Chat Messages**
2. **User Status Updates**
3. **Typing Indicators**
4. **Connection Pings**

## Error Handling

### API Error Responses

```javascript
{
  status: false,
  message: "Error description"
}
```

### Common Error Scenarios

#### Network Errors

```javascript
{
  status: false,
  message: "Network error. Please check your internet connection and try again."
}
```

#### Server Errors

```javascript
{
  status: false,
  message: "Server error: 500. Internal server error."
}
```

#### Configuration Errors

```javascript
{
  status: false,
  message: "API configuration error. Please check your environment variables."
}
```

### WebSocket Error Handling

- **Connection timeout**: Automatically retry connection
- **Network interruption**: Implement reconnection logic
- **Invalid message format**: Log error and continue

## Security Considerations

### Data Validation

- Validate all input parameters
- Sanitize file uploads
- Check file types and sizes

### Authentication

- Include user authentication tokens in requests
- Validate user sessions
- Implement rate limiting

### WebSocket Security

- Validate userId parameter
- Implement message authentication
- Monitor connection abuse

## Usage Examples

### Complete User Registration Flow

```javascript
import { createNewAccount } from "../api/UserService";

const registerUser = async (userData) => {
  try {
    const result = await createNewAccount(userData);

    if (result.status) {
      console.log("Registration successful:", result);
      // Navigate to next screen
    } else {
      console.error("Registration failed:", result.message);
      // Show error message
    }
  } catch (error) {
    console.error("Network error:", error);
    // Handle network error
  }
};
```

### WebSocket Integration

```javascript
import { useWebSocket } from '../socket/WebSocketProvider';

const ChatComponent = () => {
  const { socket, isConnected, sendMessage } = useWebSocket();

  const handleSendMessage = (messageData) => {
    if (isConnected) {
      sendMessage({
        type: 'chat_message',
        content: messageData.content,
        recipientId: messageData.recipientId,
        timestamp: new Date().toISOString()
      });
    }
  };

  return (
    // Component JSX
  );
};
```

## Testing

### API Testing

Use tools like Postman or curl to test API endpoints:

```bash
# Test user creation
curl -X POST \
  http://localhost:8080/ChatApp/UserController \
  -F "firstName=John" \
  -F "lastName=Doe" \
  -F "countryCode=+1" \
  -F "contactNo=1234567890" \
  -F "avatarId=avatar_1"
```

### WebSocket Testing

Use WebSocket testing tools or browser console:

```javascript
const ws = new WebSocket("ws://localhost:8080/ChatApp/chat?userId=123");
ws.onopen = () => console.log("Connected");
ws.onmessage = (event) => console.log("Message:", event.data);
```

## Rate Limiting

- API endpoints may have rate limiting
- Implement proper retry mechanisms
- Handle rate limit responses gracefully

## Monitoring

- Log all API requests and responses
- Monitor WebSocket connection health
- Track error rates and response times
