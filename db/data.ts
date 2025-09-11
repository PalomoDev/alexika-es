import {FooterMenuCategory, NavigationMenu} from "@/types/menu.type";

export const navAdminItems = [
    { href: "/admin", label: "Dashboard", exact: true },
    { href: "/admin/products", label: "Productos" },
    { href: "/admin/catalog", label: "Catálogo" },
    { href: "/admin/articles", label: "Artículos" },
    { href: "/admin/order", label: "Pedidos" },
    { href: "/admin/users", label: "Usuarios" },
];


export const oferta  = "Alexika – Comodidad en los detalles."



export const homeSlides = [
    {
        src: '/banners/extrim-banner_ver02.png',
        slug: 'extrim',
        label: 'alexika extrim',
        id: 'rt123r5',
        name: '',
    },
    {
        src: '/banners/trakking-banner.png',
        slug: 'senderismo',
        label: 'Foto de Hayato Shin en Unsplash',
        id: 'rt123r6',
        name: '',
    },
    {
        src: '/banners/camping-banner.png',
        slug: 'camping',
        label: 'Foto de Ivan Shemereko en Unsplash',
        id: 'rt12310',
        name: '',
    },
    {
        src: '/banners/viaje-banner.png',
        slug: 'viaje',
        label: 'alexika viaje',
        id: 'rt123r8',
        name: '',
    },

    {
        src: '/banners/caza-pesca-banner_ver04.png',
        slug: 'caza-y-pesca',
        label: 'Foto de Andreas Rønningen en Unsplash',
        id: 'rt123r9',
        name: '',


    },
]


export const mockNavigationMenu: NavigationMenu = {
    sections: [
        // PRODUCTOS - текстовое меню
        {
            title: "PRODUCTOS",
            displayType: "text-list" as const,
            url: '/products',
            items: [


                {
                    name: "Tiendas de campaña",
                    href: "/tiendas-de-campana?category=tiendas-de-campana",
                    description: "Refugio para todas las aventuras",
                    submenu: [
                        {name: "Tiendas extremas", href: "/products/tiendas-de-campana?category=tiendas-de-campana&subcategory=extremo"},
                        {name: "Tiendas de senderismo", href: "/products/tiendas/3-4personas"},
                        {name: "Tiendas de camping", href: "/products/tiendas/4estaciones"},
                        {name: "Tiendas de aventura", href: "/products/tiendas/ultraligeras"},
                        {name: "Tiendas de caza y pesca", href: "/products/tiendas/ultraligeras"},
                    ]
                },
                {
                    name: "Sacos de dormir",
                    href: "/sacos-de-dormir?category=sacos-de-dormir",
                    description: "Descanso cómodo en la naturaleza",
                    submenu: [
                        {name: "Sacos extremas", href: "/products/sacos/verano"},
                        {name: "Sacos de senderismo", href: "/products/sacos/3estaciones"},
                        {name: "Sacos de camping", href: "/products/sacos/invierno"},
                        {name: "Sacos de aventura", href: "/products/sacos/invierno"},
                        {name: "Sacos de caza y pesca", href: "/products/sacos/invierno"},
                    ]
                },
                {
                    name: "Esterillas y colchonetas",
                    href: "/esterillas-y-colchonetas?category=esterillas-y-colchonetas",
                    description: "Botas y zapatillas técnicas",
                    submenu: [
                        {name: "Esterillas extremas", href: "/products/calzado/botas-trekking"},
                        {name: "Esterillas de senderismo", href: "/products/calzado/trail"},
                        {name: "Colchonetas de camping", href: "/products/calzado/montanismo"},
                        {name: "Esterillas y colchonetas de aventura", href: "/products/calzado/montanismo"},
                        {name: "Esterillas y colchonetas de caza y pesca", href: "/products/calzado/montanismo"},
                    ]
                },

                // {
                //     name: "Accesorios",
                //     href: "/products/accesorios",
                //     description: "Complementos esenciales",
                //     submenu: [
                //         {name: "Linternas y frontales", href: "/products/accesorios/iluminacion"},
                //         {name: "Bastones de trekking", href: "/products/accesorios/bastones"},
                //         {name: "Brújulas y GPS", href: "/products/accesorios/navegacion"},
                //     ]
                // }
            ]
        },

        // ACTIVIDADES - сетка изображений
        {
            title: "ACTIVIDADES",
            displayType: "image-grid" as const,
            url: '/products/actividades',
            items: [
                {
                    name: "Extremo",
                    href: "/products/actividades?subcategory=extremo",
                    image: "/menu/activity/extremo.png",
                    alt: "Foto de Xavier von Erlach en Unsplash"
                },
                {
                    name: "Senderismo",
                    href: "/products/actividades?subcategory=senderismo",
                    image: "/menu/activity/senderismo.png",
                    alt: "Foto de Austin Ban en Unsplash"
                },
                {
                    name: "Camping",
                    href: "/products/actividades?subcategory=camping",
                    image: "/menu/activity/camping.png",
                    alt: "Foto de Lesly Derksen en Unsplash"
                },
                {
                    name: "Aventura",
                    href: "/products/actividades?subcategory=aventura",
                    image: "/menu/activity/aventura.png",
                    alt: "Foto de Filip Mroz en Unsplash"
                },
                {
                    name: "Pesca y caza",
                    href: "/products/actividades?subcategory=pesca-y-caza",
                    image: "/menu/activity/pesca.png",
                    alt: "Foto de Robson Hatsukami Morgan en Unsplash"
                }
            ]
        },

        // SERVICIO - карточки с описанием
        {
            title: "SERVICIO",
            displayType: "cards" as const,
            url: '/articles',
            items: [
                {
                    name: "Servicio de reparación",
                    href: "/alexika-traveler-club/como-elegir-la-tienda-de-campana-ideal-para-tus-aventuras",
                    image: "/activities/trail-running.png",
                    alt: "Servicio de reparación de equipos",
                    description: "Servicio sostenible: reparar en lugar de tirar"
                },
                {
                    name: "Sistemas de espalda",
                    href: "/servicio/sistemas-espalda",
                    image: "/activities/trail-running.png",
                    alt: "Ajuste de sistemas de espalda",
                    description: "El sistema adecuado para cada área de uso y cada persona"
                },
                {
                    name: "Guía del Viajero",
                    href: "/service/guia-del-viajero",
                    image: "/service/ashley-knedler-Pf5Pj7A5ddA-unsplash 1.png",
                    alt: "Foto de Ashley Knedler en Unsplash",
                    description: "Consejos esenciales para tu primera aventura"
                },
                {
                    name: "Primeros auxilios",
                    href: "/servicio/primeros-auxilios",
                    image: "/activities/trail-running.png",
                    alt: "Kit de primeros auxilios",
                    description: "Botiquines profesionales para sus actividades al aire libre"
                },
                {
                    name: "Cuidado del Equipo",
                    href: "/service/care",
                    image: "/service/annie-spratt-zH4OX1HSIaE-unsplash 1.png",
                    alt: "Foto de Annie Spratt en Unsplash",
                    description: "Guías de mantenimiento y uso correcto para tiendas y esterillas"
                }
            ]
        },

        // TATONKA - простое меню
        {
            title: "LA MARCA",
            displayType: "text-list" as const,
            url: '/la-marca',
            items: [
                {
                    name: "Sobre nosotros",
                    href: "/sobre"
                },
                {
                    name: "Historia de la marca",
                    href: "/historia"
                },
                {
                    name: "Sostenibilidad",
                    href: "/sostenibilidad"
                },
                {
                    name: "Contacto",
                    href: "/tatonka/contacto"
                }
            ]
        }
    ]
};


