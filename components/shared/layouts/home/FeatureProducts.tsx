import * as React from 'react';
import Image from "next/image";
import {FeaturedProductCard} from "@/lib/actions/product/feature-products.action";
import {cn} from "@/lib/utils";
import Link from 'next/link';
import {ROUTES} from "@/lib/constants/routes";
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card";
import {ArrowRight, ChevronRight} from "lucide-react";

type Props = {
    data: FeaturedProductCard[]
    className?: string;
};

export const FeatureProducts = ({ data, className }: Props) => {


    return (
        <div className={cn('w-full flex flex-col gap-6', className)}>
            <h2 className={'text-3xl uppercase font-extrabold pl-1'}>Los más vendidos</h2>
            <div className={'w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'}>

                {data.map(product => {
                    return (
                        <div key={product.id}>
                            <FeatureProductCard
                                name={product.name}
                                slug={product.slug}
                                src={product.images[0]?.url || '/placeholder-image.jpg'}
                                alt={product.name}
                                description={product.description}
                                formattedPrice={product.formattedPrice}
                            />
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

type FeatureProductCardProps = {
    name: string;
    slug: string;
    src: string;
    alt: string;
    description?: string;
    formattedPrice?: string;
};

const FeatureProductCard = ({ name, slug, src, alt, description, formattedPrice }: FeatureProductCardProps) => {
    const truncatedDescription = description?.split(' ').slice(0, 10).join(' ') + '...';
    return (
        <Link href={`${ROUTES.PAGES.PRODUCT}${slug}`} className="block group">
            <Card className="h-full overflow-hidden  gap-0 p-0 rounded-none shadow-none border-none">
                <CardHeader className=" w-full">
                    <div className="relative w-full aspect-square overflow-hidden ">
                        <Image
                            src={src}
                            alt={alt}
                            fill
                            className="object-contain group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        />
                    </div>
                </CardHeader>

                <CardContent className="p-4 pl-6 flex flex-col justify-between gap-1 ">
                    <h3 className="text-gray-600 font-black uppercase text-sm md:text-base">
                        {name}
                    </h3>
                    <p className="text-gray-500 text-xs md:text-sm  line-clamp-2">
                        {truncatedDescription}
                    </p>
                </CardContent>

                <CardFooter className="p-4 w-full pt-0 pl-6 flex justify-between">
                    <span className="font-bold text-lg text-brand-hover">
                        {formattedPrice}
                    </span>
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-hover text-white group-hover:bg-brand transition-colors duration-300">
                        <ArrowRight className="w-4 h-4" />
                    </div>
                </CardFooter>
            </Card>
        </Link>
    )
}