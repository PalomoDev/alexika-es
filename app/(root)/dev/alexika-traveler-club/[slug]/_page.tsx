import Image from "next/image";
import Breadcrumbs, {BreadcrumbItem} from "@/components/ui/breadcrumps";
import {ROUTES} from "@/lib/constants/routes";

interface ArticlePageProps {
    params: Promise<{
        slug: string[];
    }>;
}

const photos = [
    {
        url: '/articles/thomas-thompson-9Ags1vGk07c-unsplash 1.png',
        alt: 'Foto de Thomas Thompson en Unsplash'},
    {
        url: '/articles/tommao-wang-MnuMQ7uYMmo-unsplash.jpg',
        alt: 'Foto de tommao wang en Unsplash'},
]

const ArticlePage = async ({params}: ArticlePageProps) => {
    const {slug} = await params
    const breadcrumbs: BreadcrumbItem[] = [
        { label: 'ARTICULOS', href: `${ROUTES.BASE_URL}/articles` },
        { label: 'CONSEJOS', href: `${ROUTES.BASE_URL}/articles/consejos` },
        { label: 'Cómo no perderse en el bosque', href: `${ROUTES.BASE_URL}/articles/consejos/${slug}` },
    ]
    return (
        <div>
            <div className={`w-full pt-8 `}>
                <Breadcrumbs items={breadcrumbs} className={`pl-1`}/>
            </div>
            <div className="main-wrapper flex flex-col mt-8 px-0 bg-white">

                <article className="article-wrapper w-full md:max-w-[1480px] mx-auto  flex-1 pb-12">
                    <div className={`article-header-container w-full flex justify-start items-center text-white  font-extrabold uppercase bg-brand-hover`}>
                        <div className={`flex flex-col justify-center items-start pt-24 pb-16 pr-12 pl-48 `}>
                            <h1 className={`text-4xl`}> Cómo no perderse en el bosque.</h1>
                            <h2 className={`text-lg font-light`}>reglas de seguridad para excursionistas</h2>
                        </div>

                    </div>
                    <div className={`w-full `}>
                        <Image
                            src={`${photos[0].url}`}
                            alt={`${photos[0].alt}`}
                            width={1480}
                            height={720}
                        />
                    </div>

                    <div className={`article-content-container w-full px-48 flex flex-col justify-start gap-6 items-start  pt-12 pb-16`}>

                        <div className={`w-full flex flex-col gap-4 mb-4`}>
                            <p className={`text-lg font-mono`}>
                                Mucha gente piensa que nunca se perderá en el bosque, pero la experiencia demuestra lo contrario: incluso senderistas con años de práctica pueden desorientarse en medio de la naturaleza. Para minimizar riesgos, lo más importante es prepararse bien antes de salir y saber reaccionar con calma si algo no sale según lo previsto.
                            </p>
                        </div>

                        <div className={`w-full flex flex-col gap-4 `}>
                            <h3 className={`font-black uppercase`}>Preparación antes de la excursión</h3>
                            <p className={`text-lg font-light`}>
                                Antes de adentrarte en el bosque conviene dedicar un momento a organizar tu salida. Una regla de oro es informar siempre a un familiar o a un amigo sobre tus planes: indícale a dónde piensas ir, con quién, y a qué hora aproximada planeas regresar. Este simple gesto puede marcar la diferencia, ya que si tardas demasiado en volver, alguien sabrá dónde comenzar a buscarte.
                            </p>
                            <p className={`text-lg font-light`}>
                                Además de esto, es fundamental aprender a orientarse. Hoy en día confiamos en los teléfonos inteligentes y los navegadores GPS, pero estos dispositivos no son infalibles. La batería puede agotarse o la señal puede desaparecer en zonas boscosas. Saber interpretar un mapa de papel y manejar una brújula sigue siendo una habilidad esencial que puede salvar vidas.                        </p>
                        </div>

                        <div className={`w-full flex flex-col gap-4 `}>
                            <h3 className={`font-black uppercase`}>Qué llevar contigo</h3>
                            <p className={`text-lg font-light`}>
                                El contenido de la mochila también juega un papel clave en la seguridad. Nunca debe faltar el teléfono móvil, incluso aunque no haya cobertura, porque puede servir para consultar mapas sin conexión o emitir señales luminosas. El agua y los alimentos son imprescindibles, y lo ideal es llevar una cantidad superior a la que calculas consumir. Tampoco está de más una chaqueta o ropa de abrigo, ya que el clima en la montaña o en el bosque puede cambiar en cuestión de minutos. Una linterna fiable con pilas de repuesto o un cargador portátil también puede sacarte de apuros en caso de que la noche te sorprenda.
                            </p>
                            <p className={`text-lg font-light`}>
                                Junto a este equipo básico, resulta muy recomendable contar con un pequeño kit de emergencia. En él deberían incluirse un GPS portátil con baterías adicionales, una brújula, un mapa físico de la zona y un botiquín de primeros auxilios, aunque la excursión sea corta. Para casos extremos, los objetos de señalización son especialmente útiles: un espejo para reflejar la luz del sol, un silbato cuyo sonido se escucha más lejos que la voz, e incluso una bengala, que además puede servir para encender un fuego.
                            </p>

                            <div className={`w-full aspect-video flex flex-col gap-2   mt-2 mb-4`}>
                                <Image
                                    src={`${photos[1].url}`}
                                    alt={`${photos[1].alt}`}
                                    width={1480}
                                    height={720}
                                />
                                <p className={`text-sm font-light text-gray-500`}>
                                    Foto de <a target="_blank" href="https://unsplash.com/es/@tommaomaoer?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">tommao wang</a> en <a target="_blank" href="https://unsplash.com/es/fotos/un-letrero-con-flechas-apuntando-en-diferentes-direcciones-MnuMQ7uYMmo?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash" >Unsplash</a>

                                </p>
                            </div>
                        </div>

                        <div className={`w-full flex flex-col gap-4 `}>
                            <h3 className={`font-black uppercase`}>Qué hacer si te pierdes</h3>
                            <p className={`text-lg font-light`}>
                                Si a pesar de todo llegas a perderte, lo más importante es detenerte y mantener la calma. El pánico es el peor enemigo en una situación de emergencia. Respira hondo, bebe un poco de agua, come algo si lo necesitas y trata de analizar la situación con claridad. Revisa tu mapa si lo llevas contigo o busca algún punto de referencia en el entorno.
                            </p>
                            <p className={`text-lg font-light`}>
                                Después observa bien el terreno. Si estás en un sendero, fíjate en su dirección y en si muestra huellas o marcas. En las zonas rocosas es común encontrar montículos de piedras o señales pintadas que indican el camino.
                            </p>

                            <p className={`text-lg font-light`}>
                                Si no logras orientarte, llega el momento de pedir ayuda. En Europa el número de emergencias 112 funciona incluso sin tarjeta SIM. Siempre que sea posible, envía tus coordenadas mediante GPS o aplicaciones de mensajería. Para ahorrar batería, mantén tu teléfono en un bolsillo interior donde esté protegido del frío.
                            </p>

                            <p className={`text-lg font-light`}>
                                Una vez que hayas solicitado ayuda, lo más prudente es permanecer en un lugar seguro y no seguir caminando sin rumbo. Es más sencillo encontrarte si permaneces en un punto fijo. Intenta ser visible: sitúate en un claro, en una roca alta o en un espacio abierto, y utiliza cualquier recurso para llamar la atención: reflejos con un espejo, señales acústicas con un silbato o incluso humo de una fogata.
                            </p>
                        </div>

                        <div className={`w-full flex flex-col gap-4 `}>
                            <h3 className={`font-black uppercase`}>Reglas básicas de supervivencia</h3>
                            <p className={`text-lg font-light`}>
                                La experiencia demuestra que las claves para superar una situación así son sencillas: mantener la calma, confiar en las técnicas tradicionales de orientación y procurar ser lo más visible posible. Una mente clara aumenta las posibilidades de salir con éxito, un mapa y una brújula no se quedan sin batería, y los signos de luz, sonido o humo son los mejores aliados para atraer la atención de los rescatistas.
                            </p>

                        </div>

                        <div className={`w-full flex flex-col gap-4 `}>
                            <h3 className={`font-black uppercase`}>Conclusión</h3>
                            <p className={`text-lg font-light`}>
                                Perderse en el bosque puede ser una experiencia aterradora, pero con una preparación adecuada y una actitud serena, las probabilidades de un desenlace positivo son muy altas. La naturaleza es un lugar fascinante que merece ser disfrutado, siempre y cuando se la recorra con responsabilidad y respeto.
                            </p>

                        </div>

                    </div>

                </article>
            </div>
        </div>
    )

}

export default ArticlePage;