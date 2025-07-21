FROM node:23-alpine

WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci

# Копируем все файлы проекта (включая prisma/schema.prisma)
COPY . .

# Генерируем Prisma клиент (после копирования schema.prisma)
RUN npx prisma generate

# Собираем Next.js приложение
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]