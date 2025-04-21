package com.health.track.healthtrack.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.health.track.healthtrack.model.request.User;
import com.health.track.healthtrack.model.request.UserLogin;
import com.health.track.healthtrack.repository.UserRepository;
import java.util.Base64;
import java.util.Optional;

@Service
public class HealthRegisterService {

    @Autowired
    private UserRepository userRepository;

    // Register a New User
    public String insertUserDetails(User userDetails) {
        try {
            // Encrypt password before saving to the database
            String encryptedPassword = Base64.getEncoder().encodeToString(userDetails.getPassword().getBytes());
            userDetails.setPassword(encryptedPassword);

            // Check if the username already exists
            if (userRepository.findByUserName(userDetails.getUserName()).isPresent()) {
                return "UserName already exists - " + userDetails.getUserName();
            }

            // Save user details
            userRepository.save(userDetails);

            return "Registration successful!! Thanks for your interest " + userDetails.getUserName();
        } catch (Exception e) {
            return "Failed, try again later";
        }
    }

    public String loginCheck(UserLogin userDetails) {
        try {
            // Find the user by username
            Optional<User> optionalUser = userRepository.findByUserName(userDetails.getUserName());
    
            if (optionalUser.isPresent()) {
                User user = optionalUser.get();
                // Decrypt password stored in the database
                String decryptedPassword = new String(Base64.getDecoder().decode(user.getPassword()));
    
                if (decryptedPassword.equals(userDetails.getPassword())) {
                    return "Login Success!! Welcome " + user.getUserName();
                } else {
                    return "Login Failed!! Invalid password provided.";
                }
            } else {
                return "User doesn't exist, please try with a valid username.";
            }
        } catch (Exception e) {
            return "Login Failed!! An unexpected error occurred, please try again later.";
        }
    }
}