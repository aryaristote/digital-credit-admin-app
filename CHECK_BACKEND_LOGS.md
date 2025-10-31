# Check Backend Logs for 500 Error

## The Problem

Frontend is getting a 500 Internal Server Error when trying to login.

## Solution: Check Backend Terminal

1. **Find your backend terminal** where you ran `npm run dev`

2. **Look for error logs** - You should see detailed logs like:

   ```
   ❌ [EXCEPTION] Error occurred
   ❌ [EXCEPTION] Path: /api/v1/auth/login
   ❌ [EXCEPTION] Method: POST
   ❌ [EXCEPTION] Error: [error details]
   ❌ [EXCEPTION] Stack: [stack trace]
   ```

3. **Common errors you might see:**
   - **Database connection error**: `ECONNREFUSED`, `could not connect to database`
   - **User not found**: `User not found - admin@digitalcredit.com`
   - **Role mismatch**: `User is not an admin`
   - **Validation error**: `Validation failed`
   - **JWT error**: `secretOrKey must have a value`

## Next Steps

After you see the error in the backend logs, share it with me and I can help fix it!

The logs will tell us EXACTLY what's going wrong.
