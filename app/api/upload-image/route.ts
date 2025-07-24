// app/api/upload-image/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import {CreateImage} from "@/lib/validations/product/image-validation";
import {createImage} from "@/lib/actions/catalog/image.action";

// Генератор случайной строки
function generateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const prefix = formData.get('prefix') as string;

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        if (!prefix) {
            return NextResponse.json(
                { error: 'No prefix provided' },
                { status: 400 }
            );
        }

        // Проверяем тип файла
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' },
                { status: 400 }
            );
        }

        // Получаем расширение файла
        const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg';

        // Генерируем имя файла
        const randomString = generateRandomString(6);
        const fileName = `${prefix}_${randomString}.${fileExtension}`;

        // Конвертируем файл в буфер
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // ✅ ИСПРАВЛЕНО: Путь для сохранения в public/uploads (Next.js стандарт)
        const uploadDir = join(process.cwd(), 'uploads');
        const filePath = join(uploadDir, fileName);

        // Создаем папку если её нет
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
        }

        // Сохраняем файл
        await writeFile(filePath, buffer);

        // URL для доступа к файлу (должен совпадать с существующими изображениями)
        const fileUrl = `/uploads/${fileName}`;

        const createImageData: CreateImage = {
            url: fileUrl,
            filename: fileName,
            alt: '',
            sortOrder: 0,
        }

        const createResponse = await createImage(createImageData);
        console.log('createResponse API', createResponse);

        if (createResponse.success) {
            return NextResponse.json({
                data: createResponse.data
            });
        } else {
            // ✅ ИСПРАВЛЕНО: Добавлен return при ошибке
            console.error('Database error:', createResponse.message);
            return NextResponse.json(
                { error: createResponse.message || 'Failed to save image to database' },
                { status: 500 }
            );
        }

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Failed to upload file' },
            { status: 500 }
        );
    }
}