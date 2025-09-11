import Image from "next/image";
import {getAllArticles} from "@/lib/actions/articles/article-actions";
import {ArticleListItem} from "@/lib/validations/articles/article-validation";
import { ArticlesCategories } from '@/db/data'

const AlexikaPage = async () => {
    const articlesResponse = await getAllArticles();
    if (!articlesResponse.success) return null;
    console.log(articlesResponse.data)

    return (
        <div>
            <div className={`w-full h-full pt-8 pl-2`}>
                <h1 className={'font-light tracking-wider  uppercase text-3xl text-gray-700'}>Alexika Traveler Club</h1>
            </div>
            <div className={'main-wrapper flex flex-col mt-8 px-0 bg-white'}>
                <div className="w-full flex">
                    <div className={'w-1/5 border-r border-gray-200 pl-12 pt-8'}>
                        <h3 className={'font-bold tracking-wide uppercase text-base text-gray-700'}>
                            Category
                        </h3>
                        <div className={'flex flex-col text-sm pt-6 uppercase gap-2'}>
                            {ArticlesCategories.map((category, index) =>
                                <div key={index}>
                                    {category}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className={' mx-auto pt-8 '}>


                        <div id="guia">
                            <ArticleList articles={articlesResponse.data || []}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AlexikaPage;

// Исправленный компонент ArticleList
type ArticleListProps = {
    articles: ArticleListItem[]
}

const ArticleList = ({ articles }: ArticleListProps) => {
    return (
        <div className="grid grid-cols-4 gap-6">
            {articles.map((article) => {
                const urlImage = `${article.imageFolder}/imageCover.jpg`
                return (
                    <div key={article.id} className={'w-[250px]'}>
                        <div className={'relative aspect-[4/3] w-full bg-gray-100'}>
                            <Image
                                src={urlImage}
                                alt={article.title}
                                fill
                                className="object-cover"
                            />
                            <span className={'absolute top-1/2 -translate-y-1/2 h-full text-sm uppercase text-center font-bold left-0 w-full p-2 text-white bg-black/20 flex items-center justify-center'}>
                                {article.title}.
                            </span>
                        </div>
                        <p className={'w-full mt-2 text-sm font-light text-gray-800 capitalize'}>
                            {article.subtitle}
                        </p>
                    </div>
                )
            })}
        </div>
    )
}