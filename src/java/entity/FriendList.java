package entity;

import java.io.Serializable;
import javax.persistence.*;

@Entity
@Table(name = "friend_list")
public class FriendList implements Serializable {

    public FriendList() {
    }

    public FriendList(User userId, User friendId, String displayName) {
        this.userId = userId;
        this.friendId = friendId;
        this.displayName = displayName;
    }

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User userId;

    @ManyToOne
    @JoinColumn(name = "friend_id")
    private User friendId;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status = Status.ACTIVE;

    @Column(name = "display_name")
    private String displayName;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public User getUserId() {
        return userId;
    }

    public void setUserId(User userId) {
        this.userId = userId;
    }

    public User getFriendId() {
        return friendId;
    }

    public void setFriendId(User friendId) {
        this.friendId = friendId;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

}
