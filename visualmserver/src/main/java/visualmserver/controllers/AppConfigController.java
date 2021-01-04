package visualmserver.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import visualmserver.exceptions.AuthorizationException;
import visualmserver.exceptions.PreConditionException;
import visualmserver.exceptions.ResourceNotFoundException;
import visualmserver.models.AppConfig;
import visualmserver.repositories.AppConfigRepository;
import visualmserver.util.JWTokenInfo;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/config")
public class AppConfigController {
    @Autowired
    private AppConfigRepository appConfigRepository;

    @GetMapping
    public Map<String, String> getAllConfiguration() {
        // Create a map from the existing key-value pair that is stored in the DB
        return this.appConfigRepository.findAll().stream().collect(Collectors.toMap(AppConfig::getKey, AppConfig::getValue));
    }

    @PutMapping("/default")
    public ResponseEntity<Map<String, String>> updateConfiguration(@RequestAttribute(value = JWTokenInfo.ATTRIBUTE_KEY) JWTokenInfo tokenInfo,
                                                                  @RequestBody Map<String, String> configMap) {
        if (!tokenInfo.isAdmin()) {
            throw new AuthorizationException("Only administrators are able to remove existing users.");
        }

        Map<String, String> savedConfigs = new HashMap<>();

        // Update and collect the saved configuration to be returned
        configMap.forEach((key, value) -> {
            AppConfig savedConfig = this.appConfigRepository.save(new AppConfig(key, value));
            savedConfigs.put(savedConfig.getKey(), savedConfig.getValue());
        });

        return ResponseEntity.ok().body(savedConfigs);
    }
}
