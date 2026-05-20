# Frontend Dockerfile
FROM oven/bun:latest AS build


WORKDIR /app
COPY package.json bun.lock ./
RUN bun install
COPY . .

CMD ["bun", "run", "start"]
