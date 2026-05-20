# API Dockerfile
FROM oven/bun:latest

WORKDIR /app


COPY package.json bun.lock ./
RUN bun install --ignore-scripts

COPY . .

RUN apt-get update && apt-get install -y openssl
RUN echo JWT_SECRET=$(openssl rand -hex 32) >> /app/.env
RUN echo REFRESH_SECRET=$(openssl rand -hex 32) >> /app/.env
RUN echo "FRONTEND_URL=http://localhost:5173" >> /app/.env
RUN echo "DB_CONN=/app/db.sqlite" >> /app/.env
ARG PORT
ENV PORT=$PORT
EXPOSE $PORT
RUN ["env"]
CMD ["bun", "run", "start"]
