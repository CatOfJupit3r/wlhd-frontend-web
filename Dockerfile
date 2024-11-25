FROM node:21.6.1 AS builder

# https://stackoverflow.com/questions/77486735/docker-with-vite-env-variables-are-undefined-inside-the-docker-container
ARG VITE_BACKEND_URL
ARG VITE_CDN_URL

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . ./

ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
ENV VITE_CDN_URL=$VITE_CDN_URL

RUN npm run build

FROM node:21.6.1-slim

WORKDIR /app

COPY package*.json ./

RUN npm install --production --ignore-scripts

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public

CMD ["npm", "run", "serve"]