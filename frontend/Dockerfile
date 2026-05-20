FROM oven/bun:latest AS build

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

WORKDIR /app
COPY package.json bun.lock ./
RUN bun install
COPY . .

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL  
ARG PORT
ENV PORT="5173"
# RUN bun run build
EXPOSE 5173
CMD ["bun", "run", "start"]

# FROM nginx:alpine AS runtime
#
# COPY --from=build /app/dist /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/conf.d/default.conf
#
# EXPOSE 80
#
# CMD ["nginx", "-g", "daemon off;"]
