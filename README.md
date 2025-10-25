## Overview
**PapaPay💸** is a tiny full-stack app to request money from Dad (with jokes) and a real approve/deny workflow.

**Stack:** React (Vite) • Node/Express • MySQL • Cookie session (Dad passcode)  
**Deploy:** Frontend on Vercel, Backend on Render, Cloud MySQL (Railway)

## Features
- Create request: name, amount, reason, mood, optional repay plan, custom pitch
- History table with status badges (Pending/Approved/Denied)
- Dad Area: passcode login → Approve/Deny + optional note (one-time decision)
- (Optional) Stats strip and mood-based pitch generator

## API (planned)
- `GET /api/health` → `{ ok: true }`
- `POST /api/requests` → create request  
  **body:** `{ requester, amount, reason, dad_mood?, repay_plan?, pitch }`
- `GET /api/requests` → list all (newest first)
- `POST /api/auth/login` → Dad passcode → sets httpOnly cookie
- `POST /api/auth/logout` → clears cookie
- `PATCH /api/requests/:id/status` (auth) → `{ status: "approved"|"denied", decision_note? }`

## Data Model (MySQL)
`requests`  
- `id` (string/uuid, PK)  
- `created_at` (timestamp default now)  
- `requester` (varchar)  
- `amount` (decimal ≥ 0)  
- `reason` (varchar)  
- `dad_mood` (varchar, optional)  
- `repay_plan` (varchar, optional)  
- `pitch` (text)  
- `status` enum('pending','approved','denied') default 'pending'  
- `decided_at` (timestamp, null)  
- `decided_by` (varchar, null; usually "Dad")  
- `decision_note` (text, null)

## Environments
- **Local:**  
  - Backend at `http://localhost:5174`  
  - Frontend at `http://localhost:5173`  
  - `VITE_API_URL=http://localhost:5174`
- **Prod:**  
  - Vercel URL for frontend  
  - Render URL for backend  
  - `VITE_API_URL=<Render URL>`  
  - CORS backend `CORS_ORIGIN=<Vercel origin>`

## Roadmap 
1) **Backend foundation** → health, create, list  
2) **Dad login** → passcode + cookie  
3) **Approve/Deny** → protected PATCH  
4) **Frontend UI** → form + table, integrate API  
5) **Dad Area** → login + pending list + actions  
6) **Polish & Deploy** → stats, pitch gen, Vercel + Render

## How to run (high level)
- Create DB `Papa_Pay` and table `requests` as above.  
- `server/`: Node/Express, listens on `process.env.PORT`.  
- `client/`: Vite React, uses `VITE_API_URL`.  
- Test APIs with Postman; deploy to Vercel/Render.
