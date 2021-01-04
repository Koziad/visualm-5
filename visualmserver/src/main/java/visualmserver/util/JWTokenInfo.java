package visualmserver.util;

import java.util.Date;

public class JWTokenInfo {
    public static final String ATTRIBUTE_KEY = "jwtokenInfo";

    private long id;
    private String email;
    private boolean admin;
    private Date issuedAt;
    private Date expiration;

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Date getIssuedAt() {
        return issuedAt;
    }

    public void setIssuedAt(Date issuedAt) {
        this.issuedAt = issuedAt;
    }

    public Date getExpiration() {
        return expiration;
    }

    public void setExpiration(Date expiration) {
        this.expiration = expiration;
   }

    public boolean isAdmin() {
        return admin;
    }

    public void setAdmin(boolean admin) {
        this.admin = admin;
    }

    @Override
    public String toString() {
        return "JWTokenInfo{" +
                "id=" + id +
                ", email='" + email + '\'' +
                ", admin=" + admin +
                ", issuedAt=" + issuedAt +
                ", expiration=" + expiration +
                '}';
    }
}
