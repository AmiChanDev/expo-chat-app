package socket;

import com.google.gson.Gson;
import com.google.gson.internal.LinkedTreeMap;
import entity.Chat;
import entity.Status;
import entity.User;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;
import util.HibernateUtil;

@ServerEndpoint(value = "/chat")
public class ChatEndPoint {

    private static final Gson GSON = new Gson();

    // Thread-safe mapping of sessions to user IDs - FIXES RACE CONDITION
    private static final Map<Session, Integer> sessionUserMap = new ConcurrentHashMap<>();

    @OnOpen
    public void onOpen(Session session) {
        try {
            String query = session.getQueryString();
            System.out.println("New WebSocket connection with query: " + query);

            if (query != null && query.startsWith("userId=")) {
                String userIdStr = query.substring("userId=".length());
                int userId = Integer.parseInt(userIdStr);

                System.out.println("User " + userId + " connecting");

                // Store session-user mapping - THREAD SAFE
                sessionUserMap.put(session, userId);

                // Register with ChatService
                ChatService.register(userId, session);
                UserService.updateLogInStatus(userId);

                // Send initial friend list
                Map<String, Object> friendList = ChatService.friendListEnvelope(
                        ChatService.getFriendChatsForUser(userId)
                );
                ChatService.sendToUser(userId, friendList);

                System.out.println("User " + userId + " connected successfully");
            } else {
                System.out.println("Invalid userId in query: " + query);
                session.close();
            }
        } catch (NumberFormatException e) {
            System.out.println("Invalid userId format: " + e.getMessage());
            try {
                session.close();
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        } catch (Exception e) {
            System.out.println("Error in onOpen: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @OnClose
    public void onClose(Session session) {
        try {
            Integer userId = sessionUserMap.remove(session); // ATOMIC REMOVAL
            if (userId != null && userId > 0) {
                System.out.println("User " + userId + " disconnecting");
                ChatService.unregister(userId);
                UserService.updateLogOutStatus(userId);
                System.out.println("User " + userId + " disconnected");
            }
        } catch (Exception e) {
            System.out.println("Error in onClose: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @OnError
    public void onError(Session session, Throwable throwable) {
        try {
            Integer userId = sessionUserMap.get(session);
            if (userId != null && userId > 0) {
                System.out.println("WebSocket error for user " + userId);
                UserService.updateLogOutStatus(userId);
                sessionUserMap.remove(session); // CLEAN REMOVAL
                ChatService.unregister(userId);
            }
            throwable.printStackTrace();
        } catch (Exception e) {
            System.out.println("Error in error handler: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @OnMessage
    public void onMessage(String message, Session session) {
        Integer userId = sessionUserMap.get(session); // THREAD-SAFE LOOKUP
        if (userId == null) {
            System.out.println("Message from unregistered session");
            return;
        }

        try {
            Map<String, Object> map = GSON.fromJson(message, Map.class);
            LinkedTreeMap userObject = (LinkedTreeMap) map.get("user");
            String type = (String) map.get("type");

            if (type == null) {
                System.out.println("Null message type from user " + userId);
                return;
            }

            switch (type) {
                case "send_chat":
                    handleSendChat(map, userId);
                    break;

                case "get_chat_list":
                    handleGetChatList(userId);
                    break;

                case "get_single_chat":
                    handleGetSingleChat(map, userId);
                    break;

                case "send_message":
                    handleSendMessage(map, userId);
                    break;

                case "friend_data":
                    handleFriendData(map, userId);
                    break;

                case "get_all_users":
                    handleGetAllUsers(map, userId);
                    break;

                case "save_new_contact":
                    handleSaveContact(userObject, userId);
                    break;

                case "use_user_profile":
                    handleGetUserProfile(userId);
                    break;

                case "ping":
                    handlePingPong(userId);
                    break;

                case "get_user_image":
                    handleGetUserImage(userId, map);
                default:
                    System.out.println("Unknown message type: " + type + " from user " + userId);
            }

        } catch (Exception e) {
            System.out.println("Error processing message from user " + userId + ": " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void handleGetUserProfile(int userId) {
        Map<String, Object> envelope = UserService.getMyProfileData(userId);
        ChatService.sendToUser(userId, envelope);
    }

    private void handleGetUserImage(int userId, Map map) {
        LinkedTreeMap userObject = new LinkedTreeMap();
//        TBD
    }

    private void handlePingPong(int userId) {
        System.out.println("PING PONG");
        HashMap<String, Object> envelope = new HashMap();
        envelope.put("type", "PONG");
        envelope.put("payload", "PONG");
        ChatService.sendToUser(userId, envelope);
    }

    private void handleSaveContact(LinkedTreeMap userObject, int userId) {
        System.out.println(userObject);
        Map<String, Object> envelope = UserService.saveNewContact(userId, userObject);
        ChatService.sendToUser(userId, envelope);
    }

    private void handleGetAllUsers(Map< String, Object> map, int userId) {
        try {
            System.out.println("Getting all users");
            Map<String, Object> envelope = UserService.getAllUsers(userId);
            ChatService.sendToUser(userId, envelope);
        } catch (Exception e) {
            System.out.println("Error getting all users");
            e.printStackTrace();
        }
    }

    private void handleSendChat(Map<String, Object> map, int currentUserId) {
        org.hibernate.Session session = null;
        try {
            int fromId = getIntValue(map.get("fromId"));
            int toId = getIntValue(map.get("toId"));
            String chatText = (String) map.get("message");

            session = HibernateUtil.getSessionFactory().openSession();
            User fromUser = (User) session.get(User.class, fromId);
            User toUser = (User) session.get(User.class, toId);

            if (fromUser != null && toUser != null) {
                Chat chat = new Chat(fromUser, chatText, toUser, "", Status.SENT);
                ChatService.deliverChat(chat);
                System.out.println("Chat delivered from " + fromId + " to " + toId);
            } else {
                System.out.println("Invalid users: from=" + fromId + ", to=" + toId);
            }
        } catch (Exception e) {
            System.out.println("Error in handleSendChat: " + e.getMessage());
            e.printStackTrace();
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }

    private void handleGetChatList(int userId) {
        try {
            System.out.println("Getting chat list for user " + userId);
            Map<String, Object> friendList = ChatService.friendListEnvelope(
                    ChatService.getFriendChatsForUser(userId)
            );
            ChatService.sendToUser(userId, friendList);
        } catch (Exception e) {
            System.out.println("Error getting chat list for user " + userId + ": " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void handleGetSingleChat(Map<String, Object> map, int userId) {
        try {
            int friendId = getIntValue(map.get("friendId"));
            System.out.println("Getting single chat for user " + userId + " with friend " + friendId);

            List<Chat> chats = ChatService.getChatHistory(userId, friendId);
            Map<String, Object> envelope = ChatService.singleChatEnvelope(chats);
            ChatService.sendToUser(userId, envelope);

            // Refresh friend list
            handleGetChatList(userId);

        } catch (Exception e) {
            System.out.println("Error getting single chat for user " + userId + ": " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void handleSendMessage(Map<String, Object> map, int userId) {
        try {
            int friendId = getIntValue(map.get("toUserId"));
            String chatMessage = String.valueOf(map.get("message"));

            System.out.println("Saving message from " + userId + " to " + friendId);
            ChatService.saveNewChat(userId, friendId, chatMessage);

        } catch (Exception e) {
            System.out.println("Error sending message from user " + userId + ": " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void handleFriendData(Map<String, Object> map, int userId) {
        try {
            int friendId = getIntValue(map.get("friendId"));
            Map<String, Object> envelope = UserService.getFriendData(friendId);
            ChatService.sendToUser(userId, envelope);

        } catch (Exception e) {
            System.out.println("Error getting friend data for user " + userId + ": " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Safely converts various number types to int - FIXES TYPE CASTING
     */
    private int getIntValue(Object value) {
        if (value instanceof Number) {
            return ((Number) value).intValue();
        }
        if (value instanceof String) {
            try {
                return Integer.parseInt((String) value);
            } catch (NumberFormatException e) {
                throw new IllegalArgumentException("Invalid number format: " + value);
            }
        }
        throw new IllegalArgumentException("Cannot convert to int: " + value);
    }

    public static Integer getUserIdFromSession(Session session) {
        return sessionUserMap.get(session);
    }
}
