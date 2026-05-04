# PapaPay

A full-stack web application where users can submit money requests and an authenticated Dad dashboard can review and approve or reject them.

## Demo
[![Watch the demo](https://img.youtube.com/vi/ebZYDfeHJ3w/0.jpg)](https://youtu.be/ebZYDfeHJ3w)

## Current Status
- Running locally on localhost
- Production deployment planned next:
  - Frontend: Vercel
  - Backend API: Render
  - MySQL database: Railway

## Why This Project
PapaPay demonstrates practical full-stack engineering skills in one coherent product:
- Building a React client with route-level protection
- Designing and implementing REST APIs with Express
- Integrating with MySQL for persistent data
- Managing authentication state via httpOnly cookies
- Handling real workflow actions (pending to approved or denied)

## Tech Stack
- Frontend: React, Vite, React Router, Tailwind CSS
- Backend: Node.js, Express
- Database: MySQL
- Auth: Cookie-based admin session
- Deployment target: Vercel, Render, Railway

## Key Features
- Submit a request with requester name, amount, reason, mood, repay plan, and pitch
- View request history with status indicators
- Dad login with protected dashboard route
- Approve or reject requests from the dashboard
- Persist login across page refresh using cookie checks

## API Endpoints (Implemented)
- `GET /api/health`
  - Returns API health information
- `POST /api/requests`
  - Creates a new request
  - Body: `{ requester, amount, reason, pitch, dad_mood?, repay_plan? }`
- `GET /api/requests`
  - Returns all requests ordered by newest first
- `POST /api/admin/login`
  - Validates admin code and sets auth cookie
- `POST /api/admin/logout`
  - Clears auth cookie
- `GET /api/dad/me`
  - Returns login status based on auth cookie
- `PATCH /api/requests/:id/decision`
  - Protected route for decision update
  - Body: `{ action: "approve" | "deny", note?: string }`

## Data Model
Table: `requests`
- `id` string primary key
- `created_at` timestamp default current time
- `requester` varchar
- `amount` decimal
- `reason` varchar
- `dad_mood` varchar nullable
- `repay_plan` varchar nullable
- `pitch` text
- `status` enum: pending, approved, denied
- `decided_at` timestamp nullable
- `decided_by` varchar nullable
- `decision_note` text nullable

## Local Development

### Prerequisites
- Node.js 18+
- MySQL 8+

### Environment Variables (server)
Create `server/.env` with values like:

```env
PORT=5174
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=your_user
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=papapay
ADMIN_CODE=your_admin_code
CORS_ORIGIN=http://localhost:5173
```

### Run the App
1. Install dependencies
   - `cd server && npm install`
   - `cd ../client && npm install`
2. Start backend
   - `cd server && npm run dev`
3. Start frontend
   - `cd client && npm run dev`
4. Open frontend at `http://localhost:5173`

## Deployment Plan
- Frontend deploy to Vercel
- Backend deploy to Render
- MySQL host on Railway
- Update environment variables for production CORS, API URLs, and secure cookies over HTTPS

## Roadmap
- Add richer dashboard analytics
- Add request filtering and search
- Improve form validation and error handling UX
- Finalize cloud deployment and custom domain
