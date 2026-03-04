# syntax=docker/dockerfile:1

ARG NODE_VERSION=lts
ARG PNPM_VERSION=10.30.3

FROM node:${NODE_VERSION}-alpine AS base
RUN npm install -g pnpm@${PNPM_VERSION}
WORKDIR /app
ENV HUSKY=0
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/website/package.json ./packages/website/

FROM base AS build-deps
RUN pnpm install --frozen-lockfile --filter @billyle/website...

FROM build-deps AS build
ARG PUBLIC_REMARK_URL
ARG PUBLIC_SITE
ENV PUBLIC_REMARK_URL=${PUBLIC_REMARK_URL}
ENV PUBLIC_SITE=${PUBLIC_SITE}
COPY packages/website ./packages/website
RUN pnpm --filter @billyle/website run build

FROM nginx:stable-alpine AS final
COPY packages/website/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/packages/website/dist /usr/share/nginx/html
EXPOSE 4321
