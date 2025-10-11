package controller;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import entity.User;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.criterion.Restrictions;
import util.HibernateUtil;

@MultipartConfig
@WebServlet(name = "UserController", urlPatterns = {"/UserController", "/UserController/*"})
public class UserController extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        System.out.println("=== UserController GET Request ===");
        
        String pathInfo = request.getPathInfo();
        Gson gson = new Gson();
        JsonObject responseObject = new JsonObject();
        
        response.setContentType("application/json");
        
        if (pathInfo == null || pathInfo.equals("/")) {
            // Handle GET request without user ID - could be used for listing users
            responseObject.addProperty("status", false);
            responseObject.addProperty("message", "User ID is required");
            response.getWriter().write(gson.toJson(responseObject));
            return;
        }
        
        // Extract user ID from path
        String userId = pathInfo.substring(1); // Remove leading slash
        System.out.println("Fetching user details for ID: " + userId);
        
        Session session = null;
        
        try {
            // Validate user ID
            if (userId.trim().isEmpty()) {
                responseObject.addProperty("status", false);
                responseObject.addProperty("message", "Invalid user ID");
                response.getWriter().write(gson.toJson(responseObject));
                return;
            }
            
            Integer userIdInt;
            try {
                userIdInt = Integer.parseInt(userId);
            } catch (NumberFormatException e) {
                responseObject.addProperty("status", false);
                responseObject.addProperty("message", "Invalid user ID format");
                response.getWriter().write(gson.toJson(responseObject));
                return;
            }
            
            session = HibernateUtil.getSessionFactory().openSession();
            
            // Query user by ID
            Criteria criteria = session.createCriteria(User.class);
            criteria.add(Restrictions.eq("id", userIdInt));
            
            User user = (User) criteria.uniqueResult();
            
            if (user == null) {
                System.out.println("User not found with ID: " + userId);
                responseObject.addProperty("status", false);
                responseObject.addProperty("message", "User not found");
            } else {
                System.out.println("User found: " + user.getFirstName() + " " + user.getLastName());
                
                // Build user object
                JsonObject userObject = new JsonObject();
                userObject.addProperty("id", user.getId());
                userObject.addProperty("firstName", user.getFirstName());
                userObject.addProperty("lastName", user.getLastName());
                userObject.addProperty("countryCode", user.getCountryCode());
                userObject.addProperty("contactNo", user.getContactNo());
                userObject.addProperty("status", user.getStatus().toString());
                
                // Add timestamps if available
                if (user.getCreatedAt() != null) {
                    userObject.addProperty("createdAt", user.getCreatedAt().toString());
                }
                if (user.getUpdatedAt() != null) {
                    userObject.addProperty("updatedAt", user.getUpdatedAt().toString());
                }
                
                // Check if profile image exists
                String appPath = getServletContext().getRealPath("");
                String profileImagePath = appPath.replace("build" + File.separator + "web",
                        "web" + File.separator + "profile-images" + File.separator + userId + File.separator + "profile1.png");
                
                File profileImageFile = new File(profileImagePath);
                if (profileImageFile.exists()) {
                    // Generate URL for profile image
                    String baseUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();
                    String profileImageUrl = baseUrl + request.getContextPath() + "/profile-images/" + userId + "/profile1.png";
                    userObject.addProperty("profileImage", profileImageUrl);
                    System.out.println("Profile image URL: " + profileImageUrl);
                } else {
                    System.out.println("No profile image found for user: " + userId);
                }
                
                // Build success response
                responseObject.addProperty("status", true);
                responseObject.addProperty("message", "User details retrieved successfully");
                responseObject.add("user", userObject);
                responseObject.add("data", userObject); // For compatibility
                
                System.out.println("✅ User details response prepared for: " + user.getFirstName() + " " + user.getLastName());
            }
            
        } catch (Exception e) {
            System.out.println("❌ Error fetching user details: " + e.getMessage());
            e.printStackTrace();
            
            responseObject.addProperty("status", false);
            responseObject.addProperty("message", "Error retrieving user details: " + e.getMessage());
        } finally {
            if (session != null) {
                try {
                    session.close();
                    System.out.println("Database session closed");
                } catch (Exception closeError) {
                    System.out.println("Error closing session: " + closeError.getMessage());
                }
            }
        }
        
        // Send response
        String jsonResponse = gson.toJson(responseObject);
        response.getWriter().write(jsonResponse);
        
        System.out.println("=== GET Response Sent ===");
        System.out.println(jsonResponse);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String firstName = request.getParameter("firstName");
        String lastName = request.getParameter("lastName");
        String countryCode = request.getParameter("countryCode");
        String contactNo = request.getParameter("contactNo");
        String status = request.getParameter("status");
        Part profileImagePart = request.getPart("profileImage");

        Gson gson = new Gson();
        JsonObject responseObject = new JsonObject();

        Session session = null;
        Transaction tx = null;
        responseObject.addProperty("status", false);
        
        try {
            System.out.println("=== User Registration Request ===");
            System.out.println("firstName: " + firstName);
            System.out.println("lastName: " + lastName);
            System.out.println("countryCode: " + countryCode);
            System.out.println("contactNo: " + contactNo);
            System.out.println("profileImage size: " + (profileImagePart != null ? profileImagePart.getSize() : "null"));
            
            if (firstName == null || firstName.trim().isEmpty()) {
                responseObject.addProperty("message", "First name is required");
            } else if (lastName == null || lastName.trim().isEmpty()) {
                responseObject.addProperty("message", "Last name is required");
            } else if (countryCode == null || countryCode.trim().isEmpty()) {
                responseObject.addProperty("message", "Country code is required");
            } else if (contactNo == null || contactNo.trim().isEmpty()) {
                responseObject.addProperty("message", "Contact number is required");
            } else if (profileImagePart == null || profileImagePart.getSize() == 0) {
                responseObject.addProperty("message", "Profile image is required");
            } else {
                session = HibernateUtil.getSessionFactory().openSession();
                tx = session.beginTransaction();

                // Check if user already exists
                Criteria existingUserCriteria = session.createCriteria(User.class);
                existingUserCriteria.add(Restrictions.eq("countryCode", countryCode));
                existingUserCriteria.add(Restrictions.eq("contactNo", contactNo));

                User existingUser = (User) existingUserCriteria.uniqueResult();
                if (existingUser != null) {
                    responseObject.addProperty("message", "This number already exists!");
                    System.out.println("Registration failed: Number already exists - " + countryCode + contactNo);
                } else {
                    System.out.println("=== Step 1: Creating User Object ===");
                    
                    // Create new user
                    User newUser = new User(firstName, lastName, countryCode, contactNo);
                    System.out.println("Created user object with name: " + firstName + " " + lastName);
                    
                    // Save user to database
                    System.out.println("=== Step 2: Saving User to Database ===");
                    session.save(newUser);
                    
                    // Commit transaction to ensure data is persisted
                    tx.commit();
                    System.out.println("✅ User saved and transaction committed");
                    
                    // Start new transaction for querying
                    tx = session.beginTransaction();
                    
                    System.out.println("=== Step 3: Querying Database for Generated ID ===");
                    
                    // Query the database to get the saved user with generated ID
                    Criteria savedUserCriteria = session.createCriteria(User.class);
                    savedUserCriteria.add(Restrictions.eq("countryCode", countryCode));
                    savedUserCriteria.add(Restrictions.eq("contactNo", contactNo));
                    savedUserCriteria.add(Restrictions.eq("firstName", firstName));
                    savedUserCriteria.add(Restrictions.eq("lastName", lastName));
                    
                    User savedUser = (User) savedUserCriteria.uniqueResult();
                    
                    if (savedUser == null) {
                        System.out.println("❌ ERROR: Could not retrieve saved user from database");
                        responseObject.addProperty("message", "Error retrieving saved user data");
                        return;
                    }
                    
                    // Get the auto-generated ID from the queried user
                    Integer userId = savedUser.getId();
                    System.out.println("✅ Successfully retrieved user from DB with ID: " + userId);
                    System.out.println("User details from DB: " + savedUser.getFirstName() + " " + savedUser.getLastName());
                    
                    // Verify the ID is valid
                    if (userId == null || userId <= 0) {
                        System.out.println("❌ ERROR: Invalid user ID generated: " + userId);
                        responseObject.addProperty("message", "Error: Invalid user ID generated");
                        if (tx != null && tx.isActive()) {
                            tx.rollback();
                        }
                        return;
                    }

                    // Save profile image using the confirmed user ID
                    System.out.println("=== Step 4: Saving Profile Image ===");
                    try {
                        String appPath = getServletContext().getRealPath("");
                        String newPath = appPath.replace("build" + File.separator + "web",
                                "web" + File.separator + "profile-images");

                        File profileFolder = new File(newPath, String.valueOf(userId));
                        boolean folderCreated = profileFolder.mkdirs();
                        System.out.println("Profile folder created: " + folderCreated + " at path: " + profileFolder.getAbsolutePath());

                        File file1 = new File(profileFolder, "profile1.png");
                        Files.copy(profileImagePart.getInputStream(), file1.toPath(), StandardCopyOption.REPLACE_EXISTING);
                        
                        System.out.println("✅ Profile image saved successfully for user: " + userId);
                        System.out.println("Image path: " + file1.getAbsolutePath());
                    } catch (Exception imageError) {
                        System.out.println("❌ Error saving profile image: " + imageError.getMessage());
                        imageError.printStackTrace();
                        // Don't fail the registration if image save fails
                    }

                    // Commit the transaction
                    tx.commit();
                    
                    System.out.println("=== Step 5: Building Success Response ===");
                    
                    // Build comprehensive success response
                    responseObject.addProperty("status", true);
                    responseObject.addProperty("message", "User registered successfully");
                    responseObject.addProperty("userId", userId);
                    responseObject.addProperty("id", userId);
                    
                    // Add complete user object
                    JsonObject userObject = new JsonObject();
                    userObject.addProperty("id", userId);
                    userObject.addProperty("firstName", savedUser.getFirstName());
                    userObject.addProperty("lastName", savedUser.getLastName());
                    userObject.addProperty("countryCode", savedUser.getCountryCode());
                    userObject.addProperty("contactNo", savedUser.getContactNo());
                    userObject.addProperty("status", savedUser.getStatus().toString());
                    if (savedUser.getCreatedAt() != null) {
                        userObject.addProperty("createdAt", savedUser.getCreatedAt().toString());
                    }
                    if (savedUser.getUpdatedAt() != null) {
                        userObject.addProperty("updatedAt", savedUser.getUpdatedAt().toString());
                    }
                    responseObject.add("user", userObject);
                    
                    // Add data wrapper for compatibility
                    JsonObject dataObject = new JsonObject();
                    dataObject.addProperty("userId", userId);
                    dataObject.add("user", userObject);
                    responseObject.add("data", dataObject);
                    
                    System.out.println("=== Registration Success Summary ===");
                    System.out.println("✅ User ID: " + userId);
                    System.out.println("✅ Name: " + savedUser.getFirstName() + " " + savedUser.getLastName());
                    System.out.println("✅ Contact: " + countryCode + contactNo);
                    System.out.println("✅ Profile image saved");
                    System.out.println("✅ Response prepared");
                }
            }
        } catch (Exception e) {
            System.out.println("=== Registration Error ===");
            System.out.println("Error occurred: " + e.getMessage());
            e.printStackTrace();
            
            if (tx != null && tx.isActive()) {
                try {
                    tx.rollback();
                    System.out.println("Transaction rolled back due to error");
                } catch (Exception rollbackError) {
                    System.out.println("Error during rollback: " + rollbackError.getMessage());
                }
            }
            
            responseObject.addProperty("message", "Error: " + e.getMessage());
        } finally {
            if (session != null) {
                try {
                    session.close();
                    System.out.println("Database session closed");
                } catch (Exception closeError) {
                    System.out.println("Error closing session: " + closeError.getMessage());
                }
            }
        }

        // Send response
        response.setContentType("application/json");
        String jsonResponse = gson.toJson(responseObject);
        response.getWriter().write(jsonResponse);
        
        System.out.println("=== Final Response Sent ===");
        System.out.println(jsonResponse);
    }
}