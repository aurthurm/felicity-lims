FROM node:18.16-alpine

ENV HOST 0.0.0.0

RUN apk update && apk add bash
RUN npm i -g pnpm

WORKDIR /app/

COPY ./package.json /app
COPY ./pnpm-lock.yaml /app

RUN pnpm install

COPY ./webapp /app
