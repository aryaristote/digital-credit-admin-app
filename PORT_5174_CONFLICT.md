# Port 5174 Already in Use

## Problem

The frontend service isn't starting because port 5174 is already being used (probably by a local frontend dev server).

## Solution

### Option 1: Stop Local Frontend (Recommended)

If you have a local frontend running (with `npm run dev`), stop it:

- Press `Ctrl+C` in that terminal
- Then run `docker compose up` again

### Option 2: Change the Port in Docker

Edit `docker-compose.yml` and change the frontend port from `5174` to something else like `5175`:

```yaml
ports:
  - "5175:5174" # Change from 5174:5174
```

Then access the frontend at `http://localhost:5175`

### Option 3: Kill the Process Using Port 5174

Find what's using the port:

```powershell
netstat -ano | findstr :5174
```

Kill it (replace PID with the number you found):

```powershell
taskkill /PID <PID> /F
```

## Recommendation

Just stop your local frontend dev server and let Docker handle everything!
