FROM node:16.18.0-alpine3.16 AS build-step


WORKDIR /app
COPY package*.json package-lock.json ./
# ==== BUILD =====
# Install dependencies (npm ci makes sure the exact versions in the lockfile gets installed)
RUN npm ci
COPY . .
# Build the app
RUN npm run build
# ==== RUN =======
# Set the env to "production"
ENV NODE_ENV production

FROM nginx:alpine
WORKDIR /usr/share/nginx/html
COPY --from=build-step /app/build .
# run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]
