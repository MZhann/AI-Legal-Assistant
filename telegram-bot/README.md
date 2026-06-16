# AI Legal Assistant — Telegram Bot

Telegram bot that lets a user log into their existing AI Legal Assistant account,
pick one of their existing chats, and keep talking to the AI from Telegram. All
messages go through the same backend REST API used by the website
(`/api/v1/user/chats/...`), so the conversation stays in sync in both places —
no backend changes were needed.

## How it works

- The bot is a standalone Node/TypeScript service. It does **not** reimplement
  auth or the AI logic — it calls the existing backend's REST endpoints:
  - `POST /auth/login` to get a JWT
  - `GET /user/chats` to list chats
  - `POST /user/chats` to create a new chat
  - `POST /user/chats/:chatId/message` to send a message and get the AI reply
- It stores a small mapping per Telegram user (JWT token + selected chat id) in
  a `bot_sessions` Mongo collection, in the **same MongoDB database** as the
  backend (set the same `MONGODB_URI`). It does not touch the backend's own
  collections/models.

## Commands

- `/login` — wizard: asks for email, then password (the password message is
  deleted from the chat immediately after it's read)
- `/logout` — clears the stored session
- `/chats` — lists your chats with inline buttons to pick the active one
- `/new` — creates a new chat and makes it active
- `/whoami` — shows the logged-in account and active chat
- Any plain text message — sent to the AI in the active chat, reply posted back

## Local development

```bash
cp .env.example .env   # fill in TELEGRAM_BOT_TOKEN, BACKEND_API_URL, MONGODB_URI
npm install
npm run dev
```

Get `TELEGRAM_BOT_TOKEN` from [@BotFather](https://t.me/BotFather) (`/newbot`).

## Deploying to Railway

1. Create a **new Railway service** in the project (or a separate project),
   pointing at this repo with **Root Directory** set to `telegram-bot`.
   Railway will detect the `Dockerfile` here automatically.
2. Set environment variables on that service:
   - `TELEGRAM_BOT_TOKEN`
   - `BACKEND_API_URL` — e.g. `https://your-backend.up.railway.app/api/v1`
   - `MONGODB_URI` — the same connection string as the backend service
   - `NODE_ENV=production`
3. Deploy. The bot runs via long polling, so no public domain/webhook is
   required — it just needs outbound network access, which Railway provides.
