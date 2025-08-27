// @flow
import * as React from 'react';
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import Link from "next/link";
import {ArticlesTitle} from "@/db/articles-home";
import {cn} from "@/lib/utils";
import Image from "next/image";
import {ROUTES} from "@/lib/constants/routes";




type Props = {
    data: ArticlesTitle[];
    className?: string;
};
export const HomeArticlesBlock = ({data, className}: Props) => {
    return (
        <div className={cn("flex flex-col gap-6", className)}>
            <div className={'flex flex-col gap-2'}>
                <h2 className={'text-3xl uppercase font-extrabold pl-1'}>Alexika Traveler Club</h2>
                <h4 className={'text-gray-600 pl-1.5 text-base  w-4/5'}>
                    Estamos buscando trotamundos que quieran compartir sus historias con nosotros. Para que tu viaje sea seguro y cómodo, lo abordaremos de manera individual, teniendo en cuenta tus deseos y necesidades. El equipo desempeña un papel clave durante la travesía y debe cumplir sus funciones sin inconvenientes.
                </h4>
            </div>
            <div className={"w-full grid grid-cols-1 md:grid-cols-2 gap-6"} >
                {data.map(article => {
                    return (
                        <Link href={`${ROUTES.PAGES.ARTICLES}/${article.slug}`} key={article.slug}>
                            <ArticleCard {...article} />
                        </Link>
                    )
                })}
            </div>
        </div>

    );
};

function ArticleCard(article: ArticlesTitle) {
    return (
        <Card className="w-full p-0 rounded-none shadow-none border-none aspect-square relative overflow-hidden">
            {/* Фоновое изображение */}
            <Image
                src={article.image || '/placeholder-article.jpg'}
                alt={article.title}
                fill
                className="object-cover absolute inset-0 z-0"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Темный оверлей для читаемости текста */}


            {/* Контент поверх изображения */}
            <div className="relative z-20 h-full text-white">
                <CardHeader className="absolute bottom-0 w-full h-1/5 bg-brand p-4 pl-6 ">
                    <div>
                        <h3 className="font-bold text-2xl uppercase whitespace-pre-line">
                            {article.title}
                        </h3>
                        {article.subtitle && (
                            <p className="text-base opacity-90">{article.subtitle}</p>
                        )}
                    </div>
                </CardHeader>
            </div>
        </Card>
    )
}