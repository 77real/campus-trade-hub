package com.campustradehub.controller;

import com.campustradehub.model.Item;
import com.campustradehub.model.Item.ItemStatus;
import com.campustradehub.model.SystemSetting;
import com.campustradehub.model.User;
import com.campustradehub.model.UserRole;
import com.campustradehub.repository.CategoryRepository;
import com.campustradehub.repository.ItemRepository;
import com.campustradehub.repository.MessageRepository;
import com.campustradehub.repository.SystemSettingRepository;
import com.campustradehub.repository.UserRepository;
import com.campustradehub.service.ItemService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final ItemRepository itemRepository;
    private final CategoryRepository categoryRepository;
    private final MessageRepository messageRepository;
    private final SystemSettingRepository systemSettingRepository;
    private final ItemService itemService;

    public AdminController(UserRepository userRepository, 
                          ItemRepository itemRepository,
                          CategoryRepository categoryRepository,
                          MessageRepository messageRepository,
                          SystemSettingRepository systemSettingRepository,
                          ItemService itemService) {
        this.userRepository = userRepository;
        this.itemRepository = itemRepository;
        this.categoryRepository = categoryRepository;
        this.messageRepository = messageRepository;
        this.systemSettingRepository = systemSettingRepository;
        this.itemService = itemService;
    }

    private void checkAdminRole(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getRole() != UserRole.ADMIN) {
            throw new RuntimeException("Access denied: Admin role required");
        }
    }

    // 系统统计
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getSystemStats(Authentication authentication) {
        checkAdminRole(authentication);
        
        Map<String, Object> stats = new HashMap<>();
        
        // 基础统计
        stats.put("totalUsers", userRepository.count());
        stats.put("totalItems", itemRepository.count());
        stats.put("totalCategories", categoryRepository.count());
        stats.put("totalMessages", messageRepository.count());
        
        // 今日统计
        LocalDateTime todayStart = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        long todayUsers = userRepository.countByCreatedAtAfter(todayStart);
        long todayItems = itemRepository.countByCreatedAtAfter(todayStart);
        stats.put("todayNewUsers", todayUsers);
        stats.put("todayNewItems", todayItems);
        
        // 商品状态统计
        stats.put("availableItems", itemRepository.countByStatus(ItemStatus.AVAILABLE));
        stats.put("soldItems", itemRepository.countByStatus(ItemStatus.SOLD));
        
        return ResponseEntity.ok(stats);
    }

    // 用户管理 - 获取所有用户
    @GetMapping("/users")
    public ResponseEntity<Page<User>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            Authentication authentication) {
        checkAdminRole(authentication);
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(userRepository.findAll(pageable));
    }

    // 用户管理 - 搜索用户
    @GetMapping("/users/search")
    public ResponseEntity<List<User>> searchUsers(
            @RequestParam String keyword,
            Authentication authentication) {
        checkAdminRole(authentication);
        
        List<User> users = userRepository.findByUsernameContainingOrEmailContaining(keyword, keyword);
        return ResponseEntity.ok(users);
    }

    // 用户管理 - 获取用户详情
    @GetMapping("/users/{id}")
    public ResponseEntity<Map<String, Object>> getUserDetail(
            @PathVariable Long id,
            Authentication authentication) {
        checkAdminRole(authentication);
        
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Map<String, Object> detail = new HashMap<>();
        detail.put("user", user);
        detail.put("itemCount", itemRepository.countByUserId(id));
        detail.put("items", itemRepository.findByUserId(id, PageRequest.of(0, 10)).getContent());
        
        return ResponseEntity.ok(detail);
    }

    // 用户管理 - 禁用/启用用户
    @PutMapping("/users/{id}/toggle-status")
    public ResponseEntity<User> toggleUserStatus(
            @PathVariable Long id,
            Authentication authentication) {
        checkAdminRole(authentication);
        
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setIsVerified(!user.getIsVerified());
        return ResponseEntity.ok(userRepository.save(user));
    }

    // 商品管理 - 获取所有商品
    @GetMapping("/items")
    public ResponseEntity<Page<Item>> getAllItems(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String status,
            Authentication authentication) {
        checkAdminRole(authentication);
        
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        
        if (status != null && !status.isEmpty()) {
            ItemStatus itemStatus = Item.ItemStatus.valueOf(status.toUpperCase());
            return ResponseEntity.ok(itemRepository.findByStatus(itemStatus, pageable));
        }
        
        return ResponseEntity.ok(itemRepository.findAll(pageable));
    }

    // 商品管理 - 删除商品
    @DeleteMapping("/items/{id}")
    public ResponseEntity<Void> deleteItem(
            @PathVariable Long id,
            Authentication authentication) {
        checkAdminRole(authentication);
        
        itemRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // 商品管理 - 搜索商品
    @GetMapping("/items/search")
    public ResponseEntity<Page<Item>> searchItems(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            Authentication authentication) {
        checkAdminRole(authentication);
        
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(itemService.searchItems(keyword, pageable));
    }

    // 系统设置 - 获取Privacy Policy
    @GetMapping("/settings/privacy-policy")
    public ResponseEntity<Map<String, Object>> getPrivacyPolicy(Authentication authentication) {
        checkAdminRole(authentication);
        
        SystemSetting setting = systemSettingRepository.findBySettingKey("PRIVACY_POLICY")
                .orElse(new SystemSetting(null, "PRIVACY_POLICY", "", "Privacy Policy content", null));
        
        Map<String, Object> response = new HashMap<>();
        response.put("content", setting.getSettingValue());
        response.put("updatedAt", setting.getUpdatedAt());
        
        return ResponseEntity.ok(response);
    }

    // 系统设置 - 更新Privacy Policy
    @PutMapping("/settings/privacy-policy")
    public ResponseEntity<SystemSetting> updatePrivacyPolicy(
            @RequestBody Map<String, String> request,
            Authentication authentication) {
        checkAdminRole(authentication);
        
        String content = request.get("content");
        SystemSetting setting = systemSettingRepository.findBySettingKey("PRIVACY_POLICY")
                .orElse(new SystemSetting(null, "PRIVACY_POLICY", "", "Privacy Policy content", null));
        
        setting.setSettingValue(content);
        return ResponseEntity.ok(systemSettingRepository.save(setting));
    }

    // 公开端点 - 获取Privacy Policy（无需认证）
    @GetMapping("/public/privacy-policy")
    public ResponseEntity<Map<String, Object>> getPublicPrivacyPolicy() {
        SystemSetting setting = systemSettingRepository.findBySettingKey("PRIVACY_POLICY")
                .orElse(new SystemSetting(null, "PRIVACY_POLICY", 
                    "# Privacy Policy\n\nPrivacy policy content not available.", 
                    "Privacy Policy content", null));
        
        Map<String, Object> response = new HashMap<>();
        response.put("content", setting.getSettingValue());
        response.put("updatedAt", setting.getUpdatedAt());
        
        return ResponseEntity.ok(response);
    }
}
