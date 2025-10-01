package socket;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;

public class ProfileService {

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
