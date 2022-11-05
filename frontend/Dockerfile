FROM node:16.17.0-bullseye-slim AS build-step


WORKDIR /app
COPY package*.json package-lock.json ./
RUN npm install
COPY . .

RUN npm run build

FROM nginx:alpine
WORKDIR /usr/share/nginx/html
COPY --from=build-step /app/build .
# run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]