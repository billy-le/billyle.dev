# syntax=docker/dockerfile:1

ARG NODE_VERSION=lts
ARG PNPM_VERSION=10.30.3

FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /app
RUN --mount=type=cache,target=/root/.npm \
    npm install -g pnpm@${PNPM_VERSION}
COPY package.json pnpm-lock.yaml ./

FROM base AS build-deps
RUN pnpm install --frozen-lockfile

FROM build-deps AS build
ARG PUBLIC_REMARK_URL
ARG PUBLIC_SITE
ENV PUBLIC_REMARK_URL=${PUBLIC_REMARK_URL}
ENV PUBLIC_SITE=${PUBLIC_SITE}
COPY . .
RUN --mount=type=cache,target=/app/node_modules/.astro \
    --mount=type=cache,target=/root/.astro/cache,sharing=locked \
    mkdir -p node_modules/.astro && \
    pnpm run build

FROM nginx:stable-alpine AS final
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
