# WaitlistPro

Lean production MVP for running a launch waitlist with segmented email capture, referral tracking, access tiers, social proof, email logs, and analytics.

## Stack

- Next.js 14 App Router, TypeScript, Tailwind CSS
- Clerk for authentication and protected dashboard routes
- Supabase client ready for production database/storage integration
- FastAPI backend with SQLAlchemy models for `users`, `waitlist_entries`, `referrals`, `milestones`, and `email_logs`
- Resend-ready email log flow

## Features

- Landing page with real waitlist copy, email capture, segmentation, progress bar, testimonials, and tier display
- Referral code creation for each signup
- Referral attribution and tier upgrades at 3 and 10 referrals
- Clerk sign-in/sign-up pages and protected `/dashboard`
- Dashboard with signup, referral, tier, segment, and email metrics
- FastAPI CRUD endpoints for waitlist entries, referrals, milestones, email logs, and analytics

## Setup

```bash
cp .env.example .env
```

Fill Clerk, Supabase, and Resend values.

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`.

## Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

API runs at `http://localhost:8000`.

## Docker

```bash
docker compose up --build
```

## API quick test

```bash
curl -X POST http://localhost:8000/api/waitlist \
  -H 'Content-Type: application/json' \
  -d '{"email":"founder@example.com","segment":"founder","source":"landing_page"}'
```

## Deploy

Deploy `frontend` to Vercel. Add environment variables from `.env.example` in Vercel project settings. Deploy backend to any ASGI host or container platform and set `NEXT_PUBLIC_API_URL` to backend URL.
