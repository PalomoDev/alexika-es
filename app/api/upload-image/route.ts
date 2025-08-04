// app/api/update-image/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import {CreateImage} from "@/lib/validations/product/image-validation";
import {createImage} from "@/lib/actions/catalog/image.action";

// Конфигурация для App Router - увеличение лимита размера
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

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
        console.log('🚀 Upload started');

        const formData = await request.formData();
        const file = formData.get('file') as File;
        const prefix = formData.get('prefix') as string;

        console.log('📄 File info:', {
            name: file?.name,
            size: file?.size,
            type: file?.type,
            prefix
        });

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        // Проверяем размер файла (10MB максимум)
        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json(
                { error: 'File too large. Maximum size is 10MB.' },
                { status: 413 }
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

        console.log('📝 Generated filename:', fileName);

        // Конвертируем файл в буфер
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        console.log('💾 Buffer created, size:', buffer.length);

        // ИСПРАВЛЕННЫЙ путь для сохранения в uploads (БЕЗ дублирования app)
        const uploadDir = join(process.cwd(), 'uploads');
        const filePath = join(uploadDir, fileName);

        console.log('📁 Paths:', {
            uploadDir,
            filePath,
            workingDirectory: process.cwd()
        });

        console.log('📂 Directory exists:', existsSync(uploadDir));

        // Создаем папку если её нет
        if (!existsSync(uploadDir)) {
            console.log('📁 Creating update directory...');
            await mkdir(uploadDir, { recursive: true });
            console.log('✅ Upload directory created');
        }

        console.log('💾 Starting file write...');

        // Сохраняем файл
        await writeFile(filePath, buffer);

        console.log('✅ File saved successfully to:', filePath);
        console.log('✅ File exists check:', existsSync(filePath));

        // URL для доступа к файлу
        const fileUrl = `/uploads/${fileName}`;

        console.log('🔗 File URL:', fileUrl);

        const createImageData: CreateImage = {
            url: fileUrl,
            filename: fileName,
            alt: '',
            sortOrder: 0,
        }

        console.log('💾 Saving to database...');
        const createResponse = await createImage(createImageData);
        console.log('createResponse API', createResponse);

        if (createResponse.success) {
            console.log('🎉 Upload completed successfully');
            return NextResponse.json({
                data: createResponse.data
            });
        } else {
            console.error('❌ Database error:', createResponse.message);
            return NextResponse.json(
                { error: createResponse.message || 'Failed to save image to database' },
                { status: 500 }
            );
        }

    } catch (error) {
        console.error('❌ Upload error:', error);
        return NextResponse.json(
            { error: 'Failed to update file' },
            { status: 500 }
        );
    }
}