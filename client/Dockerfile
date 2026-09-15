# ---- Build stage: produce the static production React bundle ----
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install --fetch-retries=5 --fetch-retry-mintimeout=20000 --fetch-retry-maxtimeout=120000

COPY . .
RUN npm run build

# ---- Production stage: serve the static bundle only (no dev server) ----
FROM node:18-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=build /app/build ./build

EXPOSE 3000

# -s enables SPA fallback: any unknown path serves index.html, so
# react-router's client-side routes (/ticket/:id, /profile, ...) work.
CMD ["serve", "-s", "build", "-l", "3000"]
