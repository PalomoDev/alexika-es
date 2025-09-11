'use server'
import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import prisma from "@/lib/prisma";
import {CreateArticle, CreateArticleSchema} from "@/lib/validations/articles/article-validation";

/**
 * Создает папку на основе первых 4 слов из слага
 * @param slug - URL slug статьи (например: "mejores-rutas-senderismo-valencia-2024")
 * @param baseDir - базовая директория (по умолчанию "public/articles")
 * @returns путь к созданной папке
 */
export async function createArticleFolder(
    slug: string,
    baseDir: string = "uploads/articles"
): Promise<string> {
    try {
        // Получаем первые 4 слова из слага
        const words = slug.split('-').filter(word => word.length > 0);
        const folderName = words.slice(0, 4).join('-');

        // Полный путь
        const folderPath = path.join(process.cwd(), baseDir, folderName);

        // Если папка уже есть — удаляем полностью
        try {
            await fs.access(folderPath);
            await fs.rm(folderPath, { recursive: true, force: true });
            console.log(`Старая папка удалена: ${folderPath}`);
        } catch {
            // папки нет — просто продолжаем
        }

        // Создаем новую пустую папку
        await fs.mkdir(folderPath, { recursive: true });
        console.log(`Создана новая папка: ${folderPath}`);

        return folderPath;

    } catch (error) {
        console.error('Ошибка при создании папки:', error);
        throw new Error(`No se pudo crear la carpeta para el artículo: ${error}`);
    }
}

/**
 * Получает относительный путь для веб-доступа
 * @param slug - URL slug статьи
 * @param baseDir - базовая директория (по умолчанию "articles")
 * @returns относительный путь (/articles/folder-name)
 */
export async function getArticleWebPath(slug: string, baseDir: string = "articles"): Promise<string> {
    const words = slug.split('-').filter(word => word.length > 0);
    const folderName = words.slice(0, 4).join('-');
    return `/${baseDir}/${folderName}`;
}

/**
 * Преобразует полный путь в веб-путь для доступа к файлам
 * @param fullPath - полный путь к папке
 * @returns относительный путь для веб-доступа
 */
export async function getWebPathFromFullPath(fullPath: string): Promise<string> {
    // Находим индекс 'uploads' и берем все после него
    const uploadsIndex = fullPath.indexOf('uploads');
    if (uploadsIndex === -1) {
        throw new Error('Путь должен содержать папку uploads');
    }

    // Получаем путь начиная с 'uploads'
    const relativePath = fullPath.substring(uploadsIndex);
    return `/${relativePath}`;
}




interface SaveFileOptions {
    maxFileSize?: number; // в байтах (по умолчанию 10MB)
    allowedTypes?: string[]; // разрешенные MIME типы
    renameFiles?: boolean; // переименовывать файлы для избежания конфликтов
    preserveExtension?: boolean; // сохранять оригинальное расширение
}

interface SaveFileResult {
    success: boolean;
    savedFiles: Array<{
        originalName: string;
        savedName: string;
        fullPath: string;
        relativePath: string;
        size: number;
    }>;
    errors: string[];
}

/**
 * Сохраняет файлы в указанную папку с базовыми проверками безопасности
 */
export async function saveFiles(
    files: File[],
    fullFolderPath: string,
    options: SaveFileOptions = {}
): Promise<SaveFileResult> {
    const {
        maxFileSize = 10 * 1024 * 1024, // 10MB по умолчанию
        allowedTypes = [
            'image/jpeg', 'image/png', 'image/webp', 'image/gif',
            'text/markdown', 'text/plain'
        ],
        renameFiles = false, // По умолчанию НЕ переименовываем
        preserveExtension = true
    } = options;

    const result: SaveFileResult = {
        success: true,
        savedFiles: [],
        errors: []
    };

    if (files.length === 0) {
        return result;
    }

    try {
        // Проверяем существование папки
        await fs.access(fullFolderPath);
    } catch {
        result.errors.push(`Carpeta no existe: ${fullFolderPath}`);
        result.success = false;
        return result;
    }

    for (let i = 0; i < files.length; i++) {
        const file = files[i];

        try {
            // 1. Проверка размера файла
            if (file.size > maxFileSize) {
                result.errors.push(
                    `${file.name}: Archivo demasiado grande (${Math.round(file.size / 1024 / 1024)}MB, máximo ${Math.round(maxFileSize / 1024 / 1024)}MB)`
                );
                continue;
            }

            // 2. Проверка MIME типа
            if (!allowedTypes.includes(file.type)) {
                result.errors.push(`${file.name}: Tipo de archivo no permitido (${file.type})`);
                continue;
            }

            // 3. Получение расширения файла
            const originalExt = path.extname(file.name).toLowerCase();

            // 4. Проверка расширения (дополнительная безопасность)
            const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.md', '.txt'];
            if (preserveExtension && !allowedExtensions.includes(originalExt)) {
                result.errors.push(`${file.name}: Extensión no permitida (${originalExt})`);
                continue;
            }

            // 5. Генерация имени файла
            let fileName: string;
            if (renameFiles) {
                // Создаем уникальное имя с сохранением расширения
                const uuid = randomUUID();
                fileName = preserveExtension
                    ? `${uuid}${originalExt}`
                    : uuid;
            } else {
                // Используем оригинальное имя (перезаписываем если существует)
                fileName = file.name;
            }

            // 6. Полный путь к файлу
            const fullFilePath = path.join(fullFolderPath, fileName);

            // 7. Получение содержимого файла
            const fileBuffer = Buffer.from(await file.arrayBuffer());

            // 8. Дополнительная проверка содержимого для изображений
            if (file.type.startsWith('image/')) {
                if (!isValidImageBuffer(fileBuffer)) {
                    result.errors.push(`${file.name}: Archivo de imagen corrupto o inválido`);
                    continue;
                }
            }

            // 9. Сохранение файла
            await fs.writeFile(fullFilePath, fileBuffer);

            // 10. Добавляем в результат
            result.savedFiles.push({
                originalName: file.name,
                savedName: fileName,
                fullPath: fullFilePath,
                relativePath: await getWebPathFromFullPath(fullFilePath),
                size: file.size
            });

        } catch (error) {
            result.errors.push(`${file.name}: Error al guardar - ${error}`);
            console.error(`Error saving file ${file.name}:`, error);
        }
    }

    // Если есть ошибки, но некоторые файлы сохранились успешно
    if (result.errors.length > 0) {
        result.success = result.savedFiles.length > 0;
    }

    return result;
}

