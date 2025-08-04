'use client';

import {
    Carousel,
    CarouselContent,
    CarouselItem
} from '@/components/ui/carousel';

import Autoplay from 'embla-carousel-autoplay';
import Link from 'next/link';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { type CarouselApi } from '@/components/ui/carousel';

type Banner = {
    src: string;
    slug: string;
    label: string;
    id: string;
    name: string;
}

interface CarouselProps {
    data: Banner[]
}

const ProductCarousel = ({ data }: CarouselProps) => {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (!api) return;

        setCurrent(api.selectedScrollSnap());

        api.on('select', () => {
            setCurrent(api.selectedScrollSnap());
        });
    }, [api]);

    const handleDotClick = useCallback((index: number) => {
        if (api) {
            api.scrollTo(index);
        }
    }, [api]);

    return (
        <Carousel
            setApi={setApi}
            className='w-full [&_*]:cursor-grab [&_*:active]:cursor-grabbing'
            opts={{
                loop: true,
            }}
            plugins={[
                Autoplay({
                    delay: 8000,
                    stopOnInteraction: true,
                    stopOnMouseEnter: true,
                }),
            ]}
        >
            <CarouselContent className="cursor-grab active:cursor-grabbing">
                {data.map((banner: Banner) => (
                    <CarouselItem key={banner.id}>
                        <Link href={`/product/${banner.slug}`}>
                            <div className='relative mx-auto'>
                                <Image
                                    src={banner.src!}
                                    alt={banner.label}
                                    height='0'
                                    width='0'
                                    sizes='100vw'
                                    className='w-full h-auto'
                                />
                                <div className='absolute inset-0 flex items-end justify-center pb-1'>
                                    <div className='bg-gray-900/0 px-4 py-2 flex flex-col items-center pb-4 gap-2 rounded-4xl'>
                                        <h2 className='text-2xl font-bold text-white'>
                                            {banner.name}
                                        </h2>
                                        {/* Точки-индикаторы */}
                                        <div className="flex gap-2">
                                            {data.map((_, index) => (
                                                <button
                                                    key={index}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleDotClick(index);
                                                    }}
                                                    className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                                                        index === current
                                                            ? 'bg-white'
                                                            : 'bg-white/50 hover:bg-white/70'
                                                    }`}
                                                    aria-label={`Go to slide ${index + 1}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </CarouselItem>
                ))}
            </CarouselContent>
        </Carousel>
    );
};

export default ProductCarousel;