package entity;

import javax.persistence.*;

@Entity
@Table(name = "chat")
public class Chat extends BaseEntity {

    public Chat() {
    }

    public Chat(User from, String message, User to, String files,Status status) {
        this.from = from;
        this.message = message;
        this.to = to;
        this.files = files;
    }
    
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "from_user")
    private User from;

    @Column(columnDefinition = "LONGTEXT", name = "message")
    private String message;

    @ManyToOne
    @JoinColumn(name = "to_user")
    private User to;

    @Column(name = "files")
    private String files;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status = Status.SENT;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public User getFrom() {
        return from;
    }

    public void setFrom(User from) {
        this.from = from;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public User getTo() {
        return to;
    }

    public void setTo(User to) {
        this.to = to;
    }

    public String getFiles() {
        return files;
    }

    public void setFiles(String files) {
        this.files = files;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

}
