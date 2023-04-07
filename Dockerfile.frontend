FROM node:latest
ENV HOST 0.0.0.0
RUN npm i -g pnpm

WORKDIR /app

COPY ./vite/package.json /app/
COPY ./vite/pnpm-lock.yaml /app/
RUN pnpm install

COPY ./vite /app
