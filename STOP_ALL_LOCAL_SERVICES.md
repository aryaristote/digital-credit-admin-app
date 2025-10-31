# Stop All Local Services

## Problem

Both ports 3002 (backend) and 5174 (frontend) are already in use by local processes.

## Solution: Stop Everything Local

You need to stop:

1. **Local Backend** - Using port 3002
2. **Local Frontend** - Using port 5174

### Steps

1. **Find all terminals running services:**
   - Look for any terminal running `npm run dev`
2. **Stop each one:**

   - Press `Ctrl+C` in each terminal

3. **Verify ports are free:**
   Check if ports are still in use:

   ```powershell
   netstat -ano | findstr :3002
   netstat -ano | findstr :5174
   ```

   If you see output, there's still something running!

4. **Kill any remaining processes:**

   - Note the PID (last column)
   - Run: `taskkill /PID <PID> /F`

5. **Now run Docker:**
   ```bash
   docker compose up
   ```

## Important

Docker needs these ports to be **completely free**. Make sure nothing is using:

- Port 3002 (backend)
- Port 5174 (frontend)
- Port 5433 (PostgreSQL)

Then Docker will run everything!
