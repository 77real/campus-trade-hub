# Campus Trade Hub - Testing Guide

## Test Environment Status

- Backend API: http://localhost:8080
- Frontend App: http://localhost:5173
- H2 Database Console: http://localhost:8080/h2-console

## Test Scenarios

### 1. User Registration Test

**Steps:**
1. Open http://localhost:5173
2. Click "Don't have an account? Sign up"
3. Fill in registration form:
   - Username: `testuser`
   - Email: `test@campus.edu`
   - Password: `password123`
   - Phone: `1234567890` (optional)
4. Click "Sign up"

**Expected Result:**
- User successfully registered
- Automatically redirected to home page
- Welcome message shows username
- JWT token stored in localStorage

---

### 2. User Login Test

**Steps:**
1. Go to http://localhost:5173/login
2. Enter credentials:
   - Email: `test@campus.edu`
   - Password: `password123`
3. Click "Sign in"

**Expected Result:**
- Successfully logged in
- Redirected to home page
- User menu visible in navbar

---

### 3. Browse Items Test

**Steps:**
1. On home page, observe the item grid
2. Click on category filters (📚 Textbooks, 💻 Electronics, etc.)
3. Observe filtered results

**Expected Result:**
- Items display in grid layout
- Category filtering works
- "All" button shows all items

---

### 4. Search Items Test

**Steps:**
1. Enter keyword in search box (e.g., "book")
2. Click "Search" button

**Expected Result:**
- Search results display matching items
- Empty result shows "No items found"

---

### 5. Post New Item Test

**Steps:**
1. Ensure logged in
2. Click "Post Item" button in navbar
3. Fill in item form:
   - Title: `iPhone 13 Pro`
   - Description: `Excellent condition, 256GB`
   - Price: `599.99`
   - Category: `Electronics`
   - Condition: `Like New`
   - Location: `Building A, Room 101`
   - Image URL: `https://picsum.photos/400/300`
4. Click "Post Item"

**Expected Result:**
- Item created successfully
- Redirected to "My Items" page
- New item visible in list

---

### 6. View Item Detail Test

**Steps:**
1. Click on any item card
2. Observe item details page

**Expected Result:**
- Full item information displayed
- Image, price, description visible
- Seller information shown
- View count incremented

---

### 7. Edit Item Test (Owner Only)

**Steps:**
1. Go to "My Items"
2. Click on one of your items
3. Click "Edit" button
4. Modify any field (e.g., change price to `549.99`)
5. Click "Save Changes"

**Expected Result:**
- Item updated successfully
- Redirected to item detail page
- Changes reflected immediately

---

### 8. Delete Item Test (Owner Only)

**Steps:**
1. Go to item detail page of your own item
2. Click "Delete" button
3. Confirm deletion

**Expected Result:**
- Confirmation dialog appears
- Item deleted successfully
- Redirected to "My Items" page
- Item no longer appears in list

---

### 9. Add to Favorites Test

**Steps:**
1. View an item you don't own
2. Click "🤍 Add to Favorites"

**Expected Result:**
- Button changes to "❤️ Favorited"
- Color changes to red

---

### 10. My Items Page Test

**Steps:**
1. Click "My Items" in navbar
2. Observe list of your posted items

**Expected Result:**
- All user's items displayed
- Status badges visible (AVAILABLE, SOLD, RESERVED)
- Edit button on each item

---

### 11. Logout Test

**Steps:**
1. Click "Logout" button in navbar

**Expected Result:**
- User logged out
- Redirected to login page
- Token removed from localStorage
- Protected routes inaccessible

---

### 12. Protected Routes Test

**Steps:**
1. While logged out, try to access:
   - http://localhost:5173/post-item
   - http://localhost:5173/my-items
   - http://localhost:5173/edit-item/1

**Expected Result:**
- Automatically redirected to login page
- Cannot access protected pages without authentication

---

## API Testing (Optional)

### Using Browser DevTools or Postman

#### 1. Register User
```http
POST http://localhost:8080/api/auth/register
Content-Type: application/json

{
  "email": "api@test.com",
  "password": "password123",
  "username": "apiuser",
  "phone": "1234567890"
}
```

#### 2. Login
```http
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "email": "api@test.com",
  "password": "password123"
}
```

#### 3. Get All Items
```http
GET http://localhost:8080/api/items?page=0&size=20
```

#### 4. Create Item (Requires JWT)
```http
POST http://localhost:8080/api/items
Authorization: Bearer {your_jwt_token}
Content-Type: application/json

{
  "title": "Test Item",
  "description": "Test description",
  "price": 99.99,
  "categoryId": 1,
  "condition": "Good",
  "location": "Test Location"
}
```

---

## Database Verification

### Access H2 Console
1. Go to http://localhost:8080/h2-console
2. Use credentials:
   - JDBC URL: `jdbc:h2:mem:campustradehub`
   - Username: `sa`
   - Password: (leave empty)
3. Click "Connect"

### Check Data
```sql
-- View all users
SELECT * FROM USERS;

-- View all items
SELECT * FROM ITEMS;

-- View all categories
SELECT * FROM CATEGORIES;

-- View all favorites
SELECT * FROM FAVORITES;

-- View all messages
SELECT * FROM MESSAGES;
```

---

## Common Issues & Solutions

### Issue 1: CORS Error
**Symptom:** Frontend cannot connect to backend
**Solution:** Verify backend CORS configuration allows `http://localhost:5173`

### Issue 2: 401 Unauthorized
**Symptom:** API calls fail with 401
**Solution:** 
- Check if JWT token is in localStorage
- Verify token hasn't expired
- Try logging in again

### Issue 3: Port Already in Use
**Symptom:** Cannot start server
**Solution:**
- Backend: Change port in `application.yml`
- Frontend: Change port in `vite.config.js` or kill existing process

### Issue 4: Database Connection Error
**Symptom:** Backend fails to start
**Solution:** H2 in-memory database should work by default. Check `application.yml`

---

## Performance Checklist

- [ ] Page loads within 2 seconds
- [ ] Search returns results quickly
- [ ] Image loading doesn't block UI
- [ ] Forms submit without lag
- [ ] Navigation is smooth

---

## Security Checklist

- [ ] Passwords are not visible in forms
- [ ] JWT tokens are stored securely
- [ ] Protected routes require authentication
- [ ] Users can only edit/delete their own items
- [ ] API endpoints validate user permissions

---

## Browser Compatibility

Test in:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if available)

---

## Test Results Template

| Test Case | Status | Notes |
|-----------|--------|-------|
| User Registration | ⬜ Pass / ⬜ Fail | |
| User Login | ⬜ Pass / ⬜ Fail | |
| Browse Items | ⬜ Pass / ⬜ Fail | |
| Search Items | ⬜ Pass / ⬜ Fail | |
| Post New Item | ⬜ Pass / ⬜ Fail | |
| View Item Detail | ⬜ Pass / ⬜ Fail | |
| Edit Item | ⬜ Pass / ⬜ Fail | |
| Delete Item | ⬜ Pass / ⬜ Fail | |
| Add to Favorites | ⬜ Pass / ⬜ Fail | |
| My Items Page | ⬜ Pass / ⬜ Fail | |
| Logout | ⬜ Pass / ⬜ Fail | |
| Protected Routes | ⬜ Pass / ⬜ Fail | |

---

## Next Steps After Testing

1. Fix any bugs found
2. Update documentation
3. Prepare for deployment
4. Create production build
5. Setup GitHub repository
