# syntax=docker/dockerfile:1
FROM oven/bun:latest

WORKDIR /app/packages/email

COPY packages/email/package.json ./
RUN bun install --production --ignore-scripts

COPY packages/email/src ./src
COPY packages/email/public ./public

EXPOSE ${EMAIL_SERVER_PORT}

CMD ["bun", "start"]
