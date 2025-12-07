-- Test data for Campus Trade Hub
-- This file contains sample users and items for testing

USE campustradehub;

-- Insert test users (passwords are all '55668899')
-- BCrypt hash for '55668899': $2a$10$W7HKD0Wi2Z6CHQaUyplswOybuNkKaa979Qh4mccGCNRsZkGSYOfg2
INSERT INTO users (email, password, username, phone, reputation_score, is_verified, role, created_at) VALUES
('alice@campus.edu', '$2a$10$W7HKD0Wi2Z6CHQaUyplswOybuNkKaa979Qh4mccGCNRsZkGSYOfg2', 'Alice Wang', '13800138001', 120, true, 'USER', NOW()),
('bob@campus.edu', '$2a$10$W7HKD0Wi2Z6CHQaUyplswOybuNkKaa979Qh4mccGCNRsZkGSYOfg2', 'Bob Chen', '13800138002', 100, true, 'USER', NOW()),
('carol@campus.edu', '$2a$10$W7HKD0Wi2Z6CHQaUyplswOybuNkKaa979Qh4mccGCNRsZkGSYOfg2', 'Carol Li', '13800138003', 110, true, 'USER', NOW());

-- Insert admin user (password: '55668899')
-- BCrypt hash for '55668899': $2a$10$W7HKD0Wi2Z6CHQaUyplswOybuNkKaa979Qh4mccGCNRsZkGSYOfg2
INSERT INTO users (email, password, username, phone, reputation_score, is_verified, role, created_at) VALUES
('admin@campus.edu', '$2a$10$W7HKD0Wi2Z6CHQaUyplswOybuNkKaa979Qh4mccGCNRsZkGSYOfg2', 'System Admin', '10000000000', 999, true, 'ADMIN', NOW());

-- Insert test items
-- Category IDs: 1=Textbooks, 2=Electronics, 3=Furniture, 4=Clothing, 5=Sports, 6=Other

-- Textbooks (Category 1)
INSERT INTO items (user_id, category_id, title, description, price, item_condition, location, image_urls, status, view_count, created_at) VALUES
(1, 1, 'Introduction to Algorithms (4th Edition)', 'Classic CS textbook in excellent condition. No highlights or notes. Perfect for algorithm courses.', 55.00, 'Like New', 'Library Building, 2nd Floor', 'https://picsum.photos/400/300?random=1', 'AVAILABLE', 12, NOW()),
(2, 1, 'Calculus: Early Transcendentals', 'Math textbook for MATH101. Some pencil notes in margins but very readable. Great reference book.', 38.50, 'Good', 'Science Building', 'https://picsum.photos/400/300?random=2', 'AVAILABLE', 8, NOW()),
(3, 1, 'Data Structures and Algorithm Analysis in Java', 'Used for CS201 course. Clean copy with no damage. Comes with practice problem solutions.', 42.00, 'Good', 'Student Center', 'https://picsum.photos/400/300?random=3', 'AVAILABLE', 15, NOW());

-- Electronics (Category 2)
INSERT INTO items (user_id, category_id, title, description, price, item_condition, location, image_urls, status, view_count, created_at) VALUES
(1, 2, 'MacBook Air M1 2020 - 8GB/256GB', 'Lightly used MacBook Air with M1 chip. Battery health 95%. Includes original charger and box. Perfect for students!', 799.00, 'Like New', 'Dorm Building A, Room 305', 'https://picsum.photos/400/300?random=4', 'AVAILABLE', 45, NOW()),
(2, 2, 'iPhone 12 Pro - 128GB Space Gray', 'Excellent condition iPhone 12 Pro. No scratches, always used with case and screen protector. Battery health 89%.', 499.99, 'Excellent', 'Campus Housing B', 'https://picsum.photos/400/300?random=5', 'AVAILABLE', 67, NOW()),
(3, 2, 'iPad Air 4th Gen with Apple Pencil', 'iPad Air 64GB with Apple Pencil (1st gen). Great for note-taking and digital art. Minor scratches on back.', 380.00, 'Good', 'Engineering Building', 'https://picsum.photos/400/300?random=6', 'AVAILABLE', 34, NOW()),
(1, 2, 'Wireless Bluetooth Headphones Sony WH-1000XM4', 'Premium noise-cancelling headphones. Barely used, comes with case and all accessories. Amazing sound quality!', 220.00, 'Like New', 'Music Department', 'https://picsum.photos/400/300?random=7', 'AVAILABLE', 28, NOW());

