// lib/utils/encrypt.ts
// Назначение: Хеширование и сравнение паролей с помощью bcryptjs
import bcryptjs from "bcryptjs";
import { SALT_ROUNDS } from "../constants";

/**
 * Хеширует пароль в открытом виде с использованием bcryptjs
 *
 * @param plainPassword - пароль в открытом виде (строка)
 * @returns Promise<string> - хешированный пароль
 * @throws Error - если произошла ошибка при хешировании
 */
export const hash = async (plainPassword: string): Promise<string> => {
  try {
    // Используем bcryptjs для хеширования пароля с заданным количеством раундов соли
    return await bcryptjs.hash(plainPassword, SALT_ROUNDS);
  } catch (error) {
    // Логируем ошибку для отладки
    console.error(
      "[lib/utils/encrypt.ts] Error al hashear la contraseña:",
      error
    );
    // Выбрасываем понятную ошибку для обработки в вышестоящем коде
    throw new Error("No se pudo hashear la contraseña");
  }
};

/**
 * Сравнивает пароль в открытом виде с хешированным паролем
 *
 * @param plainPassword - пароль в открытом виде (введенный пользователем)
 * @param hashedPassword - хешированный пароль из базы данных
 * @returns Promise<boolean> - true если пароли совпадают, false если нет
 * @throws Error - если произошла ошибка при сравнении
 */
export const compare = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  try {
    // Проверяем входные параметры
    if (!plainPassword || !hashedPassword) {
      return false;
    }
    // Используем bcryptjs для сравнения открытого пароля с хешем
    return await bcryptjs.compare(plainPassword, hashedPassword);
  } catch (error) {
    // Логируем ошибку для отладки
    console.error(
      "[lib/utils/encrypt.ts] Error al comparar la contraseña:",
      error
    );
    throw new Error("No se pudo comparar la contraseña");
  }
};

/**
 * Проверяет минимальную длину пароля
 *
 * @param password - пароль для проверки
 * @param minLength - минимальная длина (по умолчанию 8 символов)
 * @returns boolean - true если пароль достаточно длинный
 */
export const validatePasswordLength = (
  password: string,
  minLength: number = 8
): boolean => {
  return password.length >= minLength;
};

/**
 * Проверяет сложность пароля (наличие цифр, букв разных регистров)
 *
 * @param password - пароль для проверки
 * @returns boolean - true если пароль соответствует требованиям сложности
 */
export const validatePasswordComplexity = (password: string): boolean => {
  // Проверяем наличие хотя бы одной цифры
  const hasNumber = /\d/.test(password);
  // Проверяем наличие хотя бы одной строчной буквы
  const hasLowerCase = /[a-z]/.test(password);
  // Проверяем наличие хотя бы одной заглавной буквы
  const hasUpperCase = /[A-Z]/.test(password);

  return hasNumber && hasLowerCase && hasUpperCase;
};
