# syntax=docker/dockerfile:1

ARG NODE_VERSION=21.4.0
ARG PNPM_VERSION=8.12.0

FROM node:${NODE_VERSION}-alpine as base
WORKDIR /usr/src/app
RUN --mount=type=cache,target=/root/.npm \
    npm install -g pnpm@${PNPM_VERSION}

FROM base as build
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

FROM nginx:stable-alpine3.17 as final
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/dist /usr/share/nginx/html
EXPOSE 4321
