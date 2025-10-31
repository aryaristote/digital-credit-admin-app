# Fixed: Update Proxy to Port 3002

## What I Changed

Updated `frontend/vite.config.ts` to proxy to `http://localhost:3002` instead of `http://localhost:5430`.

## NEXT STEP: Restart Frontend

**IMPORTANT:** You MUST restart your frontend dev server for the change to take effect!

1. **Stop the frontend** (Ctrl+C in the frontend terminal)
2. **Start it again:**
   ```bash
   cd frontend
   npm run dev
   ```
3. **Try logging in again**

This should work now! The frontend will now connect to the backend on port 3002.
