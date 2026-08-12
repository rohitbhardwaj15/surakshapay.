# SurakshaPay

**AI-Powered Parametric Micro-Insurance for Gig Workers**

Instant payouts when rain, heatwaves, AQI alerts, or curfews prevent delivery partners from working — zero paperwork, zero waiting.

---

## Project Structure

```
surakshapay/
├── frontend/          # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/           # Reusable UI primitives
│   │   │   ├── layout/       # Sidebar, Navbar, AppShell
│   │   │   ├── landing/      # Landing page sections
│   │   │   ├── dashboard/    # Overview/Dashboard components
│   │   │   ├── triggers/     # Trigger & pipeline components
│   │   │   ├── claims/       # Claims list components
│   │   │   ├── fraud/        # Fraud analysis components
│   │   │   └── admin/        # Admin dashboard
│   │   ├── pages/            # Page-level components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── context/          # React Context (AppContext)
│   │   └── utils/            # Helpers, formatters, constants
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/           # Node.js + Express backend
│   ├── src/
│   │   ├── routes/           # Express route definitions
│   │   ├── controllers/      # Route handlers
│   │   ├── middleware/        # Auth, validation, error handling
│   │   ├── services/         # Business logic
│   │   └── utils/            # Helpers, fraud engine
│   ├── data/                 # JSON file store (db.json)
│   └── package.json
│
├── .env.example
├── .gitignore
├── package.json       # Root scripts (concurrently)
└── README.md
```

---

## Quick Start

### 1. Clone & install dependencies
```bash
git clone https://github.com/yourname/surakshapay.git
cd surakshapay
npm run install:all
```

### 2. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your values
```

### 3. Run in development
```bash
npm run dev
```

- Frontend: http://localhost:5173  
- Backend API: http://localhost:3001/api

### 4. Build for production
```bash
npm run build
```

---

## Features

- ✅ Parametric insurance with 8 trigger types
- ✅ Multi-layer AI fraud detection (GPS, activity, repeat, time-window)
- ✅ Simulated UPI payout with transaction ID
- ✅ Risk-based premium calculation
- ✅ Admin dashboard with analytics
- ✅ Email notifications to claims@surakshapay.ai
- ✅ Fully responsive dark UI

## Tech Stack

- **Frontend**: React 18, Vite, Chart.js, CSS custom properties
- **Backend**: Node.js, Express, JSON file store
- **Auth**: JWT (simulated)
- **Deployment**: Vercel (frontend) + Railway/Render (backend)
