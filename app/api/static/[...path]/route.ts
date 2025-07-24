// app/api/static/[...path]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    try {
        // Ждем params так как это Promise в новых версиях Next.js
        const resolvedParams = await params;

        // ИСПРАВЛЕННЫЙ путь для чтения из uploads (БЕЗ дублирования app)
        const filePath = join(process.cwd(), 'uploads', ...resolvedParams.path);

        console.log('📁 Static file request:', {
            requestedPath: resolvedParams.path,
            fullPath: filePath,
            exists: existsSync(filePath)
        });

        // Проверяем существование файла
        if (!existsSync(filePath)) {
            console.log('❌ File not found:', filePath);
            return new NextResponse('File not found', { status: 404 });
        }

        // Читаем файл
        const fileBuffer = await readFile(filePath);

        // Определяем MIME тип по расширению
        const fileName = resolvedParams.path[resolvedParams.path.length - 1];
        const ext = fileName.split('.').pop()?.toLowerCase();
        let contentType = 'application/octet-stream';

        switch (ext) {
            case 'jpg':
            case 'jpeg':
                contentType = 'image/jpeg';
                break;
            case 'png':
                contentType = 'image/png';
                break;
            case 'webp':
                contentType = 'image/webp';
                break;
            case 'gif':
                contentType = 'image/gif';
                break;
            case 'svg':
                contentType = 'image/svg+xml';
                break;
        }

        console.log('✅ Serving file:', fileName, 'as', contentType);

        // Возвращаем файл с правильными заголовками
        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });

    } catch (error) {
        console.error('❌ Static file error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}