import {FooterMenuCategory, NavigationMenu} from "@/types/menu.type";

export const navAdminItems = [
    { href: "/admin", label: "Dashboard", exact: true },
    { href: "/admin/products", label: "Productos" },
    { href: "/admin/catalog", label: "Catálogo" },
    { href: "/admin/order", label: "Pedidos" },
    { href: "/admin/users", label: "Usuarios" },
];


export const oferta  = "Cambios y devoluciones 30 días"



export const homeSlides = [
    {
        src: '/slides/banner_1.png',
        slug: 'banner1',
        label: 'banner1',
        id: 'rt123r5',
        name: '',
    },
    {
        src: '/slides/banner_2.png',
        slug: 'banner2',
        label: 'banner2',
        id: 'rt123r6',
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
                        {name: "Tiendas 1-2 personas", href: "/products/tiendas/1-2personas"},
                        {name: "Tiendas 3-4 personas", href: "/products/tiendas/3-4personas"},
                        {name: "Tiendas 4 estaciones", href: "/products/tiendas/4estaciones"},
                        {name: "Tiendas ultraligeras", href: "/products/tiendas/ultraligeras"},
                    ]
                },
                {
                    name: "Sacos de dormir",
                    href: "/sacos-de-dormir?category=sacos-de-dormir",
                    description: "Descanso cómodo en la naturaleza",
                    submenu: [
                        {name: "Sacos de verano", href: "/products/sacos/verano"},
                        {name: "Sacos 3 estaciones", href: "/products/sacos/3estaciones"},
                        {name: "Sacos de invierno", href: "/products/sacos/invierno"},
                    ]
                },
                {
                    name: "Calzado de montaña",
                    href: "/products/calzado",
                    description: "Botas y zapatillas técnicas",
                    submenu: [
                        {name: "Botas de trekking", href: "/products/calzado/botas-trekking"},
                        {name: "Zapatillas de trail", href: "/products/calzado/trail"},
                        {name: "Botas de montañismo", href: "/products/calzado/montanismo"},
                    ]
                },

                {
                    name: "Accesorios",
                    href: "/products/accesorios",
                    description: "Complementos esenciales",
                    submenu: [
                        {name: "Linternas y frontales", href: "/products/accesorios/iluminacion"},
                        {name: "Bastones de trekking", href: "/products/accesorios/bastones"},
                        {name: "Brújulas y GPS", href: "/products/accesorios/navegacion"},
                    ]
                }
            ]
        },

        // ACTIVIDADES - сетка изображений
        {
            title: "ACTIVIDADES",
            displayType: "image-grid" as const,
            url: '/products/actividades',
            items: [
                {
                    name: "TREKKING",
                    href: "/products/actividades?subcategory=trekking",
                    image: "/activities/alpinismo.png",
                    alt: "Personas haciendo trekking en montaña"
                },
                {
                    name: "SENDERISMO",
                    href: "/actividades/senderismo",
                    image: "/activities/escalada.png",
                    alt: "Senderismo por senderos naturales"
                },
                {
                    name: "VIAJE",
                    href: "/actividades/viaje",
                    image: "/activities/pescadores.png",
                    alt: "Aventuras de viaje"
                },
                {
                    name: "CAMPING",
                    href: "/actividades/camping",
                    image: "/activities/senderismo.png",
                    alt: "Camping al aire libre"
                },
                {
                    name: "CICLISMO",
                    href: "/actividades/ciclismo",
                    image: "/activities/trail-running.png",
                    alt: "Ciclismo de montaña"
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
                    href: "/servicio/reparacion",
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
                    name: "Consejos para mochileros",
                    href: "/servicio/consejos-mochileros",
                    image: "/activities/trail-running.png",
                    alt: "Consejos para mochileros",
                    description: "De esta forma puede ajustar nuestras mochilas individualmente"
                },
                {
                    name: "Primeros auxilios",
                    href: "/servicio/primeros-auxilios",
                    image: "/activities/trail-running.png",
                    alt: "Kit de primeros auxilios",
                    description: "Botiquines profesionales para sus actividades al aire libre"
                },
                {
                    name: "Primeros auxilios",
                    href: "/servicio/primeros-auxilios",
                    image: "/activities/trail-running.png",
                    alt: "Kit de primeros auxilios",
                    description: "Botiquines profesionales para sus actividades al aire libre"
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
                    href: "/tatonka/sobre-nosotros"
                },
                {
                    name: "Historia de la marca",
                    href: "/tatonka/historia"
                },
                {
                    name: "Sostenibilidad",
                    href: "/tatonka/sostenibilidad"
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
            { name: 'Nuevos products', href: '/products/nuevos' },
            { name: 'Tiendas de campaña & Lonas', href: '/products/mochilas' },
            { name: 'Artículos de viaje', href: '/products/articulos-viaje' },
            { name: 'Sacos de dormir', href: '/products/tiendas-campana' },
            { name: 'Cocina exterior', href: '/products/cocina-exterior' },
            { name: 'Primeros auxilios', href: '/products/primeros-auxilios' },
            { name: 'Accesorios para exteriores', href: '/products/accesorios' },
        ]
    },
    {
        title: 'ACTIVIDADES',
        items: [
            { name: 'Trekking', href: '/actividades/trekking' },
            { name: 'Senderismo', href: '/actividades/senderismo' },
            { name: 'Camping', href: '/actividades/camping' },
            { name: 'Ciclismo', href: '/actividades/ciclismo' },
        ]
    },
    {
        title: 'ESPECIALES',
        items: [
            { name: 'Trekking', href: '/especiales/trekking' },
            { name: 'Backpacking', href: '/especiales/backpacking' },
            { name: 'Hiking', href: '/especiales/hiking' },
            { name: 'Bushcrafting', href: '/especiales/bushcrafting' },
            { name: 'Everyday', href: '/especiales/everyday' },
            { name: 'Colección Hike Pack', href: '/especiales/hike-pack' },
            { name: 'Colección Bushcraft', href: '/especiales/bushcraft' },
            { name: 'Acero inoxidable', href: '/especiales/acero-inoxidable' },
            { name: 'La nueva serie de viajes', href: '/especiales/serie-viajes' },
            { name: 'La colección de tiendas', href: '/especiales/coleccion-tiendas' },
            { name: 'El buscador de tiendas', href: '/especiales/buscador-tiendas' },
            { name: 'Sin miedo al robo de datos', href: '/especiales/seguridad-datos' },
        ]
    },
    {
        title: 'SERVICIO',
        items: [
            { name: 'Servicio de reparación', href: '/servicio/reparacion' },
            { name: 'Consejos para mochileros', href: '/servicio/consejos-mochileros' },
            { name: 'Primeros auxilios', href: '/servicio/primeros-auxilios' },
            { name: 'Consejos para la tienda', href: '/servicio/consejos-tienda' },
            { name: 'Materiales', href: '/servicio/materiales' },
            { name: 'Tabla de tallas', href: '/servicio/tallas' },
            { name: 'FAQ', href: '/servicio/faq' },
        ]
    },
    {
        title: 'LA COMPAÑÍA',
        items: [
            { name: 'La marca', href: '/compania/marca' },
            { name: 'Traceability by Tatonka', href: '/compania/traceability' },
            { name: 'Socio y fabricante', href: '/compania/socios' },
            { name: 'Socio colaborador', href: '/compania/colaboradores' },
            { name: 'Declaración sobre accesibilidad', href: '/compania/accesibilidad' },
            { name: 'Tatonka Community', href: '/compania/community' },

        ]
    }
];

export const usando = ['extrim', 'trekking', 'camping', 'senderismo', 'montañismo', 'supervivencia', 'bushcraft', 'expediciones', 'outdoor', 'aventura', 'caza', 'pesca']


