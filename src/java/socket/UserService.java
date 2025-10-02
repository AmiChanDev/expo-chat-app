package socket;

import com.google.gson.JsonObject;
import com.google.gson.internal.LinkedTreeMap;
import dto.UserDTO;
import entity.Chat;
import entity.FriendList;
import entity.Status;
import entity.User;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.hibernate.Criteria;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;
import util.HibernateUtil;

public class UserService {

    public static void updateLogInStatus(int userId) {
        updateUserStatus(userId, Status.ONLINE);
        System.out.println("User " + userId + " status updated to ONLINE");
    }

    public static void updateLogOutStatus(int userId) {
        updateUserStatus(userId, Status.OFFLINE);
        System.out.println("User " + userId + " status updated to OFFLINE");
    }

    /**
     * OPTIMIZED: Better session and transaction management
     *
     * @param userId
     * @param status
     */
    public static void updateUserStatus(int userId, Status status) {
        Session session = null;
        Transaction transaction = null;
        try {
            session = HibernateUtil.getSessionFactory().openSession();
            transaction = session.beginTransaction();

            User user = (User) session.get(User.class, userId);
            if (user != null) {
                user.setStatus(status);
                user.setUpdatedAt(new Date());
                session.update(user);
                transaction.commit();
                System.out.println("Updated user " + userId + " status to " + status);
            } else {
                System.out.println("User " + userId + " not found");
                if (transaction != null) {
                    transaction.rollback();
                }
            }
        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            System.out.println("Error updating user status for user " + userId + ": " + e.getMessage());
            e.printStackTrace();
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }

    /**
     * OPTIMIZED: Fixed transaction management and resource cleanup FIXED:
     * Multiple transaction commits and session handling
     */
    public static void updateFriendChatStatus(int userId) {
        Session session = null;
        Transaction transaction = null;
        try {
            session = HibernateUtil.getSessionFactory().openSession();
            transaction = session.beginTransaction();

            // Get user's active friends
            Criteria friendCriteria = session.createCriteria(FriendList.class);
            friendCriteria.add(Restrictions.eq("userId.id", userId));
            friendCriteria.add(Restrictions.eq("status", Status.ACTIVE));
            List<FriendList> myFriends = friendCriteria.list();

            System.out.println("Updating chat status for user " + userId + " with " + myFriends.size() + " friends");

            int updatedChats = 0;
            for (FriendList myFriend : myFriends) {
                try {
                    User me = myFriend.getUserId();
                    User friend = myFriend.getFriendId();

                    // Only update if user is online
                    if (me != null && Status.ONLINE.equals(me.getStatus())) {
                        // Get undelivered chats from friend to me
                        Criteria chatCriteria = session.createCriteria(Chat.class);
                        Criterion chatRestriction = Restrictions.and(
                                Restrictions.eq("from", friend),
                                Restrictions.eq("to", me),
                                Restrictions.eq("status", Status.SENT)
                        );
                        chatCriteria.add(chatRestriction);
                        List<Chat> chats = chatCriteria.list();

                        // Update chat status to delivered
                        for (Chat chat : chats) {
                            chat.setStatus(Status.DELIVERED);
                            chat.setUpdatedAt(new Date());
                            session.update(chat);
                            updatedChats++;
                        }
                    }
                } catch (Exception e) {
                    System.out.println("Error processing friend for user " + userId + ": " + e.getMessage());
                    // Continue with other friends
                }
            }

            transaction.commit();
            System.out.println("Updated " + updatedChats + " chats to DELIVERED status for user " + userId);

        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            System.out.println("Error updating friend chat status for user " + userId + ": " + e.getMessage());
            e.printStackTrace();
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }

    /**
     * OPTIMIZED: Better error handling and resource management
     *
     * @param friendId
     * @return
     */
    public static Map<String, Object> getFriendData(int friendId) {
        Session session = null;
        try {
            session = HibernateUtil.getSessionFactory().openSession();
            User friend = (User) session.get(User.class, friendId);

            Map<String, Object> envelope = new HashMap<>();
            envelope.put("type", "friend_data");

            if (friend != null) {
                envelope.put("payload", friend);
                System.out.println("Retrieved friend data for user " + friendId);
            } else {
                envelope.put("payload", null);
                System.out.println("Friend " + friendId + " not found");
            }

            return envelope;

        } catch (Exception e) {
            System.out.println("Error getting friend data for user " + friendId + ": " + e.getMessage());
            e.printStackTrace();

            // Return error envelope
            Map<String, Object> errorEnvelope = new HashMap<>();
            errorEnvelope.put("type", "friend_data");
            errorEnvelope.put("payload", null);
            errorEnvelope.put("error", "User not found");
            return errorEnvelope;

        } finally {
            if (session != null) {
                session.close();
            }
        }
    }

    /**
     * UTILITY: Get user by ID with proper session management
     *
     * @param userId
     * @return
     */
    public static User getUserById(int userId) {
        Session session = null;
        try {
            session = HibernateUtil.getSessionFactory().openSession();
            User user = (User) session.get(User.class, userId);
            return user;
        } catch (Exception e) {
            System.out.println("Error getting user " + userId + ": " + e.getMessage());
            e.printStackTrace();
            return null;
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }

    /**
     * UTILITY: Check if user exists
     */
    public static boolean userExists(int userId) {
        return getUserById(userId) != null;
    }

    /**
     * UTILITY: Get user status
     *
     * @param userId
     * @return
     */
    public static Status getUserStatus(int userId) {
        User user = getUserById(userId);
        return user != null ? user.getStatus() : Status.OFFLINE;
    }

    /**
     * OPTIMIZED: Batch update user statuses for better performance
     *
     * @param userStatusMap
     */
    public static void updateMultipleUserStatuses(Map<Integer, Status> userStatusMap) {
        if (userStatusMap == null || userStatusMap.isEmpty()) {
            return;
        }

        Session session = null;
        Transaction transaction = null;
        try {
            session = HibernateUtil.getSessionFactory().openSession();
            transaction = session.beginTransaction();

            int updatedCount = 0;
            for (Map.Entry<Integer, Status> entry : userStatusMap.entrySet()) {
                try {
                    int userId = entry.getKey();
                    Status status = entry.getValue();

                    User user = (User) session.get(User.class, userId);
                    if (user != null) {
                        user.setStatus(status);
                        user.setUpdatedAt(new Date());
                        session.update(user);
                        updatedCount++;
                    }
                } catch (Exception e) {
                    System.out.println("Error updating user " + entry.getKey() + ": " + e.getMessage());
                    // Continue with other users
                }
            }

            transaction.commit();
            System.out.println("Batch updated " + updatedCount + " user statuses");

        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            System.out.println("Error in batch update user statuses: " + e.getMessage());
            e.printStackTrace();
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }

    public static Map<String, Object> getAllUsers(int userId) {
        Session session = null;
        Transaction transaction = null;
        try {
            session = HibernateUtil.getSessionFactory().openSession();
            transaction = session.beginTransaction();

            Criteria c1 = session.createCriteria(User.class);
            List<User> users = c1.list();

            Map<String, Object> map = new HashMap();
            List<UserDTO> UserDTO = new ArrayList<>();

            for (User user : users) {
                Criteria c2 = session.createCriteria(FriendList.class);
                c2.add(Restrictions.and(
                        Restrictions.eq("friendId.id", user.getId()), // match by friend's id
                        Restrictions.eq("userId.id", userId), // correct field name
                        Restrictions.ne("status", Status.BLOCKED)
                ));
                FriendList fl = (FriendList) c2.uniqueResult();

                UserDTO dto = new UserDTO();
                dto.setId(user.getId());
                dto.setFirstName(user.getFirstName());
                dto.setLastName(user.getLastName());
                dto.setCountryCode(user.getCountryCode());
                dto.setContactNo(user.getContactNo());
                dto.setProfileImage(ProfileService.getProfileUrl(userId));
                dto.setCreatedAt(user.getCreatedAt());
                dto.setUpdatedAt(user.getUpdatedAt());
                dto.setStatus(user.getStatus());

                UserDTO.add(dto);

                if (fl != null) {
                    user.setStatus(Status.ACTIVE);
                }

            }

            map.put("type", "get_all_users");
            map.put("payload", UserDTO);
            return map;
        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            System.out.println("Error in getting all users" + e.getMessage());
            e.printStackTrace();
        }
        return null;
    }

    public static Map<String, Object> saveNewContact(int myId, LinkedTreeMap userObject) {
        Session session = null;
        Transaction tx = null;

        try {
            session = HibernateUtil.getSessionFactory().openSession();
            tx = session.beginTransaction();

            JsonObject responseObject = new JsonObject();
            responseObject.addProperty("responseStatus", Boolean.FALSE);

            // Get friend by contact number 
            Criteria c1 = session.createCriteria(User.class);
            c1.add(Restrictions.eq("contactNo", userObject.get("contactNo")));
            User friendUser = (User) c1.uniqueResult();

            if (friendUser == null) {
                responseObject.addProperty("message", "This user is not on this app");
            } else {
                // Check if they are already friends 
                Criteria c2 = session.createCriteria(FriendList.class);
                c2.add(Restrictions.eq("userId.id", myId));
                c2.add(Restrictions.eq("friendId.id", friendUser.getId()));

                FriendList existingFriendship = (FriendList) c2.uniqueResult();

                if (existingFriendship != null) {
                          responseObject.addProperty("responseStatus", Boolean.FALSE);
                    responseObject.addProperty("message", "This user is already your friend");
                } else {
                    // Get current user using Criteria
                    Criteria c3 = session.createCriteria(User.class);
                    c3.add(Restrictions.eq("id", myId));
                    User currentUser = (User) c3.uniqueResult();

                    if (currentUser != null) {
                        // Create new friendship
                        FriendList newFriend = new FriendList();
                        newFriend.setUserId(currentUser);
                        newFriend.setFriendId(friendUser);
                        // Set display name
                        newFriend.setDisplayName(String.valueOf(userObject.get("displayName")));
                        
                        session.save(newFriend);

                        responseObject.addProperty("responseStatus", Boolean.TRUE);
                        responseObject.addProperty("message", "User added as friend");
                    } else {
                              responseObject.addProperty("responseStatus", Boolean.FALSE);
                        responseObject.addProperty("message", "Current user not found");
                    }
                }
            }

            tx.commit();

            Map<String, Object> map = new HashMap<>();
            map.put("type", "new_contact_response_text");
            map.put("payload", responseObject);

            return map;

        } catch (Exception e) {
            if (tx != null) {
                tx.rollback();
            }
            System.out.println("Error in saving a contact: " + e.getMessage());
            e.printStackTrace();
        } finally {
            if (session != null) {
                session.close();
            }
        }

        return null;
    }
}
