import Image from "next/image";
import Breadcrumbs, {BreadcrumbItem} from "@/components/ui/breadcrumps";
import {ROUTES} from "@/lib/constants/routes";
import { parseArticleContent } from "@/lib/utils/articleParser";
import { mockArticles } from "@/db/article";
import { Badge } from "@/components/ui/badge";


interface ArticlePageProps {
    params: Promise<{
        slug: string[];
    }>;
}

const ArticlePage = async ({params}: ArticlePageProps) => {
    const {slug} = await params;
    const mockArticle = mockArticles.find(article => article.slug === slug[0]) || mockArticles[0];

    // Парсим статью из мокки
    const parsedArticle = parseArticleContent(mockArticle);

    const breadcrumbs: BreadcrumbItem[] = [
        { label: 'ARTICULOS', href: `${ROUTES.BASE_URL}/articles` },
        { label: parsedArticle.breadcrumbs?.category || 'CONSEJOS', href: `${ROUTES.BASE_URL}/articles/consejos` },
        { label: parsedArticle.title, href: `${ROUTES.BASE_URL}/articles/consejos/${slug}` },
    ];

    return (
        <div>
            <div className={`w-full pt-8 `}>
                <Breadcrumbs items={breadcrumbs} className={`pl-1`}/>
            </div>
            <div className="main-wrapper flex flex-col mt-8 px-0 bg-white">

                <article className="article-wrapper w-full md:max-w-[1480px] mx-auto  flex-1 pb-12">
                    <div className={`article-header-container w-full flex justify-start items-center text-white  font-extrabold uppercase bg-brand-hover`}>
                        <div className={`flex flex-col justify-center items-start pt-24 pb-16 pr-12 pl-48 `}>
                            <h1 className={`text-6xl pb-2`}>{parsedArticle.title}</h1>
                            {parsedArticle.subtitle && (
                                <h2 className={`text-2xl font-light`}>{parsedArticle.subtitle}</h2>
                            )}
                        </div>
                    </div>

                    {parsedArticle.heroImage && (
                        <div className={`w-full `}>
                            <Image
                                src={parsedArticle.heroImage.url}
                                alt={parsedArticle.heroImage.alt}
                                width={1480}
                                height={720}
                            />
                        </div>
                    )}

                    <div className={`article-content-container w-full px-48 flex flex-col justify-start gap-6 items-start  pt-12 pb-16`}>

                        {parsedArticle.intro && (
                            <div className={`w-full flex flex-col gap-4 mb-4`}>
                                <p className={`text-lg font-mono`}>
                                    {parsedArticle.intro}
                                </p>
                            </div>
                        )}

                        {parsedArticle.sections.map((section, index) => (
                            <div key={index} className={`w-full flex flex-col gap-4 `}>
                                <h3 className={`font-black uppercase`}>{section.title}</h3>
                                {section.paragraphs.map((paragraph, pIndex) => (
                                    <p key={pIndex} className={`text-lg font-light`}>
                                        {paragraph}
                                    </p>
                                ))}

                                {section.images && section.images.map((image, imgIndex) => (
                                    <div key={imgIndex} className={`w-full aspect-video flex flex-col gap-2 mt-2 mb-4`}>
                                        <Image
                                            src={image.url}
                                            alt={image.alt}
                                            width={1480}
                                            height={720}
                                        />
                                        {image.caption && (
                                            <div
                                                className={`text-sm font-light text-gray-500`}
                                                dangerouslySetInnerHTML={{ __html: image.caption }}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))}

                        {mockArticle.tags && mockArticle.tags.length > 0 && (
                            <div className="mt-4 pt-2 ">

                                <div className="flex flex-wrap gap-2">
                                    {mockArticle.tags.map((tag, index) => (
                                        <Badge
                                            key={index}
                                            variant="secondary"
                                            className="hover:bg-brand-hover hover:text-white cursor-pointer transition-colors"
                                        >
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>


                </article>
            </div>
        </div>
    )
}

export default ArticlePage;