# Database Setup Guide

## Prerequisites
- MySQL 8.0+ installed and running
- MySQL user credentials (default: root)

## Option 1: Automatic Setup (Recommended)

### Step 1: Execute SQL Script
Open MySQL command line or MySQL Workbench and run:

```bash
mysql -u root -p < backend/src/main/resources/schema.sql
mysql -u root -p campustradehub < backend/src/main/resources/data.sql
```

Or manually:
1. Open MySQL Workbench
2. Connect to your MySQL server
3. Open `backend/src/main/resources/schema.sql`
4. Execute the script
5. Open `backend/src/main/resources/data.sql`
6. Execute the script

### Step 2: Verify Tables Created
```sql
USE campustradehub;
SHOW TABLES;
```

Expected output:
- categories
- favorites
- items
- messages
- users

### Step 3: Verify Initial Data
```sql
SELECT * FROM categories;
```

Should return 6 categories.

---

## Option 2: Manual Setup

### Step 1: Create Database
```sql
CREATE DATABASE campustradehub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE campustradehub;
```

### Step 2: Create Tables
Copy and paste the CREATE TABLE statements from `schema.sql`

### Step 3: Insert Initial Data
```sql
INSERT INTO categories (name, description, icon) VALUES
('Textbooks', 'Academic books and study materials', '📚'),
('Electronics', 'Phones, laptops, tablets', '💻'),
('Furniture', 'Desks, chairs, storage', '🪑'),
('Clothing', 'Clothes, shoes, accessories', '👕'),
('Sports', 'Sports equipment and gear', '⚽'),
('Other', 'Miscellaneous items', '📦');
```

---

## Verify Backend Connection

### Start Backend Server
```bash
cd backend
mvn spring-boot:run
```

### Check Logs
Look for successful connection messages:
```
HikariPool-1 - Start completed
```

### Test API
```bash
curl http://localhost:8080/api/categories
```

Should return JSON array with 6 categories.

---

## Troubleshooting

### Error: Access denied for user
- Check username/password in `application.yml`
- Verify MySQL user has proper permissions

### Error: Unknown database
- Run `schema.sql` to create database
- Or manually: `CREATE DATABASE campustradehub;`

### Error: Table doesn't exist
- Run `schema.sql` to create tables
- Verify `ddl-auto: none` in `application.yml`

### Empty categories
- Run `data.sql` to insert initial data
- Or use API: `POST http://localhost:8080/api/init/categories`
