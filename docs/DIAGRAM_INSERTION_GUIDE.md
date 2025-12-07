# Diagram Insertion Guide for Technical Report

This guide shows you exactly where to insert each SVG diagram in the `Technical_Report.md` file.

---

## 📋 **Created Diagrams**

All diagrams are located in: `docs/diagrams/`

1. `system-architecture.svg` - System Architecture Diagram
2. `database-er-diagram.svg` - Database Entity-Relationship Diagram
3. `user-flow-buying.svg` - User Flow for Buying Items
4. `authentication-flow.svg` - JWT Authentication Flow
5. `admin-dashboard-wireframe.svg` - Admin Dashboard UI Wireframe

---

## 📍 **Insertion Points in Technical_Report.md**

### **1. System Architecture Diagram**

**Insert after line ~680** (in Section 3.2.4 "Technology Stack Comparison")

```markdown
#### 3.2.4 Technology Stack Comparison

**Alternative Stacks Considered**:
...

**Final Stack Justification**:
...

<!-- INSERT HERE -->
**System Architecture Overview**:

![System Architecture](diagrams/system-architecture.svg)

*Figure 1: Campus Trade Hub System Architecture - showing the three-tier architecture with client, application, and data layers, plus external services integration.*

---
```

---

### **2. Database ER Diagram**

**Insert after line ~1020** (in Section 3.3.1 "Database Schema Design")

```markdown
#### 3.3.1 Database Schema Design

**Entity-Relationship Model**:

The database follows a relational model with the following core entities:

<!-- INSERT HERE -->
![Database ER Diagram](diagrams/database-er-diagram.svg)

*Figure 2: Entity-Relationship Diagram - illustrating the relational structure with primary keys, foreign keys, and relationships between users, items, messages, favorites, categories, and system settings tables.*

---

**Users Table**:
```

---

### **3. Authentication Flow Diagram**

**Insert after line ~475** (in Section 2.2.1 "User Authentication and Authorization")

```markdown
#### 2.2.1 User Authentication and Authorization

**Registration System**:
- Email-based registration with validation
...

<!-- INSERT HERE -->
**Authentication Flow Visualization**:

![JWT Authentication Flow](diagrams/authentication-flow.svg)

*Figure 3: JWT Authentication Flow - step-by-step process from user login to token generation and subsequent authenticated requests.*

---

**Security Considerations**:
```

---

### **4. User Flow Diagram**

**Insert after line ~625** (in Section 3.1.4 "User Experience Flows")

```markdown
#### 3.1.4 User Experience Flows

**Item Purchase Flow**:
```
Browse Items → Select Item → View Details → Contact Seller → 
Message Exchange → Arrange Meetup → Mark as Sold
```

<!-- INSERT HERE -->
![User Flow - Buying Journey](diagrams/user-flow-buying.svg)

*Figure 4: User Flow Diagram - complete journey from browsing items to successful transaction, including decision points and alternative paths.*

---

**Item Selling Flow**:
```

---

### **5. Admin Dashboard Wireframe**

**Insert after line ~595** (in Section 3.1.3 "Page Layouts")

```markdown
#### 3.1.3 Page Layouts

**Homepage**:
- Hero section with call-to-action
...

**Admin Dashboard**:
- Statistics visualization with numerical indicators
- Tabbed navigation: Stats, Users, Items, Privacy Policy
- Table views with search and filter capabilities
- Inline actions for user and item management

<!-- INSERT HERE -->
![Admin Dashboard Wireframe](diagrams/admin-dashboard-wireframe.svg)

*Figure 5: Admin Dashboard UI Wireframe - showing the system statistics view with metrics cards, navigation tabs, and action buttons.*

---

#### 3.1.4 User Experience Flows
```

---

## 🎨 **How to Insert in Markdown**

For each insertion point, use this format:

```markdown
![Diagram Title](diagrams/filename.svg)

*Figure X: Description of what the diagram shows and its significance.*
```

---

## 📊 **Diagram Descriptions**

### **Figure 1: System Architecture**
- **Purpose**: Shows the layered architecture of the application
- **Components**: Client layer (React), Application layer (Spring Boot), Data layer (MySQL), External services
- **Highlights**: HTTPS/REST API communication, JWT authentication, database connections

### **Figure 2: Database ER Diagram**
- **Purpose**: Illustrates database schema and relationships
- **Components**: 6 tables (users, items, categories, messages, favorites, system_settings)
- **Highlights**: Primary keys, foreign keys, one-to-many relationships, constraints

### **Figure 3: Authentication Flow**
- **Purpose**: Details the JWT-based authentication process
- **Sequence**: User login → credential validation → BCrypt verification → JWT generation → token storage
- **Highlights**: Security measures, error handling, token lifecycle

### **Figure 4: User Flow - Buying**
- **Purpose**: Maps the complete user journey for purchasing items
- **Steps**: Browse → Select → View details → Contact → Message → Meet → Complete
- **Highlights**: Decision points, alternative paths, user actions

### **Figure 5: Admin Dashboard Wireframe**
- **Purpose**: Visualizes the admin interface design
- **Features**: Statistics cards, navigation tabs, action buttons
- **Highlights**: Modern UI, data visualization, quick actions

---

## ✅ **Verification Checklist**

After inserting diagrams:

- [ ] All 5 diagrams inserted in correct locations
- [ ] Figure numbers sequential (1-5)
- [ ] Each diagram has descriptive caption
- [ ] File paths correct (`diagrams/filename.svg`)
- [ ] Markdown syntax correct
- [ ] Diagrams render properly when viewing report

---

## 📝 **Additional Notes**

1. **File Format**: All diagrams are SVG (Scalable Vector Graphics) for:
   - High quality at any zoom level
   - Small file size
   - Black and white professional style
   - Pure white background

2. **Accessibility**: Each diagram includes:
   - Clear labels in English
   - High contrast text
   - Logical flow indicators
   - Legend/notes where applicable

3. **Professional Style**:
   - Minimalist black and white design
   - Clean typography (Arial font family)
   - Consistent spacing and alignment
   - No colors except for emphasis (system architecture has slight shading)

---

## 🚀 **Quick Command to View Diagrams**

To verify diagrams render correctly:

1. **In VS Code**: Install "SVG" extension, right-click diagram file → "SVG: View"
2. **In Browser**: Drag and drop SVG file into browser window
3. **In Markdown Preview**: Open Technical_Report.md in preview mode

---

**Need Help?** All diagrams are self-contained SVG files that can be:
- Edited in any text editor
- Opened in browsers
- Imported into design tools (Figma, Illustrator)
- Embedded in Markdown, HTML, or PDF documents
