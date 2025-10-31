# Fixed: Proxy Configuration Issue

## The Problem

The frontend was trying to connect to `http://backend:5430` (Docker hostname) instead of `http://localhost:5430`.

## The Fix

Updated `frontend/vite.config.ts` to use `http://localhost:5430` instead of `http://backend:5430`.

## Next Steps

1. **Restart your frontend dev server:**

   ```bash
   # Stop the current frontend (Ctrl+C)
   cd frontend
   npm run dev
   ```

2. **Try logging in again** - it should work now!

## Explanation

- When running locally (not in Docker), the frontend needs to connect to `localhost:5430`
- When running in Docker, it connects to `backend:5430` (the container name)
- We changed it to `localhost:5430` for local development
