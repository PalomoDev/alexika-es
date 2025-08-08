
import ProductFeatures from "@/components/shared/products/ProductFeatures";
import {singularizeCategoryName} from "@/lib/utils/singular";
import {ProductClient} from "@/lib/validations/product/client";
import {cn} from "@/lib/utils";
import { BaseInfoDisplay } from "@/components/shared/products/ProductInformation/weight";
import TempGrade from "@/components/shared/products/ProductInformation/TempGrade";
import CartButton from "@/components/shared/products/CartButton";
import PriceBlock from "@/components/shared/products/PriceBlock";
import ProductDescription from "@/components/shared/products/ProductDescription";

type ProductInformationProps = {
    product: ProductClient;
    className?: string;

};

const ProductInformation = ({product, className,}: ProductInformationProps) => {

    const acivity = product.specificationValues?.find(sv => sv.specification?.key === 'actividades')?.value || ''



    return (
        <div className={cn("flex flex-col items-start justify-between", className)}>
            {/* Заголовок и навигация */}
            <div className={'w-full flex flex-col gap-3 items-start'}>
                <p className="text-gray-600">
                    <span className="font-medium">{product.brand?.name}</span>
                </p>
                <div>
                    <h2 className="text-3xl uppercase font-black text-gray-900 mb-2">
                        {product.name}
                    </h2>
                    <h1>
                        {singularizeCategoryName(product.category?.name || '')} para {acivity}
                    </h1>
                </div>



                {product.category?.slug === 'sacos-de-dormir' && <TempGrade/>}



                <BaseInfoDisplay product={product}/>

                <ProductDescription product={product} className={'my-2'}/>

                {/* Цена */}
                <PriceBlock product={product}/>

            </div>









            {/* Особенности */}
            <ProductFeatures data={product.features || []}/>

            {/* Кнопки действий */}
            <CartButton product={product}/>
        </div>
    )
}

export default ProductInformation