-- Furniture (Category 3)
INSERT INTO items (user_id, category_id, title, description, price, item_condition, location, image_urls, status, view_count, created_at) VALUES
(2, 3, 'Wooden Study Desk with Drawers', 'Solid wood desk (120x60cm) with 3 drawers. Very sturdy and spacious. Perfect condition, moving out sale!', 85.00, 'Excellent', 'Off-Campus Apartment, Street 5', 'https://picsum.photos/400/300?random=8', 'AVAILABLE', 19, NOW()),
(3, 3, 'Ergonomic Office Chair', 'Comfortable office chair with lumbar support. Adjustable height and armrests. Used for 6 months, no issues.', 120.00, 'Good', 'Graduate Housing', 'https://picsum.photos/400/300?random=9', 'AVAILABLE', 22, NOW()),
(1, 3, 'Bookshelf - 5 Tier White', 'White wooden bookshelf, 180cm tall. Can hold many books and decorations. Easy to assemble, instructions included.', 45.00, 'Good', 'Campus Store Pickup', 'https://picsum.photos/400/300?random=10', 'AVAILABLE', 14, NOW());

-- Clothing (Category 4)
INSERT INTO items (user_id, category_id, title, description, price, item_condition, location, image_urls, status, view_count, created_at) VALUES
(2, 4, 'University Hoodie - Size M', 'Official university hoodie in navy blue. Size M, worn a few times, washed once. Very warm and comfortable!', 28.00, 'Like New', 'Student Union', 'https://picsum.photos/400/300?random=11', 'AVAILABLE', 31, NOW()),
(3, 4, 'Winter Jacket - North Face (Size L)', 'Black North Face winter jacket, size L. Excellent condition, very warm. Perfect for cold campus winters.', 95.00, 'Excellent', 'Dorm C, Room 201', 'https://picsum.photos/400/300?random=12', 'AVAILABLE', 42, NOW());

-- Sports (Category 5)
INSERT INTO items (user_id, category_id, title, description, price, item_condition, location, image_urls, status, view_count, created_at) VALUES
(1, 5, 'Tennis Racket - Wilson Pro Staff', 'Professional tennis racket, lightly used. Comes with protective cover. Great for intermediate players.', 75.00, 'Good', 'Sports Center', 'https://picsum.photos/400/300?random=13', 'AVAILABLE', 18, NOW()),
(2, 5, 'Yoga Mat with Carrying Strap', 'Premium yoga mat (6mm thick), non-slip surface. Used a few times, very clean. Includes carrying strap.', 25.00, 'Like New', 'Fitness Center', 'https://picsum.photos/400/300?random=14', 'AVAILABLE', 9, NOW()),
(3, 5, 'Mountain Bike - 21 Speed', 'Mountain bike in great condition. 21-speed gear system, front suspension. Perfect for campus commuting!', 180.00, 'Good', 'Bike Parking, Building E', 'https://picsum.photos/400/300?random=15', 'AVAILABLE', 56, NOW());

-- Other (Category 6)
INSERT INTO items (user_id, category_id, title, description, price, item_condition, location, image_urls, status, view_count, created_at) VALUES
(1, 6, 'Mini Fridge - Compact 1.7 Cu Ft', 'Small fridge perfect for dorm room. Works perfectly, very quiet. Great for keeping drinks and snacks cold.', 60.00, 'Good', 'Dorm A, Room 102', 'https://picsum.photos/400/300?random=16', 'AVAILABLE', 27, NOW()),
(2, 6, 'Coffee Maker - Single Serve', 'Keurig-style single serve coffee maker. Excellent condition, makes great coffee. Includes 10 K-cups!', 35.00, 'Excellent', 'Student Lounge', 'https://picsum.photos/400/300?random=17', 'AVAILABLE', 21, NOW()),
(3, 6, 'Desk Lamp with USB Charging Port', 'Modern LED desk lamp with adjustable brightness and USB port for charging devices. Energy efficient!', 22.00, 'Like New', 'Library Lobby', 'https://picsum.photos/400/300?random=18', 'AVAILABLE', 11, NOW());

-- Summary statistics
-- 3 test users (all with password 'password123')
-- 20 test items across all categories
-- Users: alice@campus.edu, bob@campus.edu, carol@campus.edu
