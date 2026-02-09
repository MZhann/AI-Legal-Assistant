# Backend + Puppeteer (Chromium) for document PDF generation on Railway
# Use with Railway: set Root Directory to "backend"
FROM node:20-bookworm-slim

# Install Chromium and dependencies so Puppeteer can launch (no "libglib-2.0.so.0" etc. errors)
RUN apt-get update && apt-get install -y \
    ca-certificates \
    chromium \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libglib2.0-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libx11-6 \
    libxcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxkbcommon0 \
    libxrandr2 \
    libxrender1 \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Use system Chromium; do not download in Puppeteer
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=1
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

EXPOSE 3001

CMD ["node", "dist/index.js"]
