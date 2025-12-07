package com.campustradehub.config;

import com.campustradehub.model.Category;
import com.campustradehub.repository.CategoryRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final CategoryRepository categoryRepository;

    public DataInitializer(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public void run(String... args) {
        if (categoryRepository.count() == 0) {
            List<Category> categories = Arrays.asList(
                new Category(null, "Textbooks", "Academic books and study materials", "📚"),
                new Category(null, "Electronics", "Phones, laptops, tablets", "💻"),
                new Category(null, "Furniture", "Desks, chairs, storage", "🪑"),
                new Category(null, "Clothing", "Clothes, shoes, accessories", "👕"),
                new Category(null, "Sports", "Sports equipment and gear", "⚽"),
                new Category(null, "Other", "Miscellaneous items", "📦")
            );
            categoryRepository.saveAll(categories);
        }
    }
}
