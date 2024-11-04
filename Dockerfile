# Base image with Node.js 22 and pnpm installed
FROM node:22-bullseye AS base

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy only the package.json and pnpm-lock.yaml files first for caching
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the project files
COPY . .

# Build the application
RUN pnpm run b

EXPOSE 3000

CMD ["pnpm", "run", "s"]
