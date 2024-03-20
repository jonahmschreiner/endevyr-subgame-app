FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN rm -rf node_modules
RUN rm -rf build
RUN npm install
COPY . .
COPY ./prisma prisma
RUN npx prisma generate
RUN npm run build

ENTRYPOINT [ "node", "build" ]