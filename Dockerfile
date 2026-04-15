FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY server.js .
COPY --from=build /app/dist ./dist
EXPOSE 3001
ENV PORT=3001
ENV DATA_DIR=/app/data
VOLUME ["/app/data"]
CMD ["node", "server.js"]
