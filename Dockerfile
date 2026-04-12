# stage 1: builder
FROM node:20-alpine AS builder

WORKDIR /app

# Required build-time arguments
ARG NEXT_PUBLIC_API_URL

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

COPY package*.json ./
RUN npm install

COPY . .

# Build the app
RUN npm run build

# stage 2: runner
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy only essential files
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["npm", "start"]
