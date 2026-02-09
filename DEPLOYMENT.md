# Deployment: Vercel (Frontend) + Railway (Backend)

This project uses **localhost only for development**. In production you set environment variables; no localhost URLs are used.

---

## 1. Deploy backend on Railway

1. Push your code to GitHub and connect the **backend** (or monorepo root) to Railway.
2. Set **Root Directory** to `backend` if the repo is the full project.
3. **Build command:** `npm run build`  
   **Start command:** `npm start`  
   **Watch paths:** `backend/**` (if monorepo)

### Railway environment variables (backend)

| Variable | Required | Description |
|----------|----------|-------------|
| `NODE_ENV` | Yes | `production` |
| `PORT` | No | Railway sets this automatically. Leave unset or use `PORT` from Railway. |
| `MONGODB_URI` | Yes | MongoDB connection string (e.g. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or Railway MongoDB plugin). |
| `CORS_ORIGIN` | Yes | Your **frontend** URL with no trailing slash, e.g. `https://your-app.vercel.app` |
| `JWT_SECRET` | Yes | Random secret, **at least 32 characters**. Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `JWT_EXPIRES_IN` | No | Default `7d` |
| `GOOGLE_AI_API_KEY` | Yes (for AI chat) | From [Google AI Studio](https://aistudio.google.com/apikey) |
| `API_PREFIX` | No | Default `/api/v1` |

**Example (Railway):**

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/ai-legal-assistant?retryWrites=true&w=majority
CORS_ORIGIN=https://your-app.vercel.app
JWT_SECRET=your-64-char-hex-or-long-random-string-min-32-chars
GOOGLE_AI_API_KEY=your-google-ai-api-key
```

After deploy, copy the **public backend URL** (e.g. `https://your-backend.up.railway.app`). You will use it in the frontend.

---

## 2. Deploy frontend on Vercel

1. Connect your repo to Vercel.
2. Set **Root Directory** to `frontend` (if monorepo).
3. **Framework:** Next.js (auto-detected). Build command: `npm run build` (default).

### Vercel environment variables (frontend)

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Yes | Backend API base URL **including** `/api/v1`, e.g. `https://your-backend.up.railway.app/api/v1` |

**Example (Vercel):**

```
NEXT_PUBLIC_API_URL=https://your-backend.up.railway.app/api/v1
```

- The app uses this for all REST calls (auth, chat, documents, lawyers).
- WebSocket (lawyer chat) uses the same host without `/api/v1` (derived automatically).

**No localhost:** If `NEXT_PUBLIC_API_URL` is set, the frontend never uses localhost. For local dev, either leave it unset (defaults to `http://localhost:3001/api/v1`) or set it in `.env.local`.

---

## 3. Checklist

- [ ] Backend: `NODE_ENV=production`
- [ ] Backend: `CORS_ORIGIN` = exact Vercel app URL (e.g. `https://your-app.vercel.app`)
- [ ] Backend: `JWT_SECRET` ≥ 32 characters
- [ ] Backend: `MONGODB_URI` set (Atlas or Railway MongoDB)
- [ ] Backend: `GOOGLE_AI_API_KEY` set for AI chat
- [ ] Frontend: `NEXT_PUBLIC_API_URL` = Railway backend URL + `/api/v1`
- [ ] No `localhost` in production env vars

---

## 4. Optional: multiple CORS origins (e.g. preview deployments)

If you need to allow several frontend URLs (e.g. production + Vercel previews), you can set:

```
CORS_ORIGIN=https://your-app.vercel.app,https://your-app-*.vercel.app
```

The backend would need a small change to accept comma-separated origins. Currently it expects a single origin; for a single production URL the above env is enough.

---

## 5. Local development (unchanged)

- **Backend:** `.env` in `backend/` with `MONGODB_URI`, `CORS_ORIGIN=http://localhost:3000`, `GOOGLE_AI_API_KEY`, etc. See `backend/env.example`.
- **Frontend:** No env needed; defaults to `http://localhost:3001/api/v1`. Or set `NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1` in `frontend/.env.local`.
