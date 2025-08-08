"use client";

import Image from "next/image";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";
import { ProductClient } from "@/lib/validations/product/client";

type ProductGalleryProps = {
    product: ProductClient;
};

export default function ProductImageGallery({ product }: ProductGalleryProps) {
    const images = product.images ?? [];
    if (images.length === 0) {
        return (
            <div className="aspect-square flex items-center justify-center rounded-lg bg-gray-100 text-gray-400">
                Sin imagen
            </div>
        );
    }

    const firstFour = images.slice(0, 4);
    const rest = images.slice(4);
    const restCount = rest.length;

    // Создаем массив из 4 элементов для фиксированной высоты
    const gridItems = Array.from({ length: 4 }, (_, index) => firstFour[index] || null);

    return (
        <div className="space-y-4">
            {/* Сетка 2x2 для первых 4 фото с фиксированной высотой */}
            <div
                className="grid grid-cols-2 gap-2 h-auto"
                role="list"
                aria-label="Галерея изображений товара"
            >
                {gridItems.map((img, index) => (
                    <div
                        key={img?.id || `placeholder-${index}`}
                        className="relative aspect-square overflow-hidden rounded-lg bg-gray-100"
                        role="listitem"
                    >
                        {img ? (
                            <Image
                                src={img.url}
                                alt={img.alt ?? product.name}
                                fill
                                className="object-contain bg-white"
                                sizes="50vw"
                                priority
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-50 border-2 border-dashed border-gray-200" />
                        )}
                    </div>
                ))}
            </div>

            {/* Остальные фото в той же сетке 2x2 через аккордеон */}
            {restCount > 0 && (
                <Accordion type="single" collapsible>
                    <AccordionItem value="more-images">
                        <AccordionTrigger
                            className="text-sm text-center text-brand-hover flex items-center justify-center rounded-lg cursor-pointer [&>svg]:hidden hover:no-underline"
                            aria-label={`Ver más imágenes (${restCount})`}
                        >
                            Ver más
                        </AccordionTrigger>
                        <AccordionContent>
                            <div
                                className="mt-2 grid grid-cols-2 gap-2"
                                role="list"
                                aria-label="Дополнительные изображения товара"
                            >
                                {rest.map((img) => (
                                    <div
                                        key={img.id}
                                        className="relative aspect-square overflow-hidden rounded-lg bg-gray-100"
                                        role="listitem"
                                    >
                                        <Image
                                            src={img.url}
                                            alt={img.alt ?? product.name}
                                            fill
                                            className="object-contain bg-white"
                                            sizes="50vw"
                                        />
                                    </div>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            )}
        </div>
    );
}