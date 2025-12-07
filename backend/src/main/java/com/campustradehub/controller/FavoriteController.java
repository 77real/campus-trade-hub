package com.campustradehub.controller;

import com.campustradehub.model.Favorite;
import com.campustradehub.model.User;
import com.campustradehub.repository.UserRepository;
import com.campustradehub.service.FavoriteService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

    private final FavoriteService favoriteService;
    private final UserRepository userRepository;

    public FavoriteController(FavoriteService favoriteService, UserRepository userRepository) {
        this.favoriteService = favoriteService;
        this.userRepository = userRepository;
    }

    private Long getUserIdFromAuth(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getId();
    }

    @GetMapping
    public ResponseEntity<List<Favorite>> getUserFavorites(Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        return ResponseEntity.ok(favoriteService.getUserFavorites(userId));
    }

    @GetMapping("/check/{itemId}")
    public ResponseEntity<Boolean> isFavorite(
            @PathVariable Long itemId,
            Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        return ResponseEntity.ok(favoriteService.isFavorite(userId, itemId));
    }

    @PostMapping("/{itemId}")
    public ResponseEntity<Favorite> addFavorite(
            @PathVariable Long itemId,
            Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        return ResponseEntity.ok(favoriteService.addFavorite(userId, itemId));
    }

    @DeleteMapping("/{itemId}")
    public ResponseEntity<Void> removeFavorite(
            @PathVariable Long itemId,
            Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        favoriteService.removeFavorite(userId, itemId);
        return ResponseEntity.noContent().build();
    }
}
