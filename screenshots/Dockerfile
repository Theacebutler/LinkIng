FROM oven/bun:0.2.0

WORKDIR /screenshots

RUN apt-get update && apt-get install -y chromium \
  --no-install-recommends \
  && rm -fr /var/lib/apt/lists/*

COPY package.json bun.lock ./
RUN npm install --ignore-scripts

COPY . .

# Tell Puppeteer to skip downloading its bundled Chromium; we will use the system one
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
CMD ["bun", "run", "start"]
