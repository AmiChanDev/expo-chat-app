package socket;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import entity.Chat;
import entity.FriendList;
import entity.Status;
import entity.User;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.HashSet;
import java.util.concurrent.ConcurrentHashMap;
import javax.websocket.Session;
import org.hibernate.Criteria;
import org.hibernate.Transaction;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import util.HibernateUtil;

public class ChatService {

    // THREAD-SAFE SESSION MANAGEMENT
    private static final ConcurrentHashMap<Integer, Session> SESSIONS = new ConcurrentHashMap<>();
    private static final Gson GSON = new GsonBuilder().setDateFormat("yyyy-MM-dd'T'HH:mm:ss").create();
    public static final String URL = "https://028b2f1a1b3d.ngrok-free.app";

    public static void register(int userId, Session session) {
        SESSIONS.put(userId, session);
        System.out.println("User " + userId + " registered for WebSocket");
    }

    public static void unregister(int userId) {
        SESSIONS.remove(userId);
        System.out.println("User " + userId + " unregistered from WebSocket");
    }

    public static void sendToUser(int userId, Object payload) {
        Session ws = SESSIONS.get(userId);
        if (ws != null && ws.isOpen()) {
            try {
                String json = GSON.toJson(payload);
                ws.getBasicRemote().sendText(json);
            } catch (IOException e) {
                System.out.println("Error sending message to user " + userId + ": " + e.getMessage());
                e.printStackTrace();
            }
        } else {
            System.out.println("No active session for user " + userId);
        }
    }

