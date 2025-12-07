package com.campustradehub.service;

import com.campustradehub.dto.ItemRequest;
import com.campustradehub.model.Category;
import com.campustradehub.model.Item;
import com.campustradehub.model.Item.ItemStatus;
import com.campustradehub.model.User;
import com.campustradehub.repository.CategoryRepository;
import com.campustradehub.repository.ItemRepository;
import com.campustradehub.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ItemService {

    private final ItemRepository itemRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    public ItemService(ItemRepository itemRepository,
                      UserRepository userRepository,
                      CategoryRepository categoryRepository) {
        this.itemRepository = itemRepository;
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
    }

    public Page<Item> getAllItems(Pageable pageable) {
        return itemRepository.findByStatus(ItemStatus.AVAILABLE, pageable);
    }

    public Page<Item> searchItems(String keyword, Pageable pageable) {
        return itemRepository.searchByKeyword(keyword, pageable);
    }

    public Page<Item> getItemsByCategory(Long categoryId, Pageable pageable) {
        return itemRepository.findByCategoryId(categoryId, pageable);
    }

    public Page<Item> getUserItems(Long userId, Pageable pageable) {
        return itemRepository.findByUserId(userId, pageable);
    }

    public Item getItemById(Long id) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));
        
        item.setViewCount(item.getViewCount() + 1);
        return itemRepository.save(item);
    }

    @Transactional
    public Item createItem(ItemRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Item item = new Item();
        item.setUser(user);
        item.setTitle(request.getTitle());
        item.setDescription(request.getDescription());
        item.setPrice(request.getPrice());
        item.setCondition(request.getCondition());
        item.setLocation(request.getLocation());
        item.setImageUrls(request.getImageUrls());

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElse(null);
            item.setCategory(category);
        }

        return itemRepository.save(item);
    }

    @Transactional
    public Item updateItem(Long id, ItemRequest request, Long userId) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        if (!item.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        item.setTitle(request.getTitle());
        item.setDescription(request.getDescription());
        item.setPrice(request.getPrice());
        item.setCondition(request.getCondition());
        item.setLocation(request.getLocation());
        item.setImageUrls(request.getImageUrls());

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElse(null);
            item.setCategory(category);
        }

        return itemRepository.save(item);
    }

    @Transactional
    public void deleteItem(Long id, Long userId) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        if (!item.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        itemRepository.delete(item);
    }
}
