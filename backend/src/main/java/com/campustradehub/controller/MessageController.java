package com.campustradehub.controller;

import com.campustradehub.dto.MessageRequest;
import com.campustradehub.model.Message;
import com.campustradehub.model.User;
import com.campustradehub.repository.UserRepository;
import com.campustradehub.service.MessageService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageService messageService;
    private final UserRepository userRepository;

    public MessageController(MessageService messageService, UserRepository userRepository) {
        this.messageService = messageService;
        this.userRepository = userRepository;
    }

    private Long getUserIdFromAuth(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getId();
    }

    @GetMapping
    public ResponseEntity<List<Message>> getUserMessages(Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        return ResponseEntity.ok(messageService.getUserMessages(userId));
    }

    @GetMapping("/conversation/{userId}")
    public ResponseEntity<List<Message>> getConversation(
            @PathVariable Long userId,
            Authentication authentication) {
        Long currentUserId = getUserIdFromAuth(authentication);
        return ResponseEntity.ok(messageService.getConversation(currentUserId, userId));
    }

    @PostMapping
    public ResponseEntity<Message> sendMessage(
            @Valid @RequestBody MessageRequest request,
            Authentication authentication) {
        Long senderId = getUserIdFromAuth(authentication);
        return ResponseEntity.ok(messageService.sendMessage(request, senderId));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Message> markAsRead(
            @PathVariable Long id,
            Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        return ResponseEntity.ok(messageService.markAsRead(id, userId));
    }
}
