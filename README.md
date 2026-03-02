# VinylLab - Online Sign Design & Printing System

Production-ready system for custom sign design and printing.

## Tech Stack
- **Frontend**: Angular 17+ (Standalone Components, RxJS, Signals)
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: JWT with Role Guards
- **Storage**: Local Multer storage

## Setup Instructions

### 1. Backend Setup
1. Navigate to backend: `cd backend`
2. Install dependencies: `npm install`
3. Configure environment: Update `.env` with your PostgreSQL URL.
4. Run migrations: `npx prisma migrate dev`
5. Seed data: `npx prisma db seed`
6. Start server: `npm run dev` (Runs on http://localhost:3000)

### 2. Frontend Setup
1. Navigate to frontend: `cd frontend`
2. Install dependencies: `npm install`
3. Start development server: `npm start` (Runs on http://localhost:4200)

## Default Users (after seeding)
- **Admin**: `admin@vinylab.com` / `admin123`
- **Staff**: `staff@vinylab.com` / `staff123`
- **Customer**: Use registration form to create one.

## Core Features
1. **Authentication**: Complete JWT-based auth flow.
2. **Template Management**: Admin can create sign templates with dimension constraints.
3. **Design Editor**: Users can customize signs in real-time with automatic price calculation.
4. **Order Flow**: Design -> Order -> Payment.
5. **Backoffice**: Admin/Staff dashboard for stats and order status management.
6. **File Upload**: Supports slip and design file uploads.

## API Documentation
Check `api-test.json` (Postman Collection) for API endpoints and examples.
