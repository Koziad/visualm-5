package visualmserver.models;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "token")
public class Token {
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Id
    private Long id;

    @Column(name = "token")
    private String tokenValue;

    @Column(name = "expiry_date")
    private LocalDateTime expiryDate;

    @OneToOne(targetEntity = User.class, fetch = FetchType.EAGER)
    @JoinColumn(nullable = false, name = "user_id")
    private User user;

    public Token() {
    }

    public Token(String token, LocalDateTime expiryDate, User user) {
        this.tokenValue = token;
        this.expiryDate = expiryDate;
        this.user = user;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public String getTokenValue() {
        return tokenValue;
    }

    public void setTokenValue(String tokenValue) {
        this.tokenValue = tokenValue;
    }

    public LocalDateTime getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDateTime expiryDate) {
        this.expiryDate = expiryDate;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public static Token generateToken(User user, LocalDateTime expiryDate) {
        return new Token(UUID.randomUUID().toString(), expiryDate, user);
    }

    public boolean isExpired() {
        return !LocalDateTime.now().isBefore(this.getExpiryDate());
    }
}
