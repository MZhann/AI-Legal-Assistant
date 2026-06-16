# Telegram bot for AI Legal Assistant
# Use with Railway: set Root Directory to "telegram-bot"
FROM node:20-bookworm-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

CMD ["node", "dist/index.js"]
