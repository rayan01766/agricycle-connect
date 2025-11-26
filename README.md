# 🌾 AgriCycle Connect

A cloud-based marketplace that connects farmers with companies to recycle agricultural waste. Built with Next.js, Express.js, and PostgreSQL.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Running Locally](#running-locally)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [User Roles](#user-roles)

## ✨ Features

### Role-Based Authentication
- JWT-based authentication system
- Three user roles: **Farmer**, **Company**, **Admin**
- Protected routes and API endpoints

### Farmer Features
- Create waste listings with details (type, quantity, price, location, image)
- View and manage their own listings
- Track listing status (pending, approved, rejected)

### Company Features
- Browse approved waste listings
- Search and filter listings by type and location
- Contact farmers directly

### Admin Features
- Review all waste listings
- Approve or reject pending listings
- Manage platform content

### Security
- Secure password hashing with bcryptjs
- JWT token-based authentication
- CORS protection
- Input validation and sanitization

## 🛠 Tech Stack

### Frontend
- **Framework:** Next.js 15 (App Router)
- **Styling:** TailwindCSS
- **State Management:** React Context API
- **HTTP Client:** Axios
- **Form Handling:** React Hook Form
- **Language:** TypeScript

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcryptjs
- **Validation:** express-validator
- **File Upload:** Multer
- **CORS:** cors middleware

### Cloud Services
- **Frontend Hosting:** Vercel
- **Backend Hosting:** Render
- **Database:** Render PostgreSQL (or any PostgreSQL provider)

## 📁 Project Structure

```
agricycle-connect/
├── frontend/                 # Next.js frontend application
│   ├── app/
│   │   ├── dashboard/       # Protected dashboard pages
│   │   ├── login/          # Login page
│   │   ├── signup/         # Signup page
│   │   ├── layout.tsx      # Root layout with AuthProvider
│   │   └── page.tsx        # Landing page
│   ├── components/
│   │   ├── dashboards/     # Role-specific dashboards
│   │   ├── Navbar.tsx      # Navigation component
│   │   └── ProtectedRoute.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx # Authentication context
│   ├── lib/
│   │   └── api.ts          # Axios API service
│   └── package.json
│
├── backend/                 # Express.js backend API
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js # PostgreSQL configuration
│   │   ├── middleware/
│   │   │   └── auth.js     # JWT authentication middleware
│   │   ├── models/
│   │   │   ├── User.js     # User model
│   │   │   └── Waste.js    # Waste listing model
│   │   ├── routes/
│   │   │   ├── auth.js     # Authentication routes
│   │   │   └── waste.js    # Waste listing routes
│   │   └── server.js       # Express server setup
│   ├── database/
│   │   └── schema.sql      # Database schema and migrations
│   └── package.json
│
├── .gitignore
├── .env.example            # Shared environment template
├── package.json            # Root package.json for monorepo
├── API_DOCS.md            # Complete API documentation
└── README.md              # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL (v14 or higher)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd agricycle-connect
   ```

2. **Install root dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

## 🔐 Environment Variables

### Backend (.env)
Create `backend/.env` file:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://username:password@localhost:5432/agricycle_db
JWT_SECRET=your-super-secret-jwt-key-change-in-production
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env.local)
Create `frontend/.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## 🗄 Database Setup

### 1. Create Database
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE agricycle_db;

# Exit psql
\q
```

### 2. Run Migration
```bash
# Navigate to backend directory
cd backend

# Run the schema SQL file
psql -U postgres -d agricycle_db -f database/schema.sql
```

The migration creates:
- `users` table (for authentication)
- `waste_listings` table (for waste entries)
- Indexes for performance
- Sample data for testing

### Sample Users (for testing)
```
Admin: admin@agricycle.com / admin123
Farmer: farmer@example.com / farmer123
Company: company@example.com / company123
```

## 💻 Running Locally

### Option 1: Run Both Services Together
```bash
# From root directory
npm run dev
```

### Option 2: Run Separately

**Backend:**
```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

**Frontend:**
```bash
cd frontend
npm run dev
# App runs on http://localhost:3000
```

### Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/api/health

## ☁️ Deployment

### Deploy Backend to Render

1. **Create Account**
   - Sign up at [render.com](https://render.com)

2. **Create PostgreSQL Database**
   - Go to Dashboard → New → PostgreSQL
   - Choose a name (e.g., `agricycle-db`)
   - Select free tier
   - Copy the **Internal Database URL**

3. **Create Web Service**
   - Go to Dashboard → New → Web Service
   - Connect your GitHub repository
   - Configure:
     - **Name:** agricycle-backend
     - **Root Directory:** `backend`
     - **Environment:** Node
     - **Build Command:** `npm install`
     - **Start Command:** `npm start`

4. **Add Environment Variables**
   ```
   DATABASE_URL=<your-render-postgres-internal-url>
   JWT_SECRET=<generate-a-secure-random-string>
   NODE_ENV=production
   CORS_ORIGIN=<your-vercel-frontend-url>
   ```

5. **Run Database Migration**
   - Go to your PostgreSQL instance
   - Click "Connect" → "External Connection"
   - Use the connection details with a PostgreSQL client
   - Run the `backend/database/schema.sql` file

### Deploy Frontend to Vercel

1. **Install Vercel CLI** (optional)
   ```bash
   npm install -g vercel
   ```

2. **Deploy via Vercel Dashboard**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure:
     - **Framework Preset:** Next.js
     - **Root Directory:** `frontend`
     - **Build Command:** (auto-detected)
     - **Output Directory:** (auto-detected)

3. **Add Environment Variables**
   - In Project Settings → Environment Variables
   ```
   NEXT_PUBLIC_API_URL=<your-render-backend-url>
   ```

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy
   - Get your production URL (e.g., `https://agricycle-connect.vercel.app`)

5. **Update Backend CORS**
   - Go back to Render
   - Update `CORS_ORIGIN` environment variable with your Vercel URL
   - Restart the backend service

### Verify Deployment
- Visit your Vercel URL
- Test login/signup
- Create a listing as a farmer
- Approve it as admin
- View it as a company

## 📚 API Documentation

See [API_DOCS.md](./API_DOCS.md) for complete API documentation including:
- Authentication endpoints
- Waste listing CRUD operations
- Request/response formats
- Error handling
- Sample cURL commands

### Quick API Reference

```
POST   /api/auth/register    - Register new user
POST   /api/auth/login       - Login user
GET    /api/waste            - Get all listings
POST   /api/waste            - Create listing (Farmer)
GET    /api/waste/:id        - Get specific listing
GET    /api/waste/my/listings - Get farmer's listings
PATCH  /api/waste/:id/status - Update status (Admin)
DELETE /api/waste/:id        - Delete listing
```

## 👥 User Roles

### Farmer
- Create waste listings
- View own listings
- Track approval status
- Delete own listings

### Company
- Browse approved listings
- Search and filter
- View farmer contact information
- Contact farmers

### Admin
- View all listings (any status)
- Approve/reject pending listings
- Delete any listing
- Platform moderation

## 🔧 Development

### Run Tests (to be implemented)
```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

### Build for Production
```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

## 🐛 Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check DATABASE_URL in .env
- Ensure database exists
- Check firewall settings

### CORS Errors
- Verify CORS_ORIGIN matches frontend URL
- Check if backend is running
- Ensure API_URL is correct in frontend

### Authentication Issues
- Clear localStorage (browser dev tools)
- Check JWT_SECRET is set
- Verify token format in requests

## 📝 License

MIT License

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📧 Support

For issues and questions, please open a GitHub issue.

---

Built with ❤️ for sustainable agriculture and waste management.
