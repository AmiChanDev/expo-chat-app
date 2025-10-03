package entity;

import java.util.Date;
import javax.persistence.*;

@Entity
@Table(name = "user")
public class User extends BaseEntity {

    public User() {
    }

//    public User(String firstName, String lastName, String countryCode, String contactNo, Date createdAt, Date updatedAt) {
//        this.firstName = firstName;
//        this.lastName = lastName;
//        this.countryCode = countryCode;
//        this.contactNo = contactNo;
//        this.setCreatedAt(createdAt);
//        this.setUpdatedAt(updatedAt);
//    }
    public User(String firstName, String lastName, String countryCode, String contactNo) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.countryCode = countryCode;
        this.contactNo = contactNo;
        Date now = new Date();
        setCreatedAt(now);
        setUpdatedAt(now);
    }

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(name = "country_code", nullable = false)
    private String countryCode;

    @Column(name = "contact_no", nullable = false, unique = true)
    private String contactNo;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status = Status.ONLINE;

    public int getId() {
        return id;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getCountryCode() {
        return countryCode;
    }

    public void setCountryCode(String countryCode) {
        this.countryCode = countryCode;
    }

    public String getContactNo() {
        return contactNo;
    }

    public void setContactNo(String contactNo) {
        this.contactNo = contactNo;
    }
}
