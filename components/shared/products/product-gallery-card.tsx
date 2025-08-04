'use client'
import {Product} from "@/lib/validations/product/product-client-validation";
import Image from "next/image";

interface ProductGalleryCardProps {
    product: Product;
}
const ProductGalleryCard = ({product}: ProductGalleryCardProps) => {

    return (
        <div className={'product-gallery-card'}>

            <div className={'relative product-gallery-card-image w-full aspect-[3/4]'}>
                <Image
                    src={product.image}
                    alt={product.name}
                    objectFit="cover"
                    objectPosition="center"
                    priority={true}
                    blurDataURL={product.image}
                    placeholder="blur"

                    quality={100}
                    className={'product-gallery-card-image-image'}
                    fill
                />

            </div>
            <div className={'product-gallery-card-info flex items-start justify-between w-full h-full pt-4 pb-0 px-4'}>
                <span className={'uppercase font-bold text-sm'}>{product.name}</span>
                <span className={'uppercase font-bold '}>{product.price} €</span>

            </div>
            <div className={'flex w-full pb-4 px-4 justify-start'}>
                <span className={'w-2/3  font-light text-sm pb-4'}>{product.description}</span>
            </div>
        </div>
    )
}

export default ProductGalleryCard