export const footerMenuData: FooterMenuCategory[] = [
    {
        title: 'PRODUCTOS',
        items: [
            // { name: 'Nuevos products', href: '/products/nuevos' },
            { name: 'Tiendas de campaña & Lonas', href: '/products/mochilas' },
            { name: 'Artículos de viaje', href: '/products/articulos-viaje' },
            { name: 'Sacos de dormir', href: '/products/tiendas-campana' },
            // { name: 'Cocina exterior', href: '/products/cocina-exterior' },
            // { name: 'Primeros auxilios', href: '/products/primeros-auxilios' },
            // { name: 'Accesorios para exteriores', href: '/products/accesorios' },
        ]
    },
    {
        title: 'ACTIVIDADES',
        items: [
            { name: 'Extremo', href: '/products/actividades?subcategory=extremo' },
            { name: 'Senderismo', href: '/products/actividades?subcategory=senderismo' },
            { name: 'Camping', href: '/products/actividades?subcategory=camping' },
            { name: 'Aventura', href: '/products/actividades?subcategory=aventura' },
            { name: 'Pesca y Caza', href: '/products/actividades?subcategory=pesca-y-caza' },
        ]
    },
    // {
    //     title: 'ESPECIALES',
    //     items: [
    //         { name: 'Trekking', href: '/especiales/trekking' },
    //         { name: 'Backpacking', href: '/especiales/backpacking' },
    //         { name: 'Hiking', href: '/especiales/hiking' },
    //         { name: 'Bushcrafting', href: '/especiales/bushcrafting' },
    //         { name: 'Everyday', href: '/especiales/everyday' },
    //         { name: 'Colección Hike Pack', href: '/especiales/hike-pack' },
    //         { name: 'Colección Bushcraft', href: '/especiales/bushcraft' },
    //         { name: 'Acero inoxidable', href: '/especiales/acero-inoxidable' },
    //         { name: 'La nueva serie de viajes', href: '/especiales/serie-viajes' },
    //         { name: 'La colección de tiendas', href: '/especiales/coleccion-tiendas' },
    //         { name: 'El buscador de tiendas', href: '/especiales/buscador-tiendas' },
    //         { name: 'Sin miedo al robo de datos', href: '/especiales/seguridad-datos' },
    //     ]
    // },
    {
        title: 'SERVICIO',
        items: [
            { name: 'Como elegir una tienda de campaña', href: '/servicio/consejos-tienda' },
            { name: 'Como para elegir un saco de dormir', href: '/servicio/consejos-saco' },
            { name: 'Como para elegir una esterilla', href: '/servicio/consejos-esterilla' },
            { name: 'Materiales', href: '/servicio/materiales' },
            { name: 'FAQ', href: '/servicio/faq' },
        ]
    },
    {
        title: 'LA COMPAÑÍA',
        items: [
            { name: 'Sobre la marca', href: '/compania/marca' },
            { name: 'Alexika Travel Club', href: '/compania/travel-club' },
            { name: 'Garantías', href: '/compania/garantias' },
            { name: 'Contacto', href: '/compania/contacto' },
            { name: 'Aviso legal', href: '/compania/aviso-legal' },
            { name: 'Política de privacidad', href: '/compania/politica-privacidad' },
            { name: 'Términos y condiciones generales', href: '/compania/terminos-condiciones' },
            { name: 'Derecho de desistimiento', href: '/compania/desistimiento' },
            { name: 'Cuidado del producto', href: '/compania/cuidado-producto' },
        ]
    }
];

export const usando = ['Extreme', 'trekking', 'camping', 'senderismo', 'montañismo', 'supervivencia', 'bushcraft', 'expediciones', 'outdoor', 'aventura', 'caza', 'pesca']

export const ArticlesCategories = ['todos', 'guías', 'consejos', 'destinos', 'equipamiento', 'experiencias']


