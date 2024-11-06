FROM node:22
RUN npm install -g pnpm
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run b
EXPOSE 3000
CMD ["pnpm", "run", "s"]
