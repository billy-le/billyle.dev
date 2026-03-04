# syntax=docker/dockerfile:1
FROM oven/bun:latest

WORKDIR /app
ENV HUSKY=0

# 1. Copy the root manifest AND the package manifest
# This is crucial for Bun to understand it's in a monorepo
COPY package.json bun.lockb* ./
COPY packages/email/package.json ./packages/email/

# 2. Install dependencies for the whole workspace
RUN bun install --production --ignore-scripts

# 3. Copy the rest of the source code
COPY . .

# 4. Set the working directory to the email package
WORKDIR /app/packages/email

# 5. Verify elysia exists before running (optional debug)
RUN ls node_modules/elysia || ls ../../node_modules/elysia || echo "Elysia not found!"

# Use the environment variable for the port
EXPOSE ${EMAIL_SERVER_PORT}

# Run the app
CMD ["bun", "start"]
