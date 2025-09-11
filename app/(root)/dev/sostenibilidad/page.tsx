import Image from "next/image";

const SostenibilidadPage = () => {
    return (
        <div className="main-wrapper mt-12 bg-white">
            {/* Header con título */}
            <div className="mx-auto px-6 py-8">


                {/* Placeholder para fotografía */}
                <div className="w-full h-[400px] bg-gray-200 mb-8 relative">
                    <Image
                        src="/service/sostenibilidad-baikal.png"
                        alt="alexika-sostenibilidad-baikal"
                        fill
                        className="object-cover rounded-lg"
                    />
                </div>

                {/* Contenido del texto */}
                <div className="prose prose-lg max-w-4xl mx-auto mb-8">
                    <h1 className="text-xl pl-1 md:text-3xl font-bold text-gray-900 uppercase mb-8 ">
                        Sostenibilidad
                    </h1>
                    <p className="text-lg leading-relaxed text-gray-700 mb-6">
                        En nuestra marca creemos que disfrutar de la naturaleza también significa cuidarla. Por eso, la sostenibilidad es una parte esencial de nuestro trabajo diario y de nuestra visión de futuro.
                    </p>

                    <p className="text-lg leading-relaxed text-gray-700 mb-6">
                        Desde la elección de materiales hasta la forma en que producimos nuestros equipos, buscamos reducir al máximo el impacto ambiental. Utilizamos tejidos y componentes duraderos, reciclables y, siempre que es posible, de origen responsable. Nuestro objetivo es que cada tienda, saco de dormir o esterilla no solo ofrezca comodidad en la montaña, sino también respeto por el entorno.
                    </p>

                    <p className="text-lg leading-relaxed text-gray-700 mb-6">
                        Además, optimizamos nuestros procesos de producción y distribución para minimizar las emisiones y los residuos. Creemos en un consumo consciente: fabricar menos, pero mejor; crear productos que acompañen al viajero durante muchos años, en lugar de fomentar el uso desechable.
                    </p>

                    <p className="text-lg leading-relaxed text-gray-700">
                        La sostenibilidad para nosotros no es una tendencia, sino un compromiso. Queremos que las próximas generaciones puedan seguir explorando montañas, ríos y senderos, tal como lo hacemos hoy. Y sabemos que cada paso que damos hacia un futuro más responsable es también un paso hacia un planeta más limpio.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SostenibilidadPage;