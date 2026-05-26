# API Dockerfile
FROM oven/bun:latest

WORKDIR /app

RUN apt-get update && apt-get install -y openssl \
  chromium \
  --no-install-recommends \
  && rm -fr /var/lib/apt/lists/*

RUN apt-get update && apt-get install -y openssl \
  chromium \
  --no-install-recommends \
  && rm -fr /var/lib/apt/lists/*

# Tell Puppeteer to skip downloading its bundled Chromium; we will use the system one
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

COPY package.json bun.lock ./
RUN bun install --ignore-scripts

COPY . .

# add the access and refresh token to the environment variables
# RUN echo "JWT_SECRET=$(openssl rand -hex 32)" >> .env
# RUN echo "REFRESH_SECRET=$(openssl rand -hex 32)" >> .env

# Tell Puppeteer to skip downloading its bundled Chromium; we will use the system one
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
CMD ["bun", "run", "start"]
