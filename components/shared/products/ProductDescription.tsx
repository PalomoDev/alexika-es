import {ProductClient} from "@/lib/validations/product/client";
import {cn} from "@/lib/utils";

interface BaseInfoDisplayProps {
    product: ProductClient;
    className?: string;
}

export const ProductDescription = ({product, className,}: BaseInfoDisplayProps) => {
    const words = product.description?.split(' ') || [];
    const firstFiveWords = words.slice(0, 5).join(' ');
    const remainingWords = words.slice(5, 50).join(' ');
    const hasMoreContent = words.length > 50;

    return (
        <div className={cn("w-full ", className)}>
            <p className={cn("w-full leading-relaxed", className)}>
                <span className="font-bold uppercase">{firstFiveWords}</span>
                {remainingWords && <span> {remainingWords}</span>}
                {hasMoreContent && (
                    <a
                    href="#description"
                    className="text-sm pl-2 text-brand-hover"
                    >
                    Ver más...
                    </a>
                    )}
            </p>
        </div>
    );
};

export default ProductDescription;