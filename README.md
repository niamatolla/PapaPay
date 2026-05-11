# PapaPay

A full-stack web application where users can submit money requests and an authenticated Dad dashboard can review and approve or reject them.

## Demo
[![Watch the demo](https://img.youtube.com/vi/ebZYDfeHJ3w/0.jpg)](https://youtu.be/ebZYDfeHJ3w)

## Current Status
- Deployed in production
  - Frontend: Vercel
  - Backend API: Render
  - MySQL database: Railway

## Why This Project
PapaPay demonstrates practical full-stack engineering skills in one coherent product:
- Building a React client with route-level protection
- Designing and implementing REST APIs with Express
- Integrating with MySQL for persistent data
- Managing authentication state with JWT tokens
- Handling real workflow actions (pending to approved or denied)

## Tech Stack
- Frontend: React, Vite, React Router, Tailwind CSS
- Backend: Node.js, Express
- Database: MySQL
- Auth: JWT token-based admin session (Bearer token)
- Deployment: Vercel, Render, Railway

## Key Features
- Submit a request with requester name, amount, reason, mood, repay plan, and pitch
- View request history with status indicators
- Dad login with protected dashboard route
- Approve or reject requests from the dashboard
- Persist login across page refresh using JWT in local storage

## Production URLs
- Frontend: https://papa-pay.vercel.app
- Backend API: https://papapay.onrender.com

## API Endpoints (Implemented)
- `GET /api/health`
  - Returns API health information
- `POST /api/requests`
  - Creates a new request
  - Body: `{ requester, amount, reason, pitch, dad_mood?, repay_plan? }`
- `GET /api/requests`
  - Returns all requests ordered by newest first
- `POST /api/admin/login`
  - Validates admin code and returns JWT token
- `POST /api/admin/logout`
  - Client removes stored JWT token
- `GET /api/dad/me`
  - Returns login status based on Authorization Bearer token
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
NODE_ENV=development
JWT_SECRET=your_local_jwt_secret
```

### Environment Variables (client)
Create `client/.env.local` with:

```env
VITE_API_URL=http://localhost:5174
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

## Production Environment Setup

### Vercel (frontend)
Set this environment variable:

```env
VITE_API_URL=https://papapay.onrender.com
```

### Render (backend)
Recommended DB setup is one connection URL variable.

Required:

```env
NODE_ENV=production
FRONTEND_URL=https://papa-pay.vercel.app
DATABASE_URL=<railway_mysql_public_url>
ADMIN_CODE=<your_admin_code>
JWT_SECRET=<your_long_random_secret>
```

Optional:

```env
PORT=5174
```

If using `DATABASE_URL`, do not keep conflicting split DB variables in Render.

### Railway (database)
- Use Railway MySQL service
- Copy the public connection URL into Render `DATABASE_URL`

## Deployment Checklist (Fast)

1. Push backend changes to GitHub
2. Confirm Render environment variables are set correctly
3. Confirm Vercel `VITE_API_URL` points to Render API
4. Trigger/review deployments on Render and Vercel
5. Verify health endpoint: `GET /api/health`
6. Verify login, dashboard loading, approve/deny, and logout flow

## Troubleshooting

- `Cannot GET /` on backend root
  - Expected for API-only backend. Use `/api/health` instead.

- Browser CORS errors
  - Verify Render `FRONTEND_URL` exactly matches Vercel domain.

- `401 Unauthorized` after login
  - Verify token is stored client-side and sent as `Authorization: Bearer <token>`.
  - Verify Render `JWT_SECRET` is set.

- `500` when loading requests
  - Usually DB connection issue.
  - Verify Render `DATABASE_URL` points to Railway public MySQL URL.

- `ECONNREFUSED` in Render logs
  - Host/port is wrong or unavailable.
  - Prefer single `DATABASE_URL` config to avoid variable mismatches.

## Prioritized Next Steps

Recommended first implementation: Better validation and list filtering/pagination.

### Priority 1 
- Better validation plus list filters and pagination 
  - Add stronger payload validation in the API
  - Support `status`, `limit`, and `offset` query parameters in request listing
- Real SQL migrations in the repository (estimated 1 to 2 hours)
  - Add versioned migration files under `server/db/migrations`
  - Document migration run steps
- Error-state UX cleanup (estimated 1 to 2 hours)
  - Standardize user-facing error messages in the request form and dashboard actions


### Priority 2 
- Minimal tests and CI 
  - Add one backend API smoke test
  - Add one frontend login/dashboard flow test
  - Add CI workflow for lint and tests
- Deployment and environment hardening 
  - Add deployment guardrails and release checks
  


