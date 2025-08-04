import {Product} from "@/lib/validations/product/product-client-validation";
import {CategoryClientResponse} from "@/lib/validations/product/category-validation";

const CategoriesMock: CategoryClientResponse[] = [
    {
        id: 'cat-001',
        name: 'Палатки',
        slug: 'palatki',
        _count: {
            products: 13 // количество продуктов с category: 'palatki'
        },
        categorySubcategories: [
            {
                subcategory: {
                    id: 'subcat-001',
                    name: 'Туристические',
                    slug: 'turisticheskie'
                }
            },
            {
                subcategory: {
                    id: 'subcat-002',
                    name: 'Семейные',
                    slug: 'semeynye'
                }
            },
            {
                subcategory: {
                    id: 'subcat-003',
                    name: 'Экспедиционные',
                    slug: 'ekspedicionnye'
                }
            },
            {
                subcategory: {
                    id: 'subcat-004',
                    name: 'Треккинговые',
                    slug: 'trekkingovye'
                }
            },
            {
                subcategory: {
                    id: 'subcat-005',
                    name: 'Городские',
                    slug: 'gorodskie'
                }
            },
            {
                subcategory: {
                    id: 'subcat-006',
                    name: 'Беговые',
                    slug: 'begovaya'
                }
            },
            {
                subcategory: {
                    id: 'subcat-007',
                    name: 'Куртки',
                    slug: 'kurtki'
                }
            },
            {
                subcategory: {
                    id: 'subcat-008',
                    name: 'Флис',
                    slug: 'flis'
                }
            }
        ]
    },
    {
        id: 'cat-002',
        name: 'Спальные мешки',
        slug: 'spalnye-meshki',
        _count: {
            products: 8 // количество продуктов с category: 'spalnye-meshki'
        },
        categorySubcategories: [
            {
                subcategory: {
                    id: 'subcat-009',
                    name: 'Зимние',
                    slug: 'zimnie'
                }
            },
            {
                subcategory: {
                    id: 'subcat-010',
                    name: 'Летние',
                    slug: 'letnie'
                }
            },
            {
                subcategory: {
                    id: 'subcat-011',
                    name: 'Универсальные',
                    slug: 'universalnye'
                }
            },
            {
                subcategory: {
                    id: 'subcat-012',
                    name: 'Альпинистские',
                    slug: 'alpinistskie'
                }
            },
            {
                subcategory: {
                    id: 'subcat-013',
                    name: 'Кухонное оборудование',
                    slug: 'kuhonnoe'
                }
            },
            {
                subcategory: {
                    id: 'subcat-014',
                    name: 'Освещение',
                    slug: 'osveshchenie'
                }
            },
            {
                subcategory: {
                    id: 'subcat-015',
                    name: 'Термосы',
                    slug: 'termosy'
                }
            },
            {
                subcategory: {
                    id: 'subcat-016',
                    name: 'Коврики',
                    slug: 'kovriki'
                }
            },
            {
                subcategory: {
                    id: 'subcat-017',
                    name: 'Штаны',
                    slug: 'shtany'
                }
            },
            {
                subcategory: {
                    id: 'subcat-018',
                    name: 'Сандалии',
                    slug: 'sandalii'
                }
            },
            {
                subcategory: {
                    id: 'subcat-019',
                    name: 'Инструменты',
                    slug: 'instrumenty'
                }
            }
        ]
    }
]


