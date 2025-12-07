package com.campustradehub.controller;

import com.campustradehub.model.User;
import com.campustradehub.repository.UserRepository;
import com.campustradehub.repository.ItemRepository;
import com.campustradehub.repository.MessageRepository;
import com.campustradehub.repository.FavoriteRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;
    private final ItemRepository itemRepository;
    private final MessageRepository messageRepository;
    private final FavoriteRepository favoriteRepository;

    public UserController(UserRepository userRepository, 
                         ItemRepository itemRepository,
                         MessageRepository messageRepository,
                         FavoriteRepository favoriteRepository) {
        this.userRepository = userRepository;
        this.itemRepository = itemRepository;
        this.messageRepository = messageRepository;
        this.favoriteRepository = favoriteRepository;
    }

    @GetMapping("/export-data")
    public ResponseEntity<Map<String, Object>> exportUserData(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Map<String, Object> userData = new HashMap<>();
        
        // Create personal info map with null-safe values
        Map<String, Object> personalInfo = new HashMap<>();
        personalInfo.put("id", user.getId());
        personalInfo.put("username", user.getUsername());
        personalInfo.put("email", user.getEmail());
        personalInfo.put("phone", user.getPhone() != null ? user.getPhone() : "");
        personalInfo.put("reputationScore", user.getReputationScore());
        personalInfo.put("isVerified", user.getIsVerified());
        personalInfo.put("createdAt", user.getCreatedAt() != null ? user.getCreatedAt().toString() : "");
        personalInfo.put("lastLogin", user.getLastLogin() != null ? user.getLastLogin().toString() : "");
        
        userData.put("personalInfo", personalInfo);
        userData.put("items", itemRepository.findByUserId(user.getId(), null).getContent());
        userData.put("favorites", favoriteRepository.findByUserId(user.getId()));
        userData.put("messages", messageRepository.findByUserId(user.getId()));
        userData.put("exportedAt", java.time.LocalDateTime.now().toString());
        userData.put("dataProtectionNote", "This data export complies with GDPR Article 20 (Right to Data Portability)");

        return ResponseEntity.ok(userData);
    }

    @DeleteMapping("/delete-account")
    public ResponseEntity<String> deleteAccount(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Delete all related data (cascade should handle most, but explicit for clarity)
        messageRepository.deleteAll(messageRepository.findByUserId(user.getId()));
        favoriteRepository.deleteAll(favoriteRepository.findByUserId(user.getId()));
        itemRepository.deleteAll(itemRepository.findByUserId(user.getId(), null).getContent());
        
        // Delete user account
        userRepository.delete(user);

        return ResponseEntity.ok("Account successfully deleted. GDPR compliance: All personal data has been permanently removed.");
    }
}
