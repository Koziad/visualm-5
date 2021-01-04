package visualmserver.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import visualmserver.models.User;

import javax.transaction.Transactional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

  User getUserById(int id);
  User getUserByEmail(String email);

  @Transactional
  @Modifying
  Long deleteUserById(int id);
}
