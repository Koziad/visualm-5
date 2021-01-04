package visualmserver.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import visualmserver.models.Token;
import visualmserver.models.User;

@Repository
public interface TokenRepository extends JpaRepository<Token, Long> {
    Token findByTokenValue(String token);

    Token findByUser(User user);

    @Transactional
    @Modifying
    void deleteTokenByTokenValueAndUser(String token, User user);
}
