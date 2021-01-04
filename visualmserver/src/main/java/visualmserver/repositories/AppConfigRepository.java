package visualmserver.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import visualmserver.models.AppConfig;

public interface AppConfigRepository extends JpaRepository<AppConfig, String> {
}
