import {FeatureInput, getFeaturesWithImages} from "@/lib/actions/image.action";
import Image from "next/image";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export default async function ProductFeatures({data}: {data: FeatureInput[]}) {
    const result = await getFeaturesWithImages(data || []);

    if (!result.success || !result.data) {
        return (
            <div className="text-gray-500 text-sm">
                Особенности товара недоступны
            </div>
        );
    }

    const featuredImages = result.data;

    if (featuredImages.length === 0) {
        return null;
    }

    return (
        <div className="">
            <TooltipProvider>
                <div className="grid grid-cols-5 gap-4">
                    {featuredImages.map((feature) => (
                        <Tooltip key={feature.id}>
                            <TooltipTrigger asChild>
                                <div className="flex flex-col items-center text-center  cursor-pointer">
                                    {feature.imageUrl ? (
                                        <div className="w-16 h-16 relative border border-gray-800">
                                            <Image
                                                src={feature.imageUrl}
                                                alt={feature.imageAlt || feature.name}
                                                fill
                                                className="object-contain"
                                                sizes="64px"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-16 h-16 bg-red-400 rounded-lg flex items-center justify-center">
                                            <span className="text-gray-400 text-xs">Нет изображения</span>
                                        </div>
                                    )}
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{feature.name}</p>
                                <p>{feature.imageAlt}</p>
                            </TooltipContent>
                        </Tooltip>
                    ))}
                </div>
            </TooltipProvider>
        </div>
    );
}