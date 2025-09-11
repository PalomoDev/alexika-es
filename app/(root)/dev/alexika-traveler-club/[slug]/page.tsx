import Breadcrumbs, {BreadcrumbItem} from "@/components/ui/breadcrumps";
import {getArticleBySlug} from "@/lib/actions/articles/article-actions";
import {notFound} from "next/navigation";
import {parseArticleContent} from "@/lib/utils/articleParser";
import {ArticleFromDB} from "@/lib/validations/articles/article-validation";
import {ROUTES} from "@/lib/constants/routes";
import Image from "next/image";
import {makeSlug} from "@/lib/utils/make-slug";

interface ArticlePageProps {
    params: Promise<{
        slug: string;
    }>;
}

const ArticlePage = async ({ params }: ArticlePageProps) => {
    const { slug } = await params;
    const articleResponse = await getArticleBySlug(slug);
    console.log('pege response - article success is - ' + articleResponse.success);
    if (!articleResponse.success) notFound();
    const article = articleResponse.data;
    const parsedArticle = parseArticleContent({
        contentRAW: article?.content || '',
    })
    console.log('parsedArticle', parsedArticle);
    const breadcrumbs = createBreadcrumbs(article)


    return (
        <div>
            <div className={`w-full pt-8 `}>
                <Breadcrumbs items={breadcrumbs} className={`pl-1`}/>
            </div>
            <div className={'main-wrapper flex flex-col mt-8 px-0 bg-white'}>
                <article className="article-wrapper w-full md:max-w-[1480px] mx-auto  flex-1 pb-12">
                    <div className={`article-header-container w-full flex justify-start items-center text-white  font-extrabold uppercase bg-brand-hover`}>
                        <div className={`flex flex-col justify-center items-start pt-24 pb-16 pr-12 pl-48 `}>
                            <h1 className={`text-6xl pb-2`}>{article?.title}</h1>
                            {article?.subtitle && (
                                <h2 className={`text-2xl font-light`}>{article?.subtitle}</h2>
                            )}
                        </div>
                    </div>

                    {parsedArticle?.heroImage && (
                        <div className={`w-full `}>
                            <Image
                                src={`${article?.imageFolder}/${parsedArticle.heroImage.filename}`}
                                alt={parsedArticle.heroImage.alt}
                                width={1480}
                                height={720}
                            />
                        </div>
                    )}

                    <div className={`article-content-container w-full px-48 flex flex-col justify-start gap-6 items-start  pt-12 pb-16`}>
                    {parsedArticle?.intro && (
                        <div className={`w-full flex flex-col gap-4 mb-4`}>
                            <p className={`text-lg font-mono`}>
                                {parsedArticle.intro}
                            </p>
                        </div>
                    )}
                        {parsedArticle?.sections.map((section, index) => (
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
                                            src={`${article?.imageFolder}/${image.filename}`}
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
                    </div>

                </article>
            </div>
        </div>
    )
}

export default ArticlePage;


function createBreadcrumbs(article: ArticleFromDB | null | undefined): BreadcrumbItem[] {
    if (!article || !article.category || !article.title) return [];

    const breadcrumbs: BreadcrumbItem[] = [
        {
            label: 'ALEXIKA TRAVELER CLUB',
            href: `${ROUTES.PAGES.ARTICLES}/`
        },
        {
            label: article.category,
            href: `${ROUTES.PAGES.ARTICLES}/#${makeSlug(article.category)}`
        },
        {
            label: article.title
        }
    ];

    return breadcrumbs;
}