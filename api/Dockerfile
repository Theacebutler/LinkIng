# API Dockerfile
FROM oven/bun:latest

WORKDIR /app

RUN apt-get update && apt-get install -y chromium \
  --no-install-recommends \
  && rm -fr /var/lib/apt/lists/*

# Tell Puppeteer to skip downloading its bundled Chromium; we will use the system one
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

COPY package.json bun.lock ./
RUN bun install --ignore-scripts

COPY . .

CMD ["bun", "run", "start"]
