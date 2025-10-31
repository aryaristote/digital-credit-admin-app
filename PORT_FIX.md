# Port Fix Applied

## What I Changed

Updated `backend/src/main.ts` to use port 9000 by default instead of 5430.

## Next Steps

**Restart Docker** to apply the changes:

```bash
# Stop Docker
docker compose down

# Start again
docker compose up
```

Now the backend will run on port 9000 and the frontend on port 9001!

## Access Points

- Frontend: http://localhost:9001
- Backend API: http://localhost:9000/api/v1
- Backend Swagger: http://localhost:9000/api/v1/docs
