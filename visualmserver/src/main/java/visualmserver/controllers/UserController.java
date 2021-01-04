package visualmserver.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import visualmserver.exceptions.AuthorizationException;
import visualmserver.exceptions.InvalidDataException;
import visualmserver.exceptions.PreConditionException;
import visualmserver.exceptions.ResourceNotFoundException;
import visualmserver.models.User;
import visualmserver.repositories.UserRepository;
import visualmserver.util.FileUploadHandler;
import visualmserver.util.JWTokenInfo;

import java.io.IOException;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<User> getAllUsers() throws IOException {
        List<User> users = this.userRepository.findAll();

        for (User user : users) {
            user.setMediaURL(FileUploadHandler.getFileBase64(user.getimg_path()));
        }
        return users;
    }

    @GetMapping("/{id}")
    public User profile(@PathVariable int id) throws IOException {
        User user = this.userRepository.getUserById(id);

        if (user == null) {
            throw new ResourceNotFoundException(String.format("User not found with id=%d", id));
        }

        user.setMediaURL(FileUploadHandler.getFileBase64(user.getimg_path()));
        return user;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Long> deleteUser(@PathVariable int id, @RequestAttribute(value = JWTokenInfo.ATTRIBUTE_KEY) JWTokenInfo tokenInfo) {
        if (!tokenInfo.isAdmin()) {
            throw new AuthorizationException("Only administrators are able to remove existing users.");
        }

        if (this.userRepository.getUserById(id) == null) {
            throw new ResourceNotFoundException(String.format("User not found with id=%d", id));
        }

        return ResponseEntity.ok().body(this.userRepository.deleteUserById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateProfile(@PathVariable int id, @RequestBody User user, Errors errors) throws IOException {
        if (errors.hasErrors()) {
            throw new InvalidDataException("Invalid user object data.");
        }

        if (user.getId() != id) {
            throw new PreConditionException(String.format("User-ID=%d does not match with parameter=%d", user.getId(), id));
        }

        User registeredUser = userRepository.getUserById(id);
        user.setPassword(registeredUser.getPassword());

        if (user.getimg_path() != null) {
            String savedImgPath = FileUploadHandler.upload(user.getimg_path(), String.format("/images/profile-picture/%s/",
                    user.getId()));
            user.setMediaURL(savedImgPath);
        } else {
            user.setMediaURL(this.userRepository.getUserById(id).getimg_path());
        }

        User savedUser = this.userRepository.save(user);

        return ResponseEntity.ok().body(savedUser);
    }
}
