# Update backend/.env File

## Problem

The `backend/.env` file has `PORT=3002` which overrides the code default.

## Solution

**Manually edit** `backend/.env` and change:

```
PORT=3002
```

To:

```
PORT=9000
```

## Steps

1. Open `backend/.env` in a text editor
2. Find the line: `PORT=3002`
3. Change it to: `PORT=9000`
4. Save the file
5. Restart your local backend

Now it will run on port 9000!
