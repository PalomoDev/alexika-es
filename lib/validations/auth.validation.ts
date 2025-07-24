// lib/validation/auth.validation.ts
// Файл: lib/validation/auth.validation.ts
// Назначение: Zod-схемы для валидации данных регистрации и логина пользователя

import { z } from "zod";

// Схема для регистрации пользователя
export const registerSchema = z.object({
    nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    email: z.email("Correo electrónico no válido"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

// Схема для логина пользователя
export const loginSchema = z.object({
    email: z.email("Некорректный email"),
    password: z.string().min(6, "Пароль обязателен"),
});
