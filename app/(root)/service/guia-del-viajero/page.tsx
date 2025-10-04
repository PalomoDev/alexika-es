import Image from "next/image";

const TravelerGuidePage = async () => {
    return (
        <div className="mt-8 min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white">
                <div className="max-w-4xl mx-auto px-4 py-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center uppercase">
                        Guía del Viajero
                    </h1>
                    <p className="text-lg text-gray-600">
                        Consejos esenciales para tu primera aventura
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="main-wrapper m-0 p-0 mx-auto pb-12 bg-white">

                <div className={'relative w-full aspect-[16/9]'}>
                    <Image
                        src={'/service/ashley-knedler-big.png'}
                        alt={'Foto de Ashley Knedler en Unsplash'}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>

                <div className="pl-32 pr-32 mx-auto px-4 space-y-12">

                    {/* Intro Section */}
                    <section className="mb-16">
                        <div className="bg-white rounded-lg p-8">
                            <div className="prose prose-gray max-w-none">
                                <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                                    De alguna manera misteriosa, uno de tus amigos te convenció para ir de excursión. Y ahora ya estás listo para renunciar a esta idea, pero espera. No todo es tan terrible. Al final, las vacaciones en un hotel con todo incluido no van a desaparecer, y una excursión es una especie de exótica para los habitantes modernos de las ciudades.
                                </p>
                                <p className="text-gray-700 leading-relaxed mb-6">
                                    Además, con la preparación y actitud correctas, resulta ser un viaje divertido y agradable no peor que un crucero marítimo. Para no confundirse sobre lo que realmente se necesita en una excursión, te proponemos familiarizarte con varios consejos útiles para viajeros.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Tiendas Section */}
                    <section className="mb-16">
                        <div className="bg-white rounded-lg p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3">
                                TIENDAS DE CAMPAÑA
                            </h2>

                            <div className="prose prose-gray max-w-none">
                                <p className="text-gray-700 leading-relaxed mb-6 font-medium">
                                    Para que la tienda turística se convierta en tu hogar cómodo en la naturaleza y sirva por mucho tiempo
                                </p>

                                {/* Tips */}
                                <div className="space-y-6">
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <h4 className="font-semibold text-blue-800 mb-2">💡 Consejo de selección</h4>
                                        <p className="text-blue-700">
                                            Elige la tienda según el principio: cantidad de personas + 1 lugar libre.
                                        </p>
                                    </div>

                                    <div className="mb-8">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                            Instalación segura
                                        </h3>
                                        <ul className="space-y-3 ml-4">
                                            <li className="flex items-start">
                                                <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                                <span className="text-gray-700">
                                                   Al instalar la tienda, sigue las instrucciones de montaje
                                               </span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                                <span className="text-gray-700">
                                                   Practica el montaje antes de partir de viaje
                                               </span>
                                            </li>
                                            <li className="flex items-start">
                                                <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                                <span className="text-gray-700">
                                                   Elige plataforma plana sin pendiente y objetos afilados
                                               </span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="bg-red-50 p-4 rounded-lg">
                                            <h4 className="font-semibold text-red-800 mb-2">⚠️ Precauciones</h4>
                                            <ul className="text-sm text-red-700 space-y-1">
                                                <li>• No hagas fuego cerca de la tienda</li>
                                                <li>• No instales en elevaciones o bajo árboles solitarios</li>
                                                <li>• No instales en tierras bajas (riesgo de inundación)</li>
                                                <li>• Instala siempre a la sombra</li>
                                            </ul>
                                        </div>
                                        <div className="bg-green-50 p-4 rounded-lg">
                                            <h4 className="font-semibold text-green-800 mb-2">✓ Cuidado</h4>
                                            <ul className="text-sm text-green-700 space-y-1">
                                                <li>• Almacena siempre seca</li>
                                                <li>• Limpia con paño suave y agua jabonosa</li>
                                                <li>• No laves en lavadora</li>
                                                <li>• Repara daños inmediatamente</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Sacos de Dormir Section */}
                    <section className="mb-16">
                        <div className="bg-white rounded-lg p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3">
                                SACOS DE DORMIR
                            </h2>

                            <div className="prose prose-gray max-w-none">
                                <p className="text-gray-700 leading-relaxed mb-6 font-medium">
                                    Para que el saco de dormir alegre y caliente
                                </p>

                                <div className="space-y-6">
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <h4 className="font-semibold text-blue-800 mb-2">📏 Talla correcta</h4>
                                        <p className="text-blue-700">
                                            Elige según el principio: tu altura + 30 cm. Esto asegurará un sueño cómodo.
                                        </p>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="bg-yellow-50 p-4 rounded-lg">
                                            <h4 className="font-semibold text-yellow-800 mb-2">🌡️ Temperatura</h4>
                                            <p className="text-sm text-yellow-700">
                                                Siempre presta atención a la escala de temperatura: ¿es mejor sudar que cubrirse de escarcha?
                                            </p>
                                        </div>
                                        <div className="bg-purple-50 p-4 rounded-lg">
                                            <h4 className="font-semibold text-purple-800 mb-2">📦 Almacenamiento</h4>
                                            <p className="text-sm text-purple-700">
                                                Almacena desplegado. En bolsa el aislamiento se compacta y deja de funcionar.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="font-semibold text-gray-800 mb-2">🧼 Lavado y secado</h4>
                                        <ul className="text-sm text-gray-700 space-y-1">
                                            <li>• Se puede lavar en lavadora sin suavizante</li>
                                            <li>• No secar colgando de los bucles cosidos</li>
                                            <li>• Secar en superficie plana</li>
                                            <li>• Si sudas, cuelga al aire libre para secar</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Esterillas Section */}
                    <section className="mb-16">
                        <div className="bg-white rounded-lg p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3">
                                ESTERILLAS AUTOINFLABLES
                            </h2>

                            <div className="prose prose-gray max-w-none">
                                <p className="text-gray-700 leading-relaxed mb-6">
                                    Cómo manejar correctamente la esterilla autoinflable
                                </p>

                                <div className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="bg-green-50 p-4 rounded-lg">
                                            <h4 className="font-semibold text-green-800 mb-2">✓ Cuidados básicos</h4>
                                            <ul className="text-sm text-green-700 space-y-1">
                                                <li>• Almacenar desplegada con válvula abierta</li>
                                                <li>• Secar después del viaje</li>
                                                <li>• Limpiar con cepillo suave</li>
                                                <li>• Secar a temperatura ambiente</li>
                                            </ul>
                                        </div>
                                        <div className="bg-red-50 p-4 rounded-lg">
                                            <h4 className="font-semibold text-red-800 mb-2">✗ Evitar</h4>
                                            <ul className="text-sm text-red-700 space-y-1">
                                                <li>• No colocar sobre objetos afilados</li>
                                                <li>• No usar en agua</li>
                                                <li>• No exponer al sol o fuego</li>
                                                <li>• No saltar encima</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <h4 className="font-semibold text-blue-800 mb-2">🔧 Reparación rápida</h4>
                                        <ol className="list-decimal list-inside space-y-1 text-sm text-blue-700">
                                            <li>Infla y cierra válvula</li>
                                            <li>Dobla para crear presión</li>
                                            <li>Encuentra daño con espuma jabonosa</li>
                                            <li>Marca y aplica parche del kit</li>
                                        </ol>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Mochilas Section */}
                    <section className="mb-16">
                        <div className="bg-white rounded-lg p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3">
                                MOCHILAS
                            </h2>

                            <div className="prose prose-gray max-w-none">
                                <p className="text-gray-700 leading-relaxed mb-6 font-medium">
                                    Compañero fiel y confiable en cualquier viaje
                                </p>

                                <div className="space-y-6">
                                    <div className="bg-yellow-50 p-4 rounded-lg">
                                        <h4 className="font-semibold text-yellow-800 mb-2">🎒 Selección</h4>
                                        <p className="text-yellow-700">
                                            Elige con sistema de espalda y correas cómodas para ti. El cinturón en caderas redistribuye la carga.
                                        </p>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="font-semibold text-gray-800 mb-3">📦 Empaque correcto (más de 30L)</h4>
                                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                                            <div className="text-center">
                                                <div className="bg-blue-200 p-2 rounded mb-2">
                                                    <span className="font-medium">ABAJO</span>
                                                </div>
                                                <p className="text-gray-600">Saco de dormir y objetos ligeros</p>
                                            </div>
                                            <div className="text-center">
                                                <div className="bg-yellow-200 p-2 rounded mb-2">
                                                    <span className="font-medium">MEDIO</span>
                                                </div>
                                                <p className="text-gray-600">Ropa de peso medio</p>
                                            </div>
                                            <div className="text-center">
                                                <div className="bg-red-200 p-2 rounded mb-2">
                                                    <span className="font-medium">ARRIBA</span>
                                                </div>
                                                <p className="text-gray-600">Equipamiento pesado cerca de la espalda</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-green-50 p-4 rounded-lg">
                                        <h4 className="font-semibold text-green-800 mb-2">✅ Lista de equipaje esencial</h4>
                                        <div className="grid md:grid-cols-2 gap-4 text-sm text-green-700">
                                            <ul className="space-y-1">
                                                <li>• Calzado de viaje</li>
                                                <li>• Ropa interior (varios juegos)</li>
                                                <li>• Camisetas manga larga</li>
                                                <li>• Pantalones convertibles</li>
                                                <li>• Calcetines y crocs</li>
                                            </ul>
                                            <ul className="space-y-1">
                                                <li>• Chaqueta ligera y sudadera</li>
                                                <li>• Protección contra lluvia</li>
                                                <li>• Botiquín y protector solar</li>
                                                <li>• Linterna frontal y navaja</li>
                                                <li>• Termo y vajilla</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Cocina Section */}
                    <section className="mb-16">
                        <div className="bg-white rounded-lg p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3">
                                COCINA DE CAMPAMENTO
                            </h2>

                            <div className="prose prose-gray max-w-none">
                                <div className="space-y-6">
                                    <div className="bg-orange-50 p-4 rounded-lg">
                                        <h4 className="font-semibold text-orange-800 mb-2">🔥 Hornillos</h4>
                                        <p className="text-orange-700 mb-3">
                                            Tu cocina portátil - ahorra tiempo, ocupa poco espacio y funciona incluso bajo lluvia.
                                        </p>
                                        <div className="grid md:grid-cols-3 gap-3 text-sm">
                                            <div className="bg-white p-2 rounded">
                                                <strong>Extremo:</strong> Peso mínimo, resistente
                                            </div>
                                            <div className="bg-white p-2 rounded">
                                                <strong>Trekking:</strong> Compacto para 2-3 personas
                                            </div>
                                            <div className="bg-white p-2 rounded">
                                                <strong>Camping:</strong> Potente para grupos grandes
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <h4 className="font-semibold text-blue-800 mb-2">⛽ Combustibles</h4>
                                            <ul className="text-sm text-blue-700 space-y-1">
                                                <li><strong>Gasolina:</strong> Montañas y frío extremo</li>
                                                <li><strong>Gas:</strong> Uso general, fácil manejo</li>
                                                <li><strong>Alcohol:</strong> Ligero y económico</li>
                                            </ul>
                                        </div>
                                        <div className="bg-purple-50 p-4 rounded-lg">
                                            <h4 className="font-semibold text-purple-800 mb-2">🍽️ Vajilla mínima</h4>
                                            <ul className="text-sm text-purple-700 space-y-1">
                                                <li>• 1 plato con mango por persona</li>
                                                <li>• 1 taza por persona</li>
                                                <li>• 1 olla grande para el grupo</li>
                                                <li>• Acero inoxidable: pesado pero duradero</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Footer */}
                    <div className="bg-white px-8">
                        <div className="mt-12 bg-gradient-to-r from-green-100 to-blue-100 p-6 rounded-lg">
                            <p className="text-gray-800 text-center font-medium text-lg">
                                🏔️ ¡Que tengas viajes agradables! 🏔️
                            </p>
                            <p className="text-gray-600 text-center mt-2">
                                Con la preparación correcta, tu aventura será inolvidable
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TravelerGuidePage;