const ProductsGallery: Product[] = [
    {
        id: 'palatka-001',
        name: 'Alaska',
        description: 'Надежная двухместная палатка для походов',
        image: '/products/product_01.png',
        price: 8500,
        slug: 'palatka-alaska',
        category: CategoriesMock[1],
        subcategory: 'turisticheskie',
        brand: 'Alaska',
        weight: 2.8,
        capacity: 2,
        season: 'tri-sezona',
        waterproof: 3000,
        inStock: true,
        discount: 0
    },
    {
        id: 'palatka-002',
        name: 'Coleman',
        description: 'Просторная четырехместная палатка',
        image: '/products/product_02.png',
        price: 12000,
        slug: 'palatka-coleman-family',
        category: CategoriesMock[1],
        subcategory: 'semeynye',
        brand: 'Coleman',
        weight: 4.5,
        capacity: 4,
        season: 'leto',
        waterproof: 2000,
        inStock: true,
        discount: 15
    },
    {
        id: 'ryukzak-001',
        name: 'Osprey',
        description: 'Легкий рюкзак для дальних походов',
        image: '/products/product_03.png',
        price: 15000,
        slug: 'ryukzak-osprey-65l',
        category: CategoriesMock[1],
        subcategory: 'trekkingovye',
        brand: 'Osprey',
        weight: 1.8,
        capacity: 65,
        season: 'universal',
        waterproof: 0,
        inStock: true,
        discount: 0
    },
    {
        id: 'ryukzak-002',
        name: 'Deuter',
        description: 'Компактный рюкзак для города',
        image: '/products/product_04.png',
        price: 6500,
        slug: 'ryukzak-deuter-city',
        category: CategoriesMock[1],
        subcategory: 'gorodskie',
        brand: 'Deuter',
        weight: 0.9,
        capacity: 25,
        season: 'universal',
        waterproof: 1000,
        inStock: false,
        discount: 10
    },
    {
        id: 'spalnik-001',
        name: 'Marmot',
        description: 'Теплый спальник для зимних походов',
        image: '/products/product_05.png',
        price: 18000,
        slug: 'spalnik-marmot-winter',
        category: CategoriesMock[1],
        subcategory: 'zimnie',
        brand: 'Marmot',
        weight: 1.2,
        capacity: 1,
        season: 'zima',
        waterproof: 0,
        inStock: true,
        discount: 20
    },
    {
        id: 'spalnik-002',
        name: 'Quechua',
        description: 'Легкий спальник для летних походов',
        image: '/products/product_06.png',
        price: 4500,
        slug: 'spalnik-quechua-summer',
        category: CategoriesMock[1],
        subcategory: 'letnie',
        brand: 'Quechua',
        weight: 0.8,
        capacity: 1,
        season: 'leto',
        waterproof: 0,
        inStock: true,
        discount: 0
    },
    {
        id: 'obuv-001',
        name: 'Ботинки треккинговые Salomon',
        description: 'Водонепроницаемые ботинки для походов',
        image: '/products/product_07.png',
        price: 14000,
        slug: 'botinki-salomon-gtx',
        category: CategoriesMock[1],
        subcategory: 'trekkingovaya',
        brand: 'Salomon',
        weight: 1.4,
        capacity: 0,
        season: 'universal',
        waterproof: 10000,
        inStock: true,
        discount: 0
    },
    {
        id: 'obuv-002',
        name: 'Кроссовки беговые Nike',
        description: 'Легкие кроссовки для бега по пересеченной местности',
        image: '/products/product_08.png',
        price: 9500,
        slug: 'krossovki-nike-trail',
        category: CategoriesMock[1],
        subcategory: 'begovaya',
        brand: 'Nike',
        weight: 0.6,
        capacity: 0,
        season: 'leto',
        waterproof: 0,
        inStock: true,
        discount: 25
    },
    {
        id: 'odezhda-001',
        name: 'Куртка мембранная The North Face',
        description: 'Ветро-влагозащитная куртка',
        image: '/products/product_09.png',
        price: 22000,
        slug: 'kurtka-tnf-gore-tex',
        category: CategoriesMock[1],
        subcategory: 'kurtki',
        brand: 'The North Face',
        weight: 0.4,
        capacity: 0,
        season: 'universal',
        waterproof: 20000,
        inStock: true,
        discount: 0
    },
    {
        id: 'odezhda-002',
        name: 'Флис Patagonia',
        description: 'Теплая флисовая кофта',
        image: '/products/product_10.png',
        price: 8000,
        slug: 'flis-patagonia-warm',
        category: CategoriesMock[1],
        subcategory: 'flis',
        brand: 'Patagonia',
        weight: 0.3,
        capacity: 0,
        season: 'zima',
        waterproof: 0,
        inStock: false,
        discount: 0
    },
    {
        id: 'palatka-003',
        name: 'Палатка экспедиционная Hilleberg',
        description: 'Сверхпрочная палатка для экстремальных условий',
        image: '/products/product_11.png',
        price: 45000,
        slug: 'palatka-hilleberg-expedition',
        category: CategoriesMock[1],
        subcategory: 'ekspedicionnye',
        brand: 'Hilleberg',
        weight: 3.2,
        capacity: 2,
        season: 'chetyre-sezona',
        waterproof: 10000,
        inStock: true,
        discount: 0
    },
    {
        id: 'ryukzak-003',
        name: 'Рюкзак альпинистский Black Diamond',
        description: 'Специализированный рюкзак для альпинизма',
        image: '/products/product_12.png',
        price: 18500,
        slug: 'ryukzak-bd-alpine',
        category: CategoriesMock[1],
        subcategory: 'alpinistskie',
        brand: 'Black Diamond',
        weight: 1.5,
        capacity: 45,
        season: 'universal',
        waterproof: 1500,
        inStock: true,
        discount: 0
    },
    {
        id: 'oborudovanie-001',
        name: 'Горелка газовая Jetboil',
        description: 'Компактная система приготовления пищи',
        image: '/products/product_13.png',
        price: 12500,
        slug: 'gorelka-jetboil-flash',
        category: CategoriesMock[1],
        subcategory: 'kuhonnoe',
        brand: 'Jetboil',
        weight: 0.4,
        capacity: 1,
        season: 'universal',
        waterproof: 0,
        inStock: true,
        discount: 0
    },
    {
        id: 'oborudovanie-002',
        name: 'Фонарь налобный Petzl',
        description: 'Мощный налобный фонарь',
        image: '/products/product_14.png',
        price: 7500,
        slug: 'fonar-petzl-tactikka',
        category: CategoriesMock[0],
        subcategory: 'osveshchenie',
        brand: 'Petzl',
        weight: 0.08,
        capacity: 0,
        season: 'universal',
        waterproof: 1000,
        inStock: true,
        discount: 15
    },
    {
        id: 'aksessuary-001',
        name: 'Термос Stanley',
        description: 'Классический стальной термос',
        image: '/products/product_15.png',
        price: 4500,
        slug: 'termos-stanley-classic',
        category: CategoriesMock[0],
        subcategory: 'termosy',
        brand: 'Stanley',
        weight: 0.5,
        capacity: 1,
        season: 'universal',
        waterproof: 0,
        inStock: true,
        discount: 0
    },
    {
        id: 'aksessuary-002',
        name: 'Коврик туристический Therm-a-Rest',
        description: 'Надувной коврик для сна',
        image: '/products/product_16.png',
        price: 8500,
        slug: 'kovrik-thermarest-xlite',
        category: CategoriesMock[0],
        subcategory: 'kovriki',
        brand: 'Therm-a-Rest',
        weight: 0.35,
        capacity: 1,
        season: 'universal',
        waterproof: 0,
        inStock: false,
        discount: 10
    },
    {
        id: 'spalnik-003',
        name: 'Спальник трехсезонный Sea to Summit',
        description: 'Универсальный спальник',
        image: '/products/product_17.png',
        price: 13500,
        slug: 'spalnik-sts-trek',
        category: CategoriesMock[0],
        subcategory: 'universalnye',
        brand: 'Sea to Summit',
        weight: 1.1,
        capacity: 1,
        season: 'tri-sezona',
        waterproof: 0,
        inStock: true,
        discount: 0
    },
    {
        id: 'odezhda-003',
        name: 'Штаны треккинговые Fjallraven',
        description: 'Прочные походные брюки',
        image: '/products/product_18.png',
        price: 11000,
        slug: 'shtany-fjallraven-vidda',
        category: CategoriesMock[0],
        subcategory: 'shtany',
        brand: 'Fjallraven',
        weight: 0.6,
        capacity: 0,
        season: 'universal',
        waterproof: 1500,
        inStock: true,
        discount: 0
    },
    {
        id: 'obuv-003',
        name: 'Сандалии Teva',
        description: 'Спортивные сандалии для активного отдыха',
        image: '/products/product_19.png',
        price: 6500,
        slug: 'sandalii-teva-universal',
        category: CategoriesMock[0],
        subcategory: 'sandalii',
        brand: 'Teva',
        weight: 0.4,
        capacity: 0,
        season: 'leto',
        waterproof: 500,
        inStock: true,
        discount: 20
    },
    {
        id: 'oborudovanie-003',
        name: 'Мультитул Leatherman',
        description: 'Многофункциональный инструмент',
        image: '/products/product_20.png',
        price: 9500,
        slug: 'multitool-leatherman-wave',
        category: CategoriesMock[0],
        subcategory: 'instrumenty',
        brand: 'Leatherman',
        weight: 0.24,
        capacity: 0,
        season: 'universal',
        waterproof: 0,
        inStock: true,
        discount: 0
    },
    {
        id: 'palatka-004',
        name: 'Палатка треккинговая MSR',
        description: 'Легкая палатка для треккинга',
        image: '/products/product_03.png',
        price: 15000,
        slug: 'palatka-msr-trek',
        category: CategoriesMock[0],
        subcategory: 'trekkingovye',
        brand: 'MSR',
        weight: 1.8,
        capacity: 2,
        season: 'universal',
        waterproof: 5000,
        inStock: true,
        discount: 0
    },

]

export default ProductsGallery