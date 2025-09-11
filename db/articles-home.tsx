export type ArticlesTitle = {
    title: string;
    slug: string;
    image: string;
    altImage: string;
    subtitle: string;
    description?: string;

}


export const articleTitles: ArticlesTitle[] = [
    {
        title: 'Cómo elegir la tienda de campaña ideal\npara tus aventuras',
        slug: 'como-elegir-la-tienda-de-campana-ideal-para-tus-aventuras',
        image: '/articles-home/elegir-tienda/coverHome.png',
        altImage: 'elegir tienda',
        subtitle: 'Guía práctica con consejos clave para seleccionar tu tienda de campaña',

    },
    {
        title: ' Cómo elegir el saco de dormir perfecto para camping y montaña',
        slug: 'como-elegir-el-saco-de-dormir-perfecto-para-camping-y-montana',
        image: '/articles-home/elegir-saca/coverHome.png',
        altImage: 'elegir sacs-de-dormir',
        subtitle: 'Aprende a escoger el saco adecuado según clima, peso y comodidad',

    },
    {
        title: 'Cómo no perderse en el bosque',
        slug: 'como-no-perderse-en-el-bosque',
        image: '/articles/coverHome.png',
        altImage: 'Foto de Jamie Street en Unsplash',
        subtitle: 'Reglas de seguridad para excursionistas',

    },
    {
        title: 'Guía rápida del excursionista: consejos esenciales para un trekking exitoso',
        slug: 'guia-rapida-del-excursionista-consejos-esenciales-para-un-trekking-exitoso',
        image: '/articles-home/guia-rapid/coverHome.png',
        altImage: 'Foto de Anders Nielsen en Unsplash',
        subtitle: 'Descubre recomendaciones prácticas para planificar rutas seguras y cómodas',

    }
]