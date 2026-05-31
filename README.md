# Qwik Frontend

## Local Setup
1. Copy `.env.example` to `.env` (already created for local dev).
2. Install dependencies:
```bash
npm install
```
3. Start dev server:
```bash
npm run dev
```

## Environment Variable
```env
VITE_API_URL="http://localhost:4000/api"
```

## Production (Vercel or similar)
- Set `VITE_API_URL` to your deployed backend API URL (example: `https://your-backend.onrender.com/api`).
