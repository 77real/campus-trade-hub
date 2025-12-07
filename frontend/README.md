# Campus Trade Hub - Frontend

Modern React SPA for the Campus Trade Hub marketplace platform.

## Tech Stack

**React 18** • **Vite 5** • **React Router 6** • **TailwindCSS 3** • **Axios** • **Lucide Icons**

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

**Development Server**: http://localhost:5173

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Route page components
├── context/        # React Context (Auth)
├── services/       # API service layer
└── App.jsx         # Main application component
```

## Key Features

- Responsive design with TailwindCSS breakpoints
- JWT authentication with protected routes
- Real-time search and filtering
- Item browsing by categories
- User messaging interface
- Favorites management
- User profile and listings
- Admin dashboard for platform management

## Environment Configuration

Create `.env` file:
```env
VITE_API_URL=http://localhost:8080
```

---

