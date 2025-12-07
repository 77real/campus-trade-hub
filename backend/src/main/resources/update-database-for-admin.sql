

USE campustradehub;

ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'USER' AFTER is_verified;


UPDATE users SET role = 'USER' WHERE role IS NULL OR role = '';


INSERT INTO users (email, password, username, phone, reputation_score, is_verified, role, created_at)
SELECT * FROM (
    SELECT 'admin@campus.edu', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'System Admin', '10000000000', 999, true, 'ADMIN', NOW()
) AS tmp
WHERE NOT EXISTS (
    SELECT email FROM users WHERE email = 'admin@campus.edu'
) LIMIT 1;


SELECT 'Database updated successfully! Admin account: admin@campus.edu / admin123' AS message;
