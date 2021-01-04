package visualmserver;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@EntityScan(basePackages = {"visualmserver.models"})
public class VisualmserverApplication {

	public static void main(String[] args) {
		SpringApplication.run(VisualmserverApplication.class, args);
	}

}
