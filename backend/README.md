# Campus Trade Hub - Backend API

RESTful API service for the Campus Trade Hub marketplace platform.

## Tech Stack

**Java 17** • **Spring Boot 3.2** • **Spring Security + JWT** • **Spring Data JPA** • **H2/PostgreSQL** • **Maven**

## Quick Start

```bash
# Run application
mvn spring-boot:run

# Server: http://localhost:8080
# H2 Console: http://localhost:8080/h2-console
```

## Core Features

- JWT-based authentication and authorization
- Item CRUD with search, filtering, and categories
- User-to-user messaging system
- Favorites and watchlist management
- User reputation tracking
- Admin dashboard with system settings
- GDPR-compliant data export and deletion

## Database Access

**H2 Development Database**
```
URL: jdbc:h2:mem:campustradehub
Username: sa
Password: (empty)
```

## Configuration

Environment settings in `src/main/resources/application.yml`

---

