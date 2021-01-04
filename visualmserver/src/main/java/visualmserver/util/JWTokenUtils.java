package visualmserver.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import visualmserver.exceptions.TokenException;

import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Component
public class JWTokenUtils {
    public static final String ADMIN_CLAIM = "admin";
    public static final String EMAIL_CLAIM = "email";

    @Value("${jwt.issuer}")
    private String issuer;

    @Value("${jwt.pass-phrase}")
    private String passphrase;

    @Value("${jwt.expiration-seconds}")
    private int expiration;

    @Value("${jwt.refresh-expiration-seconds}")
    private int refreshExpiration;

    private Key getKey(String passphrase) {
        byte hmacKey[] = passphrase.getBytes(StandardCharsets.UTF_8);
        Key key = new SecretKeySpec(hmacKey, SignatureAlgorithm.HS512.getJcaName());
        return key;
    }

    public String encode(String id, String email, boolean admin) {
        Key key = getKey(this.passphrase);

        String token = Jwts.builder()
                .setSubject(id)
                .claim(EMAIL_CLAIM, email)
                .claim(ADMIN_CLAIM, Boolean.toString(admin))
                .setIssuer(this.issuer)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + this.expiration * 1000))
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();

        return token;
    }

    public JWTokenInfo decode(String jwt) {
        Key key = getKey(this.passphrase);

        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(jwt)
                    .getBody();

            JWTokenInfo tokenInfo = new JWTokenInfo();

            tokenInfo.setId(Long.parseLong(claims.getSubject()));
            tokenInfo.setEmail(claims.get(EMAIL_CLAIM).toString());
            tokenInfo.setAdmin(Boolean.parseBoolean(claims.get(ADMIN_CLAIM).toString()));
            tokenInfo.setIssuedAt(claims.getIssuedAt());
            tokenInfo.setExpiration(claims.getExpiration());

            return tokenInfo;
        }
        catch (JwtException e) {
            throw new TokenException(e.getMessage());
        }
    }
}
