
import Carousel from "@/components/shared/carousel";
import {homeSlides} from "@/db/data";
import {FeatureProducts} from "@/components/shared/layouts/home/FeatureProducts";

import {FeaturedProductCard, getFeaturedProductsForHome} from "@/lib/actions/product/feature-products.action";
import {HomeArticlesBlock} from "@/components/shared/layouts/home/HomeArticlesBlock";
import {ArticlesTitle, articleTitles} from "@/db/articles-home";

async function HomePage() {
    const orden = ['Tiendas de campaña', 'Sacos de dormir', 'Esterillas y colchonetas', 'Accesorios']
    const dataResponse = await getFeaturedProductsForHome();
    const articles: ArticlesTitle[] = articleTitles;
    let featureProducts: FeaturedProductCard[] = [];


    if (dataResponse.data) {
        // Сортируем продукты по порядку категорий
        featureProducts = dataResponse.data.sort((a, b) => {
            const indexA = orden.indexOf(a.category || '');
            const indexB = orden.indexOf(b.category || '');

            // Если категория не найдена в orden, помещаем в конец
            const finalIndexA = indexA === -1 ? orden.length : indexA;
            const finalIndexB = indexB === -1 ? orden.length : indexB;

            return finalIndexA - finalIndexB;
        });
    }


    return (
        <div className="pt-12">
            <Carousel data={homeSlides}/>
            <FeatureProducts data={featureProducts} className={'mt-12'}/>
            <HomeArticlesBlock data={articles} className={'mt-12'}/>
        </div>
    )
}

export default HomePage;