    /**
     * OPTIMIZED: Gets all users who have chatted with the given user FIXES: The
     * main issue where only user 5 got chat data
     */
    public static List<ChatSummary> getFriendChatsForUser(int userId) {
        org.hibernate.Session session = HibernateUtil.getSessionFactory().openSession();
        try {
            System.out.println("Getting friend chats for user " + userId);

            // Get all unique user IDs who have chatted with this user
            Set<Integer> chatPartnerIds = getChatPartners(session, userId);
            System.out.println("Found " + chatPartnerIds.size() + " chat partners for user " + userId);

            Map<Integer, ChatSummary> chatSummaryMap = new LinkedHashMap<>();

            for (Integer partnerId : chatPartnerIds) {
                try {
                    // Get the latest chat with this partner
                    Chat latestChat = getLatestChatBetweenUsers(session, userId, partnerId);

                    if (latestChat != null) {
                        // Get partner user details
                        User partner = (User) session.get(User.class, partnerId);

                        if (partner != null) {
                            // Count unread messages from this partner
                            int unreadCount = getUnreadMessageCount(session, userId, partnerId);

                            String profileImage = URL + "/ChatApp/profile-images/" + partnerId + "/profile1.png";
                            String partnerName = partner.getFirstName() + " " + partner.getLastName();

                            ChatSummary summary = new ChatSummary(
                                    partnerId,
                                    partnerName,
                                    latestChat.getMessage(),
                                    latestChat.getUpdatedAt(),
                                    unreadCount,
                                    profileImage
                            );

                            chatSummaryMap.put(partnerId, summary);
                        }
                    }
                } catch (Exception e) {
                    System.out.println("Error processing chat partner " + partnerId + " for user " + userId + ": " + e.getMessage());
                }
            }

            List<ChatSummary> result = new ArrayList<>(chatSummaryMap.values());
            System.out.println("Returning " + result.size() + " chat summaries for user " + userId);

            return result;

        } catch (Exception e) {
            System.out.println("Error getting friend chats for user " + userId + ": " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>();
        } finally {
            session.close();
        }
    }

    /**
     * OPTIMIZED: Get all user IDs who have chatted with the given user This
     * replaces the FriendList dependency
     */
    private static Set<Integer> getChatPartners(org.hibernate.Session session, int userId) {
        Set<Integer> partners = new HashSet<>();

        try {
            // Get users who sent messages to this user
            Criteria fromCriteria = session.createCriteria(Chat.class);
            fromCriteria.add(Restrictions.eq("to.id", userId));
            fromCriteria.setProjection(Projections.distinct(Projections.property("from.id")));
            List<Integer> fromUsers = fromCriteria.list();
            partners.addAll(fromUsers);

            // Get users who received messages from this user
            Criteria toCriteria = session.createCriteria(Chat.class);
            toCriteria.add(Restrictions.eq("from.id", userId));
            toCriteria.setProjection(Projections.distinct(Projections.property("to.id")));
            List<Integer> toUsers = toCriteria.list();
            partners.addAll(toUsers);

        } catch (Exception e) {
            System.out.println("Error getting chat partners for user " + userId + ": " + e.getMessage());
            e.printStackTrace();
        }

        return partners;
    }

    /**
     * OPTIMIZED: Get the latest chat between two users
     */
    private static Chat getLatestChatBetweenUsers(org.hibernate.Session session, int userId, int partnerId) {
        try {
            Criteria criteria = session.createCriteria(Chat.class);
            criteria.add(Restrictions.or(
                    Restrictions.and(
                            Restrictions.eq("from.id", userId),
                            Restrictions.eq("to.id", partnerId)
                    ),
                    Restrictions.and(
                            Restrictions.eq("from.id", partnerId),
                            Restrictions.eq("to.id", userId)
                    )
            ));
            criteria.addOrder(Order.desc("updatedAt"));
            criteria.setMaxResults(1);

            return (Chat) criteria.uniqueResult();
        } catch (Exception e) {
            System.out.println("Error getting latest chat between " + userId + " and " + partnerId + ": " + e.getMessage());
            return null;
        }
    }

    /**
     * OPTIMIZED: Count unread messages from a specific partner
     */
    private static int getUnreadMessageCount(org.hibernate.Session session, int userId, int partnerId) {
        try {
            Criteria criteria = session.createCriteria(Chat.class);
            criteria.createAlias("from", "f");
            criteria.createAlias("to", "t");

            criteria.add(Restrictions.eq("f.id", partnerId));   // partner sent
            criteria.add(Restrictions.eq("t.id", userId));      // I received
            criteria.add(Restrictions.ne("status", Status.READ));

            criteria.setProjection(Projections.rowCount());

            Long count = (Long) criteria.uniqueResult();
            System.out.println("unread count: " + count);
            return count != null ? count.intValue() : 0;
        } catch (Exception e) {
            System.out.println("Error counting unread messages from " + partnerId + " to " + userId + ": " + e.getMessage());
            return 0;
        }
    }

    public static void deliverChat(Chat chat) {
        org.hibernate.Session session = HibernateUtil.getSessionFactory().openSession();
        Transaction tr = null;
        try {
            tr = session.beginTransaction();
            session.persist(chat);
            tr.commit();
            System.out.println("Chat delivered from " + chat.getFrom().getId() + " to " + chat.getTo().getId());
        } catch (Exception e) {
            if (tr != null) {
                tr.rollback();
            }
            System.out.println("Error delivering chat: " + e.getMessage());
            e.printStackTrace();
        } finally {
            session.close();
        }

        // Send chat to both users
        Map<String, Object> envelope = new HashMap<>();
        envelope.put("type", "chat");
        envelope.put("payload", chat);

        sendToUser(chat.getTo().getId(), envelope);
        sendToUser(chat.getFrom().getId(), envelope);

        // Update friend lists for both users
        sendToUser(chat.getTo().getId(), friendListEnvelope(getFriendChatsForUser(chat.getTo().getId())));
        sendToUser(chat.getFrom().getId(), friendListEnvelope(getFriendChatsForUser(chat.getFrom().getId())));
    }

    public static Map<String, Object> friendListEnvelope(List<ChatSummary> list) {
        Map<String, Object> envelope = new HashMap<>();
        envelope.put("type", "friend_list");
        envelope.put("payload", list);
        return envelope;
    }

    public static List<Chat> getChatHistory(int userId, int friendId) {
        org.hibernate.Session session = HibernateUtil.getSessionFactory().openSession();
        Transaction tr = null;
        try {
            Criteria c = session.createCriteria(Chat.class);
            c.add(Restrictions.or(
                    Restrictions.and(
                            Restrictions.eq("from.id", userId),
                            Restrictions.eq("to.id", friendId)
                    ),
                    Restrictions.and(
                            Restrictions.eq("from.id", friendId),
                            Restrictions.eq("to.id", userId)
                    )
            ));
            c.addOrder(Order.asc("createdAt"));
            List<Chat> list = c.list();

            // Mark messages as read
            tr = session.beginTransaction();
            for (Chat chat : list) {
                if (chat.getFrom().getId() == friendId
                        && chat.getTo().getId() == userId
                        && chat.getStatus() == Status.SENT) {
                    chat.setStatus(Status.READ);
                    session.update(chat);
                }
            }
            tr.commit();

            System.out.println("Retrieved " + list.size() + " messages between " + userId + " and " + friendId);
            return list;

        } catch (Exception e) {
            if (tr != null) {
                tr.rollback();
            }
            System.out.println("Error getting chat history: " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>();
        } finally {
            session.close();
        }
    }

    public static Map<String, Object> singleChatEnvelope(List<Chat> chats) {
        Map<String, Object> envelope = new HashMap<>();
        envelope.put("type", "single_chat");
        envelope.put("payload", chats);
        return envelope;
    }

    public static void saveNewChat(int userId, int friendId, String message) {
        org.hibernate.Session session = HibernateUtil.getSessionFactory().openSession();
        Transaction tr = null;
        try {
            tr = session.beginTransaction();

            User me = (User) session.get(User.class, userId);
            User friend = (User) session.get(User.class, friendId);

            //Adding as active friends when starting a chat
            Criteria c1 = session.createCriteria(FriendList.class);
            c1.add(Restrictions.and(
                    Restrictions.eq("userId", me),
                    Restrictions.eq("friendId", friend)
            ));
            FriendList fl1 = (FriendList) c1.uniqueResult();
            if (fl1 == null) {
                FriendList friend1 = new FriendList();
                friend1.setFriendId(friend);
                friend1.setUserId(me);
                friend1.setStatus(Status.ACTIVE);
                session.save(friend1);
                System.out.println(friendId + " Added as friend");
            }

            if (me == null || friend == null) {
                System.out.println("Invalid users: me=" + userId + ", friend=" + friendId);
                return;
            }

            Chat chat = new Chat();
            chat.setFrom(me);
            chat.setTo(friend);
            chat.setMessage(message);
            chat.setCreatedAt(new Date());
            chat.setUpdatedAt(new Date());
            chat.setFiles("FILE:");
            chat.setStatus(Status.SENT);

            session.save(chat);
            tr.commit();

            System.out.println("New chat saved from " + userId + " to " + friendId);

            // Send new message notification
            Map<String, Object> envelope = new HashMap<>();
            envelope.put("type", "new_message");
            envelope.put("payload", chat);

            sendToUser(userId, envelope);
            sendToUser(friendId, envelope);

            // Update friend lists
            sendToUser(userId, friendListEnvelope(getFriendChatsForUser(userId)));
            sendToUser(friendId, friendListEnvelope(getFriendChatsForUser(friendId)));

        } catch (Exception e) {
            if (tr != null) {
                tr.rollback();
            }
            System.out.println("Error saving new chat: " + e.getMessage());
            e.printStackTrace();
        } finally {
            session.close();
        }
    }
}
