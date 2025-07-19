FROM node:23-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

# Prisma generate
RUN npx prisma generate

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]