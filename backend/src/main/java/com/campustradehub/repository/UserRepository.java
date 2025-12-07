package com.campustradehub.repository;

import com.campustradehub.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Boolean existsByEmail(String email);
    
    // Admin functions
    List<User> findByUsernameContainingOrEmailContaining(String username, String email);
    long countByCreatedAtAfter(LocalDateTime dateTime);
}
