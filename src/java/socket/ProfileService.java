package socket;

import java.io.File;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.file.Files;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.Part;

public class ProfileService {

    public boolean saveProfileImage(int userId, HttpServletRequest request) {
        boolean isSuccessful = false;
        try {
            Part profileImage = request.getPart("profileImage"); // form field name = profileImage

            // Get the absolute path to your app’s profile-images folder
            String appPath = request.getServletContext().getRealPath("")
                    + File.separator + "profile-images";

            File profileFolder = new File(appPath, String.valueOf(userId));
            if (!profileFolder.exists()) {
                profileFolder.mkdirs();
            }

            File file1 = new File(profileFolder, "profile1.png");

            // Save uploaded file, replacing if it already exists
            Files.copy(profileImage.getInputStream(), file1.toPath(), java.nio.file.StandardCopyOption.REPLACE_EXISTING);

            isSuccessful = true;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return isSuccessful;
    }

    public static String getProfileUrl(int userId) {
        try {
            String profilePath = "http://localhost:8080/ChatApp/profile-images/" + userId + "/profile1.png";
            URL url = new URL(profilePath);

            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("HEAD");
            conn.connect();

            int responseCode = conn.getResponseCode();
            conn.disconnect();

            if (responseCode == HttpURLConnection.HTTP_OK) {
                return profilePath;
            } else {
                return "";
            }
        } catch (IOException e) {
            e.printStackTrace();
            return "";
        }
    }
}
