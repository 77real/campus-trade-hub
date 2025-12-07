package com.campustradehub.controller;

import com.campustradehub.model.Category;
import com.campustradehub.repository.CategoryRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/init")
public class InitController {

    private final CategoryRepository categoryRepository;

    public InitController(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @PostMapping("/categories")
    public ResponseEntity<String> initCategories() {
        if (categoryRepository.count() > 0) {
            return ResponseEntity.ok("Categories already initialized");
        }

        List<Category> categories = Arrays.asList(
            new Category(null, "Textbooks", "Academic books and study materials", "📚"),
            new Category(null, "Electronics", "Phones, laptops, tablets", "💻"),
            new Category(null, "Furniture", "Desks, chairs, storage", "🪑"),
            new Category(null, "Clothing", "Clothes, shoes, accessories", "👕"),
            new Category(null, "Sports", "Sports equipment and gear", "⚽"),
            new Category(null, "Other", "Miscellaneous items", "📦")
        );
        
        categoryRepository.saveAll(categories);
        return ResponseEntity.ok("Categories initialized successfully");
    }
}
