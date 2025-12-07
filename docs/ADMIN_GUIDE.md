# 🛡️ 管理员后台系统使用指南

## 📋 功能概述

Campus Trade Hub 管理员后台系统提供全面的系统管理功能，包括：

- 📊 **系统统计** - 查看平台整体运营数据
- 👥 **用户管理** - 管理所有注册用户
- 📦 **商品管理** - 审核和管理所有商品
- 🔒 **权限控制** - 基于角色的访问控制

---

## 🚀 快速开始

### 1. 更新数据库

如果你的数据库已经存在，执行以下SQL脚本添加管理员支持：

```sql
-- 在MySQL中执行
source backend/src/main/resources/update-database-for-admin.sql
```

或者手动执行：

```sql
USE campustradehub;

-- 添加role列
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'USER' AFTER is_verified;

-- 更新现有用户
UPDATE users SET role = 'USER' WHERE role IS NULL OR role = '';

-- 创建管理员账号（密码：admin123）
INSERT INTO users (email, password, username, phone, reputation_score, is_verified, role, created_at)
VALUES ('admin@campus.edu', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG', 'System Admin', '10000000000', 999, true, 'ADMIN', NOW());
```

### 2. 重启后端服务

```bash
cd backend
mvn clean compile
mvn spring-boot:run
```

### 3. 登录管理员账号

- **邮箱**: `admin@campus.edu`
- **密码**: `admin123`

---

## 📊 系统统计功能

管理员登录后，点击右上角紫色的 **🛡️ Admin** 按钮进入管理后台。

### 统计数据包括：

1. **总用户数** - 平台注册用户总数 + 今日新增
2. **总商品数** - 发布商品总数 + 今日新增
3. **在售商品** - 当前可购买的商品数量
4. **已售商品** - 已完成交易的商品数量

---

## 👥 用户管理

### 功能列表：

- ✅ 查看所有用户列表
- ✅ 查看用户详细信息（ID、用户名、邮箱、角色、信誉分）
- ✅ 禁用/启用用户账号
- ✅ 查看用户注册时间
- ✅ 区分普通用户和管理员

### 操作说明：

1. **查看用户列表**
   - 点击 "👥 用户管理" 标签
   - 显示所有用户的基本信息

2. **禁用用户**
   - 点击用户行的 "禁用" 按钮
   - 被禁用的用户将无法登录（is_verified = false）

3. **启用用户**
   - 点击被禁用用户行的 "启用" 按钮
   - 恢复用户的正常访问权限

⚠️ **注意**: 管理员账号无法被禁用

---

## 📦 商品管理

### 功能列表：

- ✅ 查看所有商品列表
- ✅ 查看商品详情（标题、价格、状态、卖家）
- ✅ 删除违规商品
- ✅ 按状态筛选（在售/已售）

### 操作说明：

1. **查看商品列表**
   - 点击 "📦 商品管理" 标签
   - 以卡片形式显示所有商品

2. **查看商品详情**
   - 点击 "查看详情" 按钮
   - 跳转到商品详情页面

3. **删除商品**
   - 点击 "删除" 按钮
   - 确认后永久删除该商品

⚠️ **注意**: 删除操作不可恢复，请谨慎操作

---

## 🔒 权限说明

### 用户角色：

- **USER** - 普通用户
  - 可以发布商品
  - 可以购买商品
  - 可以发送消息
  - 可以收藏商品

- **ADMIN** - 管理员
  - 拥有所有普通用户权限
  - 可以访问管理后台
  - 可以管理所有用户
  - 可以管理所有商品
  - 可以查看系统统计

### API权限控制：

所有 `/api/admin/**` 接口都需要管理员权限：

```java
// 后端自动验证
private void checkAdminRole(Authentication authentication) {
    if (user.getRole() != UserRole.ADMIN) {
        throw new RuntimeException("Access denied: Admin role required");
    }
}
```

---

## 🎯 使用场景

### 1. 处理违规内容
```
场景：用户举报某商品涉及违规内容
操作：
1. 进入"商品管理"
2. 找到该商品
3. 点击"查看详情"确认
4. 点击"删除"移除违规商品
```

### 2. 处理用户投诉
```
场景：收到用户投诉某账号恶意行为
操作：
1. 进入"用户管理"
2. 找到该用户
3. 查看用户信息和发布记录
4. 点击"禁用"暂停账号
```

### 3. 监控平台运营
```
场景：每日查看平台数据
操作：
1. 登录管理后台
2. 查看"系统统计"
3. 关注今日新增用户和商品
4. 分析活跃度趋势
```

---

## ⚙️ 配置说明

### 后端配置（SecurityConfig.java）

```java
// 管理员接口需要认证
.requestMatchers("/api/admin/**").authenticated()
```

### 前端路由（App.jsx）

```jsx
// 管理员页面受保护
<Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
```

### 角色验证（AuthContext.jsx）

```javascript
// 登录时保存角色信息
const userData = { userId, username, email, role };
```

---

## 🔐 安全建议

1. **修改默认密码**
   ```sql
   -- 首次登录后立即修改管理员密码
   UPDATE users SET password = '新的BCrypt哈希' WHERE email = 'admin@campus.edu';
   ```

2. **限制管理员数量**
   - 仅授予可信人员管理员权限
   - 定期审查管理员账号列表

3. **启用操作日志**
   - 记录所有管理员操作
   - 定期审查日志

4. **使用强密码**
   - 至少12位字符
   - 包含大小写字母、数字和特殊字符

5. **定期备份**
   - 每日备份数据库
   - 保存至少7天的备份

---

## 📝 API接口文档

### 系统统计
```
GET /api/admin/stats
Authorization: Bearer {token}
```

### 用户管理
```
GET /api/admin/users?page=0&size=20
GET /api/admin/users/search?keyword={keyword}
GET /api/admin/users/{id}
PUT /api/admin/users/{id}/toggle-status
```

### 商品管理
```
GET /api/admin/items?page=0&size=20&status={status}
GET /api/admin/items/search?keyword={keyword}
DELETE /api/admin/items/{id}
```

---

## ❓ 常见问题

### Q1: 无法访问管理后台？
**A**: 检查以下几点：
- 确认使用管理员账号登录
- 确认数据库中role字段为'ADMIN'
- 清除浏览器缓存重新登录

### Q2: 禁用用户后用户还能登录？
**A**: 需要确保：
- 后端正确验证is_verified字段
- 用户重新登录后才生效
- 清除用户的token缓存

### Q3: 删除商品后还能看到？
**A**: 
- 刷新页面即可
- 检查是否有缓存
- 确认删除操作是否成功

### Q4: 如何添加新的管理员？
**A**: 
```sql
-- 将现有用户升级为管理员
UPDATE users SET role = 'ADMIN' WHERE email = 'user@campus.edu';
```

---

## 🆘 技术支持

如遇到问题，请检查：

1. 后端日志：`backend/logs/`
2. 浏览器控制台：F12 → Console
3. 网络请求：F12 → Network

---

## 📅 更新日志

### v1.0.0 (2025-12-07)
- ✅ 实现系统统计功能
- ✅ 实现用户管理功能
- ✅ 实现商品管理功能
- ✅ 实现角色权限控制
- ✅ 添加管理后台UI

---

**祝使用愉快！如有问题欢迎反馈。** 🎉
