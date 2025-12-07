# Campus Trade Hub 🎓

A modern, GDPR-compliant marketplace platform for university student communities.

## Overview

Campus Trade Hub enables students to buy, sell, and trade items within their campus community. Built with modern web technologies, the platform emphasizes security, usability, and regulatory compliance.

## Tech Stack

**Backend**: Java 17 • Spring Boot 3.2 • Spring Security + JWT • Spring Data JPA • PostgreSQL/H2 • Maven

**Frontend**: React 18 • Vite 5 • React Router 6 • TailwindCSS 3 • Axios

## Quick Start

```bash
# Backend (port 8080)
cd backend
mvn spring-boot:run

# Frontend (port 5173)
cd frontend
npm install && npm run dev
```

## Key Features

✅ JWT authentication and authorization  
✅ Item listing with categories and search  
✅ User-to-user messaging system  
✅ Favorites and watchlist management  
✅ User reputation tracking  
✅ Admin dashboard with analytics  
✅ GDPR-compliant data export and deletion  
✅ Mobile-responsive design

## Project Structure

```
├── backend/         Spring Boot REST API
├── frontend/        React SPA application
└── docs/            Technical documentation
```

## Documentation

- **Technical Report**: Comprehensive project documentation
- **Admin Guide**: Platform administration instructions
- **Database Setup**: Schema and migration guides
- **API Documentation**: Endpoint specifications

## Deployment

Production-ready for deployment on Heroku, AWS, or similar PaaS platforms. See `/docs/Technical_Report.md` for detailed hosting recommendations.

## License

MIT License - See LICENSE file for details

---

**Developed for**: UWS COMP10020 Module  
**Status**: Production Ready
