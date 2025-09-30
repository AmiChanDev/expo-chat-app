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
@WebServlet(name = "UserController", urlPatterns = {"/UserController"})
public class UserController extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        System.out.println("DoGet");
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

                Criteria c1 = session.createCriteria(User.class);
                c1.add(Restrictions.eq("countryCode", countryCode));
                c1.add(Restrictions.eq("contactNo", contactNo));

                User user = (User) c1.uniqueResult();
                if (user != null) {
                    responseObject.addProperty("message", "This number already exists!");
                } else {
                    user = new User(firstName, lastName, countryCode, contactNo);
                    Integer id = (Integer) session.save(user);
                    tx.commit();

                    responseObject.add("user", gson.toJsonTree(user));

                    String appPath = getServletContext().getRealPath("");
                    String newPath = appPath.replace("build" + File.separator + "web",
                            "web" + File.separator + "profile-images");

                    File profileFolder = new File(newPath, String.valueOf(id));
                    profileFolder.mkdirs();

                    File file1 = new File(profileFolder, "profile1.png");
                    Files.copy(profileImagePart.getInputStream(), file1.toPath(), StandardCopyOption.REPLACE_EXISTING);

                    responseObject.addProperty("status", true);
                    responseObject.addProperty("message", "User registered successfully");
                }
            }
        } catch (Exception e) {
            if (tx != null) {
                tx.rollback();
            }
            responseObject.addProperty("message", "Error: " + e.getMessage());
        } finally {
            if (session != null) {
                session.close();
            }
        }

        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(responseObject));
    }
}
