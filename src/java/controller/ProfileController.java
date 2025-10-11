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
@WebServlet(name = "ProfileController", urlPatterns = {"/ProfileController"})
public class ProfileController extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        System.out.println("=== Profile Image Upload Request ===");

        String userId = request.getParameter("userId");
        Part profileImagePart = request.getPart("profileImage");

        Gson gson = new Gson();
        JsonObject responseObject = new JsonObject();

        response.setContentType("application/json");
        responseObject.addProperty("status", false);

        Session session = null;

        try {
            System.out.println("userId: " + userId);
            System.out.println("profileImage size: " + (profileImagePart != null ? profileImagePart.getSize() : "null"));

            // Validate input parameters
            if (userId == null || userId.trim().isEmpty()) {
                responseObject.addProperty("message", "User ID is required");
                response.getWriter().write(gson.toJson(responseObject));
                return;
            }

            if (profileImagePart == null || profileImagePart.getSize() == 0) {
                responseObject.addProperty("message", "Profile image is required");
                response.getWriter().write(gson.toJson(responseObject));
                return;
            }

            // Validate user ID format
            Integer userIdInt;
            try {
                userIdInt = Integer.parseInt(userId);
            } catch (NumberFormatException e) {
                responseObject.addProperty("message", "Invalid user ID format");
                response.getWriter().write(gson.toJson(responseObject));
                return;
            }

            // Verify user exists in database
            session = HibernateUtil.getSessionFactory().openSession();

            Criteria criteria = session.createCriteria(User.class);
            criteria.add(Restrictions.eq("id", userIdInt));

            User user = (User) criteria.uniqueResult();

            if (user == null) {
                System.out.println("❌ User not found with ID: " + userId);
                responseObject.addProperty("message", "User not found");
                response.getWriter().write(gson.toJson(responseObject));
                return;
            }

            System.out.println("✅ User found: " + user.getFirstName() + " " + user.getLastName());

            // Save profile image
            System.out.println("=== Saving Profile Image ===");

            String appPath = getServletContext().getRealPath("");
            String profileImagesPath = appPath.replace("build" + File.separator + "web",
                    "web" + File.separator + "profile-images");

            File userProfileFolder = new File(profileImagesPath, userId);

            // Create user profile folder if it doesn't exist
            if (!userProfileFolder.exists()) {
                boolean folderCreated = userProfileFolder.mkdirs();
                System.out.println("Profile folder created: " + folderCreated + " at path: " + userProfileFolder.getAbsolutePath());
            }

            // Save the new profile image
            File profileImageFile = new File(userProfileFolder, "profile1.png");
            Files.copy(profileImagePart.getInputStream(), profileImageFile.toPath(), StandardCopyOption.REPLACE_EXISTING);

            System.out.println("✅ Profile image saved successfully");
            System.out.println("Image path: " + profileImageFile.getAbsolutePath());

            // Generate URL for the uploaded image
            String baseUrl = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();
            String profileImageUrl = baseUrl + request.getContextPath() + "/profile-images/" + userId + "/profile1.png";

            // Build success response
            responseObject.addProperty("status", true);
            responseObject.addProperty("message", "Profile image updated successfully");
            responseObject.addProperty("profileImageUrl", profileImageUrl);

            // Add user info to response
            JsonObject userObject = new JsonObject();
            userObject.addProperty("id", user.getId());
            userObject.addProperty("firstName", user.getFirstName());
            userObject.addProperty("lastName", user.getLastName());
            userObject.addProperty("profileImage", profileImageUrl);

            responseObject.add("user", userObject);

            System.out.println("=== Profile Image Upload Success ===");
            System.out.println("✅ User: " + user.getFirstName() + " " + user.getLastName());
            System.out.println("✅ Profile image URL: " + profileImageUrl);

        } catch (Exception e) {
            System.out.println("❌ Error uploading profile image: " + e.getMessage());
            e.printStackTrace();

            responseObject.addProperty("message", "Error uploading profile image: " + e.getMessage());
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

        System.out.println("=== Profile Upload Response Sent ===");
        System.out.println(jsonResponse);
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        System.out.println("=== Profile Controller GET Request ===");

        Gson gson = new Gson();
        JsonObject responseObject = new JsonObject();

        response.setContentType("application/json");

        responseObject.addProperty("status", false);
        responseObject.addProperty("message", "GET method not supported for profile operations. Use POST to upload profile images.");

        response.getWriter().write(gson.toJson(responseObject));
    }
}
