import Image from "next/image";

const CarePage = async () => {
    return (
        <div className="mt-8 min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white ">
                <div className="max-w-4xl mx-auto px-4 py-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center uppercase">
                        Cuidado del producto
                    </h1>
                    <p className="text-lg text-gray-600">
                        Cómo usar tu equipo correctamente
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="main-wrapper m-0 p-0 mx-auto pb-12  bg-white ">

                <div className={'relative w-full aspect-[16/9]'}>
                    <Image
                        src={'/service/annie-spratt-big.png'}
                        alt={'Foto de Annie Spratt en Unsplash'}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>

                <div className="pl-32 pr-32 mx-auto px-4 space-y-12 ">
                    {/* Tiendas Section */}
                    <section className="mb-16">
                        <div className="bg-white rounded-lg p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 ">
                                TIENDAS
                            </h2>

                            <div className="prose prose-gray max-w-none">
                                <p className="text-gray-700 leading-relaxed mb-6">
                                    Alexika produce tiendas confiables, pero es muy importante usar tu equipo de exterior correctamente.
                                    Esto no solo aumentará la longevidad del equipo, sino que también te ahorrará mucho tiempo que de otra manera
                                    pasarías resolviendo problemas que surgen del uso inadecuado del equipo. Por favor, lee los siguientes consejos cuidadosamente.
                                </p>

                                {/* Tip 1 */}
                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                        1. Manual de instrucciones
                                    </h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        Siempre lee el manual antes de montar y usar la tienda. Esto reducirá el riesgo de dañar la tienda
                                        durante el primer montaje. El manual está incluido en cada tienda, pero siempre puedes encontrarlo en línea:
                                        <a href="https://www.alexika.es" className="text-blue-600 hover:text-blue-800 underline ml-1">
                                            www.alexika.eu
                                        </a>.
                                        Monta la tienda cuidadosamente. Si aplicas demasiada fuerza al montar una tienda, significa que
                                        estás haciendo algo mal y puede dañar la tienda o las varillas.
                                    </p>
                                </div>

                                {/* Tip 2 */}
                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                        2. Pasos para el montaje
                                    </h3>
                                    <p className="text-gray-700 leading-relaxed mb-4">
                                        Al montar una tienda, sigue estos simples pasos:
                                    </p>

                                    <ul className="space-y-3 ml-4">
                                        <li className="flex items-start">
                                            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                            <span className="text-gray-700">
                                           Elige un terreno plano con pendiente mínima y retira todas las cosas afiladas
                                           (por ejemplo, piedras, vidrio, ramas, etc.)
                                       </span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                            <span className="text-gray-700">
                                           Trata de no montar una tienda bajo árboles con ramas grandes y secas. En caso de viento fuerte,
                                           esas ramas pueden caer y dañar la tienda.
                                       </span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                            <span className="text-gray-700">
                                           No enciendas fuego cerca de la tienda. Las chispas no incendiarán la tienda,
                                           pero dejarán pequeños agujeros en la tienda exterior.
                                       </span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                            <span className="text-gray-700">
                                           No montes una tienda en algún lugar de terreno alto o bajo grandes árboles solitarios
                                           porque hay un alto riesgo de caída de rayos.
                                       </span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                            <span className="text-gray-700">
                                           Siempre usa cuerdas y estacas al montar una tienda. El viento siempre comienza inesperadamente
                                           y una tienda sin asegurar puede colapsar fácilmente y rodar por el suelo.
                                       </span>
                                        </li>
                                    </ul>
                                </div>

                                {/* Tip 3 */}
                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                        3. Condensación
                                    </h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        No es un problema de construcción de la tienda, sino más bien un proceso físico de condensación
                                        de humedad del aire por caída de temperatura. Te enfrentas a la condensación principalmente en
                                        la parte interior del sobretecho. Es muy importante mantener las ventanas de ventilación siempre
                                        abiertas excepto durante lluvia fuerte y viento.
                                    </p>
                                </div>

                                {/* Tip 4 */}
                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                        4. Instrucciones de cuidado
                                    </h3>
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <ul className="space-y-2">
                                            <li className="text-gray-700">• La tienda debe almacenarse seca</li>
                                            <li className="text-gray-700">• Limpia con paño suave y agua jabonosa</li>
                                            <li className="text-gray-700">• Nunca limpies en lavadora o planches</li>
                                            <li className="text-gray-700">• Repara agujeros inmediatamente</li>
                                            <li className="text-gray-700">• Empaca con la capa PU hacia adentro</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Esterillas Section */}
                    <section>
                        <div className="bg-white  p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 ">
                                ESTERILLAS
                            </h2>

                            <div className="prose prose-gray max-w-none">
                                <p className="text-gray-700 leading-relaxed mb-6">
                                    Dormir en el suelo es incómodo y helado. Combinamos las mejores características de las esterillas
                                    tradicionales y obtuvimos una esterilla auto-inflable que aísla bien y proporciona alta comodidad al dormir.
                                </p>

                                {/* Usage Instructions */}
                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                        Instrucciones de uso
                                    </h3>
                                    <p className="text-gray-700 leading-relaxed">
                                        Si deseas usar tu esterilla, solo abre una válvula de aire y la espuma de plástico comenzará
                                        a expandirse como un resorte absorbiendo aire. Después de unos minutos puedes cerrar la válvula
                                        de aire y usar tu esterilla.
                                    </p>
                                </div>

                                {/* Care Instructions */}
                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                        Instrucciones de almacenamiento y cuidado
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="bg-green-50 p-4 rounded-lg">
                                            <h4 className="font-semibold text-green-800 mb-2">✓ Hacer</h4>
                                            <ul className="text-sm text-green-700 space-y-1">
                                                <li>• Almacenar desplegada con válvulas abiertas</li>
                                                <li>• Secar después del uso</li>
                                                <li>• Limpiar con cepillo suave y agua jabonosa</li>
                                                <li>• Secar a temperatura ambiente (+20°C)</li>
                                            </ul>
                                        </div>
                                        <div className="bg-red-50 p-4 rounded-lg">
                                            <h4 className="font-semibold text-red-800 mb-2">✗ No hacer</h4>
                                            <ul className="text-sm text-red-700 space-y-1">
                                                <li>• No usar sobre piedras o objetos afilados</li>
                                                <li>• No usar en agua para nadar</li>
                                                <li>• No exponer al sol prolongadamente</li>
                                                <li>• No sobrecargar o saltar encima</li>
                                                <li>• No permitir mascotas</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Repair Instructions */}
                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                        Instrucciones de reparación
                                    </h3>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <ol className="list-decimal list-inside space-y-2 text-gray-700">
                                            <li>Infla la esterilla y cierra la válvula de aire</li>
                                            <li>Dobla para crear presión adicional</li>
                                            <li>Usa espuma jabonosa para encontrar el daño</li>
                                            <li>Marca las áreas dañadas</li>
                                            <li>Seca y aplica parche del kit de reparación</li>
                                        </ol>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Footer Note */}

                    </section>

                    <div className="bg-white  px-8">
                        <div className="mt-12 bg-blue-100 p-6 rounded-lg">
                            <p className="text-blue-800 text-center font-medium">
                                Todas estas recomendaciones están probadas por el tiempo y numerosos turistas y escaladores
                                alrededor del mundo. Si sigues estos simples consejos, tu equipo de exterior estará contigo por mucho tiempo.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CarePage;