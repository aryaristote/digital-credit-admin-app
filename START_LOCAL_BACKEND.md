# Start Backend Locally (Without Docker)

## Problem

You're trying to use Docker, but we need to run the backend locally for debugging.

## Solution: Start Backend Locally

1. **Stop any Docker containers** (stop `docker compose up` if running)

2. **Open a new terminal** and navigate to the backend folder:

   ```bash
   cd backend
   ```

3. **Start the backend:**

   ```bash
   npm run dev
   ```

4. **You should see:**

   ```
   🚀 Admin Application is running on: http://localhost:3002/api/v1
   ```

5. **Keep this terminal open!** The backend needs to keep running.

6. **In your frontend terminal** (separate window), make sure the frontend is running and restarted with the new proxy config.

7. **Try logging in again!**

The backend should be running on port 3002 (as you mentioned), and the frontend proxy should now connect to it.
