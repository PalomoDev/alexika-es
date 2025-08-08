import { Weight, Ruler, CloudSun } from "lucide-react";
import { cn } from "@/lib/utils";
import {ProductClient} from "@/lib/validations/product/client";



interface BaseInfoDisplayProps {
    product: ProductClient;
    className?: string;
}

const getSpecIcon = (index: number) => {
    const icons = [Weight, Ruler, CloudSun];
    return icons[index] || Weight;
};

const getSpecLabel = (index: number) => {
    const labels = ["Peso", "Tamaño", "Temporada"];
    return labels[index] || "Especificación";
};

export const BaseInfoDisplay = ({product, className,}: BaseInfoDisplayProps) => {
    const weight = product.specificationValues?.find(sv => sv.specification?.key === 'weight')?.value || 0;
    const size = product.specificationValues?.find(sv => sv.specification?.key === 'size')?.value || 0;
    const temporada = product.specificationValues?.find(sv => sv.specification?.key === 'temporada')?.value || '';

    const specifications = [
        { value: weight, unit: 'kg' },
        { value: size, unit: 'cm' },
        { value: temporada, unit: '' }
    ];

    return (
        <div className={cn("w-full ", className)}>
            {specifications.map((spec, index) => {
                const Icon = getSpecIcon(index);
                const label = getSpecLabel(index);
                const isEven = index % 2 === 0;

                return (
                    <div
                        key={index}
                        className={cn(
                            "flex items-center justify-between gap-1 border py-1 px-2 pr-6",
                            isEven ? "bg-gray-200" : "bg-white"
                        )}
                    >
                        <div className="flex items-center gap-2" aria-hidden="true">
                            <Icon className="w-5 h-5 text-gray-600" aria-hidden="true" />
                            <span className="text-sm text-gray-900 font-light">{label}</span>
                        </div>
                        <span className="text-base font-semibold font-mono">
                           {spec.value} {spec.unit}
                       </span>
                    </div>
                );
            })}
        </div>
    );
};