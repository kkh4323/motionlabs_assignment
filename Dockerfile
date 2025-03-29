# Base 설정
FROM node:18.20.7-alpine AS base
WORKDIR /usr/src/app

# Development 의존성 설치
FROM base AS development
COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . .

# Build
FROM base AS build
COPY package*.json ./
COPY --from=development /usr/src/app/node_modules ./node_modules
COPY . .
RUN npm run build
ENV NODE_ENV=production
RUN npm ci --only=production && npm cache clean --force

# Production
FROM base AS production
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
USER node
CMD ["node", "dist/main.js"]