# ── Stage 1: Build React ──
FROM node:20-alpine AS build
WORKDIR /app

# Cache node_modules
COPY package.json package-lock.json* ./
RUN npm ci --silent

COPY . .

# Build args for environment
ARG REACT_APP_API_URL=/api
ARG REACT_APP_ENV=production

ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_ENV=$REACT_APP_ENV
ENV NODE_OPTIONS=--openssl-legacy-provider
ENV GENERATE_SOURCEMAP=false

RUN npm run build

# ── Stage 2: Serve with Nginx ──
FROM nginx:1.25-alpine
WORKDIR /usr/share/nginx/html

# Remove default config
RUN rm -rf ./*
COPY --from=build /app/build .
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
