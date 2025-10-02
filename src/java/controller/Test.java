package controller;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.hibernate.Session;
import org.hibernate.Transaction;
import util.HibernateUtil;

/**
 *
 * @author AmiChan
 */
@WebServlet(name = "Test", urlPatterns = {"/Test"})
public class Test extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Session session = null;
        Transaction tx = null;

        try {
            session = HibernateUtil.getSessionFactory().openSession();

        } catch (Exception e) {
        } finally {
            if (session.isOpen()) {
                session.close();
            }
        }
//        try {
//           URL url = new URI("http://localhost:8080/ChatApp/profile-images/5/profile1.png").toURL();
//            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
//
//            conn.setRequestMethod("HEAD");
//            int responseCode = conn.getResponseCode();
//
//            conn.connect();
//            System.out.println(responseCode);
//            if (responseCode == HttpURLConnection.HTTP_OK) {
//                System.out.println("Yes");
//            } else {
//                System.out.println("No");
//            } 
//        } catch (Exception e) {
//            e.printStackTrace();
//        }
    }

}
