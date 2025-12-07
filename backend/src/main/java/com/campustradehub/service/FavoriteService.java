package com.campustradehub.service;

import com.campustradehub.model.Favorite;
import com.campustradehub.model.Item;
import com.campustradehub.model.User;
import com.campustradehub.repository.FavoriteRepository;
import com.campustradehub.repository.ItemRepository;
import com.campustradehub.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;
    private final ItemRepository itemRepository;

    public FavoriteService(FavoriteRepository favoriteRepository,
                          UserRepository userRepository,
                          ItemRepository itemRepository) {
        this.favoriteRepository = favoriteRepository;
        this.userRepository = userRepository;
        this.itemRepository = itemRepository;
    }

    public List<Favorite> getUserFavorites(Long userId) {
        return favoriteRepository.findByUserId(userId);
    }

    public boolean isFavorite(Long userId, Long itemId) {
        return favoriteRepository.existsByUserIdAndItemId(userId, itemId);
    }

    @Transactional
    public Favorite addFavorite(Long userId, Long itemId) {
        if (favoriteRepository.existsByUserIdAndItemId(userId, itemId)) {
            throw new RuntimeException("Item already in favorites");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        Favorite favorite = new Favorite();
        favorite.setUser(user);
        favorite.setItem(item);

        return favoriteRepository.save(favorite);
    }

    @Transactional
    public void removeFavorite(Long userId, Long itemId) {
        Favorite favorite = favoriteRepository.findByUserIdAndItemId(userId, itemId)
                .orElseThrow(() -> new RuntimeException("Favorite not found"));

        favoriteRepository.delete(favorite);
    }
}