/**
 * Проверяет существование файла
 */
async function fileExists(filePath: string): Promise<boolean> {
    try {
        await fs.access(filePath);
        return true;
    } catch {
        return false;
    }
}

/**
 * Базовая проверка валидности изображения по заголовку файла
 */
function isValidImageBuffer(buffer: Buffer): boolean {
    if (buffer.length < 4) return false;

    // Проверяем магические байты основных форматов изображений
    const header = buffer.subarray(0, 4);

    // JPEG: FF D8 FF
    if (header[0] === 0xFF && header[1] === 0xD8 && header[2] === 0xFF) {
        return true;
    }

    // PNG: 89 50 4E 47
    if (header[0] === 0x89 && header[1] === 0x50 && header[2] === 0x4E && header[3] === 0x47) {
        return true;
    }

    // GIF: 47 49 46 38 или 47 49 46 39
    if (header[0] === 0x47 && header[1] === 0x49 && header[2] === 0x46 &&
        (header[3] === 0x38 || header[3] === 0x39)) {
        return true;
    }

    // WebP: более сложная проверка (RIFF....WEBP)
    if (buffer.length >= 12) {
        const riff = buffer.subarray(0, 4);
        const webp = buffer.subarray(8, 12);
        if (riff.toString() === 'RIFF' && webp.toString() === 'WEBP') {
            return true;
        }
    }

    return false;
}



// Пример использования:
/*
const result = await saveFiles(imageFiles, folderPath, {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    renameFiles: false // Сохраняем оригинальные названия, перезаписываем при конфликте
});

if (result.success) {
    console.log('Файлы сохранены:', result.savedFiles);
} else {
    console.error('Ошибки:', result.errors);
}
*/

export const processMarkdownFile = async (file: File): Promise<string> => {
    if (!file) {
        throw new Error("Archivo no proporcionado");
    }

    // Проверяем, что это MD файл
    if (!file.name.endsWith('.md') && file.type !== 'text/markdown') {
        throw new Error("El archivo debe ser de formato Markdown (.md)");
    }

    try {
        // Читаем содержимое файла как текст
        const content = await file.text();

        // Проверяем, что файл не пустой
        if (!content.trim()) {
            throw new Error("El archivo está vacío");
        }

        return content;
    } catch (error) {
        throw new Error("Error al leer el archivo: " + (error as Error).message);
    }
};

export const createArticleInDb = async (data: CreateArticle) => {
    try {
        const article = await prisma.article.create({
            data: {
                title: data.title,
                subtitle: data.subtitle,
                slug: data.slug,
                content: data.content,
                excerpt: data.excerpt,
                category: data.category,
                imageFolder: data.imageFolder,
                seoTitle: data.seoTitle,
                seoDescription: data.seoDescription,
                isPublished: data.isPublished || false,
                isFeatured: data.isFeatured || false,
                publishedAt: data.isPublished ? new Date() : null,
            },
        });

        return article.id;
    } catch (error) {
        throw new Error("Error al crear el artículo: " + (error as Error).message);
    }
};

export  const resolveUploadsAbsolutePath = async (imageFolder: string): Promise<string> => {
    if (!imageFolder) {
        throw new Error('imageFolder está vacío');
    }

    // убираем ведущие слэши и нормализуем
    const trimmed = imageFolder.replace(/^\/+/, '');
    const normalized = path.posix.normalize(trimmed);

    // должно начинаться с "uploads/"
    if (!normalized.startsWith('uploads/')) {
        throw new Error('imageFolder debe comenzar con "uploads/..."');
    }

    // строим абсолютный путь относительно корня проекта
    // используем path.join с разделителями текущей ОС
    const absolutePath = path.join(process.cwd(), normalized);
    return absolutePath;
};

export const removeFolderByImageFolder = async (imageFolder: string): Promise<boolean> => {
    const absPath = await resolveUploadsAbsolutePath(imageFolder);

    try {
        await fs.rm(absPath, { recursive: true, force: true });
        return true;
    } catch (err) {
        // логируем, но не пробрасываем (главная операция — удаление записи)
        console.error('removeFolderByImageFolder error:', err);
        return false;
    }
};