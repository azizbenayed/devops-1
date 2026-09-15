# ---- Build stage: compile TypeScript to JS ----
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install --fetch-retries=5 --fetch-retry-mintimeout=20000 --fetch-retry-maxtimeout=120000

COPY . .
RUN npm run build

# ---- Production stage: run the compiled app only ----
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev --fetch-retries=5 --fetch-retry-mintimeout=20000 --fetch-retry-maxtimeout=120000

COPY --from=build /app/dist ./dist

CMD ["node", "dist/index.js"]
