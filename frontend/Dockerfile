# Frontend Dockerfile
FROM oven/bun:latest AS build


WORKDIR /app
COPY package.json bun.lock ./
RUN bun install
COPY . .
RUN ["bun", "run", "build"]

FROM caddy:latest AS reverse-proxy
COPY --from=build /app/dist/ /srv/
COPY ./Caddyfile /etc/caddy/Caddyfile

CMD ["caddy", "run"]
