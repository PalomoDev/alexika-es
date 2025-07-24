'use client';

import React, { useState, useRef } from 'react';
import { X, Upload, Image as ImageIcon, Edit3, Check, Save } from 'lucide-react';
import { CreatedImageResponse } from '@/lib/validations/product/image-validation';
import { updateImage, softDeleteImage } from '@/lib/actions/catalog/image.action';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import Image from "next/image";


interface ImageUploaderProps {
    maxImages: number;
    prefix: string;
    onChange: (imageIds: string[]) => void;
    initialImages?: CreatedImageResponse[];
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
                                                         maxImages,
                                                         prefix,
                                                         onChange,
                                                         initialImages = []
                                                     }) => {
    const [images, setImages] = useState<CreatedImageResponse[]>(initialImages);
    const [isUploading, setIsUploading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingAlt, setEditingAlt] = useState('');
    const [editingSortOrder, setEditingSortOrder] = useState<string>('');
    const [originalAlt, setOriginalAlt] = useState('');
    const [originalSortOrder, setOriginalSortOrder] = useState<number>(0);
    const [savingId, setSavingId] = useState<string | null>(null);
    const [savedId, setSavedId] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const updateParent = (updatedImages: CreatedImageResponse[]) => {
        const activeImageIds = updatedImages
            .filter(img => !img.isDeleted)
            .map(img => img.id);
        onChange(activeImageIds);
    };

    const handleFileUpload = async (file: File) => {
        if (images.length >= maxImages) {
            alert(`Максимум ${maxImages} изображений`);
            return;
        }

        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('prefix', prefix);

            const response = await fetch('/api/upload-image', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Upload failed');
            }

            const result = await response.json();

            if (result.data) {
                const newImages = [...images, result.data];
                setImages(newImages);
                updateParent(newImages);
            }

        } catch (error) {
            console.error('Upload error:', error);
            alert('Ошибка загрузки файла');
        } finally {
            setIsUploading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileUpload(file);
        }
        // Сбрасываем value чтобы можно было загружать тот же файл повторно
        e.target.value = '';
    };

    const handleRemoveImage = async (id: string) => {
        try {
            const result = await softDeleteImage({ id });

            if (result.success) {
                // Помечаем изображение как удаленное в локальном состоянии
                const updatedImages = images.map(img =>
                    img.id === id ? { ...img, isDeleted: true } : img
                );
                setImages(updatedImages);
                updateParent(updatedImages);
            } else {
                alert(`Ошибка удаления: ${result.message}`);
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert('Ошибка при удалении изображения');
        }
    };

    const handleStartEdit = (id: string, currentAlt: string | null, currentSortOrder: number) => {
        setEditingId(id);
        setEditingAlt(currentAlt || '');
        setEditingSortOrder(currentSortOrder.toString());
        setOriginalAlt(currentAlt || '');
        setOriginalSortOrder(currentSortOrder);
        // Убираем индикатор сохранения при начале редактирования
        setSavedId(null);
    };

    const hasChanges = (id: string) => {
        if (editingId !== id) return false;
        return editingAlt !== originalAlt || parseInt(editingSortOrder) !== originalSortOrder;
    };

    const handleSaveEdit = async () => {
        if (!editingId) return;

        const sortOrderNum = parseInt(editingSortOrder) || 0;

        // Проверяем есть ли изменения
        if (!hasChanges(editingId)) {
            handleCancelEdit();
            return;
        }

        setSavingId(editingId);

        try {
            const result = await updateImage({
                id: editingId,
                alt: editingAlt || null,
                sortOrder: sortOrderNum
            });

            if (result.success) {
                // Обновляем локальное состояние
                const updatedImages = images.map(img =>
                    img.id === editingId ? {
                        ...img,
                        alt: editingAlt || null,
                        sortOrder: sortOrderNum
                    } : img
                );
                setImages(updatedImages);
                updateParent(updatedImages);

                // Показываем индикатор успешного сохранения
                setSavedId(editingId);
                setTimeout(() => setSavedId(null), 2000); // Убираем через 2 секунды

                // Выходим из режима редактирования
                setEditingId(null);
                setEditingAlt('');
                setEditingSortOrder('');
            } else {
                alert(`Ошибка сохранения: ${result.message}`);
            }
        } catch (error) {
            console.error('Save error:', error);
            alert('Ошибка при сохранении изменений');
        } finally {
            setSavingId(null);
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditingAlt('');
        setEditingSortOrder('');
        setOriginalAlt('');
        setOriginalSortOrder(0);
    };

    const canAddMore = images.filter(img => !img.isDeleted).length < maxImages;
    const activeImages = images.filter(img => !img.isDeleted);

    return (
        <div className="space-y-6">
            {/* Images Table */}
            <div className="bg-white border rounded-lg overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b">
                    <h4 className="font-medium text-gray-900">
                        Изображения ({activeImages.length}/{maxImages})
                    </h4>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-center w-1/4">Превью</TableHead>
                            <TableHead className="text-center w-1/4">Alt текст</TableHead>
                            <TableHead className="text-center w-1/6">Порядок</TableHead>
                            <TableHead className="text-center w-1/6">Действия</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {activeImages.length > 0 ? (
                            activeImages.map(( image ) => (
                                <TableRow key={image.id}>
                                    <TableCell className="text-center">
                                        <div className="flex justify-center">
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <button
                                                        type="button"
                                                        className="w-16 h-16 border rounded-lg overflow-hidden bg-gray-100 hover:opacity-75 transition-opacity cursor-pointer"
                                                    >
                                                        <Image
                                                            src={image.url}
                                                            alt={image.alt || 'Preview'}
                                                            width={64}
                                                            height={64}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </button>
                                                </PopoverTrigger>
                                                <PopoverContent
                                                    className="w-auto max-w-2xl p-0 border-0 shadow-2xl"
                                                    align="center"
                                                    side="top"
                                                >
                                                    <Image
                                                        src={image.url}
                                                        alt={image.alt || 'Full size'}
                                                        width={800}
                                                        height={600}
                                                        className="max-w-full max-h-96 object-contain rounded-lg"
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {editingId === image.id ? (
                                            <input
                                                type="text"
                                                value={editingAlt}
                                                onChange={(e) => setEditingAlt(e.target.value)}
                                                placeholder="Опишите изображение..."
                                                className="w-full max-w-xs px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                disabled={savingId === image.id}
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center gap-2">
                                                <span className="text-sm text-gray-600 max-w-xs truncate">
                                                    {image.alt || 'Не указано'}
                                                </span>
                                                {savedId === image.id ? (
                                                    <div className="text-green-600 p-1" title="Сохранено">
                                                        <Check className="h-3 w-3" />
                                                    </div>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleStartEdit(image.id, image.alt, image.sortOrder)}
                                                        className="text-gray-400 hover:text-gray-600 p-1"
                                                        disabled={savingId === image.id}
                                                    >
                                                        <Edit3 className="h-3 w-3" />
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {editingId === image.id ? (
                                            <input
                                                type="number"
                                                value={editingSortOrder}
                                                onChange={(e) => setEditingSortOrder(e.target.value)}
                                                className="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                min="0"
                                                disabled={savingId === image.id}
                                            />
                                        ) : (
                                            <span className="text-sm text-gray-600">
                                                {image.sortOrder}
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            {editingId === image.id ? (
                                                <>
                                                    <button
                                                        type="button"
                                                        onClick={handleSaveEdit}
                                                        disabled={savingId === image.id || !hasChanges(image.id)}
                                                        className={`p-1 ${
                                                            hasChanges(image.id) && savingId !== image.id
                                                                ? 'text-blue-600 hover:text-blue-700'
                                                                : 'text-gray-400'
                                                        }`}
                                                        title="Сохранить"
                                                    >
                                                        {savingId === image.id ? (
                                                            <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full" />
                                                        ) : (
                                                            <Save className="h-4 w-4" />
                                                        )}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={handleCancelEdit}
                                                        disabled={savingId === image.id}
                                                        className="text-gray-400 hover:text-gray-600 p-1"
                                                        title="Отменить"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveImage(image.id)}
                                                    className="text-red-500 hover:text-red-700 p-1"
                                                    title="Удалить изображение"
                                                    disabled={savingId === image.id}
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8">
                                    <div className="flex flex-col items-center gap-2">
                                        <ImageIcon className="h-8 w-8 text-gray-300" />
                                        <p className="text-sm text-gray-500">
                                            Изображения не загружены
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            Ожидается {maxImages} {maxImages === 1 ? 'изображение' : maxImages < 5 ? 'изображения' : 'изображений'}
                                        </p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Upload Button */}
            {canAddMore && (
                <div className="flex justify-center">
                    <div className="space-y-4">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Upload className="h-4 w-4" />
                            {isUploading ? 'Загрузка...' : 'Загрузить изображение'}
                        </button>

                        <p className="text-xs text-gray-500 text-center">
                            PNG, JPG, WebP до 10MB ({activeImages.length}/{maxImages})
                        </p>

                        {isUploading && (
                            <div className="flex justify-center">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                            </div>
                        )}
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </div>
            )}

            {/* Max images reached message */}
            {!canAddMore && (
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                        Достигнуто максимальное количество изображений ({activeImages.length}/{maxImages})
                    </p>
                </div>
            )}
        </div>
    );
};

export default ImageUploader;