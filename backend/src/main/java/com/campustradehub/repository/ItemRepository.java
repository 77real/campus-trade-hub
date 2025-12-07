package com.campustradehub.repository;

import com.campustradehub.model.Item;
import com.campustradehub.model.Item.ItemStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface ItemRepository extends JpaRepository<Item, Long> {
    Page<Item> findByStatus(ItemStatus status, Pageable pageable);
    
    Page<Item> findByUserId(Long userId, Pageable pageable);
    
    Page<Item> findByCategoryId(Long categoryId, Pageable pageable);
    
    @Query("SELECT i FROM Item i WHERE " +
           "LOWER(i.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(i.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Item> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);
    
    // Admin functions
    long countByUserId(Long userId);
    long countByStatus(ItemStatus status);
    long countByCreatedAtAfter(LocalDateTime dateTime);
}
