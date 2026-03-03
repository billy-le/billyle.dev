# syntax=docker/dockerfile:1

ARG NODE_VERSION=lts
ARG PNPM_VERSION=9.12.3

FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /usr/src/app
RUN --mount=type=cache,target=/root/.npm \
    npm install -g pnpm@${PNPM_VERSION}

FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

FROM base AS build
ARG PUBLIC_REMARK_URL
ARG PUBLIC_SITE
ENV PUBLIC_REMARK_URL=${PUBLIC_REMARK_URL}
ENV PUBLIC_SITE=${PUBLIC_SITE}
COPY package.json pnpm-lock.yaml ./
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY . .
RUN --mount=type=cache,target=/usr/src/app/node_modules/.astro \
    pnpm run build
RUN rm -rf .git

FROM caddy:alpine AS final
COPY Caddyfile /etc/caddy/Caddyfile
COPY --from=build /usr/src/app/dist /srv
EXPOSE 4321
